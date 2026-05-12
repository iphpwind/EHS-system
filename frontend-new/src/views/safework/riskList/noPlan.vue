<template>
  <div class="beijian">
    <!-- 筛选 -->
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>未列计划排查内容</span>
        </div>
      </template>
      <div class="seachform">
        <el-form :inline="true" :model="queryParams" >
          <el-form-item label="分析对象">
            <el-select v-model="queryParams.objectId" clearable filterable placeholder="全部">
              <el-option
                  v-for="item in obOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单元名称">
            <el-input
                v-model="queryParams.unitName"
                placeholder="请输入名称"
                clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getList" class="checkbtn">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="goback" class="checkbtn">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>


    <!--表格-->
    <div class="table">
      <el-table
          :data="tableData"
          stripe="true"
          border
          style="width: 100%"
          v-loading="loading"
      >
        <el-table-column prop="objectName"  label="分析对象"/>
        <el-table-column prop="unitName"  label="单元"/>
        <el-table-column prop="eventName"  label="风险事件" />
        <el-table-column prop="className"  label="管控措施分类" />
        <el-table-column prop="mince"  label="管控措施细分" />
        <el-table-column prop="depict"  label="管控措施描述" />
        <el-table-column prop="content"  label="排查内容" />
        <el-table-column prop="measureCount"  label="排查依据" />
        <el-table-column prop="userNames"  label="责任人" />
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
  </div>
</template>

<script>
import { listMeasure } from "@/api/safework/measure";
import { listObject } from "@/api/safework/object";

export default {
  name: "index",
  data() {
    return {
      dialogVisible: false,
      dialogVisiblerec: false,
      mask: false,
      maskclose: false,
      showClose: false,
      value1: [],
      Options:[],
      spcstockDics:[],
      sprstockDics:[],
      spinfos:[],
      spinfoListc:[],
      spinfoListr:[],
      loading:true,
      total:0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        notPlan: 'true'
      },
      tableData: [],
      obOptions:[]
    }
  },

  created() {
    this.getList();
  },

  mounted() {
    this.getObject();

  },

  methods: {

    getObject() {
      listObject({delFlag:0}).then(res => {
        this.obOptions = res.rows;
      })
    },
    getList() {
      listMeasure(this.queryParams).then(res => {
        this.total = res.total
        this.tableData = res.rows;
        this.loading = false
      })
    },
    goback() {
      this.$router.push({
        path:'/safework/riskList'
      })
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
    .card-con{
      .ico{
        vertical-align: middle;
        padding: 10px 0;
      }
      .title{
        padding: 10px 0;
        line-height: 28px;
        color: #252631;
        i{
          font-style: inherit;
          color: #a1aab7;
        }
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
      .el-tree-select{
        width: 400px;
      }
    }
  }

  /*库存记录*/
  .detailtc{
    :deep(.el-dialog) {
      margin-top: calc(100vh - 84px);
      padding: 10px;
      background: #f3f3f3;
      margin-left: 200px;
      margin-top: 84px !important;
      margin-bottom: 0;margin-right: 0;
      height: calc(100vh - 84px);
      border: 0;border-radius: 0;

      .el-dialog__header{display: none;}
      .el-dialog__body{padding: 0;height: 100%;}
      .table{
        height: calc(100% - 145px);
      }
    }
  }
  .box-card{
    .card-header{
      span{
        padding: 0 10px;border-left: 4px solid #09bec5;font-size: 18px;
      }
      .btn{
        float: right;padding: 6px 15px;border: 0;border-radius: 20px;
        background: url("@/assets/images/xunjian/btn-bg.jpg") repeat-y;
        background-size: 100%;color: #fff;
        height: auto;
      }
    }
    .seachform{
      .checkbtn{
        background: #09bec5;padding: 0 25px;border: 0;color: #fff;
      }

    }
  }
  .record-con{
    padding: 20px;
    border: 1px solid #eee;
    background: #fff;
    box-shadow: 0 0 5px #eee;
    border-radius: 3px;
    height: calc(100% - 210px);
    position: relative;
    margin: 10px 0 0;
    .record-con-top{
      display: flex;
      margin-bottom: 20px;
      .demonstration{
        margin-right: 10px;
        line-height: 32px;
      }
      .checkbtn{
        background: #09bec5;padding: 0 25px;border: 0;color: #fff;margin-left: 10px;
      }
    }
    .record-con-li{

    }

  }
}
</style>
