<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工单id" prop="woId">
        <el-input
          v-model="queryParams.woId"
          placeholder="请输入工单id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="维修人id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入维修人id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作" prop="operate">
        <el-input
          v-model="queryParams.operate"
          placeholder="请输入操作"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="维修时间" prop="operateTime">
        <el-date-picker clearable
          v-model="queryParams.operateTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择维修时间">
        </el-date-picker>
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
          v-hasPermi="['unitManage:flowpath:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['unitManage:flowpath:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['unitManage:flowpath:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['unitManage:flowpath:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="flowpathList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="工单id" align="center" prop="woId" />
      <el-table-column label="维修人id" align="center" prop="userId" />
      <el-table-column label="操作" align="center" prop="operate" />
      <el-table-column label="补充说明" align="center" prop="remark" />
      <el-table-column label="维修时间" align="center" prop="operateTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.operateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['unitManage:flowpath:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['unitManage:flowpath:remove']"
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

    <!-- 添加或修改维修流程对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="flowpathRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工单id" prop="woId">
          <el-input v-model="form.woId" placeholder="请输入工单id" />
        </el-form-item>
        <el-form-item label="维修人id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入维修人id" />
        </el-form-item>
        <el-form-item label="操作" prop="operate">
          <el-input v-model="form.operate" placeholder="请输入操作" />
        </el-form-item>
        <el-form-item label="补充说明" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="维修时间" prop="operateTime">
          <el-date-picker clearable
            v-model="form.operateTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择维修时间">
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

<script setup name="Flowpath">
import { listFlowpath, getFlowpath, delFlowpath, addFlowpath, updateFlowpath } from "@/api/unitManage/flowpath";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const flowpathList = ref([]);
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
    woId: null,
    userId: null,
    operate: null,
    operateTime: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询维修流程列表 */
function getList() {
  loading.value = true;
  listFlowpath(queryParams.value).then(response => {
    flowpathList.value = response.rows;
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
    woId: null,
    userId: null,
    operate: null,
    remark: null,
    operateTime: null
  };
  proxy.resetForm("flowpathRef");
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
  title.value = "添加维修流程";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getFlowpath(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改维修流程";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["flowpathRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateFlowpath(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addFlowpath(form.value).then(response => {
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
    return delFlowpath(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('unitManage/flowpath/export', {
    ...queryParams.value
  }, `flowpath_${new Date().getTime()}.xlsx`)
}

getList();
</script>
<style>
.toolsline{
  height: 30px;
}
</style>