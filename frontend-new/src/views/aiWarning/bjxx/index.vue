<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="租户id" prop="tenid">
        <el-input
          v-model="queryParams.tenid"
          placeholder="请输入租户id"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备ip" prop="sbip">
        <el-input
          v-model="queryParams.sbip"
          placeholder="请输入设备ip"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备通道" prop="sbtd">
        <el-input
          v-model="queryParams.sbtd"
          placeholder="请输入设备通道"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="事件类型" prop="lx">
        <el-input
          v-model="queryParams.lx"
          placeholder="请输入事件类型"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发生时间" prop="fstime">
        <el-date-picker clearable
          v-model="queryParams.fstime"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择发生时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="${comment}" prop="xzhou">
        <el-input
          v-model="queryParams.xzhou"
          placeholder="请输入${comment}"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="${comment}" prop="yzhou">
        <el-input
          v-model="queryParams.yzhou"
          placeholder="请输入${comment}"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="${comment}" prop="width">
        <el-input
          v-model="queryParams.width"
          placeholder="请输入${comment}"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="${comment}" prop="height">
        <el-input
          v-model="queryParams.height"
          placeholder="请输入${comment}"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否处理 0：未处理；1：已处理" prop="ifcl">
        <el-input
          v-model="queryParams.ifcl"
          placeholder="请输入是否处理 0：未处理；1：已处理"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="处理结果" prop="cljg">
        <el-input
          v-model="queryParams.cljg"
          placeholder="请输入处理结果"
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
          v-hasPermi="['aiWarning:bjxx:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['aiWarning:bjxx:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['aiWarning:bjxx:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['aiWarning:bjxx:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bjxxList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="${comment}" align="center" prop="id" />
      <el-table-column label="租户id" align="center" prop="tenid" />
      <el-table-column label="设备ip" align="center" prop="sbip" />
      <el-table-column label="设备通道" align="center" prop="sbtd" />
      <el-table-column label="事件类型" align="center" prop="lx" />
      <el-table-column label="发生时间" align="center" prop="fstime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.fstime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" align="center" prop="tp" />
      <el-table-column label="${comment}" align="center" prop="xzhou" />
      <el-table-column label="${comment}" align="center" prop="yzhou" />
      <el-table-column label="${comment}" align="center" prop="width" />
      <el-table-column label="${comment}" align="center" prop="height" />
      <el-table-column label="是否处理 0：未处理；1：已处理" align="center" prop="ifcl" />
      <el-table-column label="处理结果" align="center" prop="cljg" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['aiWarning:bjxx:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['aiWarning:bjxx:remove']"
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

    <!-- 添加或修改告警信息对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="bjxxRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="租户id" prop="tenid">
          <el-input v-model="form.tenid" placeholder="请输入租户id" />
        </el-form-item>
        <el-form-item label="设备ip" prop="sbip">
          <el-input v-model="form.sbip" placeholder="请输入设备ip" />
        </el-form-item>
        <el-form-item label="设备通道" prop="sbtd">
          <el-input v-model="form.sbtd" placeholder="请输入设备通道" />
        </el-form-item>
        <el-form-item label="事件类型" prop="lx">
          <el-input v-model="form.lx" placeholder="请输入事件类型" />
        </el-form-item>
        <el-form-item label="发生时间" prop="fstime">
          <el-date-picker clearable
            v-model="form.fstime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择发生时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="图片" prop="tp">
          <el-input v-model="form.tp" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="${comment}" prop="xzhou">
          <el-input v-model="form.xzhou" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="yzhou">
          <el-input v-model="form.yzhou" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="width">
          <el-input v-model="form.width" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="${comment}" prop="height">
          <el-input v-model="form.height" placeholder="请输入${comment}" />
        </el-form-item>
        <el-form-item label="是否处理 0：未处理；1：已处理" prop="ifcl">
          <el-input v-model="form.ifcl" placeholder="请输入是否处理 0：未处理；1：已处理" />
        </el-form-item>
        <el-form-item label="处理结果" prop="cljg">
          <el-input v-model="form.cljg" placeholder="请输入处理结果" />
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

<script setup name="Bjxx">
import { listBjxx, getBjxx, delBjxx, addBjxx, updateBjxx } from "@/api/aiWarning/bjxx";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const bjxxList = ref([]);
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
    tenid: null,
    sbip: null,
    sbtd: null,
    lx: null,
    fstime: null,
    tp: null,
    xzhou: null,
    yzhou: null,
    width: null,
    height: null,
    ifcl: null,
    cljg: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询告警信息列表 */
function getList() {
  loading.value = true;
  listBjxx(queryParams.value).then(response => {
    bjxxList.value = response.rows;
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
    tenid: null,
    sbip: null,
    sbtd: null,
    lx: null,
    fstime: null,
    tp: null,
    xzhou: null,
    yzhou: null,
    width: null,
    height: null,
    ifcl: null,
    cljg: null,
    createTime: null,
    updateTime: null
  };
  proxy.resetForm("bjxxRef");
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
  title.value = "添加告警信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getBjxx(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改告警信息";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["bjxxRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateBjxx(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addBjxx(form.value).then(response => {
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
    return delBjxx(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('aiWarning/bjxx/export', {
    ...queryParams.value
  }, `bjxx_${new Date().getTime()}.xlsx`)
}

getList();
</script>
