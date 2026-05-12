<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="作业票id" prop="pId">
        <el-input
          v-model="queryParams.pId"
          placeholder="请输入作业票id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="现场确认部门id" prop="sceneDeptDicId">
        <el-input
          v-model="queryParams.sceneDeptDicId"
          placeholder="请输入现场确认部门id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="确认人id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入确认人id"
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
          v-hasPermi="['safework:earthSceneUser:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:earthSceneUser:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:earthSceneUser:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:earthSceneUser:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="earthSceneUserList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="center" prop="id" />
      <el-table-column label="作业票id" align="center" prop="pId" />
      <el-table-column label="现场确认部门id" align="center" prop="sceneDeptDicId" />
      <el-table-column label="确认人id" align="center" prop="userId" />
      <el-table-column label="其他安全措施" align="center" prop="remark" />
      <el-table-column label="确认人签字" align="center" prop="userSign" />
      <el-table-column label="现场照片" align="center" prop="scenePics" />
      <el-table-column label="编制人签字" align="center" prop="compilerSign" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:earthSceneUser:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:earthSceneUser:remove']"
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

    <!-- 添加或修改动土作业票现场确认部门人员对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="earthSceneUserRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="作业票id" prop="pId">
          <el-input v-model="form.pId" placeholder="请输入作业票id" />
        </el-form-item>
        <el-form-item label="现场确认部门id" prop="sceneDeptDicId">
          <el-input v-model="form.sceneDeptDicId" placeholder="请输入现场确认部门id" />
        </el-form-item>
        <el-form-item label="确认人id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入确认人id" />
        </el-form-item>
        <el-form-item label="其他安全措施" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入其他安全措施" />
        </el-form-item>
        <el-form-item label="确认人签字" prop="userSign">
          <el-input v-model="form.userSign" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="现场照片" prop="scenePics">
          <el-input v-model="form.scenePics" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="编制人签字" prop="compilerSign">
          <el-input v-model="form.compilerSign" type="textarea" placeholder="请输入内容" />
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

<script setup name="EarthSceneUser">
import { listEarthSceneUser, getEarthSceneUser, delEarthSceneUser, addEarthSceneUser, updateEarthSceneUser } from "@/api/safework/earthSceneUser";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const earthSceneUserList = ref([]);
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
    pId: null,
    sceneDeptDicId: null,
    userId: null,
    userSign: null,
    scenePics: null,
    compilerSign: null
  },
  rules: {
    pId: [
      { required: true, message: "作业票id不能为空", trigger: "blur" }
    ],
    sceneDeptDicId: [
      { required: true, message: "现场确认部门id不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询动土作业票现场确认部门人员列表 */
function getList() {
  loading.value = true;
  listEarthSceneUser(queryParams.value).then(response => {
    earthSceneUserList.value = response.rows;
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
    pId: null,
    sceneDeptDicId: null,
    userId: null,
    remark: null,
    userSign: null,
    scenePics: null,
    compilerSign: null
  };
  proxy.resetForm("earthSceneUserRef");
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
  title.value = "添加动土作业票现场确认部门人员";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getEarthSceneUser(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改动土作业票现场确认部门人员";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["earthSceneUserRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateEarthSceneUser(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEarthSceneUser(form.value).then(response => {
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
    return delEarthSceneUser(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/earthSceneUser/export', {
    ...queryParams.value
  }, `earthSceneUser_${new Date().getTime()}.xlsx`)
}

getList();
</script>
