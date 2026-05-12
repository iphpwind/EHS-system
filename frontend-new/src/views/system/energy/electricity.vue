<template>
  <div class="electricity">


    <el-card :body-style="{ padding: '10px' }" class="ele-con">
      <el-row class="freeze-con">
        <el-col :span="24" class="freeze-nr">
          <div class="fl">
            <div class="fl tit">日期</div>
            <div class="fl">
              <el-date-picker
                  v-model="queryParams.time"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
              </el-date-picker>
            </div>
            <div class="fl tit pa-l10">区域</div>
            <div class="fl">
              <tree-select
                  id="areaSelect"
                  v-model:value="queryParams.electricAreaId"
                  :options="areaOptions"
                  :objMap="{ value: 'id', label: 'label', children: 'children' }"
                  value-key="id"
                  placeholder="请选择电力区域"
                  check-strictly
              />
            </div>
          </div>
          <div class="fl pa-l10">
            <el-button class="inquirebtn" @click="getAnalysis">生成</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <div class="electricity-con" id="pdf-table">
      <el-card :body-style="{ padding: '10px' }">
        <div class="top">
          <h4>用电分析报告</h4>
          <div class="top-con">
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="">
                  区域：{{ areaName }}
                </div>
              </el-col>

              <el-col :span="12">
                <div class="">
                  报告日期：{{ queryParams.beginTime }}/{{ queryParams.endTime }}
                </div>
              </el-col>

            </el-row>
          </div>
        </div>

        <!--1、用电量分析-->
        <div class="part-1">
          <el-row>
            <el-col :span="24">
              <div class="header">
                <div class="card-tit">1、用电量分析</div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="nyjc-con">
                <el-row :gutter="10">
                  <el-col :span="5">
                    <el-card class="box-card" :body-style="{ padding: '10px' }">
                      <el-row>
                        <div class="tu"><img src="@/assets/images/ny-ico-1.png" class="ptuico"></div>
                        <div class="shuzi">
                          <div class="title blue">{{ timePower.electricAllSum }}</div>
                          <div class="xtit">冻结电量&nbsp;<span v-if="timePower.ycUnit != null">({{timePower.ycUnit}})</span></div>
                        </div>
                      </el-row>
                    </el-card>
                  </el-col>
                  <el-col :span="5">
                    <el-card class="box-card" :body-style="{ padding: '10px' }">
                      <el-row>
                        <div class="tu"><img src="@/assets/images/ny-ico-2.png" class="ptuico"></div>
                        <div class="shuzi">
                          <div class="title red">{{ timePower.electricSpikeSum }}</div>
                          <div class="xtit">尖电量&nbsp;<span v-if="timePower.ycUnit != null">({{timePower.ycUnit}})</span></div>
                        </div>
                      </el-row>
                    </el-card>
                  </el-col>
                  <el-col :span="5">
                    <el-card class="box-card" :body-style="{ padding: '10px' }">
                      <el-row>
                        <div class=" tu"><img src="@/assets/images/ny-ico-3.png" class="ptuico"></div>
                        <div class="shuzi">
                          <div class="title orange">{{ timePower.electricPeakSum }}</div>
                          <div class="xtit">峰电量&nbsp;<span v-if="timePower.ycUnit != null">({{timePower.ycUnit}})</span></div>
                        </div>
                      </el-row>
                    </el-card>
                  </el-col>
                  <el-col :span="5">
                    <el-card class="box-card" :body-style="{ padding: '10px' }">
                      <el-row>
                        <div class="tu"><img src="@/assets/images/ny-ico-4.png" class="ptuico"></div>
                        <div class="shuzi">
                          <div class="title yellow">{{ timePower.electricFlatSum }}</div>
                          <div class="xtit">平电量&nbsp;<span v-if="timePower.ycUnit != null">({{timePower.ycUnit}})</span></div>
                        </div>
                      </el-row>
                    </el-card>
                  </el-col>
                  <el-col :span="5">
                    <el-card class="box-card" :body-style="{ padding: '10px' }">
                      <el-row>
                        <div class="tu"><img src="@/assets/images/ny-ico-5.png" class="ptuico"></div>
                        <div class="shuzi">
                          <div class="title green">{{ timePower.electricValleySum }}</div>
                          <div class="xtit">谷电量&nbsp;<span v-if="timePower.ycUnit != null">({{timePower.ycUnit}})</span></div>
                        </div>
                      </el-row>
                    </el-card>
                  </el-col>

                </el-row>

              </div>
              <div class="chart-con" id="chart">

              </div>
            </el-col>
          </el-row>
        </div>

        <!--2、用电排行-->
        <div class="part-2">
          <el-row>
            <el-col :span="24">
              <div class="header">
                <div class="card-tit">2、用电排行</div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table
                  :data="tableData"
                  style="width: 100%">
                <el-table-column
                    type="index"
                    label="排名"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="equipmentName"
                    label="设备名称">
                </el-table-column>
                <el-table-column
                    prop="powerSum"
                    label="用电量">
                </el-table-column>
              </el-table>

            </el-col>
          </el-row>
        </div>


        <!--3、电压趋势-->
        <!--      <div class="part-3">-->
        <!--        <el-row>-->
        <!--          <el-col :span="24">-->
        <!--            <div class="header">-->
        <!--              <div class="card-tit">3、电压趋势</div>-->
        <!--            </div>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
        <!--        <el-row>-->
        <!--          <el-col :span="24">-->
        <!--            <div class="chart-height" id="dyqs">-->

        <!--            </div>-->

        <!--          </el-col>-->
        <!--        </el-row>-->
        <!--      </div>-->


        <!--4、电流趋势-->
        <!--      <div class="part-3">-->
        <!--        <el-row>-->
        <!--          <el-col :span="24">-->
        <!--            <div class="header">-->
        <!--              <div class="card-tit">4、电流趋势</div>-->
        <!--            </div>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
        <!--        <el-row>-->
        <!--          <el-col :span="24">-->
        <!--            <div class="chart-height" id="dlqs">-->

        <!--            </div>-->

        <!--          </el-col>-->
        <!--        </el-row>-->
        <!--      </div>-->

        <!--5、功率因数趋势-->
        <!--      <div class="part-3">-->
        <!--        <el-row>-->
        <!--          <el-col :span="24">-->
        <!--            <div class="header">-->
        <!--              <div class="card-tit">5、功率因数趋势</div>-->
        <!--            </div>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
        <!--        <el-row>-->
        <!--          <el-col :span="24">-->
        <!--            <div class="chart-height" id="glysqs">-->

        <!--            </div>-->

        <!--          </el-col>-->
        <!--        </el-row>-->
        <!--      </div>-->

        <!--6、告警数据-->
        <div class="part-3">
          <el-row>
            <el-col :span="24">
              <div class="header">
                <div class="card-tit">3、告警数据</div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table
                  :data="warnData"
                  style="width: 100%">
                <el-table-column
                    fixed
                    prop="erea"
                    label="设备/区域"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="event"
                    label="事件名称">
                </el-table-column>
                <el-table-column
                    prop="time"
                    label="告警时间">
                </el-table-column>
              </el-table>

            </el-col>
          </el-row>
        </div>


      </el-card>

      <div class="print">
        <el-button style=" background: #09bec5;color: #fff;border: none;" v-print="'#pdf-table'">打印</el-button>
      </div>

    </div>






  </div>
</template>

<script setup name="Electricity">
import {areatreeselect} from "@/api/energy/area";
import {getTimePowerByArea, getTimePowerRankByArea} from "@/api/energy/timePower";
import {parseTime} from '@/utils/ruoyi'
import {alarmList} from '@/api/system/alarm'

const {proxy} = getCurrentInstance();
const areaOptions = ref(undefined);
const value1 = ref("");
const areaName = ref("全厂");
const time = ref("");
const chart = ref(undefined);

const data = reactive({
  queryParams: {
    time: null,
    beginTime: null,
    endTime: null,
    electricAreaId: null,
    timeType: "日",
  },
  tableData: [],
  warnData: [],
  timePower: {
    electricAllSum: 0,
    electricSpikeSum: 0,
    electricPeakSum: 0,
    electricFlatSum: 0,
    electricValleySum: 0,
  },
});

const {queryParams, tableData, warnData, timePower} = toRefs(data);

/** 查询区域下拉树结构 */
function getTreeSelect() {
  areatreeselect({status: "0", delFlag: '0'}).then(response => {
    areaOptions.value = response.data;
  });
};

/** 生成用电分析报告 */
function getAnalysis() {
  if (queryParams.value.time == null) {
    proxy.$modal.msgError("请选择时间");
    return;
  }
	
	tableData.value = [];
	warnData.value = [];
	timePower.value = {
    electricAllSum: 0,
    electricSpikeSum: 0,
    electricPeakSum: 0,
    electricFlatSum: 0,
    electricValleySum: 0,
  };

  queryParams.value.beginTime = parseTime(queryParams.value.time[0], '{y}-{m}-{d}')
  queryParams.value.endTime = parseTime(queryParams.value.time[1], '{y}-{m}-{d}')

  /** 报告标题 **/
  getTitle();
  /** 用电量 **/
  getAnalysisTimePower();
  /** 用电排行 **/
  getAnalysisTimePowerRank();
  /** 电压趋势 **/
  //getAnalysisVoltage();
  /** 电流趋势 **/
  //getAnalysisCurrent();
  /** 功率因数趋势 **/
  //getAnalysisPowerFactor();
  /** 告警数据 **/
  getAnalysisAlert();
}

/** 报告标题 **/
function getTitle() {
  if (queryParams.value.electricAreaId != null && queryParams.value.electricAreaId != 0) {
    areaName.value = getAreaName(areaOptions.value);
  }

  time.value = parseTime(new Date(), '{y}-{m}-{d}')

}

function getAreaName(options) {
  var name = ""
  for (let option of options) {
    if (option.id == queryParams.value.electricAreaId) {
      return option.label
    } else if (option.children != null && option.children.length > 0) {
      name = getAreaName(option.children)
    }
  }
  return name
}

/** 用电量 **/
function getAnalysisTimePower() {
  getTimePowerByArea(queryParams.value).then(response => {
    if (response.code == 200) {
      timePower.value = response.data;

      if (chart.value != null && chart.value != "" && chart.value != undefined) {
        chart.value.dispose();
      }
			const chartmaindom = document.getElementById('chart');
			chartmaindom.removeAttribute('_echarts_instance_');
      // 基于准备好的dom，初始化echarts实例
      chart.value = proxy.echarts.init(document.getElementById('chart'))
      chart.value.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          right: '3%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: timePower.value.dateList
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              show:true,
              //Y轴数值可添加百分号
              formatter: '{value}' + timePower.value.ycUnit,
            },
          }
        ],
        series: [
          {
            name: '谷电量',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              normal: {color: "#8fc31f"},
            },
            barWidth: 17,
            data: timePower.value.valleyValues

          },
          {
            name: '平电量',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              normal: {color: "#fff45c"},
            },
            barWidth: 17,
            data: timePower.value.flatValues
          },
          {
            name: '峰电量',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              normal: {color: "#ec6941"},
            },
            barWidth: 17,
            data: timePower.value.peakValues
          },
          {
            name: '尖电量',
            type: 'bar',
            stack: 'Ad',
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              normal: {color: "#d9031e"},
            },
            barWidth: 17,
            data: timePower.value.spikeValues
          },
        ]
      });
      // 绘制图表
    }
  });
}

/** 用电排行 **/
function getAnalysisTimePowerRank() {
  getTimePowerRankByArea(queryParams.value).then(response => {
    if (response.code == 200) {
			for(let row of response.data.equipmentPowerList){
				row.powerSum = row.powerSum + response.data.ycUnit
			}
      tableData.value = response.data.equipmentPowerList;
    }
  });
}

/** 电压趋势 **/
function getAnalysisVoltage() {
  // 基于准备好的dom，初始化echarts实例
  const chartmaindom = document.getElementById('dyqs');
  chartmaindom.removeAttribute('_echarts_instance_');
  let myChart = proxy.echarts.init(document.getElementById('dyqs'))
  myChart.setOption({
    // title: {
    //   text: '电压趋势'
    // },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      right: '3%',
      data: ['Email', 'Union Ads', 'Video Ads']
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
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Email',
        type: 'line',
        stack: 'Total',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Union Ads',
        type: 'line',
        stack: 'Total',
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: 'Video Ads',
        type: 'line',
        stack: 'Total',
        data: [150, 232, 201, 154, 190, 330, 410]
      }

    ]
  });
  // 绘制图表
}

/** 电流趋势 **/
function getAnalysisCurrent() {
  // 基于准备好的dom，初始化echarts实例
  const chartmaindom = document.getElementById('dlqs');
  chartmaindom.removeAttribute('_echarts_instance_');
  let myChart = proxy.echarts.init(document.getElementById('dlqs'))
  myChart.setOption({
    // title: {
    //   text: '电压趋势'
    // },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      right: '3%',
      data: ['Email', 'Union Ads', 'Video Ads']
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
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Email',
        type: 'line',
        stack: 'Total',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Union Ads',
        type: 'line',
        stack: 'Total',
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: 'Video Ads',
        type: 'line',
        stack: 'Total',
        data: [150, 232, 201, 154, 190, 330, 410]
      }

    ]
  });
  // 绘制图表
}

/** 功率因数趋势 **/
function getAnalysisPowerFactor() {
  // 基于准备好的dom，初始化echarts实例
  const chartmaindom = document.getElementById('glysqs');
  chartmaindom.removeAttribute('_echarts_instance_');
  let myChart = proxy.echarts.init(document.getElementById('glysqs'))
  myChart.setOption({
    // title: {
    //   text: '电压趋势'
    // },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      right: '3%',
      data: ['Email', 'Union Ads', 'Video Ads']
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
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Email',
        type: 'line',
        stack: 'Total',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'Union Ads',
        type: 'line',
        stack: 'Total',
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: 'Video Ads',
        type: 'line',
        stack: 'Total',
        data: [150, 232, 201, 154, 190, 330, 410]
      }

    ]
  });
  // 绘制图表
}

/** 告警数据 **/
function getAnalysisAlert() {

  let start = queryParams.value.time[0]
  let end = queryParams.value.time[1]

  alarmList(1, 10000, start, end).then(res => {
    let array = []
    if (res.rows) {
      for (let i = 0; i < res.rows.length; i++) {
        array.push( {
          erea: res.rows[i].eqname,
          event: res.rows[i].pointName + ':' + res.rows[i].state,
          time: res.rows[i].dt
        });
      }
    }
    warnData.value = array;
  })

}

getTreeSelect()
// export default {
//   name: "electricity",
//   data() {
//     return {
//       options: [{
//         value: '选项1',
//         label: '烟台'
//       }, {
//         value: '选项2',
//         label: '济南'
//       }, {
//         value: '选项3',
//         label: '潍坊'
//       }],
//       tableData: [
//         {
//           name: '生产二车间',
//           dianliang: '169.2kWh'
//         },
//         {
//           name: '生产二车间',
//           dianliang: '169.2kWh'
//         },
//         {
//           name: '生产二车间',
//           dianliang: '169.2kWh'
//         },
//         {
//           name: '生产二车间',
//           dianliang: '169.2kWh'
//         },
//         {
//           name: '生产二车间',
//           dianliang: '169.2kWh'
//         },
//         {
//           name: '生产二车间',
//           dianliang: '169.2kWh'
//         },
//       ],
//       warnData: [
//         {
//           erea: '电表/生产二车间',
//           event: '电压过低',
//           time: '2022-05-10 14:20:39'
//         },
//         {
//           erea: '电表/生产二车间',
//           event: '电压过低',
//           time: '2022-05-10 14:20:39'
//         },
//         {
//           erea: '电表/生产二车间',
//           event: '电压过低',
//           time: '2022-05-10 14:20:39'
//         },
//       ],
//     }
//   },
//   mounted() {
//     this.chart();
//     this.dyqs();
//     this.dlqs();
//     this.glysqs();
//   },
//   methods: {
//     chart() {
//       // 基于准备好的dom，初始化echarts实例
//       let myChart = this.echarts.init(document.getElementById('chart'))
//       myChart.setOption({
//         tooltip: {
//           trigger: 'axis',
//           axisPointer: {
//             type: 'shadow'
//           }
//         },
//         legend: {
//           right: '3%'
//         },
//         grid: {
//           left: '3%',
//           right: '4%',
//           bottom: '3%',
//           containLabel: true
//         },
//         xAxis: [
//           {
//             type: 'category',
//             data: ['2022-05-01', '2022-05-02', '2022-05-03', '2022-05-04', '2022-05-05', '2022-05-06', '2022-05-07', '2022-05-08', '2022-05-09', '2022-05-10', '2022-05-11']
//           }
//         ],
//         yAxis: [
//           {
//             type: 'value'
//           }
//         ],
//         series: [
//           {
//             name: '谷电量',
//             type: 'bar',
//             stack: 'Ad',
//             emphasis: {
//               focus: 'series'
//             },
//             itemStyle: {
//               normal: { color: "#8fc31f" },
//             },
//             barWidth: 17,
//             data: [320, 332, 301, 334, 390, 330, 320, 334, 390, 330, 320]

//           },
//           {
//             name: '平电量',
//             type: 'bar',
//             stack: 'Ad',
//             emphasis: {
//               focus: 'series'
//             },
//             itemStyle: {
//               normal: { color: "#fff45c" },
//             },
//             barWidth: 17,
//             data: [120, 132, 101, 134, 90, 230, 210, 334, 390, 330, 320]
//           },
//           {
//             name: '峰电量',
//             type: 'bar',
//             stack: 'Ad',
//             emphasis: {
//               focus: 'series'
//             },
//             itemStyle: {
//               normal: { color: "#ec6941" },
//             },
//             barWidth: 17,
//             data: [220, 182, 191, 234, 290, 330, 310, 334, 390, 330, 320]
//           },
//           {
//             name: '尖电量',
//             type: 'bar',
//             stack: 'Ad',
//             emphasis: {
//               focus: 'series'
//             },
//             itemStyle: {
//               normal: { color: "#d9031e" },
//             },
//             barWidth: 17,
//             data: [150, 232, 201, 154, 190, 330, 410, 334, 390, 330, 320]
//           },
//         ]
//       });
//       // 绘制图表
//     },

//     dyqs() {
//       // 基于准备好的dom，初始化echarts实例
//       let myChart = this.echarts.init(document.getElementById('dyqs'))
//       myChart.setOption({
//         // title: {
//         //   text: '电压趋势'
//         // },
//         tooltip: {
//           trigger: 'axis'
//         },
//         legend: {
//           right: '3%',
//           data: ['Email', 'Union Ads', 'Video Ads']
//         },
//         grid: {
//           left: '3%',
//           right: '4%',
//           bottom: '3%',
//           containLabel: true
//         },
//         xAxis: {
//           type: 'category',
//           boundaryGap: false,
//           data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//         },
//         yAxis: {
//           type: 'value'
//         },
//         series: [
//           {
//             name: 'Email',
//             type: 'line',
//             stack: 'Total',
//             data: [120, 132, 101, 134, 90, 230, 210]
//           },
//           {
//             name: 'Union Ads',
//             type: 'line',
//             stack: 'Total',
//             data: [220, 182, 191, 234, 290, 330, 310]
//           },
//           {
//             name: 'Video Ads',
//             type: 'line',
//             stack: 'Total',
//             data: [150, 232, 201, 154, 190, 330, 410]
//           }

//         ]
//       });
//       // 绘制图表
//     },


//     dlqs() {
//       // 基于准备好的dom，初始化echarts实例
//       let myChart = this.echarts.init(document.getElementById('dlqs'))
//       myChart.setOption({
//         // title: {
//         //   text: '电压趋势'
//         // },
//         tooltip: {
//           trigger: 'axis'
//         },
//         legend: {
//           right: '3%',
//           data: ['Email', 'Union Ads', 'Video Ads']
//         },
//         grid: {
//           left: '3%',
//           right: '4%',
//           bottom: '3%',
//           containLabel: true
//         },
//         xAxis: {
//           type: 'category',
//           boundaryGap: false,
//           data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//         },
//         yAxis: {
//           type: 'value'
//         },
//         series: [
//           {
//             name: 'Email',
//             type: 'line',
//             stack: 'Total',
//             data: [120, 132, 101, 134, 90, 230, 210]
//           },
//           {
//             name: 'Union Ads',
//             type: 'line',
//             stack: 'Total',
//             data: [220, 182, 191, 234, 290, 330, 310]
//           },
//           {
//             name: 'Video Ads',
//             type: 'line',
//             stack: 'Total',
//             data: [150, 232, 201, 154, 190, 330, 410]
//           }

//         ]
//       });
//       // 绘制图表
//     },

//     glysqs() {
//       // 基于准备好的dom，初始化echarts实例
//       let myChart = this.echarts.init(document.getElementById('glysqs'))
//       myChart.setOption({
//         // title: {
//         //   text: '电压趋势'
//         // },
//         tooltip: {
//           trigger: 'axis'
//         },
//         legend: {
//           right: '3%',
//           data: ['Email', 'Union Ads', 'Video Ads']
//         },
//         grid: {
//           left: '3%',
//           right: '4%',
//           bottom: '3%',
//           containLabel: true
//         },
//         xAxis: {
//           type: 'category',
//           boundaryGap: false,
//           data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//         },
//         yAxis: {
//           type: 'value'
//         },
//         series: [
//           {
//             name: 'Email',
//             type: 'line',
//             stack: 'Total',
//             data: [120, 132, 101, 134, 90, 230, 210]
//           },
//           {
//             name: 'Union Ads',
//             type: 'line',
//             stack: 'Total',
//             data: [220, 182, 191, 234, 290, 330, 310]
//           },
//           {
//             name: 'Video Ads',
//             type: 'line',
//             stack: 'Total',
//             data: [150, 232, 201, 154, 190, 330, 410]
//           }

//         ]
//       });
//       // 绘制图表
//     },

//   }
// }
</script>

<style lang="scss" scoped>

@media print {
  .top-con{
    width: 75%;
    margin: 0 auto;
    padding: 10px 0;
  }
  .card-tit{
    padding-left: 10px;
    border-left: 5px solid #09bec5;
    font-size: 18px;
  }
 .header{
    padding: 30px 0 10px;
    border-bottom: 1px solid #f0f0f0;
}
  .el-col-5{
    max-width: 20%;
  }
  .nyjc-con{
    padding: 20px;
  }
  .title{

    white-space: nowrap;
    font-weight: bold;
    letter-spacing: -2px;
  }
  .xtit{
    font-size: 12px;
  }
  h4{
    color:#333333;
    text-align: center;
    font-size: 26px;
    font-weight: bold;
  }
  .blue {
    color: #0facd5;
  }

  .red {
    color: #ff5722;
  }

  .yellow {
    color: #c2b82d;
  }

  .orange {
    color: #f09a33;
  }

  .green {
    color: #57bf67;
  }
.ptuico{
  width: 50px;
}
}




.electricity {
  padding: 15px;
  .ele-con{
    width:740px;
    margin: 0 auto;
  }
.electricity-nr{
  width: 500px;
  margin: 0 auto;
}
  .fl {
    float: left;
  }

  .text-right {
    text-align: right;
  }

  .pading10 {
    padding: 20px 10px 0;
  }

  .pa-l10 {
    padding-left: 10px;
  }

  .blue {
    color: #0facd5;
  }

  .red {
    color: #ff5722;
  }

  .yellow {
    color: #c2b82d;
  }

  .orange {
    color: #f09a33;
  }

  .green {
    color: #57bf67;
  }

  .chart-height {
    height: 350px;
  }

  .header {
    padding: 30px 0 10px;
    border-bottom: 1px solid #f0f0f0;
  }

  .card-tit {
    padding-left: 10px;
    border-left: 5px solid #09bec5;
    font-size: 18px;
  }

  .freeze-con {
    //padding: 15px;

    .button-ico {
      .btn {
        border: 0;
        padding: 0 20px;
        height: 24px;
      }

      .active {
        color: #fff;
        background: #09bec5;
      }
    }
  }

  .freeze-nr {
    .tit {
      line-height: 32px;
      padding-right: 6px;
    }

    .inquirebtn {
      background: #09bec5;
      color: #fff;
      border: none;
    }
  }

  .electricity-con {
    width: 740px;
    margin: 10px auto 0;
    position: relative;
    .print{
      position: absolute;
      right: 10px;
      top: 10px;
    }
    .top {
      .top-con {
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;
      }

      h4 {
        font-size: 24px;
        text-align: center;
        font-weight: bold;
      }
    }

    .part-1 {
      .nyjc-con {
        padding: 20px;

        :deep(.el-col-5) {
          max-width: 20%;
        }

        .box-card {
          img {
            //vertical-align: middle;
            //padding: 30px 0;
            //width: 100%;
          }

          .title {
            font-size: 28px;
            white-space: nowrap;
            font-weight: bold;
            letter-spacing: -2px;
          }

          .xtit {
            font-size: 12px;
          }
          .tu{
            //width: 28%;
            //margin-right: 2%;
            img{
              width: 50px;
            }
          }

          .shuzi {
            //margin-top: 25px;
            //width: 70%;
          }
        }
      }

      .chart-con {
        height: 300px;
      }
    }
  }


}

</style>
