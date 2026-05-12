<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="遥信名称" prop="yxName">
        <el-input
          v-model="queryParams.yxName"
          placeholder="请输入遥信名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="TAG名称" prop="yxTag">
        <el-input
          v-model="queryParams.yxTag"
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
          v-hasPermi="['sensor:sensorYx:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['sensor:sensorYx:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['sensor:sensorYx:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['sensor:sensorYx:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Upload"
          @click="handleImport"
          v-hasPermi="['sensor:sensorYx:import']"
        >导入</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 300px)" v-loading="loading" :data="sensorYxList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="遥信编号" align="center" prop="yxNo" />
      <el-table-column label="遥信名称" align="center" prop="yxName" />
      <el-table-column label="遥信备注" align="center" prop="yxMemo" />
      <el-table-column label="TAG名称" align="center" prop="yxTag" />
      <el-table-column label="类型" align="center" prop="yxType" />
      <el-table-column label="序列号" align="center" prop="yxSerial" />
      <el-table-column label="报警状态" align="center" prop="yxAlertvalue" />
      <el-table-column label="状态0描述" align="center" prop="yxDes0" />
      <el-table-column label="状态1描述" align="center" prop="yxDes1" />
      <el-table-column label="状态2描述" align="center" prop="yxDes2" />
      <el-table-column label="状态3描述" align="center" prop="yxDes3" />
      <el-table-column label="状态4描述" align="center" prop="yxDes4" />
      <el-table-column label="状态5描述" align="center" prop="yxDes5" />
      <el-table-column label="状态6描述" align="center" prop="yxDes6" />
      <el-table-column label="状态7描述" align="center" prop="yxDes7" />
      <el-table-column label="状态8描述" align="center" prop="yxDes8" />
      <el-table-column label="状态9描述" align="center" prop="yxDes9" />
      <el-table-column label="状态10描述" align="center" prop="yxDes10" />
<!--      <el-table-column label="显示状态" align="center" prop="yxVisible" >
        <template #default="scope">
          <dict-tag :options="point_visible_status" :value="scope.row.yxVisible"/>
        </template>
      </el-table-column>-->
      <el-table-column label="状态" align="center" prop="yxState" >
        <template #default="scope">
          <dict-tag :options="point_use_status" :value="scope.row.yxState"/>
        </template>
      </el-table-column>
      <el-table-column label="排序号" align="center" prop="yxSort" />
      <el-table-column label="备注" align="center" prop="remark" />
<!--      <el-table-column label="同启传感器编码" align="center" prop="tqSensorCode" />-->
<!--      <el-table-column label="同启传感器类型" align="center" prop="tqSensorType" >
        <template #default="scope">
          <dict-tag :options="sersor_code" :value="scope.row.tqSensorType"/>
        </template>
      </el-table-column>-->
      <el-table-column label="是否列表显示" align="center" prop="ifshow" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['sensor:sensorYx:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sensor:sensorYx:remove']"
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

    <!-- 添加或修改设备遥信点对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="sensorYxRef" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="遥信名称" prop="yxName">
          <el-input v-model="form.yxName" placeholder="请输入遥信名称" />
        </el-form-item>
        <el-form-item label="遥信备注" prop="yxMemo">
          <el-input v-model="form.yxMemo" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="TAG名称" prop="yxTag">
          <el-input v-model="form.yxTag" placeholder="请输入TAG名称" />
        </el-form-item>
        <el-form-item label="序列号" prop="yxSerial">
          <el-input v-model="form.yxSerial" placeholder="请输入序列号" />
        </el-form-item>
        <el-form-item label="报警状态" prop="yxAlertvalue">
          <el-input v-model="form.yxAlertvalue" placeholder="-1变位不报警 -2：0和1状态都变位报警 需要告警的位以逗号分隔字符串" />
        </el-form-item>
        <el-form-item label="状态0描述" prop="yxDes0">
          <el-input v-model="form.yxDes0" placeholder="请输入状态0描述" />
        </el-form-item>
        <el-form-item label="状态1描述" prop="yxDes1">
          <el-input v-model="form.yxDes1" placeholder="请输入状态1描述" />
        </el-form-item>
        <el-form-item label="状态2描述" prop="yxDes2">
          <el-input v-model="form.yxDes2" placeholder="请输入状态2描述" />
        </el-form-item>
        <el-form-item label="状态3描述" prop="yxDes3">
          <el-input v-model="form.yxDes3" placeholder="请输入状态3描述" />
        </el-form-item>
        <el-form-item label="状态4描述" prop="yxDes4">
          <el-input v-model="form.yxDes4" placeholder="请输入状态4描述" />
        </el-form-item>
        <el-form-item label="状态5描述" prop="yxDes5">
          <el-input v-model="form.yxDes5" placeholder="请输入状态5描述" />
        </el-form-item>
        <el-form-item label="状态6描述" prop="yxDes6">
          <el-input v-model="form.yxDes6" placeholder="请输入状态6描述" />
        </el-form-item>
        <el-form-item label="状态7描述" prop="yxDes7">
          <el-input v-model="form.yxDes7" placeholder="请输入状态7描述" />
        </el-form-item>
        <el-form-item label="状态8描述" prop="yxDes8">
          <el-input v-model="form.yxDes8" placeholder="请输入状态8描述" />
        </el-form-item>
        <el-form-item label="状态9描述" prop="yxDes9">
          <el-input v-model="form.yxDes9" placeholder="请输入状态9描述" />
        </el-form-item>
        <el-form-item label="状态10描述" prop="yxDes10">
          <el-input v-model="form.yxDes10" placeholder="请输入状态10描述" />
        </el-form-item>
         <el-form-item label="显示与否" prop="yxVisible">
          <el-select v-model="form.yxVisible" placeholder="请选择是否可见" clearable>
            <el-option
                v-for="dict in point_visible_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            />
        </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="yxState">
          <el-select v-model="form.yxState" placeholder="请选择状态" clearable>
            <el-option
                v-for="dict in point_use_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            />
        </el-select>
        </el-form-item>
        <el-form-item label="排序号" prop="yxSort">
          <el-input v-model="form.yxSort" placeholder="请输入排序号" />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="同启平台传感器类型" prop="tqSensorType">
          <el-select v-model="form.tqSensorType" placeholder="请选择同启平台传感器类型" clearable>
          <el-
              v-for="dict in sersor_code"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
        </el-form-item>
        <el-form-item label="同启传感器编码" prop="tqSensorCode">
          <el-input v-model="form.tqSensorCode" placeholder="请输入同启传感器编码" />
        </el-form-item>
        <el-form-item label="是否列表显示" prop="ifshow">
          <el-select v-model="form.ifshow" placeholder="请选择" clearable>
            <el-option
                label="是"
                value="是"
            />
            <el-option
                label="否"
                value="否"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否可控" prop="commandFlag">
          <el-select v-model="form.commandFlag" placeholder="请选择状态" clearable>
            <el-option label="是" value="1"/>
            <el-option label="否" value="0"/>
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

<script setup name="SensorYx">
import {getToken} from "@/utils/auth";
import { listSensorYx, getSensorYx, delSensorYx, addSensorYx, updateSensorYx } from "@/api/sensor/sensorYx";
import {h} from "vue";
const { proxy } = getCurrentInstance();
const {point_visible_status,point_use_status} = proxy.useDict("point_visible_status","point_use_status");

const sensorYxList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const route = useRoute();
const {sersor_code} = proxy.useDict("sersor_code");
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
  url: import.meta.env.VITE_APP_BASE_API + "/sensor/sensorYx/importData"
});
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    yxName: null,
    yxMemo: null,
    yxTag: null,
    yxType: null,
    yxEquipId:  route.params && route.params.equipmentId,
    yxSerial: null,
    yxAlertvalue: null,
    yxDes0: null,
    yxDes1: null,
    yxDes2: null,
    yxDes3: null,
    yxDes4: null,
    yxDes5: null,
    yxDes6: null,
    yxDes7: null,
    yxDes8: null,
    yxDes9: null,
    yxDes10: null,
    yxCurr: null,
    yxDt: null,
    yxVisible: null,
    yxState: null,
    yxFaultvalue: null,
    yxSort: null,
    tenantId: null,
    xxx: null,
    yyy: null,
    tqSensorCode: null,
    tqSensorType: null,
  },
  rules: {
    yxName: [
      { required: true, message: "测点名称不能为空", trigger: "blur" }
    ],
    yxSerial: [
      { required: true, message: "地址码不能为空", trigger: "blur" }
    ],
    // yxVisible: [
    //   { required: true, message: "可见否不能为空", trigger: "blur" }
    // ],
  },
  equipmentId: route.params && route.params.equipmentId
});

const { queryParams, form, rules } = toRefs(data);
function handleImport(){
  upload.title = "遥信点位导入";
  upload.open = true;
}
/** 下载模板操作 */
function importTemplate() {
  proxy.download("sensor/sensorYx/importTemplate", {}, `sensorYx_template_${new Date().getTime()}.xlsx`);
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
/** 查询设备遥信点列表 */
function getList() {
  loading.value = true;
  listSensorYx(queryParams.value).then(response => {
    sensorYxList.value = response.rows;
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
    yxNo: null,
    yxName: null,
    yxMemo: null,
    yxTag: null,
    yxType: null,
    yxEquipId: route.params && route.params.equipmentId,
    yxSerial: null,
    yxAlertvalue: null,
    yxDes0: null,
    yxDes1: null,
    yxDes2: null,
    yxDes3: null,
    yxDes4: null,
    yxDes5: null,
    yxDes6: null,
    yxDes7: null,
    yxDes8: null,
    yxDes9: null,
    yxDes10: null,
    yxCurr: null,
    yxDt: null,
    yxVisible: null,
    yxState: null,
    yxFaultvalue: null,
    yxSort: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null,
    tenantId: null,
    xxx: null,
    yyy: null,
    tqSensorCode: null,
    tqSensorType: null
  };
  proxy.resetForm("sensorYxRef");
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
  ids.value = selection.map(item => item.yxNo);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加设备遥信点";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const yxNo = row.yxNo || ids.value
  getSensorYx(yxNo).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改设备遥信点";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["sensorYxRef"].validate(valid => {
    if (valid) {
      if (form.value.yxNo != null) {
        updateSensorYx(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSensorYx(form.value).then(response => {
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
  const yxNos = row.yxNo || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delSensorYx(yxNos);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('sensor/sensorYx/export', {
    ...queryParams.value
  }, `sensorYx_${new Date().getTime()}.xlsx`)
}

getList();
</script>
<style>
.toolsline{
  height: 30px;
}
</style>
