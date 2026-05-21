<template>
  <div class="peixunresult">
		<div class="idtopchoose">
			<el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
				<el-form-item label="所属机构" prop="enterpriseCode">
					<el-input
						v-model="queryParams.enterpriseCode"
						placeholder="请输入所属机构"
						clearable
						@keyup.enter="handleQuery"
					/>
				</el-form-item>
				<el-form-item label="所属分类" prop="category">
					<el-input
						v-model="queryParams.category"
						placeholder="请输入所属分类"
						clearable
						@keyup.enter="handleQuery"
					/>
				</el-form-item>
				<el-form-item label="培训学时" prop="duration">
					<el-input
						v-model="queryParams.duration"
						placeholder="请输入培训学时"
						clearable
						@keyup.enter="handleQuery"
					/>
				</el-form-item>
				<el-form-item label="培训日期" prop="trainingDate">
					<el-date-picker clearable
						v-model="queryParams.trainingDate"
						type="date"
						value-format="YYYY-MM-DD"
						placeholder="请选择培训日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="培训单位" prop="trainingOrganization">
					<el-input
						v-model="queryParams.trainingOrganization"
						placeholder="请输入培训单位"
						clearable
						@keyup.enter="handleQuery"
					/>
				</el-form-item>
				<el-form-item label="培训讲师" prop="trainer">
					<el-input
						v-model="queryParams.trainer"
						placeholder="请输入培训讲师"
						clearable
						@keyup.enter="handleQuery"
					/>
				</el-form-item>
				<el-form-item label="参加人数" prop="participantCount">
					<el-input
						v-model="queryParams.participantCount"
						placeholder="请输入参加人数"
						clearable
						@keyup.enter="handleQuery"
					/>
				</el-form-item>
				<el-form-item label="总分" prop="totalScore">
					<el-input
						v-model="queryParams.totalScore"
						placeholder="请输入总分"
						clearable
						@keyup.enter="handleQuery"
					/>
				</el-form-item>
				<el-form-item label="及格分数" prop="passingScore">
					<el-input
						v-model="queryParams.passingScore"
						placeholder="请输入及格分数"
						clearable
						@keyup.enter="handleQuery"
					/>
				</el-form-item>
				<el-form-item label="培训地点" prop="location">
					<el-input
						v-model="queryParams.location"
						placeholder="请输入培训地点"
						clearable
						@keyup.enter="handleQuery"
					/>
				</el-form-item>
				<el-form-item label="考核单位" prop="assessmentOrganization">
					<el-input
						v-model="queryParams.assessmentOrganization"
						placeholder="请输入考核单位"
						clearable
						@keyup.enter="handleQuery"
					/>
				</el-form-item>
				<el-form-item label="培训费用" prop="trainingCost">
					<el-input
						v-model="queryParams.trainingCost"
						placeholder="请输入培训费用"
						clearable
						@keyup.enter="handleQuery"
					/>
				</el-form-item>
				<el-form-item label="是否完成" prop="isCompleted">
					<el-input
						v-model="queryParams.isCompleted"
						placeholder="请输入是否完成"
						clearable
						@keyup.enter="handleQuery"
					/>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
					<el-button icon="Refresh" @click="resetQuery">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
		
		<div class="chartrow">
			<el-row :gutter="15">
				<el-col :span="8">
					<el-card :body-style="{ padding: '10px' }">
					  <div class="clearfix header">
					    <span class="card-tit">计划完成情况</span>
					  </div>
					  <div class="echart">
					    <div id="chart1"></div>
					  </div>
					</el-card>
				</el-col>
				<el-col :span="16">
					<el-card :body-style="{ padding: '10px' }">
					  <div class="clearfix header">
					    <span class="card-tit">本年度按月完成情况</span>
					  </div>
					  <div class="echart">
					    <div id="chart2"></div>
					  </div>
					</el-card>
				</el-col>
			</el-row>
		</div>
		
		
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['safework:result:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:result:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:result:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
		
    <el-table v-loading="loading" :data="resultList" 
		@selection-change="handleSelectionChange"
		
		>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="所属计划" align="center" prop="planId" />
      <el-table-column label="所属机构" align="center" prop="enterpriseCode" />
      <el-table-column label="所属分类" align="center" prop="category" />
      <el-table-column label="培训学时" align="center" prop="duration" />
      <el-table-column label="培训日期" align="center" prop="trainingDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.trainingDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="培训单位" align="center" prop="trainingOrganization" />
      <el-table-column label="培训讲师" align="center" prop="trainer" />
      <el-table-column label="培训简介" align="center" prop="description" />
      <el-table-column label="参加人数" align="center" prop="participantCount" />
      <el-table-column label="总分" align="center" prop="totalScore" />
      <el-table-column label="及格分数" align="center" prop="passingScore" />
      <el-table-column label="培训地点" align="center" prop="location" />
      <el-table-column label="考核单位" align="center" prop="assessmentOrganization" />
      <el-table-column label="培训费用" align="center" prop="trainingCost" />
      <el-table-column label="是否完成" align="center" prop="isCompleted" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:result:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:result:remove']"
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

    <!-- 添加或修改线下培训结果对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="resultRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属计划" prop="planName">
          <el-input v-model="form.planName" placeholder="请输入所属计划" /> <el-button @click="getPlans()">选择</el-button>
        </el-form-item>
        <el-form-item label="所属分类" prop="category">
          <el-input v-model="form.category" placeholder="请输入所属分类" />
        </el-form-item>
        <el-form-item label="培训学时" prop="duration">
          <el-input v-model="form.duration" placeholder="请输入培训学时" />
        </el-form-item>
        <el-form-item label="培训日期" prop="trainingDate">
          <el-date-picker clearable
            v-model="form.trainingDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择培训日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="培训单位" prop="trainingOrganization">
          <el-input v-model="form.trainingOrganization" placeholder="请输入培训单位" />
        </el-form-item>
        <el-form-item label="培训讲师" prop="trainer">
          <el-input v-model="form.trainer" placeholder="请输入培训讲师" />
        </el-form-item>
        <el-form-item label="培训简介" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="参加人数" prop="participantCount">
          <el-input v-model="form.participantCount" placeholder="请输入参加人数" />
        </el-form-item>
        <el-form-item label="总分" prop="totalScore">
          <el-input v-model="form.totalScore" placeholder="请输入总分" />
        </el-form-item>
        <el-form-item label="及格分数" prop="passingScore">
          <el-input v-model="form.passingScore" placeholder="请输入及格分数" />
        </el-form-item>
        <el-form-item label="培训地点" prop="location">
          <el-input v-model="form.location" placeholder="请输入培训地点" />
        </el-form-item>
        <el-form-item label="考核单位" prop="assessmentOrganization">
          <el-input v-model="form.assessmentOrganization" placeholder="请输入考核单位" />
        </el-form-item>
        <el-form-item label="培训费用" prop="trainingCost">
          <el-input v-model="form.trainingCost" placeholder="请输入培训费用" />
        </el-form-item>
        <el-form-item label="上传附件" prop="fileUrl">
          <FileUpload
              v-model.value="form.fileUrl"
          />
        </el-form-item>
        <el-form-item label="是否完成" prop="isCompleted">
          <el-select v-model="form.isCompleted" placeholder="请选择">
            <el-option label="是" value="1"/>
            <el-option label="否" value="0"/>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog :title="planTitle" v-model="planListOpen" width="800px" append-to-body>
      <el-table v-loading="loading" :data="planList" ref="myTable" @selection-change="handlePlanSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="所属分类" align="center" prop="categoryName" />
      <el-table-column label="编码" align="center" prop="code" />
      <el-table-column label="计划名称" align="center" prop="name" />
    </el-table>
    <pagination
      v-show="planTotal>0"
      :total="planTotal"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getPlanList"
    />
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="planSubmitForm">确 定</el-button>
          <el-button @click="planListOpen = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Result">
import { listResult, getResult, delResult, addResult, updateResult,getPlanCountByStatusAndMonth,getPlanCountByStatus } from "@/api/safework/result";
import { listPlan } from "@/api/safework/plan";
import * as echarts from '@/utils/echarts'
import {h} from "vue";

const { proxy } = getCurrentInstance();

const resultList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const planTitle = ref("培训计划");
const planListOpen = ref(false);
const planList = ref([]);
const planTotal = ref(0);

const data = reactive({
  form: {
    fileUrl:null},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    planId: null,
    enterpriseCode: null,
    category: null,
    duration: null,
    trainingDate: null,
    trainingOrganization: null,
    trainer: null,
    description: null,
    participantCount: null,
    totalScore: null,
    passingScore: null,
    location: null,
    assessmentOrganization: null,
    trainingCost: null,
    attachmentId: null,
    isCompleted: null,
    status: null
  },
  rules: {
    planId: [
      { required: true, message: "所属计划不能为空", trigger: "blur" }
    ],
  },
	line:[],
  pie:[],
});

const { queryParams, form, rules,line,pie } = toRefs(data);
function getPlanCountByStatusForPie(){
  getPlanCountByStatus(queryParams.value).then(response => {
    var data = response.data;
    data.forEach(item => {
      let arr = {
        value: item.count,
        name:item.isCompleted == '0'?'未完成':'已完成'
      }
      pie.value.push(arr);
    })   
  });
}
function getPlanCountByMonth(){
  getPlanCountByStatusAndMonth(queryParams.value).then(response => {
    line.value = response.data
  });
}
/** 查询线下培训结果列表 */
function getList() {
  loading.value = true;
  listResult(queryParams.value).then(response => {
    resultList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}
/** 查询线下培训计划列表 */
function getPlanList() {
  listPlan(queryParams.value).then(response => {
    planList.value = response.rows;
    planTotal.value = response.total;
  });
}
// 多选框选中数据
function handlePlanSelectionChange(selection) {

  if (selection.length > 1) {
    proxy.$refs.myTable.clearSelection();
    proxy.$refs.myTable.toggleRowSelection(selection.pop());
  }
  if(selection.length != 0){
    form.value = {
      planName : selection.map(item => item.name),
      planId : selection[selection.length - 1].id
    }; 
  }
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 提交按钮 */
function planSubmitForm() {
   planListOpen.value = false;
}
// 取消按钮
function cancel() {
  open.value = false;
  reset();
}
function getPlans(){
  planListOpen.value = true;

}
// 表单重置
function reset() {
  form.value = {
    id: null,
    planId: null,
    enterpriseCode: null,
    category: null,
    duration: null,
    trainingDate: null,
    trainingOrganization: null,
    trainer: null,
    description: null,
    participantCount: null,
    totalScore: null,
    passingScore: null,
    location: null,
    assessmentOrganization: null,
    trainingCost: null,
    attachmentId: null,
    isCompleted: null,
    status: "0"
  };
  proxy.resetForm("resultRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
  getPlanCountByMonth();
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
  title.value = "添加线下培训结果";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getResult(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改线下培训结果";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["resultRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateResult(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addResult(form.value).then(response => {
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
    return delResult(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/result/export', {
    ...queryParams.value
  }, `result_${new Date().getTime()}.xlsx`)
}

getList();
getPlanList();
getPlanCountByMonth();
getPlanCountByStatusForPie();
//2个图表
function chartOne() {
	const chartDom = document.getElementById('chart1');
	let myChart = proxy.echarts.init(chartDom);
	myChart.setOption({
		tooltip: {
		  trigger: 'item'
		},
		legend: {
		  top: 'middle',
		  right: '0',
			orient: "vertical"
		},
		title: {
			// text: '0',
			// subtext: '计划数',
			left: "center",
			top: "center",
			textStyle: {
				fontSize: 20
			},
			subtextStyle: {
				fontSize: 13,
				color: '#999'
			},
			itemGap: 0
		},
		series: [
		  {
		    name: '',
		    type: 'pie',
		    // radius: ['60%', '80%'],
		    avoidLabelOverlap: false,
		    label: {
		      show: false,
		      position: 'center'
		    },
		    emphasis: {
		      label: {
		        show: false,
		        fontSize: 40,
		        fontWeight: 'bold'
		      }
		    },
		    labelLine: {
		      show: false
		    },
		    data: pie.value
		  }
		]
	});
}

function chartTwo() {
	const chartDom2 = document.getElementById('chart2');
	let myChart2 = proxy.echarts.init(chartDom2);
	myChart2.setOption({
		tooltip: {
			trigger: 'axis'
		},
		grid: {
			left: '5%',
			right: '5%',
			bottom: '16%',
			top: '15%'
		},
		xAxis: {
			type: 'category',
			data: line.value.date,
			axisLine: {
				lineStyle: {
					color: "#09bec5"
				}
			}
		},
		yAxis: {
			type: 'value',
			axisLine: {
				show: true,
				lineStyle: {
					color: "#09bec5"
				}
			}
		},
		series: [
			{
				data: line.value.done,
				type: 'line'
			}
		]
	});
}

setTimeout(() => {
	chartOne();
	chartTwo();
}, 500)


</script>
<style scoped lang="scss">
	.peixunresult{
		height: calc(100vh - 84px);
		overflow: auto;
		padding: 10px;
		background: #f8f8f8;
		
		.idtopchoose{
			background: #fff;padding: 5px 10px;
			margin: 0 0 10px;
			:deep(.el-form-item) {
				margin-top: 5px;margin-bottom: 5px;
			}
		}
		.chartrow{
			height: 26%;margin: 0 0 10px;
			:deep(.el-row) {
				height: 100%;
				.el-col{
					height: 100%;
				}
			}
			:deep(.el-card) {
				height: 100%;
				.el-card__body{
					height: 100%;
				}
			}
			.header{
				padding-bottom: 10px;
				border-bottom: 1px solid #eee;
			}
			.card-tit{
				padding-left: 10px;border-left: 5px solid #09bec5;
				font-size: 18px;
			}
			.echart{
				height: calc(100% - 30px);
				#chart1{
					height: 100%;
					margin-left: -30%;
					width: 130%;
				}
				#chart2{
					height: 100%;
				}
			}
		}
		
	}
	
</style>
