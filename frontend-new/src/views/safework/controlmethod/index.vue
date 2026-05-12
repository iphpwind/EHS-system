<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
<!--      <el-form-item label="企业编码" prop="enterpriseCode">
        <el-input
          v-model="queryParams.enterpriseCode"
          placeholder="请输入企业编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="分类编码" prop="controlMethodCode">
        <el-input
          v-model="queryParams.controlMethodCode"
          placeholder="请输入管控措施分类编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分类1" prop="controlMethodClassifyone">
        <el-input
          v-model="queryParams.controlMethodClassifyone"
          placeholder="请输入管控措施分类1"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="分类1代码" prop="classifyoneCode">
        <el-input
          v-model="queryParams.classifyoneCode"
          placeholder="请输入分类1代码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>-->
      <el-form-item label="分类2" prop="controlMethodClassifytwo">
        <el-input
          v-model="queryParams.controlMethodClassifytwo"
          placeholder="请输入管控措施分类2"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="分类2代码" prop="classifytwoCode">
        <el-input
          v-model="queryParams.classifytwoCode"
          placeholder="请输入分类2代码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>-->
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
          v-hasPermi="['safework:controlmethod:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:controlmethod:edit']"
        >修改</el-button>
      </el-col>
<!--      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:controlmethod:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:controlmethod:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="controlmethodList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="${comment}" align="center" prop="id" />
      <el-table-column label="企业编码" align="center" prop="enterpriseCode" />-->
      <el-table-column label="管控措施分类编码" align="center" prop="controlMethodCode" />
      <el-table-column label="管控措施分类1" align="center" prop="controlMethodClassifyone" />
      <el-table-column label="分类1代码" align="center" prop="classifyoneCode" />
      <el-table-column label="管控措施分类2" align="center" prop="controlMethodClassifytwo" />
      <el-table-column label="分类2代码" align="center" prop="classifytwoCode" />
      <el-table-column label="状态" align="center" prop="delFlag">
        <template #default="scope">
          <el-row justify="center" v-if="scope.row.delFlag == 0"><el-tag type="success">正常</el-tag></el-row>
          <el-row justify="center" v-else><el-tag type="danger">禁用</el-tag></el-row>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:controlmethod:edit']"
          >修改</el-button>
<!--          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:controlmethod:remove']"
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

    <!-- 添加或修改管控措施分类字典对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="controlmethodRef" :model="form" :rules="rules" label-width="100px">
<!--        <el-form-item label="企业编码" prop="enterpriseCode">
          <el-input v-model="form.enterpriseCode" placeholder="请输入企业编码" />
        </el-form-item>-->
        <el-form-item label="分类编码" prop="controlMethodCode">
          <el-input v-model="form.controlMethodCode" placeholder="请输入管控措施分类编码" />
        </el-form-item>
        <el-form-item label="分类名称1" prop="controlMethodClassifyone">
          <el-input v-model="form.controlMethodClassifyone" placeholder="请输入管控措施分类1" />
        </el-form-item>
        <el-form-item label="分类1代码" prop="classifyoneCode">
          <el-input v-model="form.classifyoneCode" placeholder="请输入分类1代码" />
        </el-form-item>
        <el-form-item label="分类名称2" prop="controlMethodClassifytwo">
          <el-input v-model="form.controlMethodClassifytwo" placeholder="请输入管控措施分类2" />
        </el-form-item>
        <el-form-item label="分类2代码" prop="classifytwoCode">
          <el-input v-model="form.classifytwoCode" placeholder="请输入分类2代码" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.delFlag">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
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

<script setup name="Controlmethod">
import { listControlmethod, getControlmethod, delControlmethod, addControlmethod, updateControlmethod } from "@/api/safework/controlmethod";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const controlmethodList = ref([]);
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
    enterpriseCode: null,
    controlMethodCode: null,
    controlMethodClassifyone: null,
    classifyoneCode: null,
    controlMethodClassifytwo: null,
    classifytwoCode: null,
  },
  rules: {
    controlMethodCode: [
      { required: true, message: '请填写管控措施分类编码', trigger: 'blur' }
    ],
    controlMethodClassifyone: [
      { required: true, message: '请填写管控措施分类1', trigger: 'blur' }
    ],
    classifyoneCode: [
      { required: true, message: '请填写分类1代码', trigger: 'blur' }
    ],
    controlMethodClassifytwo: [
      { required: true, message: '请填写管控措施分类2', trigger: 'blur' }
    ],
    classifytwoCode: [
      { required: true, message: '请填写分类2代码', trigger: 'blur' }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询双重预防-管控措施分类字典列表 */
function getList() {
  loading.value = true;
  listControlmethod(queryParams.value).then(response => {
    controlmethodList.value = response.rows;
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
    enterpriseCode: null,
    controlMethodCode: null,
    controlMethodClassifyone: null,
    classifyoneCode: null,
    controlMethodClassifytwo: null,
    classifytwoCode: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("controlmethodRef");
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
  form.value.delFlag = '0';
  open.value = true;
  title.value = "添加管控措施分类字典";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getControlmethod(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改管控措施分类字典";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["controlmethodRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateControlmethod(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addControlmethod(form.value).then(response => {
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
    return delControlmethod(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/controlmethod/export', {
    ...queryParams.value
  }, `controlmethod_${new Date().getTime()}.xlsx`)
}

getList();
</script>
