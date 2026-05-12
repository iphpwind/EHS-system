<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属机构" prop="deptId">
        <el-input
          v-model="queryParams.deptId"
          placeholder="请输入所属机构"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="所属分类id" prop="classificationId">
        <el-input
          v-model="queryParams.classificationId"
          placeholder="请输入所属分类id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="试卷id" prop="testPaperId">
        <el-input
          v-model="queryParams.testPaperId"
          placeholder="请输入试卷id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="题目id" prop="questionId">
        <el-input
          v-model="queryParams.questionId"
          placeholder="请输入题目id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分数" prop="fraction">
        <el-input
          v-model="queryParams.fraction"
          placeholder="请输入分数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="序号" prop="sort">
        <el-input
          v-model="queryParams.sort"
          placeholder="请输入序号"
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
          v-hasPermi="['safework:paper_question_selection:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:paper_question_selection:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:paper_question_selection:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:paper_question_selection:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="paper_question_selectionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="center" prop="id" />
      <el-table-column label="所属机构" align="center" prop="deptId" />
      <el-table-column label="所属分类id" align="center" prop="classificationId" />
      <el-table-column label="试卷id" align="center" prop="testPaperId" />
      <el-table-column label="题目id" align="center" prop="questionId" />
      <el-table-column label="分数" align="center" prop="fraction" />
      <el-table-column label="序号" align="center" prop="sort" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:paper_question_selection:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:paper_question_selection:remove']"
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

    <!-- 添加或修改线上教育-试卷题目对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="paper_question_selectionRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属机构" prop="deptId">
          <el-input v-model="form.deptId" placeholder="请输入所属机构" />
        </el-form-item>
        <el-form-item label="所属分类id" prop="classificationId">
          <el-input v-model="form.classificationId" placeholder="请输入所属分类id" />
        </el-form-item>
        <el-form-item label="试卷id" prop="testPaperId">
          <el-input v-model="form.testPaperId" placeholder="请输入试卷id" />
        </el-form-item>
        <el-form-item label="题目id" prop="questionId">
          <el-input v-model="form.questionId" placeholder="请输入题目id" />
        </el-form-item>
        <el-form-item label="分数" prop="fraction">
          <el-input v-model="form.fraction" placeholder="请输入分数" />
        </el-form-item>
        <el-form-item label="序号" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入序号" />
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

<script setup name="Paper_question_selection">
import { listPaper_question_selection, getPaper_question_selection, delPaper_question_selection, addPaper_question_selection, updatePaper_question_selection } from "@/api/safework/paper_question_selection";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const paper_question_selectionList = ref([]);
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
    deptId: null,
    classificationId: null,
    testPaperId: null,
    questionId: null,
    fraction: null,
    sort: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询线上教育-试卷题目列表 */
function getList() {
  loading.value = true;
  listPaper_question_selection(queryParams.value).then(response => {
    paper_question_selectionList.value = response.rows;
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
    classificationId: null,
    testPaperId: null,
    questionId: null,
    fraction: null,
    sort: null
  };
  proxy.resetForm("paper_question_selectionRef");
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
  title.value = "添加线上教育-试卷题目";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getPaper_question_selection(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改线上教育-试卷题目";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["paper_question_selectionRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updatePaper_question_selection(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPaper_question_selection(form.value).then(response => {
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
    return delPaper_question_selection(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/paper_question_selection/export', {
    ...queryParams.value
  }, `paper_question_selection_${new Date().getTime()}.xlsx`)
}

getList();
</script>
