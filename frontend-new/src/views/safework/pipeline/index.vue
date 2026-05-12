<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设备管道名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入设备管道名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="介质" prop="medium">
        <el-input
          v-model="queryParams.medium"
          placeholder="请输入介质"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="温度" prop="temperature">
        <el-input
          v-model="queryParams.temperature"
          placeholder="请输入温度"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="压力" prop="mpa">
        <el-input
          v-model="queryParams.mpa"
          placeholder="请输入压力"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="模板材质" prop="material">
        <el-input
          v-model="queryParams.material"
          placeholder="请输入模板材质"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="规格" prop="spe">
        <el-input
          v-model="queryParams.spe"
          placeholder="请输入规格"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="盲板编号" prop="num">
        <el-input
          v-model="queryParams.num"
          placeholder="请输入盲板编号"
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
          v-hasPermi="['safework:pipeline:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:pipeline:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:pipeline:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:pipeline:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="pipelineList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="center" prop="id" />
      <el-table-column label="设备管道名称" align="center" prop="name" />
      <el-table-column label="介质" align="center" prop="medium" />
      <el-table-column label="温度" align="center" prop="temperature" />
      <el-table-column label="压力" align="center" prop="mpa" />
      <el-table-column label="模板材质" align="center" prop="material" />
      <el-table-column label="规格" align="center" prop="spe" />
      <el-table-column label="盲板编号" align="center" prop="num" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:pipeline:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:pipeline:remove']"
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

    <!-- 添加或修改设备管道对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="pipelineRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备管道名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入设备管道名称" />
        </el-form-item>
        <el-form-item label="介质" prop="medium">
          <el-input v-model="form.medium" placeholder="请输入介质" />
        </el-form-item>
        <el-form-item label="温度" prop="temperature">
          <el-input v-model="form.temperature" placeholder="请输入温度" />
        </el-form-item>
        <el-form-item label="压力" prop="mpa">
          <el-input v-model="form.mpa" placeholder="请输入压力" />
        </el-form-item>
        <el-form-item label="模板材质" prop="material">
          <el-input v-model="form.material" placeholder="请输入模板材质" />
        </el-form-item>
        <el-form-item label="规格" prop="spe">
          <el-input v-model="form.spe" placeholder="请输入规格" />
        </el-form-item>
        <el-form-item label="盲板编号" prop="num">
          <el-input v-model="form.num" placeholder="请输入盲板编号" />
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

<script setup name="Pipeline">
import { listPipeline, getPipeline, delPipeline, addPipeline, updatePipeline } from "@/api/safework/pipeline";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const pipelineList = ref([]);
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
    name: null,
    medium: null,
    temperature: null,
    mpa: null,
    material: null,
    spe: null,
    num: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询设备管道列表 */
function getList() {
  loading.value = true;
  listPipeline(queryParams.value).then(response => {
    pipelineList.value = response.rows;
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
    name: null,
    medium: null,
    temperature: null,
    mpa: null,
    material: null,
    spe: null,
    num: null
  };
  proxy.resetForm("pipelineRef");
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
  title.value = "添加设备管道";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getPipeline(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改设备管道";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["pipelineRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updatePipeline(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPipeline(form.value).then(response => {
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
    return delPipeline(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/pipeline/export', {
    ...queryParams.value
  }, `pipeline_${new Date().getTime()}.xlsx`)
}

getList();
</script>
