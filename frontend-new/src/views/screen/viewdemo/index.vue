<template>
  <div class="index-con">
    <div class="pad-10px">
      <div class="index-top">
        <el-row>
          <el-col :span="12">
            <div class="idnex-title">
              运行监控
            </div>
          </el-col>
          <el-col :span="12">
            <div class="text-right right-time">最新统计时间：{{nowDate}}</div>
          </el-col>
        </el-row>

        <div class="index-ul">
          <el-row>
            <!-- 服务企业数量-->
            <el-col :span="3" class="index-li">
              <div class="text-center">
                <div class="digital">127</div>
                <div class="title">服务企业数量</div>
                <div class="ico">
                  <img src="@/assets/images/ico-1.png" alt="" class="indexImg">
                </div>
              </div>
            </el-col>
            <!-- 平台用户数-->
            <el-col :span="3" class="index-li">
              <div class="text-center">
                <div class="digital">9084</div>
                <div class="title">平台用户数</div>
                <div class="ico"><img src="@/assets/images/ico-2.png" class="indexImg"></div>
              </div>
            </el-col>
            <!-- 接入设备总数-->
            <el-col :span="3" class="index-li">
              <div class="text-center">
                <div class="digital">46651</div>
                <div class="title">接入设备总数</div>
                <div class="ico"><img src="@/assets/images/ico-3.png" class="indexImg"></div>
              </div>
            </el-col>
            <!-- 在线设备数-->
            <el-col :span="3" class="index-li">
              <div class="text-center">
                <div class="digital">37320</div>
                <div class="title">在线设备数</div>
                <div class="ico"><img src="@/assets/images/ico-4.png" class="indexImg"></div>
              </div>
            </el-col>
            <!-- 接入点位数-->
            <el-col :span="3" class="index-li">
              <div class="text-center">
                <div class="digital">933020</div>
                <div class="title">接入点位数</div>
                <div class="ico"><img src="@/assets/images/ico-5.png" class="indexImg"></div>
              </div>
            </el-col>
            <!-- 本日处理数据-->
            <el-col :span="3" class="index-li">
              <div class="text-center">
                <div class="digital">9936145</div>
                <div class="title">本日处理数据</div>
                <div class="ico"><img src="@/assets/images/ico-6.png" class="indexImg"></div>
              </div>
            </el-col>
            <!-- 已处理告警-->
            <el-col :span="3" class="index-li">
              <div class="text-center">
                <div class="digital">0</div>
                <div class="title">今日已处理告警</div>
                <div class="ico"><img src="@/assets/images/ico-7.png" class="indexImg"></div>
              </div>
            </el-col>
            <!-- 待处理告警-->
            <el-col :span="3" class="index-li">
              <div class="text-center">
                <div class="digital">0</div>
                <div class="title">今待处理告警</div>
                <div class="ico"><img src="@/assets/images/ico-8.png" class="indexImg"></div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

      <div class="index-nr">
        <div class="index-nr-con">
          <el-row :gutter="10">
            <!-- 设备分布-->
            <el-col :span="6" class="index-nrli">
              <div class="sbfb index-nrliboder">
                <div class="index-titliheight">
                  <div class="idnex-title">设备分布</div>
                </div>
                <div class="index-nrliheight" id="sbfb">
                  <!--            <img src="@/assets/images/ditu.jpg" style="width: 100%; height: 100%;">-->
                </div>
              </div>
            </el-col>
            <!-- 设备接入趋势-->
            <el-col :span="12" class="index-nrli">
              <div class="shebeijr index-nrliboder">
                <div class="index-titliheight">
                  <div class="idnex-title">设备接入趋势</div>
                </div>
                <div class="index-nrliheight">
                  <div class="zhexiantu" id="shebeijr"></div>
                  <div class="zhexiantuli">
                    <el-row :gutter="20">
                      <el-col :span="6">
                        <div class="zhexiantuli-nr">
                          <el-row>
                            <el-col :span="12" class="ico">
                              <div class="">
                                <img src="@/assets/images/but1.png" class="indexImg">
                              </div>
                            </el-col>
                            <el-col :span="12" class="wenzi">
                              <div class="">
                                <div class="name">在线设备</div>
                                <div class="digital">37320</div>
                              </div>
                            </el-col>
                          </el-row>
                        </div>
                      </el-col>

                      <el-col :span="6">
                        <div class="zhexiantuli-nr">
                          <el-row>
                            <el-col :span="12" class="ico">
                              <div class="">
                                <img src="@/assets/images/but2.png" class="indexImg">
                              </div>
                            </el-col>
                            <el-col :span="12" class="wenzi">
                              <div class="">
                                <div class="name">上月新增</div>
                                <div class="digital">1845</div>
                              </div>
                            </el-col>
                          </el-row>
                        </div>
                      </el-col>

                      <el-col :span="6">
                        <div class="zhexiantuli-nr">
                          <el-row>
                            <el-col :span="12" class="ico">
                              <div class="">
                                <img src="@/assets/images/but3.png" class="indexImg">
                              </div>
                            </el-col>
                            <el-col :span="12" class="wenzi">
                              <div class="">
                                <div class="name">年度新增</div>
                                <div class="digital">38944</div>
                              </div>
                            </el-col>
                          </el-row>
                        </div>
                      </el-col>

                      <el-col :span="6">
                        <div class="zhexiantuli-nr">
                          <el-row>
                            <el-col :span="12" class="ico">
                              <div class="">
                                <img src="@/assets/images/but4.png" class="indexImg">
                              </div>
                            </el-col>
                            <el-col :span="12" class="wenzi">
                              <div class="">
                                <div class="name">设备总数</div>
                                <div class="digital">46651</div>
                              </div>
                            </el-col>
                          </el-row>
                        </div>
                      </el-col>
                    </el-row>


                  </div>
                </div>
              </div>
            </el-col>
            <!-- 设备类型-->
            <el-col :span="6" class="index-nrli">
              <div class="sbfb index-nrliboder">
                <div class="index-titliheight">
                  <div class="idnex-title">设备类型</div>
                </div>
                <div class="index-nrliheight">
                  <div class="shebeilx" id="shebeilx"></div>
                  <div class="shebeilxli">
                    <el-table
                        :data="tableData"
                        border
                        :header-cell-style="{background:'#f5f7fd'}"
                        style="width: 100%">
                      <el-table-column
                          align="center"
                          prop="sblxname"
                          label="设备类型">
                      </el-table-column>
                      <el-table-column
                          prop="percentage"
                          align="center"
                          label="百分比">
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import 'echarts/extension/bmap/bmap'
export default {
  name: "index",
  data() {
    return {
      nowDate: '',
      tableData: [{
        sblxname: '工业设备',
        percentage: '52.00%',
      },{
        sblxname: '定位设备',
        percentage: '24.00%',
      },{
        sblxname: '电力设备',
        percentage: '13.00%',
      },{
        sblxname: '监控设备',
        percentage: '8.00%',
      },{
        sblxname: '环保设备',
        percentage: '3.00%',
      }],
      dataaddress:[
        { name: '烟台', value: 80 },
        { name: '聊城', value: 116 },
        { name: '泰安', value: 112 },
        { name: '潍坊', value: 65 },
        { name: '东营', value: 62 },
        { name: '临沂', value: 103 },
        { name: '威海', value: 25 },
      ],
      geoCoordMap :{
        烟台: [121.39, 37.52],
        聊城: [115.97, 36.45],
        泰安: [117.13, 36.18],
        潍坊: [119.1, 36.62],
        东营: [118.49, 37.46],
        临沂: [118.35, 35.05],
        威海: [122.1, 37.5],

      },
    }
  },
  mounted() {
    this.sbfb()
    this.shebeijr()
    this.shebeilx()
    this.setNowTimes()
  },
  methods: {
    setNowTimes() { // 获取日期
      var dt = new Date()
      var y = dt.getFullYear()
      var mt = dt.getMonth()+1
      var d = dt.getDate()
      this.nowDate = y+'年'+mt+'月'+d+'日'
    },

    convertData(data) {
      var res = [];
      for (var i = 0; i < data.length; i++) {
        var geoCoord = this.geoCoordMap[data[i].name];
        if (geoCoord) {
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value)
          });
        }
      }
      return res;
    },

    sbfb(){
      const chartmaindom = document.getElementById('sbfb');
      chartmaindom.removeAttribute('_echarts_instance_');
      let myChart = this.echarts.init(document.getElementById('sbfb'))
      myChart.setOption({

        tooltip: {
          trigger: 'item'
        },
        bmap: {
          center: [164.114129, 33.550339],
          zoom: 5,//当前视角的缩放比例
          roam: true,
          mapStyle: {
            styleJson: [
              {
                featureType: 'water',
                elementType: 'all',
                stylers: {
                  color: '#d1d1d1'
                }
              },
              {
                featureType: 'land',
                elementType: 'all',
                stylers: {
                  color: '#f3f3f3'
                }
              },
              {
                featureType: 'railway',
                elementType: 'all',
                stylers: {
                  visibility: 'off'
                }
              },
              {
                featureType: 'highway',
                elementType: 'all',
                stylers: {
                  color: '#fdfdfd'
                }
              },
              {
                featureType: 'highway',
                elementType: 'labels',
                stylers: {
                  visibility: 'off'
                }
              },
              {
                featureType: 'arterial',
                elementType: 'geometry',
                stylers: {
                  color: '#fefefe'
                }
              },
              {
                featureType: 'arterial',
                elementType: 'geometry.fill',
                stylers: {
                  color: '#fefefe'
                }
              },
              {
                featureType: 'poi',
                elementType: 'all',
                stylers: {
                  visibility: 'off'
                }
              },
              {
                featureType: 'green',
                elementType: 'all',
                stylers: {
                  visibility: 'off'
                }
              },
              {
                featureType: 'subway',
                elementType: 'all',
                stylers: {
                  visibility: 'off'
                }
              },
              {
                featureType: 'manmade',
                elementType: 'all',
                stylers: {
                  color: '#d1d1d1'
                }
              },
              {
                featureType: 'local',
                elementType: 'all',
                stylers: {
                  color: '#d1d1d1'
                }
              },
              {
                featureType: 'arterial',
                elementType: 'labels',
                stylers: {
                  visibility: 'off'
                }
              },
              {
                featureType: 'boundary',
                elementType: 'all',
                stylers: {
                  color: '#fefefe'
                }
              },
              {
                featureType: 'building',
                elementType: 'all',
                stylers: {
                  color: '#d1d1d1'
                }
              },
              {
                featureType: 'label',
                elementType: 'labels.text.fill',
                stylers: {
                  color: '#999999'
                }
              }
            ]
          }
        },
        series: [
          {
            // name: 'pm2.5',
            type: 'scatter',
            coordinateSystem: 'bmap',
            data: this.convertData(this.dataaddress),
            symbolSize: function (val) {
              return val[2] / 10;
            },
            encode: {
              value: 2
            },
            label: {
              formatter: '{b}',
              position: 'right',
              show: true//显示名称
            },
            emphasis: {
              label: {
                show: true
              }
            }
          },
          {
            // name: 'Top 5',
            type: 'effectScatter',
            coordinateSystem: 'bmap',
            data: this.convertData(
                this.dataaddress
                    .sort(function (a, b) {
                      return b.value - a.value;
                    })
                    .slice(0, 6)
            ),
            symbolSize: function (val) {
              return val[2] / 10;
            },
            encode: {
              value: 2
            },
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke'
            },
            label: {
              formatter: '{b}',
              position: 'right',
              show: true
            },
            itemStyle: {
              shadowBlur: 10,
              shadowColor: '#333'
            },
            emphasis: {
              scale: true
            },
            zlevel: 1
          }
        ]
      });



    },
    shebeijr(){
      // 设备接入趋势
      const chartmaindom = document.getElementById('shebeijr');
      chartmaindom.removeAttribute('_echarts_instance_');
      let myChart = this.echarts.init(document.getElementById('shebeijr'))
      myChart.setOption({
        tooltip: {
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [ '9月', '10月', '11月', '12月','1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name:'数量',
            type:'line',
            stack: '总量1',
            areaStyle: {//覆盖区域的渐变色
              normal: {
                color: {
                  type: 'linear',x: 0,y: 0,x2: 0,y2: 1,
                  colorStops: [
                    {
                      offset: 0, color: 'rgba(9,190,197, 0.8)' // 0% 处的颜色
                    },
                    {
                      offset: 1, color: 'rgba(9,190,197, 0)' // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                },
              }
            },
            data:['4236','899','968','1025','1563','1369','26368','1869','2058','2036','1845','1836'],
            itemStyle : {//线条的渐变
              normal:{
                color: new this.echarts.graphic.LinearGradient(0, 0, 0, 1,[
                      {
                        offset:1, color: '#09bec5' // 0% 处的颜色
                      },
                      {
                        offset:0.3, color: '#09bec5' // 100% 处的颜色
                      },
                      {
                        offset:0.1, color: '#09bec5' // 100% 处的颜色
                      }
                    ]
                ),  //背景渐变色
              }
            }
          }
        ]
      });
      // 绘制图表
    },
    shebeilx(){
      // 设备接入趋势
      const chartmaindom = document.getElementById('shebeilx');
      chartmaindom.removeAttribute('_echarts_instance_');
      let myChart = this.echarts.init(document.getElementById('shebeilx'))
      myChart.setOption({
        tooltip: {
          trigger: 'item'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 25,
          bottom: 20,
          itemHeight: 10,
          itemWidth: 10,
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['37%', '50%'],
            label: {
              show: false
            },
            data: [
              { value: 52, name: '工业设备' },
              { value: 24, name: '定位设备' },
              { value: 13, name: '电力设备' },
              { value: 8, name: '监控设备' },
              { value: 3, name: '环保设备' }
            ],
            // emphasis: {
            //   label: {
            //     show: true
            //   }
            // },
          }
        ]
      });
      // 绘制图表
    },
  }
}
</script>

<style lang="scss" scoped>
.index-con{
  background: #f3f3f4;
  width: 100%;
  height: calc(100vh - 84px);


  .idnex-title{
    font-size: 18px;
    border-left:4px solid #09bec5;
    padding-left: 10px;

  }
  .index-top{
    background: #fff;
    border: 1px solid #e9e9e9;
    padding: 15px 10px;
    box-sizing: border-box;
    border-radius: 6px;
    .right-time{
      color:#778ca2;
      text-align: right;

    }
    .index-ul{
      padding: 30px 0 20px;
      .index-li{
        border-left: 1px solid #f3f5fb;
        .digital{
          font-size: 36px;
          color: #3a8fea;
          font-weight: bold;
          transform: scale(0.9, 1);
        }
        .title{
          font-size: 16px;
          padding: 4px 0 20px;
        }
      }
      .index-li:nth-child(2){
        .digital{
          color: #6ccac9;
        }
      }
      .index-li:nth-child(3){
        .digital{
          color: #57c8f2;
        }
      }
      .index-li:nth-child(4){
        .digital{
          color: #57bf67;
        }
      }
      .index-li:nth-child(5){
        .digital{
          color: #3a8fea;
        }
      }
      .index-li:nth-child(6){
        .digital{
          color: #9564e2;
        }
      }
      .index-li:nth-child(7){
        .digital{
          color: #f09a33;
        }
      }.index-li:nth-child(8){
         border-left: none;
         .digital{
           color: #ff5722;
         }
       }

    }


  }

  .index-nr{
    height: calc(100vh - 380px);
    .index-nr-con{
      height: 100%;
      .el-row{
        height: 100%;
      }
      .index-nrli{
        height: 100%;
        .index-nrliboder{
          height: 100%;
          background: #fff;
          border: 1px solid #e9e9e9;
          padding: 15px 10px;
          box-sizing: border-box;
          border-radius: 6px;
          margin-top: 10px;
          .index-titliheight{
            height: 5%;
          }
          .index-nrliheight{
            height: 95%;
          }
        }
        .shebeijr{
          .zhexiantu{
            height: 80%;
          }
          .zhexiantuli{
            height: 20%;
            padding: 0 8%;
            .zhexiantuli-nr{
              background: #eff2fa;
              padding: 10px;
              .ico{
                text-align: center;
              }
              .name{
                font-size: 14px;
                color: #778ca2;
              }
              .digital{
                font-size: 20px;
              }
            }
          }
        }
        .sbfb{
          .shebeilx{
            height: 40%;
          }
          .shebeilxli{
            height: 60%;
            :deep(.el-table__cell) {
              padding: 5px 0;
            }
          }
        }
      }

    }
  }

}

@media screen and (max-width: 1440px) and (min-width: 769px){
  .idnex-title{
    font-size: 15px!important;
  }
  .index-con {
    .index-top {
      padding: 10px 4px;
      .right-time{
        font-size: 14px;
      }
      .index-ul{
        padding: 15px 0 10px;
        .index-li {
          .digital{
            font-size: 22px;
          }
          .title{
            font-size: 14px;
            padding: 3px 0 10px;
          }
          .ico{
            img{
              width: 30px;
            }
          }
        }
      }
    }
    .index-nr{
      height: calc(100vh - 275px);
      .index-nrli{
        .index-titliheight{
          height: 6%!important;
        }
        .sbfb{
          .shebeilxli{
            :deep(.el-table) {
              .el-table__cell{
                padding:0!important;
                height: auto!important;
                font-size: 12px;
                .cell{
                  line-height: inherit;
                }
              }
            }

          }
        }
        .shebeijr {
          .zhexiantuli{
            padding: 0 2%!important;
            .zhexiantuli-nr{
              .ico{
                width: 30%;
                flex: 0 0 30%;
                img{
                  width: 80%;
                  text-align: center;
                }
              }
              .wenzi{
                width: 70%;
                flex: 0 0 70%;
                .name{
                  font-size: 12px;
                }
              }
            }
          }
        }
      }
    }
  }
}


</style>
