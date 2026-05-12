<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="属性名称id" prop="nameId">
        <el-input
          v-model="queryParams.nameId"
          placeholder="请输入属性名称id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="值" prop="value">
        <el-input
          v-model="queryParams.value"
          placeholder="请输入值"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主表id" prop="mainId">
        <el-input
          v-model="queryParams.mainId"
          placeholder="请输入主表id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="顺序" prop="orderNum">
        <el-input
          v-model="queryParams.orderNum"
          placeholder="请输入顺序"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="其他安全措施" prop="safeMeasure">
        <el-input
          v-model="queryParams.safeMeasure"
          placeholder="请输入其他安全措施"
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
          v-hasPermi="['safework:brokenattr:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:brokenattr:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:brokenattr:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:brokenattr:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="brokenattrList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="center" prop="id" />
      <el-table-column label="属性名称id" align="center" prop="nameId" />
      <el-table-column label="值" align="center" prop="value" />
      <el-table-column label="分类：1现场确认2作业审核3作业验收" align="center" prop="type" />
      <el-table-column label="主表id" align="center" prop="mainId" />
      <el-table-column label="内部，外部" align="center" prop="operateType" />
      <el-table-column label="顺序" align="center" prop="orderNum" />
      <el-table-column label="其他安全措施" align="center" prop="safeMeasure" />
      <el-table-column label="确认人/验收人签字" align="center" prop="confirmSign" />
      <el-table-column label="编制人签字" align="center" prop="preparedSign" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:brokenattr:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:brokenattr:remove']"
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

    <!-- 添加或修改断路作业确认、审核、验收属性信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="brokenattrRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="属性名称id" prop="nameId">
          <el-input v-model="form.nameId" placeholder="请输入属性名称id" />
        </el-form-item>
        <el-form-item label="值" prop="value">
          <el-input v-model="form.value" placeholder="请输入值" />
        </el-form-item>
        <el-form-item label="主表id" prop="mainId">
          <el-input v-model="form.mainId" placeholder="请输入主表id" />
        </el-form-item>
        <el-form-item label="顺序" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入顺序" />
        </el-form-item>
        <el-form-item label="其他安全措施" prop="safeMeasure">
          <el-input v-model="form.safeMeasure" placeholder="请输入其他安全措施" />
        </el-form-item>
        <el-form-item label="确认人/验收人签字" prop="confirmSign">
          <el-input v-model="form.confirmSign" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="编制人签字" prop="preparedSign">
          <el-input v-model="form.preparedSign" type="textarea" placeholder="请输入内容" />
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

<script setup name="Brokenattr">
import { listBrokenattr, getBrokenattr, delBrokenattr, addBrokenattr, updateBrokenattr } from "@/api/safework/brokenattr";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const brokenattrList = ref([]);
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
    nameId: null,
    value: null,
    type: null,
    mainId: null,
    operateType: null,
    orderNum: null,
    safeMeasure: null,
    confirmSign: null,
    preparedSign: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询断路作业确认、审核、验收属性信息列表 */
function getList() {
  loading.value = true;
  listBrokenattr(queryParams.value).then(response => {
    brokenattrList.value = response.rows;
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
    nameId: null,
    value: null,
    type: null,
    mainId: null,
    operateType: null,
    orderNum: null,
    safeMeasure: null,
    confirmSign: null,
    preparedSign: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("brokenattrRef");
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
  title.value = "添加断路作业确认、审核、验收属性信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getBrokenattr(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改断路作业确认、审核、验收属性信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["brokenattrRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateBrokenattr(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addBrokenattr(form.value).then(response => {
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
    return delBrokenattr(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/brokenattr/export', {
    ...queryParams.value
  }, `brokenattr_${new Date().getTime()}.xlsx`)
}

getList();
</script>
