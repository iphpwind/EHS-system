<template>
    <!-- 右侧两个菜单 -->
    <div class="twomenu">
      <!--设备巡检-->
      <div class="right-con-1">
        <div class="r-top title border-p">
          <h4 style="margin-top:0;"><img src="@/assets/images/screen/tit-7.png">生产概览</h4>
          <div class="juzong">
          <el-row class="xjsb-nr">
            <el-col :span="12">
              <div class="shxj-left">
                <span>10<i>%</i></span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="shxj-left shxj-left2">
                <span>20<i>%</i></span>
              </div>
            </el-col>
          </el-row>
          <!--巡检完成率-->
          <div class="xjwcl-bom" id="xjwcl">
          </div>
          </div>
        </div>
      </div>
      <div class="right-con-2 border-p">
        <div class="r-top title ">
          <h4><img src="@/assets/images/screen/tit-8.png">设备维保</h4>
        </div>

<div class="juzong">
        <div>
        <el-row :gutter="10" class="sbwb-con">
          <el-col :span="12">
            <div class="linr">
              <el-row>
                <el-col :span="19">
                  <div class="title">待维修总数</div>
                </el-col>
                <el-col :span="5">
                  <div class="shuzi text-right">0</div>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="linr">
              <el-row>
                <el-col :span="19">
                  <div class="title">过期维检修数</div>
                </el-col>
                <el-col :span="5">
                  <div class="shuzi text-right">0</div>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="linr">
              <el-row>
                <el-col :span="19">
                  <div class="title">待保养数</div>
                </el-col>
                <el-col :span="5">
                  <div class="shuzi text-right">0</div>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="linr">
              <el-row>
                <el-col :span="19">
                  <div class="title">过期未保养数</div>
                </el-col>
                <el-col :span="5">
                  <div class="shuzi text-right">0</div>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="linr">
              <el-row>
                <el-col :span="19">
                  <div class="title">三个月内到期特种设备</div>
                </el-col>
                <el-col :span="5">
                  <div class="shuzi text-right">0</div>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="linr">
              <el-row>
                <el-col :span="19">
                  <div class="title">已到期特种设备</div>
                </el-col>
                <el-col :span="5">
                  <div class="shuzi text-right">0</div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        </div>
          <!--维保工作量-->
        <div class="wbgzl-bom" id="wbgzl">
        </div>
</div>


      </div>
    </div>
</template>

<script>
	import * as echarts from '@/utils/echarts'
export default {
    name: 'FocusCloud',
    data() {
        return {
            name: 'FocusCloud'
        }
    },
		mounted: function (){
			this.xjwcl();
			this.wbgzl();
		},
		methods: {
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
			      data: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
			    },
			    grid: [
			      {
			        bottom: '15%',
			        top: '25%',
			        right: '5%'
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
			        data: [0, 0, 0, 0, 0, 0, 0],
			        type: 'line',
			        smooth: true
			      }
			    ]
			  });
			},
			/*7日维保工作量*/
			wbgzl() {
			  const chartmaindom = document.getElementById('wbgzl');
			  chartmaindom.removeAttribute('_echarts_instance_');
			  // 基于准备好的dom，初始化echarts实例
			  let myChart = this.echarts.init(document.getElementById('wbgzl'))
			  myChart.setOption({
			    title: {
			      text: '今年维保数据',
			      textStyle: {
			        color: "#00caff",
			        fontSize: 12,
			      }
			    },
			    tooltip: {
			      trigger: 'axis',
			      // axisPointer: {
			      //   type: 'shadow'
			      // }
			    },
			    grid: [
			      {
			        bottom: '16%',
			        top: '30%',
			        right: '5%'
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
			      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
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
			        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
		}
}
</script>

<style scoped lang="scss">
.border-p {
  padding: 15px
}
	.twomenu {
	    height: 100%
	  }

	  .right-con-1 {
	    height: 49%;
	    background: url("@/assets/images/screen/right-1-bak.png") no-repeat;
	    background-size: 100% 100%;
	    margin-bottom: 2%;

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
				i{
					font-style: normal;
					font-size: 16px;
				}

	    }
			.shxj-left2{
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
	    margin-bottom: 0%;

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
	  }

//1366屏幕相应
@media screen and (max-width: 1366px) {
  .home {
    .border-p {
      padding: 5px;
      .juzong {
        position: absolute;
        top: 60%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
      }
    }

    .title {
      h4 {
        font-size: 14px;
        margin: 0;

        img {
          width: 18px;
        }
      }
    }
    .right-con-1 {
      position: relative;
      .shxj-left{
        width: 82px;
        height: 80px;
        span{
          margin-top: 0;
        }
      }
      .xjwcl-bom{
        margin-top: 0;
      }
    }
    .right-con-2 {
      position: relative;
      .sbwb-con{
        .linr {
          padding: 0 4px;
          line-height: 150%;
          margin-bottom: 4%;
          .title{
            white-space: nowrap;
          }
          .shuzi{
            text-align: right;
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>
