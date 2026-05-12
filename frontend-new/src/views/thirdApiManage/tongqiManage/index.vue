<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="企业名称" prop="deptId">
        <tree-select
            v-model:value="queryParams.deptId"
            :options="deptOptions"
            placeholder="请选择归属公司"
            :objMap="{ value: 'id', label: 'label', children: 'children' }"
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
            v-hasPermi="['thirdApiManage:tongqiManage:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['thirdApiManage:tongqiManage:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['thirdApiManage:tongqiManage:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['thirdApiManage:tongqiManage:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 300px)" v-loading="loading" :data="tongqiManageList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="id" align="center" prop="id"/>
      <el-table-column label="企业名称" align="center" prop="deptName"/>
      <el-table-column label="网关名称" align="center" prop="termimalName" />
      <el-table-column label="设备名称" align="center" prop="equipmentName" />
      <el-table-column label="同企接口地址" align="center" prop="tongqiHost"/>
      <el-table-column label="同企企业编码" align="center" prop="enterpriseCode"/>
      <el-table-column label="mqtt主题" align="center" prop="mqttTopic"/>
<!--      <el-table-column label="状态" align="center" prop="status"/>-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['thirdApiManage:tongqiManage:edit']"
          >修改
          </el-button>
          <el-button
              type="text"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['thirdApiManage:tongqiManage:remove']"
          >删除
          </el-button>
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

    <!-- 添加或修改同企接口管理对话框 -->
    <el-dialog :title="title" v-model="open" width="900px" append-to-body>
      <el-form ref="tongqiManageRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="公司名称" prop="deptId">
          <tree-select
              v-model:value="form.deptId"
              :options="deptOptions"
              placeholder="请选择归属部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
              @func="getMsg"
          />
        </el-form-item>
        <el-form-item label="网关" prop="terminalSerial">
          <el-select v-model="form.terminalSerial" @change="changeEquipment" clearable filterable placeholder="请选择">
            <el-option
                v-for="item in terminalOptions"
                :key="item.termCode"
                :label="item.termName"
                :value="item.termCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备" prop="equipmentSerial">
          <el-select v-model="form.equipmentSerial" @change="changePoints" clearable filterable placeholder="请选择">
            <el-option
                v-for="item in equipmentOptions"
                :key="item.equipmentId"
                :label="item.equipmentName"
                :value="item.equipmentId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="同企接口地址" prop="tongqiHost">
          <el-input v-model="form.tongqiHost" placeholder="请输入同企接口地址"/>
        </el-form-item>
        <el-form-item label="同企企业编码" prop="enterpriseCode">
          <el-input v-model="form.enterpriseCode" placeholder="请输入同企企业编码"/>
        </el-form-item>
        <el-form-item label="mqtt主题" prop="mqttTopic">
          <el-input v-model="form.mqttTopic" placeholder="请输入mqtt主题"/>
        </el-form-item>
        <el-divider content-position="center">同企接口测点信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddTongqiPoints">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeleteTongqiPoints">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" @click="handlexport">导出</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" @click="handleimport">导入</el-button>
          </el-col>
        </el-row>
        <el-table :data="tongqiPointsList" :row-class-name="rowTongqiPointsIndex"
                  @selection-change="handleTongqiPointsSelectionChange" ref="tongqiPoints">
          <el-table-column type="selection" width="50" align="center"/>
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="测点名称" prop="pointName" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.pointName" placeholder="请输入测点名称"/>
            </template>
          </el-table-column>
          <el-table-column label="地址码" prop="pointSerial" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.pointSerial" placeholder="请输入地址码"/>
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="pointUnit" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.pointUnit" placeholder="请输入单位"/>
            </template>
          </el-table-column>
          <el-table-column label="传感器编码" prop="sensorCode" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.sensorCode" placeholder="请输入传感器编码"/>
            </template>
          </el-table-column>
          <el-table-column label="传感器类型" prop="sensorType" width="150">
            <template #default="scope">
              <el-select v-model="scope.row.sensorType" placeholder="请选择传感器类型">
                <el-option label="温度" value="温度"/>
                <el-option label="压力" value="压力"/>
                <el-option label="液位" value="液位"/>
                <el-option label="有毒气体浓度" value="有毒气体浓度"/>
                <el-option label="可燃气体浓度" value="可燃气体浓度"/>
                <el-option label="其他" value="其他"/>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!--导入-->
    <el-dialog :title="upload.title" v-model="upload.importOpen" width="400px" append-to-body>
      <el-upload
          ref="uploadRef"
          :limit="1"
          :headers="upload.headers"
          :action="upload.url"
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

<script setup name="TongqiManage">
import {
  listTongqiManage,
  getTongqiManage,
  delTongqiManage,
  addTongqiManage,
  updateTongqiManage
} from "@/api/thirdApiManage/tongqiManage";
import {treeselect} from "@/api/system/dept";
import {getTerminalByDept} from "@/api/sensor/terminal";
import {listSensor} from "@/api/sensor/sensor";
import {listSensorYc} from "@/api/sensor/sensorYc";
import {listSensorYx} from "@/api/sensor/sensorYx";
import {listSensorYk} from "@/api/sensor/sensorYk";
import {listDept} from "@/api/system/dept";
import {listTerminal} from "../../../api/sensor/terminal";
import {h, ref} from "vue";
import {getToken} from "../../../utils/auth";
const {proxy} = getCurrentInstance();

const tongqiManageList = ref([]);
const tongqiPointsList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const checkedTongqiPoints = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const deptOptions = ref(undefined);
const terminalOptions = ref(undefined);
const equipmentOptions = ref(undefined);

const data = reactive({
  form: {},
  poitform: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deptId: null,
    terminalSerial: null,
    equipmentSerial: null,
    status: null
  },
  rules: {
    deptId: [
      { required: true, message: '请选择公司名称', trigger: 'blur' }
    ],
  }
});

const upload = reactive({
  // 是否显示弹出层（设备导入）
  importOpen: false,
  // 弹出层标题（设备导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: {Authorization: "Bearer " + getToken()},
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/thirdApiManage/tongqiManage/importData"
});

const {queryParams, form, rules, poitform} = toRefs(data);

/** 查询同企接口管理列表 */
function getList() {
  loading.value = true;
  listTongqiManage(queryParams.value).then(response => {
    tongqiManageList.value = response.rows;
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
    deptId: null,
    deptName: null,
    terminalSerial: null,
    termimalName: null,
    equipmentSerial: null,
    equipmentName: null,
    tongqiHost: null,
    enterpriseCode: null,
    mqttTopic: null,
    createTime: null,
    updateTime: null,
    status: 0
  };
  tongqiPointsList.value = [];
  proxy.resetForm("tongqiManageRef");
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
  title.value = "添加同企接口管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getTongqiManage(id).then(response => {
    form.value = response.data;
    tongqiPointsList.value = response.data.tongqiPointsList;
    open.value = true;
    title.value = "修改同企接口管理";
    gettermAndequip();
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["tongqiManageRef"].validate(valid => {
    if (valid) {
      form.value.tongqiPointsList = tongqiPointsList.value;
      if (form.value.id != null) {
        updateTongqiManage(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addTongqiManage(form.value).then(response => {
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
    return delTongqiManage(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 同企接口测点序号 */
function rowTongqiPointsIndex({row, rowIndex}) {
  row.index = rowIndex + 1;
}

/** 同企接口测点添加按钮操作 */
function handleAddTongqiPoints() {
  let obj = {};
  obj.pointName = "";
  obj.pointSerial = "";
  obj.pointUnit = "";
  obj.sensorCode = "";
  obj.sensorType = "";
  tongqiPointsList.value.push(obj);
}

/** 同企接口测点删除按钮操作 */
function handleDeleteTongqiPoints() {
  if (checkedTongqiPoints.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的同企接口测点数据");
  } else {
    const tongqiPointss = tongqiPointsList.value;
    const checkedTongqiPointss = checkedTongqiPoints.value;
    tongqiPointsList.value = tongqiPointss.filter(function (item) {
      return checkedTongqiPointss.indexOf(item.index) == -1
    });
  }
}

/** 复选框选中数据 */
function handleTongqiPointsSelectionChange(selection) {
  checkedTongqiPoints.value = selection.map(item => item.index)
}

function handlexport(){
  let list = [];
  tongqiPointsList.value.forEach((j, index) => {
    list.push({
      pointName:j.pointName,
      pointSerial:j.pointSerial,
      pointUnit:j.pointUnit,
      sensorCode:j.sensorCode,
      sensorType:j.sensorType
    })
  })
  console.log(list)
  queryParams.value.tongqiPointsListstr = JSON.stringify(list);
  console.log(queryParams.value)
  proxy.download('thirdApiManage/tongqiManage/exportpoit', {
    ...queryParams.value
  }, `tongqiManage_${new Date().getTime()}.xlsx`)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('thirdApiManage/tongqiManage/export', {
    ...queryParams.value
  }, `tongqiManage_${new Date().getTime()}.xlsx`)
}

/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
};

/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};

const handleFileSuccess = (response, file, fileList) => {
  upload.importOpen = false;
  proxy.$refs["uploadRef"].clearFiles();
  tongqiPointsList.value = response;
  console.log(response)
};

//导入
function handleimport(){
  upload.title = "导入";
  upload.importOpen = true;
}

/** 初始化部门数据 */
function initTreeData() {
  // 判断部门的数据是否存在，存在不获取，不存在则获取
  if (deptOptions.value === undefined) {
    treeselect().then(response => {
      deptOptions.value = response.data;
    });
  }
}

function gettermAndequip() {
  terminalOptions.value = []
  equipmentOptions.value = []
  getTerminalByDept(form.value.deptId).then(res => {
    terminalOptions.value = res;
  })

  listSensor({termCode: form.value.terminalSerial, pageSize: 10000}).then(res => {
    if (res.total > 0) {
      equipmentOptions.value = res.rows;
    } else {
      equipmentOptions.value = []
    }
  })
}

function getMsg(data){
  let val = data.id
  if(val==null || val=='' || val == 'undefined'){
    // proxy.$modal.msgWarning("先选择所属部门");
  }else{
    changeTerminal(val);
  }

}

function changeTerminal(val) {
  terminalOptions.value = []
  equipmentOptions.value = []
  getTerminalByDept(val).then(res => {
    terminalOptions.value = res;
  })
}

function changeEquipment(val) {
  // console.log(val)
  equipmentOptions.value = []
  listSensor({termCode: val, pageSize: 10000}).then(res => {
    if (res.total > 0) {
      equipmentOptions.value = res.rows;
    } else {
      equipmentOptions.value = []
    }
  })
}

function changePoints(val) {
  tongqiPointsList.value = []
  // console.log(val)
  listSensorYc({ycEquipId: val, pageSize: 10000}).then(res => {
    if (res.total > 0) {
      res.rows.forEach(row => {
        tongqiPointsList.value.push({
          pointName: row.ycName,
          pointSerial: row.ycSerial,
          pointUnit: row.ycUnit,
          sensorCode: row.ycTag
        })
      })
    }
  });
  listSensorYx({yxEquipId: val, pageSize: 10000}).then(res => {
    if (res.total > 0) {
      res.rows.forEach(row => {
        tongqiPointsList.value.push({
          pointName: row.yxName,
          pointSerial: row.yxSerial,
          pointUnit: row.yxUnit,
          sensorCode: row.yxTag
        })
      })
    }
  });
  listSensorYk({ykEquipId: val, pageSize: 10000}).then(res => {
    if (res.total > 0) {
      res.rows.forEach(row => {
        tongqiPointsList.value.push({
          pointName: row.ykName,
          pointSerial: row.ykSerial,
          pointUnit: row.ykUnit,
          sensorCode: row.ykTag
        })
      })
    }
  })
}

getList();
initTreeData();
</script>
<style>
.toolsline{
  height: 30px;
}
</style>
