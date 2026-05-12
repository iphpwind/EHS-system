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
        <el-table-column prop="deptName"  label="部门"/>
        <el-table-column prop="userName"  label="人员姓名"/>
        <el-table-column prop="zong"  label="可排查任务数">
          <template #default="scope" >
            <span @click="godetail(scope.row)" style="color: #3681c2;cursor: pointer">{{ scope.row.zong}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="yipaicha"  label="已排查任务数" />
        <el-table-column prop="yipaicha"  label="排查完成率">
          <template #default="scope" >
            <span>{{ ((scope.row.yipaicha/scope.row.zong)*100).toFixed(2)}}%</span>
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
import { listComTask,listTask } from "@/api/safework/task";

export default {
  name: "index",
  data() {
    return {
      tableData:[],
      loading:true,
      total:0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        beginDate: null,
        endDate: null
      }
    }
  },

  created() {
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
      listComTask(this.queryParams).then(response => {
        this.tableData = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    //详情
    godetail(row){
      // this.queryParams.userId = row.userId
      // listTask(this.queryParams).then(res => {
      //
      // })
      this.$router.push({
        path: '/safework/compInfoList',
        query:{
          userId:row.userId,
          beginDate: this.queryParams.beginDate,
          endDate: this.queryParams.endDate
        }
      })


    },

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
