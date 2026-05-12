<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="levelName">
        <el-input
          v-model="queryParams.levelName"
          placeholder="请输入吊装作业级别名称"
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
          v-hasPermi="['safework:hoistingworkLevel:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:hoistingworkLevel:edit']"
        >修改</el-button>
      </el-col>
<!--      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:hoistingworkLevel:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:hoistingworkLevel:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 300px)" v-loading="loading" :data="hoistingworkLevelList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="吊装作业级别序号" align="center" prop="orderNum" />
      <el-table-column label="吊装作业级别编码" align="center" prop="levelCode" />
      <el-table-column label="吊装作业级别名称" align="center" prop="levelName" />
      <el-table-column label="吊装重物质量下限(t)" align="center" prop="weightLow" />
      <el-table-column label="吊装重物质量上限(t)" align="center" prop="weightUp" />
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
            v-hasPermi="['safework:hoistingworkLevel:edit']"
          >修改</el-button>
<!--          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:hoistingworkLevel:remove']"
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

    <!-- 添加或修改吊装作业级别对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="hoistingworkLevelRef" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="吊装作业级别序号" prop="orderNum">
					<el-input-number v-model="form.orderNum" controls-position="right" :min="0"/>
        </el-form-item>
        <el-form-item label="吊装作业级别编码" prop="levelCode">
          <el-input v-model="form.levelCode" placeholder="请输入吊装作业级别编码" />
        </el-form-item>
        <el-form-item label="吊装作业级别名称" prop="levelName">
          <el-input v-model="form.levelName" placeholder="请输入吊装作业级别名称" />
        </el-form-item>
        <el-form-item label="吊装重物质量下限(t)" prop="weightLow">
					<el-input-number v-model="form.weightLow" controls-position="right" :min="0"/>
        </el-form-item>
        <el-form-item label="吊装重物质量上限(t)" prop="weightUp">
					<el-input-number v-model="form.weightUp" controls-position="right" :min="0"/>
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

<script setup name="HoistingworkLevel">
import { listHoistingworkLevel, getHoistingworkLevel, delHoistingworkLevel, addHoistingworkLevel, updateHoistingworkLevel } from "@/api/safework/hoistingworkLevel";
import {h} from "vue";

const { proxy } = getCurrentInstance();
const { status } = proxy.useDict('status');

const hoistingworkLevelList = ref([]);
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
    levelName: null,
    status: "0"
  },
  rules: {
    orderNum: [
      { required: true, message: "吊装作业级别序号不能为空", trigger: "blur" }
    ],
    levelCode: [
      { required: true, message: "吊装作业级别编码不能为空", trigger: "blur" }
    ],
    levelName: [
      { required: true, message: "吊装作业级别名称不能为空", trigger: "blur" }
    ],
    weightLow: [
      { required: true, message: "吊装重物质量下限不能为空", trigger: "blur" }
    ],
    weightUp: [
      { required: true, message: "吊装重物质量上限不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询吊装作业级别列表 */
function getList() {
  loading.value = true;
  listHoistingworkLevel(queryParams.value).then(response => {
    hoistingworkLevelList.value = response.rows;
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
    orderNum: "0",
    levelCode: null,
    levelName: null,
    expirationHour: null,
    reminderHour: null,
    status: "0"
  };
  proxy.resetForm("hoistingworkLevelRef");
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
  title.value = "添加吊装作业级别";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getHoistingworkLevel(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改吊装作业级别";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["hoistingworkLevelRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateHoistingworkLevel(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addHoistingworkLevel(form.value).then(response => {
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
    return delHoistingworkLevel(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/hoistingworkLevel/export', {
    ...queryParams.value
  }, `hoistingworkLevel_${new Date().getHour()}.xlsx`)
}

getList();
</script>
