<template>
  <!-- 巡检内容列表 -->
  <el-dialog title="选择属性" v-model="visible" width="800px" top="5vh" append-to-body>
    <el-row>
			<el-form :model="queryParams" ref="queryRef" :inline="true">
				<el-form-item label="属性名称" prop="inspectionDictName">
					<el-input
							v-model="queryParams.inspectionDictName"
							placeholder="请输入属性名称"
							clearable
							@keyup.enter="handleQuery"
					/>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
					<el-button icon="Refresh" @click="resetQuery">重置</el-button>
				</el-form-item>
			</el-form>
      <el-table :data="inspectionDictList" height="260px"  @row-click="clickRow" ref="table" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="inspectionDictName" label="属性名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="inspectionDictContent" label="属性内容" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
    </el-row>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleSelectDict">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { listInspectionDict } from "@/api/unitmanage/inspectionDict";
import { listInspectionTemplateDict, getInspectionTemplateDict, delInspectionTemplateDict, addInspectionTemplateDict, updateInspectionTemplateDict, addTemplateDicts } from "@/api/unitmanage/inspectionTemplateDict";

const visible = ref(false);
const inspectionDictList = ref([]);
const {proxy} = getCurrentInstance();
const tables = ref([]);

const data = reactive({
	  form: {},
	  queryParams: {
			pageNum: 1,
			pageSize: 9999999,
			delFlag: 0,
			status: 0,
			inspectionDictId: null,
			inspectionDictName: null,
			templateId: null
	  },
});

const { queryParams, form } = toRefs(data);

const props = defineProps({
	templateId: {
		type: Number,
		default: 0
	},
	inspectionTemplateDictList:{
		type:  Array,
		default: []
	}
})

const emit = defineEmits(["ok"]);

/** 查询参数列表 */
function show() {
	inspectionDictList.value = [];
  getList();
  visible.value = true;
	queryParams.value.templateId = props.templateId;
}

/** 查询表数据 */
function getList() {
  listInspectionDict(queryParams.value).then(res => {
    inspectionDictList.value = res.rows;
		
		// proxy.$nextTick(() => {
		// 	inspectionDictList.value.forEach((inspectionDict) => {
		// 		props.inspectionTemplateDictList.forEach(templateDict => {
		// 			if(templateDict.inspectionDictId == inspectionDict.inspectionDictId){
		// 				proxy.$refs.table.toggleRowSelection(inspectionDict,true);
		// 			}
		// 		})
		// 	});
		// })
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1;
	queryParams.inspectionDictId = null;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}
	
/** 新增属性操作 */
function handleSelectDict() {
  const inspectionDictIds = tables.value.join(",");
  if (inspectionDictIds == "") {
    proxy.$modal.msgError("请选择巡检属性");
    return;
  }else{
		form.value.templateId = props.templateId;
		form.value.inspectionDictIds = inspectionDictIds;
		addTemplateDicts(form.value).then(response => {
			proxy.$modal.msgSuccess("新增成功");
			if (response.code === 200) {
				visible.value = false;
				emit("ok",props.templateId);
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
  tables.value = selection.map(item => item.inspectionDictId);
}

defineExpose({
  show,
});
</script>
