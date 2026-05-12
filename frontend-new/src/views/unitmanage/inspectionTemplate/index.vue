<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="70px">
      <el-form-item label="模板名称" prop="templateName">
        <el-input
          v-model="queryParams.templateName"
          placeholder="请输入模板名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="标识状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择标识状态" clearable>
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
          v-hasPermi="['unitManage:inspectionTemplate:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['unitManage:inspectionTemplate:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['unitManage:inspectionTemplate:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['unitManage:inspectionTemplate:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 300px)" v-loading="loading" :data="inspectionTemplateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="模板编号" align="center" prop="templateId" />
      <el-table-column label="模板名称" align="center" prop="templateName" />
      <el-table-column label="标识状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="unit_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['unitManage:inspectionTemplate:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="List"
            @click="handleDict(scope.row)"
            v-hasPermi="['unitManage:inspectionTemplate:list']"
          >属性列表</el-button>
          <el-button
            type="text"
            icon="DocumentCopy"
            @click="handleCopyDict(scope.row)"
            v-hasPermi="['unitManage:inspectionTemplate:add']"
          >克隆模板</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['unitManage:inspectionTemplate:remove']"
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

    <!-- 添加或修改巡检内容模板对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="inspectionTemplateRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="模板名称" prop="templateName">
          <el-input v-model="form.templateName" placeholder="请输入模板名称" />
        </el-form-item>
        <el-form-item label="标识状态">
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

		<el-dialog title="属性列表" v-model="dict" width="900px" append-to-body>
			<el-row :gutter="10" class="mb8">
			  <el-col :span="1.5">
			    <el-button type="primary" icon="Plus" @click="handleAddInspectionTemplateDict">添加</el-button>
			  </el-col>
			  <el-col :span="1.5">
			    <el-button type="danger" icon="Delete" @click="handleDeleteInspectionTemplateDict">删除</el-button>
			  </el-col>
			</el-row>
			<el-table :data="inspectionTemplateDictList" :row-class-name="rowInspectionTemplateDictIndex" @selection-change="handleInspectionTemplateDictSelectionChange" ref="inspectionTemplateDict">
			  <el-table-column type="selection" width="50" align="center" />
			  <el-table-column label="属性名称" align="center" prop="inspectionDictName"/>
			  <el-table-column label="属性内容" min-width="200" align="center" prop="inspectionDictContent"/>
			  <el-table-column label="值域" align="center">
					<template #default="scope">
						<div v-if="scope.row.inspectionDictType == '0'"><span>{{scope.row.runningNumLow}}</span>~<span>{{scope.row.runningNumUp}}</span></div>
						<div v-if="scope.row.inspectionDictType == '1'"><span>{{scope.row.runningStringNormal}}</span>|<span>{{scope.row.runningStringFault}}</span></div>
					</template>
				</el-table-column>
			  <el-table-column label="属性单位" align="center" prop="numUnit"/>
			</el-table>
		</el-dialog>
    <templateDict ref="dictRef" @ok="getInspectionTemplateDictList" :templateId="form.templateId" :inspectionTemplateDictList="inspectionTemplateDictList"/>
  </div>
</template>

<script setup name="InspectionTemplate">
import { listInspectionTemplate, getInspectionTemplate, delInspectionTemplate, addInspectionTemplate, updateInspectionTemplate, copyInspectionTemplate } from "@/api/unitmanage/inspectionTemplate";
import { listInspectionTemplateDict, getInspectionTemplateDict, delInspectionTemplateDict, addInspectionTemplateDict, updateInspectionTemplateDict } from "@/api/unitmanage/inspectionTemplateDict";
import templateDict from "./templateDict";
import {h} from "vue";

const { proxy } = getCurrentInstance();
const { unit_status } = proxy.useDict('unit_status');

const inspectionTemplateList = ref([]);
const inspectionTemplateDictList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const checkedInspectionTemplateDict = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const dict = ref(false);
const copyTemplateId = ref(0);
const copyFlag = ref(false);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    templateName: null,
    status: null,
		delFlag: "0"
  },
  rules: {
    templateName: [
      { required: true, message: "模板名称不能为空", trigger: "blur" }
    ],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询巡检内容模板列表 */
function getList() {
  loading.value = true;
  listInspectionTemplate(queryParams.value).then(response => {
    inspectionTemplateList.value = response.rows;
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
    templateId: null,
    templateName: null,
    status: "0",
    delFlag: "0",
  };
  inspectionTemplateDictList.value = [];
	copyTemplateId.value = 0;
	copyFlag.value = false;
  proxy.resetForm("inspectionTemplateRef");
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
  ids.value = selection.map(item => item.templateId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加巡检内容模板";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const templateId = row.templateId || ids.value
  getInspectionTemplate(templateId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改巡检内容模板";
  });
}

/** 提交按钮 */
function submitForm() {
	if(copyFlag.value){
		form.value.copyTemplateId = copyTemplateId.value;
		copyInspectionTemplate(form.value).then(response => {
			proxy.$modal.msgSuccess("克隆成功");
			open.value = false;
			getList();
		});
	}else{
		proxy.$refs["inspectionTemplateRef"].validate(valid => {
			if (valid) {
				if (form.value.templateId != null) {
					updateInspectionTemplate(form.value).then(response => {
						proxy.$modal.msgSuccess("修改成功");
						open.value = false;
						getList();
					});
				} else {
					addInspectionTemplate(form.value).then(response => {
						proxy.$modal.msgSuccess("新增成功");
						open.value = false;
						getList();
					});
				}
			}
		});
	}
}

/** 属性列表按钮操作 */
function handleDict(row) {
  form.value.templateId = row.templateId;
  getInspectionTemplateDictList(form.value.templateId);
}
function getInspectionTemplateDictList(templateId){
	listInspectionTemplateDict({templateId:templateId}).then(response => {
		inspectionTemplateDictList.value = response.rows;
		dict.value = true;
	});
}

/** 删除按钮操作 */
function handleDelete(row) {
  const templateIds = row.templateId || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delInspectionTemplate(templateIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 巡检内容模板和字典关联序号 */
function rowInspectionTemplateDictIndex({ row, rowIndex }) {
  row.index = rowIndex + 1;
}

/** 巡检内容模板和字典关联添加按钮操作 */
function handleAddInspectionTemplateDict() {
    proxy.$refs["dictRef"].show();
}

/** 巡检内容模板和字典关联删除按钮操作 */
function handleDeleteInspectionTemplateDict() {
  if (checkedInspectionTemplateDict.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的巡检内容属性");
  } else {
    const checkedInspectionTemplateDicts = checkedInspectionTemplateDict.value;
    proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
    }).then(function () {
      return delInspectionTemplateDict(checkedInspectionTemplateDicts);
    }).then(() => {
      getInspectionTemplateDictList(form.value.templateId);
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }
}

/** 复选框选中数据 */
function handleInspectionTemplateDictSelectionChange(selection) {
  checkedInspectionTemplateDict.value = selection.map(item => item.id)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('unitManage/inspectionTemplate/export', {
    ...queryParams.value
  }, `inspectionTemplate_${new Date().getTime()}.xlsx`)
}

/** 克隆 **/
function handleCopyDict(row){
  reset();
  open.value = true;
  title.value = "克隆巡检内容模板";
	copyFlag.value = true;
	copyTemplateId.value = row.templateId;
}

getList();
</script>
<style>
.toolsline{
  height: 30px;
}
</style>
