<template>
  <!-- 右侧两个菜单 -->
  <div class="twomenu">
    <!--设备巡检-->
    <div class="right-con-1">
      <div class="r-top title border-p">
        <h4 style="margin-top:0;"><img src="@/assets/images/screen/tit-7.png">产线总览</h4>
        <el-row class="xjsb-nr">
          <el-col :span="12">
            <div class="shxj-left">
              <span>{{ completeRate }}<i>%</i></span>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="shxj-left shxj-left2">
              <span>{{ reworkRate }}<i>%</i></span>
            </div>
          </el-col>
        </el-row>
        <!--巡检完成率-->
        <div class="xjwcl-bom" id="xjwcl">
        </div>
      </div>
    </div>
    <div class="right-con-2 border-p">
      <div class="r-top title ">
        <h4><img src="@/assets/images/screen/tit-8.png">环保</h4>
      </div>
      <div class="huanbao">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane label="化学需氧量" name="化学需氧量">
            <div class="time">时间：{{date}}</div>
            <el-row>
              <el-col :span="8">
                <div class="dataitem">{{ realData }}</div>
                <h4>实时采样数据</h4>
              </el-col>
              <el-col :span="8">
                <div class="dataitem">{{ countData }}</div>
                <h4>时间内累计值</h4>
              </el-col>
              <el-col :span="8">
                <div class="dataitem">{{ averageValue }}</div>
                <h4>时间内平均值</h4>
              </el-col>
              <el-col :span="8">
                <div class="dataitem">{{ minData }}</div>
                <h4>时间内最小值</h4>
              </el-col>
              <el-col :span="8">
                <div class="dataitem">{{ maxData }}</div>
                <h4>时间内最大值</h4>
              </el-col>
              <el-col :span="8">
                <div class="dataitem">{{ validData }}</div>
                <h4>有效值</h4>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="氨氮" name="氨氮">
            <div class="time">时间：{{date}}</div>
            <el-row>
              <el-col :span="8">
                <div class="dataitem">{{ realData }}</div>
                <h4>实时采样数据</h4>
              </el-col>
              <el-col :span="8">
                <div class="dataitem">{{ countData }}</div>
                <h4>时间内累计值</h4>
              </el-col>
              <el-col :span="8">
                <div class="dataitem">{{ averageValue }}</div>
                <h4>时间内平均值</h4>
              </el-col>
              <el-col :span="8">
                <div class="dataitem">{{ minData }}</div>
                <h4>时间内最小值</h4>
              </el-col>
              <el-col :span="8">
                <div class="dataitem">{{ maxData }}</div>
                <h4>时间内最大值</h4>
              </el-col>
              <el-col :span="8">
                <div class="dataitem">{{ validData }}</div>
                <h4>有效值</h4>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="污水" name="污水">
            <div class="time">时间：{{date}}</div>
            <el-row>
              <el-col :span="8">
                <div class="dataitem">{{ realData }}</div>
                <h4>实时采样数据</h4>
              </el-col>
              <el-col :span="8">
                <div class="dataitem">{{ countData }}</div>
                <h4>时间内累计值</h4>
              </el-col>
              <el-col :span="8">
                <div class="dataitem">{{ averageValue }}</div>
                <h4>时间内平均值</h4>
              </el-col>
              <el-col :span="8">
                <div class="dataitem">{{ minData }}</div>
                <h4>时间内最小值</h4>
              </el-col>
              <el-col :span="8">
                <div class="dataitem">{{ maxData }}</div>
                <h4>时间内最大值</h4>
              </el-col>
              <el-col :span="8">
                <div class="dataitem">{{ validData }}</div>
                <h4>有效值</h4>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="pH值" name="pH值">
            <div class="time">时间：{{date}}</div>
            <el-row>
              <el-col :span="8">
                <div class="dataitem">{{ realData }}</div>
                <h4>实时采样数据</h4>
              </el-col>
              <el-col :span="8">
                <div class="dataitem">{{ countData }}</div>
                <h4>时间内累计值</h4>
              </el-col>
              <el-col :span="8">
                <div class="dataitem">{{ averageValue }}</div>
                <h4>时间内平均值</h4>
              </el-col>
              <el-col :span="8">
                <div class="dataitem">{{ minData }}</div>
                <h4>时间内最小值</h4>
              </el-col>
              <el-col :span="8">
                <div class="dataitem">{{ maxData }}</div>
                <h4>时间内最大值</h4>
              </el-col>
              <el-col :span="8">
                <div class="dataitem">{{ validData }}</div>
                <h4>有效值</h4>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from '@/utils/echarts'
import {screen, getYcDataByName} from "@/api/jinhui/product";

export default {

  data() {
    return {
      name: 'Jinhui',
      completeRate: 0,
      reworkRate: 0,
      weeklist: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
      weekdatalist: [0, 0, 0, 0, 0, 0, 0],
      activeName: '化学需氧量',
      validData: 0,
      countData: 0,
      maxData: 0,
      minData: 0,
      date: '',
      realData: 0,
      averageValue: 0
    }
  },
  mounted: function () {
    this.xjwcl();
    this.handleClick();
    this.getscreen();
  },
  methods: {
    handleClick() {
      this.validData = 0;
      this.countData = 0;
      this.maxData = 0;
      this.minData =0 ;
      this.date = '';
      this.realData = 0;
      this.averageValue = 0;
      getYcDataByName(this.activeName).then(res => {
        console.log(res)
        this.validData = res.data.validData;
        this.countData = res.data.countData;
        this.maxData = res.data.maxData;
        this.minData = res.data.minData;
        this.date = res.data.date;
        this.realData = res.data.realData;
        this.averageValue = res.data.averageValue;
      })
    },
    getscreen() {

      screen().then(res => {
        console.log('金辉', res);
        this.reworkRate = res.reworkRate
        this.completeRate = res.completeRate
        this.weeklist = []
        this.weekdatalist = []
        res.weekList.forEach(item => {
          this.weeklist.push(item.week)
          this.weekdatalist.push(item.number)
        })
        this.xjwcl();
        console.log(this.reworkRate, this.completeRate)
        //this.wbgzl();

      })

    },
    /*7日巡检完成率*/
    xjwcl() {
      const chartmaindom = document.getElementById('xjwcl');
      chartmaindom.removeAttribute('_echarts_instance_');
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.echarts.init(document.getElementById('xjwcl'))
      myChart.setOption({
        title: {
          text: '七天生产数量汇总',
          textStyle: {
            color: "#00caff",
            fontSize: 12,
          }
        },
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
          data: this.weeklist
        },
        grid: [
          {
            bottom: '15%',
            top: '25%',
            right: '5%',
						left: '16%'
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
            data: this.weekdatalist,
            type: 'line',
            smooth: true
          }
        ]
      });
    },
  }
}
</script>

<style scoped lang="scss">

.twomenu {
  height: 100%
}

.right-con-1 {
  height: 49%;
  background: url("@/assets/images/screen/right-1-bak.png") no-repeat;
  background-size: 100% 100%;
  margin-bottom: 4.9%;

  h4 {
    padding: 15px 15px 0;
    font-size: 16px;
  }

  h4 img {
    vertical-align: middle;
    margin-right: 5px
  }

  .shxj-left {
    background: url("@/assets/images/screen/shebeixj.jpg") no-repeat;
    color: #ffb956;
    font-size: 44px;
    font-weight: bold;
    text-align: center;
    width: 112px;
    height: 110px;
    background-size: cover;
    line-height: 80px;
    margin: 0 auto;

    span {
      transform: scale(0.8, 1);
      white-space: nowrap;
      margin-top: 7px;
      display: inline-block;
    }

    i {
      font-style: normal;
      font-size: 16px;
    }

  }

  .shxj-left2 {
    background: url("@/assets/images/screen/shebeixj-2.jpg") no-repeat;
    background-size: cover;
  }

  .shxj-li {
    background: url("@/assets/images/screen/part7-li.jpg") no-repeat;
    color: #aaddff;
    font-size: 12px;
    height: 35px;
    line-height: 35px;
    background-size: 100% 100%;
    padding: 0 10px;
    margin-top: 10px;

    .number {
      span {
        color: #ffb956;
        font-size: 14px;
      }
    }
  }

  .right-con-1li {
    .linr {
      border: 4px solid #0d2c71;
      box-shadow: 1px 0 15px #0f3598 inset;
      padding: 0px 0px 0 10px;
      margin-top: 10px;
      line-height: 40px;

      .title {
        white-space: nowrap;
      }

      .shuzi {
        font-size: 22px;
        transform: scale(0.8, 1);
        white-space: nowrap;
      }
    }
  }

  .xjwcl-bom {
    height: 18vh;
    margin-top: 25px;
  }
}

.right-con-2 {
  height: 49%;
  background: url("@/assets/images/screen/right-1-bak.png") no-repeat;
  background-size: 100% 100%;
  margin-bottom: 4.9%;

  h4 {
    padding: 15px 15px 0;
    font-size: 16px;
  }

  h4 img {
    vertical-align: middle;
    margin-right: 5px
  }

  .sbwb-con {
    .linr {
      border: 4px solid #0d2c71;
      box-shadow: 1px 0 15px #0f3598 inset;
      padding: 0px 10px;
      margin-bottom: 10px;
      line-height: 30px;

      .title {
        font-size: 12px;
      }

      .shuzi {
        font-size: 22px;
        transform: scale(0.8, 1);
        color: #f8b62d;

      }
    }
  }

  .wbgzl-bom {
    height: 16vh;
  }

  .huanbao {
    padding: 0 15px 15px;

    :deep(.el-tabs) {
      .el-tabs__nav-wrap::after {
        display: none;
      }

      .el-tabs__nav {
        text-align: center;
        width: 100%;
      }

      .el-tabs__header {
        padding: 0 0 10px;
        border-bottom: 1px solid #aaddff;
      }

      .el-tabs__active-bar {
        display: none;
      }

      .el-tabs__item {
        padding: 0;
        border: 1px solid #aaddff;
        width: 23%;
				white-space: nowrap;
        margin: 0 1%;
        color: #aaddff;
        line-height: 30px;
        height: 30px;
      }

      .el-tabs__item.is-active {
        border-color: #aaddff;
        background: #aaddff;
        color: #333;
      }
    }

    .time {
      font-size: 12px;
      text-align: right;
      margin: 0 0 10px;
    }

    .dataitem {
      background: url('@/assets/images/screen/pati-1bg.jpg') no-repeat;
      color: #ffb956;
      font-size: 22px;
      font-weight: bold;
      text-align: center;
      width: 70px;
      height: 70px;
      background-size: cover;
      line-height: 70px;
      margin: 0 auto;
      border-radius: 50%;
    }

    h4 {
      font-size: 14px;
      margin: 5px 0 10px;
      padding: 0;
      text-align: center;
    }
  }

}
</style>
