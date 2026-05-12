<template>
  <div class="app-container">
<!--    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">-->
<!--      <el-form-item label="租户id" prop="tenId">-->
<!--        <el-input-->
<!--          v-model="queryParams.tenId"-->
<!--          placeholder="请输入租户id"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="摄像头地址" prop="sbdz">-->
<!--        <el-input-->
<!--          v-model="queryParams.sbdz"-->
<!--          placeholder="请输入摄像头地址"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="摄像头通道" prop="sbtd">-->
<!--        <el-input-->
<!--          v-model="queryParams.sbtd"-->
<!--          placeholder="请输入摄像头通道"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="视频编码" prop="videoCode">-->
<!--        <el-input-->
<!--          v-model="queryParams.videoCode"-->
<!--          placeholder="请输入视频编码"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="摄像头ip" prop="sbip">-->
<!--        <el-input-->
<!--          v-model="queryParams.sbip"-->
<!--          placeholder="请输入摄像头ip"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="摄像头名称" prop="sbname">-->
<!--        <el-input-->
<!--          v-model="queryParams.sbname"-->
<!--          placeholder="请输入摄像头名称"-->
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
          v-hasPermi="['aiWarning:sbxx:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['aiWarning:sbxx:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['aiWarning:sbxx:remove']"
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
          v-hasPermi="['aiWarning:sbxx:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="sbxxList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="摄像头ip" align="center" prop="sbip" />
      <el-table-column label="摄像头安装地址" align="center" prop="sbdz" />
      <el-table-column label="通道号" align="center" prop="sbtd" />
      <el-table-column label="通道编码(安工院推送)" align="center" prop="videoCode" />
      <el-table-column label="通道名称" align="center" prop="sbname" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['aiWarning:sbxx:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['aiWarning:sbxx:remove']"
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

    <!-- 添加或修改AI告警设备对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="sbxxRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="摄像头ip" prop="sbip">
          <el-input v-model="form.sbip" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="摄像头安装地址" prop="sbdz">
          <el-input v-model="form.sbdz" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="通道号" prop="sbtd">
          <el-input v-model="form.sbtd" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="通道编码(安工院推送)" prop="videoCode">
          <el-input v-model="form.videoCode" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="通道名称" prop="sbname">
          <el-input v-model="form.sbname" placeholder="请输入" />
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

<script setup name="Sbxx">
import { listSbxx, getSbxx, delSbxx, addSbxx, updateSbxx } from "@/api/aiWarning/sbxx";
import {getToken} from "@/utils/auth";
import {h} from "vue";
const { proxy } = getCurrentInstance();

const sbxxList = ref([]);
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
  url: import.meta.env.VITE_APP_BASE_API + "/aiWarning/sbxx/importData"
});
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    tenId: null,
    sbdz: null,
    sbtd: null,
    videoCode: null,
    sbip: null,
    sbname: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 导入按钮操作 */
function handleImport() {
  upload.title = "通道信息导入";
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


/** 查询AI告警设备列表 */
function getList() {
  loading.value = true;
  listSbxx(queryParams.value).then(response => {
    sbxxList.value = response.rows;
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
    sbdz: null,
    sbtd: null,
    videoCode: null,
    sbip: null,
    sbname: null,
    createTime: null,
    updateTime: null
  };
  proxy.resetForm("sbxxRef");
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
  title.value = "添加AI告警设备";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getSbxx(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改AI告警设备";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["sbxxRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateSbxx(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSbxx(form.value).then(response => {
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
    return delSbxx(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('aiWarning/sbxx/export', {
    ...queryParams.value
  }, `sbxx_${new Date().getTime()}.xlsx`)
}

getList();
</script>
