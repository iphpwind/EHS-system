<template>
  <!-- 巡检点设备列表 -->
  <el-dialog title="巡检点设备列表" v-model="visible" width="900px" top="5vh" append-to-body>
		<el-row>
			<el-form :inline="true" label-width="90px">
				<el-form-item>
					<el-button type="primary" icon="Plus" @click="getDevice()" v-hasPermi="['unitManage:inspectionDevice:add']">新增</el-button>
					<el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['unitManage:inspectionDevice:remove']">删除</el-button>
				</el-form-item>
			</el-form>
		</el-row>
    <el-row>
      <el-table :data="inspectionDeviceList" height="260px" ref="table" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="deviceId" label="id" :show-overflow-tooltip="true" width="60"></el-table-column>
        <el-table-column prop="eqId" label="设备编号" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="eqName" label="设备名称" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
    </el-row>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">关 闭</el-button>
      </div>
    </template>
  </el-dialog>
	<el-dialog title="设备列表" v-model="visible2" width="900px" top="5vh" append-to-body>
		<el-row>
			<el-form :model="queryParams" ref="queryRef" :inline="true" label-width="90px">
				<el-form-item label="设备名称" prop="siteName">
					<el-input
							v-model="queryParams.eqName"
							placeholder="请输入设备名称"
							clearable
					/>
				</el-form-item>
				<el-form-item label="设备分类" prop="siteType">
				  <el-select v-model="queryParams.classId" placeholder="请选择设备分类" clearable>
				    <el-option
				        v-for="classification in classificationList"
				        :key="classification.id"
				        :label="classification.name"
				        :value="classification.id"
				    />
				  </el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
				</el-form-item>
			</el-form>
		</el-row>
    <el-row>
      <el-table :data="deviceList" height="260px" ref="table2" @selection-change="handleSelectionChange2">
				<el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="deviceId" label="id" :show-overflow-tooltip="true" width="60"></el-table-column>
        <el-table-column prop="eqId" label="设备编号" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="eqName" label="设备名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="className" label="设备分类" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
    </el-row>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible2 = false">关 闭</el-button>
				<el-button type="primary" @click="handleSelectDevice">确 定</el-button>
      </div>
    </template>
	</el-dialog>
</template>

<script setup>
import { listDevice } from "@/api/unitmanage/device";
import { listInspectionDevice, getInspectionDevice, delInspectionDevice, addInspectionDevice, updateInspectionDevice, addInspectionDevices } from "@/api/unitmanage/inspectionDevice";
import { listClassification } from "@/api/equipment/classification"
import {h} from "vue";

const visible = ref(false);
const visible2 = ref(false);
const inspectionDeviceList = ref([]);
const deviceList = ref([]);
const {proxy} = getCurrentInstance();
const tables = ref([]);
const tables2 = ref([]);
const classificationList = ref([]);
const multiple = ref(true);

const data = reactive({
	  form: {},
	  queryParams: {
			pageNum: 1,
			pageSize: 10000,
			delFlag: 0,
			status: 0,
			classId: null,
			eqName: null,
			sectionId: null
	  },
});

const { queryParams, form } = toRefs(data);

const props = defineProps({
	siteId: {
		type: Number,
		default: 0
	},
	sectionId: {
		type: Number,
		default: 0
	}
})

const emit = defineEmits(["ok"]);

/** 查询参数列表 */
function show() {
  getList();
	getClassificationList();
  visible.value = true;
}

/** 查询表数据 */
function getList() {
	listInspectionDevice({siteId:props.siteId}).then(response => {
		inspectionDeviceList.value = response.rows;
		
	});
}

function getDevice() {
	queryParams.value.siteId = props.siteId;
	queryParams.value.sectionId = props.sectionId;
  listDevice(queryParams.value).then(res => {
    deviceList.value = res.rows;
		visible2.value = true;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1;
  getDevice();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}
	
/** 新增设备操作 */
function handleSelectDevice() {
	const deviceIds = tables2.value.join(",");
		form.value.siteId = props.siteId;
		form.value.deviceIds = deviceIds;
		addInspectionDevices(form.value).then(response => {
			proxy.$modal.msgSuccess("新增成功");
			if (response.code === 200) {
				visible2.value = false;
				getList();
			}
		});
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  tables.value = selection.map(item => item.id);
  multiple.value = !selection.length;
}

/** 多选框选中数据 */
function handleSelectionChange2(selection) {
  tables2.value = selection.map(item => item.deviceId);
}

function getClassificationList(){
	listClassification({status:0,delFlag:0}).then(response => {
			if (response.code === 200) {
				classificationList.value = response.rows;
			}
		});
}

/** 删除按钮操作 */
function handleDelete(row) {
  const idss = row.id || tables.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delInspectionDevice(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

defineExpose({
  show,
});
</script>
