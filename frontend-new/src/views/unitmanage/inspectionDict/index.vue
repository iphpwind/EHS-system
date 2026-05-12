<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="70px">
      <el-form-item label="属性名称" prop="inspectionDictName">
        <el-input
          v-model="queryParams.inspectionDictName"
          placeholder="请输入属性名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="值域类型" prop="inspectionDictType">
        <el-select v-model="queryParams.inspectionDictType" placeholder="请选择值域类型" clearable>
          <el-option
            v-for="dict in unit_inspection_dict_type"
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
          v-hasPermi="['unitManage:inspectionDict:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['unitManage:inspectionDict:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['unitManage:inspectionDict:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['unitManage:inspectionDict:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 300px)" v-loading="loading" :data="inspectionDictList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="inspectionDictId" />
      <el-table-column label="属性名称" align="center" prop="inspectionDictName" />
      <el-table-column label="属性内容" align="center" prop="inspectionDictContent" />
      <el-table-column label="值域类型" align="center" prop="inspectionDictType">
        <template #default="scope">
          <dict-tag :options="unit_inspection_dict_type" :value="scope.row.inspectionDictType"/>
        </template>
      </el-table-column>
			<el-table-column label="标识状态" align="center" prop="status">
				<template #default="scope">
					<dict-tag :options="unit_status" :value="scope.row.status"/>
				</template>
			</el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['unitManage:inspectionDict:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['unitManage:inspectionDict:remove']"
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

    <!-- 添加或修改单元巡检内容字典对话框 -->
    <el-dialog :title="title" v-model="open" width="700px" append-to-body>
      <el-form ref="inspectionDictRef" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="属性名称" prop="inspectionDictName">
          <el-input v-model="form.inspectionDictName" placeholder="请输入属性名称" />
        </el-form-item>
        <el-form-item label="属性内容">
          <el-input v-model="form.inspectionDictContent" placeholder="请输入属性内容" type="textarea"/>
        </el-form-item>
        <el-form-item label="值域类型">
          <el-radio-group v-model="form.inspectionDictType">
            <el-radio
              v-for="dict in unit_inspection_dict_type"
              :key="dict.value"
:label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.inspectionDictType == '0'" label="数值值域上限" prop="runningNumUp">
          <el-input v-model="form.runningNumUp" placeholder="请输入数值值域上限" />
        </el-form-item>
        <el-form-item v-if="form.inspectionDictType == '0'"  label="数值值域下限" prop="runningNumLow">
          <el-input v-model="form.runningNumLow" placeholder="请输入数值值域下限" />
        </el-form-item>
        <el-form-item v-if="form.inspectionDictType == '0'" label="数值单位" prop="numUnit">
          <el-input v-model="form.numUnit" placeholder="请输入数值单位" />
        </el-form-item>
        <el-form-item v-if="form.inspectionDictType == '1'" label="字符串值域正常" prop="runningStringNormal">
          <el-input v-model="form.runningStringNormal" placeholder="请输入字符串值域正常" />
        </el-form-item>
        <el-form-item v-if="form.inspectionDictType == '1'" label="字符串值域异常" prop="runningStringFault">
          <el-input v-model="form.runningStringFault" placeholder="请输入字符串值域异常" />
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
  </div>
</template>

<script setup name="InspectionDict">
import { listInspectionDict, getInspectionDict, delInspectionDict, addInspectionDict, updateInspectionDict } from "@/api/unitmanage/inspectionDict";
import {h} from "vue";

const { proxy } = getCurrentInstance();
const { unit_inspection_dict_type, unit_status } = proxy.useDict('unit_inspection_dict_type', 'unit_status');

const inspectionDictList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    inspectionDictName: null,
    inspectionDictType: null,
    status: null,
		delFlag: "0"
  },
  rules: {
    inspectionDictName: [
      { required: true, message: "属性名称不能为空", trigger: "blur" }
    ],
    inspectionDictType: [
      { required: true, message: "值域类型不能为空", trigger: "blur" }
    ],
    runningNumUp: [
      { required: true, message: "数值值域上限不能为空", trigger: "blur" }
    ],
    runningNumLow: [
      { required: true, message: "数值值域下限不能为空", trigger: "blur" }
    ],
    numUnit: [
      { required: true, message: "数值单位不能为空", trigger: "blur" }
    ],
    runningStringNormal: [
      { required: true, message: "字符串值域正常不能为空", trigger: "blur" }
    ],
    runningStringFault: [
      { required: true, message: "字符串值域异常不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询单元巡检内容字典列表 */
function getList() {
  loading.value = true;
  listInspectionDict(queryParams.value).then(response => {
    inspectionDictList.value = response.rows;
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
    inspectionDictId: null,
    inspectionDictName: null,
    inspectionDictContent: null,
    inspectionDictType: "0",
    runningNumUp: null,
    runningNumLow: null,
    numUnit: null,
    runningStringNormal: null,
    runningStringFault: null,
    status: "0",
    delFlag: "0",
  };
  proxy.resetForm("inspectionDictRef");
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
  ids.value = selection.map(item => item.inspectionDictId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加单元巡检内容字典";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const inspectionDictId = row.inspectionDictId || ids.value
  getInspectionDict(inspectionDictId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改单元巡检内容字典";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["inspectionDictRef"].validate(valid => {
    if (valid) {
      if (form.value.inspectionDictId != null) {
        updateInspectionDict(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addInspectionDict(form.value).then(response => {
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
  const inspectionDictIds = row.inspectionDictId || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delInspectionDict(inspectionDictIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('unitManage/inspectionDict/export', {
    ...queryParams.value
  }, `inspectionDict_${new Date().getTime()}.xlsx`)
}

getList();
</script>
<style>
.toolsline{
  height: 30px;
}
</style>
