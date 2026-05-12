<template>
  <div class="task">
    <div class="table">
      <div class="header">
        <el-row>
          <el-col :span="12"><div class="card-tit">历史</div></el-col>
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
              <el-form-item label="计划名称" prop="planId">
                <el-input readonly
                          v-model="queryParams.planName"
                          placeholder="请输入计划名称"
                          @keyup.enter="handleQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="排查类型" prop="investigateTypeId">
                <el-select v-model="queryParams.investigateTypeId" placeholder="请选择" clearable filterable>
                  <el-option
                      v-for="item in typeeOptions"
                      :key="item.id"
                      :label="item.investigateName"
                      :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="执行状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="请选择" clearable filterable>
                  <el-option label="未执行" value="0" />
                  <el-option label="已执行" value="1" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="开始日期" prop="beginDate">
                <el-date-picker clearable
                                v-model="queryParams.beginDate"
                                type="date"
                                value-format="YYYY-MM-DD"
                                placeholder="请选择开始日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="结束日期" prop="endDate">
                <el-date-picker clearable
                                v-model="queryParams.endDate"
                                type="date"
                                value-format="YYYY-MM-DD"
                                placeholder="请选择结束日期">
                </el-date-picker>
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
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table border height="calc(100vh - 400px)" v-loading="loading" :data="taskList">
        <el-table-column label="排查类型" align="center" prop="investigateName" />
        <el-table-column label="排查周期单位" align="center" prop="cycleUnit" />
        <el-table-column label="工作日历" align="center" prop="workCalendar" />
        <el-table-column label="计划排查日期" align="center" prop="startDate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="计划排查时间" align="center" prop="startTime" >
          <template #default="scope">
            <span>{{ scope.row.startTime +':00 -'+ scope.row.endTime + ':00'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="责任人" align="center" prop="userId" >
          <template #default="scope">
            <template v-for="(arr,index) in scope.row.userIdArray" :key="arr">
              <template v-for="user in userOptions" :key="user.userId">
                <span v-if="Number(arr) === user.userId">{{user.nickName}}</span>
                <span v-if="Number(arr) === user.userId && index<scope.row.userIdArray.length-1">,</span>
              </template>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="排查项目数" align="center" prop="countNum" />
        <el-table-column label="异常项目数" align="center" prop="num" />
        <el-table-column label="执行人" align="center" prop="userName" />
        <el-table-column label="执行时间" align="center" prop="updateTime" >
          <template #default="scope">
            <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="执行状态" align="center" prop="status" >
          <template #default="scope">
            <span v-if="scope.row.status == 0">未执行</span>
            <span v-else-if="scope.row.status == 1">已执行</span>
            <span v-else>停用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="260">
          <template #default="scope">
            <el-button style="color: #09bec5;"
                       type="text"
                       @click="handleDetail(scope.row)"
            >详情</el-button>
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
  </div>
</template>

<script setup name="Task">
import { listTask, getTask, delTask, addTask, updateTask } from "@/api/safework/task";
import { listInvestigate} from "@/api/safework/investigate";
import { listUser } from "@/api/system/user";
import {treeselect} from "@/api/system/dept";
import {h} from "vue";
const { proxy } = getCurrentInstance();

const taskList = ref([]);
const open = ref(false);
const dateopen = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const userOptions = ref([]);
const visible = ref(false);
const tables = ref([]);
const tableNames = ref([]);
const deptOptions = ref(undefined);
const typeeOptions = ref(undefined);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);
queryParams.value.planId = proxy.$route.query.planId;
queryParams.value.planName = proxy.$route.query.planName;

//获取排查类型
function getType(){
  listInvestigate({delFlag:0}).then(response => {
    typeeOptions.value = response.rows;
  });
}

/** 查询隐患排查任务列表 */
function getList() {
  loading.value = true;
  listTask(queryParams.value).then(response => {
    if(response.total>0){
      for(let row of response.rows){
        if(row.userIds != ""){
          row.userIdArray = row.userId.split(",");
        }
      }
    }
    taskList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}


function goback(){
  proxy.$router.back()
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

function handleDetail(row) {
  proxy.$router.push({
    path: '/safework/hisrecord',
    query:{
      taskId:row.id,
      planName:row.planName,
      investigateName:row.investigateName
    }
  })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/task/export', {
    ...queryParams.value
  }, `task_${new Date().getTime()}.xlsx`)
}
/** 查询责任人列表 **/
function getUserList(){
  listUser().then(response => {
    userOptions.value = response.rows;
  });
}



getList();
getUserList();
getType();
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
