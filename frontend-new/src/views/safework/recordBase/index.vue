<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="带班日期" prop="shiftDate">
        <el-date-picker clearable
          v-model="queryParams.shiftDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择带班日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="带班段" prop="shiftSegment">
        <el-input
          v-model="queryParams.shiftSegment"
          placeholder="请输入带班段"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="带班人职务" prop="staffPosition">
        <el-input
          v-model="queryParams.staffPosition"
          placeholder="请输入带班人职务"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="带班人姓名" prop="staffName">
        <el-input
          v-model="queryParams.staffName"
          placeholder="请输入带班人姓名"
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
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:recordBase:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="recordBaseList" @selection-change="handleSelectionChange">
<!--      <el-table-column label="记录ID" align="center" prop="id" />
      <el-table-column label="企业代码" align="center" prop="enterpriseCode" />-->
      <el-table-column label="带班日期" align="center" prop="shiftDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.shiftDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="带班段" align="center" prop="shiftSegment" />
<!--      <el-table-column label="带班段ID" align="center" prop="shiftSegmentId" />-->
      <el-table-column label="带班人职务" align="center" prop="staffPosition" />
<!--      <el-table-column label="带班人职务ID" align="center" prop="staffPositionId" />-->
      <el-table-column label="带班人姓名" align="center" prop="staffName" />
<!--      <el-table-column label="带班人姓名ID" align="center" prop="staffNameId" />-->
      <el-table-column label="带班状态" align="center" prop="shiftStatus" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <el-row justify="center" v-if="scope.row.status == 0">未执行</el-row>
          <el-row justify="center" v-else>已执行</el-row>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:recordBase:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:recordBase:remove']"
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

    <!-- 添加或修改带班记录对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="recordBaseRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="企业代码" prop="enterpriseCode">
          <el-input v-model="form.enterpriseCode" placeholder="请输入企业代码" />
        </el-form-item>
        <el-form-item label="带班日期" prop="shiftDate">
          <el-date-picker clearable
            v-model="form.shiftDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择带班日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="带班段" prop="shiftSegment">
          <el-input v-model="form.shiftSegment" placeholder="请输入带班段" />
        </el-form-item>
        <el-form-item label="带班段ID" prop="shiftSegmentId">
          <el-input v-model="form.shiftSegmentId" placeholder="请输入带班段ID" />
        </el-form-item>
        <el-form-item label="带班人职务" prop="staffPosition">
          <el-input v-model="form.staffPosition" placeholder="请输入带班人职务" />
        </el-form-item>
        <el-form-item label="带班人职务ID" prop="staffPositionId">
          <el-input v-model="form.staffPositionId" placeholder="请输入带班人职务ID" />
        </el-form-item>
        <el-form-item label="带班人姓名" prop="staffName">
          <el-input v-model="form.staffName" placeholder="请输入带班人姓名" />
        </el-form-item>
        <el-form-item label="带班人姓名ID" prop="staffNameId">
          <el-input v-model="form.staffNameId" placeholder="请输入带班人姓名ID" />
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

<script setup name="RecordBase">
import { listRecordBase, getRecordBase, delRecordBase, addRecordBase, updateRecordBase } from "@/api/safework/recordBase";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const recordBaseList = ref([]);
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
    enterpriseCode: null,
    shiftDate: null,
    shiftSegment: null,
    shiftSegmentId: null,
    staffPosition: null,
    staffPositionId: null,
    staffName: null,
    staffNameId: null,
    shiftStatus: null,
    status: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询带班记录列表 */
function getList() {
  loading.value = true;
  listRecordBase(queryParams.value).then(response => {
    recordBaseList.value = response.rows;
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
    shiftDate: null,
    shiftSegment: null,
    shiftSegmentId: null,
    staffPosition: null,
    staffPositionId: null,
    staffName: null,
    staffNameId: null,
    shiftStatus: "0",
    status: 0,
    createTime: null,
    createBy: null,
    updateTime: null,
    updateBy: null
  };
  proxy.resetForm("recordBaseRef");
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
  title.value = "添加带班记录";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getRecordBase(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改带班记录";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["recordBaseRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateRecordBase(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addRecordBase(form.value).then(response => {
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
    return delRecordBase(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/recordBase/export', {
    ...queryParams.value
  }, `recordBase_${new Date().getTime()}.xlsx`)
}

getList();
</script>
