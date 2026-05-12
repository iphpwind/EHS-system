<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="班次名称" prop="shiftName">
        <el-input
          v-model="queryParams.shiftName"
          placeholder="请输入班次名称"
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
          v-hasPermi="['safework:shifts:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:shifts:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:shifts:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:shifts:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="shiftsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="班次名称" align="center" prop="shiftName" />
      <el-table-column label="开始时间" align="center" prop="startTime" width="180">
        <template #default="scope">
          <span>{{ scope.row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" width="180">
        <template #default="scope">
          <span>{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否跨天" align="center" prop="crossesMidnight" />
      <el-table-column label="班次状态" align="center" prop="status" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:shifts:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:shifts:remove']"
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

    <!-- 添加或修改班次管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="shiftsRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="班次名称" prop="shiftName">
          <el-input v-model="form.shiftName" placeholder="请输入班次名称" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-time-picker clearable
            v-model="form.startTime"
            format="HH:mm"
            placeholder="请选择开始时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-time-picker clearable
            v-model="form.endTime"
            format="HH:mm"
            placeholder="请选择结束时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="是否跨天">
          <el-radio-group v-model="form.crossesMidnight">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
                v-for="dict in sys_normal_disable"
                :key="dict.value"
                :label="dict.value"
            >{{ dict.label }}
            </el-radio>
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

<script setup name="Shifts">
import { listShifts, getShifts, delShifts, addShifts, updateShifts } from "@/api/safework/shifts";
import {parseTime} from '@/utils/ruoyi'
import {h} from "vue";
const { proxy } = getCurrentInstance();

const shiftsList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const {sys_normal_disable} = proxy.useDict("sys_normal_disable");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    enterpriseCode: null,
    shiftName: null,
    startTime: null,
    endTime: null,
    status: null
  },
  rules: {
    shiftName: [
      { required: true, message: "班次名称不能为空", trigger: "blur" }
    ],
    startTime: [
      { required: true, message: "开始时间不能为空", trigger: "blur" }
    ],
    endTime: [
      { required: true, message: "结束时间不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "班次状态不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询班次管理列表 */
function getList() {
  loading.value = true;
  listShifts(queryParams.value).then(response => {
    shiftsList.value = response.rows;
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
    shiftId: null,
    enterpriseCode: null,
    shiftName: null,
    startTime: null,
    endTime: null,
    status: "0"
  };
  proxy.resetForm("shiftsRef");
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
  ids.value = selection.map(item => item.shiftId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加班次管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const shiftId = row.shiftId || ids.value
  getShifts(shiftId).then(response => {
    form.value = response.data;
    // console.log("asdsad","2014-07-10 "+response.data.startTime+":12");
    // console.log("asdsad",new Date("2014-07-10 "+response.data.startTime+":12"));
    form.value.startTime = new Date("2014-07-10 "+response.data.startTime+":00");
    form.value.endTime = new Date("2014-07-10 "+response.data.endTime+":00");
    open.value = true;
    title.value = "修改班次管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["shiftsRef"].validate(valid => {
    if (valid) {

      form.value.startTime = formatDate(form.value.startTime)
      form.value.endTime = formatDate(form.value.endTime)
      if (form.value.shiftId != null) {
        updateShifts(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addShifts(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
function formatDate(params) {

  console.log(params);
  let date = new Date(params);
  let time = new Date(date.getTime());
  return parseTime(time,'{y}-{m}-{d} {h}:{i}:{s}');
}
/** 删除按钮操作 */
function handleDelete(row) {
  const shiftIds = row.shiftId || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delShifts(shiftIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/shifts/export', {
    ...queryParams.value
  }, `shifts_${new Date().getTime()}.xlsx`)
}

getList();
</script>
