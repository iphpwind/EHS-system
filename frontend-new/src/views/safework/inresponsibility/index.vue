<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="对象名称" prop="objectId">
        <el-select v-model="queryParams.objectId" clearable filterable placeholder="全部">
          <el-option
              v-for="item in obOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          ></el-option>
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
          v-hasPermi="['safework:inresponsibility:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="inresponsibilityList" @selection-change="handleSelectionChange">
      <el-table-column label="对象编号" align="center" prop="objectNo" />
      <el-table-column label="对象名称" align="center" prop="objectName" />
      <el-table-column label="主要负责人" align="center" prop="mainChargeName" />
      <el-table-column label="技术负责人" align="center" prop="technologyName" />
      <el-table-column label="操作负责人" align="center" prop="operateName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:inresponsibility:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:inresponsibility:remove']"
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

    <!-- 添加或修改包保责任制对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="inresponsibilityRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="分析对象" prop="objectId">
<!--          <el-input v-model="form.objectId" placeholder="请输入分析对象" />-->
          <el-select v-model="form.objectId" clearable filterable placeholder="全部">
            <el-option
                v-for="item in obOptions1"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主要负责人" prop="mainChargeUser">
<!--          <el-input v-model="form.mainChargeUser" placeholder="请输入主要负责人" />-->
          <el-select v-model="form.mainChargeUser" clearable filterable placeholder="请输入主要负责人">
            <el-option
                v-for="item in personcolumns"
                :key="item.staffId"
                :label="item.staffDeptName"
                :value="item.staffId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="技术负责人" prop="technologyUser">
<!--          <el-input v-model="form.technologyUser" placeholder="请输入技术负责人" />-->
          <el-select v-model="form.technologyUser" clearable filterable placeholder="请输入技术负责人">
            <el-option
                v-for="item in personcolumns"
                :key="item.staffId"
                :label="item.staffDeptName"
                :value="item.staffId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作负责人" prop="operateUser">
<!--          <el-input v-model="form.operateUser" placeholder="请输入操作负责人" />-->
          <el-select v-model="form.operateUser" clearable filterable placeholder="请输入操作负责人">
            <el-option
                v-for="item in personcolumns"
                :key="item.staffId"
                :label="item.staffDeptName"
                :value="item.staffId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="delFlag">
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

<script setup name="Inresponsibility">
import { listInresponsibility, getInresponsibility, delInresponsibility, addInresponsibility, updateInresponsibility } from "@/api/safework/inresponsibility";
import { listObject,listObjectByInfo} from "@/api/safework/object";
import { listStaff } from "@/api/system/staff";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const inresponsibilityList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const obOptions = ref([]);
const obOptions1 = ref([]);
const personcolumns = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    enterpriseCode: null,
    objectId: null,
    mainChargeUser: null,
    technologyUser: null,
    operateUser: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/* 查询风险分析对象 */
function getObject() {
  listObject({delFlag:0}).then(res => {
    obOptions.value = res.rows;
  })
}

function getObject1() {
  listObjectByInfo({delFlag:0}).then(res => {
    obOptions1.value = res.rows;
  })
}

/** 查询包保责任制列表 */
function getList() {
  loading.value = true;
  listInresponsibility(queryParams.value).then(response => {
    inresponsibilityList.value = response.rows;
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
    objectId: null,
    mainChargeUser: null,
    technologyUser: null,
    operateUser: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("inresponsibilityRef");
}

/* 查询人员 */
function getUser(){
  listStaff({delFlag:'0'}).then(response => {
    personcolumns.value = response.rows;//list数据
  });
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
  getObject1();
  form.value.delFlag = '0';
  open.value = true;
  title.value = "添加包保责任制";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getInresponsibility(id).then(response => {
    listObjectByInfo({delFlag:0,objectId:response.data.objectId}).then(res => {
      obOptions1.value = res.rows;
      response.data.mainChargeUser = parseInt(response.data.mainChargeUser)
      response.data.technologyUser = parseInt(response.data.technologyUser)
      response.data.operateUser = parseInt(response.data.operateUser)
      form.value = response.data;
      open.value = true;
      title.value = "修改包保责任制";
    })
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["inresponsibilityRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateInresponsibility(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addInresponsibility(form.value).then(response => {
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
    return delInresponsibility(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/inresponsibility/export', {
    ...queryParams.value
  }, `inresponsibility_${new Date().getTime()}.xlsx`)
}

getList();
getObject();
getUser();
</script>
