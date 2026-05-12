<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="部门id" prop="deptId">
        <el-input
          v-model="queryParams.deptId"
          placeholder="请输入部门id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工单id" prop="woId">
        <el-input
          v-model="queryParams.woId"
          placeholder="请输入工单id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="故障诊断" prop="troubleshooting">
        <el-input
          v-model="queryParams.troubleshooting"
          placeholder="请输入故障诊断"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="维修方法" prop="repairmethod">
        <el-input
          v-model="queryParams.repairmethod"
          placeholder="请输入维修方法"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="验收人id" prop="acceptanceId">
        <el-input
          v-model="queryParams.acceptanceId"
          placeholder="请输入验收人id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="维修人id" prop="repairId">
        <el-input
          v-model="queryParams.repairId"
          placeholder="请输入维修人id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="维修时间" prop="repairTime">
        <el-date-picker clearable
          v-model="queryParams.repairTime"
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
          v-hasPermi="['unitManage:repairorder:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['unitManage:repairorder:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['unitManage:repairorder:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['unitManage:repairorder:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="repairorderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="部门id" align="center" prop="deptId" />
      <el-table-column label="工单id" align="center" prop="woId" />
      <el-table-column label="故障诊断" align="center" prop="troubleshooting" />
      <el-table-column label="维修方法" align="center" prop="repairmethod" />
      <el-table-column label="补充说明" align="center" prop="remark" />
      <el-table-column label="验收人id" align="center" prop="acceptanceId" />
      <el-table-column label="维修人id" align="center" prop="repairId" />
      <el-table-column label="维修时间" align="center" prop="repairTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.repairTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态 1：暂不维修；2：申请验收；" align="center" prop="status" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['unitManage:repairorder:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['unitManage:repairorder:remove']"
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

    <!-- 添加或修改工单维修对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="repairorderRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="部门id" prop="deptId">
          <el-input v-model="form.deptId" placeholder="请输入部门id" />
        </el-form-item>
        <el-form-item label="工单id" prop="woId">
          <el-input v-model="form.woId" placeholder="请输入工单id" />
        </el-form-item>
        <el-form-item label="故障诊断" prop="troubleshooting">
          <el-input v-model="form.troubleshooting" placeholder="请输入故障诊断" />
        </el-form-item>
        <el-form-item label="维修方法" prop="repairmethod">
          <el-input v-model="form.repairmethod" placeholder="请输入维修方法" />
        </el-form-item>
        <el-form-item label="补充说明" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="验收人id" prop="acceptanceId">
          <el-input v-model="form.acceptanceId" placeholder="请输入验收人id" />
        </el-form-item>
        <el-form-item label="维修人id" prop="repairId">
          <el-input v-model="form.repairId" placeholder="请输入维修人id" />
        </el-form-item>
        <el-form-item label="维修时间" prop="repairTime">
          <el-date-picker clearable
            v-model="form.repairTime"
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

<script setup name="Repairorder">
import { listRepairorder, getRepairorder, delRepairorder, addRepairorder, updateRepairorder } from "@/api/unitManage/repairorder";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const repairorderList = ref([]);
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
    deptId: null,
    woId: null,
    troubleshooting: null,
    repairmethod: null,
    acceptanceId: null,
    repairId: null,
    repairTime: null,
    status: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询工单维修列表 */
function getList() {
  loading.value = true;
  listRepairorder(queryParams.value).then(response => {
    repairorderList.value = response.rows;
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
    deptId: null,
    woId: null,
    troubleshooting: null,
    repairmethod: null,
    remark: null,
    acceptanceId: null,
    repairId: null,
    repairTime: null,
    status: 0
  };
  proxy.resetForm("repairorderRef");
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
  title.value = "添加工单维修";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getRepairorder(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改工单维修";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["repairorderRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateRepairorder(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addRepairorder(form.value).then(response => {
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
    return delRepairorder(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('unitManage/repairorder/export', {
    ...queryParams.value
  }, `repairorder_${new Date().getTime()}.xlsx`)
}

getList();
</script>
<style>
.toolsline{
  height: 30px;
}
</style>