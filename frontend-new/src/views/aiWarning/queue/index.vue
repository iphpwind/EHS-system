<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="租户" prop="tenantId">
        <el-input
          v-model="queryParams.tenantId"
          placeholder="请输入租户"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="重试接口地址" prop="retryUrl">
        <el-input
          v-model="queryParams.retryUrl"
          placeholder="请输入重试接口地址"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-input
          v-model="queryParams.state"
          placeholder="请输入状态"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="${comment}" prop="ctime">
        <el-date-picker clearable
          v-model="queryParams.ctime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择${comment}">
        </el-date-picker>
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
          v-hasPermi="['aiWarning:queue:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['aiWarning:queue:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['aiWarning:queue:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['aiWarning:queue:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="queueList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="center" prop="id" />
      <el-table-column label="租户" align="center" prop="tenantId" />
      <el-table-column label="重试接口地址" align="center" prop="retryUrl" />
      <el-table-column label="重试参数" align="center" prop="retryData" />
      <el-table-column label="状态" align="center" prop="state" />
      <el-table-column label="${comment}" align="center" prop="ctime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.ctime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['aiWarning:queue:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['aiWarning:queue:remove']"
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

    <!-- 添加或修改请求重试队列对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="queueRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="租户" prop="tenantId">
          <el-input v-model="form.tenantId" placeholder="请输入租户" />
        </el-form-item>
        <el-form-item label="重试接口地址" prop="retryUrl">
          <el-input v-model="form.retryUrl" placeholder="请输入重试接口地址" />
        </el-form-item>
        <el-form-item label="重试参数" prop="retryData">
          <el-input v-model="form.retryData" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-input v-model="form.state" placeholder="请输入状态" />
        </el-form-item>
        <el-form-item label="${comment}" prop="ctime">
          <el-date-picker clearable
            v-model="form.ctime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择${comment}">
          </el-date-picker>
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

<script setup name="Queue">
import { listQueue, getQueue, delQueue, addQueue, updateQueue } from "@/api/aiWarning/queue";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const queueList = ref([]);
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
    tenantId: null,
    retryUrl: null,
    retryData: null,
    state: null,
    ctime: null
  },
  rules: {
    tenantId: [
      { required: true, message: "租户不能为空", trigger: "blur" }
    ],
    retryUrl: [
      { required: true, message: "重试接口地址不能为空", trigger: "blur" }
    ],
    state: [
      { required: true, message: "状态不能为空", trigger: "blur" }
    ],
    ctime: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询请求重试队列列表 */
function getList() {
  loading.value = true;
  listQueue(queryParams.value).then(response => {
    queueList.value = response.rows;
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
    tenantId: null,
    retryUrl: null,
    retryData: null,
    state: null,
    ctime: null
  };
  proxy.resetForm("queueRef");
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
  title.value = "添加请求重试队列";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getQueue(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改请求重试队列";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["queueRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateQueue(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addQueue(form.value).then(response => {
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
    return delQueue(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('aiWarning/queue/export', {
    ...queryParams.value
  }, `queue_${new Date().getTime()}.xlsx`)
}

getList();
</script>
