<template>
<div class="task">
		<div class="table">
		  <div class="header">
		    <el-row>
		      <el-col :span="12"><div class="card-tit">隐患排查任务</div></el-col>
		      <el-col :span="12">
						<el-button class="toolbtn" @click="goback">
						  <el-icon><Back /></el-icon> 返回
						</el-button>
					</el-col>
		    </el-row>
			</div>

				<div class="form">
					<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="130px">
						<el-row>
							<el-col :span="5">
                <el-form-item label="所属部门" prop="deptId">
                  <tree-select
                      v-model:value="queryParams.deptId"
                      :options="deptOptions"
                      placeholder="请选择所属部门"
                      :objMap="{ value: 'id', label: 'label', children: 'children' }"
                  />
                </el-form-item>
							</el-col>
              <el-col :span="5">
      <el-form-item label="计划名称" prop="planId">
        <el-input readonly
          v-model="queryParams.planName"
          placeholder="请输入计划名称"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
							</el-col>
							<el-col :span="5">
      <el-form-item label="计划类型" prop="investigateTypeId">
<!--        <el-input
          v-model="queryParams.investigateTypeId"
          placeholder="请输入排查类型"
          clearable
          @keyup.enter="handleQuery"
        />-->
        <el-select v-model="queryParams.investigateTypeId" placeholder="请选择" clearable filterable>
          <el-option
              v-for="item in typeeOptions"
              :key="item.id"
              :label="item.investigateName"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
							</el-col>
							<el-col :span="3" style="white-space: nowrap;">
								<el-button type="primary" class="search" icon="Search" @click="handleQuery">搜索</el-button>
								<el-button icon="Refresh" class="reset"  @click="resetQuery">重置</el-button>
							</el-col>
						</el-row>
    </el-form>
				</div>
    <el-row :gutter="10" class="mb8 toolist">
<!--      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['safework:task:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:task:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:task:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:task:export']"
        >导出</el-button>
      </el-col>-->
				  <!-- <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>

    <el-table border height="calc(100vh - 400px)" v-loading="loading" :data="taskList" @selection-change="handleSelectionChange">
<!--				  <el-table-column type="selection" width="40" align="center" />-->
<!--      <el-table-column label="主键ID" align="center" prop="id" />-->
<!--      <el-table-column label="计划ID" align="center" prop="planId" />-->
      <el-table-column label="排查类型" align="center" prop="investigateName" />
      <el-table-column label="排查周期单位" align="center" prop="cycleUnit" />
      <el-table-column label="工作日历" align="center" prop="workCalendar" />
      <el-table-column label="计划排查日期" align="center" prop="startDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计划排查时间" align="center" prop="startTime" >
        <template #default="scope">
          <span>{{ scope.row.startTime +':00 -'+ scope.row.endTime + ':00'}}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="计划排查结束时间" align="center" prop="endTime" />-->
      <el-table-column label="执行状态" align="center" prop="status" >
        <template #default="scope">
          <span v-if="scope.row.status == 0">未执行</span>
          <span v-else-if="scope.row.status == 1">已执行</span>
          <span v-else>停用</span>
        </template>
      </el-table-column>
      <el-table-column label="异常项目数" align="center" prop="num" />
      <el-table-column label="责任人" align="center" prop="userId" >
        <template #default="scope">
          <template v-for="(arr,index) in scope.row.userIdArray" :key="arr">
            <template v-for="user in userOptions" :key="user.userId">
              <span v-if="Number(arr) === user.userId">{{user.nickName}}</span>
              <span v-if="Number(arr) === user.userId && index<scope.row.userIdArray.length-1">,</span>
            </template>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="260">
        <template #default="scope">
				      <el-button style="color: #09bec5;"
            v-if="scope.row.status == 0"
            type="text"
            @click="handleStop(scope.row)"
          >停用</el-button>
          <el-button style="color: #09bec5;"
              v-if="scope.row.status == 0"
              type="text"
            @click="handleDate(scope.row)"
          >计划日期</el-button>
          <el-button style="color: #09bec5;"
              v-if="scope.row.status == 0"
              type="text"
            @click="gotoContent(scope.row)"
          >查看内容</el-button>
          <el-button style="color: #09bec5;"
              v-if="scope.row.status == 0"
              type="text"
            @click="handleUser(scope.row)"
          >责任人</el-button>
          <el-button style="color: #09bec5;"
              v-if="scope.row.status == 1"
              type="text"
            @click="handleDetail(scope.row)"
          >排查记录</el-button>
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
    <!-- 添加或修改隐患排查任务对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="taskRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="计划ID" prop="planId">
          <el-input v-model="form.planId" placeholder="请输入计划ID" />
        </el-form-item>
        <el-form-item label="排查类型字典id" prop="investigateTypeId">
          <el-input v-model="form.investigateTypeId" placeholder="请输入排查类型字典id" />
        </el-form-item>
        <el-form-item label="排查周期单位" prop="cycleUnit">
          <el-input v-model="form.cycleUnit" placeholder="请输入排查周期单位" />
        </el-form-item>
        <el-form-item label="计划排查日期" prop="startDate">
          <el-date-picker clearable
            v-model="form.startDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择计划排查日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="工作日历" prop="workCalendar">
          <el-input v-model="form.workCalendar" placeholder="请输入工作日历" />
        </el-form-item>
        <el-form-item label="计划排查开始时间" prop="startTime">
          <el-input v-model="form.startTime" placeholder="请输入计划排查开始时间" />
        </el-form-item>
        <el-form-item label="计划排查结束时间" prop="endTime">
          <el-input v-model="form.endTime" placeholder="请输入计划排查结束时间" />
        </el-form-item>
        <el-form-item label="异常项目数" prop="num">
          <el-input v-model="form.num" placeholder="请输入异常项目数" />
        </el-form-item>
        <el-form-item label="责任人" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入责任人" />
        </el-form-item>
        <el-form-item label="删除标志 0：正常 1：删除" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志 0：正常 1：删除" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog title="选择排查日期" v-model="dateopen" width="300px" append-to-body>
      <el-form ref="taskRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker clearable
                          v-model="form.startDate"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择开始日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
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
  </div>
</template>

<script setup name="Task">
import { listTask, getTask, delTask, addTask, updateTask } from "@/api/safework/task";
import { listInvestigate} from "@/api/safework/investigate";
import { listUser } from "@/api/system/user";
import {treeselect} from "@/api/system/dept";
import {h} from "vue";
const { proxy } = getCurrentInstance();

const taskList = ref([]);
const open = ref(false);
const dateopen = ref(false);
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
const deptOptions = ref(undefined);
const typeeOptions = ref(undefined);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    planId: null,
    investigateTypeId: null,
    planName:null,
    deptId:null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);
queryParams.value.planId = proxy.$route.query.planId;
queryParams.value.planName = proxy.$route.query.planName;
function gotoContent(row) {
  console.log(row)
  proxy.$router.push({
    path: '/safework/record',
    query:{
      taskId:row.id,
      planName:row.planName
    }
  })
}

/** 查询部门下拉树结构 */
function getTreeselect() {
  treeselect().then(response => {
    deptOptions.value = response.data;
  });
};

//获取排查类型
function getType(){
  listInvestigate({delFlag:0}).then(response => {
    typeeOptions.value = response.rows;
  });
}

/** 查询隐患排查任务列表 */
function getList() {
  loading.value = true;
  listTask(queryParams.value).then(response => {
    if(response.total>0){
      for(let row of response.rows){
        if(row.userIds != ""){
          row.userIdArray = row.userId.split(",");
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

function goback(){
  proxy.$router.back()
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    planId: null,
    investigateTypeId: null,
    cycleUnit: null,
    startDate: null,
    workCalendar: null,
    startTime: null,
    endTime: null,
    status: 0,
    num: null,
    userId: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("taskRef");
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
  title.value = "添加隐患排查任务";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getTask(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改隐患排查任务";
  });
}
function handleStop(row) {
  proxy.$modal.confirm('是否确认停用该任务？').then(function() {
    form.value.id = row.id;
    form.value.status = 2;
    updateTask(form.value).then(response => {
    });
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("停用成功");
  }).catch(() => {});
}
function handleDate(row) {
  reset();
  const id = row.id || ids.value
  getTask(id).then(response => {
    form.value = response.data;
    dateopen.value = true;
  });
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
    proxy.$modal.msgError("请选择人员");
    return;
  }
  form.value.userId = userIds;
  form.value.userNames = userNames;

  updateTask(form.value).then(response => {
    proxy.$modal.msgSuccess("修改成功");
    visible.value = false;
    getList();
  });
}
function handleUser(row) {
  reset();
  const id = row.id || ids.value
  getTask(id).then(response => {
    form.value = response.data;
    visible.value = true;
    if(form.value.userId != null && form.value.userId != ""){
      const userIds = form.value.userId.split(",");
      console.log(userIds)
      proxy.$nextTick(() => {
        proxy.$refs.table.clearSelection();
        userOptions.value.forEach((user) => {
          userIds.forEach(userId => {
            if(Number(userId) == user.userId){
              proxy.$refs.table.toggleRowSelection(user,true);
            }
          })
        });
      })
    }
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["taskRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateTask(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          dateopen.value = false;
          getList();
        });
      } else {
        addTask(form.value).then(response => {
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
    return delTask(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}
function handleDetail(row) {
  proxy.$router.push({
    path: '/safework/record',
    query:{
      taskId:row.id,
      planName:row.planName
    }
  })
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/task/export', {
    ...queryParams.value
  }, `task_${new Date().getTime()}.xlsx`)
}
/** 查询责任人列表 **/
function getUserList(){
  listUser().then(response => {
    userOptions.value = response.rows;
  });
}



getTreeselect();
getList();
getUserList();
getType();
</script>
<style scoped lang="scss">
	.task{
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
