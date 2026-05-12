<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="接口地址" prop="url">
        <el-input
          v-model="queryParams.url"
          placeholder="请输入接口地址"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="返回消息" prop="msg">
        <el-input
          v-model="queryParams.msg"
          placeholder="请输入返回消息"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公司id" prop="enterpriseCode">
        <el-input
          v-model="queryParams.enterpriseCode"
          placeholder="请输入公司id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="ssemessageList" height="calc(100vh - 260px)" @selection-change="handleSelectionChange">
      <el-table-column label="传送数据" align="center" prop="data" />
      <el-table-column label="接口地址" align="center" prop="url" />
      <el-table-column label="返回消息" align="center" prop="msg" />
      <el-table-column label="公司id" align="center" prop="enterpriseCode" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script setup name="Ssemessage">
import { listSsemessage, getSsemessage, delSsemessage, addSsemessage, updateSsemessage } from "@/api/safework/ssemessage";

const { proxy } = getCurrentInstance();

const ssemessageList = ref([]);
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
    data: null,
    url: null,
    msg: null,
    enterpriseCode: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询安工院推送记录列表 */
function getList() {
  loading.value = true;
  listSsemessage(queryParams.value).then(response => {
    ssemessageList.value = response.rows;
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
    data: null,
    url: null,
    msg: null,
    createBy: null,
    createTime: null,
    enterpriseCode: null
  };
  proxy.resetForm("ssemessageRef");
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
  title.value = "添加安工院推送记录";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getSsemessage(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改安工院推送记录";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["ssemessageRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateSsemessage(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSsemessage(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除安工院推送记录编号为"' + idss + '"的数据项？').then(function() {
    return delSsemessage(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/ssemessage/export', {
    ...queryParams.value
  }, `ssemessage_${new Date().getTime()}.xlsx`)
}

getList();
</script>
