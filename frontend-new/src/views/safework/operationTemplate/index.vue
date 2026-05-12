<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="作业类型" prop="operationType">
        <el-select v-model="queryParams.operationType" placeholder="请选择作业类型" clearable>
          <el-option
            v-for="dict in safe_operation_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属部门" prop="deptId">
        <el-input
          v-model="queryParams.deptId"
          placeholder="请输入所属部门"
          clearable
          @keyup.enter="handleQuery"
        />
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
          v-hasPermi="['safework:operationTemplate:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:operationTemplate:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:operationTemplate:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:operationTemplate:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="operationTemplateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="作业类型" align="center" prop="operationType">
        <template #default="scope">
          <dict-tag :options="safe_operation_type" :value="scope.row.operationType"/>
        </template>
      </el-table-column>
      <el-table-column label="所属部门" align="center" prop="deptName" />
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
            v-hasPermi="['safework:operationTemplate:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="List"
            @click="handleConfigure(scope.row)"
            v-hasPermi="['safework:templateDicUsers:add']"
          >配置</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:operationTemplate:remove']"
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

    <!-- 添加或修改作业证模板对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="operationTemplateRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="作业类型" prop="operationType">
          <el-select v-model="form.operationType" placeholder="请选择作业类型">
            <el-option
              v-for="dict in safe_operation_type"
              :key="dict.value"
              :label="dict.label"
							:value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
					<el-select v-model="form.deptId">
						<el-option
						v-for="dept in deptList"
						:key="dept.deptId"
						:label="dept.deptName"
						:value="dept.deptId">
						</el-option>
					</el-select>
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
		
    <!-- 配置作业证模板对话框 -->
    <el-dialog :title="title2" v-model="open2" width="500px" append-to-body>
      <el-form ref="operationTemplateRef2" :model="form" label-width="110px">
				<div style="width: 100%; height: 25px;">基本信息</div>
        <el-form-item label="安全交底人" prop="safetyDisclosureUserIdArray">
          <el-select v-model="form.safetyDisclosureUserIdArray" multiple>
						<el-option
						v-for="item in userList"
						:key="item.userId"
						:label="item.nickName"
						:value="item.userId">
						</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作业危害分析人" prop="hazardAnalysisUserIdArray">
          <el-select v-model="form.hazardAnalysisUserIdArray" multiple>
						<el-option
						v-for="item in userList"
						:key="item.userId"
						:label="item.nickName"
						:value="item.userId">
						</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作业危害审核人" prop="hazardProcessUserIdArray">
          <el-select v-model="form.hazardProcessUserIdArray" multiple>
						<el-option
						v-for="item in userList"
						:key="item.userId"
						:label="item.nickName"
						:value="item.userId">
						</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作业危害审定人" prop="hazardApprovalUserIdArray">
          <el-select v-model="form.hazardApprovalUserIdArray" multiple>
						<el-option
						v-for="item in userList"
						:key="item.userId"
						:label="item.nickName"
						:value="item.userId">
						</el-option>
          </el-select>
        </el-form-item>
				<div style="width: 100%; height: 25px;">分析化验</div>
        <el-form-item label="分析人" prop="analysisUserIdArray">
          <el-select v-model="form.analysisUserIdArray" multiple>
						<el-option
						v-for="item in userList"
						:key="item.userId"
						:label="item.nickName"
						:value="item.userId">
						</el-option>
          </el-select>
        </el-form-item>
				<div style="width: 100%; height: 25px;">现场确认</div>
        <el-form-item v-for="(item,index) in sceneConfirmationDeptDicList" :label="item.departmentName">
					<el-select v-model="form.sceneConfirmationDeptDicList[index].userIdsArray" multiple>
						<el-option
						v-for="item in userList"
						:key="item.userId"
						:label="item.nickName"
						:value="item.userId">
						</el-option>
					</el-select>
        </el-form-item>
				<div style="width: 100%; height: 25px;">作业审批</div>
        <el-form-item v-for="(item,index) in approvalProcessList" :label="item.operationName">
					<el-select v-model="form.approvalProcessList[index].userIdsArray" multiple>
						<el-option
						v-for="item in userList"
						:key="item.userId"
						:label="item.nickName"
						:value="item.userId">
						</el-option>
					</el-select>
        </el-form-item>
				<div style="width: 100%; height: 25px;">作业验收</div>
        <el-form-item v-for="(item,index) in checkDicList" :label="item.checkName">
					<el-select v-model="form.checkDicList[index].userIdsArray" multiple>
						<el-option
						v-for="item in userList"
						:key="item.userId"
						:label="item.nickName"
						:value="item.userId">
						</el-option>
					</el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm2">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="OperationTemplate">
import { listOperationTemplate, getOperationTemplate, delOperationTemplate, addOperationTemplate, updateOperationTemplate, configureOperationTemplate } from "@/api/safework/operationTemplate";
import { listDept } from '@/api/system/dept'
import { listUser } from '@/api/system/user'
import { listSceneConfirmationDeptDic } from "@/api/safework/sceneConfirmationDeptDic";
import { listApprovalProcess } from "@/api/safework/approvalProcess";
import { listCheckDic } from "@/api/safework/checkDic";
import {h} from "vue";

const { proxy } = getCurrentInstance();
const { status, safe_operation_type } = proxy.useDict('status', 'safe_operation_type');

const operationTemplateList = ref([]);
const deptList = ref([]);
const userList = ref([]);
const sceneConfirmationDeptDicList = ref([]);
const approvalProcessList = ref([]);
const checkDicList = ref([]);
const open = ref(false);
const open2 = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const title2 = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    operationType: null,
    deptId: null,
    status: "0"
  },
  rules: {
    operationType: [
      { required: true, message: "作业类型不能为空", trigger: "change" }
    ],
    deptId: [
      { required: true, message: "所属部门不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询部门列表 */
function getDeptList(){
	listDept({deptFlag: '0', status: '0'}).then(response => {
		deptList.value = response.data;
	})
}

function getUserList(){
	listUser({deptFlag: '0', status: '0'}).then(response => {
		userList.value = response.rows;
	})
}

/** 查询现场确认部门字典列表 */
function getSceneConfirmationDeptDicList(){
	listSceneConfirmationDeptDic({operationType: form.value.operationType, operatorType: '0', status: '0'}).then(response => {
		sceneConfirmationDeptDicList.value = response.rows;
	})
}

/** 查询作业审批自定义列表 */
function getApprovalProcessList(){
	listApprovalProcess({operationType: form.value.operationType, operatorType: '0', status: '0'}).then(response => {
		approvalProcessList.value = response.rows;
	})
}

/** 查询作业验收字典列表 */
function getCheckDicList(){
	listCheckDic({checkDeptType: form.value.operationType, operatorType: '0', status: '0'}).then(response => {
		checkDicList.value = response.rows;
	})
}

/** 查询作业证模板列表 */
function getList() {
  loading.value = true;
  listOperationTemplate(queryParams.value).then(response => {
    operationTemplateList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  open2.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    operationType: null,
    deptId: null,
    status: "0",
		safetyDisclosureUserId: null, 
		hazardAnalysisUserId: null, 
		hazardProcessUserId: null, 
		hazardApprovalUserId: null, 
		analysisUserId: null, 
		safetyDisclosureUserIdArray: [], 
		hazardAnalysisUserIdArray: [], 
		hazardProcessUserIdArray: [], 
		hazardApprovalUserIdArray: [], 
		analysisUserIdArray: [], 
		sceneConfirmationDeptDicList: [], 
		approvalProcessList: [], 
		checkDicList: []
  };
  proxy.resetForm("operationTemplateRef");
  proxy.resetForm("operationTemplateRef2");
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
  title.value = "添加作业证模板";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getOperationTemplate(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改作业证模板";
  });
}

/** 配置按钮操作 */
function handleConfigure(row) {
  reset();
  const id = row.id || ids.value
  getOperationTemplate(id).then(response => {
    form.value = response.data;
		getSceneConfirmationDeptDicList();
		getApprovalProcessList();
		getCheckDicList();
    open2.value = true;
    title2.value = "配置作业证模板";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["operationTemplateRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateOperationTemplate(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addOperationTemplate(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}
/** 提交按钮 */
function submitForm2() {
  proxy.$refs["operationTemplateRef2"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        configureOperationTemplate(form.value).then(response => {
          proxy.$modal.msgSuccess("配置成功");
          open2.value = false;
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
    return delOperationTemplate(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/operationTemplate/export', {
    ...queryParams.value
  }, `operationTemplate_${new Date().getTime()}.xlsx`)
}

getDeptList();
getUserList();
getList();
</script>
