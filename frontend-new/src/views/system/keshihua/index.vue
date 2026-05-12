<template>
  <div class="home">
    <div class="head">
      <h4>星辉公司设备云平台</h4>
      <!-- <span>{{now}}</span> -->
      <div class="fangda">

        <i v-if="size == 'small'" style="cursor: pointer;" @click="changeSize()"><img src="@/assets/images/fangda.png"></i>
        <i v-if="size == 'big'" style="cursor: pointer;" @click="changeSize()"><img
            src="@/assets/images/suoxiao.png"></i>
      </div>
      <!--      <el-button @click="poppage('/system/hazardsource')">test</el-button>-->
    </div>
    <div class="contermy">
      <el-row class="hit" :gutter="30">
        <!-- 左侧-->
        <el-col :span="6" style="height: 100%;">
          <div class="left-con">
            <!-- 设备概览-->
            <div class="part-1 title border-p">
              <h4><img src="@/assets/images/screen/tit-1.png">设备概览</h4>

              <el-row>
                <el-col :span="6">
                  <div class="part-1-li"><span>{{ eqAll }}</span></div>
                  <p class="text-cen">设备总数</p>
                </el-col>
                <el-col :span="6">
                  <div class="part-1-li"><span>{{ eqOnline }}</span></div>
                  <p class="text-cen">在线设备</p>
                </el-col>
                <el-col :span="6">
                  <div class="part-1-li"><span>{{ eqOffline }}</span></div>
                  <p class="text-cen">离线设备</p>
                </el-col>
                <el-col :span="6">
                  <div class="part-1-li"><span>{{ eqAlarm }}</span></div>
                  <p class="text-cen">告警设备</p>
                </el-col>
              </el-row>
            </div>


            <!-- 设备类型览-->
            <div class="part-2 title border-p">
              <h4><img src="@/assets/images/screen/tit-2.png">设备类型</h4>
              <el-row class="echart-bom">
                <el-col :span="14">
                  <div class="echart-con" id="sblx">

                  </div>
                </el-col>
                <el-col :span="10" class="sblx-r">
                  <div class="sblx-ul">
                    <el-row v-for="item in eqType">
                      <el-col :span="24" class="sblx-li">
                        <el-row>
                          <el-col :span="12">
                            <div class="name">{{ item.name }}</div>
                          </el-col>
                          <el-col :span="12">
                            <div class="number text-right" style="white-space: nowrap;"><span>{{
                                item.num
                              }}台</span>/{{ item.ratio }}%
                            </div>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </div>

            <!-- 7天告警趋势-->
            <div class="part-3 title border-p">
              <h4><img src="@/assets/images/screen/tit-3.png">7天告警趋势</h4>
              <div class="height-bom" id="gjqs">
              </div>
            </div>

            <!-- 能耗分析-->
            <div class="part-3 title border-p" style="margin-bottom:0;height:25%;">
              <h4><img src="@/assets/images/screen/tit-4.png">能耗分析</h4>
              <div class="height-bom" id="nhfx">
              </div>
            </div>
          </div>
        </el-col>

        <!-- 右侧-->
        <el-col :span="18">
          <div class="con-nr">
            <div class="con-nr-1">
              <div id="map_container">
								<div v-for="item in equipmentList" class="btn" :dataid="item.id" @click="jiadongtanchu(item.id)">
									<el-tooltip
										effect="light"
										:content="item.name"
										placement="top-start"
										:offset="0"
									>
										<img src="@/assets/images/screen/xinghui-equipico.png" width="30"/>
									</el-tooltip>
								</div>
              </div>
            </div>
          </div>
        </el-col>

				<!-- 稼动率弹出 -->
				<div class="jiadongtanchu">
					<el-dialog
					    v-model="jiadongbox"
					    title="Tips"
					    width="calc(100% - 200px)"
					  >
							<div class="close" @click="jiadongbox = false">
								<el-icon><CloseBold /></el-icon>
							</div>
            <div style="padding-top: 30px;">
              <jiadonglv :eId="eId"></jiadonglv>
            </div>
					  </el-dialog>
				</div>

      </el-row>

    </div>

  </div>
</template>

<script>

import screenfull from "screenfull"; // 引入全屏显示
import {parseTime} from '@/utils/ruoyi'
import {equimentCount, equimentType, alarmTrend} from '@/api/index'
import {totalElectricityByDay} from "@/api/energy/energyoverview";
import jquery from "jquery";
import Jinhui from '@/components/Jinhui';
import FocusCloud from '@/components/FocusCloud';
import jiadonglv from '@/views/system/jiadonglv';

import { listIndustryAreaSensor } from "@/api/industry/industryAreaSensor";

export default {
  name: "daping",
  components: {FocusCloud, Jinhui,jiadonglv},
  data() {
    return {
      type: 'FocusCloud',
      size: 'small',
      isFullscreen: false,
      datetime: '',
      now: '',
      week: '',
      eqAll: 0,
      eqOnline: 0,
      eqOffline: 0,
      elDataTitle: [],
      elData: [],
      eqType: [],
      eqAlarm: 0,
      eId:'',
			jiadongbox: false,
			isZhezhao: false,
      equipmentList: [
				{
					id: '1',
					name: '设备1'
				},
				{
					id: '2',
					name: '设备2'
				},
				{
					id: '3',
					name: '设备3'
				}
			],
      sensorList:[],
    }
  },

  watch: {

  },
  created() {
    this.getEquipInfo();//获取星辉设备信息
  },

  mounted: function () {
    jquery('#cesiumContainer').html('')
    let that = this;

    jquery(document.getElementById('cesiumContainer')).on('click', function (e) {
      let x = e.offsetX;
      let y = e.offsetY;
      if (that.shownrong) {
        jquery('.nronglist').css({'display': 'block', 'left': x + 'px', 'top': y + 'px'});
      }
    });

    this.nowDate();

    window.onresize = () => {
      return (() => {
        // window.innerHeight:浏览器的可用高度
        window.screenHeight = window.innerHeight
        this.screenHeight = window.screenHeight
      })()
    }

    //改变导航颜色
    this.navcolorchange();


		//获取当前日期、时间、周几
    //当前年月日时分秒
    let yy = new Date().getFullYear();
    let mm = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
    let dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
    let hh = new Date().getHours();
    let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
    let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
    var gettime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf;
    //当前星期
    let wk = new Date().getDay();
    let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    let week = weeks[wk];
    this.datetime = gettime + ' ' + week;   //年-月-日 时间 星期
    this.week = week;
    this.time = hh + ':' + mf;  						//时:分
    this.monthstart = mm + '-01';						//每个月1号
    this.monthday = mm + '-' + dd;					//今天，月-日


    this.newdate = yy + mm + dd

    //console.log(gettime, week)

    equimentCount().then(res => {
      this.eqAll = res.data.all
      this.eqOffline = res.data.offline
      this.eqOnline = res.data.online
      this.eqAlarm = res.data.alarm
    })
    equimentType().then(res => {
      this.eqType = res.data;
      let data = [];
      res.data.forEach((i, index) => {
        data.push({value: i.num, name: i.name})
      })
      this.sblx(data);
    })
    alarmTrend({"interval": "7"}).then(res => {
      let dataArray = [];
      let data = [];
      res.data.forEach((i, index) => {
        data.push(i.num)
        dataArray.push(parseTime(i.dt, '{m}-{d}'))
      })
      this.gjqs(dataArray, data);
    }),
        totalElectricityByDay({"type":3,"deptId":""}).then(res => {
          if (res.data != null) {
            let dataArray = [];
            let nowData = [];
            let data = res.data;
            for (let key in data.now) {
              dataArray.push(key + '月')
              nowData.push(data.now[key])
            }
            this.nhfx(dataArray, nowData)
          }
        })
  },

  unmounted() {
    clearInterval(this.nowTimer)
  },

  methods: {
    getEquipInfo(){
      listIndustryAreaSensor(this.queryParams).then(response => {
        this.equipmentList=[];
        this.sensorList = response.rows;
        if(response.rows!=null){
          this.sensorList.forEach((i, index) => {
            this.equipmentList.push({
              id: i.sensorId,
              name: i.sensorName
            });
          })
        }
      });
    },

    navcolorchange() {
      document.querySelector('.navbar').style.background = '#243547';
      document.querySelector('.tags-view-container').style.background = '#1e2d3e';
      document.querySelector('.el-breadcrumb__inner a').style.color = '#97a8be';
      document.querySelector('.navbar .right-menu .avatar-container .avatar-wrapper').style.color = '#fff';
    },
		jiadongtanchu(eId){
      this.eId = eId;
			this.jiadongbox = true;
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
        document.querySelector('.home').style.minHeight = '100vh';
        document.querySelector('.navbar').style.display = 'none';
        document.querySelector('.tags-view-container').style.display = 'none';
        document.querySelector('.hit').style.height = 'calc(100vh - 60px)';


      } else if (this.size == 'big') {
        this.size = 'small'
        document.querySelector('.sidebar-container').style.width = "";
        document.querySelector('.main-container').style.marginLeft = "";
        document.querySelector('.navbar').style.display = 'block';
        document.querySelector('.app-main').style.minHeight = 'calc(100vh - 84px)';
        document.querySelector('.home').style.minHeight = 'calc(100vh - 84px)';
        document.querySelector('.tags-view-container').style.display = 'block'
        document.querySelector('.hit').style.height = '100%';
      }
    },
    nowDate() {
      this.nowTimer = setInterval(() => {
        let nowDate = new Date();
        this.now = parseTime(nowDate)
      }, 1000)
    },
    sblx(data) {
      const chartmaindom = document.getElementById('sblx');
      chartmaindom.removeAttribute('_echarts_instance_');
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.echarts.init(document.getElementById('sblx'))

      myChart.setOption({
        tooltip: {
          trigger: 'item'
        },
				color: ['#f8b62d', '#52ffff', '#28b1ff', '#f53f8c'],
        legend: {
          bottom: '0',
          left: 'center',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: '#ffffff',
          },

					icon: 'circle',
					width: '100px'
        },
        series: [
          {
            name: '设备类型',
            type: 'pie',
            radius: ['45%', '65%'],
            center: ['50%', '40%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {},
            labelLine: {
              show: false
            },
            data: data
          }
        ]
      });
      // 绘制图表
    },
    /*能耗分析*/
    nhfx(dataArray, data) {
      const chartmaindom = document.getElementById('nhfx');
      chartmaindom.removeAttribute('_echarts_instance_');
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.echarts.init(document.getElementById('nhfx'))
      myChart.setOption({

        tooltip: {
          trigger: 'axis',
          // axisPointer: {
          //   type: 'shadow'
          // }
        },
        grid: [
          {
            bottom: '15%',
            top: '15%',
            right: '2%'
          },
        ],
        xAxis: {
          type: 'category',
          /*改变x轴颜色*/
          axisLine: {
            lineStyle: {
              color: '#ffffff',
              width: 1, //这里是为了突出显示加上的
            }
          },
          axisLabel: {
            textStyle: {
              fontSize: "8",
            },
          },
          axisTick: {
            show: false
          },
          data: dataArray
        },
        yAxis: {
          show: true,
          splitLine: {
            lineStyle: {
              color: "rgba(190, 228, 248, .1)"
            }
          },

          axisLine: {
            lineStyle: {
              color: '#ffffff',
              width: 1, //这里是为了突出显示加上的
            }
          },
          type: 'value'
        },
        series: [
          {
            // barWidth : 40,
            data: data,
            type: 'bar',
            // showBackground: true,
            // backgroundStyle: {
            //   // 背景色
            //   color: 'rgba(180, 180, 180, 0.2)'
            // },
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,  //右
                y: 0,  //下
                x2: 0,  //左
                y2: 1,  //上
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(72,188,147, 1)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(40,187,213, 1)'// 100% 处的颜色
                  }
                ]
              }
            },

          }
        ]
      });
      // 绘制图表
    },
    /*告警趋势*/
    gjqs(dataArray, data) {
      const chartmaindom = document.getElementById('gjqs');
      chartmaindom.removeAttribute('_echarts_instance_');
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.echarts.init(document.getElementById('gjqs'))
      myChart.setOption({
        xAxis: {
          type: 'category',
          /*改变x轴颜色*/
          axisLine: {
            lineStyle: {
              color: '#ffffff',
              width: 1, //这里是为了突出显示加上的
            }
          },
          axisLabel: {
            textStyle: {
              fontSize: "10",
            },
          },
          axisTick: {
            show: false
          },
          data: dataArray
        },
        grid: [
          {
            bottom: '15%',
            top: '15%',
            right: '2%'
          },
        ],
        yAxis: {
          show: true,
          splitLine: {
            lineStyle: {
              color: "rgba(190, 228, 248, .1)"
            }
          },

          axisLine: {
            lineStyle: {
              color: '#ffffff',
              width: 1, //这里是为了突出显示加上的
            }
          },
          type: 'value'
        },
        series: [
          {
            data: data,
            type: 'line',
            smooth: true
          }
        ]
      });
      // 绘制图表
    },

  },

}
</script>


<style scoped lang="scss">
p {
  margin: 0;
}

.fl {
  float: left;
}

.border-p {
  padding: 15px
}

.text-cen {
  text-align: center;
}

.text-right {
  text-align: right;
}

.mr-20 {
  margin-right: 20px;
}

.title {
  h4 {
    font-size: 16px;
    margin: 0;

    img {
      vertical-align: middle;
      margin-right: 6px;
      padding: 2px 0;
    }
  }
}

.jiadongtanchu{
	:deep(.el-dialog) {
		margin-top: 84px !important;
		margin-left: 200px !important;
		height: calc(100vh - 84px);
		border-radius: 0;
		position: relative;
		.el-dialog__header{
			display: none;
		}
		.el-dialog__body{
			padding: 0;
		}
		.close{
			position: absolute;right: 15px;top: 15px;
			cursor: pointer;
		}
	}

}

.home {
  background: url("@/assets/images/screen/screen-bg.jpg") no-repeat;
  height: calc(100vh - 84px);
  color: #aaddff;
  font-size: 14px;
  background-size: 100% 100%;

  .head {
    background: url("@/assets/images/screen/head.png") center;
    color: #FFFFFF;
    height: 55px;
    background-size: 100% 100%;
    position: relative;

    h4 {
      margin: 0;
      padding-top: 8px;
      text-align: center;
      font-size: 30px;
      background-image: -webkit-linear-gradient(bottom, #1860c9, #07cff3);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: bold;
    }

    span {
      position: absolute;
      left: 40px;
      top: 15px;
      color: #2aa7d3;
    }

    .fangda {
      position: absolute;
      right: 20px;
      top: 20px;
      font-size: 18px;
      color: #2aa7d3;
    }

  }

  .contermy {
    height: calc(100% - 40px);
    padding: 0 25px 20px;

    .hit {
      height: 100%
    }

    .part-3 {
      background: url("@/assets/images/screen/left-2-bak.png") no-repeat;
      background-size: 100% 100%;
      height: 24%;
      margin-bottom: 2.4%;

      .height-bom {
        height: 14vh;
      }
    }

    .left-con {
      height: 100%;

      .part-1 {
        background: url("@/assets/images/screen/left-1.png") no-repeat;
        background-size: 100% 100%;
        height: 19%;
        margin-bottom: 1.9%;

        .part-1-li {
          background: url("@/assets/images/screen/pati-1bg.jpg") no-repeat;
          color: #ffb956;
          font-size: 22px;
          font-weight: bold;
          text-align: center;
          width: 70px;
          height: 70px;
          background-size: cover;
          line-height: 70px;
          margin: 0 auto;

          span {
            transform: scale(0.8, 1);
            white-space: nowrap;
          }
        }

      }

      .part-2 {
        background: url("@/assets/images/screen/left-2-bak.png") no-repeat;
        background-size: 100% 100%;
        height: 29%;
        margin-bottom: 2.9%;

        .echart-bom {
          height: 18vh;

          .echart-con {
            height: 100%;
          }

          .sblx-r {
            padding-right: 30px;

            .sblx-ul {
              .sblx-li {
                background: url("@/assets/images/screen/part7-li.jpg") no-repeat;
                color: #aaddff;
                font-size: 12px;
                height: 35px;
                line-height: 35px;
                background-size: 100% 100%;
                padding: 0 10px;
                margin-bottom: 5px;

                .number {
                  span {
                    color: #ffb956;
                  }
                }
              }
            }
          }
        }
      }


    }

    .con-nr {
      height: 90%;top: 5%;
      position: relative;

      .map-border {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: url("@/assets/images/screen/map-border.png") no-repeat;
        background-size: 100% 100%;
        pointer-events: none;
      }

      .con-nr-1 {
        position: relative;
        height: 100%;

        #map_container {
          height: 100%;
					background: url("@/assets/images/screen/xinghui-changfang.jpg") no-repeat;
					background-size: 100% 100%;

					.btn{
						position: absolute;cursor:pointer;
						img{width: 30px;}
					}
					.btn:nth-child(1){
						left: 62.5%;
						top: 38.5%
					}
					.btn:nth-child(2){
						left: 61%;
						top: 35%
					}
					.btn:nth-child(3){
						left: 65%;
						top: 38.5%
					}
					.btn:nth-child(4){
						left: 66.5%;
						top: 36.5%
					}
					.btn:nth-child(5){
						left: 69%;
						top: 36.5%
					}
					.btn:nth-child(6){
						left: 67%;
						top: 32.5%
					}
					.btn:nth-child(7){
						left: 69%;
						top: 32.5%
					}
					.btn:nth-child(8){
						left: 71%;
						top: 32.5%
					}
					.btn:nth-child(9){
						left: 71%;
						top: 36.5%
					}
					.btn:nth-child(10){
						left: 60%;
						top: 27%
					}
					.btn:nth-child(11){
						left: 62%;
						top: 27%
					}
					.btn:nth-child(12){
						left: 61%;
						top: 22%
					}
					.btn:nth-child(13){
						left: 64%;
						top: 27%
					}
					.btn:nth-child(14){
						left: 64%;
						top: 22%
					}
					.btn:nth-child(15){
						left: 67%;
						top: 27%
					}
					.btn:nth-child(16){
						left: 67%;
						top: 22%
					}
					.btn:nth-child(17){
						left: 70%;
						top: 27%
					}
					.btn:nth-child(18){
						left: 70%;
						top: 22%
					}
					.btn:nth-child(19){
						left: 69%;
						top: 46%
					}
					.btn:nth-child(20){
						left: 69%;
						top: 49.5%
					}
					.btn:nth-child(21){
						left: 60%;
						top: 47%
					}
					.btn:nth-child(22){
						left: 43%;
						top: 47%
					}
					.btn:nth-child(23){
						left: 59%;
						top: 53.5%
					}
					.btn:nth-child(24){
						left: 55%;
						top: 53.5%
					}
					.btn:nth-child(25){
						left: 51%;
						top: 53.5%
					}
					.btn:nth-child(26){
						left: 48%;
						top: 53.5%
					}
					.btn:nth-child(27){
						left: 44.5%;
						top: 53.5%
					}
					.btn:nth-child(28){
						left: 42.5%;
						top: 53.5%
					}
					.btn:nth-child(29){
						left: 34%;
						top: 39%
					}
					.btn:nth-child(30){
						left: 36.4%;
						top: 39%
					}
					.btn:nth-child(31){
						left: 38.8%;
						top: 39%
					}
					.btn:nth-child(32){
						left: 34%;
						top: 35%
					}
					.btn:nth-child(33){
						left: 36.4%;
						top: 35%
					}
					.btn:nth-child(34){
						left: 38.8%;
						top: 35%
					}
					.btn:nth-child(35){
						left: 41%;
						top: 35%
					}
					.btn:nth-child(36){
						left: 33.5%;
						top: 26.5%
					}
					.btn:nth-child(37){
						left: 35%;
						top: 25%
					}
					.btn:nth-child(38){
						left: 37%;
						top: 25%
					}
					.btn:nth-child(39){
						left: 39%;
						top: 25%
					}
					.btn:nth-child(40){
						left: 41%;
						top: 25%
					}
					.btn:nth-child(41){
						left: 36.5%;
						top: 22%
					}
					.btn:nth-child(42){
						left: 39%;
						top: 22%
					}
					.btn:nth-child(43){
						left: 30.5%;
						top: 38%
					}
					.btn:nth-child(44){
						left: 31%;
						top: 30%
					}
					.btn:nth-child(45){
						left: 31%;
						top: 26.5%
					}
					.btn:nth-child(46){
						left: 31%;
						top: 23%
					}
					.btn:nth-child(47){
						left: 25.5%;
						top: 32.5%
					}
					.btn:nth-child(48){
						left: 25.5%;
						top: 27%
					}
					.btn:nth-child(49){
						left: 25.5%;
						top: 23%
					}
					.btn:nth-child(50){
						left: 64%;
						top: 53.5%
					}
					.btn:nth-child(51){
						left: 51.5%;
						top: 47%
					}
					.btn:nth-child(52){
						left: 54%;
						top: 47%
					}
        }

        #full_screen {
          position: absolute;
          right: 10px;
          top: 10px;
        }

        img {
          width: 100%;
          height: 100%;
        }
      }

      .con-nr-2 {
        padding: 10px 30px;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 73%;
        margin: 0 1%;
        background: url("@/assets/images/screen/bottom-bg.png") no-repeat;
        background-size: 100% 100%;

        .bot-left span {
          vertical-align: text-bottom;
          margin-left: 20px;
        }

        .bot-right {
          text-align: right;

          .btn {
            display: inline-block;
            margin-left: 10px;
            font-size: 20px;
            color: #2aa5d1;
            width: 44px;
            height: 44px;
            padding: 10px 0 0;
            border: 1px solid #2aa5d1;
            text-align: center;
          }
        }

        .gaojingxx {

          :deep(.el-table__header-wrapper) {
            th {
              background-color: #1c2e6a !important;
              text-align: center;
              color: #06b2f1;
              padding: 2px 0;
              height: 30px !important;
            }
          }

          :deep(.el-table) {
            --el-table-border-color {
              border-bottom: none !important;
            }
          }

          :deep(.el-table__cell) {
            background: #071f55 !important;
            color: #FFFFFF;
            padding: 2px 0;
            border-bottom: none !important;
            text-align: center;
            font-size: 12px;
          }

          :deep(.el-table__row--striped) {
            .el-table__cell {
              background: #12295a !important;
            }
          }
        }
      }
    }

    .right-con {
      height: 100%;
      position: absolute;
      right: 0;
      bottom: 0;
      z-index: 9;
      width: calc(25% - 5px);
    }

  }


  .cursor {
    cursor: pointer
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .text-align-r {
    text-align: right;
  }

  .colorblue {
    color: #8bb5f9;
  }

  .af-item {
    background: rgba(2, 11, 45, 0.8);
  }

  .danger_bottom {
    width: 100%;
    height: 100%;
  }

  .tanchunr {
    :deep(.el-dialog__body) {
      padding: 0 20px 20px !important;
      background: #1c2a5e !important;
      color: #fff;

      h4 {
        margin: 0 0 6px 0;
        color: #fff;
      }

      .tc-con {
        margin-bottom: 20px;

        .tc-nrli {
          height: 20px;
          line-height: 20px;

          .tc-lname {
            color: #83b4ff;
            padding-right: 10px;
            width: 70px;
            text-align: right;
          }
        }
      }


    }

    :deep(.el-dialog__header) {
      background: #1c2a5e !important;
      padding-bottom: 30px;

      .el-dialog__title {
        color: #fff;
      }

    }
  }

  .dw-indexcon {
    width: 100%;
    height: 100vh;

    .dw-head {
      height: 7.40741vh;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: #e4effc;
      padding: 1.38889vh 1.5625%;
      position: relative;
      z-index: 1;
      font-size: 14px;

      .head-left {
        color: #ffffff;
        font-weight: bold;

        .weather {
        }
      }

      .head-right {
        float: right;

        :deep(.el-input__inner) {
          background: transparent;
        }

        .jinggao {
          img {
            width: 50px;
            padding-left: 10px;
          }
        }
      }

      .head-tit {
        text-align: center;

        h4 {
          color: #e4effc;
          border-radius: 3px;
          border: 1px solid rgba(0, 139, 255, .3);
          text-align: center;
          box-shadow: inset 0 0 10px 0 rgba(36, 165, 255, .66);
          padding: 10px 30px;
          margin: 0;
          width: 70%;
        }
      }
    }

    .dw-con {
      height: 92.59259vh;
      position: relative;
      pointer-events: none;
      width: 100%;
      z-index: 1;

      //图标
      .togglebar {
        position: absolute;
        left: calc(2% + 0.9rem);
        top: 1.0vh;
        width: auto;
        height: 2.5rem;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        pointer-events: auto;

        .togglebar-icon {
          float: left;
        }
      }

      //右侧图标
      .right-ico {
        position: absolute;
        right: 100px;
        top: .92593vh;
        border-radius: 2px;
        width: 300px;
        height: 42px;
        padding: 9px 4px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        pointer-events: auto;

        .right-nr {
          display: flex;
          height: 100%;

          input {
            width: 170px;
            height: 100%;
            color: #fff;
            background: transparent;
            border: 1px solid #275793;
            margin-left: .92593vh;
            padding: 0 .25rem;
          }

          button {
            width: 1.5rem;
            height: 1.5rem;
            padding: 0;
            margin: 0 6px;
            color: #fff;
            font-size: .75rem;
            border: none;
            background: -webkit-gradient(linear, left top, right top, from(#106cb6), to(#014886));
            background: linear-gradient(90deg, #106cb6 0, #014886);
            outline: none;

            img {
              width: 100%;
            }
          }
        }
      }

      .leftbar {
        .padd {
          padding: .92593vh;
        }

        .partl-title {
          font-size: .71291rem;
          color: #02bcf9;
          margin-bottom: 1.38889vh;
          width: 100%;
          height: 2.77778vh;
          background-image: url("@/assets/images/head-tit.png");
          background-position: 0 0, 100% 0;
          background-size: auto 2.77778vh, auto 2.77778vh;
          background-repeat: no-repeat, no-repeat;
          padding-left: 14px;
        }

        position: absolute;
        left: .52083%;
        top: .92593vh;
        height: 90.74074vh;
        width: 22%;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        font-size: .75rem;
        pointer-events: none;

        .danger_item {
          padding: .92593vh;
        }

        .data-info {
          .el-row {
            height: 100%;
          }

          flex-grow: 0;
          height: 4.375rem;
          pointer-events: auto;

          .l-info-box {
            height: 100%;
            border-radius: 2px;
            border: 1px solid #808cb2;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
            -ms-flex-direction: column;
            flex-direction: column;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            font-size: .75rem;

            .l-info-title {
              color: #83b4ff;
              margin-bottom: .50922rem;
            }

            .l-info-num {
              color: #e4effc;
              font-size: 1.27305rem;
            }
          }

        }

        .weilan {
          margin-top: .625rem;
          height: calc(60% - 7.25rem);
          pointer-events: auto;

          .search {
            width: 100%;
            height: 2.96296vh;
            margin: .92593vh 0;
            overflow: hidden;
            font-size: .75rem;

            input {
              width: 70%;
              height: 100%;
              color: #e4effc;
              background: rgba(2, 11, 45, .7);
              border: 1px solid #165b84;
              padding: 0 0;
              text-indent: 1em;
              outline: none !important;
            }

            button {
              width: calc(30% - 1.875rem);
              height: 2.96296vh;
              float: right;
              color: #fff;
              font-size: .71291rem;
              border: none;
              background: -webkit-gradient(linear, left top, left bottom, from(#0667c0), to(#0057b4));
              background: linear-gradient(180deg, #0667c0, #0057b4);
              filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#106CB6", endColorstr="#014886", GradientType=1);
              border-radius: 3px;
            }
          }

          .weilan-con {
            height: 29.62963vh;
            //修改行内线
            :deep(.el-table td, .building-top .el-table th.is-leaf) {
              border-bottom: 1px solid #3b3b3b;
            }

            //底线
            :deep(.el-table__inner-wrapper::before) {
              border-bottom: 1px solid #3b3b3b;
            }

            //背景颜色
            :deep(.el-table) {
              tr {
                background: transparent;
              }
            }

            //表头
            :deep(.el-table .el-table__header-wrapper th) {
              background-color: transparent !important;
              color: rgb(236, 246, 255) !important;
            }
          }

          //修改鼠标选中行
          :deep(.el-table__row > td) {
            background: transparent;
          }


        }

        .echart_box {
          margin-top: .625rem;
          height: 19.07407vh;
          pointer-events: auto;

          .echart_bottom {
            width: 100%;
            height: 13.88889vh;
          }
        }
      }

      //底部
      .layout-bottom {
        position: absolute;
        left: calc(2% + 0.9rem);
        bottom: 0;
        width: auto;
        height: 10%;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        pointer-events: auto;

        .layout-bottomli:last-child {
          .shuxian :after {
            content: "";
          }
        }

        .layout-botlinr {
          width: 6.61985rem;
          height: 8.33333vh;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          -ms-flex-direction: column;
          flex-direction: column;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          justify-content: center;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          font-size: .71291rem;
          color: #e4effc;
          position: relative;
          padding: .92593vh;
          text-align: center;
          cursor: pointer;

          .bottname {

          }

          .bottshu {
            font-size: 1.5rem;
          }

          .shuxian :after {
            content: "|";
            color: #5b67a9;
            font-size: 1.2rem;
            position: absolute;
            right: 0;
          }
        }
      }

      //右侧弹出
      .r-tu {
        width: 45%;
        position: absolute;
        z-index: 2000;
        top: .92593vh;
        bottom: 0;
        width: 45%;
        height: 90.74074vh;
        border-left: 1px solid #28315c;
        -webkit-box-shadow: 0 0.1875rem 0.75rem rgba(0, 0, 0, .12);
        box-shadow: 0 0.1875rem 0.75rem rgba(0, 0, 0, .12);
        -webkit-transition: all .3s ease;
        transition: all .3s ease;
        right: 0;
        padding: 0;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        pointer-events: auto;

        .r-tu-con {
          width: 100%;
          padding: 0.92593vh;

          .toptit {
            width: 100%;
            width: 100%;
            height: 4.62963vh;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;
            justify-content: space-between;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            border-bottom: 1px solid #28315c;

            .title_text {
              color: #02bcf9;
            }

            .close {
              color: #fff;
              cursor: pointer;
            }

          }

          .r-con {
            padding: 10px 0;

            :deep(.el-input__inner) {
              background-color: transparent;
            }

            .chaxun {
              margin-left: 10px;
            }
          }

          .r-list {

            //修改行内线
            :deep(.el-table td, .building-top .el-table th.is-leaf) {
              border-bottom: 1px solid #3b3b3b;
            }

            //底线
            :deep(.el-table__inner-wrapper::before) {
              border-bottom: 1px solid #3b3b3b;
            }

            //背景颜色
            :deep(.el-table) {
              tr {
                background: transparent;
              }
            }

            //表头
            :deep(.el-table .el-table__header-wrapper th) {
              background-color: transparent !important;
              color: rgb(236, 246, 255) !important;
              border-bottom: 1px solid #3b3b3b !important;
            }

            //修改鼠标选中行
            :deep(.el-table__row > td) {
              background: transparent;
            }


          }
        }

      }

      //0524
      .nrong-con {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        pointer-events: auto;
      }

      .nronglist {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        pointer-events: auto;
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: RGBA(0, 0, 0, 0.5);
        color: #fff;
        width: 400px;
        font-size: 14px;
        padding: 10px;

        .nronglistcon::-webkit-scrollbar {
          display: none
        }

        .nronglistcon {
          background-color: RGBA(0, 0, 0, 0.5);
          width: 100%;
          padding: 10px;
          height: 320px;
          overflow-y: scroll;
          position: relative;

          .empty-con {
            margin-top: 50px;

            :deep(.el-empty__description) {
              p {
                color: #0773ce;
              }
            }
          }

          .closebtn {
            position: absolute;
            right: 0;
            top: 0;
            width: 15px;
            height: 15px;
            line-height: 15px;
            text-align: center;
            cursor: pointer;
          }

          .nronglistli {
            line-height: 40px;
            border-bottom: 1px solid #6a6a6a;
          }
        }
      }


      //标点弹出
      .popuplist {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        pointer-events: auto;

        :deep(.el-dialog) {
          background: rgba(2, 11, 45, 0.9);

          .el-dialog__title {
            color: #ffffff;
          }

          .el-dialog__body {
            color: #ffffff;
            padding: 10px 20px 20px;
            border-top: 1px solid #6c6c6c;
          }
        }

        .popuplistcon {
          .el-row {
            height: 30px;
            line-height: 30px;
          }

          h4 {
            font-size: 16px;
            line-height: 32px;
            margin: 0;
          }

          .chart {
            margin-top: 20px;

            .chart-title {
              margin-bottom: 8px;
            }

            .select-dow {
              :deep(.el-input__inner) {
                background: transparent;
              }
            }

            .chart-con {

              background-color: RGBA(255, 255, 255, 0.2);
              height: 200px;
            }
          }

          .popuplistli {

          }
        }

        .el-dialog__body {
          padding: 10px 20px 20px;
        }
      }


    }


    .dw-map {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0px;
      top: 0px;
    }
  }

  .tyxq-tc {
    position: relative;
    pointer-events: none;
    z-index: 1;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    pointer-events: auto;

    :deep(.el-dialog__body) {
      padding: 0 20px 20px !important;
      background: #1c2a5e !important;
      color: #fff;
      min-height: 300px;
    }

    :deep(.el-dialog__header) {
      background: #1c2a5e !important;
      padding-bottom: 20px;

      .el-dialog__title {
        color: #fff;
      }
    }

    .tyxq-con {
      .tyxq-contop {
        margin-bottom: 10px;
      }

      .yonghum {
        padding: 10px;
      }

      .time {
        margin-right: 10px;

        :deep(.el-date-editor) {
          background: transparent;
          border: 1px solid #5b67a9;

          .el-range-input {
            background: transparent;
            color: #fff;
          }
        }
      }

      .biank {
        border: 1px solid #5b67a9;
      }

      .rydw-li {
        .tacnr {
          line-height: 40px;
        }

        .txt {
          text-align: right;
          color: #70bbff;
          padding-right: .92593vh;
        }
      }
    }
  }


  //时间轴
  .timean {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    pointer-events: auto;
  }

  .time-bg {
    width: 90%;
    margin: 0 auto;
    margin-top: 40px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    pointer-events: auto;
    padding: 5px 10px;
    position: relative;


  }

  .timeline {
    width: 100%;
    position: relative;

    .my-slider__tooltip {
      text-align: left;
      position: absolute;
      top: -20px;

      .my-slider__tooltip-wrapper {
        height: 32px;
        //transform: translateX(-50%);
        //top: -50%;
        margin-left: -50px;
        background-color: RGBA(0, 0, 0, 0.7);
        border: none;
        color: #fff;
      }
    }


    :deep(.el-slider__marks-text) {
      color: #fff !important;
    }

    :deep(.el-slider__marks-text) {
      width: 110px;
      font-size: 12px;
    }
  }

  .jiankongtanchu {
    :deep(.el-dialog) {
      background: rgb(36, 53, 71);

      .player-content {
        border: 1px solid rgb(9, 190, 197);
      }
    }
  }

}

@media screen and (min-width: 2000px) {
  .border-p {
    padding: 40px 30px;
  }
  .home {
    .contermy {
      height: calc(100% - 100px);

      .left-con {
        .part-1 {
          .part-1-li {
            width: 110px;
            height: 110px;
            line-height: 110px;
          }
        }

        .part-2 {
          .echart-bom {
            .sblx-r {
              .sblx-ul {
                .sblx-li {
                  height: 50px;
                  line-height: 50px;
                  margin-bottom: 15px;
                }
              }
            }
          }
        }
      }
    }

    .right-con {
      .right-con-1 {
        .xjsb-nr {
          margin: 30px 0 20px;

          .shxj-li {
            height: 45px;
            line-height: 45px;
            padding: 0 30px;
          }
        }

        .right-con-1li {
          margin-bottom: 50px;

          .linr {
            padding: 10px !important;
          }
        }
      }

      .right-con-2 {
        .sbwb-con {
          margin: 30px 0 40px;

          .linr {
            padding: 10px !important;
          }
        }
      }
    }

  }

}

.chanxiantanchu {
  :deep(.el-overlay) {
    left: 200px;
    top: 80px;

    .el-overlay-dialog {
      position: absolute;
    }

    .el-dialog {
      height: calc(100vh);
      margin: 0 !important;
      background: transparent;

      .el-dialog__header {
        padding: 15px 50px 15px 30px;
        display: inline-block;
        background-size: 100% 100% !important;
        position: absolute;
        right: 0;
        top: 0;
      }

      .el-dialog__headerbtn {
        color: #949fa1;
        background: rgba(12, 28, 46, 0.9);
        height: 35px;
        width: 35px;
        line-height: 40px;
        text-align: center;
        border-radius: 50%;
      }

      .dialog-title {
        color: #00ebff;
        margin: 0 0 20px;
        font-weight: bold;
      }

      .el-dialog__body {
        background: rgba(12, 28, 46, 0.5);
        border-radius: 0;
        padding: 0;
        height: 100%;

        iframe {
          border: 0;
        }
      }
    }
  }
}

</style>




