<template>
	<div class="rybjtongji">
		<div class="floor1">
			<el-row :gutter="10">
				<el-col :span="9">
					<div class="box">
						<div class="tit">
							<h4>报警类别</h4>
							<div class="righttab">
								<span :class="[typewarnTab===0?'active':'']" @click="typewarnTabClick(0)">当天</span>
								<span :class="[typewarnTab===1?'active':'']" @click="typewarnTabClick(1)">近7天</span>
							</div>
						</div>
						<div class="typewarn">
							<el-row>
								<el-col :span="12">
									<div id="typewarnchart"></div>
								</el-col>
								<el-col :span="12">
									<div class="item" v-for="item in alarmHistoryList">
										<div class="num">{{ item.value }}</div>
										<div class="h5">{{ item.name }}</div>
									</div>
								</el-col>
							</el-row>
						</div>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="box">
						<div class="tit">
							<h4>电子围栏报警</h4>
							<div class="righttab">
								<span :class="[fencewarnTab===0?'active':'']" @click="fencewarnTabClick(0)">当天</span>
								<span :class="[fencewarnTab===1?'active':'']" @click="fencewarnTabClick(1)">近7天</span>
							</div>
						</div>
						<div class="fencewarn">
							<div id="fencewarnchart"></div>
						</div>
					</div>
				</el-col>
				<el-col :span="9">
					<div class="box">
						<div class="tit">
							<h4>人员趋势报警</h4>
							<div class="righttab">
								<span :class="[qushiwarnTab===0?'active':'']" @click="qushiwarnTabClick(0)">当天</span>
								<span :class="[qushiwarnTab===1?'active':'']" @click="qushiwarnTabClick(1)">近7天</span>
							</div>
						</div>
						<div class="qushiwarn">
							<div id="qushiwarnchart"></div>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="floor1 floor2">
			<el-row :gutter="10">
				<el-col :span="9">
					<div class="box">
						<div class="tit">
							<h4>聚集预警分级</h4>
						</div>
						<div class="jjyjfj">
							<el-row>
								<el-col :span="12">
									<div id="jjyjfj"></div>
								</el-col>
								<el-col :span="12">
									<div class="jjyjright">
										<div class="item">
											<h4>红色预警<span>0</span></h4>
											<div class="line"></div>
										</div>
										<div class="item">
											<h4>橙色预警<span>0</span></h4>
											<div class="line"></div>
										</div>
										<div class="item">
											<h4>黄色预警<span>10</span></h4>
											<div class="line"></div>
										</div>
									</div>
								</el-col>
							</el-row>
						</div>
					</div>
				</el-col>
				<el-col :span="15">
					<div class="box">
						<div class="tit">
							<h4>聚集预警</h4>
						</div>
						<div class="jjyjlinechart">
							<div id="jjyjlinechart"></div>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="floor1 floor3">
			<el-row :gutter="10">
				<el-col :span="9">
					<div class="box">
						<div class="tit">
							<h4>聚集区域预警</h4>
						</div>
						<div class="jjqyyj">
							<el-table :data="jjqyyjData" style="width: 100%" height="100%">
								<el-table-column prop="name" label="聚集区域名" width="120" />
								<el-table-column prop="number" label="预警数" />
								<el-table-column prop="red" label="红色预警" />
								<el-table-column prop="orange" label="橙色预警" />
								<el-table-column prop="yellow" label="黄色预警" />
							</el-table>
						</div>
					</div>
				</el-col>
				<el-col :span="15">
					<div class="box">
						<div class="tit">
							<h4>区域聚集预警</h4>
						</div>
						<div class="qyjjyjchart">
							<div id="qyjjyjchart"></div>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script setup name="Tongji">
	import {
	  listAlarm,
	  getAlarm,
	  delAlarm,
	  addAlarm,
	  updateAlarm,
	  handler,
	  alarmHistory7,
	  alarmHistory30, alarmTrend30, alarmTrend7
	} from "@/api/safework/zyalarm";
	import {h} from "vue";
	
	const {proxy} = getCurrentInstance();
	
	import * as echarts from '@/utils/echarts'
	import jquery from "jquery";
	const typewarnTab = ref(0);
	const fencewarnTab = ref(0);
	const qushiwarnTab = ref(0);
	const alarmHistoryList = ref([]);
	const alarmTrendNameList = ref([]);
	const alarmTrendList = ref([]);
	const alarmTrendHandleList = ref([]);
	const jjqyyjData = ref([
		{
			name: '酚醒环氧乙炔',
			number: '19',
			red: '0',
			orange: '1',
			yellow: '18'
		},{
			name: '酚醒环氧乙炔',
			number: '19',
			red: '0',
			orange: '1',
			yellow: '18'
		},{
			name: '酚醒环氧乙炔',
			number: '19',
			red: '0',
			orange: '1',
			yellow: '18'
		},{
			name: '酚醒环氧乙炔',
			number: '19',
			red: '0',
			orange: '1',
			yellow: '18'
		},{
			name: '酚醒环氧乙炔',
			number: '19',
			red: '0',
			orange: '1',
			yellow: '18'
		},{
			name: '酚醒环氧乙炔',
			number: '19',
			red: '0',
			orange: '1',
			yellow: '18'
		}
	]);
	function typewarnTabClick(val) {
		typewarnTab.value = val;
	  alarmHistoryList.value = []
	  if (val == 0) {
	    alarmHistory7().then(res => {
	      alarmHistoryList.value.push({name: '离岗', value: res.data['ligang'] == null ? 0 : res.data['ligang']})
	      alarmHistoryList.value.push({name: '超员', value: res.data['chaoyuan'] == null ? 0 : res.data['chaoyuan']})
	      alarmHistoryList.value.push({name: '缺员', value: res.data['queyuan'] == null ? 0 : res.data['queyuan']})
	      alarmHistoryList.value.push({name: 'SOS', value: res.data['sos'] == null ? 0 : res.data['sos']})
	      alarmHistoryList.value.push({name: '串岗', value: res.data['chuangang'] == null ? 0 : res.data['chuangang']})
	      alarmHistoryList.value.push({name: '静止', value: res.data['jingzhi'] == null ? 0 : res.data['jingzhi']})
	      console.log(alarmHistoryList.value)
	      typewarnChart();
	    })
	  } else {
	    alarmHistory30().then(res => {
	      alarmHistoryList.value.push({name: '离岗', value: res.data['ligang'] == null ? 0 : res.data['ligang']})
	      alarmHistoryList.value.push({name: '超员', value: res.data['chaoyuan'] == null ? 0 : res.data['chaoyuan']})
	      alarmHistoryList.value.push({name: '缺员', value: res.data['queyuan'] == null ? 0 : res.data['queyuan']})
	      alarmHistoryList.value.push({name: 'SOS', value: res.data['sos'] == null ? 0 : res.data['sos']})
	      alarmHistoryList.value.push({name: '串岗', value: res.data['chuangang'] == null ? 0 : res.data['chuangang']})
	      alarmHistoryList.value.push({name: '静止', value: res.data['jingzhi'] == null ? 0 : res.data['jingzhi']})
	      console.log(alarmHistoryList.value)
	      typewarnChart();
	    })
	  }
	}
	function fencewarnTabClick(val) {
		fencewarnTab.value = val;
	}
	function qushiwarnTabClick(val) {
		qushiwarnTab.value = val;
	
	  alarmTrendNameList.value = []
	  alarmTrendList.value = []
	  alarmTrendHandleList.value = []
	
	  if (1 == val) {
	    alarmTrend30().then(res => {
	      for (let key in res.data.alarm) {
	        alarmTrendNameList.value.push(key)
	        alarmTrendList.value.push(res.data.alarm[key])
	        alarmTrendHandleList.value.push(res.data.handle[key])
	      }
	      qushiwarnChart();
	    })
	  } else {
	    alarmTrend7().then(res => {
	      for (let key in res.data.alarm) {
	        alarmTrendNameList.value.push(key)
	        alarmTrendList.value.push(res.data.alarm[key])
	        alarmTrendHandleList.value.push(res.data.handle[key])
	      }
	      qushiwarnChart();
	    })
	  }
	
	}
	function typewarnChart() {
		let chartDom = document.getElementById('typewarnchart');
		let myChart = echarts.init(chartDom);
	  myChart.clear()
	  let option;
		option = {
			title: {
				text: "报警总数",
				left: "center",
				top: "center",
				textStyle: {
					fontSize: 14,
					fontWeight: 'normal',
					lineHeight: 16
				},
			},
		  tooltip: {
		    trigger: 'item'
		  },
		  legend: {
				orient: "vertical",
				right: 20,
				top: '10%'
		  },
		  series: [
		    {
		      name: '',
		      type: 'pie',
		      radius: ['35%', '50%'],
		      label: {
		        show: false,
		        position: 'center'
		      },
		      data: alarmHistoryList.value
		    }
		  ]
		};
		option && myChart.setOption(option);
	}
	
	function fencewarcChart() {
		let chartDom = document.getElementById('fencewarnchart');
		let myChart = echarts.init(chartDom);
		let option;
		option = {
			title: {
				text: "20\n报警总数",
				left: "center",
				top: "center",
				textStyle: {
					fontSize: 14,
					fontWeight: 'normal',
					lineHeight: 16
				},
			},
		  tooltip: {
		    trigger: 'item'
		  },
		  series: [
		    {
		      name: '',
		      type: 'pie',
		      radius: ['50%', '80%'],
		      roseType: 'area',
		      label: {
		        show: false,
		        position: 'center'
		      },
		      data: [
		        { value: 1048, name: 'Search' },
		        { value: 735, name: 'Direct' },
		        { value: 580, name: 'Email' },
		        { value: 484, name: 'Union Ads' },
		        { value: 300, name: 'Video Ads' }
		      ]
		    }
		  ]
		};
		option && myChart.setOption(option);
	}
	function qushiwarnChart() {
		var chartDom = document.getElementById('qushiwarnchart');
		var myChart = echarts.init(chartDom);
	  myChart.clear()
		var option;
		
		option = {
		  tooltip: {
		    trigger: 'axis'
		  },
		  legend: {
		    data: ['报警数', '已处理']
		  },
		  grid: {
		    left: '3%',
		    right: '4%',
		    bottom: '3%',
		    containLabel: true
		  },
		  xAxis: {
		    type: 'category',
		    boundaryGap: false,
		    data: alarmTrendNameList.value
		  },
		  yAxis: {
		    type: 'value'
		  },
		  series: [
		    {
		      name: '报警数',
		      type: 'line',
		      stack: 'Total',
		      data: alarmTrendList.value
		    },
		    {
		      name: '已处理',
		      type: 'line',
		      stack: 'Total',
		      data: alarmTrendHandleList.value
		    }
		  ]
		};
		option && myChart.setOption(option);
	}
	
	function jjyjfjChart() {
		let chartDom = document.getElementById('jjyjfj');
		let myChart = echarts.init(chartDom);
		let option;
		option = {
			title: {
				text: "20\n报警总数",
				left: "center",
				top: "center",
				textStyle: {
					fontSize: 14,
					fontWeight: 'normal',
					lineHeight: 16
				},
			},
		  tooltip: {
		    trigger: 'item'
		  },
		  series: [
		    {
		      name: '',
		      type: 'pie',
		      radius: ['50%', '70%'],
		      label: {
		        show: false,
		        position: 'center'
		      },
		      data: [
		        { value: 1048, name: 'Search' },
		        { value: 735, name: 'Direct' },
		        { value: 580, name: 'Email' },
		        { value: 484, name: 'Union Ads' },
		        { value: 300, name: 'Video Ads' }
		      ]
		    }
		  ]
		};
		option && myChart.setOption(option);
	}
	
	function jjyjlineChart() {
		var chartDom = document.getElementById('jjyjlinechart');
		var myChart = echarts.init(chartDom);
		var option;
		
		option = {
		  tooltip: {
		    trigger: 'axis'
		  },
		  grid: {
				top: '14%',
		    left: '3%',
		    right: '4%',
		    bottom: '0%',
		    containLabel: true
		  },
		  xAxis: {
		    type: 'category',
		    boundaryGap: false,
		    data: ['8:00', '9:00', '10:00', '11:00']
		  },
		  yAxis: {
		    type: 'value'
		  },
		  series: [
		    {
		      name: '报警数',
		      type: 'line',
		      data: [2,4,10,8]
		    },
		  ]
		};
		option && myChart.setOption(option);
	}
	
	function qyjjyjChart() {
		var chartDom = document.getElementById('qyjjyjchart');
		var myChart = echarts.init(chartDom);
		var option;
		
		option = {
		  tooltip: {
		    trigger: 'axis'
		  },
		  grid: {
				top: '14%',
		    left: '3%',
		    right: '4%',
		    bottom: '0%',
		    containLabel: true
		  },
		  xAxis: {
		    type: 'category',
		    boundaryGap: false,
		    data: ['8:00', '9:00', '10:00', '11:00']
		  },
		  yAxis: {
		    type: 'value'
		  },
		  series: [
		    {
		      name: '报警数',
		      type: 'line',
		      data: [2,4,10,8]
		    },
		  ]
		};
		option && myChart.setOption(option);
	}
	
	setTimeout(function () {
	  typewarnTabClick(0);
		fencewarcChart();
	  qushiwarnTabClick(0);
	  jjyjfjChart();
		jjyjlineChart();
		qyjjyjChart();
	}, 300)
</script>

<style scoped lang="scss">
	.rybjtongji{
		height: calc(100vh - 84px);
		overflow: auto;
		background: #f8f8f8;
		padding: 10px;
		
		.floor1{
			height: 33%;margin: 0 0 10px;
			:deep(.el-row) {
				height: 100%;
				.el-col{
					height: 100%;
					position: relative;
				}
			}
			.box{
				background: #fff;height: 100%;
				padding: 15px;
				.tit{
					position: relative;
					h4{
						font-size: 16px;margin: 0;
						font-weight: bold;color: #333;
					}
					.righttab{
						position: absolute;right: 15px;top: 0;
						span{
							color: #555;margin-left: 20px;
							font-size: 14px;
							cursor: pointer;
						}
						span.active{
							color: #09bec5;
						}
					}
				}
				.typewarn{
					height: calc(100% - 30px);
					margin: 14px 0 0;
					#typewarnchart{
						height: 100%;
						width: 130%;margin-left: -30%;
					}
					.item{
						height: 33%;width: 33.33%;float: left;
						border: 1px solid #eee;
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
						margin: -1px 0 0 -1px;
						.num{
							font-weight: bold;margin: 0 0 6px;
						}
						.h5{
							font-size: 14px;color: #999;
						}
					}
				}
				.fencewarn{
					height: calc(100% - 30px);
					margin: 14px 0 0;
					#fencewarnchart{
						height: 100%;
					}
				}
				.qushiwarn{
					height: calc(100% - 30px);
					margin: 14px 0 0;
					#qushiwarnchart{
						height: 100%;
					}
				}
			}
		}
		.floor2{
			.jjyjfj{
				height: calc(100% - 30px);
				padding-right: 10px;
				#jjyjfj{
					height: 100%;
				}
				.jjyjright{
					width: 100%;
					position: absolute;
					top: 50%;transform: translateY(-50%);
					.item{
						margin: 10px 0;
						h4{
							margin: 0;
							span{
								float: right;
							}
						}
						.line{
							height: 14px;width: 100%;
							border-radius: 10px;margin: 6px 0 0;
						}
					}
					.item:nth-child(1) .line{
						background: #d72228;
					}
					.item:nth-child(2) .line{
						background: #f08319;
					}
					.item:nth-child(3) .line{
						background: #ecc200;
					}
				}
			}
			.jjyjlinechart{
				height: calc(100% - 30px);
				#jjyjlinechart{
					height: 100%;
				}
			}
		}
		.floor3{
			height: calc(33% - 15px);margin: 0;
			.jjqyyj{
				height: calc(100% - 30px);margin: 15px 0 0;
			}
			.qyjjyjchart{
				height: calc(100% - 30px);
				#qyjjyjchart{
					height: 100%;
				}
			}
		}
	}
</style>