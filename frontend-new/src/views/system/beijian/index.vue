<template>
  <div class="beijian">
    <!-- 筛选 -->
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>备件清单</span>
        </div>
      </template>
      <div class="seachform">
        <el-form :inline="true" :model="formInline" >
          <el-form-item label="类型">
            <el-select v-model="formInline.facility" placeholder="设备">
              <el-option label="设备一" value="shebeiyi"></el-option>
              <el-option label="设备二" value="shebeier"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="编号">
            <el-input v-model="formInline.number" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="备件名称">
            <el-input v-model="formInline.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" class="checkbtn">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>


    <!--表格-->
    <div class="table">
      <div class="nav">
        <el-button  @click="add"><el-icon :size="16" ><Plus /></el-icon>新增</el-button>
        <el-button  @click="modify"><el-icon :size="16" ><Edit /></el-icon>修改</el-button>
        <el-button><el-icon :size="16" ><Delete /></el-icon>删除</el-button>
        <el-button><el-icon :size="16" ><DocumentDelete /></el-icon>批量删除</el-button>
        <el-button><el-icon :size="16" ><DocumentCopy /></el-icon>模板下载</el-button>
        <el-button><el-icon :size="16" ><FolderAdd /></el-icon>批量导入</el-button>
      </div>

      <!--新增弹出-->
      <div class="addtanchu">
        <el-dialog
            title="新增"
            v-model="dialogVisible"
            width="40%">

          <el-form ref="addform" :model="addform" :rules="rules" label-width="100px" :label-position="labelPosition">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="类型" prop="addtype">
                  <el-select v-model="addform.addtype" placeholder="默认">
                    <el-option label="类型一" value=""></el-option>
                    <el-option label="类型二" value=""></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="编号" prop="addnumber">
                  <el-input v-model="addform.addnumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备名称" prop="addname">
                  <el-input v-model="addform.addname"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="型号" >
                  <el-input v-model="addform.addmodel"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="规格" >
                  <el-input v-model="addform.addspecification"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="供应商" >
                  <el-input v-model="addform.addsupplier"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单位" prop="addunit">
                  <el-input v-model="addform.addunit"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="安全库存" prop="addinventory">
                  <el-input v-model="addform.addinventory"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" >
                  <el-input type="textarea" v-model="addform.addnote"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <template #footer>
          <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" class="btn">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false" class="btn green">确 定</el-button>
        </span>
          </template>
        </el-dialog>
      </div>


      <!--修改弹出-->
      <div class="addtanchu">
        <el-dialog
            title="修改"
            v-model="modifydialogVisible"
            width="40%">

          <el-form ref="modifyform" :model="modifyform" :rules="rules" label-width="100px" :label-position="labelPosition">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="类型" prop="modifytype">
                  <el-select v-model="modifyform.modifytype" placeholder="默认">
                    <el-option label="类型一" value=""></el-option>
                    <el-option label="类型二" value=""></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="编号" prop="modifynumber">
                  <el-input v-model="modifyform.modifynumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备名称" prop="modifyname">
                  <el-input v-model="modifyform.modifyname"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="型号" >
                  <el-input v-model="modifyform.modifymodel"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="规格" >
                  <el-input v-model="modifyform.modifyspecification"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="供应商" >
                  <el-input v-model="modifyform.modifysupplier"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单位" prop="modifyunit">
                  <el-input v-model="modifyform.modifyunit"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="安全库存" prop="modifyinventory">
                  <el-input v-model="modifyform.modifyinventory"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" >
                  <el-input type="textarea" v-model="modifyform.modifynote"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <template #footer>
          <span slot="footer" class="dialog-footer">
          <el-button @click="modifydialogVisible = false" class="btn">取 消</el-button>
          <el-button type="primary" @click="modifydialogVisible = false" class="btn green">确 定</el-button>
        </span>
          </template>
        </el-dialog>
      </div>



      <el-table
          :data="tableData"
          stripe="true"
          border
          style="width: 100%"
          v-loading="loading"
      >
        <el-table-column prop="typename"  label="类型"/>
        <el-table-column prop="digital"  label="编号"/>
        <el-table-column prop="bjname"  label="备件名称" />
        <el-table-column prop="specification"  label="规格" />
        <el-table-column prop="model"  label="型号" />
        <el-table-column prop="suppliers"  label="供应商" />
        <el-table-column prop="unit"  label="单位" />
        <el-table-column prop="inventory"  label="安全库存" />
        <el-table-column label="操作" width="200" fixed="right" >
           <template #default="scope" >

             <el-tooltip

                 effect="light"
                 content="查询"
                 placement="top"
             >
               <el-button class="operation"><el-icon :size="20" ><Document /></el-icon></el-button>
             </el-tooltip>

             <el-tooltip
                 class="box-item"
                 effect="light"
                 content="编辑"
                 placement="top"
             >
               <el-button class="operation"><el-icon :size="20" ><Edit /></el-icon></el-button>
             </el-tooltip>

             <el-tooltip
                 class="box-item"
                 effect="light"
                 content="删除"
                 placement="top"
                 @click="onSubmit"
             >
               <el-button class="operation"><el-icon :size="20" ><Delete /></el-icon></el-button>
             </el-tooltip>

            </template>
        </el-table-column>
      </el-table>

      <!-- 页码 -->
      <div class="pages">
        <el-pagination
            background
            :total="10"
            ref="page"
        />
        <el-button @click="confirm" class="pagebtn">确定</el-button>
      </div>
    </div>







  </div>
</template>

<script>


export default {
  name: "index",
  data() {
    return {
      dialogVisible: false,
      modifydialogVisible: false,
      formInline: {
        number: '',
        name:'',
        facility: '',
        total: 0,
      },
      labelPosition: 'top',
      addform:{
        addtype:'',
        addnumber:'',
        addname:'',
        addmodel:'',
        addspecification:'',
        addsupplier:'',
        addunit:'',
        addinventory:'',
        addnote:'',
      },
      modifyform:{
        modifytype:'',
        modifynumber:'',
        modifyname:'',
        modifymodel:'',
        modifyspecification:'',
        modifysupplier:'',
        modifyunit:'',
        modifyinventory:'',
        modifynote:'',
      },
      rules: {
        addtype: [
          { required: true, message: '请输入类型', trigger: 'blur' },
        ],
        addnumber: [
          { required: true, message: '请输入编号', trigger: 'blur' },
        ],
        addname: [
          { required: true, message: '请输入备件名称', trigger: 'blur' },
        ],
        addunit: [
          { required: true, message: '请输入单位', trigger: 'blur' },
        ],
        addinventory: [
          { required: true, message: '请输入安全库存', trigger: 'blur' },
        ],


        modifytype: [
          { required: true, message: '请输入类型', trigger: 'blur' },
        ],
        modifynumber: [
          { required: true, message: '请输入编号', trigger: 'blur' },
        ],
        modifyname: [
          { required: true, message: '请输入备件名称', trigger: 'blur' },
        ],
        modifyunit: [
          { required: true, message: '请输入单位', trigger: 'blur' },
        ],
        modifyinventory: [
          { required: true, message: '请输入安全库存', trigger: 'blur' },
        ],
      },
      tableData: [{
        typename: '电力',
        digital: '0060011',
        bjname: '圈圈123',
        specification: 'EBSAWEW',
        model: '001',
        suppliers: '新科技物联网有限公司',
        unit: '个',
        inventory: '209211231',
      }, {
        typename: '电力',
        digital: '0060011',
        bjname: '圈圈123',
        specification: 'EBSAWEW',
        model: '001',
        suppliers: '新科技物联网有限公司',
        unit: '个',
        inventory: '209211231',
      },{
        typename: '电力',
        digital: '0060011',
        bjname: '圈圈123',
        specification: 'EBSAWEW',
        model: '001',
        suppliers: '新科技物联网有限公司',
        unit: '个',
        inventory: '209211231',
      },{
        typename: '电力',
        digital: '0060011',
        bjname: '圈圈123',
        specification: 'EBSAWEW',
        model: '001',
        suppliers: '新科技物联网有限公司',
        unit: '个',
        inventory: '209211231',
      }]
    }
  },
  methods: {
    onSubmit() {

    },
    add() {
      //this.reset();
      this.dialogVisible = true;
    },
    modify() {
      //this.reset();
      this.modifydialogVisible = true;
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
