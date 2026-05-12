<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="analysisName">
        <el-input
          v-model="queryParams.analysisName"
          placeholder="请输入分析化验项目名称"
          clearable
          @keyup.enter="handleQuery"
        />
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
          v-hasPermi="['safework:operationAnalysis:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:operationAnalysis:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:operationAnalysis:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 300px)" v-loading="loading" :data="operationAnalysisList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="作业类型" align="center" prop="operationType">
        <template #default="scope">
          <dict-tag :options="safe_operation_type" :value="scope.row.operationType"/>
        </template>
      </el-table-column>
      <el-table-column label="分析化验项目名称" align="center" prop="analysisName" />
      <el-table-column label="属性类型" align="center" prop="analysisType">
        <template #default="scope">
          <dict-tag :options="safe_analysis_type" :value="scope.row.analysisType"/>
        </template>
      </el-table-column>
      <!-- <el-table-column label="数值上限" align="center" prop="numUp" />
      <el-table-column label="数值下限" align="center" prop="numLow" />
      <el-table-column label="单位" align="center" prop="numUnit" />
      <el-table-column label="字符串范围" align="center" prop="stringArea" />
      <el-table-column label="字符串正常值" align="center" prop="stringNormal" /> -->
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
            v-hasPermi="['safework:operationAnalysis:edit']"
          >修改</el-button>
<!--          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:operationAnalysis:remove']"
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

    <!-- 添加或修改安全作业票分析化验项目对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="operationAnalysisRef" :model="form" :rules="rules" label-width="100px">
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
        <el-form-item label="项目名称" prop="analysisName">
          <el-input v-model="form.analysisName" placeholder="请输入分析化验项目名称" />
        </el-form-item>
        <el-form-item label="属性类型">
          <el-radio-group v-model="form.analysisType">
            <el-radio
              v-for="dict in safe_analysis_type"
              :key="dict.value"
:label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.analysisType == '0'" label="数值上限" prop="numUp">
          <el-input v-model="form.numUp" placeholder="请输入数值上限" />
        </el-form-item>
        <el-form-item v-if="form.analysisType == '0'" label="数值下限" prop="numLow">
          <el-input v-model="form.numLow" placeholder="请输入数值下限" />
        </el-form-item>
        <el-form-item v-if="form.analysisType == '0'" label="单位" prop="numUnit">
          <el-input v-model="form.numUnit" placeholder="请输入单位" />
        </el-form-item>
        <el-form-item v-if="form.analysisType == '1'" label="字符串范围" prop="stringArea">
          <el-input v-model="form.stringArea" placeholder="请输入字符串范围" />
        </el-form-item>
        <el-form-item v-if="form.analysisType == '1'" label="字符串正常值" prop="stringNormal">
          <el-input v-model="form.stringNormal" placeholder="请输入字符串正常值" />
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

<script setup name="OperationAnalysis">
import { listOperationAnalysis, getOperationAnalysis, delOperationAnalysis, addOperationAnalysis, updateOperationAnalysis } from "@/api/safework/operationAnalysis";
import {h} from "vue";

const { proxy } = getCurrentInstance();
const { safe_analysis_type, status,safe_operation_type } = proxy.useDict('safe_analysis_type', 'status','safe_operation_type',);

const operationAnalysisList = ref([]);
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
    analysisName: null,
    status: null
  },
  rules: {
    analysisName: [
      { required: true, message: "分析化验项目名称不能为空", trigger: "blur" }
    ],
    analysisType: [
      { required: true, message: "属性类型(0数值 1字符串)不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "blur" }
    ],
    operationType: [
      { required: true, message: "作业类型必选", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询安全作业票分析化验项目列表 */
function getList() {
  loading.value = true;
  listOperationAnalysis(queryParams.value).then(response => {
    operationAnalysisList.value = response.rows;
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
    analysisName: null,
    analysisType: "0",
    numUp: null,
    numLow: null,
    numUnit: null,
    stringArea: null,
    stringNormal: null,
    status: "0"
  };
  proxy.resetForm("operationAnalysisRef");
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
  title.value = "添加安全作业票分析化验项目";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getOperationAnalysis(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改安全作业票分析化验项目";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["operationAnalysisRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateOperationAnalysis(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addOperationAnalysis(form.value).then(response => {
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
    return delOperationAnalysis(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/operationAnalysis/export', {
    ...queryParams.value
  }, `operationAnalysis_${new Date().getTime()}.xlsx`)
}

getList();
</script>
