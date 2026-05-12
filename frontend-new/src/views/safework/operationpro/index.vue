<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="所属部门" prop="deptId">
        <tree-select
            v-model:value="queryParams.deptId"
            :options="deptOptions"
            placeholder="请选择归属部门"
            :objMap="{ value: 'id', label: 'label', children: 'children' }"
        />
      </el-form-item>
      <el-form-item label="作业方案名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入作业方案名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="workStep">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
              v-for="dict in status"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['safework:operationpro:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="operationproList" @selection-change="handleSelectionChange">
      <el-table-column label="所属部门" align="center" prop="deptName" />
      <el-table-column label="方案编码" align="center" prop="num" />
      <el-table-column label="方案名称" align="center" prop="name" />
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
            v-if="scope.row.planId==null || scope.row.planId==''"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-if="scope.row.planId==null || scope.row.planId==''"
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

    <!-- 添加或修改作业方案对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="operationproRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="所属部门" prop="deptId">
          <tree-select
              v-model:value="form.deptId"
              :options="deptOptions"
              placeholder="请选择所属部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
          />
        </el-form-item>
        <el-form-item label="作业方案编码" prop="num">
          <el-input v-model="form.num" placeholder="请输入作业方案编码" />
        </el-form-item>
        <el-form-item label="作业方案名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入作业方案名称" />
        </el-form-item>
        <el-form-item label="方案编制人" prop="preparedBy">
          <el-select  v-model="form.preparedBy">
            <el-option
                v-for="item in userOptions"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="方案审核人" prop="checkBy">
          <el-select  v-model="form.checkBy">
            <el-option
                v-for="item in userOptions"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="方案批准人" prop="agreeBy">
          <el-select  v-model="form.agreeBy">
            <el-option
                v-for="item in userOptions"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="施工作业概况" prop="workInfo">
          <el-input v-model="form.workInfo" placeholder="请输入施工作业概况" type="textarea"/>
        </el-form-item>
        <el-form-item label="作业步骤" prop="workStep">
          <el-input v-model="form.workStep" placeholder="请输入作业步骤" type="textarea"/>
        </el-form-item>
        <el-form-item label="状态">
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

<script setup name="Operationpro">
import { listOperationpro, getOperationpro, delOperationpro, addOperationpro, updateOperationpro } from "@/api/safework/operationpro";
import {treeselect} from "@/api/system/dept";
import {getUserList} from "@/api/system/user";

const { proxy } = getCurrentInstance();
const { status } = proxy.useDict('status');

const operationproList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const deptOptions = ref(undefined);
const userOptions = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    enterpriseCode: null,
    planId: null,
    deptId: null,
    num: null,
    name: null,
    preparedBy: null,
    checkBy: null,
    agreeBy: null,
    workInfo: null,
    workStep: null,
    status: null,
  },
  rules: {
    deptId: [
      { required: true, message: "必填项不能为空", trigger: "blur" }
    ],
    workStep: [
      { required: true, message: "必填项不能为空", trigger: "blur" }
    ],
    workInfo: [
      { required: true, message: "必填项不能为空", trigger: "blur" }
    ],
    agreeBy: [
      { required: true, message: "必填项不能为空", trigger: "blur" }
    ],
    checkBy: [
      { required: true, message: "必填项不能为空", trigger: "blur" }
    ],
    preparedBy: [
      { required: true, message: "必填项不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "必填项不能为空", trigger: "blur" }
    ],
    num: [
      { required: true, message: "必填项不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询作业方案列表 */
function getList() {
  loading.value = true;
  listOperationpro(queryParams.value).then(response => {
    operationproList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

/** 初始化部门数据 */
function initTreeData() {
  // 判断部门的数据是否存在，存在不获取，不存在则获取
  if (deptOptions.value === undefined) {
    treeselect().then(response => {
      deptOptions.value = response.data;
    });
  }
}

function getUser(){
  getUserList().then(response => {
    userOptions.value = response.rows;
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
    planId: null,
    deptId: null,
    num: null,
    name: null,
    preparedBy: null,
    checkBy: null,
    agreeBy: null,
    workInfo: null,
    workStep: null,
    status: "0",
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("operationproRef");
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
  title.value = "添加作业方案";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getOperationpro(id).then(response => {
    form.value = response.data;
    form.value.preparedBy = parseInt(form.value.preparedBy)
    form.value.agreeBy = parseInt(form.value.agreeBy)
    form.value.checkBy = parseInt(form.value.checkBy)
    open.value = true;
    title.value = "修改作业方案";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["operationproRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateOperationpro(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addOperationpro(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除作业方案编号为"' + idss + '"的数据项？').then(function() {
    return delOperationpro(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/operationpro/export', {
    ...queryParams.value
  }, `operationpro_${new Date().getTime()}.xlsx`)
}
initTreeData();
getUser();
getList();
</script>
