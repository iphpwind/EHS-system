<template>
  <div class="app-container">
    <el-card :body-style="{ padding: '10px' }">
    <el-row :gutter="20">
      <!--组织数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container tree">
          <h4>区域设备导航</h4>
          <el-input
              v-model="sectionName"
              placeholder="请输入组织名称"
              clearable
              prefix-icon="Search"
              style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container tree down-tree">
          <el-tree
              :data="sectionOptions"
              :props="{ label: 'label', children: 'children' }"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="sectionTreeRef"
              default-expand-all
              @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--设备数据-->
      <el-col :span="20" :xs="24" style="border-left: 1px solid rgb(231, 232, 237);">
				<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
					<el-form-item label="设备运行状态" prop="runningState" label-width="100px">
					<el-select v-model="queryParams.runningState" placeholder="请选择设备运行状态" clearable>
						<el-option
						v-for="dict in unit_device_running_state"
						:key="dict.value"
						:label="dict.label"
						:value="dict.value"
						/>
					</el-select>
					</el-form-item>
					<el-form-item label="状态" prop="status">
					<el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
						<el-option
						v-for="dict in unit_status"
						:key="dict.value"
						:label="dict.label"
						:value="dict.value"
						/>
					</el-select>
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
						v-hasPermi="['unitManage:device:add']"
					>新增</el-button>
					</el-col>
					<el-col :span="1.5">
					<el-button
						type="success"
						plain
						icon="Edit"
						:disabled="single"
						@click="handleUpdate"
						v-hasPermi="['unitManage:device:edit']"
					>修改</el-button>
					</el-col>
					<el-col :span="1.5">
					<el-button
						type="danger"
						plain
						icon="Delete"
						:disabled="multiple"
						@click="handleDelete"
						v-hasPermi="['unitManage:device:remove']"
					>移除</el-button>
					</el-col>
					<el-col :span="1.5">
					<el-button
						type="warning"
						plain
						icon="Download"
						@click="handleExport"
						v-hasPermi="['unitManage:device:export']"
					>导出</el-button>
					</el-col>
					<right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
				</el-row>

				<el-table height="calc(100vh - 330px)" v-loading="loading" :data="deviceList" @selection-change="handleSelectionChange"  style="min-height: calc(100vh - 300px);">
					<el-table-column type="selection" width="55" align="center" />
					<el-table-column label="设备编号" align="center" prop="eqCode" />
					<el-table-column label="设备名称" align="center" prop="eqName" />
					<el-table-column label="设备类型" align="center" prop="className" />
					<el-table-column label="累计运行时间(小时)" align="center" prop="runningHours" />
					<el-table-column label="设备运行状态" align="center" prop="runningState">
					<template #default="scope">
						<dict-tag :options="unit_device_running_state" :value="scope.row.runningState"/>
					</template>
					</el-table-column>
					<!-- <el-table-column label="归属部门" align="center" prop="deptName" /> -->
					<el-table-column label="标识状态" align="center" prop="status">
						<template #default="scope">
							<dict-tag :options="unit_status" :value="scope.row.status"/>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="300px" fixed="right">
					<template #default="scope">
						<el-button
						type="text"
						icon="Edit"
						@click="handleUpdate(scope.row)"
						v-hasPermi="['unitManage:device:edit']"
						>修改</el-button>
						<el-button
						v-if="scope.row.runningState == '0'"
						type="text"
						icon="switch-button"
						@click="handleSwitch(scope.row)"
						v-hasPermi="['unitManage:device:edit']"
						style="color: #f56c6c;"
						>待机</el-button>
						<el-button
						v-if="scope.row.runningState == '1'"
						type="text"
						icon="switch-button"
						@click="handleSwitch(scope.row)"
						v-hasPermi="['unitManage:device:edit']"
						>运行</el-button>
						<el-button
						type="text"
						icon="Delete"
						@click="handleDelete(scope.row)"
						v-hasPermi="['unitManage:device:remove']"
						>移除</el-button>
            <el-button
                type="text"
                icon="list"
                @click="handleDeviceFiles(scope.row)"
            >设备档案</el-button>
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


      </el-col>
    </el-row>


    <!-- 添加或修改单元设备对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="deviceRef" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="设备编号" prop="eqCode">
          <el-input v-model="form.eqCode" placeholder="请输入设备编号" disabled/>
        </el-form-item>
        <el-form-item label="设备运行时间" prop="runningTime">
          <el-date-picker clearable
            v-model="form.runningTime"
						type="datetime"
						value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择设备运行时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="设备运行状态">
          <el-radio-group v-model="form.runningState">
            <el-radio
              v-for="dict in unit_device_running_state"
              :key="dict.value"
:label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in unit_status"
              :key="dict.value"
:label="dict.value"
            >{{dict.label}}</el-radio>
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
      <el-dialog v-model="infoopen" width="500px" append-to-body>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="设备属性" name="first">
            <div>
              <div class="attr-buttom">
              <el-row :gutter="10">
                <el-col :span="12">名称</el-col>
                <el-col :span="12">值</el-col>
              </el-row>
              </div>
              <div v-for="(value,index) in form.eqAttributesList" class="attrli">
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-input readonly  v-model="value.attrName"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input readonly v-model="value.attrValue"></el-input>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="维修记录" name="second">
            <el-table
              :data="wxtableData"
              stripe="true"
              border
              style="width: 100%"
          >
            <el-table-column prop="id" label="工单号"/>
            <el-table-column prop="sectionName" label="单元"/>
            <el-table-column prop="deviceName" label="设备"/>
            <el-table-column prop="state" label="状态" >
              <template #default="scope">
                <span class="ok" v-if="scope.row.status == 1">待发布</span>
                <span class="ok" v-if="scope.row.status == 2">待维修</span>
                <span class="ok" v-if="scope.row.status == 3">待验收</span>
                <span class="ok" v-if="scope.row.status == 4">暂不整改</span>
                <span class="ok" v-if="scope.row.status == 5">继续整改</span>
                <span class="ok" v-if="scope.row.status == 6">完成</span>
              </template>
            </el-table-column>
            <el-table-column prop="faulttype" label="设备故障" />
            <el-table-column prop="sponsorName" label="发起人" />
            <el-table-column prop="principalName" label="负责人" />
          </el-table>
          <pagination
            :total="wxtotal"
            v-model:page="wxqueryParams.pageNum"
            v-model:limit="wxqueryParams.pageSize"
            @pagination="getWxData"
          />
          </el-tab-pane>
          <el-tab-pane label="保养记录" name="third">
            <el-table
                :data="bytableData"
                stripe="true"
                border
                style="width: 100%"
            >

              <el-table-column prop="eqName" label="设备名称"/>
              <el-table-column prop="maintenanceType" label="保养类型">
                <template #default="scope">
                  <el-row justify="center" v-if="scope.row.maintenanceType == 0">周期保养</el-row>
                  <el-row justify="center" v-else>指定时间保养</el-row>
                </template>
              </el-table-column>
              <el-table-column prop="maintenanceContent" label="保养内容" />
              <el-table-column prop="maintenanceOperatorNames" label="保养操作人" />
              <el-table-column prop="maintenance_confirmer_name" label="保养确认人" />
              <el-table-column prop="maintenanceTime" label="计划保养日期" width="150" />
              <el-table-column prop="status" label="状态" >
                <template #default="scope">
                  <el-row justify="center" v-if="scope.row.status == 0"><el-tag type="success">有效</el-tag></el-row>
                  <el-row justify="center" v-else><el-tag type="danger">无效</el-tag></el-row>
                </template>
              </el-table-column>
            </el-table>

            <!-- 页码 -->
            <div class="pages">
              <pagination
                  background
                  :total="bytotal"
                  v-model:page="byqueryParams.pageNum"
                  v-model:limit="byqueryParams.pageSize"
                  @pagination="getByData"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane label="登记备案" name="fifth">登记备案</el-tab-pane>
          <el-tab-pane label="附件" name="fourth">
            <ul class="list-group list-group-striped">
              <li v-for="(item, index) in fileList" :key="index">
                  {{item.address.substring(item.address.lastIndexOf("/")+1,item.address.length)}}
              </li>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>

    <eq-equipment ref="eqRef" @ok="handleQuery" :sectionId="queryParams.sectionId" :sectionOptions="sectionOptions"/>
      </el-card>
  </div>
</template>

<script setup name="Device">
import { listDevice, listEq, getDevice, delDevice, addDevice, updateDevice,listAllInfo } from "@/api/unitManage/device";
import { treeselect } from "@/api/unitmanage/section";
import eqEquipment from "./eqEquipment";
import {parseTime} from '@/utils/ruoyi'
import { listEquipment, getEquipment, delEquipment, addEquipment, updateEquipment ,addSpotCheck} from "@/api/equipment/equipment";
import { listEquipAttributes } from "@/api/equipment/equipattributes";
import {allWorkorder,listWorkorder,getWorkorder} from "@/api/unitManage/workorder"
import { listMaintenanceinfo,editSta,addMaintenanceinfo } from "@/api/unitmanage/maintenanceinfo";
import { listFiles,addFiles, updateFiles,getFiles, delFiles} from "@/api/equipment/files";
import {h} from "vue";

const { proxy } = getCurrentInstance();
const { unit_device_running_state, unit_status } = proxy.useDict('unit_device_running_state', 'unit_status');

const deviceList = ref([]);
const open = ref(false);
const infoopen = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const codes = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const sectionName = ref("");
const activeName = ref("first");
const sectionOptions = ref(undefined);
const wxtableData = ref([]);
const wxtotal= ref(0);
const bytableData = ref([]);
const bytotal= ref(0);
const fileList = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    runningState: null,
    status: null,
		sectionId: null,
		delFlag: "0"
  },
  wxqueryParams: {
    pageNum: 1,
    pageSize: 10,
    runningState: null,
    status: null,
		sectionId: null,
		delFlag: "0"
  },
  byqueryParams: {
    pageNum: 1,
    pageSize: 10,
    runningState: null,
    status: null,
		sectionId: null,
		delFlag: "0"
  },
  rules: {
    eqId: [
      { required: true, message: "设备id不能为空", trigger: "blur" }
    ],
  },
});

const { queryParams, form, rules,wxqueryParams,byqueryParams } = toRefs(data);

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
/** 根据名称筛选组织树 */
watch(sectionName, val => {
  proxy.$refs["sectionTreeRef"].filter(val);
});



/** 查询组织下拉树结构 */
function getTreeselect() {
  treeselect({status:"0",delFlag:'0'}).then(response => {
    sectionOptions.value = response.data;
  });
};

/** 查询单元设备列表 */
function getList() {
  loading.value = true;
  listDevice(queryParams.value).then(response => {
    deviceList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.sectionId = data.id;
  handleQuery();
};

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    deviceId: null,
    eqId: null,
    runningTime: null,
    runningState: "0",
    status: "0",
    delFlag: "0",
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("deviceRef");
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
  ids.value = selection.map(item => item.deviceId);
  codes.value = selection.map(item => item.eqCode);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  // reset();
  // open.value = true;
  // title.value = "添加单元设备";
    proxy.$refs["eqRef"].show();
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const deviceId = row.deviceId || ids.value
  getDevice(deviceId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改单元设备";
  });
}

/** 待机/运行操作 */
function handleSwitch(row) {
  reset();
  const deviceId = row.deviceId || ids.value
  const eqCodes = row.eqCode || ids.value;
  getDevice(deviceId).then(response => {
    form.value = response.data;
		var msg = "";
		if(response.data.runningState == "0"){
			form.value.runningState = "1";
			msg = "待机";
		}else if(response.data.runningState == "1"){
			form.value.runningState = "0";
			form.value.runningTime = parseTime(new Date());
			msg = "运行";
		}
		if (form.value.deviceId != null) {
			proxy.$modal.confirm('是否确认'+msg+'编号为"' + eqCodes + '"的单元设备？').then(function() {
				return updateDevice(form.value);
			}).then(() => {
				getList();
				proxy.$modal.msgSuccess(msg+"成功");
			}).catch(() => {});
		}
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["deviceRef"].validate(valid => {
    if (valid) {
      if (form.value.deviceId != null) {
        updateDevice(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addDevice(form.value).then(response => {
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
  const deviceIds = row.deviceId || ids.value;
  const eqCodes = row.eqCode || codes.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delDevice(deviceIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('unitManage/device/export', {
    ...queryParams.value
  }, `device_${new Date().getTime()}.xlsx`)
}
function getWxData(row){
 /** 维修 */
 wxqueryParams.value.deviceId = row.deviceId;
  listWorkorder(wxqueryParams.value).then(res => {
    wxtableData.value = res.rows
    wxtotal.value = res.total;
  })
}
function getByData(row){
  /** 保养 */
  byqueryParams.value.deviceId = row.deviceId;
  listMaintenanceinfo(byqueryParams.value).then(response => {
    bytableData.value = response.rows;//table数据
    bytotal.value = response.total;//table总个数
  });
}
/** 设备档案  */
function handleDeviceFiles(row){
  infoopen.value = true;
  /*listAllInfo(queryParams.value).then(response => {
    deviceList.value = response.rows;
    total.value = response.total;
  });*/
  /** 属性 */
  const eqId = row.eqId
  listEquipAttributes({eqId:eqId}).then(res => {
    form.value.eqAttributesList = res.rows
  })
  getWxData(row);
  getByData(row);

  listFiles({eqId: row.eqId}).then(response => {
    fileList.value = response.rows;
  });
}


getTreeselect();
getList();
</script>
<style>
.toolsline{
  height: 30px;
}
</style>
