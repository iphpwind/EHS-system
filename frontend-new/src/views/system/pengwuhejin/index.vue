<template>
	<div class="pengwuhejin">
		<div class="toptitle">
			<img src="@/assets/images/screenyxjs/title.png" @load="topimageLoaded"/>
		  <div class="fangda">

		    <i v-if="size == 'small'" style="cursor: pointer;" @click="changeSize()"><img src="@/assets/images/fangda.png"></i>
		    <i v-if="size == 'big'" style="cursor: pointer;" @click="changeSize()"><img
		        src="@/assets/images/suoxiao.png"></i>
		  </div>
		</div>

		<div class="main" :style="{ height: maniHt}">
			<div class="floor1">
				<el-row :gutter="24">
					<el-col :span="6">
						<div class="tit">
							<img src="@/assets/images/screen/pwhj-titico1.png" width="25"/>
							设备在线状态
						</div>
						<div class="box box1">
							<div class="up">
								<el-row>
									<el-col :span="12">
										<img src="@/assets/images/screen/pwhj-state-ico1.png" width="35" />
										监测设备数
									</el-col>
									<el-col :span="12">
										<span>{{ eqAll }}</span>
									</el-col>
								</el-row>
								<img src="@/assets/images/screen/pwhj-stateline.png" class="line"/>
							</div>
							<div class="down">
								<el-row>
									<el-col :span="12">
										<div class="item">
											<img src="@/assets/images/screen/pwhj-state-ico2.png" />
											<div class="itemword">
												<span>{{ eqOnline }}</span>
												<h5>在线设备数</h5>
											</div>
										</div>
									</el-col>
									<el-col :span="12">
										<div class="item">
											<img src="@/assets/images/screen/pwhj-state-ico3.png" />
											<div class="itemword">
												<span>{{ eqOffline }}</span>
												<h5 class="lixian">离线设备数</h5>
											</div>
										</div>
									</el-col>
								</el-row>
							</div>
						</div>
					</el-col>
					<el-col :span="15">
						<div class="tit">
							<img src="@/assets/images/screen/pwhj-titico2.png" width="25"/>
							全厂稼动率
						</div>
						<div class="box box2">
							<el-row :gutter="12">
								<el-col :span="6">
									<div class="item">
										<div class="circle">
											<el-progress type="circle" :percentage="percent1"
											stroke-width="10" color="#09bec5">
												<template #default="{ percentage }">
													<span class="percentage-value">{{ dataList.activationPercent }}%</span>
												</template>
											</el-progress>
										</div>
										<div class="right-data">
											<h5>今日稼动率</h5>
											<span>{{ dataList.activationPercent }}%</span>
										</div>
									</div>
								</el-col>
								<el-col :span="6">
									<div class="item">
										<div class="circle">
											<el-progress type="circle" :percentage="percent2"
											stroke-width="10" color="#3a99f2">
												<template #default="{ percentage }">
													<span class="percentage-value">{{ dataList.activationPercent_yes }}%</span>
												</template>
											</el-progress>
										</div>
										<div class="right-data">
											<h5>昨日稼动率</h5>
											<span>{{ dataList.activationPercent_yes }}%</span>
										</div>
									</div>
								</el-col>
								<el-col :span="6">
									<div class="item">
										<div class="circle">
											<el-progress type="circle" :percentage="percent3"
											stroke-width="10" color="#33cf92">
												<template #default="{ percentage }">
													<span class="percentage-value">{{ dataList.activationPercent_nowweek }}%</span>
												</template>
											</el-progress>
										</div>
										<div class="right-data">
											<h5>本周稼动率</h5>
											<span>{{ dataList.activationPercent_nowweek }}%</span>
										</div>
									</div>
								</el-col>
								<el-col :span="6">
									<div class="item">
										<div class="circle">
											<el-progress type="circle" :percentage="percent4"
											stroke-width="10" color="#fdb002">
												<template #default="{ percentage }">
													<span class="percentage-value">{{ dataList.activationPercent_lastweek }}%</span>
												</template>
											</el-progress>
										</div>
										<div class="right-data">
											<h5>上周稼动率</h5>
											<span>{{ dataList.activationPercent_lastweek }}%</span>
										</div>
									</div>
								</el-col>
							</el-row>
						</div>
					</el-col>
					<el-col :span="3">
						<div class="tit">
							<img src="@/assets/images/screen/pwhj-titico3.png" width="25"/>
							车间温湿度
						</div>
						<div class="box box3">
							<el-row>
								<el-col :span="12">
									<div class="item">
										<img src="@/assets/images/screen/pwhj-wenshi-ico1.png"/>
										<h5>温度</h5>
										<div class="temp">
                      {{ temp }} <span>℃</span>
										</div>
									</div>
								</el-col>
								<el-col :span="12">
									<div class="item">
										<img src="@/assets/images/screen/pwhj-wenshi-ico2.png"/>
										<h5>湿度</h5>
										<div class="temp">
                      {{ humidity }} <span>%rh</span>
										</div>
									</div>
								</el-col>
							</el-row>
						</div>
					</el-col>
				</el-row>
			</div>
			<div class="floor2">
				<el-row :gutter="20">
					<el-col :span="8">
						<div class="downbox">
							<div class="tit">
								全厂最近七天产量
								<img src="@/assets/images/screen/boxbg-top.png" height="18"/>
							</div>
							<div class="data" id="chanliang"></div>
						</div>
					</el-col>
					<el-col :span="16">
						<div class="downbox">
							<div class="tit">
								设备状态
								<img src="@/assets/images/screen/boxbg-top.png" height="18"/>
							</div>
							<div class="data">
								<el-row :gutter="5">
									<el-col :span="4" v-for="item in equipstatus" :key="item.value">
										<img v-if="item.status==0" src="@/assets/images/screen/pwhj-state-lixian.png"/>
										<img v-if="item.status==1" src="@/assets/images/screen/pwhj-state-yunxing.png"/>
										<img v-if="item.status==2" src="@/assets/images/screen/pwhj-state-daiji.png"/>
										<div class="right">
											<span>{{ item.number }}</span>
											<span>今日产量：{{ item.output }}</span>
										</div>
									</el-col>
								</el-row>
							</div>
						</div>
					</el-col>
				</el-row>
			</div>
			<div class="floor3">
				<div class="downbox">
					<div class="tit">
						细部稼动率
						<img src="@/assets/images/screen/boxbg-top.png" height="18"/>
					</div>
					<div class="data">
						<div class="table">

						  <div class="scroll">
						    <el-table :data="tableData"
						              :fit="false"
						              stripe
						              border
						              style="width: 100%"
						    >
						      <el-table-column prop="name" label="设备名称" width="10%" />
						      <el-table-column prop="percent" label="稼动率" width="6%">
						        <template #default="scope">
						          <span>{{scope.row.percent}}</span>
						        </template>
						      </el-table-column>
						      <el-table-column label="上午">
						        <el-table-column prop="zero" label="0" width="3.5%" />
						        <el-table-column prop="one" label="1" width="3.5%" />
						        <el-table-column prop="two" label="2" width="3.5%" />
						        <el-table-column prop="three" label="3" width="3.5%" />
						        <el-table-column prop="four" label="4" width="3.5%" />
						        <el-table-column prop="five" label="5" width="3.5%" />
						        <el-table-column prop="six" label="6" width="3.5%" />
						        <el-table-column prop="seven" label="7" width="3.5%" />
						        <el-table-column prop="eight" label="8" width="3.5%" />
						        <el-table-column prop="nine" label="9" width="3.5%" />
						        <el-table-column prop="ten" label="10" width="3.5%" />
						        <el-table-column prop="eleven" label="11" width="3.5%" />
						      </el-table-column>
						      <el-table-column label="下午">
						        <el-table-column prop="twelve" label="12" width="3.5%" />
						        <el-table-column prop="thirteen" label="13" width="3.5%" />
						        <el-table-column prop="fourteen" label="14" width="3.5%" />
						        <el-table-column prop="fifteen" label="15" width="3.5%" />
						        <el-table-column prop="sixteen" label="16" width="3.5%" />
						        <el-table-column prop="seventeen" label="17" width="3.5%" />
						        <el-table-column prop="eighteen" label="18" width="3.5%" />
						        <el-table-column prop="nineteen" label="19" width="3.5%" />
						        <el-table-column prop="twenty" label="20" width="3.5%" />
						        <el-table-column prop="twentyone" label="21" width="3.5%" />
						        <el-table-column prop="twentytwo" label="22" width="3.5%" />
						        <el-table-column prop="twentythree" label="23" width="3.5%" />
						      </el-table-column>
						    </el-table>
						    <div class="colorline">
						      <div id="colorline"></div>
						    </div>
						  </div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import * as echarts from '@/utils/echarts'
  import {equimentCount} from '@/api/index'
  import {getAllStatusPercent,getDetailPercentList} from "@/api/industry/statusPercent";
  import {getCurrentData} from "@/api/sensor/sensor";
  import { todayIncrement,historyIncrementByAreaAndYcNoAndDate } from "@/api/industry/industrySensorData";
  /*import { listIndustryAreaSensor } from "@/api/industry/industrySensorData";*/
	export default {
	  name: "设备运行监视大屏",
	  data() {
	    return {
	      maniHt:'',
	      size: 'small',
	      isFullscreen: false,
        eqAll: 0,
        eqOnline: 0,
        eqOffline: 0,
        percent1: '30',
        percent2: '30',
        percent3: '30',
        percent4: '30',
        dataList:[],
        equList: [],
        statusDetail:[],
        statusDetail1:[],
        detailList:[],
        tableLength: '',
        queryParams: {
          datess: '',
          equipId:'',
          deptId:'',
        },
        ycNo:'29a4f943-b89a-11ed-9370-000c29deb847',
        ycNo1:'29a4fbdf-b89a-11ed-9370-000c29deb847',
        temp:null,
        humidity:null,
				equipstatus: [  //离线0，运行1，待机2
				],
				tablebiaotou:[],
				tableData: [],
        increaseList:[],
        datetimeList:[],
        intervalId:null,
        intervalId1:null
	    }
	  },

	  watch: {

	  },
	  created() {
      this.dataRefreh();
	  },

    destroyed(){
      // 在页面销毁后，清除计时器
      this.clear();
    },

	  mounted: function () {
			setTimeout(() => {
			  this.topimageLoaded();  //设置主界面高度
        this.getAllData();//整场稼动率
				this.getdetail();
        this.getCurrentData();//获取温湿度
        this.getIncrement();//获取今日增量
        this.getHistoryIncrement();//获取近7天产量
			}, 1000)

      equimentCount().then(res => {
        this.eqAll = res.data.all
        this.eqOffline = res.data.offline
        this.eqOnline = res.data.online
        this.eqAlarm = res.data.alarm
      })
	  },

	  methods: {

      // 定时刷新数据函数
      dataRefreh() {
        // 计时器正在进行中，退出函数
        if (this.intervalId != null) {
          return;
        }
        if (this.intervalId1 != null) {
          return;
        }
        // 计时器为空，操作
        this.intervalId = setInterval(() => {
          console.log("刷新" + new Date());
          this.getAllData();//整场稼动率
          this.getdetail();
          this.getIncrement();//获取今日增量
          this.getHistoryIncrement();//获取近7天产量
        }, 1000*60*10);
        this.intervalId1 = setInterval(() => {
          console.log("刷新" + new Date());
          this.getCurrentData();//获取温湿度
        }, 1000*60*5);
      },
      // 停止定时器
      clear() {
        clearInterval(this.intervalId); //清除计时器
        this.intervalId = null; //设置为null
        clearInterval(this.intervalId1); //清除计时器
        this.intervalId1 = null; //设置为null
      },

      timeFormat(time) { // 时间格式化 2019-09-08
        let year = time.getFullYear().toString();
        let month = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1).toString() : (time.getMonth() + 1).toString();
        let day = time.getDate() < 10 ? '0' + time.getDate().toString() : time.getDate().toString();
        return year + '-' + month + '-' + day;
      },
      timeFormat1(time) { // 时间格式化 09-08
        let month = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1).toString() : (time.getMonth() + 1).toString();
        let day = time.getDate() < 10 ? '0' + time.getDate().toString() : time.getDate().toString();
        return month + '-' + day;
      },

      getHistoryIncrement(){
        var myDate = new Date(); //获取今天日期
        myDate.setDate(myDate.getDate() - 6);
        var now = new Date();

        this.datetimeList=[]
        for(let i = 6;i>0;i--){
          let Dd = new Date();
          Dd.setDate(Dd.getDate()-parseInt(i));
          this.datetimeList.push(this.timeFormat1(Dd));
        }
        this.datetimeList.push(this.timeFormat1(now))

        historyIncrementByAreaAndYcNoAndDate({areaId:1,ycName:'总产量',start:this.timeFormat(myDate),end:this.timeFormat(now)}).then(res => {
          this.increaseList = []
          if(res.data.length>0){
            res.data.forEach((i, index) => {
              this.increaseList.push(i.increment)
            })
          }
          this.$nextTick(() => {
            this.chanliang();
          })
        })
      },

      getIncrement(){
        todayIncrement({areaId:1,ycName:'总产量'}).then(res => {
          this.equipstatus=[];
          if(res.data!=null){
            res.data.forEach((i, index) => {
              if(i.runStatus=='运行'){
                this.equipstatus.push({
                  status: 1,
                  number: i.sensorName,
                  output: i.increment
                })
              }else if(i.runStatus=='关机'){
                this.equipstatus.push({
                  status: 0,
                  number: i.sensorName,
                  output: i.increment
                })
              }else if(i.runStatus=='待机'){
                this.equipstatus.push({
                  status: 2,
                  number: i.sensorName,
                  output: i.increment
                })
              }
            })
          }
        })
      },

      getCurrentData(){
        getCurrentData({ycNo:this.ycNo}).then(response => {//温度
          this.temp = response.data
        });
        getCurrentData({ycNo:this.ycNo1}).then(response => {//湿度
          this.humidity = response.data
        });
      },

	    //获取各个稼动率数据
      getAllData(){
        getAllStatusPercent(this.queryParams).then(response => {
          this.dataList = response.data;
          this.percent1 = response.data.activationPercent;
          this.percent2 = response.data.activationPercent_yes;
          this.percent3 = response.data.activationPercent_nowweek;
          this.percent4 = response.data.activationPercent_lastweek;
        });
      },

	    topimageLoaded() {
	    	let topHt = document.querySelector('.toptitle').clientHeight + 'px';
	    	this.maniHt = 'calc(100% - ' + topHt + ' - 10px)';
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
	        document.querySelector('.main-container').style = "margin-left:0!important;height:100%!important;";
	        document.querySelector('.app-main').style.height = '100%';
	        document.querySelector('.navbar').style.display = 'none';
	        document.querySelector('.pengwuhejin').style.height = '100vh';
	        document.querySelector('.tags-view-container').style.display = 'none';
					document.getElementById('colorline').style.height = this.tableLength * 40 + 'px';
				} else if (this.size == 'big') {
	        this.size = 'small'
	        document.querySelector('.sidebar-container').style.width = "";
	        document.querySelector('.main-container').style.marginLeft = "";
	        document.querySelector('.main-container').style.height = "";
	        document.querySelector('.navbar').style.display = 'block';
	        document.querySelector('.tags-view-container').style.display = 'block'
					document.querySelector('.pengwuhejin').style.height = 'calc(100vh - 84px)';
				}
	    },

			chanliang() {
				let chartDom = document.getElementById('chanliang');
				let myChart = echarts.init(chartDom);
				let option;

				option = {
				  tooltip: {
				    trigger: 'axis',
				  },
					grid: {
						top: 40,
						left: 35,
						right: 10,
						bottom: 30
					},
					color: ['#10b9f8', '#ff9314'],
				  legend: {
				    data: ['产量', '产量'],
						right: 0,
						top: 10,
						itemHeight: 6,
						itemWidth: 20,
						textStyle: {
							color: "#fff"
						}
				  },
				  xAxis: [
				    {
				      type: 'category',
				      data: this.datetimeList,
				      axisLabel: {
								color: "#fff"
							},
							axisLine: {
								lineStyle: {
									color: "#713871"
								}
							}
				    }
				  ],
				  yAxis: [
				    {
				      type: 'value',
							axisLabel: {
								color: "#fff"
							},
							axisLine: {
								show: true,
								lineStyle: {
									color: "#40628e"
								}
							},
							splitLine: {
								lineStyle: {
									color: "#1c296a",
									type: 'dashed'
								}
							}
				    }
				  ],
				  series: [
				    {
				      name: '产量',
				      type: 'bar',
				      data: this.increaseList,
							barWidth: 16,
							itemStyle: {
								borderRadius: [10, 10, 0, 0]
							},
				    },
				    {
				      name: '产量',
				      type: 'line',
							smooth: true,
				      // tooltip: {
				      //   valueFormatter: function (value) {
				      //     return value + ' °C';
				      //   }
				      // },
				      data: this.increaseList,
							symbolSize: 5,
							symbol: "circle",
              label: {
                show: true,
                position: 'top',
                color:"#ff9314"

              },
							itemStyle: {
								color: "#fcfc03"
							},
							lineStyle: {
								color: "#ff9314"
							}
						}
				  ]
				};

				option && myChart.setOption(option);
			},

			getdetail(date,date1){
			  if(date==null || date=='' || date==undefined){
			    date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
			    date1 = new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate();
			  }
			  this.queryParams.datess = date;
			  getDetailPercentList(this.queryParams).then(response => {
          this.equList = [];
          this.statusDetail1 = [];
          this.tableData = [];

			    this.detailList = response.rows;
			    this.tableLength = this.detailList.length;

			    //图表高度
			    document.getElementById('colorline').style.height = this.tableLength * 34 + 'px';


			    this.detailList.forEach((i, index) => {
			      this.tableData.push({
			        id:i.equipId,
			        name: i.equipName,
			        percent: i.activationPercent+'%'
			      });
			      this.equList.push(i.equipId);

			      if(i.statusDetail!=null){
			        i.statusDetail.forEach((j, index) => {
			          this.statusDetail1.push({
			            name: j.statusName,
			            sta: j.status,
			            startvalue: j.date,
			            equname: j.equipName,
			            equid: j.equipId
			          });
			        })
			      }
			    })

			    this.$nextTick(() => {
			      this.colorline(date,date1);
			    })
			  });
			},
			colorline(date,date1) {
			  const chartDom = document.getElementById('colorline');
			  chartDom.removeAttribute('_echarts_instance_');
			  var myChart = echarts.init(chartDom);
			  var option;
			  var list = this.statusDetail1;
			  var data = [];
			  var categories = [];
			  let localeDate = date1;
			  let aaa = (+new Date(new Date(localeDate).getTime())).toString().substring(0,10);
			  let endTime = Math.round((+new Date(+new Date(new Date(localeDate).toLocaleDateString()) + 24 * 60 * 60 * 1000 - 1)).toString().substring(0,10));
			  var startTime = Math.round(aaa);
			  var baseTime;
			  categories = this.equList;
			  var types = [
			    { name: '加工', color: '#22ac38' },
			    { name: '闲置', color: '#f39800' },
			    { name: '离线', color: '#b5b5b5' },
			    { name: '警示', color: '#d9031e' }
			  ];
			  // Generate mock data
			  categories.forEach(function (category, index) {
			    baseTime = startTime;
			    var typeI = 0;
			    var typename = "断电";
			    for(let yx of list){
			      if(category==yx.equid){
			        var startvalue = Math.round(yx.startvalue);
			        var typeItem_color
			        var duration = Math.round(startvalue-baseTime);
			        if(typeI=='1'){
			          typeItem_color = '#22ac38';
			        }
			        if(typeI=='0'){
			          typeItem_color = '#b5b5b5';
			        }
			        if(typeI=='2'){
			          typeItem_color = '#f39800';
			        }
			        if(typeI=='3'){
			          typeItem_color = '#d9031e';
			        }
			        data.push({
			          name: typename,
			          //baseTime应该固定不变，为查询时间的00:00:00
			          value: [(categories.length-index-1), baseTime,  (baseTime += duration), duration],
			          // value: [index, baseTime, (baseTime += duration), duration],

			          itemStyle: {
			            normal: {
			              color: typeItem_color
			            }
			          }
			        });
			      }
			      if(startvalue!=undefined && startvalue!=null){
			        typeI = yx.sta;
			        typename = yx.name;
			      }
			    }

			    //增加一个结束data
			    if(date == new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()){//今天
			      data.push({
			        name: '',
			        //baseTime应该固定不变，为查询时间的00:00:00
			        value: [(categories.length-index-1), baseTime,  endTime, (endTime - baseTime)],
			        // value: [index, baseTime, (baseTime += duration), duration],

			        itemStyle: {
			          normal: {
			            color: 'transparent'
			          }
			        }
			      });
			    }else{
			      data.push({
			        name: '断电',
			        //baseTime应该固定不变，为查询时间的00:00:00
			        value: [(categories.length-index-1), baseTime,  endTime, (endTime - baseTime)],
			        // value: [index, baseTime, (baseTime += duration), duration],

			        itemStyle: {
			          normal: {
			            color: '#b5b5b5'
			          }
			        }
			      });
			    }
			  });
			  let renderitemNum=0 // 测试循环次数计数，可进行删除
			  function renderItem(params, api) {
			    renderitemNum+=1
			    var categoryIndex = api.value(0);
			    var start = api.coord([api.value(1), categoryIndex]);
			    var end = api.coord([api.value(2), categoryIndex]);
			    var height = api.size([0, 1])[1] * 0.6;
			    var rectShape = echarts.graphic.clipRectByRect(
			        {
			          x: start[0],
			          y: start[1] - height / 2,
			          width: end[0] - start[0],
			          height: height
			        },
			        {
			          x: params.coordSys.x,
			          y: params.coordSys.y,
			          width: params.coordSys.width,
			          height: params.coordSys.height
			        }
			    );
			    return (
			        rectShape && {
			          type: 'rect',
			          transition: ['shape'],
			          shape: rectShape,
			          style: api.style()
			        }
			    );
			  }
			  option = {
			    tooltip: {
			      formatter: function (params) {
			        return params.marker + params.name;
			      }
			    },
			    grid: {
			      top: '0',
			      right: '0',
			      left: '0',
			      bottom: '0'
			    },
			    xAxis: {
			      min: startTime,
			      max:endTime,
			      axisLabel: {
			        show: true,
			      }
			    },
			    yAxis: {
			      data: categories,
			      axisTick:{
			        show:false // 不显示坐标轴刻度线
			      },
			      axisLine: {
			        show: false, // 不显示坐标轴线
			      },
			      axisLabel: {
			        show: false, // 不显示坐标轴上的文字
			      },
			      splitLine:{
			        show:false // 不显示网格线
			      },
			    },
			    series: [
			      {
			        type: 'custom',
			        renderItem: renderItem,
			        name:'关',
			        itemStyle: {

			        },
			        encode: {
			          x: [1, 2],
			          y: 0
			        },
			        data: data
			      },
			      {
			        type: 'custom',
			        name:'开',
			      }
			    ]
			  };

			  option && myChart.setOption(option);
			},
	  },

	}
	</script>


	<style scoped lang="scss">
	.pengwuhejin {
	  background: url('@/assets/images/screenyxjs/bg.jpg') no-repeat center;
		background-size: cover;
		height: calc(100vh - 84px);

		.toptitle{
			img{width: 100%;display: block;}

	    .fangda {
	      position: absolute;
	      right: 20px;
	      top: 20px;
	      font-size: 18px;
	      color: #2aa7d3;
	    }
		}
		:deep(.el-row) {
			height: 100%;
			.el-col{height: 100%;}
		}
		.main{
			margin-top: 0px;padding: 0 35px;
			.floor1{
				height: 22%;
				.tit{
					font-size: 18px;color: #fff;
					margin: 0 0 8px;white-space: nowrap;
					img{
						vertical-align: middle;
					}
				}
				.box{
					height: calc(100% - 36px);
					background: url("@/assets/images/screen/pwhj-boxbg.png") no-repeat;
					background-size: 100% 100%;
				}
				.box1{
					.up{
						height: 45%;position: relative;color: #fff;
						padding: 0 15px;box-sizing: border-box;
						.el-row{
							position: absolute;width: 100%;
							top:calc(50% - 4px);transform:translateY(-50%);
							height: auto;
						}
						img{
							vertical-align: middle;
						}
						span{
							float: right;font-size: 24px;font-weight: bold;
							height: 35px;line-height: 35px;
							position: relative;right: 30px;
						}
						.line{
							position: absolute;left: 0;bottom: 0;
							width: 100%;height: 8px;
						}
					}
					.up:before,.up::after{
						content: '';clear: both;display: table;
					}
					.down{
						height: 55%;padding: 0 10px;
						.item{
							height: 100%;
							img{
								max-width: 65px;float: left;
								max-height: 90%;margin-right: 10px;
							}
							.itemword{
								width: calc(100% - 75px);float: left;
								white-space: nowrap;
								position: relative;
								top: 50%;margin-top: -25px;
								span{
									display: block;font-size: 20px;font-weight: bold;
									color: #fff;
								}
								h5{
									color: #06eff2;font-size: 14px;
									margin: 5px 0 0;
								}
								h5.lixian{
									color: #08ace1;
								}
							}
						}
						.item:before,.item::after{
							content: '';clear: both;display: table;
						}
					}
				}
				.box2{
					background: transparent;
					.item{
						height: 100%;
						background: url("@/assets/images/screen/pwhj-jdlbg.png") no-repeat;
						background-size: 100% 100%;
						padding: 0 15px;
						.circle{
							width: 50%;float: left;height: 100%;
							background: url("@/assets/images/screen/pwhj-jiadong-ico1.png") no-repeat center;
							background-size: 100%;
							:deep(.el-progress) {
								width: 84%;
								position: relative;
								top: 50%;left: 50%;
								transform:translate(-50%,-50%);
								.el-progress-circle{
									width: 100% !important;height: 100% !important;
								}
								.percentage-value{
									font-size: 12px;color: #fff;
								}
							}
						}
						.right-data{
							width: 50%;float: left;text-align: center;
							position: relative;
							top: 50%;
							transform:translate(0%,-50%);
							color: #fff;
							h5{
								font-size: 15px;margin: 0
							}
							span{
								display: block;margin: 15px 0 0;
								white-space: nowrap;font-size: 18px;
							}
						}
					}
					.item:before,.item::after{
						content: '';clear: both;display: table;
					}
				}
				.box3{
					background: url("@/assets/images/screen/pwhj-boxbg2.png") no-repeat;
					background-size: 100% 100%;
					padding: 0 10px;
					.item{
						position: relative;top: 50%;
						transform:translate(0%,-50%);
						text-align: center;color:#fff;
						img{
							width: 65px;
						}
						h5{
							font-size: 14px;margin: 0 0 5px;
						}
						.temp{
							font-size: 16px;font-weight: bold;
							white-space: nowrap;
							span{
								color: #47c9ff;
							}
						}
					}
				}

			}
			.floor2{
				height: calc(28% - 25px);
				margin: 12px 0;
			}
			.downbox{
				height: 100%;
				border: 1px solid #082074;

				.tit{
					text-align: center;font-size: 18px;color: #fff;
					height: 30px;line-height: 30px;
					background: #0c1252;
					position: relative;
					img{
						position: absolute;left: 0;top: 0;
					}
				}
				.data{
					height: calc(100% - 30px);
					background: url("@/assets/images/screen/pwhj-databg.png") no-repeat;
					background-size: 100% 100%;
					box-shadow: 0 0 10px inset #0233aa;
					padding: 0 20px;
					:deep(.el-row) {
						.el-col{height: 50%;}
					}
					img{
						float: left;display: block;margin-right: 8px;
						width: 30%;position: relative;
						top:50%;
						transform:translate(0%,-50%);
					}
					.right{
						color: #fff;font-size: 12px;
						width: calc(70% - 8px);float: left;
						position: relative;
						top:50%;
						transform:translate(0%,-50%);
						span{
							display: block;white-space: nowrap;
						}
					}

				}
			}
			.floor3{
				height: 50%;
				.data{
					padding: 10px;
				}
				.table{
				  position: relative;
				  height:100%;
				  .scroll{
				    position: relative;z-index: 1;
				    height: 100%;
						//overflow-y: auto;
				  }
				  .scroll::-webkit-scrollbar{
				    width: 5px;
				  }
				  .scroll::-webkit-scrollbar-thumb {
				    border-radius: 10px;
				    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
				    background: rgba(0,0,0,0.2);
				  }
				  .scroll::-webkit-scrollbar-track {
				    box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
				    border-radius: 0;
				    background: rgba(0,0,0,0.1);
				  }

				  :deep(.el-table) {
						background: transparent;
						--el-table-border-color: #173482 !important;

				    .el-table__empty-block{
				      width:100% !important
				    }
				    .el-table__header{
				      width: 100% !important;
				    }
				    .el-table__body{
				      width: 100% !important;
				    }
				    th.el-table__cell{
				      background: #0172a2 !important;
				      color: #fff;
				      text-align: center;
				      height:20px !important;padding:0;
				    }
				    .is-group tr:last-child th.el-table__cell{
				      background: transparent !important;
				      color: #fff;
				    }
						td.el-table__cell{
							background: transparent;
							color: #fff;padding:5px 0;
						}
						tr{
							background: transparent;
						}
				    .cell{
				      text-align: center;padding:0;
							white-space: nowrap;
				    }
				    .el-table__body tr.el-table__row--striped td.el-table__cell{
				      background: #101f73;
				    }
				    .el-table--border, .el-table--group {
				      border: 2px solid #173482!important;
				    }
						.el-button{
							padding: 0;color: #08ace1;border: 0;
							background: transparent;
							margin-left: 10px;
						}
				  }
					#tablezhanwei{
					  position: absolute;
					  left: 0;top: 0;z-index: 2;
						:deep(tr) {
							background: #101e75;
						}
						:deep(.el-table__empty-block) {
							display: none;
						}
					}
				  .colorline{
				    position: absolute;
				    right: 0;top: 46px;
				    //height: calc(100% - 80px);
						height: 100%;
				    width: 81.8%;
				    // background: #000;
				    z-index: 9;
				    pointer-events: none;
				    //overflow-y: auto;
				    #colorline{height: 100%;}
				  }
				}
				.mingxibox{
					:deep(.el-row) {
						height: auto;
						.el-col{height: auto;}
					}
					:deep(.el-dialog) {
						height: 88vh;
						.el-dialog__body{
							padding: 15px;
							height: calc(100% - 50px);
						}
					}
					.tit{
						font-size: 14px;
						span{font-weight: bold;}
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
				}
			}
		}
}
</style>
