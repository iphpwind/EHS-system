<template>
  <div class="yirenyidang">
    <!-- 筛选 -->
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>一人一档</span>
        </div>
      </template>
      <div class="seachform">
        <el-form :inline="true" :model="queryParams" >
          <el-form-item label="部门">
               <tree-select
                  v-model:value="queryParams.deptId"
                  :options="deptOptions"
                  placeholder="请选择归属公司"
                  :objMap="{ value: 'id', label: 'label', children: 'children' }"
              />
          </el-form-item>
          <el-form-item label="岗位" prop="postId">
            <el-select v-model="queryParams.postId" clearable filterable placeholder="请选择">
              <el-option
                  v-for="item in postOption"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账号">
            <el-input v-model="queryParams.userName" clearable placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="工号">
            <el-input v-model="queryParams.staffNo" clearable placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="queryParams.staffName" clearable placeholder="请输入"></el-input>
          </el-form-item> 
          <el-form-item style="margin-right: 0">
            <el-button type="primary" @click="handleQuery" class="checkbtn">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!--表格-->
    <div class="table">
      <el-table
          :data="tableData"
          style="width: 100%">
        <el-table-column
            prop="deptName"
            label="所属部门"
            sortable>
        </el-table-column>
        <el-table-column
            prop="postNames"
            sortable
            label="岗位">
        </el-table-column>
        <el-table-column
            prop="userName"
            sortable
            label="账号">
        </el-table-column>
        <el-table-column
            prop="staffNo"
            sortable
            label="工号">
        </el-table-column>
        <el-table-column
            prop="staffName"
            sortable
            label="姓名">
        </el-table-column>
        <el-table-column
            prop="sex"
            sortable
            label="性别">
            <template #default="scope">
              <dict-tag :options="sys_user_sex" :value="scope.row.sex"/>
            </template>
        </el-table-column>
        <el-table-column
            prop="phonenumber"
            sortable
            label="手机">
        </el-table-column>
        <!-- <el-table-column
            prop="role"
            sortable
            label="角色">
        </el-table-column> -->
        <el-table-column
          prop="certificateNum"
          sortable
          label="证书数量">
      </el-table-column>


        <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            <span v-if="scope.row.delFlag == 0">正常</span>
            <span v-if="scope.row.delFlag == 2">停用</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" >
          <template #default="scope">
            <el-button
                type="text"
                @click="handleClick(scope.row)"
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
			background
				:total="total"
				v-model:page="queryParams.pageNum"
				v-model:limit="queryParams.pageSize"
				@pagination="getPersonDataList"
				ref="page"
			/>
    </div>




  </div>
</template>

<script setup="personProfile" >
import {treeselect} from "@/api/system/dept";
import {listPost} from "@/api/system/post";
import {list} from "@/api/safework/personProfile";
const { proxy } = getCurrentInstance();
const { sys_user_sex } = proxy.useDict('sys_user_sex');

const data = reactive({
    tableData: [{
    
    }],
    queryParams:{
      pageNum: 1,
      pageSize: 10,
      deptId:'',
      postId:'',
      userName:'',
      staffNo:'',
      staffName:'',
    },
    deptId:'',
    deptOptions:[],
    postOption:[],
    total:0,
})
const {queryParams, tableData, deptId,deptOptions,postOption,total} = toRefs(data);
 
function handleClick(row) {
  proxy.$router.push({
    path: '/allpervasive/baseinfo/oneFileshow',
    query:{
      staffId:row.staffId,
      userId:row.userId,
    }
  })
}
function getPersonDataList(){
  list(queryParams.value).then(response =>{
    tableData.value = response.rows;
    total.value = response.total;
  })
}
/** 初始化部门数据 */
function initTreeData() {
  treeselect().then(response => {
    deptOptions.value = response.data;
  });
}
function getPost() {
  listPost().then(response => {
    postOption.value = response.rows;
  });
}
function handleQuery(){
  getPersonDataList();
}
  
 

initTreeData();
getPost();
getPersonDataList();
</script>

<style scoped lang="scss">
.yirenyidang{
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
