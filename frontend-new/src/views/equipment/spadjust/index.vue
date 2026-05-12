<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="调整数量" prop="spadjustNum">
        <el-input
          v-model="queryParams.spadjustNum"
          placeholder="请输入调整数量"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关联设备" prop="relevanceEqid">
        <el-input
          v-model="queryParams.relevanceEqid"
          placeholder="请输入关联设备"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="备件台账id" prop="spId">
        <el-input
          v-model="queryParams.spId"
          placeholder="请输入备件台账id"
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
          v-hasPermi="['equipment:spadjust:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['equipment:spadjust:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['equipment:spadjust:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['equipment:spadjust:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="spadjustList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="备件库存调整主键id" align="center" prop="equipmentSpadjustId" />
      <el-table-column label="调整类型：1入库，2出库" align="center" prop="spadjustType" />
      <el-table-column label="调整数量" align="center" prop="spadjustNum" />
      <el-table-column label="关联设备" align="center" prop="relevanceEqid" />
      <el-table-column label="备件台账id" align="center" prop="spId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['equipment:spadjust:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['equipment:spadjust:remove']"
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

    <!-- 添加或修改备件调整记录对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="spadjustRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="调整数量" prop="spadjustNum">
          <el-input v-model="form.spadjustNum" placeholder="请输入调整数量" />
        </el-form-item>
        <el-form-item label="关联设备" prop="relevanceEqid">
          <el-input v-model="form.relevanceEqid" placeholder="请输入关联设备" />
        </el-form-item>
        <el-form-item label="备件台账id" prop="spId">
          <el-input v-model="form.spId" placeholder="请输入备件台账id" />
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

<script setup name="Spadjust">
import { listSpadjust, getSpadjust, delSpadjust, addSpadjust, updateSpadjust } from "@/api/equipment/spadjust";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const spadjustList = ref([]);
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
    spadjustType: null,
    spadjustNum: null,
    relevanceEqid: null,
    spId: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询备件调整记录列表 */
function getList() {
  loading.value = true;
  listSpadjust(queryParams.value).then(response => {
    spadjustList.value = response.rows;
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
    equipmentSpadjustId: null,
    spadjustType: null,
    spadjustNum: null,
    relevanceEqid: null,
    spId: null,
    createBy: null,
    createTime: null
  };
  proxy.resetForm("spadjustRef");
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
  ids.value = selection.map(item => item.equipmentSpadjustId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加备件调整记录";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const equipmentSpadjustId = row.equipmentSpadjustId || ids.value
  getSpadjust(equipmentSpadjustId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改备件调整记录";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["spadjustRef"].validate(valid => {
    if (valid) {
      if (form.value.equipmentSpadjustId != null) {
        updateSpadjust(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSpadjust(form.value).then(response => {
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
  const equipmentSpadjustIds = row.equipmentSpadjustId || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delSpadjust(equipmentSpadjustIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('equipment/spadjust/export', {
    ...queryParams.value
  }, `spadjust_${new Date().getTime()}.xlsx`)
}

getList();
</script>
