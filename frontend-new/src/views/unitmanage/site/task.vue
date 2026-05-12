<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="巡检任务名称" prop="taskName">
        <el-input
          v-model="queryParams.taskName"
          placeholder="请输入巡检任务名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="巡检任务状态" prop="taskStatus">
        <el-select v-model="queryParams.taskStatus" placeholder="请选择状态" clearable>
          <el-option key="0" label="未巡检" value="0" />
          <el-option key="1" label="已巡检" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="taskList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="巡检任务id" width="100" align="center" prop="taskId" />
      <el-table-column label="巡检任务名称" align="center" prop="taskName" />
      <el-table-column label="巡检任务开始时间" align="center" prop="beginTime" width="180"/>
      <el-table-column label="巡检任务结束时间" align="center" prop="endTime" width="180"/>
      <el-table-column label="巡检人员" align="center">
				<template #default="scope">
					<template v-for="(arr,index) in scope.row.userIdArray" :key="arr">
						<template v-for="user in userOptions" :key="user.userIds">
							<span v-if="Number(arr) === user.userId">{{user.userName}}</span>
							<span v-if="Number(arr) === user.userId && index<scope.row.userIdArray.length-1">,</span>
						</template>
					</template>
				</template>
      </el-table-column>
      <el-table-column label="巡检任务状态" align="center">
				<template #default="scope">
						<span v-if="scope.row.taskStatus === '0'">未巡检</span>
						<span v-if="scope.row.taskStatus === '01'">已巡检</span>
				</template>
      </el-table-column>
      <el-table-column label="巡检任务结果" align="center" prop="taskResult" width="180"/>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList(route.params && route.params.siteId)"
    />

    <!-- 添加或修改单元巡检任务对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="taskRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="巡检任务名称" prop="taskName">
          <el-input v-model="form.taskName" placeholder="请输入巡检任务名称" />
        </el-form-item>
        <el-form-item label="开始时间" prop="beginTime">
          <el-date-picker clearable
            v-model="form.beginTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择巡检任务开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker clearable
            v-model="form.endTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择巡检任务结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="巡检人员" prop="userNames">
          <span>{{form.userNames}}</span>
					<el-button type="primary" style="margin-left: 10px;" @click="selectUser">选择巡检人员</el-button>
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
					<el-table-column prop="userName" label="人员名称" :show-overflow-tooltip="true"></el-table-column>
					<el-table-column prop="dept.deptName" label="部门" :show-overflow-tooltip="true"></el-table-column>
				</el-table>
			</el-row>
			<template #footer>
				<div class="dialog-footer">
					<el-button type="primary" @click="handleUserIds">确 定</el-button>
					<el-button @click="visible = false">取 消</el-button>
				</div>
			</template>
		</el-dialog>
  </div>
</template>

<script setup name="Task">
import { listTask, getTask, delTask, addTask, updateTask } from "@/api/unitmanage/task";
import { listUser } from "@/api/system/user";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const taskList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const userOptions = ref([]);
const visible = ref(false);
const tables = ref([]);
const tableNames = ref([]);
const route = useRoute();

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    taskName: null,
		taskStatus: null,
		siteId: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询巡检人员列表 **/
function getUserList(){
	listUser().then(response => {
		  userOptions.value = response.rows;
	});
}

/** 查询单元巡检任务列表 */
function getList(siteId) {
  loading.value = true;
	queryParams.value.siteId = siteId;
	console.log(JSON.stringify(queryParams.value))
  listTask(queryParams.value).then(response => {
		if(response.total>0){
			for(let row of response.rows){
				if(row.userIds != ""){
					row.userIdArray = row.userIds.split(",");
				}
			}
		}
    taskList.value = response.rows;
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
    taskId: null,
    taskName: null,
    beginTime: null,
    endTime: null,
    userIds: null
  };
  proxy.resetForm("taskRef");
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
  ids.value = selection.map(item => item.taskId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加单元巡检任务";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const taskId = row.taskId || ids.value
  getTask(taskId).then(response => {
		if(response.data.userIds != ""){
			response.data.userIdArray = response.data.userIds.split(",");
			var userNames = [];
			for(let id of response.data.userIdArray){
				for(let user of userOptions.value){
					if(Number(id) == user.userId){
						userNames.push(user.userName);
					}
				}
			}
			response.data.userNames = userNames.join(',');
		}
    form.value = response.data;
    open.value = true;
    title.value = "修改单元巡检任务";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["taskRef"].validate(valid => {
    if (valid) {
      if (form.value.taskId != null) {
        updateTask(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList(route.params && route.params.siteId);
        });
      } else {
        addTask(form.value).then(response => {
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
}

/** 单击选择行 */
function clickRow(row) {
  proxy.$refs.table.toggleRowSelection(row);
}

/** 多选框选中数据 */
function handleSelectionChange2(selection) {
  tables.value = selection.map(item => item.userId);
  tableNames.value = selection.map(item => item.userName);
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
  const taskIds = row.taskId || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delTask(taskIds);
  }).then(() => {
    getList(route.params && route.params.siteId);
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('unitmanage/task/export', {
    ...queryParams.value
  }, `task_${new Date().getTime()}.xlsx`)
}

getUserList();
getList(route.params && route.params.siteId);
</script>
