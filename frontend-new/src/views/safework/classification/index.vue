<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="编号" prop="num">
        <el-input
            v-model="queryParams.num"
            placeholder="请输入编号"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="名称" prop="classificationName">
        <el-input
            v-model="queryParams.classificationName"
            placeholder="请输入名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="queryParams.state" clearable
                   @keyup.enter="handleQuery"
                   placeholder="请输入状态">
          <el-option
              v-for="item in stateList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
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
            v-hasPermi="['safework:classification:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['safework:classification:edit']"
        >修改
        </el-button>
      </el-col>
<!--      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['safework:classification:remove']"
        >删除
        </el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['safework:classification:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="classificationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="${comment}" align="center" prop="id" v-if="false"/>
      <el-table-column label="编号" align="center" prop="num"/>
      <el-table-column label="所属部门" align="center" prop="deptId" v-if="false"/>
      <el-table-column label="名称" align="center" prop="classificationName"/>
      <el-table-column label="状态" align="center" prop="state" :formatter="stateFormatter"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['safework:classification:edit']"
          >修改
          </el-button>
<!--          <el-button
              type="text"
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['safework:classification:remove']"
          >删除
          </el-button>-->
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

    <!-- 添加或修改线上教育-所属分类字典对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="classificationRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="编号" prop="num">
          <el-input v-model="form.num" placeholder="请输入编号"/>
        </el-form-item>
        <el-form-item label="名称" prop="classificationName">
          <el-input v-model="form.classificationName" placeholder="请输入名称"/>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="form.state" placeholder="请选择状态">
            <el-option
                v-for="item in stateList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
          </el-select>
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

<script setup name="Classification">
import {
  listClassification,
  getClassification,
  delClassification,
  addClassification,
  updateClassification
} from "@/api/safework/classification";
import {h} from "vue";

const {proxy} = getCurrentInstance();

const classificationList = ref([]);
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
    num: null,
    deptId: null,
    classificationName: null,
    state: null
  },
  rules: {},
  stateList: [
    {
      label: '正常',
      value: 0
    }, {
      label: '停用',
      value: 1
    }
  ]
});

const {queryParams, form, rules, stateList} = toRefs(data);

/** 查询线上教育-所属分类字典列表 */
function getList() {
  loading.value = true;
  listClassification(queryParams.value).then(response => {
    classificationList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function stateFormatter(e) {
  if (e.state == 0) {
    return '正常'
  } else {
    return '停用'
  }
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
    num: null,
    deptId: null,
    classificationName: null,
    state: null
  };
  proxy.resetForm("classificationRef");
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
  title.value = "添加线上教育-所属分类字典";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getClassification(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改线上教育-所属分类字典";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["classificationRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateClassification(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addClassification(form.value).then(response => {
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
    return delClassification(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/classification/export', {
    ...queryParams.value
  }, `classification_${new Date().getTime()}.xlsx`)
}

getList();
</script>
