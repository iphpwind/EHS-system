<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="作业票id" prop="mainId">
        <el-input
          v-model="queryParams.mainId"
          placeholder="请输入作业票id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="作业单位监护人id" prop="controlUserId">
        <el-input
          v-model="queryParams.controlUserId"
          placeholder="请输入作业单位监护人id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="作业单位负责人id" prop="chargeUserId">
        <el-input
          v-model="queryParams.chargeUserId"
          placeholder="请输入作业单位负责人id"
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
          v-hasPermi="['safework:brokenControlCharge:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:brokenControlCharge:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:brokenControlCharge:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:brokenControlCharge:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="brokenControlChargeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="center" prop="id" />
      <el-table-column label="作业票id" align="center" prop="mainId" />
      <el-table-column label="作业单位监护人签字" align="center" prop="controlSign" />
      <el-table-column label="作业单位监护人id" align="center" prop="controlUserId" />
      <el-table-column label="作业单位监护人类型1,承包商2,所属机构部门" align="center" prop="controlUserType" />
      <el-table-column label="作业负责人签字" align="center" prop="workChargeSign" />
      <el-table-column label="作业单位负责人id" align="center" prop="chargeUserId" />
      <el-table-column label="作业单位负责人类型" align="center" prop="chargeUserType" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:brokenControlCharge:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:brokenControlCharge:remove']"
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

    <!-- 添加或修改断路作业监护人负责人信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="brokenControlChargeRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="作业票id" prop="mainId">
          <el-input v-model="form.mainId" placeholder="请输入作业票id" />
        </el-form-item>
        <el-form-item label="作业单位监护人签字" prop="controlSign">
          <el-input v-model="form.controlSign" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="作业单位监护人id" prop="controlUserId">
          <el-input v-model="form.controlUserId" placeholder="请输入作业单位监护人id" />
        </el-form-item>
        <el-form-item label="作业负责人签字" prop="workChargeSign">
          <el-input v-model="form.workChargeSign" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="作业单位负责人id" prop="chargeUserId">
          <el-input v-model="form.chargeUserId" placeholder="请输入作业单位负责人id" />
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

<script setup name="BrokenControlCharge">
import { listBrokenControlCharge, getBrokenControlCharge, delBrokenControlCharge, addBrokenControlCharge, updateBrokenControlCharge } from "@/api/safework/brokenControlCharge";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const brokenControlChargeList = ref([]);
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
    mainId: null,
    controlSign: null,
    controlUserId: null,
    controlUserType: null,
    workChargeSign: null,
    chargeUserId: null,
    chargeUserType: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询断路作业监护人负责人信息列表 */
function getList() {
  loading.value = true;
  listBrokenControlCharge(queryParams.value).then(response => {
    brokenControlChargeList.value = response.rows;
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
    mainId: null,
    controlSign: null,
    controlUserId: null,
    controlUserType: null,
    workChargeSign: null,
    chargeUserId: null,
    chargeUserType: null,
    createBy: null,
    createTime: null
  };
  proxy.resetForm("brokenControlChargeRef");
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
  title.value = "添加断路作业监护人负责人信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getBrokenControlCharge(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改断路作业监护人负责人信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["brokenControlChargeRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateBrokenControlCharge(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addBrokenControlCharge(form.value).then(response => {
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
    return delBrokenControlCharge(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/brokenControlCharge/export', {
    ...queryParams.value
  }, `brokenControlCharge_${new Date().getTime()}.xlsx`)
}

getList();
</script>
