<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="120px">
      <el-form-item label="所属企业" prop="deptId">
        <el-input
          v-model="queryParams.deptId"
          placeholder="请输入所属企业"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="作业危害分析人" prop="hazardAnalysisUserId">
        <el-input
          v-model="queryParams.hazardAnalysisUserId"
          placeholder="请输入作业危害分析人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="作业危害审核人" prop="hazardProcessUserId">
        <el-input
          v-model="queryParams.hazardProcessUserId"
          placeholder="请输入作业危害审核人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="作业危害审定人" prop="hazardApprovalUserId">
        <el-input
          v-model="queryParams.hazardApprovalUserId"
          placeholder="请输入作业危害审定人"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否重点监管" prop="superviseFlag">
        <el-input
          v-model="queryParams.superviseFlag"
          placeholder="请输入是否重点监管"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        <el-button icon="Tickets" @click="godemo">模板</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 300px)" v-loading="loading" :data="earthList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="施工计划" align="center" prop="planCode" />
      <el-table-column label="作业地点" align="center" prop="operationSite" />
      <el-table-column label="作业内容" align="center" prop="operationContent" />
      <el-table-column label="关联的其他特殊作业" align="center" prop="unitOperationType" />
<!--      <el-table-column label="风险辨识结果" align="center" prop="hazardContent" />-->
<!--      <el-table-column label="作业危害分析人签字" align="center" prop="hazardAnalysisSign" />-->
<!--      <el-table-column label="作业危害审核人" align="center" prop="hazardProcessUserId" />-->
<!--      <el-table-column label="作业危害审核人签字" align="center" prop="hazardProcessSign" />-->
<!--      <el-table-column label="作业危害审定人" align="center" prop="hazardApprovalUserId" />-->
<!--      <el-table-column label="作业危害审定人签字" align="center" prop="hazardApprovalSign" />-->
      <el-table-column label="是否重点监管" align="center" prop="superviseFlag" />
      <el-table-column label="计划开始时间" align="center" prop="startTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划结束时间" align="center" prop="endTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="作业状态" align="center" prop="workState" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="240">
        <template #default="scope">
          <el-button
            type="text"
            icon="Mobile"
            @click="lookDetail(scope.row)"
          >作业详情</el-button>
          <el-button
            type="text"
            @click="lookTicket(scope.row)"
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

    <!-- 添加或修改动土作业对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="earthRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属企业" prop="deptId">
          <el-input v-model="form.deptId" placeholder="请输入所属企业" />
        </el-form-item>
        <el-form-item label="施工计划id" prop="planCode">
          <el-input v-model="form.planCode" placeholder="请输入施工计划id" />
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
        <el-form-item label="作业内容" prop="operationContent">
          <el-input v-model="form.operationContent" placeholder="请输入作业内容" />
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
        <el-form-item label="是否重点监管" prop="superviseFlag">
          <el-input v-model="form.superviseFlag" placeholder="请输入是否重点监管" />
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
        <el-form-item label="作业单位监护人签字" prop="controlSign">
          <el-input v-model="form.controlSign" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="作业单位监护人id" prop="controlUserId">
          <el-input v-model="form.controlUserId" placeholder="请输入作业单位监护人id" />
        </el-form-item>
        <el-form-item label="作业单位负责人签字" prop="responsibleSign">
          <el-input v-model="form.responsibleSign" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="作业单位负责人id" prop="responsibleUserId">
          <el-input v-model="form.responsibleUserId" placeholder="请输入作业单位负责人id" />
        </el-form-item>
        <el-form-item label="作业范围" prop="workScope">
          <el-input v-model="form.workScope" placeholder="请输入作业范围" />
        </el-form-item>
        <el-form-item label="作业内容" prop="workCont">
          <el-input v-model="form.workCont" placeholder="请输入作业内容" />
        </el-form-item>
        <el-form-item label="作业方式" prop="workWay">
          <el-input v-model="form.workWay" placeholder="请输入作业方式" />
        </el-form-item>
        <el-form-item label="作业简图" prop="workImg">
          <el-input v-model="form.workImg" placeholder="请输入作业简图" />
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
        <el-form-item label="作业状态" prop="fireworkState">
          <el-input v-model="form.fireworkState" placeholder="请输入作业状态" />
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

<script setup name="Earth">
import { listEarth, getEarth, delEarth, addEarth, updateEarth, updateStatus } from "@/api/safework/earth";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const store = useStore();
const getters = computed(() => store.getters);
const earthList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const nowid = ref(null);
const userId = ref(null);
const cancelopen = ref(false);

const data = reactive({
  form: {},
  cancelform:{},
  cancelrules:{
    reason: [
      { required: true, message: "作废理由不能为空", trigger: "blur" }
    ],
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deptId: null,
    planCode: null,
    safeObjectId: null,
    safeUnitId: null,
    operationSite: null,
    operationContent: null,
    unitOperationType: null,
    hazardId: null,
    hazardAnalysisUserId: null,
    hazardAnalysisSign: null,
    hazardProcessUserId: null,
    hazardProcessSign: null,
    hazardApprovalUserId: null,
    hazardApprovalSign: null,
    superviseFlag: null,
    safetyDisclosureUserId: null,
    safetyDisclosureSign: null,
    operationDeptType: null,
    operationDeptId: null,
    controlSign: null,
    controlUserId: null,
    responsibleSign: null,
    responsibleUserId: null,
    workScope: null,
    workCont: null,
    workWay: null,
    workImg: null,
    startTime: null,
    endTime: null,
    fireworkState: null,
    status: null,
    createUserId: null,
  },
  rules: {
    deptId: [
      { required: true, message: "所属企业不能为空", trigger: "blur" }
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

const { queryParams, form, rules,cancelrules, cancelform } = toRefs(data);

// 取消按钮
function cancancel() {
  cancelopen.value = false;
  cancelform.value = {
    reason:null
  }
}

function cancelsubmitForm(){
  updateStatus({id:nowid.value,status:'1',workState:'8',cancelReason:cancelform.value.reason}).then(response => {
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

/** 查询动土作业列表 */
function getList() {
  loading.value = true;
  listEarth(queryParams.value).then(response => {
    earthList.value = response.rows;
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
    deptId: null,
    planCode: null,
    safeObjectId: null,
    safeUnitId: null,
    operationSite: null,
    operationContent: null,
    unitOperationType: null,
    hazardId: null,
    hazardAnalysisUserId: null,
    hazardAnalysisSign: null,
    hazardProcessUserId: null,
    hazardProcessSign: null,
    hazardApprovalUserId: null,
    hazardApprovalSign: null,
    superviseFlag: null,
    safetyDisclosureUserId: null,
    safetyDisclosureSign: null,
    operationDeptType: null,
    operationDeptId: null,
    controlSign: null,
    controlUserId: null,
    responsibleSign: null,
    responsibleUserId: null,
    workScope: null,
    workCont: null,
    workWay: null,
    workImg: null,
    startTime: null,
    endTime: null,
    fireworkState: null,
    status: "0",
    delFlag: null,
    createUserId: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("earthRef");
}

function godemo(){
  proxy.$router.push({
    path: '/SpecialOperation/earthDemo'
  })
}

//电子作业票
function lookDetail(row){
  proxy.$router.push({
    path: '/SpecialOperation/earthDetail',
    query:{
      id:row.id,
      workState:row.workState
    }
  })
}
//电子作业票
function lookTicket(row){
  proxy.$router.push({
    path: '/SpecialOperation/earthticket',
    query:{
      id:row.id,
      workState:row.workState
    }
  })
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
  title.value = "添加动土作业";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getEarth(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改动土作业";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["earthRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateEarth(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEarth(form.value).then(response => {
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
    return delEarth(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/earth/export', {
    ...queryParams.value
  }, `earth_${new Date().getTime()}.xlsx`)
}

userId.value = store.getters.user.userId
getList();
</script>
