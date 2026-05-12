<template>
  <div class="ytgczyjsxy">
		<div class="toptitle">
			<img src="@/assets/images/ytgczyjsxy/toptit.png" @load="topimageLoaded"/>
		  <div class="fangda">
		    <i v-if="size == 'small'" style="cursor: pointer;" @click="changeSize()">
					<img src="@/assets/images/fangda.png">
				</i>
		    <i v-if="size == 'big'" style="cursor: pointer;" @click="changeSize()">
					<img src="@/assets/images/suoxiao.png">
				</i>
		  </div>
			<div class="toptime">
				{{ datetime }}
			</div>
		</div>
		<div class="main" :style="{ height: maniHt}">
			<el-row>
				<el-col :span="8">
					<div class="leftbox">
						<div class="lfbox lfbox1">
							<div class="boxtit">设备情况</div>
							<div class="boxbox sbqk">
								<el-row :gutter="10">
									<el-col :span="8">
										<div class="item">
											<img src="@/assets/images/ytgczyjsxy/gailan-ico1.png"/>
											<div class="sbqkrt">
												<h4>在线设备</h4>
												<h5>72<span>个</span></h5>
											</div>
										</div>
									</el-col>
									<el-col :span="8">
										<div class="item">
											<img src="@/assets/images/ytgczyjsxy/gailan-ico2.png"/>
											<div class="sbqkrt">
												<h4>离线设备</h4>
												<h5>72<span>个</span></h5>
											</div>
										</div>
									</el-col>
									<el-col :span="8">
										<div class="item">
											<img src="@/assets/images/ytgczyjsxy/gailan-ico3.png"/>
											<div class="sbqkrt">
												<h4>故障设备</h4>
												<h5>72<span>个</span></h5>
											</div>
										</div>
									</el-col>
								</el-row>
							</div>
						</div>
						<div class="lfbox">
							<div class="boxtit">故障报警</div>
							<div class="boxbox">
								<div class="mytable">
									<el-table :data="warnList" stripe height="100%">
										<el-table-column prop="name" label="设备名称" />
										<el-table-column prop="local" label="设备位置" />
										<el-table-column prop="time" label="报警时间" width="160" />
									</el-table>
								</div>
							</div>
						</div>
						<div class="lfbox">
							<div class="boxtit">近七天每日加工件数</div>
							<div class="boxbox">
								<div id="jgnum"></div>
							</div>
						</div>
						<div class="lfbox">
							<div class="boxtit">近七天每日加工时间</div>
							<div class="boxbox">
								<div id="jgtime"></div>
							</div>
						</div>
					</div>
				</el-col>
				<el-col :span="16">
					<div class="rightbox">
						<div class="righttopbtn">
							<div class="item">运行</div>
							<div class="item">待机</div>
							<div class="item">告警</div>
							<div class="item">停机</div>
						</div>
						<div class="camera">
							<div class="item" v-for="(item, index) in cameraList" :key="index">
								<div class="midbox">
									<img v-if="item.status === '运行中'" src="@/assets/images/ytgczyjsxy/equipbox1.png" />
									<img v-if="item.status === '待机'" src="@/assets/images/ytgczyjsxy/equipbox2.png" />
									<img v-if="item.status === '告警'" src="@/assets/images/ytgczyjsxy/equipbox3.png" />
									<img v-if="item.status === '停机'" src="@/assets/images/ytgczyjsxy/equipbox4.png" />
									<h5>{{ item.name }}</h5>
									<div class="videoico" @click="videoTanchu(item, index)">
										<el-icon><VideoCameraFilled /></el-icon>
									</div>
									<div class="infozhezhao">
										<div class="info">
											<div class="tit">
												<img src="@/assets/images/ytgczyjsxy/infotitcicle.png"/>
												{{ item.name }}
											</div>
											<p>设备状态<span>运行中</span></p>
											<p>主轴转速<span>12200</span></p>
											<p>主轴负载<span>222121</span></p>
											<p>工件计数<span>212</span></p>
											<p>加工时间<span>28h</span></p>
										</div>
									</div>
								</div>
							</div>
							<div class="fourvideo">
								<div class="bigvdico" @click="videoTanchu">
									<img src="@/assets/images/ytgczyjsxy/videoico.png"/>
								</div>
								<div class="bigvdico" @click="videoTanchu">
									<img src="@/assets/images/ytgczyjsxy/videoico.png"/>
								</div>
							</div>
						</div>
						<el-dialog
							v-model="videoDialog"
							width="70%"
						>
							<template #title>
								<div class="myheader">
									<div class="tit">
										<img src="@/assets/images/ytgczyjsxy/infotitcicle.png"/>
										实时监控
										<span style="margin-left: 15px;font-weight: normal;">{{ datetime }}</span>
									</div>
								</div>
							</template>
							<div class="videobox">
								
							</div>
							
						</el-dialog>
						<div class="mytable">
							<el-table :data="gongdanList" stripe height="100%">
								<el-table-column prop="number" label="工单号" width="180" />
								<el-table-column prop="people" label="加工人员" />
								<el-table-column prop="equip" label="加工设备" />
								<el-table-column prop="starttime" label="开工时间" width="160" />
								<el-table-column prop="endtime" label="下工时间" width="160" />
								<el-table-column prop="status" label="加工状态" />
								<el-table-column prop="worktime" label="工时" width="80" />
								<el-table-column prop="score" label="分数" width="80" />
							</el-table>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
  </div>
</template>

<script>
import * as echarts from '@/utils/echarts'
export default {
  data() {
    return {
      maniHt: '',
      size: 'small',
      isFullscreen: false,
			datetime: '',
			warnList: [
				{
					name: '机床A',
					local: '设备故障',
					time: '2023-12-11 14:05:02'
				},{
					name: '机床A',
					local: '设备故障',
					time: '2023-12-11 14:05:02'
				},{
					name: '机床A',
					local: '设备故障',
					time: '2023-12-11 14:05:02'
				},{
					name: '机床A',
					local: '设备故障',
					time: '2023-12-11 14:05:02'
				},{
					name: '机床A',
					local: '设备故障',
					time: '2023-12-11 14:05:02'
				}
			],
			cameraList: [
				{
					name: 'BH001',
					status: '运行中'
				},{
					name: 'BH002',
					status: '待机'
				},{
					name: 'BH003',
					status: '告警'
				},{
					name: 'BH004',
					status: '停机'
				},{
					name: 'BH005',
					status: '运行中'
				},{
					name: 'BH006',
					status: '运行中'
				},{
					name: 'BH007',
					status: '运行中'
				},{
					name: 'BH008',
					status: '运行中'
				},{
					name: 'BH009',
					status: '运行中'
				},{
					name: 'BH010',
					status: '运行中'
				},{
					name: 'BH011',
					status: '运行中'
				},{
					name: 'BH012',
					status: '运行中'
				},{
					name: 'BH013',
					status: '运行中'
				},{
					name: 'BH014',
					status: '运行中'
				}
			],
			gongdanList: [
				{
					number: 'BH201212312101213',
					people: '张三三',
					equip: '机床',
					starttime: '2023-12-11 14:05:02',
					endtime: '2023-12-11 14:05:02',
					status: '运行',
					worktime: '9',
					score: '98'
				},{
					number: 'BH201212312101213',
					people: '张三三',
					equip: '机床',
					starttime: '2023-12-11 14:05:02',
					endtime: '2023-12-11 14:05:02',
					status: '运行',
					worktime: '9',
					score: '98'
				},{
					number: 'BH201212312101213',
					people: '张三三',
					equip: '机床',
					starttime: '2023-12-11 14:05:02',
					endtime: '2023-12-11 14:05:02',
					status: '运行',
					worktime: '9',
					score: '98'
				},{
					number: 'BH201212312101213',
					people: '张三三',
					equip: '机床',
					starttime: '2023-12-11 14:05:02',
					endtime: '2023-12-11 14:05:02',
					status: '运行',
					worktime: '9',
					score: '98'
				},{
					number: 'BH201212312101213',
					people: '张三三',
					equip: '机床',
					starttime: '2023-12-11 14:05:02',
					endtime: '2023-12-11 14:05:02',
					status: '运行',
					worktime: '9',
					score: '98'
				},{
					number: 'BH201212312101213',
					people: '张三三',
					equip: '机床',
					starttime: '2023-12-11 14:05:02',
					endtime: '2023-12-11 14:05:02',
					status: '运行',
					worktime: '9',
					score: '98'
				},{
					number: 'BH201212312101213',
					people: '张三三',
					equip: '机床',
					starttime: '2023-12-11 14:05:02',
					endtime: '2023-12-11 14:05:02',
					status: '运行',
					worktime: '9',
					score: '98'
				},{
					number: 'BH201212312101213',
					people: '张三三',
					equip: '机床',
					starttime: '2023-12-11 14:05:02',
					endtime: '2023-12-11 14:05:02',
					status: '运行',
					worktime: '9',
					score: '98'
				}
			],
			videoDialog: false,
    }
  },

  watch: {

  },
  created() {
    
  },

  mounted: function () {
		
		this.nowTimer = setInterval(() => {
			this.getNowTime();
		}, 1000);
		
		setTimeout(() => {
		  this.jgnumChart();
		  this.jgtimeChart();
		}, 500);
  },

  unmounted() {
    clearInterval(this.nowTimer)
  },

  methods: {
		getNowTime() {
			//获取当前日期、时间、周几
			let yy = new Date().getFullYear();
			let mm = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
			let dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
			let hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours();
			let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
			let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
			var gettime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss;
			//当前星期
			let wk = new Date().getDay();
			let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
			let week = weeks[wk];
			this.datetime = gettime + ' ' + week;   //年-月-日 时间 星期
		},
		topimageLoaded() {
		  let topHt = document.querySelector('.toptitle').clientHeight + 'px';
		  this.maniHt = 'calc(100% - ' + topHt + ' - 15px)';
		},
		toggleScreen() {
		  // 切换全屏r
		  // 如果当前未开启 点击就开启  如果已开启 点击关闭全屏
		  if (this.isFullScreen) {
		    // 关闭
		    document.exitFullscreen()
		  } else {
		    // 打开
		    document.documentElement.requestFullscreen()
		  }
		  this.isFullScreen = !this.isFullScreen
		},
		changeSize() {
		  this.toggleScreen()
		  if (this.size == 'small') {
		    this.size = 'big'
		    document.querySelector('.sidebar-container').style = "width:0!important";
		    document.querySelector('.main-container').style = "margin-left:0!important";
		    document.querySelector('.app-main').style.minHeight = '100vh';
		    document.querySelector('.ytgczyjsxy').style.minHeight = '100vh';
		    document.querySelector('.navbar').style.display = 'none';
		    document.querySelector('.tags-view-container').style.display = 'none';
		    document.querySelector('.hit').style.height = 'calc(100vh - 60px)';
			} else if (this.size == 'big') {
		    this.size = 'small'
		    document.querySelector('.sidebar-container').style.width = "";
		    document.querySelector('.main-container').style.marginLeft = "";
		    document.querySelector('.navbar').style.display = 'block';
		    document.querySelector('.app-main').style.minHeight = 'calc(100vh - 84px)';
		    document.querySelector('.ytgczyjsxy').style.minHeight = 'calc(100vh - 84px)';
		    document.querySelector('.tags-view-container').style.display = 'block'
		    document.querySelector('.hit').style.height = '100%';
		  }
		},
		jgnumChart() {
			let chartDom = document.getElementById('jgnum');
			let myChart = echarts.init(chartDom);
			let option;
			option = {
				tooltip: {
					trigger: 'axis'
				},
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [{
							offset: 0, color: '#b5d7fe' // 0% 处的颜色
					}, {
							offset: 1, color: '#4d92f1' // 100% 处的颜色
					}],
					global: false // 缺省为 false
				},
				grid: {
					top: '22%',
					bottom: '14%',
					left: '12%',
					right: '5%'
				},
			  xAxis: {
			    type: 'category',
			    data: ['12-11','12-12','12-12','12-13','12-14','12-15','12-15'],
					axisLine: {
					  lineStyle: {
					    color: '#fff',
					  }
					},
			  },
			  yAxis: {
			    type: 'value',
					name: "件",
					axisLine: {
						show: true,
					  lineStyle: {
					    color: '#fff',
					  },
					},
					splitNumber: 4,
					splitLine: {
					  lineStyle: {
					    color: "rgba(255, 255, 255, .1)",
							type: "dashed"
					  }
					},
			  },
			  series: [
			    {
			      data: [120, 200, 150, 80, 70, 110, 130],
			      type: 'bar',
						barWidth: 15,
			      showBackground: true,
			      backgroundStyle: {
			        color: 'rgba(255, 255, 255, 0.2)'
			      }
			    }
			  ]
			};
			option && myChart.setOption(option);
		},
		jgtimeChart(){
			let chartDom = document.getElementById('jgtime');
			let myChart = echarts.init(chartDom);
			let option;
			option = {
				tooltip: {
					trigger: 'axis'
				},
				color: ['#00eaff'],
				grid: {
					top: '22%',
					bottom: '14%',
					left: '12%',
					right: '5%'
				},
			  xAxis: {
			    type: 'category',
			    boundaryGap: false,
			    data: ['12-11','12-12','12-12','12-13','12-14','12-15','12-15'],
			    axisLine: {
			      lineStyle: {
			        color: '#fff',
			      }
			    },
			  },
			  yAxis: {
			    type: 'value',
					name: "小时",
					axisLine: {
						show: true,
					  lineStyle: {
					    color: '#fff',
					  },
					},
					splitNumber: 4,
					splitLine: {
					  lineStyle: {
					    color: "rgba(255, 255, 255, .1)",
							type: "dashed"
					  }
					},
			  },
			  series: [
			    {
			      data: [820, 932, 901, 934, 1290, 1330, 1320],
			      type: 'line',
						smooth: true,
			      areaStyle: {
							color: {
								type: 'linear',
								x: 0,
								y: 0,
								x2: 0,
								y2: 1,
								colorStops: [{
										offset: 0, color: 'rgba(0,234,255,0.6)' // 0% 处的颜色
								}, {
										offset: 1, color: 'rgba(0,234,255,0)' // 100% 处的颜色
								}],
								global: false // 缺省为 false
							},
						}
			    }
			  ]
			};
			option && myChart.setOption(option);
		},
		videoTanchu(item, id) {
			this.videoDialog = true;
		},
  },

}
</script>


<style scoped lang="scss">
.ytgczyjsxy {
  height: calc(100vh - 84px);
  position: relative;
  background: url("@/assets/images/ytgczyjsxy/bg.jpg") no-repeat;
  background-size: 100% 100%;
	
	.toptitle{
		img{width: 100%;display: block;}
		
		.toptime{
			position: absolute;left: 20px;
	    top: 18px;font-size: 14px;
	    color: #2aa7d3;
		}
	  .fangda {
	    position: absolute;
	    right: 20px;
	    top: 15px;
	    font-size: 18px;
	    color: #2aa7d3;
	  }
	}
	.main{
		padding: 0 20px;
		:deep .el-row{
			height: 100%;
			.el-col{
				height: 100%;position: relative;
			}
		}
		.mytable{
			height: 100%;
			:deep .el-table{
				background: transparent;
				td.el-table__cell,
				th.el-table__cell.is-leaf{
					border: 0;
				}
				.el-table__header-wrapper th{
					background: transparent !important;
					color: #cee1ff;
					font-weight: normal;font-size: 15px;
					text-align: center;
				}
				tr{
					background: transparent
				}
				.el-table__header{
					background: transparent;
				}
				tr.el-table__row--striped td.el-table__cell,
				tr:hover td.el-table__cell{
					// background: #122e5e;
					background: transparent;
				}
				td.el-table__cell{
					color: #fff;padding: 5px 0;
					background: #0a2041;text-align: center;
				}
				.el-table__inner-wrapper::before{
					display: none;
				}
				.cell{
					padding: 0 5px;
				}
			}
		}
		.leftbox{
			padding-right: 30px;
			height: 100%;
			.lfbox{
				height: 28%;
				.boxtit{
					font-size: 18px;font-weight: bold;line-height: 36px;
					font-style: italic;color: #fff;padding-left: 30px;
					background: url("@/assets/images/ytgczyjsxy/boxtitbg.png") no-repeat;
					background-size: 100% 100%;
				}
				.boxbox{
					height: calc(100% - 36px);
					.mytable{
						height: calc(100% - 12px);
					}
				}
				.sbqk{
					.item{
						height: 100%;
						display: flex;
						align-items: center;
						justify-content: center;
						img{
							width: 50px;
						}
						.sbqkrt{
							width: calc(100% - 50px);text-align: center;
						}
						h4{
							margin: 0 0 5px;color: #fff;font-size: 15px;
							background: url("@/assets/images/ytgczyjsxy/gailan-line.png") no-repeat bottom;
							background-size: 100%;
							padding-bottom: 5px;
						}
						h5{
							margin: 0;font-size: 24px;
							color: #0ef1fa;
							span{
								font-size: 14px;color: #fff;
							}
						}
					}
					.item::before,.item::after{
						content: '';clear: both;display: table;
					}
				}
				#jgnum{
					height: 100%;
				}
				#jgtime{
					height: 100%;
				}
			}
			.lfbox1{
				height: 16%;
			}
		}
		.rightbox{
			height: 100%;
			
			.righttopbtn{
				text-align: right;margin: 0 0 10px;
				.item{
					display: inline-block;
					margin-left: 10px;
					font-size: 16px;color: #fff;font-style: italic;
					width: 100px;text-align: center;line-height: 40px;
				}
				.item:nth-child(1){
					background: url("@/assets/images/ytgczyjsxy/statusbg1.png") no-repeat center;
					background-size: 100%;
				}
				.item:nth-child(2){
					background: url("@/assets/images/ytgczyjsxy/statusbg2.png") no-repeat center;
					background-size: 100%;
				}
				.item:nth-child(3){
					background: url("@/assets/images/ytgczyjsxy/statusbg3.png") no-repeat center;
					background-size: 100%;
				}
				.item:nth-child(4){
					background: url("@/assets/images/ytgczyjsxy/statusbg4.png") no-repeat center;
					background-size: 100%;
				}
			}
			.camera{
				height: 50%;
				background: url("@/assets/images/ytgczyjsxy/equiplist-bg.png") no-repeat;
				background-size: 100% 100%;
				padding: 15px 30px;
				position: relative;
				.item{
					width: 14.28%;float: left;
					height: 50%;text-align: center;
					position: relative;
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					.midbox{
						position: relative;
						height: 120px;
						img{
							max-width: 100%;height: 100%;
						}
						h5{
							position: absolute;top: 10px;color: #fff;
							text-align: center;width: 100%;
							margin: 0;
						}
						.videoico{
							position: absolute;left: -10px;top: -20px;
							width: 30px;height: 30px;line-height: 30px;
							color: #0ef1fa;border: 1px solid #0ef1fa;
							border-radius: 50%;
							background: rgba(0,0,0,.2);
							z-index: 1;
							cursor: pointer;
						}
						.infozhezhao{
							width: 80%;height: calc(100% - 20px);
							position: absolute;top: 20px;left: 10%;
							cursor: pointer;z-index: 8;
						}
						.info{
							background: url("@/assets/images/ytgczyjsxy/infobg.png") no-repeat;
							background-size: 100% 100%;
							width: 300px;height: 200px;
							padding: 20px 15px 0 60px;
							position: absolute;left: 65%;bottom: -30px;
							z-index: 9;
							text-align: left;
							pointer-events: auto;
							display: none;
							.tit{
								background: url("@/assets/images/ytgczyjsxy/info-line1.png") no-repeat bottom;
								background-size: 100%;
								padding-bottom: 8px;margin: 0 0 10px;
								font-weight: bold;font-size: 15px;color: #fff;
								img{
									vertical-align: middle;
								}
							}
							p{
								color: #fff;line-height: 2;font-size: 13px;
								margin: 0;
								span{
									color: #b1d6ff;margin-left: 10px;
								}
							}
						}
					}
					.infozhezhao:hover .info{
						display: block;
					}
				}
				.fourvideo{
					img{
						width: 40px;
					}
					.bigvdico{
						position: absolute;cursor: pointer;
					}
					.bigvdico:nth-child(1){
						left: -10px;top: 50%;transform: translateY(-50%);
					}
					.bigvdico:nth-child(2){
						right: -10px;top: 50%;transform: translateY(-50%);
					}
				}
			}
			.camera::before,.camera::after{
				content: '';clear: both;display: table;
			}
			:deep .el-dialog{
				background: url("@/assets/images/ytgczyjsxy/info-titbg.png") repeat;
				.tit{
					background: url("@/assets/images/ytgczyjsxy/info-line2.png") no-repeat bottom;
					background-size: 100%;
					padding-bottom: 10px;margin: 0 0 10px;
					font-weight: bold;font-size: 15px;color: #fff;
					img{
						vertical-align: middle;
					}
				}
				.el-dialog__body{
					padding-top: 0;
				}
				.videobox{
					height: 420px;
				}
			}
			.mytable{
				height: calc(50% - 65px);margin-top: 15px;
				padding: 10px 15px;border: 1px solid #113f6b;
			}
		}
	}
}

</style>




