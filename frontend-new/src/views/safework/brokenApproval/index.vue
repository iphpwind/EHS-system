<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="审批流节点id" prop="approvalId">
        <el-input
          v-model="queryParams.approvalId"
          placeholder="请输入审批流节点id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审批人" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入审批人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="作业票id" prop="mainId">
        <el-input
          v-model="queryParams.mainId"
          placeholder="请输入作业票id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审批顺序" prop="orderNum">
        <el-input
          v-model="queryParams.orderNum"
          placeholder="请输入审批顺序"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="0同意1拒绝" prop="statue">
        <el-input
          v-model="queryParams.statue"
          placeholder="请输入0同意1拒绝"
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
          v-hasPermi="['safework:brokenApproval:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:brokenApproval:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:brokenApproval:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:brokenApproval:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="brokenApprovalList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="center" prop="id" />
      <el-table-column label="审批流节点id" align="center" prop="approvalId" />
      <el-table-column label="审批人" align="center" prop="userId" />
      <el-table-column label="作业票id" align="center" prop="mainId" />
      <el-table-column label="审批顺序" align="center" prop="orderNum" />
      <el-table-column label="0同意1拒绝" align="center" prop="statue" />
      <el-table-column label="同意签字" align="center" prop="sign" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:brokenApproval:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:brokenApproval:remove']"
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

    <!-- 添加或修改断路作业作业票作业审核节点对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="brokenApprovalRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="审批流节点id" prop="approvalId">
          <el-input v-model="form.approvalId" placeholder="请输入审批流节点id" />
        </el-form-item>
        <el-form-item label="审批人" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入审批人" />
        </el-form-item>
        <el-form-item label="作业票id" prop="mainId">
          <el-input v-model="form.mainId" placeholder="请输入作业票id" />
        </el-form-item>
        <el-form-item label="审批顺序" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入审批顺序" />
        </el-form-item>
        <el-form-item label="0同意1拒绝" prop="statue">
          <el-input v-model="form.statue" placeholder="请输入0同意1拒绝" />
        </el-form-item>
        <el-form-item label="同意签字" prop="sign">
          <el-input v-model="form.sign" type="textarea" placeholder="请输入内容" />
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

<script setup name="BrokenApproval">
import { listBrokenApproval, getBrokenApproval, delBrokenApproval, addBrokenApproval, updateBrokenApproval } from "@/api/safework/brokenApproval";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const brokenApprovalList = ref([]);
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
    approvalId: null,
    userId: null,
    mainId: null,
    orderNum: null,
    statue: null,
    sign: null
  },
  rules: {
    approvalId: [
      { required: true, message: "审批流节点id不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询断路作业作业票作业审核节点列表 */
function getList() {
  loading.value = true;
  listBrokenApproval(queryParams.value).then(response => {
    brokenApprovalList.value = response.rows;
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
    approvalId: null,
    userId: null,
    mainId: null,
    orderNum: null,
    createBy: null,
    createTime: null,
    statue: null,
    sign: null
  };
  proxy.resetForm("brokenApprovalRef");
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
  title.value = "添加断路作业作业票作业审核节点";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getBrokenApproval(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改断路作业作业票作业审核节点";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["brokenApprovalRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateBrokenApproval(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addBrokenApproval(form.value).then(response => {
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
    return delBrokenApproval(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/brokenApproval/export', {
    ...queryParams.value
  }, `brokenApproval_${new Date().getTime()}.xlsx`)
}

getList();
</script>
