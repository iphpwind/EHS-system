<template>
  <div class="beijian">
    <!-- 筛选 -->
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>隐患排查人员完成率</span>
        </div>
      </template>
      <div class="seachform">
        <el-form :inline="true" :model="queryParams" >
          <el-form-item label="排查开始时间">
            <el-date-picker
                v-model="queryParams.beginDate"
                type="date"
                placeholder="选择日期"
                value-format="YYYY-MM-DD"
                clearable
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="排查结束时间">
            <el-date-picker
                v-model="queryParams.endDate"
                type="date"
                placeholder="选择日期"
                value-format="YYYY-MM-DD"
                clearable
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery" class="checkbtn">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
      <el-table
          :data="tableData"
          stripe="true"
          border
          style="width: 100%"
          v-loading="loading"
      >
        <el-table-column prop="planName"  label="任务名称"/>
        <el-table-column prop="cycleUnit"  label="排查周期单位"/>
        <el-table-column prop="workCalendar"  label="工作日历"/>
        <el-table-column prop="investigateName"  label="排查类型" />
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
        <el-table-column prop="yipaicha"  label="计划执行人">
          <template #default="scope">
            <template v-for="(arr,index) in scope.row.userIdArray" :key="arr">
              <template v-for="user in userOptions" :key="user.userId">
                <span v-if="Number(arr) === user.userId">{{user.nickName}}</span>
                <span v-if="Number(arr) === user.userId && index<scope.row.userIdArray.length-1">,</span>
              </template>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="num"  label="异常项目数"/>
        <el-table-column prop="userName"  label="执行人"/>
        <el-table-column prop="updateTime"  label="执行时间"/>
        <el-table-column label="执行状态" align="center" prop="status" >
          <template #default="scope">
            <span v-if="scope.row.status == 0">未执行</span>
            <span v-else-if="scope.row.status == 1">已执行</span>
            <span v-else>停用</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 页码 -->
      <div class="pages">
        <pagination
            background
            v-show="total>0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
        />
      </div>
    </div>
</template>

<script>
import { lvlist } from "@/api/safework/task";
import { listUser } from "@/api/system/user";
export default {
  name: "index",
  data() {
    return {
      tableData:[],
      loading:true,
      total:0,
      userOptions:[],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: this.$route.query.userId,
        beginDate: this.$route.query.beginDate,
        endDate: this.$route.query.endDate
      }
    }
  },

  created() {
    this.getUserList()
    this.getList();
  },

  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      console.log(this.queryParams)
      this.queryParams.pageNum = 1;
      this.getList();
    },

    /** 查询备件台账信息列表 */
    getList() {
      this.loading = true;
      lvlist(this.queryParams).then(response => {
        if(response.total>0){
          for(let row of response.rows){
            if(row.userIds != ""){
              row.userIdArray = row.userId.split(",");
            }
          }
        }
        this.tableData = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询责任人列表 **/
    getUserList(){
      listUser().then(response => {
        this.userOptions = response.rows;
      });
    }
  }

}


</script>

<style scoped lang="scss">
.beijian{
  padding: 10px;
  background: #f3f3f3;
  height: calc(100vh - 84px);
  .box-card{
    .card-header{
      span{
        padding: 0 10px;border-left: 4px solid #09bec5;font-size: 18px;
      }
    }
    .seachform{
      .checkbtn{
        background: #09bec5;padding: 0 25px;border: 0;color: #fff;
      }
    }
  }
  .table{
    padding: 20px;border: 1px solid #eee;background: #fff;
    box-shadow: 0 0 5px #eee;border-radius: 3px;
    height: calc(100% - 160px);position: relative;
    margin: 10px 0 0;

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
