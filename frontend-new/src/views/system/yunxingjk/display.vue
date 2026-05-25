<template>
  <div class="jianshi">
    <div class="toptitle">
      <img src="@/assets/images/screenyxjs/title.png" @load="topimageLoaded"/>
      <div class="fangda">

        <i v-if="size == 'small'" style="cursor: pointer;" @click="changeSize()"><img src="@/assets/images/fangda.png"></i>
        <i v-if="size == 'big'" style="cursor: pointer;" @click="changeSize()"><img
            src="@/assets/images/suoxiao.png"></i>
      </div>
    </div>
    <div class="main" :style="{ height: maniHt}">
      <div class="alldata">
        <el-row :gutter="60">
          <el-col :span="6">
            <div class="dataitem">
              <img src="@/assets/images/screenyxjs/data-line1.png" class="dataline"/>
              <img src="@/assets/images/screenyxjs/data-ico1.png" class="ico"/>
              <h4 class="yellow">{{ SensorAllCnt }}</h4>
              <h5>连接设备总数</h5>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="dataitem">
              <img src="@/assets/images/screenyxjs/data-line2.png" class="dataline"/>
              <img src="@/assets/images/screenyxjs/data-ico2.png" class="ico"/>
              <h4 class="green">{{ SensorRunningCnt }}</h4>
              <h5>运行中设备</h5>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="dataitem">
              <img src="@/assets/images/screenyxjs/data-line3.png" class="dataline"/>
              <img src="@/assets/images/screenyxjs/data-ico3.png" class="ico"/>
              <h4 class="orange">{{ todayEnergy }}<span>{{ ycUnit }}</span></h4>
              <h5>本日耗电</h5>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="dataitem">
              <img src="@/assets/images/screenyxjs/data-line4.png" class="dataline"/>
              <img src="@/assets/images/screenyxjs/data-ico4.png" class="ico"/>
              <h4 class="red">{{ alertCnt }}</h4>
              <h5>待处理告警</h5>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-row :gutter="30" style="height: 80%;">
        <el-col :span="12">
          <div class="box leftbox">
            <div class="boxtit">能耗趋势</div>
            <div class="echart" id="echartOne"></div>
            <div class="echart" id="echartTwo"></div>
            <div class="btn">
              <el-select v-model="value1" suffix-icon="CaretTop" @change="getDayEnergy">
                <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
              <el-select v-model="value2" suffix-icon="CaretTop" @change="getAllEnergy">
                <el-option
                    v-for="item in ammeterList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="box rightbox">
            <div class="boxtit">设备信息</div>
            <el-table :data="sensorList" id="table1" ref="table1" height="calc(100% - 41px)">
              <el-table-column prop="areaName" label="区域"/>
              <el-table-column prop="sensorName" label="设备名称"/>
              <el-table-column prop="todayEnergy" label="今日耗电量">
                <template #default="scope">
                  <div>{{ scope.row.todayEnergy }}{{ ycUnit }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="sensorStatus" label="设备状态"/>
            </el-table>
          </div>
          <div class="box rightbox">
            <div class="boxtit">设备数据</div>
            <el-table :data="ycList" id="table2" ref="table2" height="calc(100% - 41px)">
              <el-table-column prop="areaName" label="区域"/>
              <el-table-column prop="sensorName" label="设备名称"/>
              <el-table-column prop="ycName" label="参数名称"/>
              <el-table-column prop="ycValue" label="数值"/>
            </el-table>
          </div>
        </el-col>
      </el-row>

    </div>
  </div>
</template>

<script>
import * as echarts from '@/utils/echarts'
import {getSensorData} from '@/api/industry/industryScreen.js'
import {getSensorEnergy, getSensorEnergyByDay, getSensorDailyEnergyList} from '@/api/energy/screen.js'
import {listAmmeter} from '@/api/energy/ammeter.js'
import {display} from "@/api/login";
import {setToken, setExpiresIn} from '@/utils/auth'


export default {
  name: "display",
  data() {
    return {
      loginToken: "loginToken",
      maniHt: '',
      size: 'small',
      isFullscreen: false,
      SensorAllCnt: 0,
      SensorRunningCnt: 0,
      alertCnt: 0,
      todayEnergy: 0,
      ycUnit: '',
      ycList: [],
      sensorList: [],
      alertList: [],
      dateList: [],
      spikeValues: [],
      peakValues: [],
      flatValues: [],
      valleyValues: [],
      todayEnergyList: [],
      dayAllEnergy: 0,
      ammeterList: [{label: '全部设备', value: 0, name: 0}],
      value1: 0,
      options1: [
        {
          value: 0,
          label: '本日',
        },
        {
          value: 1,
          label: '昨日',
        },
      ],
      value2: 0,
      options2: [
        {
          value: '全部设备',
          label: '全部设备',
        },
        {
          value: '设备1',
          label: '设备1',
        },
        {
          value: '设备2',
          label: '设备2',
        },
      ],
			timers: null,
			timers2: null,
    }
  },

  watch: {
    loginToken:
        {
          handler: function () {

          }
        }
  },
  created() {

  }
  ,

  mounted: function () {
    this.handleLogin();

    //1920屏幕电脑设置屏幕放大1.5倍，引用样式"
    this.$nextTick(() => {
      if (window.devicePixelRatio == 1.5) {
        var cssFileUrl = '../../../src/assets/styles/mystyle.css';
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = cssFileUrl;
        document.getElementsByTagName("head")[0].appendChild(link);
        document.querySelector('.app-main').style.height = "calc(100% - 84px)";
      }
    })

  },

  unmounted() {
    clearInterval(this.timers)
    clearInterval(this.timers2)
  },

  methods: {
		tableScroll () {
			const table1 = this.$refs.table1.$refs;
			const divData = table1.scrollWrapper;
			let num = 0;
			let scrolllength = table1.tableBody.$el.offsetHeight - 33;
			//拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
			if(scrolllength>divData.height){
				this.timers = setInterval(() => {
					// 元素自增距离顶部1像素
					num--;
					//console.log(num)
					table1.tableBody.$el.style.marginTop = num + 'px';
					// 判断元素是否滚动到底部(可视高度+距离顶部=整个高度)
					if (table1.tableBody.$el.offsetHeight + num <= 0) {
						// 重置table距离顶部距离
						table1.tableBody.$el.style.marginTop = 0;
						num = 0;
						//this.timers=setTimeout(this.tableScroll(),table1.tableBody.$el.offsetHeight);
						//this.timers=setInterval(this.tableScroll(),10);
					}
				}, 100);
			}
		},
		tableScroll2 () {
			const table2 = this.$refs.table2.$refs;
			const divData2 = table2.scrollWrapper;
			let num = 0;
			let scrolllength = table2.tableBody.$el.offsetHeight - 33;
			//拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
			if(scrolllength>divData2.height){
				this.timers2 = setInterval(() => {
					// 元素自增距离顶部1像素
					num--;
					//console.log(num)
					table2.tableBody.$el.style.marginTop = num + 'px';
					// 判断元素是否滚动到底部(可视高度+距离顶部=整个高度)
					if (table2.tableBody.$el.offsetHeight + num <= 0) {
						// 重置table距离顶部距离
						table2.tableBody.$el.style.marginTop = 0;
						num = 0;
						//this.timers=setTimeout(this.tableScroll(),table1.tableBody.$el.offsetHeight);
						//this.timers=setInterval(this.tableScroll(),10);
					}
				}, 100);
			}
		},
    handleLogin() {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      var username = "";
      var password = "";
      if (vars.length > 1) {
        username = vars[0];
        password = vars[1];
      }
      // 调用action的登录方法
      display(username, password).then(res => {
        if (res.code == 200) {
          let data = res.data
          setToken(data.access_token)
          // TODO: 需要改为 Composition API 并使用 useUserStore()
          // this.store.commit('SET_TOKEN', data.access_token)
          setExpiresIn(data.expires_in)
          // TODO: 需要改为 Composition API 并使用 useUserStore()
          // this.store.commit('SET_EXPIRES_IN', data.expires_in)

          this.topimageLoaded();  //设置主界面高度
          this.getScreen(); // 查询数据信息
          this.getEnergy(); // 查询数据信息
          this.getAmmeter();
          this.getSensorList();
        }
      })
    },
    getSensorList() {
      getSensorDailyEnergyList().then(response => {
        this.sensorList = response.data.areaSensorList;
				this.$nextTick(() => {
					this.tableScroll()
				})
      });
    }
    ,
    getScreen() {
      getSensorData().then(response => {
        if (response.data) {
          this.SensorAllCnt = response.data.sensorAllCnt;
          this.SensorRunningCnt = response.data.sensorRunningCnt;
          this.ycList = response.data.ycList;
          this.alertList = response.data.alertList;
          this.alertCnt = response.data.alertList.length;
					this.$nextTick(() => {
						this.tableScroll2()
					})
        }
      });
    }
    ,
    getAllEnergy() {
      this.getEnergy();
      this.getDayEnergy();
    }
    ,
    getEnergy() {
      getSensorEnergy({
        id: this.value2,
      }).then(response => {
        var spike = 0;
        var peak = 0;
        var flat = 0;
        var valley = 0;
        if (response.data) {
          this.todayEnergy = response.data.todayEnergy;
          this.ycUnit = response.data.ycUnit;
          this.dateList = response.data.dateList;
          this.spikeValues = response.data.spikeValues;
          this.peakValues = response.data.peakValues;
          this.flatValues = response.data.flatValues;
          this.valleyValues = response.data.valleyValues;
          if (response.data.todayEnergy > 0) {
            this.dayAllEnergy = response.data.todayEnergy;
            spike = (100 * response.data.spikeValues[response.data.spikeValues.length - 1] / this.dayAllEnergy).toFixed(2);
            peak = (100 * response.data.peakValues[response.data.peakValues.length - 1] / this.dayAllEnergy).toFixed(2);
            flat = (100 * response.data.flatValues[response.data.flatValues.length - 1] / this.dayAllEnergy).toFixed(2);
            valley = (100 * response.data.valleyValues[response.data.valleyValues.length - 1] / this.dayAllEnergy).toFixed(2);
          }
        }
        this.todayEnergyList = [
          {value: valley, name: '谷电量'},
          {value: flat, name: '平电量'},
          {value: peak, name: '峰电量'},
          {value: spike, name: '尖电量'},
        ]
        this.$nextTick(() => {
          this.echartOne();
          this.echartTwo();
        })
      });
    }
    ,
    getDayEnergy() {
      getSensorEnergyByDay({
        type: this.value1,
        id: this.value2
      }).then(response => {
        var spike = 0;
        var peak = 0;
        var flat = 0;
        var valley = 0;
        if (response.data) {
          if (response.data.electricAllSum > 0) {
            this.dayAllEnergy = response.data.electricAllSum;
            spike = (100 * response.data.electricSpikeSum / response.data.electricAllSum).toFixed(2);
            peak = (100 * response.data.electricPeakSum / response.data.electricAllSum).toFixed(2);
            flat = (100 * response.data.electricFlatSum / response.data.electricAllSum).toFixed(2);
            valley = (100 * response.data.electricValleySum / response.data.electricAllSum).toFixed(2);
          }
        }
        this.todayEnergyList = [
          {value: valley, name: '谷电量'},
          {value: flat, name: '平电量'},
          {value: peak, name: '峰电量'},
          {value: spike, name: '尖电量'},
        ]
        this.$nextTick(() => {
          this.echartTwo();
        })
      })
    }
    ,
    getAmmeter() {
      listAmmeter().then(response => {
        if (response.rows) {
          var list = [];
          list.push({label: '全部设备', value: 0, name: 0});
          for (let row of response.rows) {
            list.push({label: row.sensorName, value: row.id, name: row.id});
          }
          this.ammeterList = list;
        }
      })
    }
    ,
    topimageLoaded() {
      let topHt = document.querySelector('.toptitle').clientHeight + 'px';
      this.maniHt = 'calc(100% - ' + topHt + ' - 30px)';
      console.log(topHt)
    }
    ,
    echartOne() {
      const chartmaindom = document.getElementById('echartOne');
      if (chartmaindom != null) {
        chartmaindom.removeAttribute('_echarts_instance_');
      }
      var chartDom1 = document.getElementById('echartOne');
      var myChart1 = echarts.init(chartDom1);
      var option;

      var now = new Date();

      option = {
        title: {
          text: now.getFullYear() + "年" + (now.getMonth() + 1) + "月",
          x: 'right',
          padding: 10,
          textStyle: {
            color: '#FFFFFF',
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '10%',
          right: '10%',
          top: '15%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            name: "(日)",
            data: this.dateList,
            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "rgba(255, 255, 255, 0.5)"
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: this.ycUnit != null ? "(" + this.ycUnit + ")" : "",
            splitLine: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "rgba(255, 255, 255, 0.5)"
              },
            },
            // axisLabel: {
            // 	show:true,
            // 	//Y轴数值可添加百分号
            // 	formatter: '{value}'+ (this.ycUnit != null ? this.ycUnit:""),
            // },
          }
        ],
        series: [
          {
            name: '谷电量',
            type: 'line',
            stack: 'Ad',
            barWidth: 20,
            emphasis: {
              focus: 'series'
            },
            data: this.valleyValues,
            itemStyle: {
              normal: {
                color: "#46d564",
              },
            },
          },
          {
            name: '平电量',
            type: 'line',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            data: this.flatValues,
            itemStyle: {
              normal: {
                color: "#fceb5d",
              },
            },
          },
          {
            name: '峰电量',
            type: 'line',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            data: this.peakValues,
            itemStyle: {
              normal: {
                color: "#ff972c",
              },
            },
          },
          {
            name: '尖电量',
            type: 'line',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            data: this.spikeValues,
            itemStyle: {
              normal: {
                color: "#ff2e2e",
              },
            },
          },
        ]
      };
      option && myChart1.setOption(option);
    }
    ,
    echartTwo() {
      const chartmaindom = document.getElementById('echartTwo');
      if (chartmaindom != null) {
        chartmaindom.removeAttribute('_echarts_instance_');
      }
      var chartDom2 = document.getElementById('echartTwo');
      var myChart2 = echarts.init(chartDom2);
      var option;

      option = {
        title: {
          text: '能耗占比',
          top: '90%',
          left: '25%',
          textStyle: {
            color: '#fff',
          },
          textAlign: 'bottom'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          top: '30%',
          right: '35%',
          itemHeight: 20,
          itemWidth: 20,
          textStyle: {
            color: '#fff'
          },
          icon: 'rect'
        },
        color: ['#46d564', '#fceb5d', '#ff972c', '#ff2e2e'],
        series: [
          {
            type: 'pie',
            radius: ['40%', '55%'],
            avoidLabelOverlap: true,
            center: ['30%', '55%'],
            itemStyle: {
              borderColor: 'transparent',
              borderWidth: 10
            },
            label: {
              show: true,
              position: 'outside',
              color: '#fff',
              formatter: '{c}%',
              fontSize: 14,
            },
            labelLine: {
              show: true,
            },
            data: this.todayEnergyList
          },
          {
            type: 'pie',
            radius: ['40%', '55%'],
            avoidLabelOverlap: true,
            center: ['30%', '55%'],
            itemStyle: {
              borderColor: 'transparent',
              borderWidth: 10
            },
            label: {
              show: true,
              position: 'center',
              color: '#fff',
              formatter: this.dayAllEnergy + '\n' + (this.ycUnit != null ? this.ycUnit : ""),
              lineHeight: 30,
              fontSize: 14
            },
            labelLine: {
              show: true,
            },
          }
        ],
        //环形图两部分的颜色
        // graphic: [{　　　　　　　　　　　　　　　　//环形图中间添加文字
        // 		type: 'text',　　　　　　　　　　　　//通过不同top值可以设置上下显示
        // 		left: '25%',　　　　　　　　　　
        // 		top: '45%',
        // 		style: {　　　　　　　　　　　　　　　　
        // 				text: this.dayAllEnergy,
        // 				textAlign: 'center',
        // 				fill: '#ffffff',　　　　　　　　//文字的颜色
        // 				width: 50,
        // 				height: 30,
        // 				fontSize: 18,
        // 				color: "#4d4f5c",
        // 				fontFamily: "Microsoft YaHei"
        // 		}
        // }, {
        // 		type: 'text',
        // 		left: '28%',
        // 		top: '60%',
        // 		style: {
        // 				text: this.ycUnit != null ? this.ycUnit:"",
        // 				textAlign: 'center',
        // 				fill: '#ffffff',
        // 				width: 30,
        // 				height: 30,
        // 				fontSize: 18,
        // 		}
        // }],
      };

      option && myChart2.setOption(option);
    }
    ,
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
    }
    ,
    changeSize() {
      this.toggleScreen()
      if (this.size == 'small') {
        this.size = 'big'
        document.querySelector('.sidebar-container').style = "width:0!important";
        document.querySelector('.main-container').style = "margin-left:0!important";
        document.querySelector('.app-main').style.minHeight = '100vh';
        document.querySelector('.navbar').style.display = 'none';
        document.querySelector('.tags-view-container').style.display = 'none';


      } else if (this.size == 'big') {
        this.size = 'small'
        document.querySelector('.sidebar-container').style.width = "";
        document.querySelector('.main-container').style.marginLeft = "";
        document.querySelector('.navbar').style.display = 'block';
        document.querySelector('.app-main').style.minHeight = 'calc(100vh - 84px)';
        document.querySelector('.tags-view-container').style.display = 'block'
      }
    }
    ,
  }
  ,

}
</script>


<style scoped lang="scss">
.jianshi {
  background: url('@/assets/images/screenyxjs/bg.jpg') no-repeat center;
  background-size: cover;
  height: 100%;
  overflow: hidden;

  .toptitle {
    img {
      width: 100%;
      display: block;
    }

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

    .el-col {
      height: 100%;
    }
  }

  .main {
    margin-top: 30px;
    padding: 0 50px;

    .alldata {
      height: 20%;

      .dataitem {
        height: 100%;
        background: rgba(255, 255, 255, 0.1);
        position: relative;
        text-align: center;
        border-radius: 5px;
        padding: 20px 0;

        .dataline {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }

        .ico {
          display: block;
          margin: 0 auto;
          width: 50px;
        }

        h4 {
          margin: 5px 0;
          font-size: 30px;

          span {
            font-size: 18px;
          }
        }

        .yellow {
          color: #fceb5d;
        }

        .green {
          color: #4cd964;
        }

        .orange {
          color: #ffa92d;
        }

        .red {
          color: #ff4e20;
        }

        h5 {
          margin: 0;
          font-size: 16px;
          color: #fff;
        }
      }
    }

    .box {
      background: url("@/assets/images/screenyxjs/box-mid.png") repeat-y;
      background-size: 100%;
      position: relative;

      .boxtit {
        background: url("@/assets/images/screenyxjs/box-titbg.png");
        background-size: 100% 100%;
        width: 100%;
        text-align: center;
        color: #fff;
        font-size: 16px;
        padding: 8px 0 11px
      }
    }

    .box:before {
      content: '';
      width: 100%;
      height: 20px;
      position: absolute;
      left: 0;
      top: 0;
      background: url("@/assets/images/screenyxjs/box-top.png") no-repeat;
      background-size: 100%;
    }

    .box::after {
      content: '';
      width: 100%;
      height: 20px;
      position: absolute;
      left: 0;
      bottom: 0;
      background: url("@/assets/images/screenyxjs/box-bot.png") bottom no-repeat;
      background-size: 100%;
    }

    .leftbox {
      height: calc(100% - 50px);
      margin: 30px 0 0;
      position: relative;

      .echart {
        height: calc((100% - 40px) / 2 - 10px);
        margin: 0 0 10px;
      }

      .btn {
        width: 110px;
        position: absolute;
        right: 40px;
        bottom: 25px;

        :deep(.el-select) {
          margin: 0 0 15px;

          .el-input__inner {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid #019eff;
            color: #fff;
          }
        }
      }
    }

    .rightbox {
      height: calc(50% - 40px);
      margin: 30px 0 0;
      box-shadow: 0 -10px 20px 0 rgba(0, 138, 255, 0.4) inset;

      :deep(.el-table) {
        background: transparent;

        tr, tr:hover td {
          background: transparent;
        }

        th.el-table__cell {
          padding: 5px 0;
          text-align: center;
          color: #09ccde;
          font-weight: normal;
          font-size: 14px;
        }

        .el-table__header-wrapper th {
          background: rgba(17, 50, 170, 0.3) !important;
          height: auto !important;
        }

        td.el-table__cell {
          border: 0;
          color: #fff;
          padding: 5px 0;
          text-align: center;
        }

        th.el-table__cell.is-leaf {
          border: 0;
        }

        .el-table__inner-wrapper::before {
          display: none;
        }

        .el-table__body-wrapper {
          box-shadow: 0 10px 20px rgba(0, 138, 255, 0.4) inset;
        }

        .el-scrollbar__view {
          height: 100%;
        }
      }
    }
  }
}

</style>




