<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="遥控名称" prop="ykName">
        <el-input
          v-model="queryParams.ykName"
          placeholder="请输入遥控名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="TAG名称" prop="ykTag">
        <el-input
          v-model="queryParams.ykTag"
          placeholder="请输入TAG名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8 toolsline">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['sensor:sensorYk:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['sensor:sensorYk:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['sensor:sensorYk:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['sensor:sensorYk:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Upload"
          @click="handleImport"
          v-hasPermi="['sensor:sensorYk:import']"
        >导入</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 300px)" v-loading="loading" :data="sensorYkList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="遥控编号" align="center" prop="ykNo" />
      <el-table-column label="遥控名称" align="center" prop="ykName" />
      <el-table-column label="遥控备注" align="center" prop="ykMemo" />
      <el-table-column label="TAG名称" align="center" prop="ykTag" />
      <el-table-column label="类型" align="center" prop="ykType" />
      <el-table-column label="序列号" align="center" prop="ykSerial" />
      <el-table-column label="报警状态" align="center" prop="ykAlertvalue" />
      <el-table-column label="状态0描述" align="center" prop="ykDes0" />
      <el-table-column label="状态1描述" align="center" prop="ykDes1" />
<!--      <el-table-column label="是否显示" align="center" prop="ykVisible" >
        <template #default="scope">
          <dict-tag :options="point_visible_status" :value="scope.row.ykVisible"/>
        </template>
      </el-table-column>-->
      <el-table-column label="状态" align="center" prop="ykState" >
        <template #default="scope">
          <dict-tag :options="point_use_status" :value="scope.row.ykState"/>
        </template>
      </el-table-column>
      <el-table-column label="排序号" align="center" prop="ykSort" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['sensor:sensorYk:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sensor:sensorYk:remove']"
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

    <!-- 添加或修改设备遥控点对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="sensorYkRef" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="遥控名称" prop="ykName">
          <el-input v-model="form.ykName" placeholder="请输入遥控名称" />
        </el-form-item>
        <el-form-item label="遥控备注" prop="ykMemo">
          <el-input v-model="form.ykMemo" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="TAG名称" prop="ykTag">
          <el-input v-model="form.ykTag" placeholder="请输入TAG名称" />
        </el-form-item>
        <el-form-item label="序列号" prop="ykSerial">
          <el-input v-model="form.ykSerial" placeholder="请输入序列号" />
        </el-form-item>
        <el-form-item label="报警状态" prop="ykAlertvalue">
          <el-input v-model="form.ykAlertvalue" placeholder="-1变为不报警 0：当前状态0时报警，1：当前1时报警；2：0和1状态都变位报警" />
        </el-form-item>
        <el-form-item label="控制状态0描述" prop="ykDes0">
          <el-input v-model="form.ykDes0" placeholder="请输入控制状态0描述" />
        </el-form-item>
        <el-form-item label="控制状态1描述" prop="ykDes1">
          <el-input v-model="form.ykDes1" placeholder="请输入控制状态1描述" />
        </el-form-item>
       <el-form-item label="显示与否" prop="ykVisible">
          <el-select v-model="form.ykVisible" placeholder="请选择是否可见" clearable>
            <el-option
                v-for="dict in point_visible_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            />
        </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="ykState">
          <el-select v-model="form.ykState" placeholder="请选择状态" clearable>
            <el-option
                v-for="dict in point_use_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            />
        </el-select>
        </el-form-item>
        <el-form-item label="排序号" prop="ykSort">
          <el-input v-model="form.ykSort" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 遥测点导入对话框 -->
    <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
      <el-upload
          ref="uploadRef"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url + '?updateSupport=' + upload.updateSupport +'&equipmentId='+data.equipmentId"
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
              是否更新已经存在的点位数据
            </div>
            <span>仅允许导入xls、xlsx格式文件。</span>
            <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                     @click="importTemplate">下载模板
            </el-link>
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

<script setup name="SensorYk">
import {getToken} from "@/utils/auth";
import { listSensorYk, getSensorYk, delSensorYk, addSensorYk, updateSensorYk } from "@/api/sensor/sensorYk";
import {h} from "vue";

const { proxy } = getCurrentInstance();
const {point_visible_status,point_use_status} = proxy.useDict("point_visible_status","point_use_status");
const sensorYkList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const route = useRoute();
/*** 用户导入参数 */
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: {Authorization: "Bearer " + getToken()},
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/sensor/sensorYk/importData"
});

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    ykName: null,
    ykMemo: null,
    ykTag: null,
    ykType: null,
    ykEquipId: route.params && route.params.equipmentId,
    ykSerial: null,
    ykAlertvalue: null,
    ykDes0: null,
    ykDes1: null,
    ykCurr: null,
    ykDt: null,
    ykVisible: null,
    ykState: null,
    ykSort: null,
    tenantId: null
  },
  rules: {
    ykName: [
      { required: true, message: "测点名称不能为空", trigger: "blur" }
    ],
    ykSerial: [
      { required: true, message: "地址码不能为空", trigger: "blur" }
    ],
    // ykVisible: [
    //   { required: true, message: "可见否不能为空", trigger: "blur" }
    // ],
  },
  equipmentId: route.params && route.params.equipmentId
});

const { queryParams, form, rules } = toRefs(data);
function handleImport(){
  upload.title = "遥控点位导入";
  upload.open = true;
}
/** 下载模板操作 */
function importTemplate() {
  proxy.download("sensor/sensorYk/importTemplate", {}, `sensorYk_template_${new Date().getTime()}.xlsx`);
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
/** 查询设备遥控点列表 */
function getList() {
  loading.value = true;
  listSensorYk(queryParams.value).then(response => {
    sensorYkList.value = response.rows;
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
    ykNo: null,
    ykName: null,
    ykMemo: null,
    ykTag: null,
    ykType: null,
    ykEquipId:  route.params && route.params.equipmentId,
    ykSerial: null,
    ykAlertvalue: null,
    ykDes0: null,
    ykDes1: null,
    ykCurr: null,
    ykDt: null,
    ykVisible: null,
    ykState: null,
    ykSort: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null,
    tenantId: null,
  };
  proxy.resetForm("sensorYkRef");
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
  ids.value = selection.map(item => item.ykNo);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加设备遥控点";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const ykNo = row.ykNo || ids.value
  getSensorYk(ykNo).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改设备遥控点";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["sensorYkRef"].validate(valid => {
    if (valid) {
      if (form.value.ykNo != null) {
        updateSensorYk(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSensorYk(form.value).then(response => {
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
  const ykNos = row.ykNo || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delSensorYk(ykNos);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('sensor/sensorYk/export', {
    ...queryParams.value
  }, `sensorYk_${new Date().getTime()}.xlsx`)
}

getList();
</script>
<style>
.toolsline{
  height: 30px;
}
</style>
