<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="协议名称" prop="protocolName">
        <el-input
          v-model="queryParams.protocolName"
          placeholder="请输入协议名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="协议名称" prop="protocolAbbr">
        <el-input
          v-model="queryParams.protocolAbbr"
          placeholder="请输入协议名称简写"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="协议规范" prop="protocolRule">
        <el-input
          v-model="queryParams.protocolRule"
          placeholder="请输入协议规范"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8 toolsline">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['sensor:protocol:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['sensor:protocol:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['sensor:protocol:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['sensor:protocol:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 300px)" v-loading="loading" :data="protocolList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="协议编号" align="center" prop="protocolId" />
      <el-table-column label="协议名称" align="center" prop="protocolName" />
      <el-table-column label="协议名称简写" align="center" prop="protocolAbbr" />
      <el-table-column label="协议规范" align="center" prop="protocolRule" />
      <el-table-column label="协议类型" align="center" prop="protocolType" >
				<template #default="scope">
					<dict-tag :options="protocol_type" :value="scope.row.protocolType"/>
				</template>
			</el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['sensor:protocol:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sensor:protocol:remove']"
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

    <!-- 添加或修改通讯协议对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="protocolRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="协议名称" prop="protocolName">
          <el-input v-model="form.protocolName" placeholder="请输入协议名称" />
        </el-form-item>
        <el-form-item label="协议名称简写" prop="protocolAbbr">
          <el-input v-model="form.protocolAbbr" placeholder="请输入协议名称简写" />
        </el-form-item>
        <el-form-item label="协议规范" prop="protocolRule">
          <el-input v-model="form.protocolRule" placeholder="请输入协议规范" />
        </el-form-item>
         <el-form-item label="协议类型" prop="protocolType">
          <el-select v-model="form.protocolType" placeholder="请选择协议类型">
            <el-option
              v-for="dict in protocol_type"
              :key="dict.value"
              :label="dict.label"
:value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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

<script setup name="Protocol">
import { listProtocol, getProtocol, delProtocol, addProtocol, updateProtocol } from "@/api/sensor/protocol";
import {h} from "vue";

const { proxy } = getCurrentInstance();
const { protocol_type } = proxy.useDict('protocol_type');

const protocolList = ref([]);
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
    protocolName: null,
    protocolAbbr: null,
    protocolRule: null,
    protocolType: null,
  },
  rules: {
    updateBy: [
      { required: true, message: "更新者不能为空", trigger: "blur" }
    ],
    protocolName: [
      { required: true, message: "协议名称不能为空", trigger: "blur" }
    ],
    protocolAbbr: [
      { required: true, message: "协议名称简写不能为空", trigger: "blur" }
    ],
    protocolRule: [
      { required: true, message: "协议规范不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询通讯协议列表 */
function getList() {
  loading.value = true;
  listProtocol(queryParams.value).then(response => {
    protocolList.value = response.rows;
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
    protocolId: null,
    protocolName: null,
    protocolAbbr: null,
    protocolRule: null,
    protocolType: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  };
  proxy.resetForm("protocolRef");
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
  ids.value = selection.map(item => item.protocolId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加通讯协议";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const protocolId = row.protocolId || ids.value
  getProtocol(protocolId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改通讯协议";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["protocolRef"].validate(valid => {
    if (valid) {
      if (form.value.protocolId != null) {
        updateProtocol(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addProtocol(form.value).then(response => {
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
  const protocolIds = row.protocolId || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delProtocol(protocolIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('sensor/protocol/export', {
    ...queryParams.value
  }, `protocol_${new Date().getTime()}.xlsx`)
}

getList();
</script>
<style>
.toolsline{
  height: 30px;
}
</style>
