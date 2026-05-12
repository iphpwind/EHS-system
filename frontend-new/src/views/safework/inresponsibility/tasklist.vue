<template>
  <div class="task">
    <div class="table">
      <div class="form">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="130px">
          <el-row>
            <el-col :span="5">
              <el-form-item label="计划名称" prop="planId">
                <el-input readonly
                          v-model="planName"
                          placeholder="请输入计划名称"
                          @keyup.enter="handleQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :span="3" style="white-space: nowrap;">
              <el-button type="primary" class="search" icon="Search" @click="handleQuery">搜索</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <el-table border height="calc(100vh - 400px)" v-loading="loading" :data="contentList">
        <el-table-column prop="objectName" label="分析对象" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="unitName" label="分析单元" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="eventName" label="风险事件" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="排查人员" align="center" prop="userId" >
          <template #default="scope">
            <template v-for="(arr,index) in scope.row.userIdArray" :key="arr">
              <template v-for="user in userOptions" :key="user.userId">
                <span v-if="Number(arr) === user.userId">{{user.nickName}}</span>
                <span v-if="Number(arr) === user.userId && index<scope.row.userIdArray.length-1">,</span>
              </template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="investigateCycle" label="排查周期" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="taskType" label="任务类型" :show-overflow-tooltip="true">
          <template #default="scope">
            <span v-if="scope.row.taskType == 0">日常任务</span>
            <span v-if="scope.row.taskType == 1">主要负责人任务</span>
            <span v-if="scope.row.taskType == 2">技术负责人任务</span>
            <span v-if="scope.row.taskType == 3">操作负责人任务</span>
          </template>
        </el-table-column>
        <el-table-column prop="termContent" label="任务项" :show-overflow-tooltip="true"></el-table-column>
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
import { listContent, listByObjectAndPlan } from "@/api/safework/content";
import { listUser } from "@/api/system/user";

const { proxy } = getCurrentInstance();

const contentList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const userOptions = ref([]);
const total = ref(0);
const title = ref("");
const planId = proxy.$route.query.planId;
const planName = proxy.$route.query.planName
const router = useRouter();

const obOptions = ref([]);
const unitOptions = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    planId: proxy.$route.query.planId,
    enterpriseCode: null,
  },
  rules: {
  },
  eventParams: {
    objectId: null,
    unitId: null
  },

});

const { queryParams, form, rules, eventParams } = toRefs(data);


/** 查询隐患排查内容列表 */
function getList() {
  loading.value = true;
  listByObjectAndPlan(queryParams.value).then(response => {
    if(response.total>0){
      for(let row of response.rows){
        if(row.userIds != ""){
          row.userIdArray = row.userIds.split(",");
        }
      }
    }
    contentList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 查询责任人列表 **/
function getUserList(){
  listUser().then(response => {
    userOptions.value = response.rows;
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

getList();
getUserList();

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
