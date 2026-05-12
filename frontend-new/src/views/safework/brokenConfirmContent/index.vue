<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="断路作业属性表id" prop="sceneUserId">
        <el-input
          v-model="queryParams.sceneUserId"
          placeholder="请输入断路作业属性表id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="断路作业现场确认内容id" prop="confirmId">
        <el-input
          v-model="queryParams.confirmId"
          placeholder="请输入断路作业现场确认内容id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否确认" prop="checkFlag">
        <el-input
          v-model="queryParams.checkFlag"
          placeholder="请输入是否确认"
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
          v-hasPermi="['safework:brokenConfirmContent:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:brokenConfirmContent:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:brokenConfirmContent:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:brokenConfirmContent:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="brokenConfirmContentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="center" prop="id" />
      <el-table-column label="断路作业属性表id" align="center" prop="sceneUserId" />
      <el-table-column label="断路作业现场确认内容id" align="center" prop="confirmId" />
      <el-table-column label="是否确认" align="center" prop="checkFlag" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:brokenConfirmContent:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:brokenConfirmContent:remove']"
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

    <!-- 添加或修改断路作业现场确认内容对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="brokenConfirmContentRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="断路作业属性表id" prop="sceneUserId">
          <el-input v-model="form.sceneUserId" placeholder="请输入断路作业属性表id" />
        </el-form-item>
        <el-form-item label="断路作业现场确认内容id" prop="confirmId">
          <el-input v-model="form.confirmId" placeholder="请输入断路作业现场确认内容id" />
        </el-form-item>
        <el-form-item label="是否确认" prop="checkFlag">
          <el-input v-model="form.checkFlag" placeholder="请输入是否确认" />
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

<script setup name="BrokenConfirmContent">
import { listBrokenConfirmContent, getBrokenConfirmContent, delBrokenConfirmContent, addBrokenConfirmContent, updateBrokenConfirmContent } from "@/api/safework/brokenConfirmContent";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const brokenConfirmContentList = ref([]);
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
    sceneUserId: null,
    confirmId: null,
    checkFlag: null
  },
  rules: {
    sceneUserId: [
      { required: true, message: "断路作业属性表id不能为空", trigger: "blur" }
    ],
    confirmId: [
      { required: true, message: "断路作业现场确认内容id不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询断路作业现场确认内容列表 */
function getList() {
  loading.value = true;
  listBrokenConfirmContent(queryParams.value).then(response => {
    brokenConfirmContentList.value = response.rows;
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
    sceneUserId: null,
    confirmId: null,
    checkFlag: null
  };
  proxy.resetForm("brokenConfirmContentRef");
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
  title.value = "添加断路作业现场确认内容";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getBrokenConfirmContent(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改断路作业现场确认内容";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["brokenConfirmContentRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateBrokenConfirmContent(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addBrokenConfirmContent(form.value).then(response => {
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
    return delBrokenConfirmContent(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/brokenConfirmContent/export', {
    ...queryParams.value
  }, `brokenConfirmContent_${new Date().getTime()}.xlsx`)
}

getList();
</script>
