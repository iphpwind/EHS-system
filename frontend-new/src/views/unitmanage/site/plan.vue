<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="巡检计划名称" prop="planName">
        <el-input
          v-model="queryParams.planName"
          placeholder="请输入巡检计划名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in unit_status"
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

    <el-row :gutter="10" class="mb8 toolsline">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['unitManage:plan:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['unitManage:plan:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['unitManage:plan:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['unitManage:plan:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Edit"
          @click="handleTasks"
          v-hasPermi="['unitManage:plan:add']"
        >生成任务</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="inspectionPlanList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="巡检计划id" align="center" prop="planId" />
      <el-table-column label="巡检计划名称" align="center" prop="planName" />
      <el-table-column label="巡检周期开始时间" align="center" prop="planBeginTime" width="180"/>
      <el-table-column label="巡检周期结束时间" align="center" prop="planEndTime" width="180"/>
      <el-table-column label="是否次日" align="center" prop="nextDay" />
      <el-table-column label="间隔天数" align="center" prop="intervalDays" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="unit_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="巡检人员" align="center" prop="userIds">
				<template #default="scope">
					<template v-for="(arr,index) in scope.row.userIdArray" :key="arr">
						<template v-for="user in userOptions" :key="user.userIds">
							<span v-if="Number(arr) === user.userId">{{user.nickName}}</span>
							<span v-if="Number(arr) === user.userId && index<scope.row.userIdArray.length-1">,</span>
						</template>
					</template>
				</template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="320">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['unitManage:plan:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Edit"
            @click="handleTask(scope.row)"
            v-hasPermi="['unitManage:plan:add']"
          >生成任务</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['unitManage:plan:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList(route.params && route.params.siteId)"
    />

    <!-- 添加或修改单元巡检计划对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="inspectionPlanRef" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="巡检点" prop="siteId">
					<el-select v-model="form.siteId">
						<el-option
								v-for="item in siteOptions"
								:key="item.siteId"
								:label="item.siteName"
								:value="item.siteId"
						/>
					</el-select>
        </el-form-item>
        <el-form-item label="巡检计划名称" prop="planName">
          <el-input v-model="form.planName" placeholder="请输入巡检计划名称" />
        </el-form-item>
        <el-form-item label="巡检周期模板" prop="cycleId">
					<el-select v-model="form.cycleId">
						<el-option
								v-for="item in cycleTemplateOptions"
								:key="item.cycleId"
								:label="item.templateName"
								:value="item.cycleId"
						/>
					</el-select>
        </el-form-item>
        <el-form-item label="巡检人员" prop="userNames">
          <span>{{form.userNames}}</span>
					<el-button type="primary" style="margin-left: 10px;" @click="selectUser">选择巡检人员</el-button>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in unit_status"
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
		<!-- 选择巡检人员 -->
		<el-dialog title="选择巡检人员" v-model="visible" width="800px" top="5vh" append-to-body>
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
  </div>
</template>

<script setup name="Plan">
import { listInspectionPlan, getInspectionPlan, delInspectionPlan, addInspectionPlan, updateInspectionPlan, createInspectionTaskByPlan, createInspectionTaskByPlans } from "@/api/unitmanage/inspectionPlan";
import { listSite } from "@/api/unitmanage/site";
import { listUser } from "@/api/system/user";
import { listCycleTemplate } from "@/api/unitManage/cycleTemplate";
import {h} from "vue";

const { proxy } = getCurrentInstance();
const { unit_status } = proxy.useDict('unit_status');

const inspectionPlanList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const route = useRoute();
const userOptions = ref([]);
const siteOptions = ref([]);
const cycleTemplateOptions = ref([]);
const users = ref([]);
const visible = ref(false);
const tables = ref([]);
const tableNames = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    planName: null,
    siteId: null,
    status: null,
		delFlag: "0"
  },
  rules: {
    planId: [
      { required: true, message: "巡检计划id不能为空", trigger: "blur" }
    ],
    planName: [
      { required: true, message: "巡检计划名称不能为空", trigger: "blur" }
    ],
    siteId: [
      { required: true, message: "巡检点id不能为空", trigger: "blur" }
    ],
    cycleId: [
      { required: true, message: "巡检周期模板不能为空", trigger: "blur" }
    ],
    userIds: [
      { required: true, message: "巡检人员不能为空", trigger: "blur" }
    ],
    id: [
      { required: true, message: "巡检周期模板不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询巡检人员列表 **/
function getUserList(){
	listUser().then(response => {
		  userOptions.value = response.rows;
	});
}

/** 查询巡检周期模板列表 **/
function getCycleTemplateList(){
	listCycleTemplate().then(response => {
		  cycleTemplateOptions.value = response.rows;
	});
}

/** 查询巡检点列表 **/
function getSiteList(){
	listSite().then(response => {
		  siteOptions.value = response.rows;
	});
}

/** 查询单元巡检计划列表 */
function getList(siteId) {
  loading.value = true;
	queryParams.value.siteId = siteId;
  listInspectionPlan(queryParams.value).then(response => {
		if(response.total>0){
			for(let row of response.rows){
				if(row.userIds != ""){
					row.userIdArray = row.userIds.split(",");
				}
			}
		}
    inspectionPlanList.value = response.rows;
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
    planId: null,
    planName: null,
    siteId: Number(queryParams.value.siteId) ? Number(queryParams.value.siteId)  : null,
    userIds: null,
    planBeginDate: null,
    planEndDate: null,
    planBeginTime: null,
    planEndTime: null,
    nextDay: null,
    intervalDays: null,
    status: "0",
    delFlag: "0",
		cycleId: null,
  };
  proxy.resetForm("inspectionPlanRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList(route.params && route.params.siteId);
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.planId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加单元巡检计划";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const planId = row.planId || ids.value
  getInspectionPlan(planId).then(response => {
		if(response.data.userIds != ""){
			response.data.userIdArray = response.data.userIds.split(",");
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
    form.value = response.data;
    open.value = true;
    title.value = "修改单元巡检计划";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["inspectionPlanRef"].validate(valid => {
    if (valid) {
      if (form.value.planId != null) {
        updateInspectionPlan(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList(route.params && route.params.siteId);
        });
      } else {
        addInspectionPlan(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList(route.params && route.params.siteId);
        });
      }
    }
  });
}

/** 选择巡检人员按钮 **/
function selectUser(){
	visible.value = true;
	
	if(form.value.userIds != null && form.value.userIds != ""){
		const userIds = form.value.userIds.split(",");
		
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

/** 单击选择行 */
function clickRow(row) {
  proxy.$refs.table.toggleRowSelection(row);
}

/** 多选框选中数据 */
function handleSelectionChange2(selection) {
  tables.value = selection.map(item => item.userId);
  tableNames.value = selection.map(item => item.nickName);
}

/** 选择巡检人员确定按钮操作 */
function handleUserIds() {
  const userIds = tables.value.join(",");
  const userNames = tableNames.value.join(",");
  if (userIds == "") {
    proxy.$modal.msgError("请选择巡检人员");
    return;
  }
	form.value.userIds = userIds;
	form.value.userNames = userNames;
	visible.value = false;
}

/** 删除按钮操作 */
function handleDelete(row) {
  const planIds = row.planId || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delInspectionPlan(planIds);
  }).then(() => {
    getList(route.params && route.params.siteId);
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('unitManage/inspectionPlan/export', {
    ...queryParams.value
  }, `inspectionPlan_${new Date().getTime()}.xlsx`)
}

function handleTask(row){
  proxy.$modal.confirm('是否确认生成单元巡检计划编号为"' + row.planId + '"的巡检任务？').then(function() {
    createInspectionTaskByPlan({planId :row.planId}).then(response => {
    	proxy.$modal.msgSuccess("生成成功");
    });
  }).then(() => {
  }).catch(() => {
    	proxy.$modal.msgSuccess("生成失败");
	});
}

function handleTasks(row){
  const planIds = row.planId || ids.value;
  if(planIds=="" || planIds==undefined){
    proxy.$modal.msgWarning("先勾选记录");
  }else{
    proxy.$modal.confirm('是否确认生成单元巡检计划编号为"' + planIds + '"的巡检任务？').then(function() {
      createInspectionTaskByPlans(planIds).then(response => {
        proxy.$modal.msgSuccess("生成成功");
      });
    }).then(() => {
    }).catch(() => {
      proxy.$modal.alertError("生成失败");
    });
  }
}

getSiteList();
getUserList();
getCycleTemplateList();
getList(route.params && route.params.siteId);
</script>
<style>
.toolsline{
  height: 30px;
}
</style>