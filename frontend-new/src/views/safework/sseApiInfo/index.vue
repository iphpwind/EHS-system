<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="部门id" prop="deptId">
        <el-input
          v-model="queryParams.deptId"
          placeholder="请输入部门id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="token" prop="token">
        <el-input
          v-model="queryParams.token"
          placeholder="请输入token"
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
        >新增</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="sseApiInfoList">
      <el-table-column label="部门id" align="center" prop="deptId" />
      <el-table-column label="企业编码，同“危险化学品登记信息管理系统”中的企业编码一致" align="center" prop="companycode" />
      <el-table-column label="token" align="center" prop="token" />
      <el-table-column label="AES向量" align="center" prop="aesIv" />
      <el-table-column label="AES密钥" align="center" prop="aesKey" />
      <el-table-column label="地址" align="center" prop="baseUrl" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
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

    <!-- 添加或修改sseApiInfo对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="sseApiInfoRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="部门id" prop="deptId">
          <el-input v-model="form.deptId" placeholder="请输入部门id" />
        </el-form-item>
        <el-form-item label="企业编码" prop="companycode">
          <el-input v-model="form.companycode" placeholder="请输入企业编码，同“危险化学品登记信息管理系统”中的企业编码一致" />
        </el-form-item>
        <el-form-item label="token" prop="token">
          <el-input v-model="form.token" placeholder="请输入token" />
        </el-form-item>
        <el-form-item label="AES向量" prop="aesIv">
          <el-input v-model="form.aesIv" placeholder="请输入AES向量" />
        </el-form-item>
        <el-form-item label="AES密钥" prop="aesKey">
          <el-input v-model="form.aesKey" placeholder="请输入AES密钥" />
        </el-form-item>
        <el-form-item label="地址" prop="baseUrl">
          <el-input v-model="form.baseUrl" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="安工院人员定位推送账号" prop="baseUrl">
          <el-input v-model="form.agyUserName" placeholder="请输入安工院人员定位推送账号" />
        </el-form-item>
        <el-form-item label="安工院人员定位推送密码" prop="baseUrl">
          <el-input v-model="form.agyPassword" placeholder="请输入安工院人员定位推送密码" />
        </el-form-item>
        <el-form-item label="统一信用编码" prop="baseUrl">
          <el-input v-model="form.creditNo" placeholder="请输入统一信用编码" />
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

<script setup name="SseApiInfo">
import { listSseApiInfo, getSseApiInfo, delSseApiInfo, addSseApiInfo, updateSseApiInfo } from "@/api/safework/sseApiInfo";

const { proxy } = getCurrentInstance();

const sseApiInfoList = ref([]);
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
  },
  rules: {
    deptId: [
      { required: true, message: "部门id不能为空", trigger: "blur" }
    ],
    companycode: [
      { required: true, message: "企业编码，同“危险化学品登记信息管理系统”中的企业编码一致不能为空", trigger: "blur" }
    ],
    token: [
      { required: true, message: "token不能为空", trigger: "blur" }
    ],
    aesIv: [
      { required: true, message: "AES向量不能为空", trigger: "blur" }
    ],
    aesKey: [
      { required: true, message: "AES密钥不能为空", trigger: "blur" }
    ],
    baseUrl: [
      { required: true, message: "$comment不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询sseApiInfo列表 */
function getList() {
  loading.value = false;
  listSseApiInfo(queryParams.value).then(response => {
    sseApiInfoList.value = response.rows;
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
    deptId: null,
    companycode: null,
    token: null,
    aesIv: null,
    aesKey: null,
    baseUrl: null
  };
  proxy.resetForm("sseApiInfoRef");
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

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加sseApiInfo";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getSseApiInfo(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改sseApiInfo";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["sseApiInfoRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateSseApiInfo(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSseApiInfo(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除sseApiInfo编号为"' + idss + '"的数据项？').then(function() {
    return delSseApiInfo(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/sseApiInfo/export', {
    ...queryParams.value
  }, `sseApiInfo_${new Date().getTime()}.xlsx`)
}

getList();
</script>
