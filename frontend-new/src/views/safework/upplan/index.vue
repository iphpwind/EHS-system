<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="upplanList" @selection-change="handleSelectionChange">
      <el-table-column label="修订内容说明" align="center" prop="updateReason" />
      <el-table-column label="修订人" align="center" prop="nickName" />
      <el-table-column label="修订时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup name="Upplan">
import { listUpplan, getUpplan, delUpplan, addUpplan, updateUpplan } from "@/api/safework/upplan";

const { proxy } = getCurrentInstance();

const upplanList = ref([]);
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
    emergencyPlanId: null,
    updateReason: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询应急预案修订记录列表 */
function getList() {
  loading.value = true;
  listUpplan(queryParams.value).then(response => {
    upplanList.value = response.rows;
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
    emergencyPlanId: null,
    updateReason: null,
    createBy: null,
    createTime: null
  };
  proxy.resetForm("upplanRef");
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
  title.value = "添加应急预案修订记录";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getUpplan(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改应急预案修订记录";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["upplanRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateUpplan(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addUpplan(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除应急预案修订记录编号为"' + idss + '"的数据项？').then(function() {
    return delUpplan(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/upplan/export', {
    ...queryParams.value
  }, `upplan_${new Date().getTime()}.xlsx`)
}

getList();
</script>
