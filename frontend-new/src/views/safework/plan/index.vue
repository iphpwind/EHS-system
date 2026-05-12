<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入计划名称"
          clearable
          @keyup.enter="handleQuery"
        />
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
          v-hasPermi="['safework:plan:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:plan:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:plan:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:plan:export']"
        >导出模板</el-button>
      </el-col>
      <el-col :span="1.5">
				<el-button
						type="info"
						plain
						icon="Upload"
						@click="handleImport"
				>导入
				</el-button>
			</el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="planList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="所属机构" align="center" prop="enterpriseCode" />
      <el-table-column label="编码" align="center" prop="code" />
      <el-table-column label="计划名称" align="center" prop="name" />
      <el-table-column label="计划年度" align="center" prop="year" />
      <el-table-column label="制定日期" align="center" prop="planDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.planDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预计实施日期" align="center" prop="expectedStartDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.expectedStartDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划人" align="center" prop="planner" />
      <el-table-column label="计划内容" align="center" prop="planContent" />
      <el-table-column label="计划人部门" align="center" prop="plannerDepartment" />
      <el-table-column label="责任人" align="center" prop="responsiblePerson" />
      <el-table-column label="责任部门" align="center" prop="responsibleDepartment" />
      <el-table-column label="要求完成日期" align="center" prop="completionDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.completionDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编制人" align="center" prop="compiler" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:plan:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:plan:remove']"
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

    <!-- 添加或修改线下培训计划对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="planRef" :model="form" :rules="rules" label-width="120px">
<!--        <el-form-item label="所属机构" prop="enterpriseCode">-->
<!--          <el-input v-model="form.enterpriseCode" placeholder="请输入所属机构" />-->
<!--        </el-form-item>-->
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="计划名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入计划名称" />
        </el-form-item>
        <el-form-item label="计划年度" prop="year">
          <el-input v-model="form.year" placeholder="请输入计划年度" />
        </el-form-item>
        <el-form-item label="所属分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择所属分类">
            <el-option
                v-for="dict in categoryList"
                :key="dict.code"
                :label="dict.name"
                :value="dict.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="制定日期" prop="planDate">
          <el-date-picker clearable
            v-model="form.planDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择制定日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预计实施日期" prop="expectedStartDate">
          <el-date-picker clearable
            v-model="form.expectedStartDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择预计实施日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="计划人" prop="planner">
          <el-input v-model="form.planner" placeholder="请输入计划人" />
        </el-form-item>
        <el-form-item label="计划内容">
<!--          <editor v-model="form.planContent" :min-height="192"/>-->
          <el-input v-model="form.planContent" placeholder="请输入计划内容" type="textarea"/>
        </el-form-item>
        <el-form-item label="计划人部门" prop="plannerDepartment">
          <el-input v-model="form.plannerDepartment" placeholder="请输入计划人部门" />
        </el-form-item>
        <el-form-item label="责任人" prop="responsiblePerson">
          <el-input v-model="form.responsiblePerson" placeholder="请输入责任人" />
        </el-form-item>
        <el-form-item label="责任部门" prop="responsibleDepartment">
          <el-input v-model="form.responsibleDepartment" placeholder="请输入责任部门" />
        </el-form-item>
        <el-form-item label="要求完成日期" prop="completionDate">
          <el-date-picker clearable
            v-model="form.completionDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择要求完成日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上传附件" prop="fileUrl">
          <FileUpload
              v-model.value="form.fileUrl"
          />
        </el-form-item>
        <el-form-item label="编制人" prop="compiler">
          <el-input v-model="form.compiler" placeholder="请输入编制人" />
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
              是否更新已经存在的数据
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
  </div>
</template>

<script setup name="Plan">
import { listPlan, getPlan, delPlan, addPlan, updatePlan } from "@/api/safework/plan";
import { listCategory} from "@/api/safework/category";
import {getToken} from "@/utils/auth";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const planList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const upload = reactive({
  // 是否显示弹出层
  open: false,
  // 弹出层标题
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: {Authorization: "Bearer " + getToken()},
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/safework/plan/importData"
});
const data = reactive({
  form: {
    fileUrl:null},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    enterpriseCode: null,
    code: null,
    name: null,
    year: null,
    category: null,
    planDate: null,
    expectedStartDate: null,
    planner: null,
    planContent: null,
    plannerDepartment: null,
    responsiblePerson: null,
    responsibleDepartment: null,
    completionDate: null,
    attachmentId: null,
    compiler: null,
    status: null
  },
  rules: {
    code: [
      { required: true, message: '请填写编码', trigger: 'blur' }
    ],
    name: [
      { required: true, message: '请填写计划名称', trigger: 'blur' }
    ],
    category: [
      { required: true, message: '请填写所属分类', trigger: 'blur' }
    ],
    planDate: [
      { required: true, message: '请填写制定日期', trigger: 'blur' }
    ],
    year: [
      { required: true, message: '请填写计划年度', trigger: 'blur' }
    ],
    planner: [
      { required: true, message: '请填写计划人', trigger: 'blur' }
    ],
    plannerDepartment: [
      { required: true, message: '请填写计划人部门', trigger: 'blur' }
    ],
    responsiblePerson: [
      { required: true, message: '请填写责任人', trigger: 'blur' }
    ],
    responsibleDepartment: [
      { required: true, message: '请填写责任人部门', trigger: 'blur' }
    ],
    completionDate: [
      { required: true, message: '请填写要求完成日期', trigger: 'blur' }
    ],
    compiler: [
      { required: true, message: '请填写编制人', trigger: 'blur' }
    ],
  },
  categoryList:null
});

const { queryParams, form, rules,categoryList } = toRefs(data);

/** 查询线下培训计划列表 */
function getList() {
  loading.value = true;
  listPlan(queryParams.value).then(response => {
    planList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}
/** 查询教育培训所属分类字典列表 */
function getListCategory() {
  listCategory({state: 0}).then(response => {
    categoryList.value = response.rows;
  });
}
/** 导入按钮操作 */
function handleImport() {
  upload.title = "线下培训计划导入";
  upload.open = true;
};
/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
};
  /**文件上传中处理 */
function handleFileUploadProgress(event, file, fileList){
  upload.isUploading = true;
};
/** 文件上传成功处理 */
function handleFileSuccess(response, file, fileList){
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].clearFiles();
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
  getList();
};
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
    year: null,
    category: null,
    planDate: null,
    expectedStartDate: null,
    planner: null,
    planContent: null,
    plannerDepartment: null,
    responsiblePerson: null,
    responsibleDepartment: null,
    completionDate: null,
    attachmentId: null,
    compiler: null,
    status: "0"
  };
  proxy.resetForm("planRef");
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
  open.value = true;
  title.value = "添加线下培训计划";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getPlan(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改线下培训计划";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["planRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updatePlan(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPlan(form.value).then(response => {
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
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delPlan(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/plan/export', {
    ...queryParams.value
  }, `plan_${new Date().getTime()}.xlsx`)
}

getList();
getListCategory();
</script>
