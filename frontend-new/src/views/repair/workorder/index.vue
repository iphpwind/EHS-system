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
      <el-form-item label="单元id" prop="sectionId">
        <el-input
          v-model="queryParams.sectionId"
          placeholder="请输入单元id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="单元设备id" prop="deviceId">
        <el-input
          v-model="queryParams.deviceId"
          placeholder="请输入单元设备id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="重要性" prop="importance">
        <el-select v-model="queryParams.importance" placeholder="请选择重要性" clearable>
          <el-option
            v-for="dict in repair_importance"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="维修负责人id" prop="principalId">
        <el-input
          v-model="queryParams.principalId"
          placeholder="请输入维修负责人id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发起人id" prop="sponsorId">
        <el-input
          v-model="queryParams.sponsorId"
          placeholder="请输入发起人id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发起时间" prop="startTime">
        <el-date-picker clearable
          v-model="queryParams.startTime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择发起时间">
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
          v-hasPermi="['unitManage:workorder:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['unitManage:workorder:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['unitManage:workorder:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['unitManage:workorder:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="workorderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="部门id" align="center" prop="deptId" />
      <el-table-column label="单元id" align="center" prop="sectionId" />
      <el-table-column label="单元设备id" align="center" prop="deviceId" />
      <el-table-column label="故障类型" align="center" prop="faulttype" />
      <el-table-column label="故障详情" align="center" prop="fault" />
      <el-table-column label="重要性" align="center" prop="importance">
        <template #default="scope">
          <dict-tag :options="repair_importance" :value="scope.row.importance"/>
        </template>
      </el-table-column>
      <el-table-column label="维修负责人id" align="center" prop="principalId" />
      <el-table-column label="发起人id" align="center" prop="sponsorId" />
      <el-table-column label="发起时间" align="center" prop="startTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态 1：待发布；2：待维修；3：待修改；4：暂不整改；5：继续整改；6：完成；7：废弃" align="center" prop="status" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['unitManage:workorder:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['unitManage:workorder:remove']"
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

    <!-- 添加或修改维修工单对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="workorderRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="部门id" prop="deptId">
          <el-input v-model="form.deptId" placeholder="请输入部门id" />
        </el-form-item>
        <el-form-item label="单元id" prop="sectionId">
          <el-input v-model="form.sectionId" placeholder="请输入单元id" />
        </el-form-item>
        <el-form-item label="单元设备id" prop="deviceId">
          <el-input v-model="form.deviceId" placeholder="请输入单元设备id" />
        </el-form-item>
        <el-form-item label="故障详情" prop="fault">
          <el-input v-model="form.fault" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="重要性" prop="importance">
          <el-select v-model="form.importance" placeholder="请选择重要性">
            <el-option
              v-for="dict in repair_importance"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="维修负责人id" prop="principalId">
          <el-input v-model="form.principalId" placeholder="请输入维修负责人id" />
        </el-form-item>
        <el-form-item label="发起人id" prop="sponsorId">
          <el-input v-model="form.sponsorId" placeholder="请输入发起人id" />
        </el-form-item>
        <el-form-item label="发起时间" prop="startTime">
          <el-date-picker clearable
            v-model="form.startTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择发起时间">
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

<script setup name="Workorder">
import { listWorkorder, getWorkorder, delWorkorder, addWorkorder, updateWorkorder } from "@/api/unitManage/workorder";
import {h} from "vue";

const { proxy } = getCurrentInstance();
const { repair_importance } = proxy.useDict('repair_importance');
const workorderList = ref([]);
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
    sectionId: null,
    deviceId: null,
    faulttype: null,
    fault: null,

importance: null,
    principalId: null,
    sponsorId: null,
    startTime: null,
    status: null
  },
  rules: {
    deviceId: [
      { required: true, message: "单元设备id不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询维修工单列表 */
function getList() {
  loading.value = true;
  listWorkorder(queryParams.value).then(response => {
    workorderList.value = response.rows;
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
    sectionId: null,
    deviceId: null,
    faulttype: null,
    fault: null,

importance: null,
    principalId: null,
    sponsorId: null,
    startTime: null,
    status: 0
  };
  proxy.resetForm("workorderRef");
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
  title.value = "添加维修工单";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getWorkorder(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改维修工单";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["workorderRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateWorkorder(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addWorkorder(form.value).then(response => {
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
    return delWorkorder(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('unitManage/workorder/export', {
    ...queryParams.value
  }, `workorder_${new Date().getTime()}.xlsx`)
}

getList();
</script>
<style>
.toolsline{
  height: 30px;
}
</style>
