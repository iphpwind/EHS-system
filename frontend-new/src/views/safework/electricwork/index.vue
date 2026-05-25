<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="作业证编码" prop="id" label-width="90px">
        <el-input v-model="queryParams.id" clearable />
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
        <el-select v-model="queryParams.operationState" placeholder="请选择" clearable>
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

    <el-table height="calc(100vh - 300px)" v-loading="loading" :data="electricworkList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="所属机构" align="center" prop="deptName" />
      <el-table-column label="作业证编码" align="center" prop="code" />
      <el-table-column label="发起人" align="center" prop="createUserName" />
      <el-table-column label="发起时间" align="center" prop="createTime" width="180"/>
      <!-- <el-table-column label="施工计划" align="center" prop="planCode"  width="205"/> -->
      <el-table-column label="作业地点" align="center" prop="operationSite" >
        <template #default="scope">
          <span>{{scope.row.safeObjectName}}/{{scope.row.safeUnitName}}/{{scope.row.operationSite}}</span>
        </template>
      </el-table-column>
      <el-table-column label="电源接入点" align="center" prop="electricInsert" />
      <el-table-column label="工作电压(V)" align="center" prop="voltage" />
      <el-table-column label="总功率(kw)" align="center" prop="totalPower" />
      <!-- <el-table-column label="临时用电计划开始时间" align="center" prop="startTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="临时用电计划结束时间" align="center" prop="endTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="作业内容" align="center" prop="operationContent" />
      <el-table-column label="作业阶段" prop="operationStateName" />
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

<script setup name="Electricwork">
import { listElectricwork, getElectricwork, delElectricwork, addElectricwork, updateElectricwork, updateStatus } from "@/api/safework/electricwork";
import {treeselect} from "@/api/system/dept";

const { proxy } = getCurrentInstance();
const { safe_operation_state } = proxy.useDict('safe_operation_state');

const userStore = useUserStore()

const electricworkList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const deptOptions = ref(undefined);
const userId = ref(null);
const nowid = ref(null);
const cancelopen = ref(false);


const data = reactive({
  form: {},
  cancelform:{},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    status: "0",
		operationState: null,
		superviseFlag: null,
		id: null,
		deptId: null
  },
  cancelrules:{
    reason: [
      { required: true, message: "作废理由不能为空", trigger: "blur" }
    ],
  },
});

const { queryParams, form, cancelrules, cancelform } = toRefs(data);

// 取消按钮
function cancancel() {
  cancelopen.value = false;
  cancelform.value = {
    reason:null
  }
}

function cancelsubmitForm(){
  updateStatus({id:nowid.value,status:'1',operationState:'8',cancelReason:cancelform.value.reason}).then(response => {
    proxy.$modal.msgSuccess("作废成功");
    nowid.value = null
    cancelopen.value = false;
    getList();
  });
}

//作废作业票
function cancelDel(row){
  nowid.value = row.id
  cancelopen.value = true
}
//布控球
function ball(row){
  proxy.$router.push({
    path: '/SpecialOperation/ticketequip',
    query:{
      mainId:row.id
    }
  })
}

/** 查询临时用电作业列表 */
function getList() {
  loading.value = true;
  listElectricwork(queryParams.value).then(response => {
    electricworkList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function ticket(){
  proxy.$router.push({
    path: '/SpecialOperation/electricworkTicketdemo',
  })
}

//电子作业票
function lookDetail(row){
  proxy.$router.push({
    path: '/SpecialOperation/electricworkTicket',
    query:{
      id:row.id
    }
  })
}
function detail(row){
  proxy.$router.push({
    path: '/SpecialOperation/electricworkDetail',
    query:{
      id:row.id
    }
  })
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
    planCode: null,
    safeObjectId: null,
    safeUnitId: null,
    operationSite: null,
    operationContent: null,
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
    electricworkSign: null,
    certificateId: null,
    startTime: null,
    endTime: null,
    analysisId: null,
    analysisUserId: null,
    analysisTime: null,
    processInstanceId: null,
    refuseReason: null,
    cancelReason: null,
    operationState: null,
    status: "0",
    delFlag: null,
    createUserId: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("electricworkRef");
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
