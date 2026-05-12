<template>
  <div class="app-container">
		<div class="dianjianjilu">
			<div class="topform">
				<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
					<el-row>
						<el-col :span="7">
							<el-form-item label="所属部门" prop="deptId">
								<tree-select
										v-model:value="queryParams.deptId"
										:options="deptOptions"
										placeholder="请选择归属部门"
										:objMap="{ value: 'id', label: 'label', children: 'children' }"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="7">
							<el-form-item label="所属单元" prop="sectionId">
								<el-select v-model="queryParams.sectionId" clearable filterable placeholder="请选择">
									<el-option
											v-for="item in sectionOptions"
											:key="item.sectionId"
											:label="item.sectionName"
											:value="item.sectionId"
									></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="7">
							<el-form-item label="点检月份" prop="monthTime">
								<el-date-picker clearable
									v-model="queryParams.monthTime"
									type="month"
									value-format="YYYY-MM"
									style="width: 90%;"
									placeholder="请选择点检月份">
								</el-date-picker>
							</el-form-item>
						</el-col>
						<el-col :span="3">
								<el-button class="btn" icon="Refresh" @click="resetQuery">重置</el-button>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="7">
							<el-form-item label="所属分类" prop="classId">
								<el-select v-model="queryParams.classId" clearable filterable placeholder="请选择">
									<el-option
											v-for="item in classOptions"
											:key="item.id"
											:label="item.name"
											:value="item.id"
									></el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="7">
							<el-form-item label="设备编号" prop="eqCode">
								<el-input
									v-model="queryParams.eqCode"
									placeholder="请输入设备编号"
									clearable
									@keyup.enter="handleQuery"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="7">
							<el-form-item label="设备名称" prop="eqName">
								<el-input
									v-model="queryParams.eqName"
									placeholder="请输入设备名称"
									clearable
									@keyup.enter="handleQuery"
								/>
							</el-form-item>
						</el-col>
						<el-col :span="3">
							<el-button class="btn" type="primary" icon="Search" @click="handleQuery">搜索</el-button>
						</el-col>
					</el-row>
				</el-form>
			</div>
		 <!-- <el-row :gutter="10" class="mb8">
				<el-col :span="1.5">
					<el-button
						type="primary"
						plain
						icon="Plus"
						@click="handleAdd"
						v-hasPermi="['equipment:spotCheckMonth:add']"
					>新增</el-button>
				</el-col>
				<el-col :span="1.5">
					<el-button
						type="success"
						plain
						icon="Edit"
						:disabled="single"
						@click="handleUpdate"
						v-hasPermi="['equipment:spotCheckMonth:edit']"
					>修改</el-button>
				</el-col>
				<el-col :span="1.5">
					<el-button
						type="danger"
						plain
						icon="Delete"
						:disabled="multiple"
						@click="handleDelete"
						v-hasPermi="['equipment:spotCheckMonth:remove']"
					>删除</el-button>
				</el-col>
				<el-col :span="1.5">
					<el-button
						type="warning"
						plain
						icon="Download"
						@click="handleExport"
						v-hasPermi="['equipment:spotCheckMonth:export']"
					>导出</el-button>
				</el-col>
				<right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
			</el-row> -->
			
			<div class="botbox">
			  <el-card class="box-card" shadow="never">
			    <template #header>
			      <div class="card-header">细部稼动率</div>
			    </template>
					<el-table border stripe height="calc(100% - 50px)" v-loading="loading" :data="spotCheckMonthList" @selection-change="handleSelectionChange">
						<el-table-column label="所属部门" align="center" prop="deptName" />
						<el-table-column label="所在单元" align="center" prop="sectionName" />
						<el-table-column label="设备类型" align="center" prop="className" />
						<el-table-column label="设备编码" align="center" prop="eqCode" />
						<el-table-column label="设备名称" align="center" prop="eqName" />
						<el-table-column label="点检月份" align="center" prop="monthTime" width="180">
							<template #default="scope">
								<span>{{ parseTime(scope.row.monthTime, '{y}-{m}-{d}') }}月</span>
							</template>
						</el-table-column>
						<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
							<template #default="scope">
								<el-button class="detbtn"
									type="text"
									@click="handleDetail(scope.row)"
									v-hasPermi="['equipment:spotCheckMonth:list']"
								>详情</el-button>
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
				</el-card>
			</div>	
			
		
		</div>
    <!-- 添加或修改设备点检月记录对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="spotCheckMonthRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备id" prop="eqId">
          <el-input v-model="form.eqId" placeholder="请输入设备id" />
        </el-form-item>
        <el-form-item label="点检月份" prop="monthTime">
          <el-date-picker clearable
            v-model="form.monthTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择点检月份">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="SpotCheckMonth">
import { listSpotCheckMonth, getSpotCheckMonth } from "@/api/equipment/spotCheckMonth";
import {treeselect} from "@/api/system/dept";
import { listSection } from "@/api/unitmanage/section";
import { listClassification } from "@/api/equipment/classification";

const { proxy } = getCurrentInstance();

const spotCheckMonthList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const deptOptions = ref(undefined);
const classOptions = ref(undefined);
const sectionOptions = ref([]);
const router = useRouter();

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    eqId: null,
    monthTime: null,
		deptId: null,
		sectionId: null,
		classId: null,
		eqCode: null,
		eqName: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询设备点检月记录列表 */
function getList() {
  loading.value = true;
  listSpotCheckMonth(queryParams.value).then(response => {
    spotCheckMonthList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function getClass() {
  listClassification().then(res => {
    classOptions.value = res.rows;
  })
}

/** 查询单元组织管理下拉树结构 */
async function getSectionList() {
  sectionOptions.value = [];
  await listSection({delFlag: "0",status:"0"}).then(response => {
    sectionOptions.value = response.data;
  });
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

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    eqId: null,
    monthTime: null
  };
  proxy.resetForm("spotCheckMonthRef");
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

/** 详情按钮操作 */
function handleDetail(row) {
	const id = row.id;
	router.push("/equipment/spotCheckMonth-detail/index/" + id);
}

initTreeData();
getSectionList();
getClass();
getList();
</script>

<style scoped lang="scss">
.app-container{
	padding: 0;height: 100%;
}
.dianjianjilu{
	height: 100%;background: #f5f5f5;padding:10px
}
.topform{
	background: #fff;padding: 20px 20px 10px;margin: 0 0 10px;
}
.topform .el-form-item{
	width: 100%;margin-right: 0;
}
.topform .el-form-item .el-tree-select{width: 90%;}
.topform .el-form-item .el-select{width: 90%;}
.topform .el-form-item .el-input{width: 90% !important;}
.topform .btn{
	background: #09bec5;color: #fff;border: 0;
}
.botbox{
    height: calc(100% - 140px);
    margin: 10px 0 0;
}
.botbox .el-card{border: 0;height: 100%;}
.botbox .el-card :deep(.el-card__body) {
  height: calc(100% - 60px);
}
.botbox .card-header{
	border-left: 5px solid #09bec5;
	line-height: 1;padding-left: 10px;
}
.botbox :deep(.el-card__header) {
	padding: 15px;
}
.pagination-container{
	position: relative;margin-top:20px;
}
:deep(.el-pagination.is-background .el-pager li:not(.disabled).active) {
	background: #09bec5 !important;
}

:deep(.el-table th.el-table__cell) {
	background: #09bec5 !important;
	color: #fff;
	text-align: center;padding:5px 0;
}
:deep(.el-table .cell) {
	text-align: center;padding:0;
}
.botbox .detbtn{color: #09bec5;}

</style>