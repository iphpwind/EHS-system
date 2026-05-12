<template>
  <!-- 设备列表 -->
  <el-dialog title="选择设备" v-model="visible" width="800px" top="5vh" append-to-body>
    <el-row>
			<el-form :model="queryParams" ref="queryRef" :inline="true">
				<el-form-item label="设备编号" prop="eqCode">
					<el-input
							v-model="queryParams.eqCode"
							placeholder="请输入设备编号"
							clearable
							@keyup.enter="handleQuery"
					/>
				</el-form-item>
				<el-form-item label="设备名称" prop="eqName">
					<el-input
							v-model="queryParams.eqName"
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
      <el-table :data="eqList" height="260px">
        <el-table-column width="55">
					<template v-slot="scope">
						<el-radio v-model="queryParams.eqId" :label="scope.row.eqId" @change="getTempleteRow(scope.row)">{{""}}</el-radio>
					</template>
				</el-table-column>
        <el-table-column prop="eqCode" label="设备编号" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="eqName" label="设备名称" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
    </el-row>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSelectDevice">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 新增设备 -->
  <el-dialog title="新增设备" v-model="visible2" width="800px" top="5vh" append-to-body>
		<el-form ref="deviceRef" :model="form" :rules="rules" label-width="110px">
			<el-form-item label="归属组织" prop="sectionId">
				<tree-select
						v-model:value="form.sectionId"
						:options="$props.sectionOptions"
						placeholder="请选择归属组织"
						:objMap="{ value: 'id', label: 'label', children: 'children' }"
				/>
			</el-form-item>
			<el-form-item label="设备启用时间" prop="runningTime">
				<el-date-picker clearable
				v-model="form.runningTime"
				type="datetime"
				value-format="YYYY-MM-DD HH:mm:ss"
				placeholder="请选择设备启用时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="设备运行状态" prop="runningState">
				<el-radio-group v-model="form.runningState">
				<el-radio
					v-for="dict in unit_device_running_state"
					:key="dict.value"
			:label="dict.value"
				>{{dict.label}}</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="状态" prop="runningState">
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
        <el-button type="primary" @click="handleAddDevice">确 定</el-button>
        <el-button @click="visible2 = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { listDevice, listEq, getDevice, delDevice, addDevice, updateDevice } from "@/api/unitManage/device";

const visible = ref(false);
const visible2 = ref(false);
const eqList = ref([]);
const {proxy} = getCurrentInstance();

const { unit_device_running_state, unit_status } = proxy.useDict('unit_device_running_state', 'unit_status');

const data = reactive({
	  form: {
			runningState: "0",
			status: "0",
			eqId: "0",
      classId: "0",
			delFlag: "0"
		},
	  queryParams: {
			delFlag: 0,
			status: 0,
			eqId: null,
			eqName: null,
			eqCode: null,
	  },
	  rules: {
			sectionId: [
				{ required: true, message: "归属组织不能为空", trigger: "blur" }
			],
			runningTime: [
				{ required: true, message: "启用时间不能为空", trigger: "blur" }
			],
			runningState: [
				{ required: true, message: "运行状态不能为空", trigger: "blur" }
			],
			status: [
				{ required: true, message: "状态不能为空", trigger: "blur" }
			],
	  }
});

const { queryParams, form, rules } = toRefs(data);

const props = defineProps({
	sectionId: {
		type: Number,
		default: 0
	},
	sectionOptions: {
		type: Array
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
  listEq(queryParams.value).then(res => {
    eqList.value = res.rows;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
	queryParams.eqId = null;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 选中设备操作 */
function getTempleteRow(row){
	form.value.eqId = row.eqId;
	form.value.classId = row.classId;
}

function handleSelectDevice(){
	visible.value = false;
	visible2.value = true;
}
/** 新增设备操作 */
function handleAddDevice() {
    proxy.$refs["deviceRef"].validate(valid => {
      if (valid) {
				if(form.value.eqId == null || form.value.eqId == "0"){
					proxy.$modal.msgError("请选择设备！");
				}else{
					addDevice(form.value).then(response => {
						proxy.$modal.msgSuccess("新增成功");
						if (response.code === 200) {
						  visible2.value = false;
						  emit("ok");
						}
					});
				}
      }
    });
}

defineExpose({
  show,
});
</script>
