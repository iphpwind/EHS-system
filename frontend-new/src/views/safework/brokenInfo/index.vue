<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option label="正常" value="0" />
          <el-option label="作废" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="作业阶段">
        <el-select v-model="queryParams.workState" placeholder="请选择" clearable>
          <el-option label="基础信息" value="1" />
          <el-option label="现场确认" value="2" />
          <el-option label="作业审核" value="3" />
          <el-option label="作业中" value="31" />
          <el-option label="作业验收" value="5" />
          <el-option label="验收完成" value="6" />
          <el-option label="作废" value="7" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        <el-button @click="ticket" icon="Tickets">作业票模板</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
<!--      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['safework:brokenInfo:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:brokenInfo:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:brokenInfo:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:brokenInfo:export']"
        >导出</el-button>
      </el-col>-->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 300px)" v-loading="loading" :data="brokenInfoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="施工计划" align="center" prop="planCode" />
      <el-table-column label="作业地点" align="center" prop="operationSite" />
      <el-table-column label="断路编号" align="center" prop="code" />
      <el-table-column label="断路原因" align="center" prop="brokenReason" />
      <el-table-column label="断路计划开始时间" align="center" prop="startTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="断路计划结束时间" align="center" prop="endTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="作业单位" align="center" prop="workUnit" />-->
      <el-table-column prop="workState" label="状态" >
        <template #default="scope">
          <span class="ok" v-if="scope.row.workState == 1">基础信息</span>
          <span class="ok" v-if="scope.row.workState == 2">现场确认</span>
          <span class="ok" v-if="scope.row.workState == 3">作业审核</span>
          <span class="ok" v-if="scope.row.workState == 31">作业中</span>
          <span class="ok" v-if="scope.row.workState == 5">作业验收</span>
          <span class="ok" v-if="scope.row.workState == 6">验收完成</span>
          <span class="ok" v-if="scope.row.workState == 7">作废</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="240">
<!--        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:brokenInfo:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:brokenInfo:remove']"
          >删除</el-button>
        </template>-->
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
              v-if="scope.row.status == '0' && scope.row.createBy==userId"
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

    <!-- 添加或修改断路作业对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="brokenInfoRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="企业编码" prop="enterpriseCode">
          <el-input v-model="form.enterpriseCode" placeholder="请输入企业编码" />
        </el-form-item>
        <el-form-item label="施工计划编码" prop="planCode">
          <el-input v-model="form.planCode" placeholder="请输入施工计划编码" />
        </el-form-item>
        <el-form-item label="作业地点id" prop="placeId">
          <el-input v-model="form.placeId" placeholder="请输入作业地点id" />
        </el-form-item>
        <el-form-item label="断路编号" prop="brokenNum">
          <el-input v-model="form.brokenNum" placeholder="请输入断路编号" />
        </el-form-item>
        <el-form-item label="风险辨识id" prop="hazardIdentId">
          <el-input v-model="form.hazardIdentId" placeholder="请输入风险辨识id" />
        </el-form-item>
        <el-form-item label="断路计划开始时间" prop="startTime">
          <el-date-picker clearable
            v-model="form.startTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择断路计划开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="断路计划结束时间" prop="endTime">
          <el-date-picker clearable
            v-model="form.endTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择断路计划结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="断路原因" prop="brokenReason">
          <el-input v-model="form.brokenReason" placeholder="请输入断路原因" />
        </el-form-item>
        <el-form-item label="作业危害分析人" prop="hazardAnalysisUserId">
          <el-input v-model="form.hazardAnalysisUserId" placeholder="请输入作业危害分析人" />
        </el-form-item>
        <el-form-item label="分析人签字" prop="analysisUserSign">
          <el-input v-model="form.analysisUserSign" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="作业危害审核人" prop="hazardProcessUserId">
          <el-input v-model="form.hazardProcessUserId" placeholder="请输入作业危害审核人" />
        </el-form-item>
        <el-form-item label="审核人签字" prop="processUserSign">
          <el-input v-model="form.processUserSign" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="作业危害审定人" prop="hazardApprovalUserId">
          <el-input v-model="form.hazardApprovalUserId" placeholder="请输入作业危害审定人" />
        </el-form-item>
        <el-form-item label="审定人签字" prop="approvalUserSign">
          <el-input v-model="form.approvalUserSign" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="安全交底人" prop="safetyDisclosureUserId">
          <el-input v-model="form.safetyDisclosureUserId" placeholder="请输入安全交底人" />
        </el-form-item>
        <el-form-item label="交底人签字" prop="disclosureUserSign">
          <el-input v-model="form.disclosureUserSign" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否重点监管" prop="superviseFlag">
          <el-input v-model="form.superviseFlag" placeholder="请输入是否重点监管" />
        </el-form-item>
        <el-form-item label="作业单位" prop="workUnit">
          <el-input v-model="form.workUnit" placeholder="请输入作业单位" />
        </el-form-item>
        <el-form-item label="断路相关说明" prop="brokenExplain">
          <el-input v-model="form.brokenExplain" placeholder="请输入断路相关说明" />
        </el-form-item>
        <el-form-item label="作业状态" prop="workState">
          <el-input v-model="form.workState" placeholder="请输入作业状态" />
        </el-form-item>
        <el-form-item label="作业审核流程实例id" prop="processInstanceId">
          <el-input v-model="form.processInstanceId" placeholder="请输入作业审核流程实例id" />
        </el-form-item>
        <el-form-item label="申请作业时间" prop="applyTime">
          <el-date-picker clearable
            v-model="form.applyTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择申请作业时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="申请作业人" prop="applyBy">
          <el-input v-model="form.applyBy" placeholder="请输入申请作业人" />
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

<script setup name="BrokenInfo">
import { listBrokenInfo, getBrokenInfo, delBrokenInfo, addBrokenInfo, updateBrokenInfo, updateStatus } from "@/api/safework/brokenInfo";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const userStore = useUserStore()

const brokenInfoList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const userId = ref(null);
const cancelopen = ref(false);
const nowid = ref(null);

const data = reactive({
  cancelform:{},
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    enterpriseCode: null,
    planCode: null,
    placeId: null,
    brokenNum: null,
    hazardIdentId: null,
    startTime: null,
    endTime: null,
    brokenReason: null,
    hazardAnalysisUserId: null,
    analysisUserSign: null,
    hazardProcessUserId: null,
    processUserSign: null,
    hazardApprovalUserId: null,
    approvalUserSign: null,
    safetyDisclosureUserId: null,
    disclosureUserSign: null,
    superviseFlag: null,
    workUnit: null,
    workUnitType: null,
    brokenExplain: null,
    workState: null,
    status: null,
    processInstanceId: null,
    applyTime: null,
    applyBy: null
  },
  cancelrules:{
    reason: [
      { required: true, message: "作废理由不能为空", trigger: "blur" }
    ],
  },
  rules: {
    startTime: [
      { required: true, message: "断路计划开始时间不能为空", trigger: "blur" }
    ],
    endTime: [
      { required: true, message: "断路计划结束时间不能为空", trigger: "blur" }
    ],
    superviseFlag: [
      { required: true, message: "是否重点监管不能为空", trigger: "blur" }
    ],
    workState: [
      { required: true, message: "作业状态不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules, cancelform, cancelrules } = toRefs(data);

// 取消按钮
function cancancel() {
  cancelopen.value = false;
  cancelform.value = {
    reason:null
  }
}

function cancelsubmitForm(){
  updateStatus({id:nowid.value,status:'1',workState:'7',cancelReason:cancelform.value.reason}).then(response => {
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

/** 查询断路作业列表 */
function getList() {
  loading.value = true;
  listBrokenInfo(queryParams.value).then(response => {
    brokenInfoList.value = response.rows;
    if(brokenInfoList.value.length>0){
      brokenInfoList.value.forEach((j, index) => {
        j.operationSite=j.safeSpecialPlace.operationSite
      })
    }
    total.value = response.total;
    loading.value = false;
  });
}

function ticket(){
  proxy.$router.push({
    path: '/SpecialOperation/brokenticketdemo',
  })
}

//电子作业票
function lookDetail(row){
  proxy.$router.push({
    path: '/SpecialOperation/brokenticket',
    query:{
      id:row.id
    }
  })
}
function detail(row){
  proxy.$router.push({
    path: '/SpecialOperation/brokendetail',
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
    enterpriseCode: null,
    planCode: null,
    placeId: null,
    brokenNum: null,
    hazardIdentId: null,
    startTime: null,
    endTime: null,
    brokenReason: null,
    hazardAnalysisUserId: null,
    analysisUserSign: null,
    hazardProcessUserId: null,
    processUserSign: null,
    hazardApprovalUserId: null,
    approvalUserSign: null,
    safetyDisclosureUserId: null,
    disclosureUserSign: null,
    superviseFlag: null,
    workUnit: null,
    workUnitType: null,
    brokenExplain: null,
    workState: null,
    status: "0",
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    processInstanceId: null,
    applyTime: null,
    applyBy: null
  };
  proxy.resetForm("brokenInfoRef");
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
  title.value = "添加断路作业";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getBrokenInfo(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改断路作业";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["brokenInfoRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateBrokenInfo(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addBrokenInfo(form.value).then(response => {
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
    return delBrokenInfo(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/brokenInfo/export', {
    ...queryParams.value
  }, `brokenInfo_${new Date().getTime()}.xlsx`)
}

userId.value = userStore.user.userId
getList();
</script>
