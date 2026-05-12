<template>
  <div class="chanxian">
		<div class="chanxianbox">
			<ul>
				<li v-for="(item,index) in data">
					<div class="jkpic">
						<img src="@/assets/images/screen/jkpic.png"/>
					</div>
					<div class="info" @click="detail(item.line,item.countDown)">
						<h3>{{item.style}}</h3>
						<h4>{{index+1}}</h4>
						<p>订单总数：{{item.orderNum}}</p>
						<p>倒计时：{{item.countDown}}</p>
						<p>今日产量：{{item.todayQuantity}}</p>
						<p>已完成：{{item.completedQuantity}}</p>
						<p>每天需完成：{{item.everydayToComplete}}</p>
					</div>
				</li>
			</ul>
		</div>

		<!-- 产线详情弹出 -->
		<div class="detailTanchu">
			<el-dialog
					v-model="dialogVisible"
					width="80%"
				>
				<div slot="title" class="dialog-title">
					 <h3>产线{{indexdata.line}}</h3>
<!--					 <span>更新时间：2022-03-29</span>-->
				</div>
				<div class="detailbox">
					<el-row :gutter="10">
						<el-col :span="7">
							<div class="border-det detinfo">
								<h4 class="det-tit">生产信息</h4>
								<div class="countdown">
									<el-row>
										<el-col :span="12">
											<img src="@/assets/images/screen/countdown.png"/>
										</el-col>
										<el-col :span="12">
											<h5>倒计时</h5>
											<p>{{countDown}}</p>
										</el-col>
									</el-row>
								</div>
								<div class="info-li">
									<div class="item">
										<h4>品名</h4>
										<h5>{{indexdata.style}}</h5>
									</div>
									<div class="item">
										<h4>款号</h4>
										<h5>{{indexdata.style}}</h5>
									</div>
									<div class="item">
										<h4>描述</h4>
										<h5>{{indexdata.style}}</h5>
									</div>
									<div class="item">
										<h4>订单数</h4>
										<h5>{{indexdata.orderNum}}</h5>
									</div>
									<div class="item">
										<h4>今日实时完成</h4>
										<h5>{{indexdata.todayQuantity}}</h5>
									</div>
									<div class="item">
										<h4>需每天完成</h4>
										<h5>{{indexdata.everydayToComplete}}</h5>
									</div>
									<div class="item">
										<h4>订单累计完成</h4>
										<h5>{{indexdata.completedQuantity}}</h5>
									</div>
									<div class="item">
										<h4>前一工作日完成</h4>
										<h5>{{indexdata.yesterdayQuantity}}</h5>
									</div>
									<div class="item">
										<h4>款式上线时间</h4>
										<h5>{{indexdata.startTime}}</h5>
									</div>
									<div class="item">
										<h4>计划下线时间</h4>
										<h5>{{indexdata.completeTime}}</h5>
									</div>
									<div class="item">
										<h4>已上线天数</h4>
										<h5>{{indexdata.onLineDays}}</h5>
									</div>
<!--									<div class="item">-->
<!--										<h4>生产评价</h4>-->
<!--										<h5>优</h5>-->
<!--									</div>-->
								</div>
							</div>
						</el-col>
						<el-col :span="14">
							<div class="border-det xiaolv">
								<h4 class="det-tit">生产效率</h4>
								<div class="xiaolv-data">
									<el-row :gutter="60">
										<el-col :span="8">
											<div class="xiaolv-left">
												<img src="@/assets/images/screen/xiaolv-line.png" class="xiaolv-line"/>
												<h3><el-icon><Star /></el-icon> 款式：{{indexdata.style}}</h3>
												<ul>
													<li>
														<h4><el-icon><Tickets /></el-icon> 今日目标</h4>
														<h5>{{orderNum}}</h5>
													</li>
													<li>
														<h4><el-icon><Finished /></el-icon> 今日完成</h4>
														<h5>{{todayQuantity}}</h5>
													</li>
													<li>
														<h4><el-icon><SetUp /></el-icon> 完成率</h4>
														<h5>{{orderRate}}%</h5>
													</li>
												</ul>
											</div>
										</el-col>
										<el-col :span="16">
											<div class="xiaolv-table">
												<el-table :data="weeklist" style="width: 100%">
													<el-table-column prop="Date" label="日期" />
													<el-table-column prop="Monday" label="星期一" width="65" />
													<el-table-column prop="Tuesday" label="星期二" width="65" />
													<el-table-column prop="Wednesday" label="星期三" width="65" />
													<el-table-column prop="Thursday" label="星期四" width="65" />
													<el-table-column prop="Friday" label="星期五" width="65" />
													<el-table-column prop="Saturday" label="星期六" width="65" />
													<el-table-column prop="Sunday" label="星期日" width="65" />
												</el-table>
											</div>
										</el-col>
									</el-row>
								</div>
								<div class="echart-tit">
									<h4>工序返工率</h4>
									<span>返工率</span>
									<i></i>
								</div>
								<div id="echart1" class="echart1"></div>
								<div class="echart-tit">
									<h4>各工序WIP</h4>
									<span>WIP</span>
									<i></i>
								</div>
								<div id="echart2" class="echart2"></div>
							</div>
						</el-col>
						<el-col :span="3">
							<div class="detpic">
								<img src="@/assets/images/screen/detpic.png"/>
							</div>
						</el-col>
					</el-row>
				</div>

			</el-dialog>
		</div>

	</div>
</template>

<script>
import * as echarts from '@/utils/echarts'
import {allindex,detail} from "@/api/jinhui/product";

export default {
  name: "chanxian",
  data() {
    return {
      dialogVisible: false,
			tableData : [{
				Date: '目标',
				Monday: '220',
				Tuesday: '220',
				Wednesday: '220',
				Thursday: '220',
				// Friday: '220',
				// Saturday: '220',
				// Sunday: '220'
			},{
				Date: '完成',
				Monday: '220',
				Tuesday: '220',
				Wednesday: '220',
				Thursday: '220',
				Friday: '220',
				Saturday: '220',
				Sunday: '220'
			},{
				Date: '完成率',
				Monday: '220',
				Tuesday: '220',
				Wednesday: '220',
				Thursday: '220',
				Friday: '220',
				Saturday: '220',
				Sunday: '220'
			},{
				Date: '返工率',
				Monday: '220',
				Tuesday: '220',
				Wednesday: '220',
				Thursday: '220',
				Friday: '220',
				Saturday: '220',
				Sunday: '220'
			}],
      wip:285,
      line:2,
      style:'ABS15346款裤子-3',
      orderNum:"0",
      completeTime:"2022-07-27 00:00:00",
      startTime:"2022-07-19 00:00:00",
      onLineDays:"8",
      todayQuantity:"0",
      onLinePerson:10,
      orderRate:0,
      weeklist:[],
      workList:[],
      fglist:[],
      gxlist:[],
      wiplist:[],
      cxlist:[1,2,3,4,5,6,7,8,9,11],
      data:[1,2,3,4,5,6,7,8,9,11],
      indexdata:[],
      data1:[],
      data2:[],
      data3:[],
      data4:[],
      data5:[],
      data6:[],
      data7:[],
      data8:[],
      data9:[],
      data10:[],
      countDown:0
    }
  },
  watch: {

  },
  created() {
    this.getall()
  },

  mounted: function () {
  },

  methods: {
    fn(i){
      return new Promise((resolve, reject) => {
        allindex(i).then(res => {
            resolve(res);
        }).catch(err => {
        })
      });
    },
    async test(i){
      let n = await this.fn(i)
      return  n
    },
    getall(){
     let  data1=[]
      for (var a=1;a<11;a++){
        data1.push(this.test(a))
      }
      Promise.all(data1).then(res => {
        this.data= res
      }).catch(err => {
        console.log('error', err)
      })
      console.log("总")
      console.log(this.data)
    },

    detail(line,num) {
      this.countDown = num
			this.dialogVisible = true;
			allindex(line).then(res => {
        this.indexdata = res
      })
      this.weeklist = []
			detail(line).then(res => {

        this.orderNum=res.orderNum
        this.orderRate=res.orderRate
        this.todayQuantity=res.todayQuantity

        this.weeklist.push(res.targetlist)
        this.weeklist.push(res.completelist)
        this.weeklist.push(res.completeRatelist)
        this.weeklist.push(res.reworkRatelist)
        this.workList=res.workList
        this.fglist=[]
        this.gxlist=[]
        this.wiplist=[]
        this.workList.forEach((i, index) => {
          this.fglist.push(i.fangongRate)
          this.gxlist.push(i.name)
          this.wiplist.push(i.workstation)
        })
        this.$nextTick(() => {
          this.echartOne();
          this.echartTwo();
        })
      })


		},
		echartOne() {
			let chartDom = document.getElementById('echart1');
			let myChart = echarts.init(chartDom);
			let option;

			option = {
			  tooltip: {
					show: false,
			    trigger: 'axis',
			    axisPointer: {
			      type: 'shadow'
			    }
			  },
			  grid: {
			    left: '10px',
			    right: '10px',
			    bottom: '0',
					top: '30px',
			    containLabel: true
			  },
			  xAxis: [
			    {
			      type: 'category',
			     // data: ['滳前斗', '烫前斗', '缉前斗', '固定斗口', '反后反布反斗布', '缉后斗上口', '缉后斗布一周','结合小档前门','转刀子','合后档','重缉后档平机','画腰比定位画','合侧缝','淌腰比','淌腰'],
			      data: this.gxlist,
			      axisLabel: {
							color: "#fff",
							interval: 0,
							rotate: 15,
							fontSize: 10,
							align: 'center',
							margin: 15
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#ccc'
							}
						}
			    }
			  ],
			  yAxis: [
			    {
			      type: 'value',
						splitLine: {
							lineStyle:{
								type: 'dashed',
								color: 'rgba(255,255,255,.2)'
							}
						},
						axisLabel: {
							color: "#fff",
							formatter: '{value}%'
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#ccc'
							}
						}
			    }
			  ],
			  series: [
			    {
			      name: '',
			      type: 'bar',
			      barWidth: '40%',
			      // data: [10, 5, 16, 15, 8, 23, 6, 4, 8, 22, 7, 5, 8, 3, 22],
			      data: this.fglist,
						itemStyle: {
							color: {
								type: 'linear',
								x: 0,
								y: 0,
								x2: 0,
								y2: 1,
								colorStops: [{
										offset: 0, color: '#4abd91' // 0% 处的颜色
								}, {
										offset: 1, color: '#28b2d6' // 100% 处的颜色
								}],
							}
						},
						label: {
							show: true, //开启显示数值
							position: 'top', //数值在上方显示
							textStyle: {  //数值样式
								color: '#fff',   //字体颜色
								fontSize: 12  //字体大小
							}
						}
			    }
			  ]
			};
			option && myChart.setOption(option);
		},
		echartTwo() {
			let chartDom2 = document.getElementById('echart2');
			let myChart2 = echarts.init(chartDom2);
			let option;

			option = {
			  tooltip: {
					show: false,
			    trigger: 'axis',
			    axisPointer: {
			      type: 'shadow'
			    }
			  },
			  grid: {
			    left: '10px',
			    right: '10px',
			    bottom: '0',
					top: '30px',
			    containLabel: true
			  },
			  xAxis: [
			    {
			      type: 'category',
			      // data: ['滳前斗', '烫前斗', '缉前斗', '固定斗口', '反后反布反斗布', '缉后斗上口', '缉后斗布一周','结合小档前门','转刀子','合后档','重缉后档平机','画腰比定位画','合侧缝','淌腰比','淌腰'],
			      data: this.gxlist,
			      axisLabel: {
							color: "#fff",
							interval: 0,
							rotate: 15,
							fontSize: 10,
							align: 'center',
							margin: 15
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#ccc'
							}
						}
			    }
			  ],
			  yAxis: [
			    {
			      type: 'value',
						splitLine: {
							lineStyle:{
								type: 'dashed',
								color: 'rgba(255,255,255,.2)'
							}
						},
						axisLabel: {
							color: "#fff",
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#ccc'
							}
						}
			    }
			  ],
			  series: [
			    {
			      name: '',
			      type: 'bar',
			      barWidth: '40%',
			      // data: [10, 5, 16, 15, 8, 23, 6, 4, 8, 22, 7, 5, 8, 3, 22],
			      data: this.wiplist,
						itemStyle: {
							color: {
								type: 'linear',
								x: 0,
								y: 0,
								x2: 0,
								y2: 1,
								colorStops: [{
										offset: 0, color: '#4abd91' // 0% 处的颜色
								}, {
										offset: 1, color: '#28b2d6' // 100% 处的颜色
								}],
							}
						},
						label: {
							show: true, //开启显示数值
							position: 'top', //数值在上方显示
							textStyle: {  //数值样式
								color: '#fff',   //字体颜色
								fontSize: 12  //字体大小
							}
						}
			    }
			  ]
			};
			option && myChart2.setOption(option);
		}

  },
}
</script>


<style scoped lang="scss">
.chanxian{
	height: calc(100vh - 84px);padding: 0 20px;
	padding-top: calc((100vh - 84px - 510px) / 2);
	background: rgba(0, 0, 0, .7);
	.chanxianbox{
		background: rgba(12, 28, 46, .9);
		border: 1px solid #09bec5;
		padding: 50px 30px;
    ul{
      list-style: none;margin: 0;padding-left: 20px;
      li{
        position: relative;
        width: 14%;float: left;
        .jkpic img{
          display: block;
        }
        .info{
          width: calc(100% - 66px - 30px);
          position: absolute;
          left: calc(66px + 15px);
          top: 0;
          font-size: 12px;color: #fff;
          background: #0f2841;
          height: calc(50% - 10px);
          border: 1px dashed #0aa3ad;
          padding: 0 10px;
          cursor: pointer;
          h3{
            margin: 0;padding: 15px 0 10px;
          }
          h4{
            display: inline-block;line-height: 1;
            color: #000;background: #04cbfd;border-radius: 20px;padding: 2px 10px;margin: 0 0 15px;
          }
          p{
            // transform: scale(0.8,0.8);
            margin: 0 0 5px;white-space: nowrap;
          }
        }
        .info::after{
          content: '';width: 20px;height: 50px;
          background: url("@/assets/images/screen/arrow-left.png") no-repeat;
          background-size: 100% 100%;
          position: absolute;right: 100%;top: 0;
        }
      }
      li:nth-child(even){
        width: 6%;
        .info{
          width: calc(233.33% - 66px - 30px);
          left: initial;
          right: calc(100% + 15px);
          top: initial;
          bottom: 0;
        }
        .info::after{
          background: url("@/assets/images/screen/arrow-right.png") no-repeat;
          right: -20px;
        }
      }
    }
		ul:before,ul::after{
			clear: both;display: table;content:'';
		}
	}
	.detailTanchu{

		:deep(.el-dialog) {
		  height: calc(88vh);
		  background: transparent;

		  .el-dialog__header {
		    padding: 15px 50px 15px 30px;
		    display: inline-block;
		    background-size: 100% 100% !important;
		  }

		  .el-dialog__headerbtn {
		    color: #949fa1;
		    background: rgba(12, 28, 46, 0.9);
		    height: 35px;width: 35px;line-height: 40px;text-align: center;
		    border-radius: 50%;
		    top: 10px;
		    right: -20px;
		  }

		  .dialog-title {
		    color: #00ebff;margin: 0 0 20px;
		    font-weight: bold;
		  }
		  .el-dialog__body {
		    background: rgba(12, 28, 46, 0.9);
		    border-radius: 0;
		    padding: 20px 30px;
				border: 1px solid #09bec5;
		  }
		}
		.dialog-title{
			h3{
				display: inline-block;margin: 0 20px 0 0;font-weight: bold;
			}
			span{
				font-size: 12px;font-weight: normal;color: #768697;
			}
		}
		.detailbox{
			.border-det{
				border: 1px solid #09bec5;border-radius: 5px;
				background: url("@/assets/images/screen/detbox-bg.jpg") no-repeat;
				background-size: 100% 100%;
				padding: 10px 15px ;
				height: 100%;
				.det-tit{
					display: inline-block;
					background: url("@/assets/images/screen/det-tit.png") no-repeat;
					background-size: 100% 100%;
					padding: 5px 30px;margin: 0 0 10px;
					font-size: 16px;color: #fff;
				}
			}
			.detpic{
				img{
					max-width: 100%;display: block;margin: 0 auto;
					height: 670px;
				}
			}
			.detinfo{
				.countdown{
					background: url("@/assets/images/screen/countdown-bg.png") no-repeat;
					background-size: 100% 100%;
					padding: 10px 20px 5px;
					h5{
						color: #fff;margin: 0;text-align: right;
					}
					p{
						font-size: 30px;font-weight: bold;color: #f8b62d;
						text-align: right;margin: 0;
					}
				}
				.info-li{
					.item{
						padding: 0 10px;
						h4{
							width: 50%;float: left;color: #09bec5;margin: 0;
							line-height: 40px;font-size: 12px;
						}
						h5{
							width: 50%;float: left;text-align: right;color: #fff;
							margin: 0;line-height: 40px;
						}
					}
					.item:before,.item::after{
						content: '';clear: both;display: table;
					}
					//.item:last-child{
					//	background: #112234;
					//	h5{
					//		width: 100%;line-height: 1.5;text-align: left;
					//		font-size: 14px;min-height: 60px;
					//	}
					//}
					.item:nth-child(even){
						background: #112234;
					}
				}
			}
			.xiaolv{
				.xiaolv-data{
					margin: 0 0 20px;
					h3{
						margin: 15px 0 10px;font-size: 16px;font-weight: bold;
						color: #f8b62d;
						white-space: nowrap
					}
					ul{
						list-style: none;margin: 0;padding: 0;
						li{
							h4{
								width: 50%;float: left;
								line-height: 50px;color: #09bec5;font-size: 12px;
								margin: 0;
							}
							h5{
								width: 50%;float: left;
								line-height: 50px;font-size: 30px;font-weight: bold;
								color: #fff;margin: 0;text-align: right;
							}
							:deep(.el-icon) {
								vertical-align: middle;
								display: inline-block;height: auto;
							}
						}
						li:before,li:after{
							content: '';clear: both;display: table;
						}
					}
					.xiaolv-left{
						position: relative;
						.xiaolv-line{
							position: absolute;right: -30px;top: 0;height: 100%;
						}
					}
				}
				.xiaolv-table{
					margin-top: 25px;
					:deep(.el-table) {
						background: transparent;
						font-size: 12px;
						.el-table__header{
							.cell{
								font-size: 12px;
							}
						}
						tr{
							background: transparent !important;
						}
						tr:hover td{
							background: transparent !important;
						}
						th{
							padding: 0;height: 24px !important;
							background: rgba(9, 190, 197, .1) !important;
							color: #00ffff;
							border-top: 1px solid rgba(255,255,255,.2);
							border-bottom: 1px solid rgba(255,255,255,.2);
						}
						td{
							padding: 5px 0;border-color: rgba(255,255,255,.2);
							color: #fff;
						}
						td:first-child{
							color: #00ffff;
						}
						.el-table__inner-wrapper::before{
							display: none;
						}
					}
				}
				.echart-tit{
					margin: 15px 0 0;
					h4{
						color: #fff;display: inline-block;margin: 0;
						padding-left: 10px;border-left: 2px solid #04cbfd;
					}
					i{
						display: inline-block;float: right;
						width: 50px;height: 2px;background: #04cbfd;
						margin: 10px 0 0;
					}
					span{
						display: inline-block;float: right;
						font-size: 12px;margin-left: 10px;color: #fff;
					}
				}
				.echart1{
					height: calc((100% - 300px) / 2);
				}
				.echart2{
					height: calc((100% - 300px) / 2);
				}
			}
		}
	}

}
</style>




