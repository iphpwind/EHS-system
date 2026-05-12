<template>
  <div class="faulttype">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设备类型" prop="classId">
        <el-select v-model="queryParams.classId" placeholder="请选择"  clearable>
          <el-option
              v-for="item in classOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="故障类型" prop="fault">
        <el-input
          v-model="queryParams.fault"
          placeholder="请输入故障类型"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery" class="checkbtn">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table">
      <div class="nav">
        <el-button
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['unitManage:faulttype:add']"
        >新增</el-button>
<!--        <el-button
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['unitManage:faulttype:edit']"
        >修改</el-button>
        <el-button
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['unitManage:faulttype:remove']"
        >删除</el-button>-->
        <el-button
            icon="Download"
            @click="handleExport"
            v-hasPermi="['unitManage:faulttype:export']"
        >导出</el-button>
      </div>



    <el-table v-loading="loading" :data="faulttypeList" @selection-change="handleSelectionChange"
              stripe="true"
              border
              style="width: 100%">
<!--      <el-table-column type="selection" width="55" align="center" />-->
<!--      <el-table-column label="id" align="center" prop="id" />-->
      <el-table-column label="设备分类" align="center" prop="className" />
      <el-table-column label="故障类型" align="center" prop="fault" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-tooltip
              class="box-item"
              effect="light"
              content="修改"
              placement="top"
          >
            <el-button
                class="operation"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['unitManage:faulttype:edit']"
            >
              <el-icon :size="20"><Edit /></el-icon>
            </el-button>
          </el-tooltip>
          <el-tooltip
              class="box-item"
              effect="light"
              content="删除"
              placement="top"
          >
            <el-button
                class="operation"
                @click="handleDelete(scope.row)"
                v-hasPermi="['unitManage:faulttype:remove']"
            ><el-icon :size="20" ><Delete /></el-icon></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
      <div class="pages">
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
    </div>
    <!-- 添加或修改故障类型字典对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="faulttypeRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备类型" prop="classId">
          <el-select v-model="form.classId" clearable filterable placeholder="请选择">
            <el-option
                v-for="item in classOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="设备分类id" prop="classId">-->
<!--          <el-input v-model="form.classId" placeholder="请输入设备分类id" />-->
<!--        </el-form-item>-->
        <el-form-item label="设备故障" prop="fault">
          <el-input v-model="form.fault" placeholder="请输入设备故障" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
  </div>
</template>

<script setup name="Faulttype">
import { listFaulttype, getFaulttype, delFaulttype, addFaulttype, updateFaulttype,listEqClass } from "@/api/unitManage/faulttype";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const faulttypeList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const classOptions = ref(undefined);
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    classId: null,
    fault: null
  },
  rules: {
    classId: [
      { required: true, message: '请选择设备类型', trigger: 'blur' },
    ],
    fault: [
      { required: true, message: '请输入设备故障', trigger: 'blur' },
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

function getClass() {
  listEqClass().then(res => {
    classOptions.value = res.data;
  })
}

/** 查询故障类型字典列表 */
function getList() {
  loading.value = true;
  listFaulttype(queryParams.value).then(response => {
    faulttypeList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
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
    classId: null,
    fault: null
  };
  proxy.resetForm("faulttypeRef");
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

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加故障类型字典";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getFaulttype(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改故障类型字典";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["faulttypeRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateFaulttype(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addFaulttype(form.value).then(response => {
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
    return delFaulttype(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('unitManage/faulttype/export', {
    ...queryParams.value
  }, `faulttype_${new Date().getTime()}.xlsx`)
}

getList();
getClass();
</script>
<style scoped lang="scss">
.toolsline{
  height: 30px;
}
.faulttype{
  .checkbtn {
    background: #09bec5;
    padding: 0 25px;
    border: 0;
    color: #fff;
  }
  .table{
    height: calc(100vh - 270px);

    .handlebtn{
      height: auto;border: 0;padding: 0;color: #09bec5;
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
    .operation{
      padding: 0;
      border: none;
      background: transparent;
      --el-button-hover-text-color:#37c4cb;
    }
    .nav{
      text-align: right;
      margin-bottom: 10px;
    }
    .addtanchu{
      :deep(.el-dialog) {
        overflow: hidden;
        .el-dialog__header{
          box-shadow: 0 5px 10px #eee;
        }
      }
      .el-form {
        .el-select{
          width: 100%;
        }
      }
      .dialog-footer{
        display: block;width: 100%;text-align: center;margin-top: -20px;
        padding: 0 0 20px;
        .btn{
          width: 200px;
        }
        .green{background: #09bec5;color: #fff;border-color: #09bec5;}
      }
    }
  }
}

</style>
