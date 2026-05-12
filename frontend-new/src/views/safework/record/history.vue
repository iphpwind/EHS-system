<template>
  <div class="task">
    <div class="table">
      <div class="header">
        <el-row>
          <el-col :span="12"><div class="card-tit">历史详情</div></el-col>
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
            <el-col :span="5">
              <el-form-item label="排查类型" prop="investigateName">
                <el-input readonly v-model="investigateName"/>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="检查结论" prop="restatus">
                <el-select v-model="queryParams.restatus" placeholder="请选择" clearable filterable>
                  <el-option label="全部" value="" />
                  <el-option label="正常" value="1" />
                  <el-option label="异常" value="2" />
                  <el-option label="未排查" value="3" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3" style="white-space: nowrap;">
              <el-button type="primary" class="search" icon="Search" @click="handleQuery">搜索</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-row :gutter="10" class="mb8 toolist">
        <el-col :span="1.5">
          <el-button
              type="warning"
              plain
              @click="handleExport"
          >导出</el-button>
        </el-col>
      </el-row>

      <el-table border height="calc(100vh - 400px)" v-loading="loading" :data="recordList">
        <el-table-column prop="objectName" label="分析对象" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="unitName" label="分析单元" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="eventName" label="风险事件" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="className" label="风险管控措施分类" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="planName" label="隐患排查计划名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="startDate" label="计划排查时间" :show-overflow-tooltip="true">
          <template #default="scope">
            <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="排查内容" :show-overflow-tooltip="true"></el-table-column>
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
      </el-table>

      <pagination
          v-show="total>0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
      />
    </div>
  </div>
</template>

<script setup name="Content">
import { listRecord, getRecord, delRecord, addRecord, updateRecord } from "@/api/safework/record";
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
const tables = ref([]);
const tableNames = ref([]);
const taskId = proxy.$route.query.taskId;
const planName = proxy.$route.query.planName
const investigateName = proxy.$route.query.investigateName
const router = useRouter();
const recordList = ref([]);

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

/** 查询隐患排查记录列表 */
function getList() {
  loading.value = true;
  listRecord(queryParams.value).then(response => {
    recordList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
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

function goback(){
  // 返回上一页面
  router.go(-1);
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/record/export', {
    ...queryParams.value
  }, `record_${new Date().getTime()}.xlsx`)
}

getList();
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
