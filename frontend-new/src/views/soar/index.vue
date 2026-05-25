<template>
  <div class="soar">
    <div class="top">
      <div class="title">{{ deptName }}</div>
      <img src="@/assets/images/soar/toptit.png" @load="topimageLoaded"/>
			<div class="fangda">
			  <i v-if="size == 'small'" style="cursor: pointer;" @click="changeSize()"><img src="@/assets/images/fangda.png"></i>
			  <i v-if="size == 'big'" style="cursor: pointer;" @click="changeSize()"><img
			      src="@/assets/images/suoxiao.png"></i>
			</div>
		</div>
    <div class="weather"><!--<img src="picture/weather.png"><span>多云转小雨</span>--><span id="showTime"></span></div>
    <el-row class="main" :style="{ height: maniHt}" :gutter="10">
      <el-col :span="5">
        <div class="left">
          <div class="box databox">
            <el-row class="dataitem">
              <el-col :span="8">
                <img src="@/assets/images/soar/data-ico1.png"/>
              </el-col>
              <el-col :span="16">
                <div class="datart">
                  <h4>客户数量</h4>
                  <h5>{{ custNums }}</h5>
                </div>
              </el-col>
            </el-row>
            <el-row class="dataitem">
              <el-col :span="8">
                <img src="@/assets/images/soar/data-ico2.png"/>
              </el-col>
              <el-col :span="16">
                <div class="datart">
                  <h4>设备数量</h4>
                  <h5>{{ eqAll }}</h5>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="box p15">
            <div class="boxtit">
              <h4>近15日告警趋势</h4>
              <img src="@/assets/images/soar/box-tit.png"/>
            </div>
            <div id="ecahrt1" class="ecahrt1"></div>
          </div>
          <div class="box p15" style="margin: 0;">
            <div class="boxtit">
              <h4>近15日告警分类</h4>
              <img src="@/assets/images/soar/box-tit.png"/>
            </div>
            <div id="ecahrt2" class="ecahrt2"></div>
          </div>
        </div>

      </el-col>
      <el-col :span="14">
        <div class="map4">
					<button @click="back" class="goback">返回上一级</button>
					<div id="map_1"></div>
				</div>
      </el-col>
      <el-col :span="5">
        <div class="right">
          <div class="box p15">
            <div class="boxtit">
              <h4>告警信息</h4>
              <img src="@/assets/images/soar/box-tit.png"/>
            </div>
            <div class="rightitem rtitme12">
              <el-row class="up">
                <el-col :span="7">
                  <img src="@/assets/images/soar/warn-ico1.png"/>
                </el-col>
                <el-col :span="17">
                  <div class="updata">
                    <h4>当前存在告警（个）</h4>
                    <h5>{{ currOfflineCount + currOutCount + currStataCount }}</h5>
                  </div>
                </el-col>
              </el-row>
              <div class="down">
                <el-row>
                  <el-col :span="8">
                    <span>离线：</span>
                    <i>{{ currOfflineCount }}</i>
                  </el-col>
                  <el-col :span="8">
                    <span>越限：</span>
                    <i>{{ currOutCount }}</i>
                  </el-col>
                  <el-col :span="8">
                    <span>其他：</span>
                    <i>{{ currStataCount }}</i>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="rightitem rtitme12">
              <el-row class="up">
                <el-col :span="7">
                  <img src="@/assets/images/soar/warn-ico2.png"/>
                </el-col>
                <el-col :span="17">
                  <div class="updata">
                    <h4>今日接收事件（条）</h4>
                    <h5>{{ todayOfflineCount + todayOutCount + todayStataCount }}</h5>
                  </div>
                </el-col>
              </el-row>
              <div class="down">
                <el-row>
                  <el-col :span="8">
                    <span>离线：</span>
                    <i>{{ todayOfflineCount }}</i>
                  </el-col>
                  <el-col :span="8">
                    <span>越限：</span>
                    <i>{{ todayOutCount }}</i>
                  </el-col>
                  <el-col :span="8">
                    <span>其他：</span>
                    <i>{{ todayStataCount }}</i>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div class="rightitem rtitme34">
              <el-row class="up">
                <el-col :span="7">
                  <img src="@/assets/images/soar/warn-ico3.png"/>
                </el-col>
                <el-col :span="17">
                  <div class="updata">
                    <h4>本月接收事件（条）</h4>
                    <h5>{{ currentMonthCount }}</h5>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="rightitem rtitme34" style="margin: 0;">
              <el-row class="up">
                <el-col :span="7">
                  <img src="@/assets/images/soar/warn-ico4.png"/>
                </el-col>
                <el-col :span="17">
                  <div class="updata">
                    <h4>上月接收事件（条）</h4>
                    <h5>{{ lastMonthCount }}</h5>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>

      </el-col>
    </el-row>
  </div>
</template>

<script>
import { useUserStore } from '@/store/modules/user'
import 'echarts/extension/bmap/bmap'
import axios from 'axios'
import {parseTime} from '@/utils/ruoyi'
import * as echarts from '@/utils/echarts'
import cityMap from '@/utils/china-main-city-map.js'
import {
  getSensorCountByArea,
  getDeptCounts,
  getEquipCountsByDeptId,
  getAlertCountsByTypeForLast15Days
} from "@/api/sensor/sensor";
import geoCoordMap from '@/utils/area.js'
import {alarmTrend} from '@/api/index'

export default {
  setup() {
    const userStore = useUserStore()
    return { userStore }
  },
  name: "青岛索尔",
  data() {
    return {
      maniHt: '',
      //中国地图（第一级地图）的ID、Name、Json数据
      chinaId: 100000,
      chinaName: 'china',
      chinaJson: null,
      //记录父级ID、Name
      mapStack: [],
      parentId: null,
      parentName: null,
      //Echarts地图全局变量，主要是在返回上级地图的方法中会用到
      myChart: null,
      //计数判断是省还是市
      mapClickCount: 0,
      mapName: '',
      custNums: 0,
      eqAll: 0,
      currentMonthCount: 0,
      lastMonthCount: 0,
      todayStataCount: 0,
      todayOutCount: 0,
      todayOfflineCount: 0,
      currStataCount: 0,
      currOutCount: 0,
      currOfflineCount: 0,
      last15DaysData: [],
      deptName: '',
      history: [],
      cityName: this.chinaName,
      cityId: this.chinaId,
			size: 'small',
			mapzoom: 1.2
    }
  },

  watch: {},
  created() {
    this.history.push({cityName: this.chinaName, cityId: this.chinaId})
    
    

		setTimeout(() => {
		  this.deptName = userStore.user.dept.deptName + '云平台';
		}, 500)
  },

  mounted: function () {
    var t = null
    t = setTimeout(time, 1000)//開始运行
    function time() {
      clearTimeout(t)//清除定时器
      var dt = new Date()
      var y = dt.getFullYear()
      var mt = dt.getMonth() + 1
      var day = dt.getDate()
      var h = dt.getHours()//获取时
      var m = dt.getMinutes()//获取分
      var s = dt.getSeconds()//获取秒
      document.getElementById('showTime').innerHTML = y + '年' + mt + '月' + day + '日 ' + h + '时' + m + '分' + s + '秒'
      t = setTimeout(time, 1000) //设定定时器，循环运行
    }

    //地图
    this.map()
    //告警信息
    //改变导航颜色
    this.navcolorchange();
		this.topimageLoaded();
    this.getDeptCounts();
    this.getEqNums();
    this.getAlarmTrend();
    this.getLastMonthAlarmData();
    this.getCurrentMonthAlarmData();
    this.getAlertCountsByTypeForLast15Days();
    this.getCurrentAlertCountsByTypeFor();
    this.getTodayAlertCountsByTypeFor();
  },

  methods: {
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
		    document.querySelector('.soar').style.minHeight = '100vh';
		    document.querySelector('.navbar').style.display = 'none';
		    document.querySelector('.tags-view-container').style.display = 'none';
		    var winWd = document.body.clientWidth;
				if(winWd>1366){
					document.querySelector('#map_1').style="margin-left:5%"
				}else{
					document.querySelector('#map_1').style="margin-left:8%"
				}
		  } else if (this.size == 'big') {
		    this.size = 'small'
		    document.querySelector('.sidebar-container').style.width = "";
		    document.querySelector('.main-container').style.marginLeft = "";
		    document.querySelector('.navbar').style.display = 'block';
		    document.querySelector('.app-main').style.minHeight = 'calc(100vh - 84px)';
		    document.querySelector('.soar').style.minHeight = 'calc(100vh - 84px)';
		    document.querySelector('.tags-view-container').style.display = 'block'
		    document.querySelector('#map_1').style="margin-left:0"
		  }
		},
    back() {
      let _this = this
			_this.mapzoom = 0.9
      if (this.history.length === 1) {
        return
      }
			if (this.history.length <= 2) {
				_this.mapzoom = 1.2
			}else{
				_this.mapzoom = 0.9
			}
      this.history.pop()
      this.cityName = this.history[this.history.length - 1].cityName
      this.cityId = this.history[this.history.length - 1].cityId
      axios
          .get('../../dist/map/' + this.cityId + '.json', {})
          .then(response => {
            const mapJson = response.data
            _this.registerAndsetOption(
                _this.myChart,
                this.cityId,
                this.cityName,
                mapJson,
                false,
								_this.mapzoom
            )
          })
      this.mapClickCount -= 1
    },
    getAlertCountsByTypeForLast15Days() {
      getAlertCountsByTypeForLast15Days("15").then(res => {
        this.last15DaysData = res.data;
				this.$nextTick(() => {
					this.echartsTwo();
				})

      })
    },
    getCurrentAlertCountsByTypeFor() {
      getAlertCountsByTypeForLast15Days("current").then(res => {
        this.currStataCount = res.data[0].num
        this.currOfflineCount = res.data[2].num
        this.currOutCount = res.data[1].num
      })
    },
    getTodayAlertCountsByTypeFor() {
      getAlertCountsByTypeForLast15Days("today").then(res => {
        this.todayStataCount = res.data[0].num
        this.todayOfflineCount = res.data[2].num
        this.todayOutCount = res.data[1].num
      })
    },
    getLastMonthAlarmData() {
      getAlertCountsByTypeForLast15Days("lastMonth").then(res => {
        res.data.forEach((item, index) => {
          this.lastMonthCount += item.num
        })
        // this.lastMonthCount = res.data.length;
      })
    },
    getCurrentMonthAlarmData() {
      getAlertCountsByTypeForLast15Days("currentMonth").then(res => {
        res.data.forEach((item, index) => {
          this.currentMonthCount += item.num
        })
      })
    },
    getAlarmTrend() {
      alarmTrend({"interval": "15"}).then(res => {
        let dataArray = [];
        let data = [];
        res.data.forEach((i, index) => {
          data.push(i.num)
          dataArray.push(parseTime(i.dt, '{m}-{d}'))
        })
        this.gjqs(dataArray, data);
      })
    },
    /*告警趋势*/
    gjqs(dataArray, data) {
      const chartmaindom = document.getElementById('ecahrt1');
      chartmaindom.removeAttribute('_echarts_instance_');
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.echarts.init(document.getElementById('ecahrt1'))
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
    getEqNums() {
      getEquipCountsByDeptId().then(res => {
        this.eqAll = res.data.data.len
        gth
      })
    },
    getDeptCounts() {
      getDeptCounts().then(response => {
        this.custNums = response.data
      })
    },
    map() {
			setTimeout(() => {
			  this.mapChart('map_1')
			}, 500)

    },
    /**
     * Echarts地图
     */
    mapChart(divid) {
      let _this = this
      axios.get('../../dist/map/' + _this.chinaId + '.json', {}).then(response => {
        const mapJson = response.data
        _this.chinaJson = mapJson
        const pieEchart = document.getElementById(divid)
        pieEchart.removeAttribute('_echarts_instance_')
        _this.myChart = _this.echarts.init(pieEchart)
        _this.registerAndsetOption(_this.myChart, _this.chinaId, _this.chinaName, mapJson, false, _this.mapzoom)
        _this.parentId = _this.chinaId
        _this.parentName = 'china'
        _this.myChart.on('click', function (param) {
          var cityId = cityMap[param.name]
          if (cityId) {
            _this.mapClickCount++
            _this.mapName = param.name
            //代表有下级地图
            axios
                .get('../../dist/map/' + cityId + '.json', {})
                .then(response => {
                  const mapJson = response.data
                  _this.registerAndsetOption(
                      _this.myChart,
                      cityId,
                      param.name,
                      mapJson,
                      true,
											0.9
                  )
                  _this.history.push({
                    cityId: cityId,
                    cityName: param.name
                  })
                })
          } else {
            if (param.componentType === 'geo') {
              _this.mapClickCount = 0
              _this.mapName = ''
              // //没有下级地图，回到一级中国地图，并将_this.mapStack清空
              // _this.registerAndsetOption(_this.myChart, _this.chinaId, _this.chinaName, _this.chinaJson, false)
              //_this.mapStack = []
              //_this.history =  [{cityName: _this.chinaName, cityId: _this.chinaId}]
              let cityNames = []
              _this.history.forEach((item, index) => {
                if (index !== 0) {
                  cityNames.push(item.cityName)
                }
              })
              cityNames.push(param.name)
              _this.$router.push({
                path: '/industry/parameter',
                query: {
                  cityNames: cityNames
                }
              })
            }

          }
        })
      })
    },
    /**
     *
     * @param {*} myChart
     * @param {*} id        省市县Id
     * @param {*} name      省市县名称
     * @param {*} mapJson   地图Json数据
     * @param {*} flag      是否往this.mapStack里添加this.parentId，this.parentName
     */
    registerAndsetOption(myChart, id, name, mapJson, flag, mapzoom) {

      let _this = this
      var data = {}
      _this.registerAndsetOptionData(myChart, id, name, mapJson, flag, data, mapzoom)
      if (_this.mapClickCount == 0) {
        getSensorCountByArea({level: 1}).then(response => {
          var data = {}
          for (let row of response.data) {
            data[row.areaName] = row.cnt
          }
          _this.registerAndsetOptionData(myChart, id, name, mapJson, flag, data, mapzoom)
        }).catch(error => {
          console.log(error)
        })
      } else if (_this.mapClickCount == 1) {
        if (name.indexOf('北京') >= 0 || name.indexOf('上海') >= 0 || name.indexOf('天津') >= 0 || name.indexOf('重庆') >= 0
            || name.indexOf('香港') >= 0 || name.indexOf('澳门') >= 0 || name.indexOf('台湾') >= 0) {
          getSensorCountByArea({level: 3}).then(response => {
            var data = {}
            for (let row of response.data) {
              data[row.areaName] = row.cnt
            }
            _this.registerAndsetOptionData(myChart, id, name, mapJson, flag, data, mapzoom)
          }).catch(error => {
            console.log(error)
          })
        } else {
          getSensorCountByArea({level: 2}).then(response => {
            var data = {}
            for (let row of response.data) {
              data[row.areaName] = row.cnt
            }
            _this.registerAndsetOptionData(myChart, id, name, mapJson, flag, data, mapzoom)
          }).catch(error => {
            console.log(error)
          })
        }
      } else if (_this.mapClickCount == 2) {
        getSensorCountByArea({level: 3}).then(response => {
          var data = {}
          for (let row of response.data) {
            data[row.areaName] = row.cnt
          }
          _this.registerAndsetOptionData(myChart, id, name, mapJson, flag, data, mapzoom)
        }).catch(error => {
          console.log(error)
        })
      }
    },
    registerAndsetOptionData(myChart, id, name, mapJson, flag, data, mapzoom) {

      let _this = this

      var convertData = function (data) {
        var res = {}
        for (let k in data) {
          var geoCoord = geoCoordMap[k]
          if (geoCoord) {
            res[k] = geoCoord.concat(data[k])
          }
        }
        return res
      }
      var convertData1 = function (data) {
        var res = []
        for (let k in data) {
          var geoCoord = geoCoordMap[k]
          if (geoCoord) {
            res.push({
              name: k,
              value: data[k]
            })
          }
        }
        return res
      }
      let option = {
        layoutCenter: ['50%', '50%'],//位置
        layoutSize: '100%',//大小
        tooltip: {
          trigger: 'item',
          formatter: function (params) {
            if (typeof (params.value)[2] == 'undefined') {
              return params.name + ' : ' + params.value
            } else {
              return params.name + ' : ' + params.value[2]
            }
          }
        },
        geo: {
          type: 'map',
          map: name,
          aspectScale: 0.75,
          zoom: mapzoom,
          //   roam:true,
          label: {
            normal: {
              show: true
            },
            emphasis: {
              show: false
            }
          },
          //   roam: false,//禁止其放大缩小
          itemStyle: {
            normal: {
              areaColor: '#4c60ff',
              borderColor: '#002097'
            },
            emphasis: {
              areaColor: '#293fff'
            }
          }
        },
        series: [
          {
            name: 'map',
            type: 'scatter', // 显示精确分布点
            coordinateSystem: 'geo',
            data: [],
            symbol: 'image://' + 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAABhCAYAAADm6pBeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZjdiNmRhZi05MzU0LTlhNGEtYWQwMi01NzA0NmU2ZjUyOWIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEZCRkExODYyQ0JEMTFFREEwNDk5RTI5M0E1NDI0RTYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEZCRkExODUyQ0JEMTFFREEwNDk5RTI5M0E1NDI0RTYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6M2FlMzY1MTctY2JiMS01ZTQ0LTgyMzgtMmRkOTY3Y2Y0ZjZiIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjRmN2I2ZGFmLTkzNTQtOWE0YS1hZDAyLTU3MDQ2ZTZmNTI5YiIv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',
            z: 2,
            symbolSize: [12, 80],
            label: {
              normal: {
                show: true,
                formatter: function (params) { //标签内容
                  return params.value[2];
                },
                position: 'top',
                borderWidth: '1',
                padding: [10, 10],
                color: '#5ccaff',
                fontSize: 24,
                fontWeight: '600',
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: '#ffeb7b'
              }
            }
          }
        ]
      }
      let ndata = convertData(data)
      if (id == '100000') {
        let dd = convertData1(ndata)
        option.series[0].data = dd
      } else {
        let dd = _this.initMapData(mapJson, ndata)
        option.series[0].data = dd
      }

      this.echarts.registerMap(name, mapJson)
      myChart.setOption(option)

      if (flag) {
        //往this.mapStack里添加this.parentId，this.parentName,返回上一级使用
        _this.mapStack.push({
          mapId: _this.parentId,
          mapName: _this.parentName
        })
        _this.parentId = id
        _this.parentName = name
      }
    },
    initMapData(mapJson, data) {
      var mapData = []
      for (var i = 0; i < mapJson.features.length; i++) {
        mapData.push({
          name: mapJson.features[i].properties.name,
          value: data[mapJson.features[i].properties.name]
          //id:mapJson.features[i].id
        })
      }
      return mapData
    },
    navcolorchange() {
      document.querySelector('.navbar').style.background = '#243547';
      document.querySelector('.tags-view-container').style.background = '#1e2d3e';
    },
    topimageLoaded() {
      let topHt = document.querySelector('.top').clientHeight + 'px';
      this.maniHt = 'calc(100% - ' + topHt + ' - 30px)';
      // this.$nextTick(() => {
      // 	// this.echartsTwo();
      // })
    },
    echartsTwo() {
      let chartDom2 = document.getElementById('ecahrt2');
      let myChart2 = echarts.init(chartDom2);
      let option;

      option = {
        title: {
          text: '告警\n类型',
					top: 'center',
					    left: 'center',
          textStyle: {
            color: '#fff',
            height: '100%',
            width: '100%',
            background: '#000',

						textAlign: 'center'
          },
        },
				grid: {
					left: 0,
					right:0,
				},
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          top: '30%',
          right: '0',
          width: 80,
          align: 'left',
          itemHeight: 6,
          itemWidth: 15,
          textStyle: {
            color: '#fff'
          }
        },
        color: ['#ff9d4d', '#e51fde', '#fff100'],
        series: [
          {
            //name: '报警类型',
            type: 'pie',
            radius: ['40%', '50%'],
            minAngle: 15,//最小角度
            startAngle: 240, //起始角度
            avoidLabelOverlap: true,
            center: ['50%', '50%'],
            itemStyle: {
              borderColor: 'transparent',
              borderWidth: 10
            },
            label: {
              show: true,
              position: 'outside',
              color: '#fff',
              formatter: '{b}\n {c}',
            },
            labelLine: {
              show: true,
              length: 10,
              length2: 10,
            },
            data: [
              {value: this.last15DaysData[0].num, name: '变位'},
              {value: this.last15DaysData[1].num, name: '越限'},
              {value: this.last15DaysData[2].num, name: '离线'},
            ],
          }
        ]
      };

      option && myChart2.setOption(option);
    }

  },

}
</script>


<style scoped lang="scss">
.soar {
  background: url('@/assets/images/soar/screenbg.jpg') no-repeat center;
  background-size: cover;
  height: calc(100vh - 84px);
	.fangda {
	  position: absolute;
	  right: 20px;
	  top: 20px;
	  font-size: 18px;
	  color: #2aa7d3;
	}

  :deep(.el-col) {
    height: 100%;
  }

  .top {
    width: 100%;
    position: relative;

    img {
      max-width: 100%;
      display: block;
      margin: 0 auto;
    }

    .title {
      color: white;
      font-weight: bold;
      text-align: center;
      position: absolute;
      top: calc(50% - 25px);
      font-size: 40px;
      width: 100%;
      line-height: 1;
      background: linear-gradient(to bottom, #06d4f5, #1b4fc3);
      -webkit-background-clip: text;
      color: transparent;
    }
  }

  .weather {
    position: absolute;
    left: 1.8rem;
    top: 0;
    line-height: 4rem;
  }

  .weather img {
    width: 2.22rem;
    display: inline-block;
    vertical-align: middle;
  }

  .weather span {
    color: rgba(255, 255, 255, .9);
    font-size: 1.08rem;
    padding-right: .6rem;
  }

  .main {
    padding: 0 20px;
    margin: 20px 0 0;

    .box {
      background: rgba(5, 24, 73, .6);
      border: 1px solid #2373b0;
      position: relative;
    }

    .box:before {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      top: -1px;
      left: -1px;
      pointer-events: none;
      background: url('@/assets/images/soar/boxbg-top.png') no-repeat top;
      background-size: 100%;
    }

    .box::after {
      content: '';
      height: 100%;
      position: absolute;
      bottom: -1px;
      left: -1px;
      right: -1px;
      pointer-events: none;
      background: url('@/assets/images/soar/boxbg-bottom.png') no-repeat bottom;
      background-size: 100%;
    }

    .p15 {
      padding: 15px;
    }

    .boxtit {
      padding: 0 10px;
      border-left: 5px solid #00e4ff;
      color: #00e4ff;

      h4 {
        display: inline-block;
        line-height: 1;
        margin: 0 10px 0 0;
      }

      img {
        height: 16px;
        vertical-align: middle;
        display: inline-block;
      }
    }

    .left {
      height: 100%;

      .box {
        height: calc(33.3% - 10px);
        margin-bottom: 10px;
      }

      .databox {
        padding: 0px 30px 0;

        .dataitem {
          height: 50%;
          text-align: right;

          .datart {
            top: 50%;
            position: relative;
            transform: translateY(-50%);
          }

          img {
            max-width: 100%;
            display: block;
            top: 50%;
            position: relative;
            transform: translateY(-50%);
          }

          h4 {
            color: #06eff2;
            margin: 0 0 10px;
            font-size: 14px;
          }

          h5 {
            font-size: 30px;
            font-weight: bold;
            letter-spacing: -2px;
            margin: 0;
            padding-right: 1px;
            background-image: -webkit-linear-gradient(bottom, #5ccaff, #b1e9fe);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
      }

      .ecahrt1 {
        height: calc(100% - 15px);
        width: calc(100% + 30px);
        margin-left: -15px;
      }

      .ecahrt2 {
        height: calc(100% - 15px);
        width: 115%;
				margin-left: -14%;
      }
    }

		.map4 {
		  height: 100%;
			position: relative;
			width: 100%;
			//overflow: hidden;
			.goback{
				position: absolute;left: 0;top: 0;
				background: transparent;
				border: 1px solid #00e4ff;
				color: #00e4ff;
				padding: 5px 10px;border-radius: 5px;
				cursor: pointer;z-index: 999;
				outline: none;
			}
			.goback:hover{
				opacity: 0.8;
			}
		}

    #map_1{
    	height: 105%;
			width: 100%;
			position: relative;
			top: -3%;
    }

    .right {
      height: 100%;

      .box {
        height: calc(100% - 10px);

        .boxtit {
          margin-bottom: 40px;
        }
      }

      .rightitem {
        background: rgba(23, 75, 131, 0.1);
        border-radius: 5px;
        border: 1px solid #0e2c5f;
        margin-bottom: 20px;
        padding: 0 30px;

        .up {
          height: 65%;

          img {
            max-width: 100%;
            display: block;
            top: 50%;
            position: relative;
            transform: translateY(-50%);
          }

          .updata {
            text-align: right;
            top: 50%;
            position: relative;
            transform: translateY(-50%);

            h4 {
              color: #06eff2;
              margin: 0 -10px 10px 0;
              font-size: 14px;
            }

            h5 {
              font-size: 30px;
              font-weight: bold;
              letter-spacing: -2px;
              margin: 0;
              padding-right: 1px;
              background-image: -webkit-linear-gradient(bottom, #5ccaff, #b1e9fe);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
          }
        }

        .down {
          padding: 10px 0 0;
          color: #fff;
          font-size: 14px;
          text-align: center;

          span {
            display: inline-block;
          }

          i {
            display: inline-block;
            white-space: nowrap;
          }
        }
      }

      .rtitme12 {
        height: calc(27% - 30px);
      }

      .rtitme34 {
        height: calc(21% - 30px);

        .up {
          height: 100%;
        }
      }
    }

  }

}

@media screen and (max-width: 1367px) {
.soar .main #map_1{
		height: 88%;
	}
	.soar .main .right .rightitem{
		padding: 0 10px;
	}
	.soar .main .right .rightitem .up .updata h4{
		white-space: nowrap;
	}
	.soar .main .left .databox{
		padding: 0 15px;
	}
}

</style>




