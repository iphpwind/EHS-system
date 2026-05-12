<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
              v-model="deptName"
              placeholder="请输入部门名称"
              clearable
              prefix-icon="Search"
              style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container down-tree">
          <el-tree
              :data="deptOptions"
              :props="{ label: 'label', children: 'children' }"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="deptTreeRef"
              default-expand-all
              @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
          <el-form-item label="传感器名称" prop="equipmentName">
            <el-input
                v-model="queryParams.equipmentName"
                placeholder="请输入传感器名称"
                clearable
                @keyup.enter="handleQuery"
            />
          </el-form-item>

          <!--      <el-form-item label="规格型号" prop="equipmentSpec">-->
          <!--        <el-input-->
          <!--          v-model="queryParams.equipmentSpec"-->
          <!--          placeholder="请输入规格型号"-->
          <!--          clearable-->
          <!--          @keyup.enter="handleQuery"-->
          <!--        />-->
          <!--      </el-form-item>-->
          <!--      <el-form-item label="传感器厂商" prop="equipmentFactory">-->
          <!--        <el-input-->
          <!--          v-model="queryParams.equipmentFactory"-->
          <!--          placeholder="请输入传感器厂商"-->
          <!--          clearable-->
          <!--          @keyup.enter="handleQuery"-->
          <!--        />-->
          <!--      </el-form-item>-->
          <el-form-item label="传感器地址码" prop="equipmentSerial">
            <el-input
                v-model="queryParams.equipmentSerial"
                placeholder="请输入传感器地址码"
                clearable
                @keyup.enter="handleQuery"
            />
          </el-form-item>


          <!--      <el-form-item label="传感器模型" prop="model">-->
          <!--        <el-input-->
          <!--          v-model="queryParams.model"-->
          <!--          placeholder="请输入传感器模型"-->
          <!--          clearable-->
          <!--          @keyup.enter="handleQuery"-->
          <!--        />-->
          <!--      </el-form-item>-->
          <el-form-item label="网关" prop="termCode">
            <el-input
                v-model="queryParams.termCode"
                placeholder="请输入网关"
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
                v-hasPermi="['sensor:sensor:add']"
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
                v-hasPermi="['sensor:sensor:edit']"
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
                v-hasPermi="['sensor:sensor:remove']"
            >删除
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="warning"
                plain
                icon="Download"
                @click="handleExport"
                v-hasPermi="['sensor:sensor:export']"
            >导出
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="warning"
                plain
                icon="Download"
                @click="exportform"
            >导出模板
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="primary"
                plain
                icon="upload"
                @click="handleImport"
            >传感器导入
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="danger"
                plain
                icon="el-icon-refresh"
                @click="batchCurrent"
            >批量同步
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="danger"
                plain
                icon="el-icon-refresh"
                @click="batchReloadPoint"
            >批量重新加载点位
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table height="calc(100vh - 300px)" v-loading="loading" :data="sensorList"
                  @selection-change="handleSelectionChange" ref="listTable">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="传感器ID" align="center" prop="equipmentId" width="180"/>
          <el-table-column label="传感器名称" align="center" prop="equipmentName" width="100"/>
          <el-table-column label="传感器编号" align="center" prop="equipmentCode" width="100"/>
          <el-table-column label="传感器s/n" align="center" prop="sn" width="100"/>
          <el-table-column label="传感器地址码" align="center" prop="equipmentSerial" width="120"/>
          <el-table-column label="状态" align="center" prop="equipmentCurr">
            <template #default="scope">
              <span v-if="scope.row.equipmentCurr == 0">离线</span>
              <span v-if="scope.row.equipmentCurr == 1">在线</span>
            </template>
          </el-table-column>
          <!--      <el-table-column label="时间" align="center" prop="equipmentDt" />-->
          <el-table-column label="最后通信时间" align="center" prop="equipmentCommtime" width="180">
            <template #default="scope">
              <span>{{ parseTime(scope.row.equipmentCommtime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="传感器模型" align="center" prop="modalName" width="110"/>
          <el-table-column label="网关" align="center" prop="termName"/>
          <!--      <el-table-column label="备注" align="center" prop="remark" />-->
          <!--      <el-table-column label="出场日期" align="center" prop="manufactureDate" width="120">-->
          <!--        <template #default="scope">-->
          <!--          <span>{{ parseTime(scope.row.manufactureDate, '{y}-{m}-{d}') }}</span>-->
          <!--        </template>-->
          <!--      </el-table-column>-->
          <!--      <el-table-column label="投产日期" align="center" prop="productionDate" width="120">-->
          <!--        <template #default="scope">-->
          <!--          <span>{{ parseTime(scope.row.productionDate, '{y}-{m}-{d}') }}</span>-->
          <!--        </template>-->
          <!--      </el-table-column>-->
          <!--      <el-table-column label="质保开始日期" align="center" prop="startDate" width="120">-->
          <!--        <template #default="scope">-->
          <!--          <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d}') }}</span>-->
          <!--        </template>-->
          <!--      </el-table-column>-->
          <!--      <el-table-column label="质保结束日期" align="center" prop="endDate" width="120">-->
          <!--        <template #default="scope">-->
          <!--          <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>-->
          <!--        </template>-->
          <!--      </el-table-column>-->
          <el-table-column label="使用状态" align="center" prop="delFlag" width="100">
            <template #default="scope">
              <span v-if="scope.row.delFlag == 0">启用</span>
              <span v-if="scope.row.delFlag == 1">停用</span>
            </template>
          </el-table-column>
          <el-table-column label="部门" align="center" prop="deptName" width="100"/>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width operate" width="300"
                           fixed="right">
            <template #default="scope">

              <div>
                <el-button
                    type="text"
                    icon="Edit"
                    @click="handleUpdate(scope.row)"
                    v-hasPermi="['sensor:sensor:edit']"
                >修改
                </el-button>
                <el-button
                    type="text"
                    icon="Delete"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['sensor:sensor:remove']"
                >删除
                </el-button>

                <el-popover
                    placement="left"
                    :width="500"
                    trigger="hover"
                >
                  <router-link :to="'/sensor/sensorYc/index/' + scope.row.equipmentId" class="link-type yaoli">
                    <el-button type="text" icon="Document">遥测</el-button>
                  </router-link>
                  <router-link :to="'/sensor/sensorYx/index/' + scope.row.equipmentId" class="link-type yaoli">
                    <el-button type="text" icon="DocumentRemove">遥信</el-button>
                  </router-link>
                  <router-link :to="'/sensor/sensorYk/index/' + scope.row.equipmentId" class="link-type yaoli">
                    <el-button type="text" icon="DocumentCopy">遥控</el-button>
                  </router-link>
                  <router-link :to="'/sensor/sensorYxStatus/index/' + scope.row.equipmentId" class="link-type yaoli">
                    <el-button type="text" icon="DocumentCopy">运行状态</el-button>
                  </router-link>
                  <el-button
                      type="text"
                      icon="Delete"
                      @click="handleDisable(scope.row)"
                      v-hasPermi="['sensor:sensor:sync']"
                  ><span v-if="scope.row.delFlag == 0">停用</span>
                    <span v-if="scope.row.delFlag == 1">启用</span></el-button>
                  <el-button
                      type="text"
                      icon="Delete"
                      @click="handleSyncRedis(scope.row)"
                      v-hasPermi="['sensor:sensor:sync']"
                  >同步
                  </el-button>
                  <el-button
                      type="text"
                      icon="Delete"
                      @click="handleReloadAllPoint(scope.row)"
                      v-hasPermi="['sensor:sensor:reloadAllPoint']"
                  >重新加载点位
                  </el-button>
                  <template #reference>
                    <el-button>更多</el-button>
                  </template>
                </el-popover>


              </div>
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

        <!-- 添加或修改传感器管理对话框 -->
        <el-dialog :title="title" v-model="open" width="600px" append-to-body>
          <el-form ref="sensorRef" :model="form" :rules="rules" label-width="150px">
            <el-form-item label="传感器名称" prop="equipmentName">
              <el-input v-model="form.equipmentName" placeholder="请输入传感器名称"/>
            </el-form-item>
            <el-form-item label="传感器编号" prop="equipmentCode">
              <el-input v-model="form.equipmentCode" placeholder="请输入传感器编号"/>
            </el-form-item>

            <el-form-item label="规格型号" prop="equipmentSpec">
              <el-input v-model="form.equipmentSpec" placeholder="请输入规格型号"/>
            </el-form-item>
            <el-form-item label="传感器厂商" prop="equipmentFactory">
              <el-input v-model="form.equipmentFactory" placeholder="请输入传感器厂商"/>
            </el-form-item>
            <el-form-item label="传感器地址码" prop="equipmentSerial">
              <el-input v-model="form.equipmentSerial" placeholder="请输入传感器地址码"/>
            </el-form-item>
            <el-form-item label="归属部门" prop="deptId">
              <tree-select
                  v-model:value="form.deptId"
                  :options="deptOptions"
                  placeholder="请选择归属部门"
                  :objMap="{ value: 'id', label: 'label', children: 'children' }"
              />
            </el-form-item>
            <el-form-item label="传感器模板" prop="model">
              <el-select v-model="form.model" placeholder="选择传感器模板" clearable>
                <el-option
                    v-for="dict in sensorModals"
                    :key="dict.modalCode"
                    :label="dict.modalName"
                    :value="dict.modalCode"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="网关" prop="termCode">
              <el-select v-model="form.termCode" placeholder="选择网关" clearable>
                <el-option
                    v-for="dict in termCodes"
                    :key="dict.termCode"
                    :label="dict.termName"
                    :value="dict.termCode +''"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="所属设备" prop="eqId">
              <el-select v-model="form.eqId" placeholder="请选择所属设备" clearable>
                <el-option
                    v-for="dict in eqs"
                    :key="dict.eqId"
                    :label="dict.eqName"
                    :value="dict.eqName"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"/>
            </el-form-item>
            <el-form-item label="出场日期" prop="manufactureDate">
              <el-date-picker clearable
                              v-model="form.manufactureDate"
                              type="date"
                              value-format="YYYY-MM-DD"
                              placeholder="请选择出场日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="投产日期" prop="productionDate">
              <el-date-picker clearable
                              v-model="form.productionDate"
                              type="date"
                              value-format="YYYY-MM-DD"
                              placeholder="请选择投产日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="质保开始日期" prop="startDate">
              <el-date-picker clearable
                              v-model="form.startDate"
                              type="date"
                              value-format="YYYY-MM-DD"
                              placeholder="请选择质保开始日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="质保结束日期" prop="endDate">
              <el-date-picker clearable
                              v-model="form.endDate"
                              type="date"
                              value-format="YYYY-MM-DD"
                              placeholder="请选择质保结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="图片" prop="equipmentImg">
              <image-upload v-model="form.equipmentImg"/>
            </el-form-item>
            <el-form-item label="是否添加到默认区域" prop="ifDefault">
              <el-radio-group v-model="form.ifDefault">
                <el-radio label="是"></el-radio>
                <el-radio label="否"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否可控" prop="commandFlag">
              <el-select v-model="form.commandFlag" placeholder="请选择状态" clearable>
                <el-option label="是" value="1"/>
                <el-option label="否" value="0"/>
              </el-select>
            </el-form-item>
            <el-form-item label="排序" prop="sortNum">
              <el-input v-model="form.sortNum" type="input" placeholder="请输入内容"/>
            </el-form-item>
            <el-form-item label="推送用户" prop="tsUser">
              <span>{{form.userNames}}</span>
              <el-button type="primary" style="margin-left: 10px;" @click="selectUser">选择推送人</el-button>
            </el-form-item>
          </el-form>
          <template #footer>
            <div class="dialog-footer">
              <el-button type="primary" @click="submitForm">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
            </div>
          </template>
        </el-dialog>

        <!-- 设备导入对话框 -->
        <el-dialog :title="upload.title" v-model="upload.importOpen" width="400px" append-to-body>
          <el-form>
            <el-form-item label="传感器模板" prop="model">
              <el-select v-model="upload.model" placeholder="选择传感器模板" clearable>
                <el-option
                    v-for="dict in sensorModals"
                    :key="dict.modalCode"
                    :label="dict.modalName"
                    :value="dict.modalCode"
                />
              </el-select>
            </el-form-item>
          </el-form>

          <el-upload
              ref="uploadRef"
              :limit="1"
              accept=".xlsx, .xls"
              :headers="upload.headers"
              :action="upload.url + '?modal=' + upload.model"
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
              <el-button @click="upload.open = false">取 消</el-button>
            </div>
          </template>
        </el-dialog>

        <!-- 选择责任人员 -->
        <el-dialog title="选择责任人" v-model="visible" width="800px" top="5vh" append-to-body>
          <el-row>
            <el-table @row-click="clickRow" ref="table" :data="userOptions" @selection-change="handleSelectionChange2"
                      height="260px">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="userId" label="人员编号" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="nickName" label="人员名称" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="dept.deptName" label="部门" :show-overflow-tooltip="true"></el-table-column>
            </el-table>
          </el-row>
          <template #footer>
            <div class="dialog-footer">
              <el-button type="primary" @click="handleUserIds">确 定</el-button>
            </div>
          </template>
        </el-dialog>

      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Sensor">
import {treeselect} from "@/api/system/dept";
import {
  listSensor,
  getSensor,
  delSensor,
  addSensor,
  updateSensor,
  updateDataForRedis,
  updateSensorSatus,
  getEquipmentList,
  reloadAllPoint,
  updateBatchDataForRedis,
  batchReloadAllPoint
} from "@/api/sensor/sensor";
import {listTerminal} from "@/api/sensor/terminal";
import {listModal} from "@/api/sensor/modal";
import {getToken} from "../../../utils/auth";
import { listUser } from "@/api/system/user";
import {h} from "vue";

const {proxy} = getCurrentInstance();

const sensorList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const termCodes = ref([]);
const sensorModals = ref([]);
const eqs = ref([]);
const deptOptions = ref(undefined);
const deptName = ref("");
const userOptions = ref([]);
const visible = ref(false);
const tables = ref([]);
const tableNames = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    equipmentName: null,
    equipmentCode: null,
    sn: null,
    equipmentSpec: null,
    equipmentFactory: null,
    equipmentSerial: null,
    equipmentCurr: null,
    equipmentDt: null,
    equipmentCommtime: null,
    model: null,
    termCode: null,
    manufactureDate: null,
    productionDate: null,
    startDate: null,
    endDate: null,
    deptId: null
  },
  rules: {
    equipmentName: [{required: true, message: "传感器名称不能为空", trigger: "blur"}],
    equipmentSerial: [{required: true, message: "传感器地址不能为空", trigger: "blur"}],
    termCode: [{required: true, message: "网关不能为空", trigger: "blur"}]
  }
});

const {queryParams, form, rules} = toRefs(data);
const upload = reactive({
  // 是否显示弹出层（设备导入）
  importOpen: false,
  // 弹出层标题（设备导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  model: '',
  // 设置上传的请求头部
  headers: {Authorization: "Bearer " + getToken()},
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/sensor/sensor/importData"
});

const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
watch(deptName, val => {
  proxy.$refs["deptTreeRef"].filter(val);
});

function exportform() {
  proxy.download('sensor/sensor/exportTemplate', {
    ...queryParams.value
  }, `sensor_${new Date().getTime()}.xlsx`)
}

function handleImport() {
  getSensorTemplateList();
  upload.title = "导入";
  upload.importOpen = true;
}
/** 查询责任人列表 **/
function getUserList(){
  listUser().then(response => {
    userOptions.value = response.rows;
  });
}
/** 选择责任人按钮 **/
function selectUser(){
  visible.value = true;

  if(form.value.tsUser != null && form.value.tsUser != ""){
    const userIds = form.value.tsUser.split(",");

    proxy.$nextTick(() => {
      userOptions.value.forEach((user) => {
        userIds.forEach(userId => {
          if(Number(userId) == user.userId){
            proxy.$refs.table.toggleRowSelection(user,true);
          }
        })
      });
    })
  }
}
/** 单击选择行 */
function clickRow(row) {
  proxy.$refs.table.toggleRowSelection(row);
}

/** 多选框选中数据 */
function handleSelectionChange2(selection) {
  tables.value = selection.map(item => item.userId);
  tableNames.value = selection.map(item => item.nickName);
}
function handleUserIds() {
  const userIds = tables.value.join(",");
  const userNames = tableNames.value.join(",");
  if (userIds == "") {
    proxy.$modal.msgError("请选择推送人员");
    return;
  }
  form.value.tsUser = userIds;
  form.value.userNames = userNames;
  visible.value = false;
}
/** 提交上传文件 */
function submitFileForm() {
  if (upload.model != null && upload.model != '') {
    proxy.$refs["uploadRef"].submit();
  } else {
    proxy.$modal.msgError("请先选择传感器模板");
  }

};

const handleFileSuccess = (response, file, fileList) => {
  upload.importOpen = false;
  proxy.$refs["uploadRef"].clearFiles();
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
  getList();
};

/** 导出按钮操作 */
function handleExport() {
  proxy.download('sensor/sensor/export', {
    ...queryParams.value
  }, `sensor_${new Date().getTime()}.xlsx`)
}

/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.deptId = data.id;
  handleQuery();
};

function batchCurrent() {
  if (ids.value && ids.value.length > 0) {
    updateBatchDataForRedis(ids.value).then(res => {
      proxy.$modal.msg(res.msg)
    })
  } else {
    proxy.$modal.msg('请选择数据')
  }
}

function batchReloadPoint() {
  if (ids.value && ids.value.length > 0) {
    let sensors = []
    for (let i = 0; i < sensorList.value.length; i++) {
      for (let j = 0; j < ids.value.length; j++) {
        if (ids.value[j] == sensorList.value[i].equipmentId) {
          sensors.push(sensorList.value[i])
        }
      }
    }
    console.log(sensors)
    batchReloadAllPoint(sensors).then(res => {
      proxy.$modal.msg(res.msg)
    })
  } else {
    proxy.$modal.msg('请选择数据')
  }

}

/** 查询部门下拉树结构 */
function getTreeselect() {
  treeselect().then(response => {
    deptOptions.value = response.data;
  });
};

// 获取设备列表
function getEquipList() {
  getEquipmentList().then(response => {
    eqs.value = response.data
  })
}

function handleReloadAllPoint(row) {
  reloadAllPoint(row).then(response => {
    proxy.$modal.msg(response.msg)
  })
}

/**
 * 停用传感器
 */
function handleDisable(row) {
  var equipParams = {
    equipmentId: row.equipmentId,
    delFlag: row.delFlag
  }
  updateSensorSatus(equipParams).then(response => {
    proxy.$modal.msg(response.msg);
    getList();
  })
  // getTerminal(termCode).then(response => {
  //   form.value = response.data;
  //   open.value = true;
  //   title.value = "修改网关管理";
  // });
}

/**数据同步redis */
function handleSyncRedis(row) {
  updateDataForRedis(row).then(response => {
    proxy.$modal.msg(response.msg)
  })
}

/** 查询传感器模板列表 */
function getSensorTemplateList() {
  listModal().then(response => {
    sensorModals.value = response.rows;
  });
}

/** 查询网关列表 */
function getTerminalList() {
  listTerminal().then(response => {
    termCodes.value = response.rows;
  });
}

/** 查询传感器管理列表 */
function getList() {
  loading.value = true;
  listSensor(queryParams.value).then(response => {
    sensorList.value = response.rows;
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
    equipmentId: null,
    equipmentName: null,
    equipmentCode: null,
    sn: null,
    equipmentSpec: null,
    equipmentFactory: null,
    equipmentSerial: null,
    equipmentCurr: null,
    equipmentDt: null,
    equipmentCommtime: null,
    model: null,
    termCode: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null,
    manufactureDate: null,
    productionDate: null,
    startDate: null,
    endDate: null,
    delFlag: null,
    deptId: null
  };
  proxy.resetForm("sensorRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  queryParams.value.deptId = "";
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.equipmentId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  form.value.ifDefault = '是';
  open.value = true;
  title.value = "添加传感器管理";
  getTerminalList();
  getSensorTemplateList();
  getEquipList();
  getTreeselect();
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  getSensorTemplateList();
  const equipmentId = row.equipmentId || ids.value
  getSensor(equipmentId).then(response => {
    if(response.data.tsUser != null && response.data.tsUser != ""){
      response.data.userIdArray = response.data.tsUser.split(",");
      var userNames = [];
      for(let id of response.data.userIdArray){
        for(let user of userOptions.value){
          if(Number(id) == user.userId){
            userNames.push(user.nickName);
          }
        }
      }
      response.data.userNames = userNames.join(',');
    }
    form.value = response.data;
    open.value = true;
    title.value = "修改传感器管理";
  });
  getTerminalList();
  getEquipList();
  getTreeselect();
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["sensorRef"].validate(valid => {
    if (valid) {
      if (form.value.equipmentId != null) {
        updateSensor(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSensor(form.value).then(response => {
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
  const equipmentIds = row.equipmentId || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    delSensor(equipmentIds).then(response => {
      proxy.$modal.msg(response.msg);
      getList();
    })
  }).then(() => {
    getList();
  }).catch(() => {
  });
}

getUserList();
getTreeselect();
getList();
</script>

<style lang="scss" scoped>
.yaoli {
  margin-right: 12px;
}

.toolsline {
  height: 30px;
}

//.app-container{
//  .operate{
//    .blue{
//      background: #409eff;
//    }
//    .orange{
//      background: #f79503;
//    }
//    .green{
//      background: #67c23a;
//    }
//    span{
//      border-radius: 50px;
//      background: #409eff;
//      padding: 2px 10px;
//      font-size: 12px;
//      margin-right: 4px;
//      color: #fff;
//    }
//  }
//
//}
</style>
