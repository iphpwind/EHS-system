<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="工作票id" prop="pId">
        <el-input
          v-model="queryParams.pId"
          placeholder="请输入工作票id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="安全交底单字典id" prop="dicId">
        <el-input
          v-model="queryParams.dicId"
          placeholder="请输入安全交底单字典id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="基础信息确认情况" prop="basicInformationCheck">
        <el-input
          v-model="queryParams.basicInformationCheck"
          placeholder="请输入基础信息确认情况"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="作业许可范围及作业环境确认情况" prop="scopeEnvironmentCheck">
        <el-input
          v-model="queryParams.scopeEnvironmentCheck"
          placeholder="请输入作业许可范围及作业环境确认情况"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="作业风险确认情况" prop="operationRiskCheck">
        <el-input
          v-model="queryParams.operationRiskCheck"
          placeholder="请输入作业风险确认情况"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="防范措施确认情况" prop="preventiveCheck">
        <el-input
          v-model="queryParams.preventiveCheck"
          placeholder="请输入防范措施确认情况"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="应急措施确认情况" prop="emergencyCheck">
        <el-input
          v-model="queryParams.emergencyCheck"
          placeholder="请输入应急措施确认情况"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="其他注意事项确认情况" prop="remarkCheck">
        <el-input
          v-model="queryParams.remarkCheck"
          placeholder="请输入其他注意事项确认情况"
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
          v-hasPermi="['safework:earthSafety:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:earthSafety:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:earthSafety:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:earthSafety:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="earthSafetyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="center" prop="id" />
      <el-table-column label="工作票id" align="center" prop="pId" />
      <el-table-column label="安全交底单字典id" align="center" prop="dicId" />
      <el-table-column label="基础信息确认情况" align="center" prop="basicInformationCheck" />
      <el-table-column label="作业许可范围及作业环境确认情况" align="center" prop="scopeEnvironmentCheck" />
      <el-table-column label="作业风险确认情况" align="center" prop="operationRiskCheck" />
      <el-table-column label="防范措施确认情况" align="center" prop="preventiveCheck" />
      <el-table-column label="应急措施确认情况" align="center" prop="emergencyCheck" />
      <el-table-column label="其他注意事项确认情况" align="center" prop="remarkCheck" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:earthSafety:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:earthSafety:remove']"
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

    <!-- 添加或修改动土作业票安全交底对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="earthSafetyRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工作票id" prop="pId">
          <el-input v-model="form.pId" placeholder="请输入工作票id" />
        </el-form-item>
        <el-form-item label="安全交底单字典id" prop="dicId">
          <el-input v-model="form.dicId" placeholder="请输入安全交底单字典id" />
        </el-form-item>
        <el-form-item label="基础信息确认情况" prop="basicInformationCheck">
          <el-input v-model="form.basicInformationCheck" placeholder="请输入基础信息确认情况" />
        </el-form-item>
        <el-form-item label="作业许可范围及作业环境确认情况" prop="scopeEnvironmentCheck">
          <el-input v-model="form.scopeEnvironmentCheck" placeholder="请输入作业许可范围及作业环境确认情况" />
        </el-form-item>
        <el-form-item label="作业风险确认情况" prop="operationRiskCheck">
          <el-input v-model="form.operationRiskCheck" placeholder="请输入作业风险确认情况" />
        </el-form-item>
        <el-form-item label="防范措施确认情况" prop="preventiveCheck">
          <el-input v-model="form.preventiveCheck" placeholder="请输入防范措施确认情况" />
        </el-form-item>
        <el-form-item label="应急措施确认情况" prop="emergencyCheck">
          <el-input v-model="form.emergencyCheck" placeholder="请输入应急措施确认情况" />
        </el-form-item>
        <el-form-item label="其他注意事项确认情况" prop="remarkCheck">
          <el-input v-model="form.remarkCheck" placeholder="请输入其他注意事项确认情况" />
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

<script setup name="EarthSafety">
import { listEarthSafety, getEarthSafety, delEarthSafety, addEarthSafety, updateEarthSafety } from "@/api/safework/earthSafety";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const earthSafetyList = ref([]);
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
    pId: null,
    dicId: null,
    basicInformationCheck: null,
    scopeEnvironmentCheck: null,
    operationRiskCheck: null,
    preventiveCheck: null,
    emergencyCheck: null,
    remarkCheck: null
  },
  rules: {
    dicId: [
      { required: true, message: "安全交底单字典id不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询动土作业票安全交底列表 */
function getList() {
  loading.value = true;
  listEarthSafety(queryParams.value).then(response => {
    earthSafetyList.value = response.rows;
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
    pId: null,
    dicId: null,
    basicInformationCheck: null,
    scopeEnvironmentCheck: null,
    operationRiskCheck: null,
    preventiveCheck: null,
    emergencyCheck: null,
    remarkCheck: null
  };
  proxy.resetForm("earthSafetyRef");
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
  title.value = "添加动土作业票安全交底";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getEarthSafety(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改动土作业票安全交底";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["earthSafetyRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateEarthSafety(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEarthSafety(form.value).then(response => {
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
    return delEarthSafety(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/earthSafety/export', {
    ...queryParams.value
  }, `earthSafety_${new Date().getTime()}.xlsx`)
}

getList();
</script>
