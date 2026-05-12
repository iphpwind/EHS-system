<template>
  <div class="power">
	<el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
		<div class="head-container">
          <el-input
              v-model="deptName"
              placeholder="请输入部门名称"
              clearable
              prefix-icon="Search"
              style="margin-bottom: 10px"
          />
        </div>
		<div class="qysb">
			<div class="tree">
			<h4>{{user.secondDeptName != null ? user.secondDeptName : user.dept.deptName}}</h4>
			</div>
        </div>
        <div class="head-container down-tree">
          <el-tree
              :data="deptOptions"
              :props="{ label: 'label', children: 'children' }"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="deptTreeRef"
              default-expand-all
              @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
    <div class="power-con">
      <el-card :body-style="{ padding: '10px' }">
        <el-row :gutter="15">
          <el-col :span="24">
            <!--区域设备导航-->
            <el-row :gutter="30">
              <el-col :span="24" style="border-left: 1px solid #e7e8ed;">
                <div class="sbgl-com">
                  <el-row :gutter="12" >
                    <el-col :lg="6" :xl="6" class="gl" v-for="item in ammeterList">
                      <el-card :body-style="{ padding: '10px 10px 20px' }" @click.native = "handleTimePower(item)" v-hasPermi="['energy:timePower:list']">
                        <el-row>
                          <el-col :span="24">
                            <div class="li-title">
                              <img src="@/assets/images/name-ico.png">
                              <div class="name">{{ item.sensorName }}</div>
                            </div>
                          </el-col>
                        </el-row>

                        <div class="li-con">
                          <el-row class="li-con-nr">
                            <el-col :span="12"><div class="tit">电力区域</div></el-col>
                            <el-col :span="12"><div class="text-right number">{{ item.areaName }}</div></el-col>
                          </el-row>
                          <el-row class="li-con-nr">
                            <el-col :span="12"><div class="tit">设备编号</div></el-col>
                            <el-col :span="12"><div class="text-right number">{{item.sensorId}}</div></el-col>
                          </el-row>

                        </div>
                      </el-card>
                    </el-col>

                  </el-row>
                </div>

                <div class="page">
                  <pagination
                      v-show="total>0"
                      :total="total"
                      v-model:page="queryParams.pageNum"
                      v-model:limit="queryParams.pageSize"
                      @pagination="getList"
                  />
                </div>

<!--								<el-table v-loading="loading" :data="ammeterList" >-->
<!--									<el-table-column label="序号" align="center" prop="id" />-->
<!--									<el-table-column label="电力区域" align="center" prop="areaName" />-->
<!--									<el-table-column label="传感器id" align="center" prop="sensorId" />-->
<!--									<el-table-column label="传感器名称" align="center" prop="sensorName" />-->
<!--									<el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px">-->
<!--									<template #default="scope">-->
<!--										<el-button-->
<!--										type="text"-->
<!--										icon="zoom-in"-->
<!--										@click="handleTimePower(scope.row)"-->
<!--										v-hasPermi="['energy:timePower:list']"-->
<!--										>冻结电量</el-button>-->
<!--									</template>-->
<!--									</el-table-column>-->
<!--								</el-table>-->

              </el-col>
            </el-row>




          </el-col>
        </el-row>
      </el-card>
    </div>

		<el-dialog v-model="open" width="1500px">
			<el-card :body-style="{ padding: '10px' }">
				<el-row>
					<el-col :span="24">
						<div class="header">
							<div class="card-tit">冻结电量</div>
						</div>
					</el-col>
				</el-row>
				<el-row class="freeze-con">
					<el-col :span="24">
						<div class="button-ico">
							<el-button class="btn" :class="timeTypeClass('日')" round @click="switchTimeType('日')">日</el-button>
							<el-button class="btn" :class="timeTypeClass('月')" round @click="switchTimeType('月')">月</el-button>
							<el-button class="btn" :class="timeTypeClass('年')" round @click="switchTimeType('年')">年</el-button>
							<el-button class="btn" :class="timeTypeClass('时间段')" round @click="switchTimeType('时间段')">时间段</el-button>
						</div>
					</el-col>
					<el-col :span="24" class="freeze-nr" v-if="timeType=='时间段'">
						<div class="fl pading10" >
							<div class="fl tit">开始日期</div>
							<div class="fl">
								<el-date-picker v-model="queryParams2.beginTime" placeholder="请选择开始日期" clearable value-format="YYYY-MM-DD" type="date"></el-date-picker>
							</div>
						</div>
						<div class="fl pading10" >
							<div class="fl tit">结束日期</div>
							<div class="fl">
								<el-date-picker v-model="queryParams2.endTime" placeholder="请选择结束日期" clearable value-format="YYYY-MM-DD" type="date"></el-date-picker>
							</div>
						</div>
						<div class="fl pading10" >
							<el-button class="inquirebtn" @click="getChartData">查询</el-button>
						</div>
					</el-col>
				</el-row>
        <el-row :gutter="15">
					<el-col :span="24" style="border-left: 1px solid #e7e8ed;">
						<div class="nyjc-con">
							<el-row :gutter="10">
								<el-col :span="5">
									<el-card class="box-card" :body-style="{ padding: '10px' }">
										<el-row>
											<div class="fl"><img src="@/assets/images/ny-ico-1.png"></div>
											<div class="fl shuzi">
												<div class="title blue">{{timePower.electricAllSum}}</div>
												<div class="xtit">冻结电量&nbsp;<span v-if="timePower.ycUnit != null">({{timePower.ycUnit}})</span></div>
											</div>
										</el-row>
									</el-card>
								</el-col>
								<el-col :span="5">
									<el-card class="box-card" :body-style="{ padding: '10px' }">
										<el-row>
											<div class="fl"><img src="@/assets/images/ny-ico-2.png"></div>
											<div class="fl shuzi">
												<div class="title red">{{timePower.electricSpikeSum}}</div>
												<div class="xtit">尖电量&nbsp;<span v-if="timePower.ycUnit != null">({{timePower.ycUnit}})</span></div>
											</div>
										</el-row>
									</el-card>
								</el-col>
								<el-col :span="5">
									<el-card class="box-card" :body-style="{ padding: '10px' }">
										<el-row>
											<div class="fl"><img src="@/assets/images/ny-ico-3.png"></div>
											<div class="fl shuzi">
												<div class="title orange">{{timePower.electricPeakSum}}</div>
												<div class="xtit">峰电量&nbsp;<span v-if="timePower.ycUnit != null">({{timePower.ycUnit}})</span></div>
											</div>
										</el-row>
									</el-card>
								</el-col>
								<el-col :span="5">
									<el-card class="box-card" :body-style="{ padding: '10px' }">
										<el-row>
											<div class="fl"><img src="@/assets/images/ny-ico-4.png"></div>
											<div class="fl shuzi">
												<div class="title yellow">{{timePower.electricFlatSum}}</div>
												<div class="xtit">平电量&nbsp;<span v-if="timePower.ycUnit != null">({{timePower.ycUnit}})</span></div>
											</div>
										</el-row>
									</el-card>
								</el-col>
								<el-col :span="5">
									<el-card class="box-card" :body-style="{ padding: '10px' }">
										<el-row>
											<div class="fl"><img src="@/assets/images/ny-ico-5.png"></div>
											<div class="fl shuzi">
												<div class="title green">{{timePower.electricValleySum}}</div>
												<div class="xtit">谷电量&nbsp;<span v-if="timePower.ycUnit != null">({{timePower.ycUnit}})</span></div>
											</div>
										</el-row>
									</el-card>
								</el-col>

							</el-row>

						</div>
						<div class="chart-con" id="chart">

						</div>
					</el-col>
				</el-row>

			</el-card>
		</el-dialog>
		</el-col>
	</el-row>
  </div>
</template>

<script setup name="Monitor">
import { areatreeselect } from "@/api/energy/area";
import { listAmmeter, getAmmeter, delAmmeter, addAmmeter, updateAmmeter } from "@/api/energy/ammeter";
import { getTimePower } from "@/api/energy/timePower";
import {getUserProfile} from "@/api/system/user";
import {deptAndElectricAreaTreeSelect} from "@/api/energy/energyoverview";
import {parseTime} from '@/utils/ruoyi'

const { proxy } = getCurrentInstance();
const timeType = ref("日");
const ammeterList = ref([]);
const open = ref(false);
const loading = ref(true);
const total = ref(0);
const areaName = ref("");
const areaOptions = ref(undefined);
const sensorData = ref({});
const myChart = ref(undefined);
const user = ref({dept: {}});
const deptOptions = ref("");
const filterNode = (value, data) => {
	if (!value) return true;
	return data.label.indexOf(value) !== -1;
}
const deptName = ref("");

const data = reactive({
	queryParams: {
		pageNum: 1,
		pageSize: 12,
		electricAreaId: null,
		deptId: null,
	},
  queryParams2: {
		id: null,
		equipId: null,
		timeType: null,
		beginTime: null,
		endTime: null,
  },
	timePower:{
		electricAllSum: 0,
		electricSpikeSum: 0,
		electricPeakSum: 0,
		electricFlatSum: 0,
		electricValleySum: 0,
	},
	defaultProps: {
		children: 'children',
		label: 'label'
	},
});

const { queryParams, queryParams2, buttons, timePower, defaultProps } = toRefs(data);
/** 根据名称筛选组织树 */
watch(deptName, val => {
  proxy.$refs["deptTreeRef"].filter(val);
});

function getUser() {
  getUserProfile().then(response => {
    user.value = response.data;
  });
};

/** 查询区域下拉树结构 */
function getTreeSelect() {
	deptAndElectricAreaTreeSelect({status:"0",delFlag:'0'}).then(response => {
	deptOptions.value = response.data;
  });
};

/** 查询电表列表 */
function getList() {
  loading.value = true;
  listAmmeter(queryParams.value).then(response => {
    ammeterList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

 /** 节点单击事件 */
function handleNodeClick(data) {
	queryParams.value.electricAreaId = '';
	queryParams.value.deptId = '';
	if(data.type != null){
		queryParams.value.electricAreaId = data.id;
	}else{
		queryParams.value.deptId = data.id;
	}
	handleQuery();
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

function handleTimePower(row){
	queryParams2.value.id = row.id;
	queryParams2.value.equipId = row.sensorId;
	open.value = true;
	switchTimeType("日")
}

function timeTypeClass(type){
	if(type == timeType.value){
		return "active";
	}
}

function switchTimeType(type){
	timeType.value = type;
	var date = new Date();
	if(type == "时间段"){
		queryParams2.value.beginTime = parseTime(date, '{y}-{m}-{d}');
		queryParams2.value.endTime = parseTime(date, '{y}-{m}-{d}');
	}
	getChartData()
}
//查询图表数据
function getChartData(){
	if(timeType.value == "时间段"){
		if(queryParams2.value.beginTime == null){
			proxy.$modal.msgError("请选择开始时间");
			return;
		}
		if(queryParams2.value.endTime == null){
			proxy.$modal.msgError("请选择结束时间");
			return;
		}
	}
	queryParams2.value.timeType = timeType.value;
	getTimePower(queryParams2.value).then(response => {
		if(response.code == 200){
			timePower.value = response.data;
			chart();
		}
	});

}
//绘制图表
function chart() {
	if(myChart.value != null && myChart.value != "" && myChart.value != undefined){
		myChart.value.dispose();
	}
	const chartmaindom = document.getElementById('chart');
	chartmaindom.removeAttribute('_echarts_instance_');
	// 基于准备好的dom，初始化echarts实例
	myChart.value = proxy.echarts.init(document.getElementById('chart'))
	var dateList = [queryParams2.value.beginTime]
	if(queryParams2.value.beginTime != queryParams2.value.endTime){
		dateList.push(queryParams2.value.endTime)
	}
	var min = 0
	var max = 1000
	if(timePower.value.dateList.length>0){
		dateList = timePower.value.dateList
		min = null
		max = null
	}
	myChart.value.setOption({
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		legend: {
			right: '3%'
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: [
			{
				type: 'category',
				data: dateList
			}
		],
		yAxis: [
			{
				type: 'value',
				min: min,
				max: max,
        axisLabel: {
          show:true,
          //Y轴数值可添加百分号
          formatter: '{value}'+timePower.value.ycUnit,
        },
			}
		],
		series: [
			{
				name: '谷电量',
				type: 'bar',
				stack: 'Ad',
				emphasis: {
					focus: 'series'
				},
				itemStyle: {
					normal: { color: "#8fc31f" },
				},
				barWidth: 17,
				data: timePower.value.valleyValues

			},
			{
				name: '平电量',
				type: 'bar',
				stack: 'Ad',
				emphasis: {
					focus: 'series'
				},
				itemStyle: {
					normal: { color: "#fff45c" },
				},
				barWidth: 17,
				data: timePower.value.flatValues
			},
			{
				name: '峰电量',
				type: 'bar',
				stack: 'Ad',
				emphasis: {
					focus: 'series'
				},
				itemStyle: {
					normal: { color: "#ec6941" },
				},
				barWidth: 17,
				data: timePower.value.peakValues
			},
			{
				name: '尖电量',
				type: 'bar',
				stack: 'Ad',
				emphasis: {
					focus: 'series'
				},
				itemStyle: {
					normal: { color: "#d9031e" },
				},
				barWidth: 17,
				data: timePower.value.spikeValues
			},
		]
	});
}

getUser();
getTreeSelect();
getList();

</script>

<style lang="scss" scoped>
.fl{
  float: left;
}
.text-right{
  text-align: right;
}
.pading10{
  padding:20px 10px 0;
}
.blue{
  color: #0facd5;
}
.red{
  color: #ff5722;
}
.yellow{
  color:#c2b82d;
}
.orange{
  color: #f09a33;
}
.green{
  color: #57bf67;
}
.page{
  //.pagination-container{
  //  margin: 10px 0 30px;
  //}
}
.sbgl-com{
  min-height: calc(100vh - 220px);
  .gl{
    margin-bottom: 10px;
  }
  .li-title{
    padding: 20px;
    text-align: center;
    border-bottom: 1px solid #f5f5f5;
    margin-bottom: 10px;
    .name{
        font-size: 14px;
        margin: 6px 0 0;
    }
  }
  .li-con{
    font-size: 12px;
    color: #5c5c5c;
    .li-con-nr{
      line-height: 30px;
      padding: 0 10px;
    }

  }
}

.nyjc-con{
  padding: 20px;
  :deep(.el-col-5) {
    max-width: 20%;
  }
  .box-card{
    img{
      vertical-align: middle;
      margin-right: 10px;
      padding: 30px 0;
    }
    .title{
      font-size: 40px;
      white-space: nowrap;
      font-weight: bold;
      letter-spacing: -2px;
    }
    .xtit{
      font-size: 14px;
    }
    .shuzi{
      margin-top: 25px;
    }
  }
}

.power{
  padding: 15px;
  .header{
    padding: 0 0 10px;
    border-bottom: 1px solid #f0f0f0;
  }
  .card-tit {
    padding-left: 10px;
    border-left: 5px solid #09bec5;
    font-size: 18px;
  }
  .freeze-con{
    padding: 15px;
    .button-ico{
      .btn{
        border: 0;
        padding: 0 20px;
        height: 24px;
      }
      .active{
        color: #fff;
        background: #09bec5;
      }
    }
  }
  .freeze-nr{
    .tit{
      line-height: 32px;
      padding-right: 6px;
    }
    .inquirebtn{
      background: #09bec5;
      color: #fff;
      border: none;
    }
  }

  .power-con{
    //margin-top: 10px;
    .qysb{
      .qysb-head{
        margin: 10px 0;
        .title{
          color: #333333;
          font-size: 18px;
        }
        .ico{
          margin-top: 4px;
        }
      }
      .tree{
        h4{
          margin: 0px 0 10px;
          color: #09bec5;
          font-weight: bold;
          font-size: 16px;
          border-bottom: 1px solid #e7e8ed;
          padding: 0 0 15px;
        }

      }

    }
  }
  .chart-con{
    height: calc(100vh - 510px);

  }
}

</style>
