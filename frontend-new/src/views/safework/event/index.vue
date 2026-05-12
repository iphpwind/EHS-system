<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="单元" prop="unitId">
        <el-select v-model="queryParams.unitId" clearable filterable placeholder="请选择" @change="seChange($event)">
          <el-option
              v-for="item in unitOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="事件名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入风险事件名称"
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
          v-hasPermi="['safework:event:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:event:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:event:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:event:export']"
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

    <el-table height="calc(100vh - 330px)" v-loading="loading" :data="eventList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="${comment}" align="center" prop="id" />-->
      <el-table-column label="单元" align="center" prop="unitName" />
      <el-table-column label="风险事件名称" align="center" prop="name" />
      <el-table-column label="检查标准/潜在危害" align="center" prop="standard" />
      <el-table-column label="主要后果" align="center" prop="conseq" />
      <el-table-column label="危害类别" align="center" prop="hazardName" />
      <el-table-column label="事故类型" align="center" prop="accName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:event:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:event:remove']"
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

    <!-- 添加或修改风险事件对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="eventRef" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="单元" prop="unitId">
          <el-select v-model="form.unitId" clearable filterable placeholder="请选择" @change="seChange($event)">
            <el-option
                v-for="item in unitOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="风险事件名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入风险事件名称" />
        </el-form-item>
        <el-form-item v-if="unitType == '设备设施'" label="检查标准" prop="standard">
          <el-input v-model="form.standard" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item v-if="unitType == '作业活动'" label="潜在危害" prop="standard">
          <el-input v-model="form.standard" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item v-if="unitType == '设备设施'" label="不符合标准情况及后果" prop="conseq">
          <el-input v-model="form.conseq" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item v-if="unitType == '作业活动'" label="主要后果" prop="conseq">
          <el-input v-model="form.conseq" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="危害类别" prop="hazardId">
          <el-select v-model="form.hazardId" clearable filterable placeholder="请选择">
            <el-option
                v-for="item in haOptions"
                :key="item.id"
                :label="item.hazardCategoryName"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事故类型" prop="accId">
          <el-select v-model="form.accId" clearable filterable placeholder="请选择">
            <el-option
                v-for="item in acOptions"
                :key="item.id"
                :label="item.accidentCategoryName"
                :value="item.id"
            ></el-option>
          </el-select>
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

<script setup name="Event">
import { listEvent, getEvent, delEvent, addEvent, updateEvent } from "@/api/safework/event";
import { listHazardcategory } from "@/api/safework/hazardcategory";
import { listAccident } from "@/api/safework/accident";
import { listUnit } from "@/api/safework/unit";
import {getToken} from "../../../utils/auth";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const eventList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const unitType = ref("设备设施");
const haOptions = ref([]);
const acOptions = ref([]);
const unitOptions = ref([]);
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
  url: import.meta.env.VITE_APP_BASE_API + "/safework/event/importData"
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
    unitId: null,
    name: null,
    hazardId: null,
    accId: null,
  },
  rules: {
    unitId: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
    name: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
    standard: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
    conseq: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);
/** 选择导出模板提交按钮 */
function objTypeform(){
  proxy.download('safework/event/exportTemplate', {
    ...queryParams.value
  }, `风险事件_${new Date().getTime()}.xlsx`)
}
/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
};
/** 导入 */
function handleImport(){
  upload.title = "导入";
  upload.importOpen = true;
}
function seChange(val) {
  //选中的数据和options进行匹配
  var obj={}
  obj= unitOptions.value.find(function(i){
    return i.id ===val
  });
  //在change中获取到整条对象数据
  console.log(obj);
  unitType.value = obj.type;
  console.log(unitType.value)
}

/** 查询风险事件列表 */
function getList() {
  loading.value = true;
  listEvent(queryParams.value).then(response => {
    eventList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function getHazard() {
  listHazardcategory({delFlag:0}).then(res => {
    haOptions.value = res.rows
  })
}

function getAccident() {
  listAccident({delFlag:0}).then(res => {
    acOptions.value = res.rows
  })
}

function getUnit() {
  listUnit({delFlag:0}).then(res => {
    unitOptions.value = res.rows
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
    unitId: null,
    name: null,
    standard: null,
    conseq: null,
    hazardId: null,
    accId: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("eventRef");
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
  title.value = "添加风险事件";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getEvent(id).then(response => {
    form.value = response.data;
    unitType.value = form.value.unitType
    open.value = true;
    title.value = "修改风险事件";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["eventRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateEvent(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEvent(form.value).then(response => {
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
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据及以下的风险管控措施吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delEvent(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/event/export', {
    ...queryParams.value
  }, `event_${new Date().getTime()}.xlsx`)
}

getList();
getHazard();
getAccident();
getUnit();
</script>
