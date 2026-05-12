<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="70px">
      <el-form-item label="模板名称" prop="templateName">
        <el-input
          v-model="queryParams.templateName"
          placeholder="请输入巡检周期模板名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in unit_status"
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

    <el-row :gutter="10" class="mb8 toolsline">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['unitManage:cycleTemplate:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['unitManage:cycleTemplate:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['unitManage:cycleTemplate:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['unitManage:cycleTemplate:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 300px)" v-loading="loading" :data="cycleTemplateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="cycleId" />
      <el-table-column label="巡检周期模板名称" align="center" prop="templateName" />
      <el-table-column label="巡检周期开始时间" align="center" prop="planBeginTime" width="180"/>
      <el-table-column label="巡检周期结束时间" align="center" prop="planEndTime" width="180"/>
      <el-table-column label="是否次日" align="center" prop="nextDay" />
      <el-table-column label="间隔天数" align="center" prop="intervalDays" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="unit_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px" fixed="right">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['unitManage:cycleTemplate:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['unitManage:cycleTemplate:remove']"
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

    <!-- 添加或修改巡检周期模板对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="cycleTemplateRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="模板名称" prop="templateName">
          <el-input v-model="form.templateName" placeholder="请输入巡检周期模板名称" />
        </el-form-item>
        <el-form-item label="开始时间" prop="planBeginTime">
          <el-time-picker clearable
            v-model="form.planBeginTime"
            type="time"
            value-format="HH:mm:ss"
            placeholder="请选择巡检周期开始时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="planEndTime">
          <el-time-picker clearable
            v-model="form.planEndTime"
            type="time"
            value-format="HH:mm:ss"
            placeholder="请选择巡检周期结束时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="是否次日" prop="nextDay">
          <el-radio-group v-model="form.nextDay">
						<el-radio key="'0'" label="否"></el-radio>
						<el-radio key="'1'" label="是"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="间隔天数" prop="intervalDays">
          <el-input v-model="form.intervalDays" placeholder="请输入间隔天数" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in unit_status"
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

<script setup name="CycleTemplate">
import { listCycleTemplate, getCycleTemplate, delCycleTemplate, addCycleTemplate, updateCycleTemplate } from "@/api/unitManage/cycleTemplate";
import {h} from "vue";

const { proxy } = getCurrentInstance();
const { unit_status } = proxy.useDict('unit_status');

const cycleTemplateList = ref([]);
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
    templateName: null,
    status: null,
    delFlag:0,
  },
  rules: {
    templateName: [
      { required: true, message: "巡检周期模板名称不能为空", trigger: "blur" }
    ],
    planBeginTime: [
      { required: true, message: "巡检周期开始时间不能为空", trigger: "blur" }
    ],
    planEndTime: [
      { required: true, message: "巡检周期结束时间不能为空", trigger: "blur" }
    ],
    nextDay: [
      { required: true, message: "是否次日不能为空", trigger: "blur" }
    ],
    intervalDays: [
      { required: true, message: "间隔天数不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询巡检周期模板列表 */
function getList() {
  loading.value = true;
  listCycleTemplate(queryParams.value).then(response => {
    cycleTemplateList.value = response.rows;
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
    cycleId: null,
    templateName: null,
    planBeginTime: null,
    planEndTime: null,
    nextDay: null,
    intervalDays: null,
    status: "0",
    delFlag: "0",
  };
  proxy.resetForm("cycleTemplateRef");
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
  ids.value = selection.map(item => item.cycleId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加巡检周期模板";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const cycleId = row.cycleId || ids.value
  getCycleTemplate(cycleId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改巡检周期模板";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["cycleTemplateRef"].validate(valid => {
    if (valid) {
      if (form.value.cycleId != null) {
        updateCycleTemplate(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCycleTemplate(form.value).then(response => {
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
  const cycleIds = row.cycleId || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delCycleTemplate(cycleIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('unitManage/cycleTemplate/export', {
    ...queryParams.value
  }, `cycleTemplate_${new Date().getTime()}.xlsx`)
}

getList();
</script>
<style>
.toolsline{
  height: 30px;
}
</style>
