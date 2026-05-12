<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="单位名称" prop="spunitName">
        <el-input
          v-model="queryParams.spunitName"
          placeholder="请输入单位名称"
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
          v-hasPermi="['equipment:spunitDic:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['equipment:spunitDic:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['equipment:spunitDic:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['equipment:spunitDic:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 340px)" v-loading="loading" :data="spunitDicList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="备件单位字典id" align="center" prop="spunitDictId" />
      <el-table-column label="备件单位名称" align="center" prop="spunitName" />
      <el-table-column label="状态" align="center" prop="status" >
        <template #default="scope">
          <el-row justify="center" v-if="scope.row.status == 0"><el-tag>正常</el-tag></el-row>
          <el-row justify="center" v-if="scope.row.status == 1"><el-tag type="danger">停用</el-tag></el-row>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['equipment:spunitDic:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['equipment:spunitDic:remove']"
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

    <!-- 添加或修改备件单位字典对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="spunitDicRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="单位名称" prop="spunitName">
          <el-input v-model="form.spunitName" placeholder="请输入备件单位名称" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="0">有效</el-radio>
            <el-radio label="1">无效</el-radio>
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

<script setup name="SpunitDic">
import { listSpunitDic, getSpunitDic, delSpunitDic, addSpunitDic, updateSpunitDic } from "@/api/equipment/spunitDic";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const spunitDicList = ref([]);
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
    spunitName: null,
    status: null,
    delFlag:0,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询备件单位字典列表 */
function getList() {
  loading.value = true;
  listSpunitDic(queryParams.value).then(response => {
    spunitDicList.value = response.rows;
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
    spunitDictId: null,
    spunitName: null,
    status: "0",
    delFlag: null,
  };
  proxy.resetForm("spunitDicRef");
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
  ids.value = selection.map(item => item.spunitDictId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加备件单位字典";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const spunitDictId = row.spunitDictId || ids.value
  getSpunitDic(spunitDictId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改备件单位字典";
  });
}

/** 提交按钮 */
function submitForm() {
  form.value.delFlag = '0'
  proxy.$refs["spunitDicRef"].validate(valid => {
    if (valid) {
      if (form.value.spunitDictId != null) {
        updateSpunitDic(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSpunitDic(form.value).then(response => {
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
  const spunitDictIds = row.spunitDictId || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delSpunitDic(spunitDictIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('equipment/spunitDic/export', {
    ...queryParams.value
  }, `spunitDic_${new Date().getTime()}.xlsx`)
}

getList();
</script>
