<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="企业编码" prop="enterpriseCode">
        <el-input
          v-model="queryParams.enterpriseCode"
          placeholder="请输入企业编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="作业区域" prop="safeObjectId">
        <el-input
          v-model="queryParams.safeObjectId"
          placeholder="请输入作业区域"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="风险点" prop="safeUnitId">
        <el-input
          v-model="queryParams.safeUnitId"
          placeholder="请输入风险点"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="位置信息" prop="operationSite">
        <el-input
          v-model="queryParams.operationSite"
          placeholder="请输入位置信息"
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
          v-hasPermi="['safework:specialplace:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:specialplace:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:specialplace:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:specialplace:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="specialplaceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="center" prop="id" />
      <el-table-column label="企业编码" align="center" prop="enterpriseCode" />
      <el-table-column label="作业区域" align="center" prop="safeObjectId" />
      <el-table-column label="风险点" align="center" prop="safeUnitId" />
      <el-table-column label="位置信息" align="center" prop="operationSite" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:specialplace:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:specialplace:remove']"
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

    <!-- 添加或修改作业地点对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="specialplaceRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="企业编码" prop="enterpriseCode">
          <el-input v-model="form.enterpriseCode" placeholder="请输入企业编码" />
        </el-form-item>
        <el-form-item label="作业区域" prop="safeObjectId">
          <el-input v-model="form.safeObjectId" placeholder="请输入作业区域" />
        </el-form-item>
        <el-form-item label="风险点" prop="safeUnitId">
          <el-input v-model="form.safeUnitId" placeholder="请输入风险点" />
        </el-form-item>
        <el-form-item label="位置信息" prop="operationSite">
          <el-input v-model="form.operationSite" placeholder="请输入位置信息" />
        </el-form-item>
        <el-form-item label="状态" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入状态" />
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

<script setup name="Specialplace">
import { listSpecialplace, getSpecialplace, delSpecialplace, addSpecialplace, updateSpecialplace } from "@/api/safework/specialplace";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const specialplaceList = ref([]);
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
    safeObjectId: null,
    safeUnitId: null,
    operationSite: null,
  },
  rules: {
    safeObjectId: [
      { required: true, message: "作业区域不能为空", trigger: "blur" }
    ],
    safeUnitId: [
      { required: true, message: "风险点不能为空", trigger: "blur" }
    ],
    operationSite: [
      { required: true, message: "位置信息不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询作业地点列表 */
function getList() {
  loading.value = true;
  listSpecialplace(queryParams.value).then(response => {
    specialplaceList.value = response.rows;
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
    safeObjectId: null,
    safeUnitId: null,
    operationSite: null,
    delFlag: null
  };
  proxy.resetForm("specialplaceRef");
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
  title.value = "添加作业地点";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getSpecialplace(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改作业地点";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["specialplaceRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateSpecialplace(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSpecialplace(form.value).then(response => {
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
    return delSpecialplace(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/specialplace/export', {
    ...queryParams.value
  }, `specialplace_${new Date().getTime()}.xlsx`)
}

getList();
</script>
