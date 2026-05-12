<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="活动标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入活动标题"
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
          v-hasPermi="['safework:activity:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:activity:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:activity:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:activity:export']"
        >导出模板</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="upload"
          @click="handleImport"
        >导入</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="activityList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="主键ID" align="center" prop="id" />-->
<!--      <el-table-column label="部门" align="center" prop="enterpriseCode" />-->
      <el-table-column label="活动标题" align="center" prop="title" />
      <el-table-column label="活动时间" align="center" prop="time" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.time, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动地点" align="center" prop="location" />
      <el-table-column label="活动主持人" align="center" prop="host" />
      <el-table-column label="主办部门" align="center" prop="organizer" />
      <el-table-column label="主要参与人员" align="center" prop="participants" />
      <el-table-column label="活动通知是否发布" align="center" prop="noticePublished" >
        <template #default="scope">
          <el-row justify="center" v-if="scope.row.noticePublished == 0"><el-tag type="success">是</el-tag></el-row>
          <el-row justify="center" v-else><el-tag type="danger">否</el-tag></el-row>
        </template>
      </el-table-column>
      <el-table-column label="活动内容" align="center" prop="content" />
      <el-table-column label="活动情况与总结" align="center" prop="summary" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <el-row justify="center" v-if="scope.row.status == 0"><el-tag type="success">正常</el-tag></el-row>
          <el-row justify="center" v-else><el-tag type="danger">禁用</el-tag></el-row>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:activity:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:activity:remove']"
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

    <!-- 添加或修改线下安全活动对话框 -->
    <el-dialog :title="title" v-model="open" width="700px" append-to-body>
      <el-form ref="activityRef" :model="form" :rules="rules" label-width="150px">
<!--        <el-form-item label="部门" prop="enterpriseCode">
          <el-input v-model="form.enterpriseCode" placeholder="请输入部门" />
        </el-form-item>-->
        <el-form-item label="活动标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入活动标题" />
        </el-form-item>
        <el-form-item label="活动时间" prop="time">
          <el-date-picker clearable
            v-model="form.time"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择活动时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动地点" prop="location">
          <el-input v-model="form.location" placeholder="请输入活动地点" />
        </el-form-item>
        <el-form-item label="活动主持人" prop="host">
          <el-input v-model="form.host" placeholder="请输入活动主持人" />
        </el-form-item>
        <el-form-item label="主办部门" prop="organizer">
          <el-input v-model="form.organizer" placeholder="请输入主办部门" />
        </el-form-item>
        <el-form-item label="主要参与人员" prop="participants">
          <el-input v-model="form.participants" placeholder="请输入主要参与人员" />
        </el-form-item>
        <el-form-item label="活动通知是否发布" prop="noticePublished">
          <el-radio-group v-model="form.noticePublished">
            <el-radio label="0">是</el-radio>
            <el-radio label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动内容">
          <el-input v-model="form.content" type="textarea" placeholder="请输入活动内容" />
        </el-form-item>
        <el-form-item label="活动情况与总结" prop="summary">
          <el-input v-model="form.summary" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="上传附件" prop="fileUrl">
          <FileUpload
              v-model.value="form.fileUrl"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
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

<script setup name="Activity">
import { listActivity, getActivity, delActivity, addActivity, updateActivity } from "@/api/safework/activity";
import {getToken} from "../../../utils/auth";
import {h} from "vue";
const { proxy } = getCurrentInstance();

const activityList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
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
  url: import.meta.env.VITE_APP_BASE_API + "/safework/activity/importData"
});
const handleFileSuccess = (response, file, fileList) => {
  upload.importOpen = false;
  proxy.$refs["uploadRef"].clearFiles();
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
  getList();
};
const data = reactive({
  form: {
    fileUrl: null,
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    enterpriseCode: null,
    title: null,
    time: null,
    location: null,
    host: null,
    organizer: null,
    participants: null,
    noticePublished: null,
    content: null,
    summary: null,
    attachmentId: null,
    status: null
  },
  rules: {
    title: [
      { required: true, message: '请填写活动标题', trigger: 'blur' }
    ],
    time: [
      { required: true, message: '请填写活动时间', trigger: 'blur' }
    ],
    location: [
      { required: true, message: '请填写活动地点', trigger: 'blur' }
    ],
    host: [
      { required: true, message: '请填写活动主持人', trigger: 'blur' }
    ],
    organizer: [
      { required: true, message: '请填写主办部门', trigger: 'blur' }
    ],
    participants: [
      { required: true, message: '请填写主要参与人员', trigger: 'blur' }
    ],
    noticePublished: [
      { required: true, message: '请选择活动通知是否发布', trigger: 'blur' }
    ],
    status: [
      { required: true, message: '请选择状态', trigger: 'blur' }
    ],

  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询线下安全活动列表 */
function getList() {
  loading.value = true;
  listActivity(queryParams.value).then(response => {
    activityList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}
/** 导入 */
function handleImport(){
  upload.title = "导入";
  upload.importOpen = true;
}
/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
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
    title: null,
    time: null,
    location: null,
    host: null,
    organizer: null,
    participants: null,
    noticePublished: null,
    content: null,
    summary: null,
    attachmentId: null,
    status: "0"
  };
  proxy.resetForm("activityRef");
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
  title.value = "添加线下安全活动";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getActivity(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改线下安全活动";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["activityRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateActivity(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addActivity(form.value).then(response => {
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
    return delActivity(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/activity/export', {
    ...queryParams.value
  }, `activity_${new Date().getTime()}.xlsx`)
}

getList();
</script>
