<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="变更项目" prop="changeProject">
        <el-input
          v-model="queryParams.changeProject"
          placeholder="请输入变更项目"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['safework:changeAcceptance:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:changeAcceptance:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:changeAcceptance:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:changeAcceptance:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="changeAcceptanceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="变更项目" align="center" prop="changeName" />
      <el-table-column label="变更所在部门" align="center" prop="deptName" />
      <el-table-column label="组织验收部门" align="center" prop="acceptanceDeptName" />
      <el-table-column label="验收日期" align="center" prop="acceptanceDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.acceptanceDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status" >
        <template #default="scope">
          <dict-tag :options="status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:changeAcceptance:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:changeAcceptance:remove']"
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

    <!-- 添加或修改变更验收对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="changeAcceptanceRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="变更项目" prop="changeProject">
          <el-select v-model="form.changeProject" placeholder="请选择变更项目">
            <el-option
                v-for="dict in changeManagementList"
                :key="dict.id"
                :label="dict.changeName"
                :value="dict.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变更所在部门" prop="dept">
          <tree-select
              v-model:value="form.dept"
              :options="deptOptions"
              placeholder="请选择部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
          />
        </el-form-item>
        <el-form-item label="组织验收部门" prop="acceptanceDept">
          <tree-select
              v-model:value="form.acceptanceDept"
              :options="deptOptions"
              placeholder="请选择部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
          />
        </el-form-item>
        <el-form-item label="验收日期" prop="acceptanceDate">
          <el-date-picker clearable
            v-model="form.acceptanceDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择验收日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
					<el-radio-group v-model="form.status">
						<el-radio
							v-for="dict in status"
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

<script setup name="ChangeAcceptance">
import { listChangeAcceptance, getChangeAcceptance, delChangeAcceptance, addChangeAcceptance, updateChangeAcceptance } from "@/api/safework/changeAcceptance";
import { listChangeManagement} from "@/api/safework/changeManagement";
import {treeselect} from "../../../api/system/dept";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const changeAcceptanceList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const deptOptions = ref(undefined);
const changeManagementList = ref([]);
const { status } = proxy.useDict('status');
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    enterpriseCode: null,
    changeProject: null,
    dept: null,
    acceptanceDept: null,
    acceptanceDate: null,
    acceptanceUser: null,
    status: null,
  },
  rules: {
    changeProject: [
      { required: true, message: "变更项目不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询变更管理列表 */
function getChangeManagementList() {
  listChangeManagement(queryParams.value).then(response => {
    changeManagementList.value = response.rows;
    console.log("变更列表",changeManagementList.value)
  });
}
/** 查询变更验收列表 */
function getList() {
  loading.value = true;
  listChangeAcceptance(queryParams.value).then(response => {
    changeAcceptanceList.value = response.rows;
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
    enterpriseCode: null,
    changeProject: null,
    dept: null,
    acceptanceDept: null,
    acceptanceDate: null,
    acceptanceUser: null,
    status: "0",
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("changeAcceptanceRef");
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
  title.value = "添加变更验收";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getChangeAcceptance(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改变更验收";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["changeAcceptanceRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateChangeAcceptance(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addChangeAcceptance(form.value).then(response => {
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
    return delChangeAcceptance(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/changeAcceptance/export', {
    ...queryParams.value
  }, `changeAcceptance_${new Date().getTime()}.xlsx`)
}
/** 初始化部门数据 */
function initTreeData() {
  // 判断部门的数据是否存在，存在不获取，不存在则获取
  if (deptOptions.value === undefined) {
    treeselect().then(response => {
      deptOptions.value = response.data;
    });
  }
};
getList();
initTreeData();
getChangeManagementList();
</script>
