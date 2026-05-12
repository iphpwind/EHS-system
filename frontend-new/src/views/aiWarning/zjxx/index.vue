<template>
  <div class="app-container">
<!--    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">-->
<!--      <el-form-item label="摄像头ip" prop="zjip">-->
<!--        <el-input-->
<!--          v-model="queryParams.zjip"-->
<!--          placeholder="请输入摄像头ip"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>-->
<!--        <el-button icon="Refresh" @click="resetQuery">重置</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['aiWarning:zjxx:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['aiWarning:zjxx:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['aiWarning:zjxx:remove']"
        >删除</el-button>
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
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['aiWarning:zjxx:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="zjxxList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="企业id" align="center" prop="tenId" />
      <el-table-column label="摄像头ip" align="center" prop="zjip" />
      <el-table-column label="用户名" align="center" prop="yhm" />
      <el-table-column label="密码" align="center" prop="mm" />
<!--      <el-table-column label="企业编码(安工院推送)" align="center" prop="enterpriseCode" />-->
<!--      <el-table-column label="行政区划编码(东营推送)" align="center" prop="areaCode" />-->
<!--      <el-table-column label="公司名称(东营推送)" align="center" prop="companyName" />-->
<!--      <el-table-column label="信用代码(东营推送)" align="center" prop="creditCode" />-->
<!--      <el-table-column label="公司code(东营推送)" align="center" prop="companyCode" />-->
      <el-table-column label="在线状态" align="center" prop="zjStatus" >
        <template #default="scope">
          <span v-if="scope.row.zjStatus=='1'">在线</span>
          <span v-else>离线</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['aiWarning:zjxx:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['aiWarning:zjxx:remove']"
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

    <!-- 添加或修改AI告警主机对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="zjxxRef" :model="form" :rules="rules" label-width="120px">
<!--        <el-form-item label="租户id" prop="tenId">-->
<!--          <el-input v-model="form.tenId" placeholder="请输入租户id" />-->
<!--        </el-form-item>-->
        <el-form-item label="摄像头ip" prop="zjip">
          <el-input v-model="form.zjip" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="用户名" prop="yhm">
          <el-input v-model="form.yhm" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="密码" prop="mm">
          <el-input v-model="form.mm" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="企业编码(安工院推送)" prop="enterpriseCode">
          <el-input v-model="form.enterpriseCode" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="行政区划编码(东营推送)" prop="areaCode">
          <el-input v-model="form.areaCode" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="公司名称(东营推送)" prop="companyName">
          <el-input v-model="form.companyName" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="信用代码(东营推送)" prop="creditCode">
          <el-input v-model="form.creditCode" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="公司code(东营推送)" prop="companyCode">
          <el-input v-model="form.companyCode" placeholder="请输入" />
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
<!--            <div class="el-upload__tip">-->
<!--              <el-checkbox v-model="upload.updateSupport"/>-->
<!--              是否更新已经存在的数据-->
<!--            </div>-->
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

<script setup name="Zjxx">
import { listZjxx, getZjxx, delZjxx, addZjxx, updateZjxx } from "@/api/aiWarning/zjxx";
import {getToken} from "@/utils/auth";
import {h} from "vue";
const { proxy } = getCurrentInstance();

const zjxxList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
/*** 导入参数 */
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
  url: import.meta.env.VITE_APP_BASE_API + "/aiWarning/zjxx/importData"
});
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    tenId: null,
    zjip: null,
    yhm: null,
    mm: null,
    enterpriseCode: null,
    areaCode: null,
    companyName: null,
    creditCode: null,
    companyCode: null,
    zjStatus: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 导入按钮操作 */
function handleImport() {
  upload.title = "AI主机信息导入";
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
/** 查询AI告警主机列表 */
function getList() {
  loading.value = true;
  listZjxx(queryParams.value).then(response => {
    zjxxList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
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
    tenId: null,
    zjip: null,
    yhm: null,
    mm: null,
    enterpriseCode: null,
    areaCode: null,
    companyName: null,
    creditCode: null,
    companyCode: null,
    zjStatus: 0,
    createTime: null,
    updateTime: null
  };
  proxy.resetForm("zjxxRef");
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
  title.value = "添加AI告警主机";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getZjxx(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改AI告警主机";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["zjxxRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateZjxx(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addZjxx(form.value).then(response => {
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
    return delZjxx(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('aiWarning/zjxx/export', {
    ...queryParams.value
  }, `zjxx_${new Date().getTime()}.xlsx`)
}

getList();
</script>
