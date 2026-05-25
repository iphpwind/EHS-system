<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="110px">
      <el-form-item label="作业计划编号" prop="planCode">
        <el-input
          v-model="queryParams.planCode"
          placeholder="请输入作业计划编号"
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
          v-hasPermi="['safework:operationPlan:add']"
        >新增</el-button>
      </el-col>
<!--      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:operationPlan:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:operationPlan:remove']"
        >删除</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:operationPlan:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 300px)" v-loading="loading" :data="operationPlanList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="所属企业" align="center" prop="deptName" />
      <el-table-column label="作业计划编号" align="center" prop="planCode" />
      <el-table-column label="作业区域" align="center" prop="objectName" />
      <el-table-column label="作业地点" align="center" prop="operationSite" />
      <el-table-column label="作业类型" align="center" prop="operationTypes">
        <template #default="scope">
          <dict-tag :options="safe_operation_type" :value="scope.row.operationTypes ? scope.row.operationTypes.split(',') : []"/>
        </template>
      </el-table-column>
      <el-table-column label="计划开始时间" align="center" prop="startDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划结束时间" align="center" prop="endDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属部门" align="center" prop="responsibleDeptName" />
      <el-table-column label="作业单位" align="center" prop="companyName" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="作业状态" align="center" prop="workStatus">
        <template #default="scope">
          <el-row justify="center" v-if="scope.row.workStatus == 0">提交待审核</el-row>
          <el-row justify="center" v-if="scope.row.workStatus == 1">审核通过</el-row>
          <el-row justify="center" v-if="scope.row.workStatus == 2">审核不通过</el-row>
        </template>
      </el-table-column>
      <el-table-column label="审核备注" align="center" prop="reason" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            v-if="scope.row.workStatus=='2'"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:operationPlan:edit']"
          >修改</el-button>
          <el-button
              type="text"
                @click="handleInfo(scope.row)"
          >详情</el-button>
          <el-button
            type="text"
            icon="Delete"
            v-if="scope.row.workStatus=='2'"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:operationPlan:remove']"
          >删除</el-button>
          <el-button
              type="text"
              v-if="scope.row.workStatus=='0' && parseInt(userId)==parseInt(scope.row.workUser)"
              @click="handleCheck(scope.row)"
          >审核</el-button>
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

    <!-- 添加或修改作业计划对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="operationPlanRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="作业计划编号" prop="planCode" v-if="false">
          <el-input v-model="form.planCode" disabled/>
        </el-form-item>
        <el-form-item label="作业内容" prop="operationContent">
          <el-input v-model="form.operationContent" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="作业区域" prop="safeObjectIdsArray">
          <el-select v-model="form.safeObjectIdsArray" placeholder="请选择作业类型" multiple @change="getUnitListyObjecIds">
            <el-option
              v-for="item in objectList"
              :key="item.id"
              :label="item.name"
							:value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="风险点" prop="safeUnitId">
          <el-select v-model="form.safeUnitId" placeholder="请选择风险点">
            <el-option
              v-for="item in unitList"
              :key="item.id"
              :label="item.name"
							:value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作业地点" prop="operationSite">
          <el-input v-model="form.operationSite" placeholder="请输入作业地点" />
        </el-form-item>
        <el-form-item label="作业类型">
          <el-checkbox-group v-model="form.operationTypes">
            <el-checkbox
              v-for="dict in safe_operation_type"
              :key="dict.value"
              :label="dict.value">
              {{dict.label}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="作业方案" prop="proName">
          <el-input v-model="form.proName" placeholder="请选择方案" readonly @click="getProList"/>
        </el-form-item>
        <el-form-item label="计划开始时间" prop="startDate">
          <el-date-picker clearable
            v-model="form.startDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择计划开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="计划结束时间" prop="endDate">
          <el-date-picker clearable
            v-model="form.endDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择计划结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所属部门" prop="responsibleDeptId">
					<el-select  v-model="form.responsibleDeptId">
						<el-option
            v-for="dept in deptList"
            :key="dept.deptId"
            :label="dept.deptName"
            :value="dept.deptId">
						</el-option>
					</el-select>
        </el-form-item>
        <el-form-item label="所属部门负责人" prop="responsibleUserId">
					<el-select  v-model="form.responsibleUserId">
						<el-option
            v-for="user in userList"
            :key="user.userId"
            :label="user.nickName"
            :value="user.userId">
						</el-option>
					</el-select>
        </el-form-item>
        <el-form-item label="作业单位" prop="companyId">
					<el-cascader
						v-model="form.companyId"
						:options="companyDeptList"
						@change="handleChangeCompany()">
					</el-cascader>
        </el-form-item>
        <el-form-item label="作业单位负责人" prop="companyUserId">
					<el-select  v-model="form.companyUserId">
						<el-option
            v-for="user in companyUserList"
            :key="user.value"
            :label="user.label"
            :value="user.value">
						</el-option>
					</el-select>
        </el-form-item>
        <el-form-item label="作业审核人" prop="workUser">
          <el-select  v-model="form.workUser">
            <el-option
                v-for="item in userOptions"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="附件">
					<FileUpload v-model.value="form.enclosure" limit="5"/>
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
          <el-button type="primary" @click="submitForm">保存并提交审核</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog title="详情" v-model="infoopen" width="800px" append-to-body>
      <el-form ref="operationPlanRef1" :model="form" :rules="rules" label-width="120px" disabled>
        <el-form-item label="作业计划编号" prop="planCode" v-if="false">
          <el-input v-model="form.planCode" disabled/>
        </el-form-item>
        <el-form-item label="作业内容" prop="operationContent">
          <el-input v-model="form.operationContent" type="textarea" />
        </el-form-item>
        <el-form-item label="作业区域" prop="safeObjectIdsArray">
          <el-select v-model="form.safeObjectIdsArray" placeholder="请选择作业类型" multiple>
            <el-option
                v-for="item in objectList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="风险点" prop="safeUnitId">
          <el-select v-model="form.safeUnitId" >
            <el-option
                v-for="item in unitList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作业地点" prop="operationSite">
          <el-input v-model="form.operationSite" />
        </el-form-item>
        <el-form-item label="作业类型">
          <el-checkbox-group v-model="form.operationTypes">
            <el-checkbox
                v-for="dict in safe_operation_type"
                :key="dict.value"
                :label="dict.value">
              {{dict.label}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="作业方案" prop="proName">
          <el-input v-model="form.proName" placeholder="请选择方案" readonly @click="getProList"/>
        </el-form-item>
        <el-form-item label="计划开始时间" prop="startDate">
          <el-date-picker clearable
                          v-model="form.startDate"
                          type="datetime"
                          value-format="YYYY-MM-DD HH:mm:ss"
                          placeholder="请选择计划开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="计划结束时间" prop="endDate">
          <el-date-picker clearable
                          v-model="form.endDate"
                          type="datetime"
                          value-format="YYYY-MM-DD HH:mm:ss"
                          placeholder="请选择计划结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所属部门" prop="responsibleDeptId">
          <el-select  v-model="form.responsibleDeptId">
            <el-option
                v-for="dept in deptList"
                :key="dept.deptId"
                :label="dept.deptName"
                :value="dept.deptId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门负责人" prop="responsibleUserId">
          <el-select  v-model="form.responsibleUserId">
            <el-option
                v-for="user in userList"
                :key="user.userId"
                :label="user.nickName"
                :value="user.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作业单位" prop="companyId">
          <el-cascader
              v-model="form.companyId"
              :options="companyDeptList"
              @change="handleChangeCompany()">
          </el-cascader>
        </el-form-item>
        <el-form-item label="作业单位负责人" prop="companyUserId">
          <el-select  v-model="form.companyUserId">
            <el-option
                v-for="user in companyUserList"
                :key="user.value"
                :label="user.label"
                :value="user.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作业审核人" prop="workUser">
          <el-select  v-model="form.workUser">
            <el-option
                v-for="item in userOptions"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="附件">
          <FileUpload v-model.value="form.enclosure" limit="5"/>
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
    </el-dialog>


    <el-dialog title="审核页面" v-model="checkopen" width="400px" append-to-body>
      <el-form ref="checkRef" :model="checkform" label-width="120px">
        <el-form-item label="id" prop="id" v-if="false">
          <el-input v-model="checkform.id"/>
        </el-form-item>
        <el-form-item label="审核结果">
          <el-radio-group v-model="checkform.workStatus">
            <el-radio key="1" label="1">是</el-radio>
            <el-radio key="2" label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注" prop="reason">
          <el-input v-model="checkform.reason" type="textarea"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="upForm">提交</el-button>
        </div>
      </template>
    </el-dialog>
    <!--作业方案列表 -->
    <el-dialog title="作业方案" v-model="pro.open" width="50%" append-to-body>
      <el-form :model="queryParam1s" ref="queryRef1" :inline="true" label-width="70px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="方案编码" prop="num">
              <el-input
                  v-model="queryParam1s.num"
                  placeholder="请输入方案编码"
                  clearable
                  @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="方案名称" prop="name">
              <el-input
                  v-model="queryParam1s.name"
                  placeholder="请输入方案名称"
                  clearable
                  @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" icon="Search" @click="handleQuery1">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table v-loading="loading" :data="operationproList" @row-click="closeDetail">
        <el-table-column label="所属部门" align="center" prop="deptName" />
        <el-table-column label="方案编码" align="center" prop="num" />
        <el-table-column label="方案名称" align="center" prop="name" />
        <el-table-column label="状态" align="center" prop="status" >
          <template #default="scope">
            <dict-tag :options="status" :value="scope.row.status"/>
          </template>
        </el-table-column>
      </el-table>
      <pagination
          v-show="total1 > 0"
          :total="total1"
          v-model:page="queryParam1s.pageNum"
          v-model:limit="queryParam1s.pageSize"
          @pagination="getProinfoList"
          style="position: relative;"
      />
    </el-dialog>
  </div>
</template>

<script setup name="OperationPlan">
import { listOperationPlan, getOperationPlan, delOperationPlan, addOperationPlan, updateOperationPlan } from "@/api/safework/operationPlan";
import { listObject } from "@/api/safework/object";
import { listUnit, listByObjecIds } from "@/api/safework/unit";
import { listDept } from '@/api/system/dept'
import { listUser,getUserList } from '@/api/system/user'
import { listContractor } from "@/api/contractorManage/contractor";
import { listPersonnel } from "@/api/contractorManage/personnel";
import {h} from "vue";
import {listOperationpro} from "@/api/safework/operationpro";

const userStore = useUserStore()
const { proxy } = getCurrentInstance();
const { status, safe_operation_type } = proxy.useDict('status', 'safe_operation_type');

const operationPlanList = ref([]);
const objectList = ref([]);
const unitList = ref([]);
const deptList = ref([]);
const userList = ref([]);
const userOptions = ref([]);
const companyDeptList = ref([]);
const companyUserList = ref([]);
const operationproList = ref([]);
const open = ref(false);
const infoopen = ref(false);
const checkopen = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const total1 = ref(0);
const title = ref("");
const userId = ref("");
const companyTypeId = ref("");
const pro = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0
});

const data = reactive({
  form: {},
  checkform:{
    workStatus:'',
    reason:''
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    planCode: null,
    safeObjectIds: null,
    status: "0",
    delFlag: "0",
  },
  queryParam1s: {
    pageNum: 1,
    pageSize: 10,
    delFlag:'0',
  },
  rules: {
    operationContent: [
      { required: true, message: "作业内容不能为空", trigger: "blur" }
    ],
    safeObjectIdsArray: [
      { required: true, message: "作业区域不能为空", trigger: "blur" }
    ],
    operationSite: [
      { required: true, message: "作业地点不能为空", trigger: "blur" }
    ],
    operationTypes: [
      { required: true, message: "作业类型不能为空", trigger: "blur" }
    ],
    startDate: [
      { required: true, message: "计划开始时间不能为空", trigger: "blur" }
    ],
    endDate: [
      { required: true, message: "计划结束时间不能为空", trigger: "blur" }
    ],
    responsibleDeptId: [
      { required: true, message: "所属部门不能为空", trigger: "change" }
    ],
    responsibleUserId: [
      { required: true, message: "所属部门负责人不能为空", trigger: "change" }
    ],
    companyId: [
      { required: true, message: "作业单位不能为空", trigger: "change" }
    ],
    companyUserId: [
      { required: true, message: "作业单位负责人不能为空", trigger: "change" }
    ],
    status: [
      { required: true, message: "状态不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams,queryParam1s, form, rules ,checkform} = toRefs(data);


/** 人员信息搜索按钮操作 */
function handleQuery1() {
  queryParam1s.value.pageNum = 1;
  getProinfoList();
}

//获取作业方案
function getProList(){
  getProinfoList();
  pro.open = true;
}

function closeDetail(row){
  form.value.proId=row.id;
  form.value.proName=row.name;
  pro.open = false;
}

function getProinfoList(){
  listOperationpro(queryParam1s.value).then(response => {
    operationproList.value = response.rows;
    total1.value = response.total;
  });
}


function getObjectList() {
	listObject({delFlag:"0"}).then(response => {
    objectList.value = response.rows;
  });
}

function getUnitList() {
	listUnit({delFlag:"0"}).then(response => {
		unitList.value = response.rows;
	});
}

/** 查询部门列表 */
function getDeptList(){
	listDept({deptFlag: '0', status: '0'}).then(response => {
		deptList.value = response.data;
		var list = [];
		for(var i=0; i<response.data.length; i++){
			list.push({label: response.data[i].deptName, value: response.data[i].deptId});
		}
		companyDeptList.value.push({
			value: 'dept',
			label: '企业部门',
			children: list
		})
	})
}

/** 查询承包商列表 */
function getContractorList(){
	listContractor({deptFlag: '0', status: '0'}).then(response => {
		var list = [];
		for(var i=0; i<response.rows.length; i++){
			list.push({label: response.rows[i].contractorName, value: response.rows[i].id});
		}
		companyDeptList.value.push({
			value: 'contractor',
			label: '承包商',
			children: list
		})
	})
}

function getUserList1(id){
	listUser({deptFlag: '0', status: '0', deptId: id}).then(response => {
		userList.value = response.rows;
		if(id){
			companyUserList.value = [];
			for(var i=0; i<response.rows.length; i++){
				companyUserList.value.push({label: response.rows[i].nickName, value: response.rows[i].userId});
			}
		}
	})
}

function getUser(){
  getUserList().then(response => {
    userOptions.value = response.rows;
  });
}

function getPersonnelList(id){
	companyUserList.value = [];
	listPersonnel({deptFlag: '0', status: '0', contractorId: id}).then(response => {
		for(var i=0; i<response.rows.length; i++){
			companyUserList.value.push({label: response.rows[i].personnelName, value: response.rows[i].id});
		}
	})
}

function handleChangeCompany(){
	form.value.companyType = form.value.companyId[0];
	form.value.companyId = form.value.companyId[1];
	if(form.value.companyType == "dept"){
		getUserList1(form.value.companyId);
	}else if(form.value.companyType == "contractor"){
		getPersonnelList(form.value.companyId);
	}
}

function getUnitListyObjecIds() {
	listByObjecIds(form.value.safeObjectIdsArray).then(response => {
		unitList.value = response.rows;
	});
}

/** 查询作业计划列表 */
function getList() {
  loading.value = true;
  listOperationPlan(queryParams.value).then(response => {
    operationPlanList.value = response.rows;
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
    operationContent: null,
    safeObjectIds: null,
		safeObjectIdsArray: [],
    safeUnitId: null,
    operationSite: null,
    operationTypes: [],
    startDate: null,
    endDate: null,
    responsibleDeptId: null,
    responsibleUserId: null,
		companyType: null,
    companyId: null,
    companyUserId: null,
    enclosure: null,
    status: "0",
    delFlag: "0",
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("operationPlanRef");
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
  title.value = "添加作业计划";
}

function handleCheck(row){
  checkform.value.id = row.id;
  checkform.value.workStatus = '1'
  checkopen.value = true;
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getOperationPlan(id).then(response => {
    form.value = response.data;
    form.value.operationTypes = form.value.operationTypes.split(",");
		//form.value.companyId = form.value.companyType + "," + form.value.companyId;
		if(form.value.companyType == "dept"){
			getUserList1(form.value.companyId);
		}else if(form.value.companyType == "contractor"){
			getPersonnelList(form.value.companyId);
		}
    open.value = true;
    title.value = "修改作业计划";
  });
}

function handleInfo(row){
  const id = row.id || ids.value
  getOperationPlan(id).then(response => {
    form.value = response.data;
    form.value.operationTypes = form.value.operationTypes.split(",");
    infoopen.value = true;
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["operationPlanRef"].validate(valid => {
    if (valid) {
      form.value.operationTypes = form.value.operationTypes.join(",");
      if (form.value.id != null) {
        updateOperationPlan(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addOperationPlan(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

function upForm(){
  updateOperationPlan(checkform.value).then(response => {
    proxy.$modal.msgSuccess("提交成功");
    checkopen.value = false;
    getList();
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const idss = row.id || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delOperationPlan(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/operationPlan/export', {
    ...queryParams.value
  }, `operationPlan_${new Date().getTime()}.xlsx`)
}

getObjectList();
getUnitList();
getDeptList();
getUserList1();
getContractorList();
getList();
getUser();
userId.value = userStore.user.userId
</script>
