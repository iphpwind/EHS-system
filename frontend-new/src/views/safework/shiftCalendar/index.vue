<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="日期" prop="date">
        <el-date-picker clearable
          v-model="queryParams.date"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="企业代码" prop="enterpriseCode">
        <el-input
          v-model="queryParams.enterpriseCode"
          placeholder="请输入企业代码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="带班段名称" prop="shiftName">
        <el-input
          v-model="queryParams.shiftName"
          placeholder="请输入带班段名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="带班人工号" prop="staffId">
        <el-input
          v-model="queryParams.staffId"
          placeholder="请输入带班人工号"
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
          v-hasPermi="['safework:shiftCalendar:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:shiftCalendar:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:shiftCalendar:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:shiftCalendar:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="shiftCalendarList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="日历ID" align="center" prop="id" />
      <el-table-column label="日期" align="center" prop="date" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.date, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="企业代码" align="center" prop="enterpriseCode" />
      <el-table-column label="带班段名称" align="center" prop="shiftName" />
      <el-table-column label="带班人工号" align="center" prop="staffId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:shiftCalendar:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:shiftCalendar:remove']"
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

    <!-- 添加或修改带班日历对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="shiftCalendarRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="日期" prop="date">
          <el-date-picker clearable
            v-model="form.date"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="企业代码" prop="enterpriseCode">
          <el-input v-model="form.enterpriseCode" placeholder="请输入企业代码" />
        </el-form-item>
        <el-form-item label="带班段名称" prop="shiftName">
          <el-input v-model="form.shiftName" placeholder="请输入带班段名称" />
        </el-form-item>
        <el-form-item label="带班人工号" prop="staffId">
          <el-input v-model="form.staffId" placeholder="请输入带班人工号" />
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

<script setup name="ShiftCalendar">
import { listShiftCalendar, getShiftCalendar, delShiftCalendar, addShiftCalendar, updateShiftCalendar } from "@/api/safework/shiftCalendar";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const shiftCalendarList = ref([]);
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
    date: null,
    enterpriseCode: null,
    shiftName: null,
    staffId: null,
  },
  rules: {
    date: [
      { required: true, message: "日期不能为空", trigger: "blur" }
    ],
    enterpriseCode: [
      { required: true, message: "企业代码不能为空", trigger: "blur" }
    ],
    shiftName: [
      { required: true, message: "带班段名称不能为空", trigger: "blur" }
    ],
    staffId: [
      { required: true, message: "带班人工号不能为空", trigger: "blur" }
    ],
    createTime: [
      { required: true, message: "创建时间不能为空", trigger: "blur" }
    ],
    createBy: [
      { required: true, message: "创建人不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询带班日历列表 */
function getList() {
  loading.value = true;
  listShiftCalendar(queryParams.value).then(response => {
    shiftCalendarList.value = response.rows;
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
    date: null,
    enterpriseCode: null,
    shiftName: null,
    staffId: null,
    createTime: null,
    createBy: null
  };
  proxy.resetForm("shiftCalendarRef");
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
  title.value = "添加带班日历";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getShiftCalendar(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改带班日历";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["shiftCalendarRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateShiftCalendar(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addShiftCalendar(form.value).then(response => {
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
  const ids = row.id || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delShiftCalendar(ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/shiftCalendar/export', {
    ...queryParams.value
  }, `shiftCalendar_${new Date().getTime()}.xlsx`)
}

getList();
</script>
