<template>
  <div class="liaochengzc">
		<div class="toptitle">
			<img src="@/assets/images/screen/zhoucheng-toptitle.png" @load="topimageLoaded"/>
		  <div class="fangda">
		    <i v-if="size == 'small'" style="cursor: pointer;" @click="changeSize()">
					<img src="@/assets/images/fangda.png">
				</i>
		    <i v-if="size == 'big'" style="cursor: pointer;" @click="changeSize()">
					<img src="@/assets/images/suoxiao.png">
				</i>
		  </div>
		</div>
		<div class="main" :style="{ height: maniHt}">
			<el-row :gutter="10">
				<el-col :span="7">
					<div class="leftbox">
						<div class="box box1">
							<div class="tit">产品销量排行</div>
							<div class="paihangtit">
								<el-row>
									<el-col :span="7">
										<h4>产品名称</h4>
									</el-col>
									<el-col :span="17">
										<h4>销售额</h4>
									</el-col>
								</el-row>
							</div>
							<div class="xsph">
								<ul class="ulscroll">
									<li v-for="(item, index) in xsphList" :key="index">
										<el-row>
											<el-col :span="7">
												<div class="name">{{ item.name }}</div>
											</el-col>
											<el-col :span="13">
												<div class="blueline" :style="{width: item.number / xsphList[0].number * 100 + '%'}"></div>
											</el-col>
											<el-col :span="4">
												<div class="number">{{ item.number }}</div>
											</el-col>
										</el-row>
									</li>
								</ul>
							</div>
						</div>
						<div class="box">
							<div class="tit">产品库存排行</div>
							<div class="paihangtit">
								<el-row>
									<el-col :span="17">
										<h4>产品名称</h4>
									</el-col>
									<el-col :span="7">
										<h4>库存数量</h4>
									</el-col>
								</el-row>
							</div>
							<div class="kucunph">
								<ul class="ulscroll">
									<li v-for="(item, index) in kcphList" :key="index">
										<el-row>
											<el-col :span="4">
												<div class="order">{{ index + 1 }} </div>
											</el-col>
											<el-col :span="14">
												<div class="name">{{ item.name }}</div>
											</el-col>
											<el-col :span="6">
												<div class="number">{{ item.number }}</div>
											</el-col>
										</el-row>
									</li>
								</ul>
							</div>
						</div>
						<div class="box">
							<div class="tit">本日订单执行情况</div>
							<div class="orderph" id="ordersph"></div>
						</div>
					</div>
				</el-col>
				<el-col :span="10">
					<div class="midbox">
						<div class="box">
							<div class="tit">工单生产实时进度</div>
							<div class="gongdanjd">
								<el-carousel arrow="never" interval="5000" trigger="click">
									<el-carousel-item v-for="(item, index) in gongdanList" :key="index">
										<div class="gongdanup">
											<el-row>
												<el-col :span="8">
													<div class="item">
														<img src="@/assets/images/screen/zhoucheng-gongdan-ico1.png"/>
														<div class="right">
															<h4>{{ item.number }}</h4>
															<h5>工单号</h5>
														</div>
													</div>
												</el-col>
												<el-col :span="8">
													<div class="item">
														<img src="@/assets/images/screen/zhoucheng-gongdan-ico2.png"/>
														<div class="right">
															<h4>{{ item.gongxu }}</h4>
															<h5>当前工序</h5>
														</div>
													</div>
												</el-col>
												<el-col :span="8">
													<div class="item">
														<img src="@/assets/images/screen/zhoucheng-gongdan-ico3.png"/>
														<div class="right">
															<h4>{{ item.name }}</h4>
															<h5>品名</h5>
														</div>
													</div>
												</el-col>
											</el-row>
										</div>
										<div class="gongdandown">
											<el-row>
												<el-col :span="6">
													<div class="item">
														<h4><i></i>应生产量</h4>
														<h5>{{ item.yingshengchan }}</h5>
													</div>
												</el-col>
												<el-col :span="6">
													<div class="item">
														<h4><i></i>合格量</h4>
														<h5>{{ item.hege }}</h5>
													</div>
												</el-col>
												<el-col :span="6">
													<div class="item">
														<h4><i></i>不合格量</h4>
														<h5>{{ item.buhege }}</h5>
													</div>
												</el-col>
												<el-col :span="6">
													<div class="item">
														<h4><i></i>进度</h4>
														<h5>{{ item.jindu }}</h5>
													</div>
												</el-col>
											</el-row>
										</div>
									</el-carousel-item>
								</el-carousel>
							</div>
						</div>
						<div class="box boxmid">
							<div class="tit">
								设备模型三色灯展示
								<div class="status">
									<div class="item"><i class="green"></i>运行</div>
									<div class="item"><i class="yellow"></i>待机</div>
									<div class="item"><i class="warn"></i>告警</div>
									<div class="item"><i class="grey"></i>关机</div>
								</div>
							</div>
							<div class="modelzs">
								<el-row :gutter="15">
									<el-col :span="10">
										<div class="model-lfup">
											<div class="up">
												<img src="@/assets/images/screen/zhoucheng-modelico.png" width="20"/>
												<div class="data">
													<h4>设备总数</h4>
													<h5>20</h5>
												</div>
											</div>
											<div class="down">
												<div class="item">运行设备：16</div>
												<div class="item">待机设备：1</div>
												<div class="item">告警设备：2</div>
												<div class="item">关机设备：1</div>
											</div>
										</div>
									</el-col>
									<el-col :span="14">
										<div class="model-lfdown">
											<div class="bluetit">
											  <img src="@/assets/images/penglaiaqyd/detail-titico1.png"/>
											  设备运行状态占比
											</div>
											<div class="yxztzb">
												<div id="yxztzb"></div>
											</div>
										</div>
									</el-col>
								</el-row>
							</div>
							<div class="model-rt">
								<div class="bluetit">
								  <img src="@/assets/images/penglaiaqyd/detail-titico1.png"/>
								  设备运行列表
								</div>
								<div class="equiplist">
									<el-carousel arrow="never" interval="5000" trigger="click">
										<el-carousel-item v-for="group in equipyxGroup">
											<div class="item" v-for="item in group">
												<div v-if="item.status === '1'">
													<img src="@/assets/images/screen/equipstatus-ico1.png" />
												</div>
												<div v-if="item.status === '2'">
													<img src="@/assets/images/screen/equipstatus-ico2.png" />
												</div>
												<div v-if="item.status === '3'">
													<img src="@/assets/images/screen/equipstatus-ico3.png" />
												</div>
												<div v-if="item.status === '4'">
													<img src="@/assets/images/screen/equipstatus-ico4.png" />
												</div>
												<h5>{{ item.name }}</h5>
											</div>
										</el-carousel-item>
									</el-carousel>
								</div>
							</div>
						</div>
						<div class="box boxbot">
							<div class="tit">能耗情况</div>
							<div class="midcharts">
								<el-row :gutter="10">
									<el-col :span="12">
										<div class="bluetit">
										  <img src="@/assets/images/penglaiaqyd/detail-titico1.png"/>
										  能耗趋势
											<div class="bluetitright">
												<span :class="[nhqsActive==='1'?'active':'']" @click="nhqsTab('1')">每日</span>
												<span :class="[nhqsActive==='2'?'active':'']" @click="nhqsTab('2')">每周</span>
												<span :class="[nhqsActive==='3'?'active':'']" @click="nhqsTab('3')">每月</span>
											</div>
										</div>
										<div class="midchartitem" id="nhqs"></div>
									</el-col>
									<el-col :span="12">
										<div class="bluetit">
										  <img src="@/assets/images/penglaiaqyd/detail-titico1.png"/>
										  产量/能耗
											<div class="bluetitright">
												<span :class="[clnhActive==='1'?'active':'']" @click="clnhTab('1')">每日</span>
												<span :class="[clnhActive==='2'?'active':'']" @click="clnhTab('2')">每周</span>
												<span :class="[clnhActive==='3'?'active':'']" @click="clnhTab('3')">每月</span>
											</div>
										</div>
										<div class="midchartitem" id="clnh"></div>
									</el-col>
								</el-row>
							</div>
						</div>
					</div>
				</el-col>
				<el-col :span="7">
					<div class="rightbox">
						<div class="box">
							<div class="tit">订单超期预警</div>
							<div class="chaoqiwarn">
								<div class="thline">
									<el-row>
										<el-col :span="8">
											<h4>订单号</h4>
										</el-col>
										<el-col :span="7">
											<h4>产品名</h4>
										</el-col>
										<el-col :span="3">
											<h4>数量</h4>
										</el-col>
										<el-col :span="6">
											<el-dropdown trigger="click">
												<span class="el-dropdown-link">
													订单交付<br />截止日期
													<el-icon><CaretBottom /></el-icon>
												</span>
												<template #dropdown>
													<el-dropdown-menu>
														<el-dropdown-item>正序</el-dropdown-item>
														<el-dropdown-item>倒序</el-dropdown-item>
													</el-dropdown-menu>
												</template>
											</el-dropdown>
										</el-col>
									</el-row>
								</div>
								<div class="scrollstyle orderList">
									<ul class="ulscroll">
										<li class="item" v-for="(item, index) of orderList">
											<el-row>
												<el-col :span="8">
													<h5 style="text-align: left;">{{ item.order }}</h5>
												</el-col>
												<el-col :span="7">
													<h5>{{ item.name }}</h5>
												</el-col>
												<el-col :span="3">
													<h5>{{ item.number }}</h5>
												</el-col>
												<el-col :span="6">
													<h5 class="red" v-if="item.enddate > nowdate">{{ item.enddate }}</h5>
													<h5 class="blue" v-else>{{ item.enddate }}</h5>
												</el-col>
											</el-row>
										</li>
									</ul>
								</div>
							</div>
						</div>
						<div class="box">
							<div class="tit">新订单生产计划</div>
							<div class="chaoqiwarn">
								<div class="thline">
									<el-row>
										<el-col :span="8">
											<h4>订单号</h4>
										</el-col>
										<el-col :span="7">
											<h4>产品名</h4>
										</el-col>
										<el-col :span="3">
											<h4>数量</h4>
										</el-col>
										<el-col :span="6">
											<el-dropdown trigger="click">
												<span class="el-dropdown-link">
													订单交付<br />截止日期
													<el-icon><CaretBottom /></el-icon>
												</span>
												<template #dropdown>
													<el-dropdown-menu>
														<el-dropdown-item>正序</el-dropdown-item>
														<el-dropdown-item>倒序</el-dropdown-item>
													</el-dropdown-menu>
												</template>
											</el-dropdown>
										</el-col>
									</el-row>
								</div>
								<div class="scrollstyle orderPlan">
									<ul class="ulscroll">
										<li class="item" v-for="(item, index) of orderList">
											<el-row>
												<el-col :span="8">
													<h5 style="text-align: left;">{{ item.order }}</h5>
												</el-col>
												<el-col :span="7">
													<h5>{{ item.name }}</h5>
												</el-col>
												<el-col :span="3">
													<h5>{{ item.number }}</h5>
												</el-col>
												<el-col :span="6">
													<h5 class="yellow" v-if="item.enddate > nowdate">{{ item.enddate }}</h5>
													<h5 class="blue" v-else>{{ item.enddate }}</h5>
												</el-col>
											</el-row>
										</li>
									</ul>
								</div>
							</div>
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
	name: "轴承数据看板",
	
  data() {
    return {
      maniHt: '',
      size: 'small',
			isFullscreen: false,
			xsphList:[  //请把数据从大到小排列到这个数组里
				{
					name: '产品名称A',
					number: '98',
				},{
					name: '产品名称B',
					number: '89',
				},{
					name: '产品名称C',
					number: '78',
				},{
					name: '产品名称D',
					number: '65',
				},{
					name: '产品名称E',
					number: '54',
				}
			],
			kcphList: [
				{
					name: '产品名称A',
					number: '98',
				},{
					name: '产品名称B',
					number: '89',
				},{
					name: '产品名称C',
					number: '78',
				},{
					name: '产品名称D',
					number: '65',
				},{
					name: '产品名称E',
					number: '54',
				}
			],
			gongdanList: [
				{
					number: 'CP342019233',
					gongxu: 'CP342019233',
					name: '产品名称A',
					yingshengchan: '2312311',
					hege: '2312311',
					buhege: '312',
					jindu: '98%'
				},{
					number: 'CP342019233',
					gongxu: 'CP342019233',
					name: '产品名称B',
					yingshengchan: '2312311',
					hege: '2312311',
					buhege: '312',
					jindu: '91%'
				},{
					number: 'CP342019233',
					gongxu: 'CP342019233',
					name: '产品名称C',
					yingshengchan: '2312311',
					hege: '2312311',
					buhege: '312',
					jindu: '88%'
				}
			],
			piedata: [
				{ value: 60, name: '运行设备' },
				{ value: 18, name: '待机设备' },
				{ value: 9, name: '告警设备' },
				{ value: 4, name: '关机设备' },
			],
			equipyxList: [
				{
					name: '设备1',
					status: '1',  //1运行，2待机，3告警，4关机
				},{
					name: '设备2',
					status: '2',  
				},{
					name: '设备3',
					status: '2',  
				},{
					name: '设备4',
					status: '3',  
				},{
					name: '设备5',
					status: '4',  
				},{
					name: '设备6',
					status: '2',  
				},{
					name: '设备7',
					status: '1',  
				},{
					name: '设备8',
					status: '1', 
				},{
					name: '设备9',
					status: '2',  
				},{
					name: '设备10',
					status: '2',  
				},{
					name: '设备11',
					status: '3',  
				},{
					name: '设备12',
					status: '4',  
				},{
					name: '设备13',
					status: '2',  
				},{
					name: '设备14',
					status: '1',  
				},{
					name: '设备15',
					status: '1', 
				},{
					name: '设备16',
					status: '2',  
				},{
					name: '设备17',
					status: '2',  
				},{
					name: '设备18',
					status: '3',  
				},{
					name: '设备19',
					status: '4',  
				},{
					name: '设备20',
					status: '2',  
				},{
					name: '设备21',
					status: '1',  
				},{
					name: '设备22',
					status: '1',  
				}
			],
			equipyxGroup: [],
			orderList: [
				{
					order: 'CASDWAWADFDS3213E',
					name: '产品名称A',
					number: '189',
					enddate: '2023-10-10'
				},{
					order: 'CASDWAWADFDS3213E',
					name: '产品名称A',
					number: '189',
					enddate: '2023-10-10'
				},{
					order: 'CASDWAWADFDS3213E',
					name: '产品名称A',
					number: '189',
					enddate: '2023-10-10'
				},{
					order: 'CASDWAWADFDS3213E',
					name: '产品名称A',
					number: '189',
					enddate: '2023-10-15'
				},{
					order: 'CASDWAWADFDS3213E',
					name: '产品名称A',
					number: '189',
					enddate: '2023-10-15'
				},{
					order: 'CASDWAWADFDS3213E',
					name: '产品名称A',
					number: '189',
					enddate: '2023-10-15'
				}
			],
			nowdate: '',
			nhqsActive: '1',
			clnhActive: '1'
    }
  },

  watch: {

  },
  created() {
    
  },

  mounted: function () {
		let yy = new Date().getFullYear();
		let mm = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
		let dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate(); 
		this.nowdate = yy + '-' + mm + '-' + dd;
		//console.log(this.nowdate)
		
		this.scrollTimer = setInterval(() => {
			this.orderScroll();
			this.orderPlanScroll();
		}, 80);
		
		setTimeout(() => {
		  this.orderSatuation();
		  this.yxztzbEchart();
			this.nhqs();
			this.clnh();
		}, 600);
		
		//设备运行分组10个一组
		for(var i = 0; i<this.equipyxList.length; i+= 10){
		  this.equipyxGroup.push(this.equipyxList.slice(i, i + 10));
		}
		//console.log(this.equipyxGroup)
  },

  unmounted() {
    clearInterval(this.scrollTimer)
  },

  methods: {
		topimageLoaded() {
		  let topHt = document.querySelector('.toptitle').clientHeight + 'px';
		  this.maniHt = 'calc(100% - ' + topHt + ')';
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
		    document.querySelector('.liaochengzc').style.minHeight = '100vh';
		    document.querySelector('.navbar').style.display = 'none';
		    document.querySelector('.tags-view-container').style.display = 'none';
		    document.querySelector('.hit').style.height = 'calc(100vh - 60px)';
			} else if (this.size == 'big') {
		    this.size = 'small'
		    document.querySelector('.sidebar-container').style.width = "";
		    document.querySelector('.main-container').style.marginLeft = "";
		    document.querySelector('.navbar').style.display = 'block';
		    document.querySelector('.app-main').style.minHeight = 'calc(100vh - 84px)';
		    document.querySelector('.liaochengzc').style.minHeight = 'calc(100vh - 84px)';
		    document.querySelector('.tags-view-container').style.display = 'block'
		    document.querySelector('.hit').style.height = '100%';
		  }
		},
		orderScroll() {
			let orderlist = document.querySelector('.orderList');
			orderlist.scrollTop = orderlist.scrollTop + 1;
			if(orderlist.scrollTop + orderlist.offsetHeight >= orderlist.scrollHeight){
				orderlist.scrollTop = 0;
			}
		},
		orderPlanScroll() {
			let orderplan = document.querySelector('.orderPlan');
			orderplan.scrollTop = orderplan.scrollTop + 1;
			if(orderplan.scrollTop + orderplan.offsetHeight >= orderplan.scrollHeight){
				orderplan.scrollTop = 0;
			}
		},
		orderSatuation() {
			let chartDom = document.getElementById('ordersph');
			let myChart = echarts.init(chartDom);
			let option;
			
			option = {
				color: ['#5ba3ed', '#a0fffe', '#ffbb2e'],
				title: {
					text: "完成情况",
					left: "center",
					top: "center",
					textStyle: {
						fontSize: 18,
						color: '#fff',
					},
				},
			  series: [
			    {
			      type: 'pie',
			      radius: ['45%', '60%'],
			      label: {
			        formatter: '{b}\n{d}%',
							color: '#fff',
			      },
			      startAngle: 140,
			      data: [
			        { value: 1048, name: '已完成' },
			        { value: 735, name: '进行中' },
			        { value: 580, name: '待处理' },
			      ],
						
			    }
			  ],
			};
			option && myChart.setOption(option);
		},
		yxztzbEchart() {
			let chartDom = document.getElementById('yxztzb');
			let myChart = echarts.init(chartDom);
			let option;
			let _this = this;
			
			option = {
			  tooltip: {
			    trigger: 'item',
			  },
				color: ['#4cc39a', '#f8c02a', '#ff1b34', '#898989'],
			  legend: {
			    right: '6%',
			    top: 'center',
					icon: "circle",
					itemHeight: 5,
					itemWidth: 5,
					orient: "vertical",
					textStyle: {
						color: "#fff"
					},
					formatter: function (name) {
					  // pieData是饼图的数组数据
					  let data = _this.piedata;
					  let total = 0;
					  let tarValue = 0;
					  for (let i = 0, l = data.length; i < l; i++) {
					    total += parseInt(data[i].value);
					    if (data[i].name == name) {
					      tarValue = data[i].value;
					    }
					  }
					  let arr
					  if (tarValue != 0) {
					    arr = [name + ' ' + ((tarValue / total) * 100).toFixed(2) + '%']
					  } else {
					    arr = [name + ' 0%']
					  }
					  return arr.join('')
					},
			  },
			  series: [
			    {
			      type: 'pie',
						radius: ['0%', '90%'],
						center: ['50%', '50%'],
			      itemStyle: {
			        borderRadius: 1
			      },
						label: {
							show: false,
						  formatter: '{b}\n{d}%',
							color: '#fff',
						},
						startAngle: 140,
			      data: this.piedata
			    }
			  ]
			};
			option && myChart.setOption(option);
		},
		nhqs() {
			let chartDom = document.getElementById('nhqs');
			let myChart = echarts.init(chartDom);
			let option;
			option = {
				tooltip: {
					trigger: 'axis'
				},
				color: ['#f9cb2e'],
				grid: {
					top: '20%',
					bottom: '20%',
					left: '18%',
					right: '8%',
				},
				legend: {
				  right: '2%',
				  top: 'top',
					textStyle: {
						color: "#fff"
					},
				},
			  xAxis: {
			    type: 'category',
			    data: ['10-01','10-02','10-03','10-04','10-05','10-06','10-08'],
					axisLine: {
					  lineStyle: {
					    color: '#fff',
					  }
					},
				},
			  yAxis: {
			    type: 'value',
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
						name: '能耗',
			      data: [150, 230, 224, 218, 135, 147, 260],
			      type: 'line'
			    }
			  ]
			};
			option && myChart.setOption(option);
		},
		clnh() {
			let chartDom = document.getElementById('clnh');
			let myChart = echarts.init(chartDom);
			let option;
			option = {
				tooltip: {
					trigger: 'axis'
				},
				color: ['#00b6ce'],
				grid: {
					top: '20%',
					bottom: '20%',
					left: '18%',
					right: '8%',
				},
				legend: {
				  right: '2%',
				  top: 'top',
					textStyle: {
						color: "#fff"
					},
				},
			  xAxis: {
			    type: 'category',
			    data: ['10-01','10-02','10-03','10-04','10-05','10-06','10-08'],
					axisLine: {
					  lineStyle: {
					    color: '#fff',
					  }
					},
				},
			  yAxis: {
			    type: 'value',
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
						name: '产量能耗',
			      data: [150, 230, 224, 218, 135, 147, 260],
			      type: 'line'
			    }
			  ]
			};
			option && myChart.setOption(option);
		},
		nhqsTab(val) {
			this.nhqsActive = val;
		},
		clnhTab(val) {
			this.clnhActive = val;
		}
  },

}
</script>


<style scoped lang="scss">
.liaochengzc {
	height: calc(100vh - 84px);
	position: relative;
	background: url("@/assets/images/screen/zhoucheng-bg.jpg") no-repeat;
	background-size: 100% 100%;
	
	.toptitle{
		img{width: 100%;display: block;}
	
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
		:deep(.el-row) {
			height: 100%;
			.el-col{
				height: 100%;position: relative;
			}
		}
		.box{
			background: rgba(0, 0, 0, 0.1);
			border: 1px solid #0e5481;
			margin: 5px 0;
			.tit{
				font-size: 18px;color: #fff;font-weight: bold;
				font-style: italic;padding: 2px 15px 4px;
				background: url("@/assets/images/screen/zhoucheng-boxtit.png") no-repeat;
				background-size: 100% 100%;
				position: relative;
				.status{
					width: 50%;text-align: right;
					position: absolute;right: 0;top: 0;
					.item{
						margin: 0 10px;color: #fff;
						display: inline-block;
						font-size: 14px;font-style: normal;
						font-weight: normal;line-height: 30px;
						i{
							width: 6px;height: 6px;
							display: inline-block;
							border-radius: 50%;
							margin-right: 5px;
							vertical-align: middle;
							margin-top: -2px;
						}
						i.green{
							background: #4cc39a;
						}
						i.yellow{
							background: #f8c02a;
						}
						i.warn{
							background: #ff1b34;
						}
						i.grey{
							background: #898989;
						}
					}
				}
			}
		}
		.ulscroll{
			margin: 0;list-style: none;
			padding: 0;
		}
		.scrollstyle::-webkit-scrollbar {
		  width: 5px;
		  /*滚动条宽度*/
		  height: 10px;
		}
		/*定义滚动条轨道 内阴影+圆角*/
		.scrollstyle::-webkit-scrollbar-track {
		  border-radius: 10px;
		  background: #274065;
		}
		/*定义滑块 内阴影+圆角*/
		.scrollstyle::-webkit-scrollbar-thumb {
		  border-radius: 6px;
		  background-color: #2a94ce;
		}
		.leftbox{
			height: 100%;
			.box{
				height: calc(36.5% - 10px);
				.paihangtit{
					text-align: center;
					background: url("@/assets/images/screen/zhoucheng-kucuntitbg.png") repeat-x;
					background-size: auto 100%;
					margin: 5px 10px 0;
					border-radius: 10px;
					h4{
						position: relative;color: #fff;
						font-size: 15px;padding: 7px 0;
						font-weight: bold;
						margin: 0;
					}
					h4::after{
						content: '';
						width: 8px;height: 3px;
						background: #34faf1;
						position: absolute;bottom: -1px;
						left: calc(50% - 4px);
					}
				}
				.xsph{
					height: calc(100% - 65px);
					padding: 5px 10px 8px;
					//overflow: auto;
					.ulscroll{
						height: 100%;overflow: hidden;
						li{
							height: 20%;
							font-size: 14px;padding: 5px 0;
							.name{
								color: #bff7ff;text-align: center;
								white-space: nowrap;
								line-height: 20px;
							}
							.blueline{
								height: 12px;
								background: url("@/assets/images/screen/zhoucheng-blueline.jpg") repeat-y;
								background-size: 100% auto;
								border-radius: 20px;
								margin: 4px 0 0;
							}
							.number{
								color: #00deff;text-align: center;
								white-space: nowrap;
								line-height: 20px;
							}
						}
					}
				}
				.kucunph{
					height: calc(100% - 72px);
					padding: 0 10px 10px;
					.ulscroll{
						height: 100%;
						li{
							margin: 10px 0 0;
							background: url("@/assets/images/screen/zhoucheng-kucunitembg.png") no-repeat;
							background-size: 100% 100%;
							height: calc(20% - 10px);
							.order{
								text-align: center;font-size: 16px;
								font-weight: bold;color: #fff;
								font-style: italic;
								line-height: 25px;
								position: relative;
								z-index: 1;margin-left: 10px;
							}
							.order::before{
								content: '';width: 100%;height: 100%;
								border-top: 25px solid #00deff;
								border-left: 10px solid transparent;
								border-right: 10px solid transparent;
								position: absolute;top: 0;left: 0;
								z-index: -1;
							}
							.name{
								color: #bff7ff;padding-left: 20px;
								white-space: nowrap;font-size: 14px;
								line-height: 20px;
							}
							.number{
								color: #00deff;text-align: center;
								white-space: nowrap;font-size: 14px;
								line-height: 20px;
							}
						}
						li:nth-child(1) .order::before{
							border-top: 25px solid #00deff;
						}
						li:nth-child(2) .order::before{
							border-top: 25px solid #00deff;
						}
						li:nth-child(3) .order::before{
							border-top: 25px solid #00deff;
						}
						li:nth-child(4) .order::before{
							border-top: 25px solid #00deff;
						}
						li:nth-child(5) .order::before{
							border-top: 25px solid #00deff;
						}
					}
				}
				.orderph{
					height: calc(100% - 30px);
				}
			}
			.box1{
				height: calc(27% - 10px);
			}
		}
		.midbox{
			height: 100%;
			.box{
				height: calc(27% - 10px);
			}
			.boxmid{
				height: calc(46% - 15px);
			}
			.boxbot{
				height: calc(27% - 5px);
			}
			.gongdanjd{
				height: calc(100% - 30px);
				:deep(.el-carousel) {
					height: 100%;
					.el-carousel__container{
						height: 100%;
					}
					.el-carousel__indicator{
						padding: 0 3px 3px !important;
					}
					.el-carousel__button{
						height: 4px;border-radius: 5px;
						background: #2992cc;
						width: 15px;
					}
					.el-carousel__indicator.is-active .el-carousel__button{
						width: 30px;
					}
				}
				.gongdanup{
					height: 48%;margin: 0 15px;
					background: url("@/assets/images/screen/zhoucheng-gongdan-bg.png") no-repeat center bottom;
					background-size: 100% auto;
					.item{
						display: flex;
						align-items: center;
						justify-content: center;
						height: 100%;
						img{
							width: 55px;float: left;
						}
						.right{
							width: calc(100% - 80px);float: left;
							margin-left: 10px;
							h4{
								margin: 0;color: #85cef2;
								font-weight: bold;
								white-space: nowrap;
							}
							h5{
								margin: 5px 0 0;color: #fff;
							}
						}
					}
				}
				.gongdanup::before,.gongdanup::after{
					content: '';clear: both;display: table;
				}
				.gongdandown{
					height: 52%;padding: 0 20px 10px;
					.item{
						background: url("@/assets/images/screen/zhoucheng-gongdanitembg.png") no-repeat;
						background-size: 100% 100%;
						padding: 8px 15px;
						position: absolute;
						width: 100%;
						top: 50%;
						transform: translateY(-50%);
						h4{
							margin: 0;font-size: 14px;color: #fff;
							line-height: 1;
							i{
								width: 6px;height: 6px;
								display: inline-block;
								background: #a0fffe;border-radius: 50%;
								margin-right: 5px;
								vertical-align: middle;
								margin-top: -2px;
							}
						}
						h5{
							margin: 5px 0 0;font-size: 16px;color: #8edbff;
							font-weight: bold;white-space: nowrap;
							padding-left: 10px;
						}
					}
				}
			}
			.bluetit {
			  color: #fff;
			  font-size: 14px;
			  background: url("@/assets/images/scyf/qlc-titbg.png") repeat-x;
			  background-size: auto 100%;
			  padding: 10px;
			  position: relative;
			  img {
			    vertical-align: middle;
			    margin-right: 5px;
			  }
				.bluetitright{
					position: absolute;right: 5px;top:0;
					span{
						display: inline-block;
						font-size: 12px;color: #5ba3ed;
						line-height: 40px;
						cursor: pointer;
						margin: 0 7px;
					}
					span.active{
						color: #bff7ff;
					}
				}
			}
			.bluetit::before {
			  content: '';
			  height: 100%;
			  width: 2px;
			  background: url("@/assets/images/scyf/qlc-titdot.png") repeat-x;
			  background-size: 100% 100%;
			  position: absolute;
			  left: 0;
			  top: 0;
			}
			.bluetit::after {
			  content: '';
			  height: 100%;
			  width: 3px;
			  background: url("@/assets/images/scyf/qlc-titdot.png") repeat-x;
			  background-size: 100% 100%;
			  position: absolute;
			  right: 0;
			  top: 0;
			}
			.modelzs{
				height: calc(50% - 5px);margin:0 0 5px;
				padding: 10px 15px 0;
				.model-lfup{
					height: 100%;
					background: rgba(61, 184, 255, 0.1);
					border: 1px solid #0f2f5c;
					border-radius: 5px;
					.up{
						height: 46%;
						border-bottom: 1px solid rgba(255, 255, 255, 0.1);
						padding: 0 15px;
						display: flex;
						align-items: center;
						justify-content: center;
						img{
							width: 55px;float: left;
						}
						.data{
							width: calc(100% - 70px);float: left;
							text-align: right;
							h4{
								margin: 0;font-size: 16px;color: #bff7ff;
							}
							h5{
								margin: 5px 0 0;
								color: transparent;
								background-image: linear-gradient(to bottom, #fff, #ffcd1e);
								-webkit-background-clip: text;
								background-clip: text;
								font-size: 24px;font-weight: bold;
							}
						}
					}
					.down{
						height: 54%;padding: 4px 5px 0;
						.item{
							width: calc(50% - 12px);
							margin: 5px 6px;float: left;
							font-size: 14px;color: #fff;
							text-align: center;
							padding: 2px 0 4px;
							white-space: nowrap;
						}
						.item:nth-child(1){
							background: url("@/assets/images/screen/zhoucheng-modelitembg1.png") no-repeat;
							background-size: 100% 100%;
						}
						.item:nth-child(2){
							background: url("@/assets/images/screen/zhoucheng-modelitembg2.png") no-repeat;
							background-size: 100% 100%;
						}
						.item:nth-child(3){
							background: url("@/assets/images/screen/zhoucheng-modelitembg3.png") no-repeat;
							background-size: 100% 100%;
						}
						.item:nth-child(4){
							background: url("@/assets/images/screen/zhoucheng-modelitembg4.png") no-repeat;
							background-size: 100% 100%;
						}
					}
					.up::before,.up::after,.down::before,.down::after{
						content: '';clear: both;display: table;
					}
				}
				.model-lfdown{
					height: 100%;
					
					.yxztzb{
						height: calc(100% - 44px);
						margin: 4px 0 0;
						background: rgba(61, 184, 255, 0.1);
						border: 1px solid #0f2f5c;
						border-radius: 5px;
						#yxztzb{
							height: 100%;
							width: 140%;margin-left: -40%;
						}
					}
				}
			}
			.model-rt{
				height: calc(50% - 35px);padding: 0 15px;
				:deep(.el-carousel) {
					height: 100%;
					.el-carousel__container{
						height: 100%;
					}
					.el-carousel__indicator{
						padding: 0 3px !important;
					}
					.el-carousel__button{
						height: 4px;border-radius: 5px;
						background: #2992cc;
						width: 15px;
					}
					.el-carousel__indicator.is-active .el-carousel__button{
						width: 30px;
					}
				}
				.equiplist{
					height: calc(100% - 44px);
					margin: 4px 0 0;
					background: rgba(61, 184, 255, 0.1);
					border: 1px solid #0f2f5c;
					border-radius: 5px;
					.item{
						width: 10%;float: left;
						text-align: center;
						height: 90%;
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
						img{
							width: 35px;
						}
						h5{
							margin: 5px 0 0;color: #fff;
							white-space: nowrap;
						}
					}
				}
				.equiplist::before,.equiplist::after{
					content: '';
				}
			}
			.midcharts{
				height: calc(100% - 30px);
				padding: 5px 10px;
				.midchartitem{
					height: calc(100% - 40px);
					background: rgba(61, 184, 255, 0.1);
					border: 1px solid #0f2f5c;
					border-radius: 5px;
				}
			}
		}
		.rightbox{
			height: 100%;
			.box{
				height: calc(50% - 12.5px);
			}
			.chaoqiwarn{
				height: calc(100% - 30px);
				padding: 0 10px;
				.thline{
					h4{
						margin: 0;font-size: 15px;font-weight: bold;
						color: #fff;
						height: 50px;
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
					}
					:deep(.el-dropdown) {
						font-size: 15px;font-weight: bold;
						cursor: pointer;
						height: 50px;
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
						.el-dropdown-link{
							color: #fff !important;
						}
						.el-icon{
							position: relative;
							top: -5px;
						}
					}
				}
				.scrollstyle{
					height: calc(100% - 60px);
					overflow: auto;
					.ulscroll{
						padding-right: 10px;
					}
					.item{
						margin: 0 0 10px;
						background: url("@/assets/images/screen/zhoucheng-orderitembg.png") no-repeat;
						background-size: 100% 100%;
						h5{
							word-wrap: break-word; word-break: normal;
							padding: 0 5px;margin: 0;
							font-size: 14px;color: #bff7ff;
							height: 40px;
							text-align: center;
							display: flex;
							justify-content: center;
							flex-direction: column;
						}
						.red{
							color: #fc3a3a;
							font-size: 14px;
						}
						.blue{
							color: #bff7ff;
							font-size: 14px;
						}
						.yellow{
							color: #ffcb2e;
							font-size: 14px;
						}
					}
				}
			}
		}
	}
}

</style>




