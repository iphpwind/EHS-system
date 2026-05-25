<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
<!--      <el-form-item label="企业编码" prop="enterpriseCode">-->
<!--        <el-input-->
<!--          v-model="queryParams.enterpriseCode"-->
<!--          placeholder="请输入企业编码"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="证件号" prop="credentialNum">
        <el-input
          v-model="queryParams.credentialNum"
          placeholder="请输入证件号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公司名称" prop="company">
        <el-input
          v-model="queryParams.company"
          placeholder="请输入公司名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="车牌号码" prop="carNum">
        <el-input
          v-model="queryParams.carNum"
          placeholder="请输入车牌号码"
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
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          icon="Plus"-->
<!--          @click="handleAdd"-->
<!--          v-hasPermi="['safework:visitor:add']"-->
<!--        >新增</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          icon="Edit"-->
<!--          :disabled="single"-->
<!--          @click="handleUpdate"-->
<!--          v-hasPermi="['safework:visitor:edit']"-->
<!--        >修改</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          plain-->
<!--          icon="Delete"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--          v-hasPermi="['safework:visitor:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
      <el-col v-if="userStore.user.dept.parentId == 157 || userStore.user.dept.parentId == 2509 || userStore.user.dept.parentId == 110" :span="1.5">
        <el-button
          plain
          @click="getqrcode"
        >公众号二维码</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="visitorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="${comment}" align="center" prop="id" />-->
<!--      <el-table-column label="企业编码" align="center" prop="enterpriseCode" />-->
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="手机号" align="center" prop="phone" />
      <el-table-column label="性别" align="center" prop="sex" />
      <el-table-column label="证件类型" align="center" prop="credentialType" />
      <el-table-column label="证件号" align="center" prop="credentialNum" />
      <el-table-column label="公司名称" align="center" prop="company" />
      <el-table-column label="车牌号码" align="center" prop="carNum" />
<!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
<!--        <template #default="scope">-->
<!--          <el-button-->
<!--            type="text"-->
<!--            icon="Edit"-->
<!--            @click="handleUpdate(scope.row)"-->
<!--            v-hasPermi="['safework:visitor:edit']"-->
<!--          >修改</el-button>-->
<!--          <el-button-->
<!--            type="text"-->
<!--            icon="Delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--            v-hasPermi="['safework:visitor:remove']"-->
<!--          >删除</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改访客信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="visitorRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="企业编码" prop="enterpriseCode">
          <el-input v-model="form.enterpriseCode" placeholder="请输入企业编码" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="证件号" prop="credentialNum">
          <el-input v-model="form.credentialNum" placeholder="请输入证件号" />
        </el-form-item>
        <el-form-item label="公司名称" prop="company">
          <el-input v-model="form.company" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="车牌号码" prop="carNum">
          <el-input v-model="form.carNum" placeholder="请输入车牌号码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="公众号二维码" v-model="wxopen" width="500px" append-to-body>
      <el-image :src="wximg"></el-image>
    </el-dialog>

  </div>
</template>

<script setup name="Visitor">
import { listVisitor, getVisitor, delVisitor, addVisitor, updateVisitor } from "@/api/safework/visitor";
import {getQrcode} from "@/api/safework/visitReservation"
import {updateDept} from "@/api/system/dept"
const { proxy } = getCurrentInstance();
const userStore = useUserStore()
const visitorList = ref([]);
const open = ref(false);
const wxopen = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const wximg = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    enterpriseCode: null,
    name: null,
    phone: null,
    sex: null,
    credentialType: null,
    credentialNum: null,
    company: null,
    carNum: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);


function getqrcode() {
  let img = userStore.user.dept.visitorImg;
console.log(userStore.user.dept)
  if (img != null && img != ''){
    wxopen.value = true;
    wximg.value = img;
  }else {
    getQrcode().then(res => {
      wxopen.value = true;
      wximg.value = res

      let dept = {
        parentId : userStore.user.dept.parentId,
        deptId : userStore.user.dept.deptId,
        orderNum : userStore.user.dept.orderNum,
        deptName : userStore.user.dept.deptName,
        visitorImg : res
      }

      updateDept(dept).then(res => {

      })

    })
  }
}

/** 查询访客信息列表 */
function getList() {
  loading.value = true;
  queryParams.value.enterpriseCode = userStore.user.dept.thirdDeptId == null ? userStore.user.dept.deptId : userStore.user.dept.thirdDeptId
  listVisitor(queryParams.value).then(response => {
    visitorList.value = response.rows;
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
    name: null,
    phone: null,
    sex: null,
    credentialType: null,
    credentialNum: null,
    company: null,
    carNum: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("visitorRef");
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
  title.value = "添加访客信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getVisitor(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改访客信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["visitorRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateVisitor(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addVisitor(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除访客信息编号为"' + idss + '"的数据项？').then(function() {
    return delVisitor(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/visitor/export', {
    ...queryParams.value
  }, `visitor_${new Date().getTime()}.xlsx`)
}

getList();
</script>
