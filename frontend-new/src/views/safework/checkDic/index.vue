<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="作业类型" prop="operationType">
        <el-select v-model="queryParams.operationType" placeholder="请选择作业类型" clearable>
          <el-option
              v-for="dict in safe_operation_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="验收单位类型" prop="checkDeptType">
        <el-select v-model="queryParams.checkDeptType" placeholder="请选择验收单位类型" clearable>
          <el-option
            v-for="dict in safe_operation_out_in"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in status"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['safework:checkDic:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:checkDic:edit']"
        >修改</el-button>
      </el-col>
<!--      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:checkDic:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:checkDic:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 300px)" v-loading="loading" :data="checkDicList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="作业类型" align="center" prop="operationType">
        <template #default="scope">
          <dict-tag :options="safe_operation_type" :value="scope.row.operationType"/>
        </template>
      </el-table-column>
      <el-table-column label="作业验收序号" align="center" prop="orderNum" />
      <el-table-column label="验收单位类型" align="center" prop="checkDeptType">
        <template #default="scope">
          <dict-tag :options="safe_operation_out_in" :value="scope.row.checkDeptType"/>
        </template>
      </el-table-column>
      <el-table-column label="作业验收名称" align="center" prop="checkName" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:checkDic:edit']"
          >修改</el-button>
<!--          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:checkDic:remove']"
          >删除</el-button>-->
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

    <!-- 添加或修改作业验收字典对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="checkDicRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="作业类型" prop="operationType">
          <el-select v-model="form.operationType" placeholder="请选择作业类型">
            <el-option
              v-for="dict in safe_operation_type"
              :key="dict.value"
              :label="dict.label"
:value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作业验收序号" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入作业验收序号" type="number"/>
        </el-form-item>
        <el-form-item label="验收单位类型">
          <el-radio-group v-model="form.checkDeptType">
            <el-radio
              v-for="dict in safe_operation_out_in"
              :key="dict.value"
:label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="作业验收名称" prop="checkName">
          <el-input v-model="form.checkName" placeholder="请输入作业验收名称" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in status"
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

<script setup name="CheckDic">
import { listCheckDic, getCheckDic, delCheckDic, addCheckDic, updateCheckDic } from "@/api/safework/checkDic";
import {h} from "vue";

const { proxy } = getCurrentInstance();
const { status, safe_operation_out_in, safe_operation_type } = proxy.useDict('status', 'safe_operation_out_in', 'safe_operation_type');
const checkDicList = ref([]);
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
    checkDeptType: null,
    status: "0"
  },
  rules: {
    operationType: [
      { required: true, message: "作业类型不能为空", trigger: "change" }
    ],
    orderNum: [
      { required: true, message: "作业验收序号不能为空", trigger: "blur" }
    ],
    checkDeptType: [
      { required: true, message: "验收单位类型不能为空", trigger: "blur" }
    ],
    checkName: [
      { required: true, message: "作业验收名称不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询作业验收字典列表 */
function getList() {
  loading.value = true;
  listCheckDic(queryParams.value).then(response => {
    checkDicList.value = response.rows;
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
    operationType: null,
    orderNum: null,
    checkDeptType: "0",
    checkName: null,
    status: "0"
  };
  proxy.resetForm("checkDicRef");
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
  title.value = "添加作业验收字典";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getCheckDic(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改作业验收字典";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["checkDicRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateCheckDic(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCheckDic(form.value).then(response => {
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
    return delCheckDic(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/checkDic/export', {
    ...queryParams.value
  }, `checkDic_${new Date().getTime()}.xlsx`)
}

getList();
</script>
