<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="对象类型" prop="typeId">
        <el-select v-model="queryParams.typeId" clearable filterable placeholder="全部">
          <el-option
              v-for="item in typeOptions"
              :key="item.id"
              :label="item.typeName"
              :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="对象名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="delFlag">
        <el-select v-model="queryParams.delFlag" clearable filterable placeholder="请选择">
          <el-option
              key="0"
              label="正常"
              value="0"
          ></el-option>
          <el-option
              key="1"
              label="停用"
              value="1"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['safework:object:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:object:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:object:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:object:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Download"
            @click="objTypeform"
            v-hasPermi="['safework:object:export']"
        >导出模板</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="upload"
            @click="handleImport"
            v-hasPermi="['safework:object:export']"
        >导入</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 330px)" v-loading="loading" :data="objectList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="${comment}" align="center" prop="id" />-->
<!--      <el-table-column label="企业编码" align="center" prop="enterpriseCode" />-->
      <el-table-column label="编码" align="center" prop="code" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="对象类型" align="center" prop="typeName" />
      <el-table-column label="风险等级" align="center" prop="riskName" >
        <template #default="scope">
          <el-row justify="center" v-if="scope.row.riskName == '重大风险'"><span class="level" style="background-color: rgb(233, 0, 0);">{{scope.row.riskName}}</span></el-row>
          <el-row justify="center" v-else-if="scope.row.riskName == '较大风险'"><span class="level" style="background-color: rgb(239, 102, 0);">{{scope.row.riskName}}</span></el-row>
          <el-row justify="center" v-else-if="scope.row.riskName == '一般风险'"><span class="level" style="background-color: rgb(218, 192, 17);">{{scope.row.riskName}}</span></el-row>
          <el-row justify="center" v-else-if="scope.row.riskName == '低风险'"><span class="level" style="background-color: rgb(40, 140, 223);">{{scope.row.riskName}}</span></el-row>
          <el-row justify="center" v-else><span class="level" style="background-color: rgb(185,187,191);">暂未评级</span></el-row>
        </template>
      </el-table-column>
      <el-table-column label="区域风险" align="center">
        <template #default="scope">
          <el-row justify="center" v-if="scope.row.objLev == '重大风险'"><span class="level" style="background-color: rgb(233, 0, 0);">{{scope.row.objLev}}</span></el-row>
          <el-row justify="center" v-else-if="scope.row.objLev == '较大风险'"><span class="level" style="background-color: rgb(239, 102, 0);">{{scope.row.objLev}}</span></el-row>
          <el-row justify="center" v-else-if="scope.row.objLev == '一般风险'"><span class="level" style="background-color: rgb(218, 192, 17);">{{scope.row.objLev}}</span></el-row>
          <el-row justify="center" v-else-if="scope.row.objLev == '低风险'"><span class="level" style="background-color: rgb(40, 140, 223);">{{scope.row.objLev}}</span></el-row>
          <el-row justify="center" v-else><span class="level" style="background-color: rgb(185,187,191);">暂未评级</span></el-row>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="delFlag">
        <template #default="scope">
          <el-row justify="center" v-if="scope.row.delFlag == 0"><el-tag type="success">正常</el-tag></el-row>
          <el-row justify="center" v-else><el-tag type="danger">禁用</el-tag></el-row>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:object:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:object:remove']"
          >删除</el-button>
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

    <!-- 添加或修改风险分析对象对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="objectRef" :model="form" :rules="rules" label-width="120px">
<!--        <el-form-item label="企业编码" prop="enterpriseCode">-->
<!--          <el-input v-model="form.enterpriseCode" placeholder="请输入企业编码" />-->
<!--        </el-form-item>-->
        <el-form-item label="分析对象编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入分析对象编码" />
        </el-form-item>
        <el-form-item label="分析对象名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分析对象名称" />
        </el-form-item>
        <el-form-item label="对象类型" prop="typeId">
<!--          <el-input v-model="form.typeId" placeholder="请输入对象类型id" />-->
          <el-select v-model="form.typeId" clearable filterable placeholder="请选择">
            <el-option
                v-for="item in typeOptions"
                :key="item.id"
                :label="item.typeName"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.delFlag">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 导入对话框 -->
    <el-dialog :title="upload.title" v-model="upload.importOpen" width="400px" append-to-body>
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
<!--            <div class="el-upload__tip">
              <el-checkbox v-model="upload.updateSupport"/>
              是否更新已经存在的对象数据
            </div>-->
            <span>仅允许导入xls、xlsx格式文件。</span>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.importOpen = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Object">
import { listObject, getObject, delObject, addObject, updateObject } from "@/api/safework/object";
import { listType } from "@/api/safework/type";
import {getToken} from "../../../utils/auth";
import {h} from "vue";
const { proxy } = getCurrentInstance();

const objectList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const typeOptions = ref([]);
const upload = reactive({
  // 是否显示弹出层（导入）
  importOpen: false,
  // 弹出层标题（导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: {Authorization: "Bearer " + getToken()},
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/safework/object/importData"
});

const handleFileSuccess = (response, file, fileList) => {
  upload.importOpen = false;
  proxy.$refs["uploadRef"].clearFiles();
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
  getList();
};

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    enterpriseCode: null,
    code: null,
    name: null,
    typeId: null,
    // delFlag: '0'
  },
  rules: {
    code: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
    name: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
    typeId: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);


function objTypeform(){
  proxy.download('safework/object/exportTemplate', {
    ...queryParams.value
  }, `风险对象_${new Date().getTime()}.xlsx`)
}

/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
};


/** 查询风险分析对象列表 */
function getList() {
  loading.value = true;
  listObject(queryParams.value).then(response => {
    objectList.value = response.rows;
    if(objectList.value.length>0){
      objectList.value.forEach((j, index) => {
        let aa = parseInt(j.objLevValue)*parseInt(-1) + parseInt(j.riskLevel)
        if(aa<=1){
          j.objLev = '重大风险'
        }
        if(aa>=4){
          j.objLev = '低风险'
        }
        if(aa==2){
          j.objLev = '较大风险'
        }
        if(aa==3){
          j.objLev = '一般风险'
        }
      })
    }
    total.value = response.total;
    loading.value = false;
  });
}

function getType() {
  listType({delFlag:0}).then(res => {
    typeOptions.value = res.rows;
  })
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
    enterpriseCode: null,
    code: null,
    name: null,
    typeId: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("objectRef");
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
  form.value.delFlag = '0';
  open.value = true;
  title.value = "添加风险分析对象";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getObject(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改风险分析对象";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["objectRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateObject(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addObject(form.value).then(response => {
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
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据及以下的风险单元、风险事件、风险管控措施吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delObject(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/object/export', {
    ...queryParams.value
  }, `object_${new Date().getTime()}.xlsx`)
}

/** 导入 */
function handleImport(){
  upload.title = "导入";
  upload.importOpen = true;
}

getList();
getType();
</script>
<style>
.level{
  border-radius: 5px;
  padding: 2px 5px;
  color: #fff;
}
</style>
