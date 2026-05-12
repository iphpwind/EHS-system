<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="现场确认部门" prop="confirmationDeptDicId">
				<el-select v-model="queryParams.confirmationDeptDicId" placeholder="请选择现场确认部门">
					<el-option
						v-for="dict in sceneConfirmationDeptDicList"
						:key="dict.id"
						:label="dict.departmentName"
						:value="dict.id"
						clearable
					></el-option>
				</el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
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
          v-hasPermi="['safework:fireworkSceneConfirmation:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:fireworkSceneConfirmation:edit']"
        >修改</el-button>
      </el-col>
<!--      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:fireworkSceneConfirmation:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:fireworkSceneConfirmation:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 300px)" v-loading="loading" :data="fireworkSceneConfirmationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="id" align="center" prop="id" />-->
      <el-table-column label="现场确认部门" align="center" prop="departmentName" />
      <el-table-column label="现场确认序号" align="center" prop="orderNum" />
      <el-table-column label="现场确认内容" align="center" prop="confirmationContent" />
      <el-table-column label="来源" align="center" prop="originType">
        <template #default="scope">
          <dict-tag :options="safe_confirm_origin" :value="scope.row.originType"/>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:fireworkSceneConfirmation:edit']"
          >修改</el-button>
<!--          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:fireworkSceneConfirmation:remove']"
          >删除</el-button>-->
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

    <!-- 添加或修改动火作业现场确认内容对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="fireworkSceneConfirmationRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="现场确认部门" prop="confirmationDeptDicId">
          <el-select v-model="form.confirmationDeptDicId" placeholder="请选择现场确认部门">
            <el-option
              v-for="dict in sceneConfirmationDeptDicList"
              :key="dict.id"
              :label="dict.departmentName"
							:value="dict.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="现场确认序号" prop="orderNum">
					<el-input-number v-model="form.orderNum" controls-position="right" :min="0"/>
        </el-form-item>
        <el-form-item label="现场确认内容" prop="confirmationContent">
          <el-input type="textarea" v-model="form.confirmationContent" placeholder="请输入现场确认内容" />
        </el-form-item>
        <el-form-item label="来源">
          <el-radio-group v-model="form.originType">
            <el-radio
              v-for="dict in safe_confirm_origin"
              :key="dict.value"
:label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in status"
              :key="dict.value"
:label="dict.value"
            >{{dict.label}}</el-radio>
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

<script setup name="FireworkSceneConfirmation">
import { listFireworkSceneConfirmation, getFireworkSceneConfirmation, delFireworkSceneConfirmation, addFireworkSceneConfirmation, updateFireworkSceneConfirmation } from "@/api/safework/fireworkSceneConfirmation";
import { listSceneConfirmationDeptDic } from "@/api/safework/sceneConfirmationDeptDic";
import {h} from "vue";

const { proxy } = getCurrentInstance();
const { safe_confirm_origin, status } = proxy.useDict('safe_confirm_origin', 'status');

const fireworkSceneConfirmationList = ref([]);
const sceneConfirmationDeptDicList = ref([]);
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
    confirmationDeptDicId: null,
    status: "0"
  },
  rules: {
		orderNum: [
      { required: true, message: "现场确认部门不能为空", trigger: "blur" }
    ],
    confirmationDeptDicId: [
      { required: true, message: "现场确认部门不能为空", trigger: "blur" }
    ],
    confirmationContent: [
      { required: true, message: "现场确认内容不能为空", trigger: "blur" }
    ],
    originType: [
      { required: true, message: "来源不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询现场确认部门字典列表 */
function getSceneConfirmationDeptDicList() {
	listSceneConfirmationDeptDic({status:"0", operationType:"0"}).then(response => {
	  sceneConfirmationDeptDicList.value = response.rows;
	});
}

/** 查询动火作业现场确认内容列表 */
function getList() {
  loading.value = true;
  listFireworkSceneConfirmation(queryParams.value).then(response => {
    fireworkSceneConfirmationList.value = response.rows;
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
    confirmationDeptDicId: null,
    orderNum: null,
    confirmationContent: null,
    originType: "0",
    status: "0"
  };
  proxy.resetForm("fireworkSceneConfirmationRef");
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
  title.value = "添加动火作业现场确认内容";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getFireworkSceneConfirmation(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改动火作业现场确认内容";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["fireworkSceneConfirmationRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateFireworkSceneConfirmation(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addFireworkSceneConfirmation(form.value).then(response => {
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
    return delFireworkSceneConfirmation(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/fireworkSceneConfirmation/export', {
    ...queryParams.value
  }, `fireworkSceneConfirmation_${new Date().getTime()}.xlsx`)
}

getSceneConfirmationDeptDicList();
getList();
</script>
