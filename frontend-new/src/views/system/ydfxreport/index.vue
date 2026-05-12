<template>
  <div class="report" v-loading="loading">
		<div class="tit">用电分析报告</div>
    <div class="month">
      <el-select v-model="hiubaovalue" placeholder="请选择汇报类型">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker
          v-if="hiubaovalue=='1'"
          v-model="year"
          type="year"
          value-format="YYYY"
          @change="selectTime"
          placeholder="请选择年份"
      />
      <el-date-picker
          v-if="hiubaovalue=='2'"
          v-model="month"
          type="month"
          value-format="YYYY/MM"
          @change="selectTime"
          placeholder="请选择月份"
      />
      <el-button @click="chaxun" class="btn">查询</el-button>
    </div>
		<el-dialog
			v-model="monthmsg"
			title="温馨提示"
			width="30%"
		>
			<span>请选择月份！</span>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="monthmsg = false">关闭</el-button>
				</span>
			</template>
		</el-dialog>

		<div class="reportbox" id="myprint">
			<div class="top">
				<div class="bg">
					<img src="@/assets/images/report-top.jpg"/>
				</div>
				<div class="ico">
					<img src="@/assets/images/report-ico1.png" width="40" v-print="'#myprint'"/>
					<img src="@/assets/images/report-ico2.png" width="40"/>
				</div>
				<div class="word">
					<h1>用电分析报告</h1>
					<p>企业名称：{{deptName}}</p>
					<p v-if="hiubaovalue=='1'">报告日期：{{year}}</p>
					<p v-if="hiubaovalue=='2'">报告日期：{{month}}</p>
				</div>
			</div>
			<div class="info">
				<div class="box">
					<h3>概况</h3>
					<table class="gaikuang" cellspacing="0">
						<tr>
							<td>用户名称</td>
							<td colspan="4">{{userName}}</td>
						</tr>
						<tr>
							<td>用户地址</td>
							<td colspan="4"></td>
						</tr>
						<tr>
							<td>报告日期</td>
							<td colspan="4">{{month==''?"":month+'/01 - '}}{{month == ''?"":month+"/"+currMonthDays}}</td>
						</tr>
						<tr>
							<td>监测点数</td>
							<td>总耗能</td>
							<td>同比</td>
							<td>环比</td>
							<td>异常总数</td>
						</tr>
						<tr>
							<td>{{allEqNum}}</td>
							<td>{{powerTotal}}</td>
							<td>{{yoy !=''?yoy+'%':''}}</td>
							<td>{{mom !=''?mom+'%':''}}</td>
							<td>{{alarmTotal}}</td>
						</tr>
					</table>
				</div>
				<div class="box">
					<h3>能耗分析</h3>
					<div class="whitebg">
						<h4>日能耗分析</h4>
						<div id="nhfx"></div>
					</div>
					<div class="whitebg" style="margin: 20px 0 0;">
						<h4>峰平谷电费统计</h4>
						<div class="table">
							<el-table :data="tableData1" border
							style="width: 100%"
							>
								<el-table-column prop="leibie" label="类别" />
								<el-table-column prop="yongdian" label="用电"/>
								<el-table-column prop="danjia" label="单价" />
								<el-table-column prop="dianfei" label="电费" />
							</el-table>
						</div>
					</div>
				</div>
				<div class="box">
					<h3>能耗排名</h3>
					<div class="whitebg">
						<div class="table">
							<el-table :data="tableData2" border
							style="width: 100%"
							>
								<el-table-column type="index" label="排名" width="80px" />
								<el-table-column prop="areaName" label="名称"/>
								<el-table-column prop="price" label="累计电费" />
								<el-table-column prop="power" label="累计电量" />
								<el-table-column prop="unitPrice" label="单位成本" />
							</el-table>
						</div>
					</div>
				</div>
				<div class="box">
					<h3>异常报告</h3>
					<div class="table" style="padding:20px 0">
						<el-table :data="tableData3" border
						style="width: 100%;"
						>
							<el-table-column prop="zongshu" label="异常总数" />
							<el-table-column prop="yichuli" label="已处理"/>
							<el-table-column prop="weichuli" label="未处理" />
							<el-table-column prop="tongbi" label="同比" />
							<el-table-column prop="huanbi" label="环比" />
						</el-table>
					</div>
					<div class="whitebg">
						<h4>异常排名统计</h4>
						<div class="table">
							<el-table :data="tableData4" border
							style="width: 100%"
							>
								<el-table-column type="index" label="排名" />
								<el-table-column prop="alarmName" label="异常名称"/>
								<el-table-column prop="alarmNum" label="异常数量" />
								<el-table-column prop="alarmRate" label="异常占比(%)" />
							</el-table>
						</div>
					</div>
				</div>
			</div>
		</div>
  </div>
</template>

<script>
import * as echarts from '@/utils/echarts'
import { onLine } from "@/api/energy/energyoverview";
import { analysisReport,analysisReportAlertTotal,getReportTimePowerByArea,getReportTimePowerRankByArea,analysisReportAlertDetail,analysisReportAlertRank} from "@/api/report/index";
import { ElLoading } from 'element-plus'

export default {
  name: "用电分析报告",
  data() {
    return {
      month: '',
      year:'',
	  tableData1:[],
		tableData2:[],
		tableData3:[],
		tableData4:[],
	  deptName:'',
	  userName:'',
	  currMonthDays:0,
	  allEqNum:0,
	  powerTotal:0,
	  yoy:'',
	  mom:'',
	  alarmTotal:'',
	  dateList:[],
	  flatValues:[],
	  peakValues:[],
	  priceValues:[],
	  spikeValues:[],
	  valleyValues:[],
		loading: false,
		monthmsg: false,
      options: [{
        value: '1',
        label: '年报'
      }, {
        value: '2',
        label: '月报'
      }],
      hiubaovalue:'',
    }
  },

  watch: {

  },
  created() {
    const store = useStore();
	const getters = computed(() => store.getters);
	this.deptName = store.getters.user.dept.deptName;
	this.userName = store.getters.user.nickName;
  },

  mounted: function () {
    this.$nextTick(() => {
			this.nhfx();
		})
  },

  methods: {
	analysisReportAlertRank(){
	  if(this.hiubaovalue=='1'){
      var params = {
        unit:"year",
        date: this.year
      }
    }else{
      var params = {
        unit:"month",
        date: this.month
      }
    }
		analysisReportAlertRank(params).then(res =>{
			this.tableData4 = [];
			this.tableData4 = res;
		})
	},
	analysisReportAlertDetail(){
    if(this.hiubaovalue=='1'){
      var params = {
        unit:"year",
        date: this.year
      }
    }else{
      var params = {
        unit:"month",
        date: this.month
      }
    }

		analysisReportAlertDetail(params).then(res =>{
			this.tableData3 = [];
			var alarmData = {
				zongshu : res.alarmAll,
				yichuli : res.alarmDeal,
				weichuli : res.alarmNDeal,
				tongbi : res.alarmYoy > 0?res.alarmYoy+'%':'',
				huanbi : res.alarmMom > 0?res.alarmMom+'%':''
			}
			this.tableData3.push(alarmData)
		})
	},
	getReportTimePowerRankByArea(){
    if(this.hiubaovalue=='1'){
      var params = {
        unit:"year",
        date: this.year
      }
    }else{
      var params = {
        unit:"month",
        date: this.month
      }
    }

		getReportTimePowerRankByArea(params).then(res =>{
			this.tableData2 = res.data.reportPowerRankDataVOList
			var total = {
				areaName: "累计",
				price:res.data.priceTotal,
				power:res.data.powerTotal,
				unitPrice: res.data.powerTotal > 0?parseFloat(res.data.priceTotal/res.data.powerTotal).toFixed(2):''
			}
			this.tableData2.push(total);
			this.loading.close();
      		this.loading = false;
		})
	},
	getReportTimePowerByArea(){
    if(this.hiubaovalue=='1'){
      var params = {
        unit:"year",
        date: this.year
      }
    }else{
      var params = {
        unit:"month",
        date: this.month
      }
    }

		getReportTimePowerByArea(params).then(res =>{
			var speak = {
				leibie: '尖',
				yongdian: res.data.electricSpikeSum,
				danjia: "undefined" == typeof res.data.electricTimeMap[0] ?'':res.data.electricTimeMap[0],
				dianfei: "undefined" == typeof res.data.electricTimeMap[0] ?'':res.data.electricTimeMap[0] * res.data.electricSpikeSum
			}
			var peak = {
				leibie: '峰',
				yongdian: res.data.electricPeakSum,
				danjia: "undefined" == typeof res.data.electricTimeMap[1] ?'':res.data.electricTimeMap[1],
				dianfei: "undefined" == typeof res.data.electricTimeMap[1] ?'':res.data.electricTimeMap[1] * res.data.electricPeakSum
			}
			var flat = {
				leibie: '平',
				yongdian: res.data.electricFlatSum,
				danjia: "undefined" == typeof res.data.electricTimeMap[2] ?'':res.data.electricTimeMap[2],
				dianfei: "undefined" == typeof res.data.electricTimeMap[2] ?'':res.data.electricTimeMap[2] * res.data.electricFlatSum
			}
			var valley = {
				leibie: '谷',
				yongdian: res.data.electricValleySum,
				danjia: "undefined" == typeof res.data.electricTimeMap[3] ?'':res.data.electricTimeMap[3],
				dianfei: "undefined" == typeof res.data.electricTimeMap[3] ?'':res.data.electricTimeMap[3] * res.data.electricValleySum
			}
			var total = {
				leibie: '累计',
				yongdian: res.data.electricAllSum,
				danjia: '--',
				dianfei: speak.dianfei+peak.dianfei+flat.dianfei+valley.dianfei
			}
			this.tableData1 = [];
			this.tableData1.push(speak)
			this.tableData1.push(peak)
			this.tableData1.push(flat)
			this.tableData1.push(valley)
			this.tableData1.push(total)
			this.dateList = res.data.dateList;
			this.flatValues = res.data.flatValues;
			this.peakValues = res.data.peakValues;
			this.spikeValues = res.data.spikeValues;
			this.valleyValues = res.data.valleyValues;
			this.priceValues = res.data.priceValues;
			this.nhfx();
		})
	},
	getAlarmTotal(){
    if(this.hiubaovalue=='1'){
      var params = {
        unit:"year",
        date: this.year
      }
    }else{
      var params = {
        unit:"month",
        date: this.month
      }
    }

		analysisReportAlertTotal(params).then(res =>{
			this.alarmTotal = res
		})
	},
	getTotalPowerData(){
    if(this.hiubaovalue=='1'){
      var params = {
        unit:"year",
        date: this.year
      }
    }else{
      var params = {
        unit:"month",
        date: this.month
      }
    }

		analysisReport(params).then(res =>{
			this.powerTotal = res.data.all;
			this.yoy = '';
			this.mom = '';
			if(res.data.yoy != 0){
				this.yoy = res.data.yoy;
			}
			if(res.data.mom != 0){
				this.mom = res.data.mom;
			}
		})
	},
	getOnline() {
      onLine().then(res => {
        let data = res.data
        if (null !== data && typeof data !== 'undefined') {
          this.allEqNum = data.allEq
        }
      })
    },
	selectTime(val){
	  console.log(val);
    var date;
	  if(this.hiubaovalue=='1'){
      date = new Date(val,0 ,0);
    }else{
      date = new Date(val.split('/')[0],val.split('/')[1] ,0);
    }
		this.currMonthDays = date.getDate();
	  console.log(this.currMonthDays )
	},
    chaxun() {
			if(this.currMonthDays>0){
				this.getOnline();
				this.getTotalPowerData();
				this.getAlarmTotal();
				this.getReportTimePowerByArea();
				this.getReportTimePowerRankByArea();
				this.analysisReportAlertDetail();
				this.analysisReportAlertRank();

				//loading
				this.loading = ElLoading.service({
					target: document.querySelector('.app-main'),
					fullscreen: false,
					lock: true,
					text: 'Loading',
					background: 'rgba(0, 0, 0, 0.5)',
				})
			}else{
				this.monthmsg = true;
			}

		},
		nhfx() {
			let chartDom = document.getElementById('nhfx');
			let myChart = echarts.init(chartDom);
			let option;

			option = {
			  tooltip: {
			    trigger: 'axis',
			  },
				grid: {
					top: '20%',
					bottom: '6%',
					right: '4%',
					left: '8%'
				},
				color: ['#8fc31f','#fff45c','#ec6941','#d9031e','#43ad7f7f'],
			  legend: {
			    data: ['谷电量', '平电量', '峰电量', '尖电量','电费'],
					icon: 'circle',
					left: 'auto',
					right: '15px',
					top: '15px'
			  },
			  xAxis: [
			    {
			      type: 'category',
				  interval: '0',
			      data: this.dateList,
			    }
			  ],
			  yAxis: [
			    {
			      type: 'value',
						axisLine : {
							show: true
						}
			    }
			  ],
			  series: [
			    {
			      name: '谷电量',
			      type: 'bar',
				  stack: 'Ad',
				  barWidth: '20px',
			      data: this.valleyValues
			    },
			    {
			      name: '平电量',
			      type: 'bar',
				  stack: 'Ad',
			      data: this.flatValues
			    },
			    {
			      name: '峰电量',
			      type: 'bar',
				  stack: 'Ad',
			      data: this.peakValues
			    },
			    {
			      name: '尖电量',
			      type: 'bar',
				  stack: 'Ad',
			      data: this.spikeValues
			    },
				{
			      name: '电费',
			      type: 'line',
			      data: this.priceValues
			    }
			  ]
			};

			option && myChart.setOption(option);
		}
  },

}
</script>


<style scoped lang="scss">
@media print{
	.top{
		color: #fff;position:relative;
	}
	.top .bg{
		width: 100%;
	}
	.top .ico{
		position: absolute;right: 5%;top: 7%;z-index: 9;
		img{margin-left: 20px;cursor: pointer;}
	}
	.top .word{
		position: absolute;top: 20%;left: 6.5%;
	}
	.top .word	h1{
			font-size: 70px;font-weight: bold;padding-top: 20%;
	}
	.top .word	p{
			font-size: 20px;
	}
	.gaikuang{
		width: 100%;border: 2px solid #eaeaea;
		border-collapse:collapse;
		border-spacing: 0;
		tr{

		}
		tr:nth-child(odd){
			background: #e4f5fd;
		}
		tr:nth-child(even){
			background: #f2fafd;
		}
		tr:last-child{
			background: #fff;
		}
		td{
			border: 1px solid #eaeaea;padding: 15px 0;
			text-align: center;
		}
	}

	.reportbox .info {
	  background: url("@/assets/images/report-bg.jpg") no-repeat;
	  background-size: 100%;
	}
	.reportbox .info .box {
	  padding: 0 50px 30px;
	}
	.reportbox .info .box h3 {
	  font-weight: bold;
	  font-size: 30px;
	  margin: 0;
	  padding: 50px 0;
	}
	.reportbox .info .box #nhfx {
	  height: 300px;
	}

	.reportbox .info .box .whitebg {
	  background: #fff;
	  border-radius: 5px;
	  padding: 5px;
	  box-shadow: 0 0 10px #f2fafd;
	}
	.reportbox .info .box .whitebg h4 {
	  margin: 0;
	  background: #d9ecfd;
	  padding: 10px 15px;
	  font-size: 16px;
	  font-weight: bold;
	}
	.reportbox .info .box .table {
	  padding: 20px 30px;
	  font-size: 16px;
	}

	.reportbox .info .box .table :deep(.el-table .el-table__header-wrapper th,
	.reportbox .info .box .table :deep(.el-table .el-table__fixed-header-wrapper th)) {
	  background: #def2fd !important;
	  color: #333 !important;
	}
	.reportbox .info .box .table :deep(.el-table .cell) {
	  font-size: 16px;
	  padding: 5px 0;
	  text-align: center;
	}
}

.report {
  padding: 15px;
	height: calc(100vh - 84px);
	overflow-y: scroll;
	.tit{
		padding: 0 15px;line-height: 1;
		border-left: 5px solid #09bec5;margin: 10px 0 0;
	}
	.month{
		padding: 15px 15px;margin: 15px 0 20px;
		border-top: 1px solid #eaeaea;font-size:14px;
		.btn{
			margin-top: -2px;margin-left: 10px;
			background: #09bec5;color: #fff;border-color: #09bec5;
		}
	}
	.reportbox{
		width: 889px;margin: 0 auto;
		.top{
			color: #fff;position:relative;
			.bg{
				width: 100%;
			}
			.ico{
				position: absolute;right: 5%;top: 7%;z-index: 9;
				img{margin-left: 20px;cursor: pointer;}
			}
			.word{
				position: absolute;top: 20%;left: 6.5%;
				h1{
					font-size: 70px;font-weight: bold;padding-top: 20%;
				}
				p{
					font-size: 20px;
				}
			}
		}
		.info{
			background: url("@/assets/images/report-bg.jpg") no-repeat;
			background-size: 100%;
			.box{
				padding: 0 50px 30px;
				h3{
					font-weight: bold;font-size: 30px;margin: 0;
					padding: 50px 0;
				}
				#nhfx{height: 300px;}
				.gaikuang{
					width: 100%;border: 2px solid #eaeaea;
					border-collapse:collapse;
					border-spacing: 0;
					tr{

					}
					tr:nth-child(odd){
						background: #e4f5fd;
					}
					tr:nth-child(even){
						background: #f2fafd;
					}
					tr:last-child{
						background: #fff;
					}
					td{
						border: 1px solid #eaeaea;padding: 15px 0;
						text-align: center;
					}
				}
				.whitebg{
					background: #fff;border-radius: 5px;padding:5px;
					box-shadow: 0 0 10px #f2fafd;
					h4{
						margin: 0;background:#d9ecfd;padding: 10px 15px;
						font-size: 16px;font-weight: bold;
					}

				}
				.table{
					padding: 20px 30px;font-size:16px;
					:deep(.el-table) {
						width: 100%;
						.el-table__header-wrapper th,
						.el-table__fixed-header-wrapper th{
							background: #def2fd !important;
							color: #333 !important;
						}
						.cell{
							font-size: 16px;padding: 5px 0;text-align: center;
						}
					}
				}
			}
		}
	}
}

</style>




