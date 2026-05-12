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
        <el-form :inline="true" :model="queryParams" >
          <el-form-item label="类型">
            <el-select v-model="queryParams.sptypeDictId" placeholder="请选择类型" clearable>
              <el-option
                  v-for="item in Options"
                  :key="item.sptypeDictId"
                  :label="item.sptypeName"
                  :value="item.sptypeDictId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="编号">
            <el-input v-model="queryParams.spNo" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="备件名称">
            <el-input v-model="queryParams.spName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery" class="checkbtn">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>


    <!--表格-->
    <div class="table">
      <div class="nav">
        <el-button  @click="add"><el-icon :size="16" ><Plus /></el-icon>新增</el-button>
        <el-button @click="moduledown"><el-icon :size="16" ><DocumentCopy /></el-icon>模板下载</el-button>
        <el-button @click="moreexport"><el-icon :size="16" ><FolderAdd /></el-icon>批量导入</el-button>
      </div>

      <!--      备件数据批量导入-->
      <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
        <el-upload
            ref="uploadRef"
            :limit="1"
            accept=".xlsx, .xls"
            :headers="upload.headers"
            :action="upload.url + '?updateSupport=' + upload.updateSupport"
            :disabled="upload.isUploading"
            :on-progress="handleFileUploadProgress"
            :on-success="handleFileSuccess"
            :auto-upload="false"
            drag
        >
          <el-icon class="el-icon--upload">
            <upload-filled/>
          </el-icon>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip text-center">
              <div class="el-upload__tip">
                <el-checkbox v-model="upload.updateSupport"/>
                是否更新已经存在的备件数据
              </div>
              <span>仅允许导入xls、xlsx格式文件。</span>
            </div>
          </template>
        </el-upload>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="submitFileForm">确 定</el-button>
            <el-button @click="upload.open = false">取 消</el-button>
          </div>
        </template>
      </el-dialog>

      <!--新增/编辑弹出-->
      <div class="addtanchu">
        <el-dialog
            title="新增"
            v-model="dialogVisible"
            width="40%">

          <el-form ref="spInfoRef" :model="form" :rules="rules" label-width="100px" :label-position="labelPosition">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="类型" prop="sptypeDictId">
                  <el-select v-model="form.sptypeDictId" placeholder="默认" clearable>
                    <el-option
                        v-for="item in Options"
                        :key="item.sptypeDictId"
                        :label="item.sptypeName"
                        :value="item.sptypeDictId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="编号" prop="spNo">
                  <el-input v-model="form.spNo" v-if="form.spId!=null && form.spId!=''" readonly></el-input>
                  <el-input v-model="form.spNo" v-if="form.spId==null || form.spId==''"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备件名称" prop="spName">
                  <el-input v-model="form.spName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="型号" >
                  <el-input v-model="form.spType"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="规格" >
                  <el-input v-model="form.spSpe"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="供应商" >
                  <el-input v-model="form.supName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单位" prop="spunitDictId">
                  <el-select v-model="form.spunitDictId" placeholder="单位" clearable>
                    <el-option
                        v-for="item in unitOptions"
                        :key="item.spunitDictId"
                        :label="item.spunitName"
                        :value="item.spunitDictId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="安全库存" prop="safetyStock">
                  <el-input v-model="form.safetyStock"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" >
                  <el-input type="textarea" v-model="form.rem"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <template #footer>
          <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false" class="btn">取 消</el-button>
          <el-button type="primary" @click="submitForm" class="btn green">确 定</el-button>
        </span>
          </template>
        </el-dialog>
      </div>

      <div class="addtanchu">
        <el-dialog
            title="详情"
            v-model="modifydialogVisible"
            width="40%">

          <el-form ref="modifyform" :model="modifyform" :rules="rules" label-width="100px" :label-position="labelPosition">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="类型">
                  <el-input v-model="modifyform.sptypeName" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="编号">
                  <el-input v-model="modifyform.spNo" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备名称">
                  <el-input v-model="modifyform.spName" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="型号" >
                  <el-input v-model="modifyform.spType" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="规格" >
                  <el-input v-model="modifyform.spSpe" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="供应商" >
                  <el-input v-model="modifyform.supName" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="单位">
                  <el-input v-model="modifyform.spunitName" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="安全库存">
                  <el-input v-model="modifyform.safetyStock" readonly></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" >
                  <el-input type="textarea" v-model="modifyform.rem" readonly></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-dialog>
      </div>


      <el-table
          :data="tableData"
          stripe="true"
          border
          height="calc(100vh - 420px)"
          v-loading="loading"
      >
        <el-table-column prop="sptypeName"  label="类型"/>
        <el-table-column prop="spNo"  label="编号"/>
        <el-table-column prop="spName"  label="备件名称" />
        <el-table-column prop="spSpe"  label="规格" />
        <el-table-column prop="spType"  label="型号" />
        <el-table-column prop="supName"  label="供应商" />
        <el-table-column prop="spunitName"  label="单位" />
        <el-table-column prop="safetyStock"  label="安全库存" />
        <el-table-column label="操作" width="200" fixed="right" >
          <template #default="scope" >

            <el-tooltip

                effect="light"
                content="查询"
                placement="top"
            >
              <el-button class="operation" @click="handleDetail(scope.row)"><el-icon :size="20" ><Document /></el-icon></el-button>
            </el-tooltip>

            <el-tooltip
                class="box-item"
                effect="light"
                content="编辑"
                placement="top"
            >
              <el-button class="operation" @click="handleUpdate(scope.row)"><el-icon :size="20" ><Edit /></el-icon></el-button>
            </el-tooltip>

            <el-tooltip
                class="box-item"
                effect="light"
                content="删除"
                placement="top"
            >
              <el-button class="operation" @click="handleDelete(scope.row)"><el-icon :size="20" ><Delete /></el-icon></el-button>
            </el-tooltip>

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

  </div>
</template>

<script>
import { listSpInfo, getSpInfo, delSpInfo, addSpInfo, updateSpInfo } from "@/api/equipment/spInfo";
import { listSptypeDic } from "@/api/equipment/sptypeDic";
import { listSpunitDic } from "@/api/equipment/spunitDic";
import {getToken} from "@/utils/auth";

export default {
  name: "index",
  data() {
    return {
      dialogVisible: false,
      modifydialogVisible: false,
      unitOptions:[],
      Options:[],
      loading:true,
      total:0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        spName: null,
        sptypeDictId: null,
        spNo:null,
        delFlag:0,
        status:0
      },
      upload:{
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的备件数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: {Authorization: "Bearer " + getToken()},
        // 上传的地址
        url: import.meta.env.VITE_APP_BASE_API + "/equipment/spInfo/importData"
      },
      labelPosition: 'top',
      form:{
        spNo:'',
        spName:'',
        spType:'',
        spSpe:'',
        supName:'',
        safetyStock:'',
        rem:'',
        spunitDictId:'',
        sptypeDictId:'',
        delFlag:0
      },
      modifyform:{
        spNo:'',
        spName:'',
        spType:'',
        spSpe:'',
        supName:'',
        safetyStock:'',
        rem:'',
        spunitDictId:'',
        sptypeDictId:'',
        delFlag:0
      },
      rules: {
        sptypeDictId: [
          { required: true, message: '请输入类型', trigger: 'blur' },
        ],
        spNo: [
          { required: true, message: '请输入编号', trigger: 'blur' },
        ],
        spName: [
          { required: true, message: '请输入备件名称', trigger: 'blur' },
        ],
        spunitDictId: [
          { required: true, message: '请输入单位', trigger: 'blur' },
        ],
        safetyStock: [
          { required: true, message: '请输入安全库存', trigger: 'blur' },
        ],
      },
      tableData: [],
      title:''
    }
  },

  created() {
    this.getList();
    this.getsptype();
    this.getspunit();
  },

  methods: {
    onSubmit() {

    },

  /** 搜索按钮操作 */
  handleQuery() {
    this.queryParams.pageNum = 1;
    this.getList();
  },

  /** 查询备件台账信息列表 */
  getList() {
    this.loading = true;
    listSpInfo(this.queryParams).then(response => {
      this.tableData = response.rows;
      this.total = response.total;
      this.loading = false;
    });
  },

    /** 查询备件类型列表 */
    getsptype() {
      listSptypeDic(this.queryParams).then(response => {
        this.Options = response.rows;
      });
    },

    /** 查询备件单位列表 */
    getspunit() {
      listSpunitDic(this.queryParams).then(response => {
        this.unitOptions = response.rows;
      });
    },

    add() {
      this.reset();
      this.dialogVisible = true;
      this.title = "添加备件台账信息";
    },

    //详情
    handleDetail(row){
      this.reset();
      const spId = row.spId || this.ids
      getSpInfo(spId).then(response => {
        this.modifyform = response.data;
        this.modifydialogVisible = true;
        this.title = "备件台账详情";
      });
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const spId = row.spId || this.ids
      getSpInfo(spId).then(response => {
        this.form = response.data;
        this.dialogVisible = true;
        this.title = "修改备件台账信息";
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const spIds = row.spId || this.ids
      this.$confirm('是否确认删除备件台账信息编号为"' + spIds + '"的数据项？').then(function() {
        return delSpInfo(spIds);
      }).then(() => {
        this.getList();
        this.$message({
          type: 'success',
          message: `删除成功！`
        });
      }).catch(() => {});
    },

    // 表单重置
    reset() {
      this.form = {
        spId: null,
        spName: null,
        spType: null,
        spSpe: null,
        supName: null,
        spunitDictId: null,
        sptypeDictId: null,
        safetyStock: null,
        stockNow: null,
        rem: null,
      };
    },

    /** 提交按钮 */
  submitForm() {
      this.$refs["spInfoRef"].validate(valid => {
      if (valid) {
        if (this.form.spId != null) {
          updateSpInfo(this.form).then(response => {
            this.$message({
              type: 'success',
              message: `修改成功！`
            });
            this.dialogVisible = false;
            this.getList();
          });
        } else {
          this.form.delFlag = 0;
          addSpInfo(this.form).then(response => {
            this.$message({
              type: 'success',
              message: `新增成功！`
            });
            this.dialogVisible = false;
            this.getList();
          });
        }
      }
    });
  },
    /** 下载模板操作 */
    moduledown() {
      this.download("equipment/spInfo/importTemplate", {}, `spInfo_template_${new Date().getTime()}.xlsx`);
    },
    /** 导入按钮操作 */
    moreexport() {
      this.upload.title = "备件导入";
      this.upload.open = true;
    },
    /**文件上传中处理 */
   handleFileUploadProgress(event, file, fileList){
      this.upload.isUploading = true;
    },
    /** 文件上传成功处理 */
    handleFileSuccess(response, file, fileList){
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs["uploadRef"].clearFiles();
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
      this.getList();
    },
    /** 提交上传文件 */
    submitFileForm() {
      this.$refs["uploadRef"].submit();
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
