<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="测点名称" prop="ycName">
        <el-input
          v-model="queryParams.ycName"
          placeholder="请输入测点名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="TAG名称" prop="ycTag">
        <el-input
          v-model="queryParams.ycTag"
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
          v-hasPermi="['sensor:sensorYc:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['sensor:sensorYc:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['sensor:sensorYc:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['sensor:sensorYc:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Upload"
          @click="handleImport"
          v-hasPermi="['sensor:sensorYc:import']"
        >导入</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 300px)" v-loading="loading" :data="sensorYcList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="测点编号" align="center" prop="ycNo" />
      <el-table-column label="测点名称" align="center" prop="ycName" />
      <el-table-column label="测点说明" align="center" prop="ycMemo" />
      <el-table-column label="TAG名称" align="center" prop="ycTag" />
      <el-table-column label="测点类型" align="center" prop="ycType" />
      <el-table-column label="地址码" align="center" prop="ycSerial" />
      <el-table-column label="告警上限" align="center" prop="ycAlarmup" />
      <el-table-column label="告警下限" align="center" prop="ycAlarmlow" />
      <el-table-column label="上限" align="center" prop="ycInup" />
      <el-table-column label="下限" align="center" prop="ycInlow" />
      <el-table-column label="小数点位数" align="center" prop="ycDecimal" />
      <el-table-column label="测点基数" align="center" prop="ycBase" />
      <el-table-column label="测点比率" align="center" prop="ycRate" />
<!--      <el-table-column label="是否可见" align="center" prop="ycVisible" >
        <template #default="scope">
          <dict-tag :options="point_visible_status" :value="scope.row.ycVisible"/>
        </template>
      </el-table-column>-->
      <el-table-column label="状态" align="center" prop="ycState" >
        <template #default="scope">
          <dict-tag :options="point_use_status" :value="scope.row.ycState"/>
        </template>
      </el-table-column>
      <el-table-column label="排序号" align="center" prop="ycSort" />
      <el-table-column label="备注" align="center" prop="remark" />
<!--      <el-table-column label="同启平台传感器编码" align="center" prop="tqSensorCode" />-->
<!--      <el-table-column label="同启平台传感器类型" align="center" prop="tqSensorType" >
        <template #default="scope">
          <dict-tag :options="sersor_code" :value="scope.row.tqSensorType"/>
        </template>
      </el-table-column>-->
      <el-table-column label="是否列表显示" align="center" prop="ifshow" />
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width" fixed="right">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['sensor:sensorYc:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sensor:sensorYc:remove']"
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

    <!-- 添加或修改传感器遥测点对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="sensorYcRef" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="测点名称" prop="ycName">
          <el-input v-model="form.ycName" placeholder="请输入测点名称" />
        </el-form-item>
        <el-form-item label="测点说明" prop="ycMemo">
          <el-input v-model="form.ycMemo" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="TAG名称" prop="ycTag">
          <el-input v-model="form.ycTag" placeholder="请输入TAG名称" />
        </el-form-item>
        <el-form-item label="地址码" prop="ycSerial">
          <el-input v-model="form.ycSerial" placeholder="请输入地址码" />
        </el-form-item>
        <el-form-item label="告警上限" prop="ycAlarmup">
          <el-input v-model="form.ycAlarmup" placeholder="请输入告警上限" />
        </el-form-item>
        <el-form-item label="告警下限" prop="ycAlarmlow">
          <el-input v-model="form.ycAlarmlow" placeholder="请输入告警下限" />
        </el-form-item>
        <el-form-item label="上限" prop="ycInup">
          <el-input v-model="form.ycInup" placeholder="请输入上限" />
        </el-form-item>
        <el-form-item label="下限" prop="ycInlow">
          <el-input v-model="form.ycInlow" placeholder="请输入下限" />
        </el-form-item>
        <el-form-item label="小数点位数" prop="ycDecimal">
          <el-input v-model="form.ycDecimal" placeholder="请输入小数点位数" />
        </el-form-item>
        <el-form-item label="测点基数" prop="ycBase">
          <el-input v-model="form.ycBase" placeholder="请输入测点基数" />
        </el-form-item>
        <el-form-item label="测点比率" prop="ycRate">
          <el-input v-model="form.ycRate" placeholder="请输入测点比率" />
        </el-form-item>
        <el-form-item label="单位" prop="ycRate">
          <el-input v-model="form.ycUnit" placeholder="请输入单位" />
        </el-form-item>
<!--        <el-form-item label="显示与否" prop="ycVisible">-->
<!--          <el-select v-model="form.ycVisible" placeholder="请选择是否可见" clearable>-->
<!--            <el-option-->
<!--                v-for="dict in point_visible_status"-->
<!--                :key="dict.value"-->
<!--                :label="dict.label"-->
<!--                :value="dict.value"-->
<!--            />-->
<!--        </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="状态" prop="ycState">
          <el-select v-model="form.ycState" placeholder="请选择状态" clearable>
            <el-option
                v-for="dict in point_use_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            />
        </el-select>
        </el-form-item>
        <el-form-item label="排序号" prop="ycSort">
          <el-input v-model="form.ycSort" placeholder="请输入排序号" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
<!--        <el-form-item label="同启平台传感器类型" prop="tqSensorType">-->
<!--          <el-select v-model="form.tqSensorType" placeholder="请选择同启平台传感器类型" clearable>-->
<!--          <el-option-->
<!--              v-for="dict in sersor_code"-->
<!--              :key="dict.value"-->
<!--              :label="dict.label"-->
<!--              :value="dict.value"-->
<!--          />-->
<!--        </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="同启平台传感器编码" prop="tqSensorCode">-->
<!--          <el-input v-model="form.tqSensorCode" placeholder="请输入同启平台传感器编码" />-->
<!--        </el-form-item>-->
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

<script setup name="SensorYc">
import {getToken} from "@/utils/auth";
import { listSensorYc, getSensorYc, delSensorYc, addSensorYc, updateSensorYc } from "@/api/sensor/sensorYc";
import {h} from "vue";

const { proxy } = getCurrentInstance();
const {point_visible_status,point_use_status,sersor_code} = proxy.useDict("point_visible_status","point_use_status","sersor_code");
const sensorYcList = ref([]);
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
  url: import.meta.env.VITE_APP_BASE_API + "/sensor/sensorYc/importData"
});

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    ycName: null,
    ycMemo: null,
    ycTag: null,
    ycType: null,
    ycEquipId:  route.params && route.params.equipmentId,
    ycSerial: null,
    ycAlarmup: null,
    ycAlarmlow: null,
    ycInup: null,
    ycInlow: null,
    ycDecimal: null,
    ycBase: null,
    ycRate: null,
    ycUnit: null,
    ycValue: null,
    ycTemp: null,
    ycDt: null,
    ycVisible: null,
    ycState: null,
    ycSort: null,
    tenantId: null,
    xxx: null,
    yyy: null,
    tqSensorCode: null,
    tqSensorType: null,
    ycNoHash: null,
  },
  rules: {
    ycName: [
      { required: true, message: "测点名称不能为空", trigger: "blur" }
    ],
    ycSerial: [
      { required: true, message: "地址码不能为空", trigger: "blur" }
    ],
    // ycVisible: [
    //   { required: true, message: "可见否不能为空", trigger: "blur" }
    // ],
    // ycState: [
    //   { required: true, message: "状态不能为空", trigger: "blur" }
    // ],
  },
  equipmentId: route.params && route.params.equipmentId
});

const { queryParams, form, rules } = toRefs(data);
function handleImport(){
  upload.title = "遥测点位导入";
  upload.open = true;
}
/** 下载模板操作 */
function importTemplate() {
  proxy.download("sensor/sensorYc/importTemplate", {}, `sensorYc_template_${new Date().getTime()}.xlsx`);
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
/** 查询传感器遥测点列表 */
function getList() {
  loading.value = true;
  listSensorYc(queryParams.value).then(response => {
    sensorYcList.value = response.rows;
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
    ycNo: null,
    ycName: null,
    ycMemo: null,
    ycTag: null,
    ycType: null,
    ycEquipId: route.params && route.params.equipmentId,
    ycSerial: null,
    ycAlarmup: null,
    ycAlarmlow: null,
    ycInup: null,
    ycInlow: null,
    ycDecimal: null,
    ycBase: null,
    ycRate: null,
    ycUnit: null,
    ycValue: null,
    ycTemp: null,
    ycDt: null,
    ycVisible: null,
    ycState: null,
    ycSort: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null,
    tenantId: null,
    xxx: null,
    yyy: null,
    tqSensorCode: null,
    tqSensorType: null,
    ycNoHash: null
  };
  proxy.resetForm("sensorYcRef");
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
  ids.value = selection.map(item => item.ycNo);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加传感器遥测点";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const ycNo = row.ycNo || ids.value
  getSensorYc(ycNo).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改传感器遥测点";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["sensorYcRef"].validate(valid => {
    if (valid) {
      if (form.value.ycNo != null) {
        updateSensorYc(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSensorYc(form.value).then(response => {
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
  const ycNos = row.ycNo || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delSensorYc(ycNos);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('sensor/sensorYc/export', {
    ...queryParams.value
  }, `sensorYc_${new Date().getTime()}.xlsx`)
}

getList();
</script>
<style>
.toolsline{
  height: 30px;
}
</style>
