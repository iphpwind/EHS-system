<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="网关编号" prop="gwCode">
        <el-input
          v-model="queryParams.gwCode"
          placeholder="请输入网关编号"
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
          v-hasPermi="['gatewayAdmin:vpn:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['gatewayAdmin:vpn:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['gatewayAdmin:vpn:remove']"
        >删除</el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          icon="Download"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['gatewayAdmin:vpn:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="vpnList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="center" prop="id" v-if="false" />
      <el-table-column label="网关编号" align="center" prop="gwCode" />
      <el-table-column label="账号" align="center" prop="vpnAccount" />
      <el-table-column label="密码" align="center" prop="vpnPassword" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['gatewayAdmin:vpn:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['gatewayAdmin:vpn:remove']"
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

    <!-- 添加或修改网关盒子vpn配置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="vpnRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="网关编号" prop="gwCode">
          <el-input v-model="form.gwCode" placeholder="请输入网关编号" />
        </el-form-item>
        <el-form-item label="账号" prop="vpnAccount">
          <el-input v-model="form.vpnAccount" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码" prop="vpnPassword">
          <el-input v-model="form.vpnPassword" placeholder="请输入密码" />
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

<script setup name="Vpn">
import { listVpn, getVpn, delVpn, addVpn, updateVpn } from "@/api/gatewayAdmin/vpn";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const vpnList = ref([]);
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
    gwCode: null,
    vpnAccount: null,
    vpnPassword: null,
  },
  rules: {
    gwCode: [
      { required: true, message: "网关编号不能为空", trigger: "blur" }
    ],
    vpnAccount: [
      { required: true, message: "账号不能为空", trigger: "blur" }
    ],
    vpnPassword: [
      { required: true, message: "密码不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询网关盒子vpn配置列表 */
function getList() {
  loading.value = true;
  listVpn(queryParams.value).then(response => {
    vpnList.value = response.rows;
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
    gwCode: null,
    vpnAccount: null,
    vpnPassword: null,
    createTime: null
  };
  proxy.resetForm("vpnRef");
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
  title.value = "添加网关盒子vpn配置";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getVpn(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改网关盒子vpn配置";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["vpnRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateVpn(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addVpn(form.value).then(response => {
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
    return delVpn(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('gatewayAdmin/vpn/export', {
    ...queryParams.value
  }, `vpn_${new Date().getTime()}.xlsx`)
}

getList();
</script>
