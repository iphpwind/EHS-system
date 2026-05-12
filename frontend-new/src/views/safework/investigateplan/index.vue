<template>
  <div class="plan">
		<div class="table">
		  <div class="header">
		    <el-row>
		      <el-col :span="12"><div class="card-tit">隐患排查计划</div></el-col>
<!--		      <el-col :span="12">
						<el-button class="toolbtn" @click="goback">
						  <el-icon><Back /></el-icon> 返回
						</el-button>
					</el-col>-->
		    </el-row>
			</div>

			<div class="form">
				<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
					<el-form-item label="所属部门" prop="deptId">
						<tree-select
								v-model:value="queryParams.deptId"
								:options="deptOptions"
								placeholder="请选择所属部门"
								:objMap="{ value: 'id', label: 'label', children: 'children' }"
						/>
					</el-form-item>
					<el-form-item label="计划编码" prop="planNumber">
						<el-input
							v-model="queryParams.planNumber"
							placeholder="请输入计划编码"
							clearable
							@keyup.enter="handleQuery"
						/>
					</el-form-item>
					<el-form-item label="计划名称" prop="planName">
						<el-input
							v-model="queryParams.planName"
							placeholder="请输入计划名称"
							clearable
							@keyup.enter="handleQuery"
						/>
					</el-form-item>
          <el-form-item label="排查周期" prop="investigateCycle">
            <el-input
                v-model="queryParams.investigateCycle"
                placeholder="请输入排查周期"
                clearable
                @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="排查周期单位" prop="cycleUnit">
            <el-select v-model="queryParams.cycleUnit" placeholder="请输入排查周期单位">
              <el-option label="小时" value="小时" />
              <el-option label="天" value="天" />
              <el-option label="月" value="月" />
              <el-option label="年" value="年" />
            </el-select>
          </el-form-item>
          <el-form-item label="排查类型" prop="investigateTypeId">
            <el-select v-model="queryParams.investigateTypeId" placeholder="请选择" clearable filterable>
              <el-option
                  v-for="item in investigates"
                  :key="item.id"
                  :label="item.investigateName"
                  :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="delFlag">
            <el-select v-model="queryParams.delFlag" placeholder="状态">
              <el-option label="正常" value="0" />
              <el-option label="停用" value="1" />
            </el-select>
          </el-form-item>
					<el-form-item>
						<el-button type="primary" class="search"  icon="Search" @click="handleQuery">搜索</el-button>
						<el-button icon="Refresh" class="reset" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
		</div>
    <el-row :gutter="10" class="toolist">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['safework:investigateplan:add']"
        >新增</el-button>
      </el-col>
<!--      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:investigateplan:export']"
        >导出</el-button>
      </el-col>-->
      <!-- <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>

    <el-table border v-loading="loading"
		height="calc(100% - 230px)"
		:data="investigateplanList" @selection-change="handleSelectionChange">
      <el-table-column label="所属部门" width="110" align="center" prop="deptName" />
      <el-table-column label="计划编码" width="150" align="center" prop="planNumber" />
      <el-table-column label="计划名称" width="200" align="center" prop="planName" />
      <el-table-column label="类型" width="100" align="center" prop="investigateName" />
      <el-table-column label="排查周期" align="center" prop="investigateCycle" width="90" />
      <el-table-column label="排查周期单位" align="center" prop="cycleUnit" width="110" />
      <el-table-column label="当月任务数" align="center" prop="taskNum" width="100" />
      <el-table-column label="当月已执行数" align="center" prop="excuteTaskNum" width="110" />
      <el-table-column label="上次排查异常数" align="center" prop="errNum" width="120" />
      <el-table-column label="当月超期任务数" align="center" prop="noexcuteNum" width="120" />
      <el-table-column label="状态" align="center" prop="startDate" width="70">
        <template #default="scope">
          <el-row justify="center" v-if="scope.row.delFlag == 0"><el-tag type="success">正常</el-tag></el-row>
          <el-row justify="center" v-else><el-tag type="danger">停用</el-tag></el-row>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="350">
        <template #default="scope">
          <el-button style="color: #09bec5;"
            type="text"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:investigateplan:edit']"
          >修改</el-button>
          <el-button style="color: #09bec5;"
              type="text"
              @click="handleTask(scope.row)"
          >生成任务</el-button>
          <el-button style="color: #09bec5;"
                     type="text"
                     @click="gotoTask(scope.row)"
          >排查任务</el-button>
          <el-button style="color: #09bec5;"
                     type="text"
                     @click="gotoHistroy(scope.row)"
          >历史</el-button>
          <el-button style="color: #09bec5;"
                     type="text"
                     @click="gotoContent(scope.row)"
          >排查内容</el-button>
          <el-button v-if="scope.row.delFlag==0" style="color: #09bec5;"
                     type="text"
                     @click="handlesta(scope.row)"
          >停用</el-button>
          <el-button v-if="scope.row.delFlag==1" style="color: #09bec5;"
                     type="text"
                     @click="handlesta(scope.row)"
          >启用</el-button>
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
  </div>
    <!-- 添加或修改隐患排查计划对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="investigateplanRef" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="所属部门" prop="deptId">
          <tree-select
              v-model:value="form.deptId"
              :options="deptOptions"
              placeholder="请选择所属部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
          />
        </el-form-item>
        <el-form-item label="排查计划编码" prop="planNumber">
          <el-col :span="9">
            <el-input v-model="form.planNumber" placeholder="请输入计划编码" v-if="form.id!=null && form.id!=''" readonly/>
            <el-input v-model="form.planNumber" placeholder="请输入计划编码" v-if="form.id==null || form.id==''" />
          </el-col>
        </el-form-item>
        <el-form-item label="排查计划名称" prop="planName">
          <el-col :span="9">
            <el-input v-model="form.planName" placeholder="请输入计划名称" />
          </el-col>
        </el-form-item>
        <el-form-item label="任务类型" prop="taskType">
          <el-select v-model="form.taskType" placeholder="请选择" clearable filterable>
            <el-option label="日常任务" value="0" />
            <el-option label="主要负责人任务" value="1" />
            <el-option label="技术负责人任务" value="2" />
            <el-option label="操作负责人任务" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="包保任务对应项" prop="taskTerm" v-if="form.taskType!=0">
          <span>{{form.taskTermNames}}</span>
          <el-button type="primary" style="margin-left: 10px;" @click="selectTerm">选择对应项</el-button>
        </el-form-item>
        <el-form-item label="排查类型" prop="investigateTypeId">
          <el-select v-model="form.investigateTypeId" placeholder="请选择" clearable filterable>
            <el-option
                v-for="item in investigates"
                :key="item.id"
                :label="item.investigateName"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排查周期" prop="investigateCycle">
          <el-col :span="9">
            <el-input type="number" :controls="false" :min="1" v-model="form.investigateCycle" placeholder="请输入排查周期" />
          </el-col>
        </el-form-item>
        <el-form-item label="排查周期单位" prop="cycleUnit">
          <el-select v-model="form.cycleUnit" placeholder="请输入排查周期单位">
            <el-option label="小时" value="小时" />
            <el-option label="天" value="天" />
            <el-option label="月" value="月" />
            <el-option label="年" value="年" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否临时" prop="isTem">
          <el-radio-group v-model="form.isTem">
            <el-radio label="0">是</el-radio>
            <el-radio label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker clearable
            v-model="form.startDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate" v-if="form.isTem=='0'">
          <el-date-picker clearable
                          v-model="form.endDate"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="工作日历" prop="workCalendar">
          <el-radio-group v-model="form.workCalendar">
            <el-radio label="每天">每天</el-radio>
            <el-radio label="工作日">工作日</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="支持提前排查" prop="advance">
          <el-col :span="9">
            <el-input type="number" v-model="form.advance" min="0" max="30"/>
          </el-col>
          <span>天的任务</span>
        </el-form-item>
        <el-form-item label="支持延后排查" prop="delay">
          <el-col :span="9">
            <el-input v-model="form.delay" type="number" min="0" max="30"/>
          </el-col>
          <span>天的任务</span>
        </el-form-item>
        <el-form-item label="排查规则" prop="investigateRule">
          <el-radio-group v-model="form.investigateRule">
            <el-radio label="任一">任一</el-radio>
            <el-radio label="综合排查">综合排查</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="责任人" prop="userNames">
          <span>{{form.userNames}}</span>
          <el-button type="primary" style="margin-left: 10px;" @click="selectUser">选择责任人</el-button>
        </el-form-item>
<!--        <el-form-item label="是否强制启用二维码" prop="isEWM">-->
<!--          <el-radio-group v-model="form.isEWM">-->
<!--            <el-radio label="0">否</el-radio>-->
<!--            <el-radio label="1">是</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
        <el-form-item label="是否启用NFC" prop="isNFC">
          <el-radio-group v-model="form.isNFC">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="NFC编码" prop="nfcNumber" v-if="form.isNFC == 1">
          <el-col :span="9">
            <el-input v-model="form.nfcNumber" placeholder="请输入NFC编码" />
          </el-col>
<!--          <el-radio-group v-model="form.nfcNumber">-->
<!--            <el-radio label="0">否</el-radio>-->
<!--            <el-radio label="1">是</el-radio>-->
<!--          </el-radio-group>-->
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.delFlag">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
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
    <!-- 详情页面  -->
    <el-dialog :title="title" v-model="openinfo" width="800px" append-to-body>
      <el-form ref="investigateplanRef" :model="formInfo" :rules="rules" label-width="150px">
        <el-form-item label="所属部门" prop="deptId">
          <tree-select
              v-model:value="formInfo.deptId"
              :options="deptOptions"
              :disabled="ifdis"
              placeholder="请选择所属部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
          />
        </el-form-item>
        <el-form-item label="排查计划编码" prop="planNumber">
          <el-col :span="9">
            <el-input v-model="formInfo.planNumber" placeholder="请输入计划编码" disabled/>
          </el-col>
        </el-form-item>
        <el-form-item label="排查计划名称" prop="planName">
          <el-col :span="9">
            <el-input v-model="formInfo.planName" placeholder="请输入计划名称" disabled/>
          </el-col>
        </el-form-item>
        <el-form-item label="任务类型" prop="investigateTypeId">
          <el-select v-model="formInfo.taskType" placeholder="请选择" clearable filterable disabled>
            <el-option label="日常任务" value="0" />
            <el-option label="主要负责人任务" value="1" />
            <el-option label="技术负责人任务" value="2" />
            <el-option label="操作负责人任务" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="排查类型" prop="investigateTypeId">
          <el-select v-model="formInfo.investigateTypeId" placeholder="请选择" clearable filterable disabled>
            <el-option
                v-for="item in investigates"
                :key="item.id"
                :label="item.investigateName"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排查周期" prop="investigateCycle">
          <el-col :span="9">
            <el-input type="number" v-model="formInfo.investigateCycle" placeholder="请输入排查周期"  disabled/>
          </el-col>
        </el-form-item>
        <el-form-item label="排查周期单位" prop="cycleUnit">
          <el-select v-model="formInfo.cycleUnit" placeholder="请输入排查周期单位" disabled>
            <el-option label="时" value="时" />
            <el-option label="天" value="天" />
            <el-option label="月" value="月" />
            <el-option label="年" value="年" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker clearable
                          disabled
                          v-model="formInfo.startDate"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="工作日历" prop="workCalendar">
          <el-radio-group v-model="formInfo.workCalendar" disabled>
            <el-radio label="每天">每天</el-radio>
            <el-radio label="工作日">工作日</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="支持提前排查" prop="advance">
          <el-col :span="9">
            <el-input type="number" v-model="formInfo.advance" disabled/>
          </el-col>
          <span>天的任务</span>
        </el-form-item>
        <el-form-item label="支持延后排查" prop="delay">
          <el-col :span="9">
            <el-input v-model="formInfo.delay" disabled/>
          </el-col>
          <span>天的任务</span>
        </el-form-item>
        <el-form-item label="排查规则" prop="investigateRule">
          <el-radio-group v-model="formInfo.investigateRule" disabled>
            <el-radio label="任一">任一</el-radio>
            <el-radio label="综合排查">综合排查</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="责任人" prop="userNames">
          <span>{{formInfo.userNames}}</span>
<!--          <el-button type="primary" style="margin-left: 10px;" @click="selectUser">选择责任人</el-button>-->
        </el-form-item>
        <el-form-item label="NFC编码" prop="nfcNumber" v-if="false">
          <el-radio-group v-model="formInfo.nfcNumber" disabled>
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formInfo.delFlag" disabled>
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="createTask">生成排查任务</el-button>
          <el-button @click="cancelinfo">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 选择责任人员 -->
    <el-dialog title="选择责任人" v-model="visible" width="800px" top="5vh" append-to-body>
      <el-row>
        <el-table @row-click="clickRow" ref="table" :data="userOptions" @selection-change="handleSelectionChange2"
                  height="260px">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="userId" label="人员编号" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="nickName" label="人员名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="dept.deptName" label="部门" :show-overflow-tooltip="true"></el-table-column>
        </el-table>
      </el-row>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleUserIds">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 选择包保任务对应项 -->
    <el-dialog title="选择包保任务对应项" v-model="termopen" width="800px" top="5vh" append-to-body>
      <el-row>
        <el-table ref="table1" :data="termOptions" @current-change="handleSelectionChange3"
                  height="360px" highlight-current-row>
          <el-table-column prop="termContent" label="对应项" :show-overflow-tooltip="true"></el-table-column>
        </el-table>
      </el-row>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleTerms">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Investigateplan">
import { listInvestigateplan, getInvestigateplan, delInvestigateplan, addInvestigateplan, updateInvestigateplan, createTaskByPlan, updateSta } from "@/api/safework/investigateplan";
import {treeselect} from "@/api/system/dept";
import { listInvestigate } from "@/api/safework/investigate";
import { listUser } from "@/api/system/user";
import { listContent} from "@/api/safework/content";
import { listTask} from "@/api/safework/task";
import { listInsurancedic } from "@/api/safework/insurancedic";

const { proxy } = getCurrentInstance();

const investigateplanList = ref([]);
const open = ref(false);
const openinfo = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const deptOptions = ref(undefined);
const userOptions = ref([]);
const termOptions = ref([]);
const investigates = ref(undefined);
const visible = ref(false);
const termopen = ref(false);
const tables = ref([]);
const currentRow = ref([]);
const tableNames = ref([]);
const ifdis = ref(true);

const data = reactive({
  form: {},
  formInfo: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    enterpriseCode: null,
    deptId: null,
    planNumber: null,
    planName: null,
    investigateTypeId: null,
    investigateCycle: null,
    cycleUnit: null,
    startDate: null,
    workCalendar: null,
    advance: null,
    delay: null,
    investigateRule: null,
    userId: null,
    nfcNumber: null,
    delFlag:'0'
  },
  rules: {
    planNumber: [
      { required: true, message: '请填写计划编码', trigger: 'blur' }
    ],
    deptId: [
      { required: true, message: '请选择所属部门', trigger: 'change' }
    ],
    planName: [
      { required: true, message: '请填写计划名称', trigger: 'blur' }
    ],
    taskType: [
      { required: true, message: '请选择任务类型', trigger: 'blur' }
    ],
    taskTerm: [
      { required: true, message: '请选择包保任务对应项', trigger: 'blur' }
    ],
    userNames: [
      { required: true, message: '请选择责任人', trigger: 'blur' }
    ],
    investigateRule: [
      { required: true, message: '请选择排查规则', trigger: 'blur' }
    ],
    workCalendar: [
      { required: true, message: '请选择工作日历', trigger: 'blur' }
    ],
    investigateTypeId: [
      { required: true, message: '请选择排查类型', trigger: 'change' }
    ],
    investigateCycle: [
      { required: true, message: '请填写排查周期', trigger: 'blur' }
    ],
    cycleUnit: [
      { required: true, message: '请选择排查周期单位', trigger: 'change' }
    ],
    startDate: [
      { required: true, message: '请填写开始日期', trigger: 'blur' }
    ],
    endDate: [
      { required: true, message: '请填写结束日期', trigger: 'blur' }
    ],
    userId: [
      { required: true, message: '请选择责任人', trigger: 'blur' }
    ],
    nfcNumber: [
      { required: true, message: '请输入NFC编码', trigger: 'blur' }
    ],
    delay: [
      { required: true, message: '请输入延后0-30天数', trigger: 'blur' ,pattern:/^(?:[0-9]|[1-2][0-9]|30)$/}
    ],
    advance: [
      { required: true, message: '请输入提前0-30天数', trigger: 'blur' ,pattern:/^(?:[0-9]|[1-2][0-9]|30)$/}
    ]
  }
});

const { queryParams, form, rules, formInfo } = toRefs(data);


const regex = /^[0-9]+$/;
function isNumInRange(num) {
  // 检查是否为数字
  if (!regex.test(num)) {
    return false;
  }
  // 检查是否在范围内
  const value = parseInt(num, 10);
  return value > 0 && value < 30;
}

/** 单击选择行 */
function clickRow(row) {
  proxy.$refs.table.toggleRowSelection(row);
}

/** 多选框选中数据 */
function handleSelectionChange2(selection) {
  tables.value = selection.map(item => item.userId);
  tableNames.value = selection.map(item => item.nickName);
}

function handleSelectionChange3(val) {
  currentRow.value = val;
  console.log(currentRow.value);
}

function handleTerms(){
  form.value.taskTermNames = currentRow.value.termContent;
  form.value.taskTerm = currentRow.value.id;
  termopen.value = false;
}

/** 选择巡检人员确定按钮操作 */
function handleUserIds() {
  const userIds = tables.value.join(",");
  const userNames = tableNames.value.join(",");
  if (userIds == "") {
    proxy.$modal.msgError("请选择巡检人员");
    return;
  }
  form.value.userId = userIds;
  form.value.userNames = userNames;
  visible.value = false;
}

/** 查询部门下拉树结构 */
function getTreeselect() {
  treeselect().then(response => {
    deptOptions.value = response.data;
  });
};

/** 查询责任人列表 **/
function getUserList(){
  listUser().then(response => {
    userOptions.value = response.rows;
  });
}

function getInsureDicList() {
  listInsurancedic({userType:form.value.taskType}).then(response => {
    termOptions.value = response.rows;
  });
}


/** 选择责任人按钮 **/
function selectUser(){
  visible.value = true;

  if(form.value.userId != null && form.value.userId != ""){
    const userIds = form.value.userId.split(",");

    proxy.$nextTick(() => {
      userOptions.value.forEach((user) => {
        userIds.forEach(userId => {
          if(Number(userId) == user.userId){
            proxy.$refs.table.toggleRowSelection(user,true);
          }
        })
      });
    })
  }
}
function selectTerm(){
  getInsureDicList();
  termopen.value = true;
}

/** 查询隐患排查类型字典列表 */
function getListInvestigate() {
  listInvestigate({delFlag:0}).then(response => {
    investigates.value = response.rows;
  });
}

/** 查询隐患排查计划列表 */
function getList() {
  loading.value = true;
  listInvestigateplan(queryParams.value).then(response => {
    if(response.total>0){
      for(let row of response.rows){
        if(row.userIds != null && row.userIds != ""){
          row.userIdArray = row.userId.split(",");
        }
      }
    }
    investigateplanList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

//生成任务
function createTask(){
  //查询是否有排查内容
  listContent({planId:formInfo.value.id}).then(response => {
    if(response.rows.length>0){
      //查询开始日期到今天是否有已经执行的任务（包含今天）
      listTask({planId:formInfo.value.id,delFlag:'0',status:'1',beginDate:formInfo.value.startDate,endDate:getNowTime()}).then(res => {
        if(res.total>0){
          proxy.$modal.msgWarning("开始日期到今天有已经执行的任务，请先修改开始日期");
        }else{
          openinfo.value = false;
          createTaskByPlan(formInfo.value.id).then(response => {
            proxy.$modal.msgSuccess("生成成功");
          });
        }
      });
    }else{
      proxy.$modal.msgWarning("该计划没有排查内容，不能生成排查任务");
    }
  });
}

//获取当前时间
function getNowTime(){
  let timetwo = new Date();
  let yy = timetwo.getFullYear();
  let mm = timetwo.getMonth()+1;
  let dd = timetwo.getDate()<10 ? '0'+timetwo.getDate() : timetwo.getDate();
  return yy+'-'+mm+'-'+dd;
}

// 取消按钮
function cancelinfo() {
  openinfo.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    enterpriseCode: null,
    deptId: null,
    planNumber: null,
    planName: null,
    investigateTypeId: null,
    investigateCycle: null,
    cycleUnit: null,
    startDate: null,
    workCalendar: null,
    advance: null,
    delay: null,
    investigateRule: null,
    userId: null,
    nfcNumber: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("investigateplanRef");
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
  form.value.delFlag='0'
  form.value.cycleUnit='天'
  form.value.workCalendar='0'
  form.value.investigateRule='0'
  form.value.taskType = '0'
  form.value.advance=0
  form.value.delay=0
  form.value.isTem='1'
  open.value = true;
  title.value = "添加隐患排查计划";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getInvestigateplan(id).then(response => {
    if(response.data.userId != ""){
      response.data.userIdArray = response.data.userId.split(",");
      var userNames = [];
      for(let id of response.data.userIdArray){
        for(let user of userOptions.value){
          if(Number(id) == user.userId){
            userNames.push(user.nickName);
          }
        }
      }
      response.data.userNames = userNames.join(',');
    }
    response.data.taskType = response.data.taskType.toString()
    //response.data.deptId = parseInt(response.data.deptId)

    form.value = response.data;
    open.value = true;
    title.value = "修改隐患排查计划";
  });
}

//生成任务--计划详情页
function handleTask(row){
  reset();
  const id = row.id || ids.value
  getInvestigateplan(id).then(response => {
    if(response.data.userId != ""){
      response.data.userIdArray = response.data.userId.split(",");
      var userNames = [];
      for(let id of response.data.userIdArray){
        for(let user of userOptions.value){
          if(Number(id) == user.userId){
            userNames.push(user.nickName);
          }
        }
      }
      response.data.userNames = userNames.join(',');
    }
    formInfo.value = response.data;
    openinfo.value = true;
    title.value = "发布排查计划";
  });
}

function gotoContent(row) {
  console.log(row)
  proxy.$router.push({
    path: '/safework/content',
    query:{
      planId:row.id,
      planName:row.planName
    }
  })
}
function gotoTask(row) {
  proxy.$router.push({
    path: '/safework/task',
    query:{
      planId:row.id,
      planName:row.planName
    }
  })
}
//排查历史
function gotoHistroy(row){
  proxy.$router.push({
    path: '/safework/historytask',
    query:{
      planId:row.id,
      planName:row.planName
    }
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["investigateplanRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateInvestigateplan(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addInvestigateplan(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
/*
function handleDelete(row) {
  const idss = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除隐患排查计划编号为"' + idss + '"的数据项？').then(function() {
    return delInvestigateplan(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}
*/

/** 更新状态按钮操作 */
function handlesta(row) {
  let  msg = '';
  let delFlag = '';
  if(row.delFlag==1){//原来是停用现在启用
    msg = '是否确认启用隐患排查计划编号为';
    delFlag = 0;
  }else{//原来是启用现在停用
    msg = '是否确认停用隐患排查计划编号为';
    delFlag = 1;
  }
  proxy.$modal.confirm('"'+msg + row.id + '"的数据项？').then(function() {
    return updateSta({id:row.id,delFlag:delFlag});
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("更新成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/investigateplan/export', {
    ...queryParams.value
  }, `investigateplan_${new Date().getTime()}.xlsx`)
}

getUserList();
getListInvestigate();
getTreeselect();
getList();
</script>
<style scoped lang="scss">
	.plan{
		padding: 10px;background: #f3f3f4;
		height: calc(100vh - 84px);

		.table{
		  padding: 10px;border: 1px solid #eee;background: #fff;
		  box-shadow: 0 0 5px #eee;border-radius: 5px;
		  height: 100%;position: relative;
		  .header{
		    margin: 0 0 10px;
		    padding: 10px 15px;
		    border-bottom: 1px solid #f0f0f0;
		    .card-tit {
		      padding-left: 10px;
		      border-left: 5px solid #09bec5;
		      font-size: 18px;
		    }
				.toolbtn{
				  float: right;border: 0;color: #fff;
					border-radius: 20px;
					height: auto;padding: 5px 15px;
					background-image:linear-gradient(to right, #38dfd8, #1dc2bc);
				}
		  }

			.form{
				:deep(.el-form-item) {
					margin: 0 15px 10px 0;
					.el-form-item__label{
						white-space: nowrap;
					}
				}
				.search{
					background: #09bec5;border-color: #09bec5;
					padding: 0 10px;
				}
				.reset{
					color: #09bec5;border-color: #09bec5;
					padding: 0 10px;
				}
			}
			.toolist{
				margin: 0 0 10px;display: block;
				:deep(.el-col) {

				}
			}
			.toolist:before,.toolist::after{
				content: '';clear: both;display: table;
			}
			.pagination-container{
				margin: 0;position:relative;
			}
			:deep(.el-pagination.is-background .el-pager li:not(.disabled).active) {
				background: #09bec5;
			}
		  .btn{
		    height: auto;border: 0;padding: 0;color: #09bec5;
		  }
		  .btn.green{
		    color: #46ba7f;
		  }

		  :deep(.el-table) {

		    .el-table__header-wrapper th{
		      text-align: center;background: #09bec5 !important;color: #fff;border: 0;
		    }
		    .sort-caret.ascending{
		      border-bottom-color: #fff !important;
		    }
		    .sort-caret.descending{
		      border-top-color: #fff !important;
		    }
		    td.el-table__cell{text-align: center;border-color: #d2eef1;}
		    .el-table__inner-wrapper::before{
		      display: none;
		    }
		    .el-table__row--striped td.el-table__cell{
		      background: #f6fcfc !important;
		    }
		    .el-table__row:hover  td.el-table__cell{
		      background: #f6fcfc !important;
		    }
		  }
		  :deep(.el-table--border::after) {
		    display: none;
		  }
		  :deep(.el-table--border::before) {
		    display: none;
		  }
		  .pages{
		    position: absolute;padding-right: 70px;
		    right: 20px;bottom: 10px;
		    :deep(.el-pagination) {
		      padding: 0;
		      .el-pager li{
		        outline: none;background: transparent;border: 1px solid #ddd;
		      }
		      .el-pager li.active{
		        background: #09bec5;border-color: #09bec5;font-weight: normal;
		      }
		    }
		    .pagebtn{
		      position: absolute;right: 0;top: 0;
		    }
		  }
		  .toolbtn{
		    float: right;border: 0;color: #333333;
		  }
		}
	}
	</style>
