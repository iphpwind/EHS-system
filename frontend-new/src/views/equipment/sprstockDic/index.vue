<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="类型名称" prop="sprstockName">
        <el-input
          v-model="queryParams.sprstockName"
          placeholder="请输入入库类型名称"
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
          v-hasPermi="['equipment:sprstockDic:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['equipment:sprstockDic:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['equipment:sprstockDic:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['equipment:sprstockDic:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 340px)" v-loading="loading" :data="sprstockDicList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="入库类型字典id" align="center" prop="sprstockDictId" />
      <el-table-column label="入库类型名称" align="center" prop="sprstockName" />
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
            v-hasPermi="['equipment:sprstockDic:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['equipment:sprstockDic:remove']"
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

    <!-- 添加或修改备件库存调整入库类型字典对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="sprstockDicRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="类型名称" prop="sprstockName">
          <el-input v-model="form.sprstockName" placeholder="请输入备件库存调整入库类型名称" />
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

<script setup name="SprstockDic">
import { listSprstockDic, getSprstockDic, delSprstockDic, addSprstockDic, updateSprstockDic } from "@/api/equipment/sprstockDic";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const sprstockDicList = ref([]);
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
    sprstockName: null,
    status: null,
    delFlag:0,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询备件库存调整入库类型字典列表 */
function getList() {
  loading.value = true;
  listSprstockDic(queryParams.value).then(response => {
    sprstockDicList.value = response.rows;
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
    sprstockDictId: null,
    sprstockName: null,
    status: "0",
  };
  proxy.resetForm("sprstockDicRef");
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
  ids.value = selection.map(item => item.sprstockDictId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加入库类型字典";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const sprstockDictId = row.sprstockDictId || ids.value
  getSprstockDic(sprstockDictId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改入库类型字典";
  });
}

/** 提交按钮 */
function submitForm() {
  form.value.delFlag = '0'
  proxy.$refs["sprstockDicRef"].validate(valid => {
    if (valid) {
      if (form.value.sprstockDictId != null) {
        updateSprstockDic(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSprstockDic(form.value).then(response => {
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
  const sprstockDictIds = row.sprstockDictId || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delSprstockDic(sprstockDictIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('equipment/sprstockDic/export', {
    ...queryParams.value
  }, `sprstockDic_${new Date().getTime()}.xlsx`)
}

getList();
</script>
