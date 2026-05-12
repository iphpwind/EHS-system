<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="模型唯一标识" prop="mxWyz">
        <el-input
          v-model="queryParams.mxWyz"
          placeholder="请输入模型唯一标识"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="模型名称" prop="mxName">
        <el-input
          v-model="queryParams.mxName"
          placeholder="请输入模型名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推送id" prop="tsId">
        <el-input
          v-model="queryParams.tsId"
          placeholder="请输入推送id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="${comment}" prop="label">
        <el-input
          v-model="queryParams.label"
          placeholder="请输入${comment}"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="对应是否需要报警" prop="labelValue">
        <el-input
          v-model="queryParams.labelValue"
          placeholder="请输入对应是否需要报警"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="父ID" prop="modelid">
        <el-input
          v-model="queryParams.modelid"
          placeholder="请输入父ID"
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
          v-hasPermi="['aiWarning:mxxx:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['aiWarning:mxxx:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['aiWarning:mxxx:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['aiWarning:mxxx:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="mxxxList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="mxId" />
      <el-table-column label="模型唯一标识" align="center" prop="mxWyz" />
      <el-table-column label="模型名称" align="center" prop="mxName" />
      <el-table-column label="推送id" align="center" prop="tsId" />
      <el-table-column label="报警类型" align="center" prop="labelType" />
      <el-table-column label="${comment}" align="center" prop="label" />
      <el-table-column label="对应是否需要报警" align="center" prop="labelValue" />
      <el-table-column label="父ID" align="center" prop="modelid" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['aiWarning:mxxx:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['aiWarning:mxxx:remove']"
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

    <!-- 添加或修改模型信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="mxxxRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="模型唯一标识" prop="mxWyz">
          <el-input v-model="form.mxWyz" placeholder="请输入模型唯一标识" />
        </el-form-item>
        <el-form-item label="模型名称" prop="mxName">
          <el-input v-model="form.mxName" placeholder="请输入模型名称" />
        </el-form-item>
        <el-form-item label="推送id" prop="tsId">
          <el-input v-model="form.tsId" placeholder="请输入推送id" />
        </el-form-item>
        <el-form-item label="${comment}" prop="label">
          <el-input v-model="form.label" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="对应是否需要报警" prop="labelValue">
          <el-input v-model="form.labelValue" placeholder="请输入对应是否需要报警" />
        </el-form-item>
        <el-form-item label="父ID" prop="modelid">
          <el-input v-model="form.modelid" placeholder="请输入父ID" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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

<script setup name="Mxxx">
import { listMxxx, getMxxx, delMxxx, addMxxx, updateMxxx } from "@/api/aiWarning/mxxx";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const mxxxList = ref([]);
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
    mxWyz: null,
    mxName: null,
    tsId: null,
    labelType: null,
    label: null,
    labelValue: null,
    modelid: null,
    status: null,
  },
  rules: {
    mxName: [
      { required: true, message: "模型名称不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询模型信息列表 */
function getList() {
  loading.value = true;
  listMxxx(queryParams.value).then(response => {
    mxxxList.value = response.rows;
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
    mxId: null,
    mxWyz: null,
    mxName: null,
    tsId: null,
    labelType: null,
    label: null,
    labelValue: null,
    modelid: null,
    status: "0",
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  };
  proxy.resetForm("mxxxRef");
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
  ids.value = selection.map(item => item.mxId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加模型信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const mxId = row.mxId || ids.value
  getMxxx(mxId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改模型信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["mxxxRef"].validate(valid => {
    if (valid) {
      if (form.value.mxId != null) {
        updateMxxx(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addMxxx(form.value).then(response => {
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
  const mxIds = row.mxId || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delMxxx(mxIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('aiWarning/mxxx/export', {
    ...queryParams.value
  }, `mxxx_${new Date().getTime()}.xlsx`)
}

getList();
</script>
