<template>
  <div class="task">
    <div class="table">
      <div class="header">
        <el-row>
          <el-col :span="12"><div class="card-tit">隐患排查记录</div></el-col>
          <el-col :span="12">
            <el-button class="toolbtn" @click="goback">
              <el-icon><Back /></el-icon> 返回
            </el-button>
          </el-col>
        </el-row>
      </div>

      <div class="form">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="130px">
          <el-row>
            <el-col :span="5">
              <el-form-item label="计划名称" prop="planName">
                <el-input readonly
                          v-model="planName"
                          placeholder="请输入计划名称"
                          @keyup.enter="handleQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :span="3" style="white-space: nowrap;">
              <el-button type="primary" class="search" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" class="reset"  @click="resetQuery">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-row :gutter="10" class="mb8 toolist">
        <el-col :span="1.5">
          <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['safework:record:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
              type="danger"
              plain
              icon="Delete"
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['safework:record:remove']"
          >删除</el-button>
        </el-col>
      </el-row>

      <el-table border height="calc(100vh - 400px)" v-loading="loading" :data="recordList" @selection-change="handleSelectionChange">
        <el-table-column prop="objectName" label="分析对象" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="unitName" label="分析单元" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="eventName" label="风险事件" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="className" label="风险管控措施分类" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="content" label="隐患排查内容" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="执行状态" align="center" prop="status" >
          <template #default="scope">
            <span v-if="scope.row.status == 0">未执行</span>
            <span v-else-if="scope.row.status == 1">已执行</span>
            <span v-else>停用</span>
          </template>
        </el-table-column>
        <el-table-column label="排查结果" align="center" prop="result" >
          <template #default="scope">
            <span v-if="scope.row.result == 0">正常</span>
            <span v-else-if="scope.row.result == 1">异常</span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column label="执行人" align="center" prop="nickName" />
        <el-table-column label="执行时间" align="center" prop="implementTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="隐患进程" align="center" prop="hazardProcess" />
        <el-table-column label="操作" align="center" width="260">
          <template #default="scope">
            <el-button style="color: #09bec5;"
                       v-if="scope.row.status==0"
                       type="text"
                       @click="handleDelete(scope.row)"
                       v-hasPermi="['safework:record:remove']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
          v-show="total>0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
      />
    </div>

    <el-dialog title="选择隐患排查内容" v-model="visible" width="900px" top="5vh" append-to-body>
      <el-form :model="eventParams" ref="eventRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="分析对象" prop="objectId">
          <el-select v-model="eventParams.objectId" clearable filterable placeholder="全部" @change="seChange($event)">
            <el-option
                v-for="item in obOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单元" prop="unitId">
          <el-select v-model="eventParams.unitId" clearable filterable placeholder="全部">
            <el-option
                v-for="item in unitOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="fr">
          <el-button icon="Search" @click="getMeList" class="chaxun">搜索</el-button>
          <el-button icon="Refresh" @click="eventresetQuery" >重置</el-button>
        </el-form-item>
      </el-form>
      <el-row>
        <el-table @row-click="clickRow" ref="table" :data="meOptions" @selection-change="handleSelectionChange2"
                  height="260px">
          <el-table-column :selectable="selectable" type="selection" width="55"></el-table-column>
          <el-table-column prop="objectName" label="分析对象" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="unitName" label="分析单元" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="eventName" label="风险事件" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="className" label="风险管控措施分类" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="content" label="隐患排查内容" :show-overflow-tooltip="true"></el-table-column>
        </el-table>
      </el-row>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleUserIds">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Content">
import { listRecord, getRecord, delRecord, addRecord, updateRecord } from "@/api/safework/record";
import { listMeasure } from "@/api/safework/measure";
import { listUnit } from "@/api/safework/unit";
import { listObject } from "@/api/safework/object";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const visible = ref(false);
const meOptions = ref([]);
const tables = ref([]);
const tableNames = ref([]);
const taskId = proxy.$route.query.taskId;
const planName = proxy.$route.query.planName
const router = useRouter();
const recordList = ref([]);

const obOptions = ref([]);
const unitOptions = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    taskId: proxy.$route.query.taskId,
    measureId: null,
    status: null,
    result: null,
    userId: null,
    implementTime: null,
  },
  rules: {
  },
  eventParams: {
    objectId: null,
    unitId: null
  },
});

const { queryParams, form, rules, eventParams } = toRefs(data);

function getObject() {
  listObject({delFlag:0}).then(res => {
    obOptions.value = res.rows;
  })
}
function getUnit() {
  listUnit({delFlag:0,objectId:eventParams.value.objectId}).then(res => {
    unitOptions.value = res.rows
  })
}
function seChange(val) {
  getUnit();
}
function getMeList(){
  console.log(eventParams.value)
  listMeasure(eventParams.value).then(response => {
    meOptions.value = response.rows;
  });
}

/** 单击选择行 */
function clickRow(row) {
  proxy.$refs.table.toggleRowSelection(row);
}

/** 多选框选中数据 */
function handleSelectionChange2(selection) {
  tables.value = selection.map(item => item.id);
}

/** 选择巡检人员确定按钮操作 */
function handleUserIds() {
  const meIds = tables.value.join(",");
  // if (userIds == "") {
  //   proxy.$modal.msgError("请选择巡检人员");
  //   return;
  // }
  form.value.content = meIds;
  form.value.taskId = taskId;

  visible.value = false;

  addRecord(form.value).then(response => {
    proxy.$modal.msgSuccess("新增成功");
    open.value = false;
    getList();
  });

}

/** 查询隐患排查记录列表 */
function getList() {
  loading.value = true;
  listRecord(queryParams.value).then(response => {
    recordList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}
const meIds = computed(() => {
  return recordList.value.map((item) => item.measureId)
})
const selectable = (row, index) => {
  if (meIds.value.includes(row.id)) {
    return false
  }else {
    return true
  }
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    planId: null,
    measureId: null,
    enterpriseCode: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("contentRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

function eventresetQuery() {
  proxy.resetForm("eventRef");
  getMeList();
}

function goback(){
  // 返回上一页面
  router.go(-1);
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  // reset();
  // open.value = true;
  // title.value = "添加隐患排查内容";
  visible.value = true;
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getRecord(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改隐患排查内容";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["contentRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateRecord(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addRecord(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const idss = row.id || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delRecord(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

getList();
getObject();
getUnit();
getMeList();

</script>
<style scoped lang="scss">
.task{
  padding: 10px;background: #f3f3f4;
  height: calc(100vh - 84px);

  .table{
    padding: 10px;border: 1px solid #eee;background: #fff;
    box-shadow: 0 0 5px #eee;border-radius: 5px;
    height: 100%;position: relative;
    .header{
      margin: 0 0 10px;
      padding: 10px 15px;
      border-bottom: 1px solid #f0f0f0;
      .card-tit {
        padding-left: 10px;
        border-left: 5px solid #09bec5;
        font-size: 18px;
      }
      .toolbtn{
        float: right;border: 0;color: #fff;
        border-radius: 20px;
        height: auto;padding: 5px 15px;
        background-image:linear-gradient(to right, #38dfd8, #1dc2bc);
      }
    }

    .form{
      :deep(.el-form-item) {
        margin: 0 15px 10px 0;
        .el-form-item__label{
          white-space: nowrap;
        }
      }
      .search{
        background: #09bec5;border-color: #09bec5;
        padding: 0 10px;
      }
      .reset{
        color: #09bec5;border-color: #09bec5;
        padding: 0 10px;
      }
    }
    .toolist{
      margin: 0 0 10px;display: block;
      :deep(.el-col) {

      }
    }
    .toolist:before,.toolist::after{
      content: '';clear: both;display: table;
    }
    .pagination-container{
      margin: 0;position:relative;
    }
    :deep(.el-pagination.is-background .el-pager li:not(.disabled).active) {
      background: #09bec5;
    }
    .btn{
      height: auto;border: 0;padding: 0;color: #09bec5;
    }
    .btn.green{
      color: #46ba7f;
    }

    :deep(.el-table) {

      .el-table__header-wrapper th{
        text-align: center;background: #09bec5 !important;color: #fff;border: 0;
      }
      .sort-caret.ascending{
        border-bottom-color: #fff !important;
      }
      .sort-caret.descending{
        border-top-color: #fff !important;
      }
      td.el-table__cell{text-align: center;border-color: #d2eef1;}
      .el-table__inner-wrapper::before{
        display: none;
      }
      .el-table__row--striped td.el-table__cell{
        background: #f6fcfc !important;
      }
      .el-table__row:hover  td.el-table__cell{
        background: #f6fcfc !important;
      }
    }
    :deep(.el-table--border::after) {
      display: none;
    }
    :deep(.el-table--border::before) {
      display: none;
    }
    .pages{
      position: absolute;padding-right: 70px;
      right: 20px;bottom: 10px;
      :deep(.el-pagination) {
        padding: 0;
        .el-pager li{
          outline: none;background: transparent;border: 1px solid #ddd;
        }
        .el-pager li.active{
          background: #09bec5;border-color: #09bec5;font-weight: normal;
        }
      }
      .pagebtn{
        position: absolute;right: 0;top: 0;
      }
    }
    .toolbtn{
      float: right;border: 0;color: #333333;
    }
  }
}
</style>
