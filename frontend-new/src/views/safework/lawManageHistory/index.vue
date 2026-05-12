<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="法律法规" prop="lawId">
        <el-select v-model="queryParams.lawId" placeholder="请选择法律法规" clearable>
          <el-option
            v-for="dict in lawManageList"
            :key="dict.id"
            :label="dict.lawName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="修改人员工号" prop="staffNo" label-width="106px">
        <el-input
          v-model="queryParams.staffNo"
          placeholder="请输入修改人员工号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['safework:lawManageHistory:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:lawManageHistory:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:lawManageHistory:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:lawManageHistory:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->

    <el-table v-loading="loading" :data="lawManageHistoryList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" v-if="false"/>
      <el-table-column label="法律法规" align="center" prop="lawName" />
      <el-table-column label="修改人" align="center" prop="updateBy" />
      <el-table-column label="修改人员工号" align="center" prop="staffNo" />
      <el-table-column label="修改时间" align="center" prop="updateTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:lawManageHistory:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:lawManageHistory:remove']"
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

    <!-- 添加或修改法律法规管理修改历史对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="lawManageHistoryRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="法律法规id" prop="lawId">
          <el-input v-model="form.lawId" placeholder="请输入法律法规id" />
        </el-form-item>
        <el-form-item label="修改人员工号" prop="staffNo">
          <el-input v-model="form.staffNo" placeholder="请输入修改人员工号" />
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

<script setup name="LawManageHistory">
import { listLawManageHistory, getLawManageHistory, delLawManageHistory, addLawManageHistory, updateLawManageHistory } from "@/api/safework/lawManageHistory";
import { listLawManage } from "@/api/safework/lawManage";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const lawManageHistoryList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const lawManageList = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    lawId: null,
    staffNo: null
  },
  rules: {
    lawId: [
      { required: true, message: "法律法规id不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询法律法规管理修改历史列表 */
function getList() {
  loading.value = true;
  listLawManageHistory(queryParams.value).then(response => {
    lawManageHistoryList.value = response.rows;
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
    lawId: null,
    updateTime: null,
    updateBy: null,
    staffNo: null
  };
  proxy.resetForm("lawManageHistoryRef");
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
  title.value = "添加法律法规管理修改历史";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getLawManageHistory(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改法律法规管理修改历史";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["lawManageHistoryRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateLawManageHistory(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addLawManageHistory(form.value).then(response => {
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
    return delLawManageHistory(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/lawManageHistory/export', {
    ...queryParams.value
  }, `lawManageHistory_${new Date().getTime()}.xlsx`)
}

function getLawManageList() {
	listLawManage({delFlag:"0", status:"0"}).then(response => {
    lawManageList.value = response.rows;
  });
}

getLawManageList();
getList();
</script>
