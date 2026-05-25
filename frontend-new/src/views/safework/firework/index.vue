<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="作业证编码" prop="code" label-width="90px">
        <el-input v-model="queryParams.code" clearable />
      </el-form-item>
      <el-form-item label="所属部门" prop="deptId">
        <tree-select
            v-model:value="queryParams.deptId"
            :options="deptOptions"
            placeholder="请选择归属部门"
            :objMap="{ value: 'id', label: 'label', children: 'children' }"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option label="正常" value="0" />
          <el-option label="作废" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="作业阶段">
        <el-select v-model="queryParams.fireworkState" placeholder="请选择" clearable>
          <el-option label="发起阶段" value="0" />
          <el-option label="基础信息" value="1" />
          <el-option label="分析化验" value="2" />
          <el-option label="现场确认" value="3" />
          <el-option label="作业审核" value="4" />
          <el-option label="作业中" value="5" />
          <el-option label="作业验收" value="6" />
          <el-option label="验收完成" value="7" />
          <el-option label="作废" value="8" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否重点监督" prop="superviseFlag" label-width="100px">
        <el-select v-model="queryParams.superviseFlag" placeholder="请选择是否重点监督" clearable>
          <el-option label="否" value="0" />
          <el-option label="是" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        <el-button @click="ticket" icon="Tickets">作业票模板</el-button>
      </el-form-item>
    </el-form>

    <el-table height="calc(100vh - 300px)" v-loading="loading" :data="fireworkList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="所属机构" align="center" prop="deptName" />
      <el-table-column label="作业证编码" align="center" prop="code" />
      <el-table-column label="发起人" align="center" prop="createUserName" />
      <el-table-column label="发起时间" align="center" prop="createTime" width="180"/>
      <el-table-column label="作业级别" align="center" prop="levelName" />
      <el-table-column label="动火地点" align="center" prop="operationSite" >
        <template #default="scope">
          <span>{{scope.row.safeObjectName}}/{{scope.row.safeUnitName}}/{{scope.row.operationSite}}</span>
        </template>
      </el-table-column>
      <el-table-column label="动火方式" align="center" prop="typeName" />
      <el-table-column label="作业内容" align="center" prop="operationContent" />
      <el-table-column label="作业阶段" align="center" prop="fireworkStateName" />
      <!-- <el-table-column label="作业计划开始时间" align="center" prop="startTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作业计划结束时间" align="center" prop="endTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="240">
        <template #default="scope">
          <el-button
              type="text"
              @click="detail(scope.row)"
          >作业票详情</el-button>
          <el-button
              type="text"
              @click="lookDetail(scope.row)"
          >电子作业票</el-button>
          <el-button
              v-if="scope.row.status == '0' && scope.row.createUserId==userId"
              type="text"
              @click="cancelDel(scope.row)"
          >作废</el-button>
          <el-button
              type="text"
              v-if="scope.row.monitorEquipId!=null && scope.row.monitorEquipId!='' && scope.row.monitorEquipId!=0"
              @click="ball(scope.row)"
          >布控球</el-button>
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

    <!-- 添加或修改动火作业对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="fireworkRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属企业" prop="deptId">
          <el-input v-model="form.deptId" placeholder="请输入所属企业" />
        </el-form-item>
        <el-form-item label="施工计划id" prop="planCode">
          <el-input v-model="form.planCode" placeholder="请输入施工计划id" width="205"/>
        </el-form-item>
        <el-form-item label="动火作业级别id" prop="levelId">
          <el-input v-model="form.levelId" placeholder="请输入动火作业级别id" />
        </el-form-item>
        <el-form-item label="作业区域" prop="safeObjectId">
          <el-input v-model="form.safeObjectId" placeholder="请输入作业区域" />
        </el-form-item>
        <el-form-item label="风险点" prop="safeUnitId">
          <el-input v-model="form.safeUnitId" placeholder="请输入风险点" />
        </el-form-item>
        <el-form-item label="作业地点" prop="operationSite">
          <el-input v-model="form.operationSite" placeholder="请输入作业地点" />
        </el-form-item>
        <el-form-item label="动火方式" prop="typeId">
          <el-input v-model="form.typeId" placeholder="请输入动火方式" />
        </el-form-item>
        <el-form-item label="作业内容" prop="operationContent">
          <el-input v-model="form.operationContent" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="风险辨识结果" prop="hazardId">
          <el-input v-model="form.hazardId" placeholder="请输入风险辨识结果" />
        </el-form-item>
        <el-form-item label="作业危害分析人" prop="hazardAnalysisUserId">
          <el-input v-model="form.hazardAnalysisUserId" placeholder="请输入作业危害分析人" />
        </el-form-item>
        <el-form-item label="作业危害分析人签字" prop="hazardAnalysisSign">
          <el-input v-model="form.hazardAnalysisSign" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="作业危害审核人" prop="hazardProcessUserId">
          <el-input v-model="form.hazardProcessUserId" placeholder="请输入作业危害审核人" />
        </el-form-item>
        <el-form-item label="作业危害审核人签字" prop="hazardProcessSign">
          <el-input v-model="form.hazardProcessSign" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="作业危害审定人" prop="hazardApprovalUserId">
          <el-input v-model="form.hazardApprovalUserId" placeholder="请输入作业危害审定人" />
        </el-form-item>
        <el-form-item label="作业危害审定人签字" prop="hazardApprovalSign">
          <el-input v-model="form.hazardApprovalSign" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="安全交底人" prop="safetyDisclosureUserId">
          <el-input v-model="form.safetyDisclosureUserId" placeholder="请输入安全交底人" />
        </el-form-item>
        <el-form-item label="安全交底人签字" prop="safetyDisclosureSign">
          <el-input v-model="form.safetyDisclosureSign" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="作业单位id" prop="operationDeptId">
          <el-input v-model="form.operationDeptId" placeholder="请输入作业单位id" />
        </el-form-item>
        <el-form-item label="是否重点监管" prop="superviseFlag">
          <el-input v-model="form.superviseFlag" placeholder="请输入是否重点监管" />
        </el-form-item>
        <el-form-item label="作业单位监护人签字" prop="controlSign">
          <el-input v-model="form.controlSign" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="作业负责人签字" prop="responsibleSign">
          <el-input v-model="form.responsibleSign" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="动火人签字" prop="fireworkSign">
          <el-input v-model="form.fireworkSign" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="作业证id" prop="certificateId">
          <el-input v-model="form.certificateId" placeholder="请输入作业证id" />
        </el-form-item>
        <el-form-item label="作业计划开始时间" prop="startTime">
          <el-date-picker clearable
            v-model="form.startTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择作业计划开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="作业计划结束时间" prop="endTime">
          <el-date-picker clearable
            v-model="form.endTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择作业计划结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="分析数据" prop="analysisId">
          <el-input v-model="form.analysisId" placeholder="请输入分析数据" />
        </el-form-item>
        <el-form-item label="分析人" prop="analysisUserId">
          <el-input v-model="form.analysisUserId" placeholder="请输入分析人" />
        </el-form-item>
        <el-form-item label="分析化验提交时间" prop="analysisTime">
          <el-date-picker clearable
            v-model="form.analysisTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择分析化验提交时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="作业审核流程实例id" prop="processInstanceId">
          <el-input v-model="form.processInstanceId" placeholder="请输入作业审核流程实例id" />
        </el-form-item>
        <el-form-item label="拒绝理由" prop="refuseReason">
          <el-input v-model="form.refuseReason" placeholder="请输入拒绝理由" />
        </el-form-item>
        <el-form-item label="作废理由" prop="cancelReason">
          <el-input v-model="form.cancelReason" placeholder="请输入作废理由" />
        </el-form-item>
        <el-form-item label="作业状态" prop="fireworkState">
          <el-input v-model="form.fireworkState" placeholder="请输入作业状态" />
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
        <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
        </el-form-item>
        <el-form-item label="申请人id" prop="createUserId">
          <el-input v-model="form.createUserId" placeholder="请输入申请人id" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="作废" v-model="cancelopen" width="500px" append-to-body>
      <el-form ref="fireworkCancel" :model="cancelform" :rules="cancelrules" label-width="80px">
        <el-form-item label="作废理由" prop="reason">
          <el-input v-model="cancelform.reason" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="cancelsubmitForm">确 定</el-button>
          <el-button @click="cancancel">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Firework">
import { listFirework, getFirework, delFirework, addFirework, updateFirework, updateStatus } from "@/api/safework/firework";
import {treeselect} from "@/api/system/dept";
import {h} from "vue";

const { proxy } = getCurrentInstance();
const { status } = proxy.useDict('status');

const userStore = useUserStore()

const fireworkList = ref([]);
const open = ref(false);
const cancelopen = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const nowid = ref(null);
const router = useRouter();
const activeName = ref("first");
const deptOptions = ref(undefined);
const userId = ref(null);

const data = reactive({
  form: {},
  cancelform:{},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    status: "0",
    delFlag: "0",
		fireworkState: null,
		superviseFlag: null,
		id: null,
		deptId: null,
  },
  cancelrules:{
    reason: [
      { required: true, message: "作废理由不能为空", trigger: "blur" }
    ],
  },
  rules: {
    deptId: [
      { required: true, message: "所属企业不能为空", trigger: "blur" }
    ],
    levelId: [
      { required: true, message: "动火作业级别id不能为空", trigger: "blur" }
    ],
    safeObjectId: [
      { required: true, message: "作业区域不能为空", trigger: "blur" }
    ],
    safeUnitId: [
      { required: true, message: "风险点不能为空", trigger: "blur" }
    ],
    operationSite: [
      { required: true, message: "作业地点不能为空", trigger: "blur" }
    ],
    typeId: [
      { required: true, message: "动火方式不能为空", trigger: "blur" }
    ],
    operationContent: [
      { required: true, message: "作业内容不能为空", trigger: "blur" }
    ],
    hazardId: [
      { required: true, message: "风险辨识结果不能为空", trigger: "blur" }
    ],
    superviseFlag: [
      { required: true, message: "是否重点监管不能为空", trigger: "blur" }
    ],
    startTime: [
      { required: true, message: "作业计划开始时间不能为空", trigger: "blur" }
    ],
    endTime: [
      { required: true, message: "作业计划结束时间不能为空", trigger: "blur" }
    ],
    analysisId: [
      { required: true, message: "分析数据不能为空", trigger: "blur" }
    ],
    fireworkState: [
      { required: true, message: "作业状态不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "blur" }
    ],
    delFlag: [
      { required: true, message: "删除标志不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules, cancelrules, cancelform } = toRefs(data);

/** 查询动火作业列表 */
function getList() {
  loading.value = true;
  listFirework(queryParams.value).then(response => {
    fireworkList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}
// 取消按钮
function cancancel() {
  cancelopen.value = false;
  cancelform.value = {
    reason:null
  }
}

function cancelsubmitForm(){
  updateStatus({id:nowid.value,status:'1',fireworkState:'8',cancelReason:cancelform.value.reason}).then(response => {
    proxy.$modal.msgSuccess("作废成功");
    nowid.value = null
    cancelopen.value = false;
    getList();
  });
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    deptId: null,
    planCode: null,
    levelId: null,
    safeObjectId: null,
    safeUnitId: null,
    operationSite: null,
    typeId: null,
    operationContent: null,
    unitOperationType: null,
    hazardId: null,
    hazardAnalysisUserId: null,
    hazardAnalysisSign: null,
    hazardProcessUserId: null,
    hazardProcessSign: null,
    hazardApprovalUserId: null,
    hazardApprovalSign: null,
    safetyDisclosureUserId: null,
    safetyDisclosureSign: null,
    operationDeptType: null,
    operationDeptId: null,
    superviseFlag: null,
    controlSign: null,
    responsibleSign: null,
    fireworkSign: null,
    certificateId: null,
    startTime: null,
    endTime: null,
    analysisId: null,
    analysisUserId: null,
    analysisTime: null,
    processInstanceId: null,
    refuseReason: null,
    cancelReason: null,
    fireworkState: null,
    status: "0",
    delFlag: null,
    createUserId: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("fireworkRef");
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
  title.value = "添加动火作业";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getFirework(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改动火作业";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["fireworkRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateFirework(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addFirework(form.value).then(response => {
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
    return delFirework(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/firework/export', {
    ...queryParams.value
  }, `firework_${new Date().getTime()}.xlsx`)
}

function ticket(){
  proxy.$router.push({
    path: '/SpecialOperation/fireworkTicketdemo',
  })
}

//电子作业票
function lookDetail(row){
  proxy.$router.push({
    path: '/SpecialOperation/fireworkTicket',
    query:{
      id:row.id
    }
  })
}
function ball(row){
  proxy.$router.push({
    path: '/SpecialOperation/ticketequip',
    query:{
      mainId:row.id
    }
  })
}
//作废作业票
function cancelDel(row){
  nowid.value = row.id
  cancelopen.value = true
}

function detail(row){
  proxy.$router.push({
    path: '/SpecialOperation/fireworkDetail',
    query:{
      id:row.id
    }
  })
}
/** 初始化部门数据 */
function initTreeData() {
  // 判断部门的数据是否存在，存在不获取，不存在则获取
  if (deptOptions.value === undefined) {
    treeselect().then(response => {
      deptOptions.value = response.data;
    });
  }
};

userId.value = userStore.user.userId
initTreeData();
getList();
</script>
<style>
	h4{
		padding-left: 10px;
		font-size: 16px;
		font-weight: bold;
		color: #66b1ff;
	}
	.signImg{
		width: 80px;
		height: 30px
	}
</style>
