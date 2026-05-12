<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="单元组织名称" prop="sectionName" label-width="100px">
        <el-input
          v-model="queryParams.sectionName"
          placeholder="请输入单元组织名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="组织类型" prop="sectionType">
        <el-select v-model="queryParams.sectionType" placeholder="请选择组织类型" clearable>
          <el-option
            v-for="dict in unit_section_type"
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
          v-hasPermi="['unitManage:section:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="Sort"
          @click="toggleExpandAll"
        >展开/折叠</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      height="calc(100vh - 240px)"
      v-if="refreshTable"
      v-loading="loading"
      :data="sectionList"
      row-key="sectionId"
      :default-expand-all="isExpandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="单元组织名称" prop="sectionName" />
      <el-table-column label="显示顺序" align="center" prop="orderNum" />
      <el-table-column label="组织类型" align="center" prop="sectionType">
        <template #default="scope">
          <dict-tag :options="unit_section_type" :value="scope.row.sectionType"/>
        </template>
      </el-table-column>
      <el-table-column label="归属部门" align="center" prop="deptName" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="unit_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="300" fixed="right">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['unitManage:section:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['unitManage:section:add']"
          >新增</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['unitManage:section:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改单元组织管理对话框 -->
    <el-dialog :title="title" v-model="open" width="680px" append-to-body>
      <el-form ref="sectionRef" :model="form" :rules="rules" label-width="120px">
				<el-form-item label="归属部门" prop="deptId">
					<tree-select
							v-model:value="form.deptId"
							:options="deptOptions"
							placeholder="请选择归属部门"
							:objMap="{ value: 'id', label: 'label', children: 'children' }"
					/>
				</el-form-item>
        <el-form-item label="单元组织名称" prop="sectionName">
          <el-input v-model="form.sectionName" placeholder="请输入单元组织名称" />
        </el-form-item>
        <el-form-item label="上级组织" prop="parentId">
          <tree-select
            v-model:value="form.parentId"
            :options="sectionOptions"
            :objMap="{ value: 'sectionId', label: 'sectionName', children: 'children' }"
            placeholder="请选择上级组织"
          />
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderNum">
		  <el-input-number v-model="form.orderNum" controls-position="right" :min="0"/>
        </el-form-item>
        <el-form-item label="组织类型" prop="sectionType">
		  <el-radio-group v-model="form.sectionType">
			<el-radio v-for="dict in unit_section_type"
              :label="dict.value">{{dict.label}}</el-radio>
		  </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="status">
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

<script setup name="Section">
import { listSection, getSection, delSection, addSection, updateSection } from "@/api/unitmanage/section";
import {treeselect} from "@/api/system/dept";
import {h} from "vue";

const { proxy } = getCurrentInstance();
const { unit_status, unit_section_type } = proxy.useDict('unit_status', 'unit_section_type');

const sectionList = ref([]);
const sectionOptions = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const title = ref("");
const isExpandAll = ref(true);
const refreshTable = ref(true);
const deptOptions = ref(undefined);

const data = reactive({
  form: {},
  queryParams: {
    sectionName: null,
    parentId: null,
    orderNum: null,
    sectionType: null,
    unitState: null,
    status: null,
		delFlag: "0"
  },
  rules: {
    sectionName: [
      { required: true, message: "单元组织名称不能为空", trigger: "blur" }
    ],
    parentId: [
      { required: true, message: "单元上级组织不能为空", trigger: "blur" }
    ],
    orderNum: [
      { required: true, message: "显示顺序不能为空", trigger: "blur" }
    ],
    sectionType: [
      { required: true, message: "组织类型不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "blur" }
    ],
		deptId: [
      { required: true, message: "归属部门不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询单元组织管理列表 */
function getList() {
  loading.value = true;
  listSection(queryParams.value).then(response => {
    sectionList.value = proxy.handleTree(response.data, "sectionId");
    loading.value = false;
  });
}

/** 查询单元组织管理下拉树结构 */
async function getTreeselect() {
  sectionOptions.value = [];
  await listSection({delFlag: "0"}).then(response => {
    const data = {sectionId: 0, sectionName: "顶级节点", children: []};
    data.children = proxy.handleTree(response.data, "sectionId");
    sectionOptions.value.push(data);
  });
}

/** 查询部门下拉树结构 */
async function getTreeselectDept() {
  await treeselect().then(response => {
    deptOptions.value = response.data;
  });
};

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    sectionId: null,
    sectionName: null,
    parentId: 0,
    orderNum: null,
    sectionType: null,
    unitState: null,
    status: "0",
		deptId: null,

    delFlag: "0",
  };
  proxy.resetForm("sectionRef");
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

/** 新增按钮操作 */
async function handleAdd(row) {
  reset();
  await getTreeselect();
  if (row != null && row.sectionId) {
    form.value.parentId = row.sectionId;
  } else {
    form.value.parentId = 0;
  }
	await getTreeselectDept();
  open.value = true;
  title.value = "添加单元组织管理";
}

/** 展开/折叠操作 */
function toggleExpandAll() {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTable.value = true;
  });
}

/** 修改按钮操作 */
async function handleUpdate(row) {
  reset();
  await getTreeselect();
	await getTreeselectDept();
  getSection(row.sectionId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改单元组织管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["sectionRef"].validate(valid => {
    if (valid) {
      if (form.value.sectionId != null) {
        updateSection(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSection(form.value).then(response => {
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
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delSection(row.sectionId);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

getList();
</script>
<style>
.toolsline{
  height: 30px;
}
</style>
