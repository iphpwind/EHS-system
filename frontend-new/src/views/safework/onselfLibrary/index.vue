<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="分析对象" prop="objectId">
        <el-select v-model="queryParams.objectId" clearable filterable placeholder="全部">
          <el-option
              v-for="item in obOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排查内容" prop="standard">
        <el-input
          v-model="queryParams.content"
          placeholder="请输入排查内容"
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
          v-hasPermi="['safework:onselfLibrary:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="info"
            plain
            icon="Upload"
            @click="handleImport"
        >导入
        </el-button>
        <el-button type="warning" plain icon="download"
                   @click="importTemplate">下载模板
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="onselfLibraryList" @selection-change="handleSelectionChange">
      <el-table-column label="分析对象" align="center" prop="objectName" />
      <el-table-column label="自建排查分类" align="center" prop="investypeDicName" />
      <el-table-column label="检查标准" align="center" prop="standard" />
      <el-table-column label="排查内容" align="center" prop="content" />
      <el-table-column label="排查依据" align="center" prop="basis" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:onselfLibrary:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:onselfLibrary:remove']"
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

    <!-- 添加或修改自建隐患库对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="onselfLibraryRef" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="分析对象" prop="objectId">
          <el-select v-model="form.objectId" clearable filterable placeholder="请选择">
            <el-option
                v-for="item in obOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="自建排查分类" prop="investypeDicId">
          <el-select v-model="form.investypeDicId" clearable filterable placeholder="请选择">
            <el-option
                v-for="item in inOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检查标准" prop="standard">
          <el-input type="textarea" v-model="form.standard" placeholder="请输入检查标准" />
        </el-form-item>
        <el-form-item label="排查内容" prop="content">
          <el-input type="textarea" v-model="form.content" placeholder="请输入排查内容" />
        </el-form-item>
        <el-form-item label="排查依据" prop="basis">
          <el-input type="textarea" v-model="form.basis" placeholder="请输入排查依据" />
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

<script setup name="OnselfLibrary">
import { listOnselfLibrary, getOnselfLibrary, delOnselfLibrary, addOnselfLibrary, updateOnselfLibrary } from "@/api/safework/onselfLibrary";
import { listObject } from "@/api/safework/object";
import { listOneselfInves, getOneselfInves, delOneselfInves, addOneselfInves, updateOneselfInves } from "@/api/safework/oneselfInves";
import {getToken} from "@/utils/auth";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const onselfLibraryList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const obOptions = ref([]);
const inOptions = ref([]);

/***导入参数 */
const upload = reactive({
  // 是否显示弹出层（导入）
  open: false,
  // 弹出层标题（导入）
  title: "导入",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的人员数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: {Authorization: "Bearer " + getToken()},
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/safework/onselfLibrary/importData"
});

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    enterpriseCode: null,
    objectId: null,
    investypeDicId: null,
    standard: null,
    content: null,
    basis: null,
  },
  rules: {
    objectId: [
      { required: true, message: '请填写分析对象', trigger: 'blur' }
    ],
    investypeDicId: [
      { required: true, message: '请填写自建排查分类', trigger: 'blur' }
    ],
    content: [
      { required: true, message: '请填写排查内容', trigger: 'blur' }
    ],
    delFlag: [
      { required: true, message: '请选择状态', trigger: 'blur' }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/* 查询风险分析对象 */
function getObject() {
  listObject({delFlag:0}).then(res => {
    obOptions.value = res.rows;
  })
}

/*查询自建排查分类字典*/
function getOneInves() {
  listOneselfInves({delFlag:0}).then(response => {
    inOptions.value = response.rows;
  });
}

/** 导入按钮操作 */
function handleImport() {
  upload.title = "导入";
  upload.open = true;
};
/** 下载模板操作 */
function importTemplate() {
  proxy.download("safework/onselfLibrary/importTemplate", {}, `自建隐患库模板${new Date().getTime()}.xlsx`);
};
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].clearFiles();
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
  getList();
};
/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
};

/** 查询自建隐患库列表 */
function getList() {
  loading.value = true;
  listOnselfLibrary(queryParams.value).then(response => {
    onselfLibraryList.value = response.rows;
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
    enterpriseCode: null,
    objectId: null,
    investypeDicId: null,
    standard: null,
    content: null,
    basis: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("onselfLibraryRef");
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
  title.value = "添加自建隐患库";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getOnselfLibrary(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改自建隐患库";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["onselfLibraryRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateOnselfLibrary(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addOnselfLibrary(form.value).then(response => {
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
    return delOnselfLibrary(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/onselfLibrary/export', {
    ...queryParams.value
  }, `onselfLibrary_${new Date().getTime()}.xlsx`)
}

getList();
getObject();
getOneInves();
</script>
