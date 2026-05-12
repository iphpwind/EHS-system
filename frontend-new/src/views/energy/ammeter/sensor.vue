<template>
  <!-- 传感器列表 -->
  <el-dialog title="选择设备" v-model="visible" width="800px" top="5vh" append-to-body>
    <el-row>
			<el-form :model="queryParams" ref="queryRef" :inline="true">
				<el-form-item label="设备名称" prop="equipmentName">
					<el-input
						v-model="queryParams.equipmentName"
						placeholder="请输入设备名称"
						clearable
						@keyup.enter="handleQuery"
					/>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
					<el-button icon="Refresh" @click="resetQuery">重置</el-button>
				</el-form-item>
			</el-form>
      <el-table :data="sensorList" height="400px"  @row-click="clickRow" ref="table" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
				<el-table-column label="设备ID" align="center" prop="equipmentId" :show-overflow-tooltip="true"/>
				<el-table-column label="设备名称" align="center" prop="equipmentName" :show-overflow-tooltip="true"/>
				<el-table-column label="设备编号" align="center" prop="equipmentCode" :show-overflow-tooltip="true"/>
				<el-table-column label="设备s/n" align="center" prop="sn" :show-overflow-tooltip="true"/>
				<el-table-column label="规格型号" align="center" prop="equipmentSpec" :show-overflow-tooltip="true"/>
				<el-table-column label="设备厂商" align="center" prop="equipmentFactory" :show-overflow-tooltip="true"/>
				<el-table-column label="设备地址码" align="center" prop="equipmentSerial" :show-overflow-tooltip="true"/>
      </el-table>
    </el-row>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSelectDevice">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { listSensor,addAmmeters } from "@/api/energy/ammeter";

const {proxy} = getCurrentInstance();

const visible = ref(false);
const sensorList = ref([]);
const tables = ref([]);

const data = reactive({
	  form: {},
	  queryParams: {
			delFlag: 0,
			equipmentName: null,
	  }
});

const { queryParams, form } = toRefs(data);

const props = defineProps({
	electricAreaId: {
		type: Number,
		default: 0
	}
})

const emit = defineEmits(["ok"]);

/** 查询参数列表 */
function show() {
  getList();
  visible.value = true;
}

/** 查询表数据 */
function getList() {
  listSensor(queryParams.value).then(res => {
    sensorList.value = res.rows;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 新增设备操作 */
function handleSelectDevice() {
  console.log(props)
  const sensorIds = tables.value.join(",");
  if (sensorIds == "") {
    proxy.$modal.msgError("请选择设备");
    return;
  }else{
		form.value.electricAreaId = props.electricAreaId;
		form.value.sensorIds = sensorIds;
		addAmmeters(form.value).then(response => {
			proxy.$modal.msgSuccess("新增成功");
			if (response.code === 200) {
				visible.value = false;
				emit("ok",props.electricAreaId);
			}
		});
	}
}

/** 单击选择行 */
function clickRow(row) {
  proxy.$refs.table.toggleRowSelection(row);
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  tables.value = selection.map(item => item.equipmentId);
}

defineExpose({
  show,
});
</script>

