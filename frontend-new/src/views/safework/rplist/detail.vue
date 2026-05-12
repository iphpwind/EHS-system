<template>
  <div class="app-container">
<!--    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">-->
<!--      <el-form-item label="用户" prop="userId">-->
<!--        <el-input-->
<!--          v-model="queryParams.userId"-->
<!--          placeholder="请输入用户"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="来源编码" prop="originNum">-->
<!--        <el-input-->
<!--          v-model="queryParams.originNum"-->
<!--          placeholder="请输入来源编码"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="风险对象" prop="objectId">-->
<!--        <el-input-->
<!--          v-model="queryParams.objectId"-->
<!--          placeholder="请输入风险对象"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="风险单元" prop="unitId">-->
<!--        <el-input-->
<!--          v-model="queryParams.unitId"-->
<!--          placeholder="请输入风险单元"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="发生时间" prop="time">-->
<!--        <el-date-picker clearable-->
<!--          v-model="queryParams.time"-->
<!--          type="date"-->
<!--          value-format="YYYY-MM-DD"-->
<!--          placeholder="请选择发生时间">-->
<!--        </el-date-picker>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="分数" prop="num">-->
<!--        <el-input-->
<!--          v-model="queryParams.num"-->
<!--          placeholder="请输入分数"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>-->
<!--        <el-button icon="Refresh" @click="resetQuery">重置</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->

<!--    <el-row :gutter="10" class="mb8">-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          icon="Plus"-->
<!--          @click="handleAdd"-->
<!--          v-hasPermi="['safework:rplist:add']"-->
<!--        >新增</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="success"-->
<!--          plain-->
<!--          icon="Edit"-->
<!--          :disabled="single"-->
<!--          @click="handleUpdate"-->
<!--          v-hasPermi="['safework:rplist:edit']"-->
<!--        >修改</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          plain-->
<!--          icon="Delete"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--          v-hasPermi="['safework:rplist:remove']"-->
<!--        >删除</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          icon="Download"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['safework:rplist:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
<!--      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>-->
<!--    </el-row>-->

    <el-table v-loading="loading" :data="rplistList" @selection-change="handleSelectionChange">
      <el-table-column label="奖惩原由" align="center" prop="rpcontent" />
      <el-table-column label="业务来源编码" align="center" prop="originNum" />
      <el-table-column label="风险对象" align="center" prop="objectName" />
      <el-table-column label="风险单元" align="center" prop="unitName" />
      <el-table-column label="上报/排查时间" align="center" prop="time" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.time, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="奖励/惩罚积分数" align="center" prop="num" />
<!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
<!--        <template #default="scope">-->
<!--          <el-button-->
<!--            type="text"-->
<!--            icon="Edit"-->
<!--            @click="handleUpdate(scope.row)"-->
<!--            v-hasPermi="['safework:rplist:edit']"-->
<!--          >修改</el-button>-->
<!--          <el-button-->
<!--            type="text"-->
<!--            icon="Delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--            v-hasPermi="['safework:rplist:remove']"-->
<!--          >删除</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改奖惩列对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="rplistRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户" />
        </el-form-item>
        <el-form-item label="奖惩内容">
          <editor v-model="form.rpcontent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="来源编码" prop="originNum">
          <el-input v-model="form.originNum" placeholder="请输入来源编码" />
        </el-form-item>
        <el-form-item label="风险对象" prop="objectId">
          <el-input v-model="form.objectId" placeholder="请输入风险对象" />
        </el-form-item>
        <el-form-item label="风险单元" prop="unitId">
          <el-input v-model="form.unitId" placeholder="请输入风险单元" />
        </el-form-item>
        <el-form-item label="发生时间" prop="time">
          <el-date-picker clearable
            v-model="form.time"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择发生时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="分数" prop="num">
          <el-input v-model="form.num" placeholder="请输入分数" />
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

<script setup name="rpdetail">
import { listRplist, getRplist, delRplist, addRplist, updateRplist } from "@/api/safework/rplist";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const rplistList = ref([]);
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
    userId: proxy.$route.query.userId,
    time: proxy.$route.query.year +'-'+proxy.$route.query.type+'-01'
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询奖惩列列表 */
function getList() {
  loading.value = true;
  listRplist(queryParams.value).then(response => {
    rplistList.value = response.rows;
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
    userId: null,
    rpcontent: null,
    originNum: null,
    objectId: null,
    unitId: null,
    time: null,
    num: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("rplistRef");
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
  title.value = "添加奖惩列";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getRplist(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改奖惩列";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["rplistRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateRplist(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addRplist(form.value).then(response => {
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
    return delRplist(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/rplist/export', {
    ...queryParams.value
  }, `rplist_${new Date().getTime()}.xlsx`)
}

getList();
</script>
