<template>
  <div class="app-container">
		<div class="toprightbtn">
			<el-button type="primary" @click="daoru()">教育培训导入</el-button>
		</div>
		<el-dialog
			v-model="dialogDaoru"
			title="试卷管理列表"
			width="80%"
			custom-class="daoruTanchu"
		>
			<el-form class="elform" :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
			  <el-row>
					<el-col :span="7">
						<el-form-item label="试卷名称" prop="name">
						  <el-input
						    v-model="queryParams.name"
						    placeholder="请输入试卷名称"
						    clearable
						  />
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="所属分类">
							<el-select v-model="queryParams.type">
								<el-option label="全部" value="全部" />
								<el-option label="分类一" value="分类一" />
								<el-option label="分类二" value="分类二" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="7">
						<el-form-item label="命题方式">
							<el-select v-model="queryParams.method" >
								<el-option label="全部" value="全部" />
								<el-option label="固定" value="固定" />
								<el-option label="随机" value="随机" />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="3">
						<el-form-item>
						  <el-button type="primary">查询</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<el-radio-group v-model="radio1" style="width: 100%">
				<el-table
					ref="singleTableRef"
					:data="shijuan"
					highlight-current-row
					style="width: 100%"
					@current-change="shijuanChange"
				>
					<el-table-column  width="50">
						<template #default="scope">
							<el-radio :label="scope.row.id"></el-radio>
						</template>
					</el-table-column>
					<el-table-column property="name" label="试卷名称" />
					<el-table-column property="category" label="所属分类" width="140" />
					<el-table-column property="method" label="命题方式" width="80" />
					<el-table-column property="count" label="题目总数量" width="100" />
					<el-table-column property="score" label="试卷总分" width="80" />
					<el-table-column property="jigenum" label="及格分数/题目数" width="120" />
					<el-table-column property="passnum" label="已通过人员" width="90" />
				</el-table>
			</el-radio-group>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogDaoru = false">关闭</el-button>
					<el-button type="primary" @click="daoruConfirm()">
						确定
					</el-button>
				</span>
			</template>
		</el-dialog>
		<el-tabs v-model="tabActive" class="eltabs" 
			@tab-click="handleClick">
			<el-tab-pane label="内部监护人" name="内部监护人">
				<el-form class="elform" :model="guardianQueryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
				  <el-form-item label="所属部门">
						<el-select v-model="guardianQueryParams.deptId" placeholder="请选择所属部门" clearable>
							<el-option
								v-for="item in deptList"
								:key="item.deptId"
								:label="item.deptName"
								:value="item.deptId"
							/>
						</el-select>
					</el-form-item>
				  <el-form-item label="工号" prop="staffNo">
				    <el-input
				      v-model="guardianQueryParams.staffNo"
				      placeholder="请输入工号"
				      clearable
				      @keyup.enter="handleQuery"
				    />
				  </el-form-item>
					<el-form-item label="姓名" prop="name">
				    <el-input
				      v-model="guardianQueryParams.name"
				      placeholder="请输入姓名"
				      clearable
				      @keyup.enter="handleQuery"
				    />
				  </el-form-item>
				  <!-- <el-form-item label="超期提醒">
				  	<el-select v-model="guardianQueryParams.chaoqi">
				  		<el-option label="全部" value="全部" />
				  		<el-option label="近一个月到期" value="近一个月到期" />
				  		<el-option label="近二到三个月到期" value="近二到三个月到期" />
				  		<el-option label="三个月以上到期" value="三个月以上到期" />
				  		<el-option label="已过期" value="已过期" />
				  	</el-select>
				  </el-form-item> -->
					<el-form-item label="状态">
						<el-select v-model="guardianQueryParams.status" >
							<el-option label="全部" value="" />
							<el-option label="正常" value="0" />
							<el-option label="停用" value="2" />
						</el-select>
					</el-form-item>
				  <el-form-item>
				    <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
				    <el-button icon="Refresh" @click="resetQuery">重置</el-button>
				  </el-form-item>
					<el-form-item>
					  <el-button
					    type="primary"
					    plain
					    icon="Plus"
					    @click="handleAdd"
					    v-hasPermi="['guardian:guardian:add']"
					  >新增</el-button>
						<el-button
						  type="danger"
						  plain
						  icon="Delete"
						  :disabled="multiple"
						  @click="handleDelete"
						  v-hasPermi="['guardian:guardian:remove']"
						>删除</el-button>
						<el-button
						  type="warning"
						  plain
						  icon="Download"
						  @click="handleExport"
						  v-hasPermi="['guardian:guardian:export']"
						>导出</el-button>
					</el-form-item>
				</el-form>
				
				<el-table v-loading="loading" :data="guardianList" @selection-change="handleSelectionChange">
				  <el-table-column type="selection" width="55" align="center" />
				  <!-- <el-table-column label="自增id" align="center" prop="id" />
				  <el-table-column label="人员id" align="center" prop="staffId" /> -->
				  <el-table-column label="部门" align="center" prop="deptName" />
				  <el-table-column label="工号" align="center" prop="staffNo" />
				  <el-table-column label="姓名" align="center" prop="name" />
				  <el-table-column label="性别" align="center" prop="gender" >
					<template #default="scope">
				      <span v-if="scope.row.status == '0'">男</span>
					  <span v-if="scope.row.status == '1'">女</span>
				    </template>
				  </el-table-column>
				  <el-table-column label="岗位" align="center" prop="position" />
				  <el-table-column label="手机" align="center" prop="phone" />
				  <el-table-column label="身份证号" align="center" prop="idCardNo" />
				  <el-table-column label="有效期" align="center" prop="expirationDate" width="180">
				    <template #default="scope">
				      <span>{{ parseTime(scope.row.expirationDate, '{y}-{m}-{d}') }}</span>
				    </template>
				  </el-table-column>
				  <el-table-column label="状态" align="center" prop="status" >
					<template #default="scope">
				      <span v-if="scope.row.status == '0'">正常</span>
					  <span v-if="scope.row.status == '2'">停用</span>
				    </template>
				  </el-table-column>
				  <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				    <template #default="scope">
				      <el-button
				        type="text"
				        icon="Delete"
				        @click="handleDelete(scope.row)"
				        v-hasPermi="['guardian:guardian:remove']"
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
			</el-tab-pane>
			<el-tab-pane label="外部监护人" name="外部监护人">
				<el-form class="elform" :model="guardianQueryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
				  <!-- <el-form-item label="所在单位">
						<el-select v-model="queryParams.dept" placeholder="所在单位">
							<el-option label="单位一" value="单位一" />
							<el-option label="单位二" value="单位二" />
						</el-select>
					</el-form-item> -->
					<el-form-item label="姓名" prop="name">
				    <el-input
				      v-model="guardianQueryParams.name"
				      placeholder="请输入姓名"
				      clearable
				      @keyup.enter="handleQuery"
				    />
				  </el-form-item>
				  <!-- <el-form-item label="超期提醒">
				  	<el-select v-model="queryParams.chaoqi">
				  		<el-option label="全部" value="全部" />
				  		<el-option label="近一个月到期" value="近一个月到期" />
				  		<el-option label="近二到三个月到期" value="近二到三个月到期" />
				  		<el-option label="三个月以上到期" value="三个月以上到期" />
				  		<el-option label="已过期" value="已过期" />
				  	</el-select>
				  </el-form-item> -->
					<el-form-item label="状态">
						<el-select v-model="guardianQueryParams.status" >
							<el-option label="全部" value="" />
							<el-option label="正常" value="0" />
							<el-option label="停用" value="2" />
						</el-select>
					</el-form-item>
				  <el-form-item>
				    <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
				    <el-button icon="Refresh" @click="resetQuery">重置</el-button>
				  </el-form-item>
					<el-form-item>
					  <el-button
					    type="primary"
					    plain
					    icon="Plus"
					    @click="handleAdd2"
					    v-hasPermi="['guardian:guardian:add']"
					  >新增</el-button>
						<el-button
						  type="danger"
						  plain
						  icon="Delete"
						  :disabled="multiple2"
						  @click="handleDelete"
						  v-hasPermi="['guardian:guardian:remove']"
						>删除</el-button>
						<el-button
						  type="warning"
						  plain
						  icon="Download"
						  @click="handleExport2"
						  v-hasPermi="['guardian:guardian:export']"
						>导出</el-button>
					</el-form-item>
				</el-form>
				
				<el-table v-loading="loading" :data="guardianList" @selection-change="handleSelectionChange">
				  <el-table-column type="selection" width="55" align="center" />
				  <el-table-column label="部门" align="center" prop="deptName" />
				  <el-table-column label="工号" align="center" prop="staffNo" />
				  <el-table-column label="姓名" align="center" prop="name" />
				  <el-table-column label="性别" align="center" prop="gender" >
					<template #default="scope">
				      <span v-if="scope.row.status == '0'">男</span>
					  <span v-if="scope.row.status == '1'">女</span>
				    </template>
				  </el-table-column>
				  <el-table-column label="岗位" align="center" prop="position" />
				  <el-table-column label="手机" align="center" prop="phone" />
				  <el-table-column label="身份证号" align="center" prop="idCardNo" />
				  <el-table-column label="有效期" align="center" prop="expirationDate" width="180">
				    <template #default="scope">
				      <span>{{ parseTime(scope.row.expirationDate, '{y}-{m}-{d}') }}</span>
				    </template>
				  </el-table-column>
				  <el-table-column label="学历" align="center" prop="education" />
				  <el-table-column label="状态" align="center" prop="status" >
					<template #default="scope">
				      <span v-if="scope.row.status == '0'">正常</span>
					  <span v-if="scope.row.status == '2'">停用</span>
				    </template>
				  </el-table-column>
				  <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				    <template #default="scope">
				      <el-button
				        type="text"
				        icon="Delete"
				        @click="handleDelete(scope.row)"
				        v-hasPermi="['guardian:guardian:remove']"
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
			</el-tab-pane>
		</el-tabs>
    

    <!-- 添加或修改监护人信息对话框 -->
    <el-dialog :title="title" v-model="open" width="80%" custom-class="addTanchu">
      <el-row :gutter="15">
				<el-col :span="4">
					<div style="line-height: 32px">所属部门：</div>
					<el-table
						ref="pxgwTable"
						:data="deptList"
						style="width: 100%;margin: 15px 0 0;"
						@selection-change="bumenSelect"
						height="400"
					>
						<el-table-column type="selection" width="55" />
						<el-table-column prop="deptName" label="部门" />
					</el-table>
				</el-col>
				<el-col :span="10">
					<el-form label-width="80px">
						<el-row :gutter="10">
							<el-col :span="12">
								<el-form-item label="姓名:">
									<el-input v-model="staffParams.staffName" placeholder="请输入姓名"/>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-button type="primary" @click="getUsers">查询</el-button>
							</el-col>
						</el-row>
					</el-form>
					<el-table
						ref="pxgwTable"
						:data="staffList"
						style="width: 100%;margin: 15px 0 0;"
						@selection-change="pxgwSelectionChange"
						height="400"
					>
						<el-table-column type="selection" width="55" :selectable="selectable"/>
						<el-table-column prop="staffName" label="姓名" />
						<el-table-column prop="deptName" label="部门" />
						<el-table-column prop="postNames" label="岗位" />
						<el-table-column prop="phonenumber" label="手机号" width="140" />
					</el-table>
				</el-col>
				<el-col :span="10">
					<el-form label-width="80px">
						<el-row :gutter="10">
							<el-col :span="12">
								<el-form-item label="姓名">
									<el-input v-model="finishStaffParams.staffName" placeholder="请输入姓名"/>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-button type="primary" @click="getFinishUsers">查询</el-button>
								<el-button type="primary" @click="pxgwSelectionDelete">清除</el-button>
							</el-col>
						</el-row>
					</el-form>
					<el-table
						:data="pxgwChoosedData"
						style="width: 100%;margin: 15px 0 0;"
						height="400"
					>
						<el-table-column prop="staffName" label="姓名" />
						<el-table-column prop="deptName" label="部门" />
						<el-table-column prop="postNames" label="岗位" />
						<el-table-column prop="phonenumber" label="手机号" width="140" />
						<el-table-column label="操作" width="80" > 
							<template #default="scope">
								<div @click="pxgwDelete(scope.$index, scope.row)" style="color: red;cursor: pointer;">
									移除
								</div>
							</template>
						</el-table-column>
					</el-table>
				</el-col>
			</el-row>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </template>
    </el-dialog>
		
		<!-- 添加或修改外部监护人 -->
		<el-dialog title="默认加载审批通过且未在黑名单的承包商人员" 
		v-model="waibuopen" width="60%" custom-class="addTanchu">
			<el-form class="elform" :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
			  <!-- <el-form-item label="单位">
					<el-select v-model="queryParams.dept">
						<el-option label="全部" value="全部" />
						<el-option label="单位一" value="单位一" />
					</el-select>
				</el-form-item> -->
				<el-form-item label="姓名" prop="name">
			    <el-input
			      v-model="contractorQueryParams.personnelName"
			      placeholder="请输入姓名"
			      clearable
			      @keyup.enter="handleQuery"
			    />
			  </el-form-item>
			  <el-form-item>
			    <el-button type="primary" @click="contractorHandleQuery" style="margin-left: 10px;">查询</el-button>
			  </el-form-item>
			</el-form>
			<el-table
				ref="waibujianhuTable"
				:data="personnelList"
				style="width: 100%;margin: 15px 0 0;"
				@selection-change="waibujianhuChange"
				height="400"
			>
				<el-table-column type="selection" width="55" :selectable="selectable"/>
				<el-table-column prop="personnelName" label="姓名" />
				<el-table-column prop="contractorName" label="部门" />
				<el-table-column prop="post" label="岗位" />
				<el-table-column prop="phone" label="手机号" width="140" />
			</el-table>
		  <template #footer>
		    <div class="dialog-footer">
		      <el-button type="primary" @click="waibuSave">确定</el-button>
		      <el-button @click="waibuopen = false">取消</el-button>
		    </div>
		  </template>
		</el-dialog>
  </div>
</template>

<script setup name="Guardian">
import { listGuardian, getGuardian, delGuardian, addGuardian, updateGuardian } from "@/api/safework/guardian";
import { getChildsByParentId } from '@/api/system/dept'
import { listPersonnel } from '@/api/contractorManage/personnel'
import { listStaff } from "@/api/system/staff";

const { proxy } = getCurrentInstance();

const guardianList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const deptList = ref([]);
const staffList = ref([]);
const depts = ref([]);
const pxgwChoosedData = ref([]);
const personnelList = ref({});
const contractorChoosedData = ref({});
const tabActive = ref('内部监护人');
const dialogDaoru = ref(false);
const radio1 = ref('');
const waibuopen = ref(false);
const staffIds = computed(() => {
  return guardianList.value.map((item) => item.staffId)
})
const selectable = (row, index) => {

  if (staffIds.value.includes(row.staffId) || staffIds.value.includes(row.id)) {
    return false
  }else {
    return true
  }
}


const data = reactive({
  form: {},
  contractorQueryParams:{

  },
  guardianQueryParams:{
	deptId: null,
  },
  queryParams: {
    deptId: null,
    staffNo: null,
    name: null,
    chaoqi: ''
  },
  rules: {
  },
  staffParams:{
	deptIdss:'',
	staffName:'',
  },
  finishStaffParams:{
	staffName:'',
  }
});

const { queryParams, form, rules,staffParams,finishStaffParams,guardianQueryParams,contractorQueryParams  } = toRefs(data);

function contractorHandleQuery(){
	getPersonnelList();
}
/** 查询承包商人员列表 */
function getPersonnelList() {
	contractorQueryParams.value.deptFlag = "0";
	contractorQueryParams.value.status = "0";
  listPersonnel(contractorQueryParams.value).then((response) => {
    personnelList.value = response.rows;
  });
}

function getUsers(){
	getStaffList();
}
function getFinishUsers(){
	pxgwChoosedData.value = pxgwChoosedData.value.filter(item => item.staffName.includes(finishStaffParams.value.staffName));
}

function bumenSelect(selection){
	depts.value = selection.map(item => item.deptId);
	staffParams.value.deptIdss = depts.value.join(',');
	if(depts.value == ''){
		staffParams.value.deptIdss = '00'
	}
	getStaffList();
}

function handleClick(){
	getList();
}

/** 查询部门员工列表 */
function getStaffList() {
	// if(tabActive.value == '内部监护人'){
	// 	staffParams.value.staffType = 1
	// }else{
	// 	staffParams.value.staffType = 2
	// }
  listStaff(staffParams.value).then((response) => {
    staffList.value = response.rows;
  });
}

/** 查询部门列表 */
function getDeptList(){
	getChildsByParentId({deptFlag: '0', status: '0'}).then(response => {
		deptList.value = response.data;
	})
}

/** 查询监护人信息列表 */
function getList() {
  loading.value = true;
	if(tabActive.value == '内部监护人'){
		guardianQueryParams.value.type = 1
	}else{
		guardianQueryParams.value.type = 2
	}
  listGuardian(guardianQueryParams.value).then(response => {
    guardianList.value = response.rows;
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
    staffId: null,
    deptId: null,
    staffNo: null,
    name: null,
    gender: null,
    position: null,
    phone: null,
    idCardNo: null,
    expirationDate: null,
    education: null,
    status: "0",
    // createTime: null,
    // createBy: null,
    // updateTime: null,
    // updateBy: null
  };
  proxy.resetForm("guardianRef");
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
  title.value = "添加监护人信息";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getGuardian(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改监护人信息";
  });
}

/** 提交按钮 */
function submitForm() {
//   proxy.$refs["guardianRef"].validate(valid => {
//     if (valid) {
//       if (form.value.id != null) {
//         updateGuardian(form.value).then(response => {
//           proxy.$modal.msgSuccess("修改成功");
//           open.value = false;
//           getList();
//         });
//       } else {
//         addGuardian(form.value).then(response => {
//           proxy.$modal.msgSuccess("新增成功");
//           open.value = false;
//           getList();
//         });
//       }
//     }
//   });
	console.log(pxgwChoosedData.value)
	pxgwChoosedData.value.forEach(element => {
		form.value = element,
		form.value.idCardNo = element.cardNo,
		form.value.gender = element.sex,
		form.value.phone = element.phonenumber,
		form.value.name = element.staffName,
		form.value.status = '0',
		form.value.type = '1'
		addGuardian(form.value).then(response => {
			handleQuery();
		});
	});
	proxy.$modal.msgSuccess("新增成功");
	open.value = false;
}

/** 删除按钮操作 */
function handleDelete(row) {
  const idss = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除监护人信息编号为"' + idss + '"的数据项？').then(function() {
    return delGuardian(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('guardian/guardian/export', {
    ...queryParams.value
  }, `guardian_${new Date().getTime()}.xlsx`)
}

getList();
getDeptList();
getPersonnelList();


function pxgwSelectionChange(val) {
	//console.log(val)
	pxgwChoosedData.value = [];
	for(var i=0;i<val.length;i++){
		pxgwChoosedData.value.push(val[i])
	}
}
function pxgwSelectionDelete() {
	pxgwChoosedData.value = [];
	proxy.$refs["pxgwTable"].clearSelection();
}
function pxgwDelete(index, row) {
	pxgwChoosedData.value.splice(index, 1)
	proxy.$refs["pxgwTable"].toggleRowSelection(row, undefined)
}
function pxgwClose(tag, index) {
	pxgwChoosedData.value.splice(index, 1)
}

const shijuan = ref([
	{
		id: '1',
		name: '特殊作业安全点滴教育（第六期）',
		category: '日常安全教育',
		method: '随机',
		count: '5',
		score: '120',
		jigenum: '3',
		passnum: '70'
	},{
		id: '2',
		name: '特殊作业安全点滴教育（第六期）',
		category: '日常安全教育',
		method: '随机',
		count: '5',
		score: '120',
		jigenum: '3',
		passnum: '70'
	},{
		id: '3',
		name: '特殊作业安全点滴教育（第六期）',
		category: '日常安全教育',
		method: '随机',
		count: '5',
		score: '120',
		jigenum: '3',
		passnum: '70'
	}
]);
function daoru() {
	dialogDaoru.value = true;
}
function daoruConfirm() {
	dialogDaoru.value = false;
}
function shijuanChange(val) {
	radio1.value = val.id
}
function handleAdd2() {
	
	waibuopen.value = true;
	proxy.$refs["waibujianhuTable"].clearSelection();
}
function waibujianhuChange(val) {
	contractorChoosedData.value = [];
	for(var i=0;i<val.length;i++){
		contractorChoosedData.value.push(val[i])
	}
}
function waibuSave() {
	contractorChoosedData.value.forEach(element => {
		form.value = element,
		form.value.staffId = element.id, 
		form.value.idCardNo = element.identityCard,
		form.value.gender = element.sex,
		form.value.name = element.personnelName,
		form.value.status = '0'
		form.value.type = '2'
		addGuardian(form.value).then(response => {
			handleQuery();
		});
	});
	waibuopen.value = false;	
}

</script>
<style scoped lang="scss">
	.app-container{
		background: #f9f9f9;padding: 10px;
		height: calc(100vh - 84px);
		overflow: auto;
		:deep .el-tabs{
			.el-tabs__header{
				margin: 0;background: #fff;padding: 0 15px;
			}
		}
		.elform{
			background: #fff;padding: 15px 15px 0;
			margin: 0 0 10px;
		}
		.addTanchu{
			border: 10px solid red;
			.el-form-item{
				margin: 0;
			}
		}
		.toprightbtn{
			position: absolute;right: 30px;top: 15px;
			z-index: 1;
		}
		:deep .daoruTanchu{
			.el-dialog__body{
				padding: 15px;border-top: 1px solid #eee;
			}
			.el-radio__label{
				display: none;
			}
		}
	}
	
	
</style>
