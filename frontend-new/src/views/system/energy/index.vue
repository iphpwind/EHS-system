<template>
  <div class="energy">
    
    <el-row :gutter="20">
        <el-form  ref="queryRef" :inline="true" label-width="68px" v-show="showSearch">
          <el-form-item label="所属部门" prop="deptId">
            <tree-select
                v-model:value="deptId"
                :options="deptOptions"
                placeholder="请选择归属部门"
                :objMap="{ value: 'id', label: 'label', children: 'children' }"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-row :gutter="15">
          <el-col :span="18">
            <el-card :body-style="{ padding: '10px' }">
              <el-row>
                <el-col :span="12">
                  <div class="gailan-left">
                    <span class="card-tit">能源概览</span>
                    <span class="datetime">{{ datetime }}</span>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="gailan-right">
    <!--                <el-button class="btn active" round>电</el-button>-->
    <!--                <el-button class="btn" round>水</el-button>-->
    <!--                <el-button class="btn" round>气</el-button>-->
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="8">
                  <div class="gailanbox">
                    <el-card :body-style="{ padding: '10px' }">
                      <el-row>
                        <el-col :span="12">
                          <div class="gailan-item-tit">
                            <img src="../../../assets/images/energy-gailan-1.png"/>
                            <span>今日累计用电</span>
                          </div>
                        </el-col>
                        <el-col :span="12">
                          <div class="gailan-item-time">运行时间：0:00至{{ time }}</div>
                        </el-col>
                        <div class="greyline"></div>
                        <el-col :span="12">
                          <div class="gailan-item-data">
                            <span>{{ todayCount }}</span><span style="font-size: 20px;">{{ unit }}</span>
                          </div>
                        </el-col>
                        <el-col :span="12">
                          <div class="gailan-item-compare">
                            <p v-if="thanYesterday >= 0">
                              较昨日用电
                              <span>{{ thanYesterday }}%</span>
                              <img src="../../../assets/images/energy-gailan-up.png"/>
                            </p>
                            <p v-else>
                              较昨日用电
                              <span>{{ thanYesterday }}%</span>
                              <img src="../../../assets/images/energy-gailan-down.png"/>
                            </p>
                          </div>
                        </el-col>
                      </el-row>
                    </el-card>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="gailanbox2">
                  <el-card :body-style="{ padding: '10px' }">
                    <el-row>
                      <el-col :span="12">
                        <div class="gailan-item-tit">
                          <img src="../../../assets/images/energy-gailan-2.png"/>
                          <span>本月累计用电</span>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="gailan-item-time">运行时间：{{ monthstart }}至{{ monthday }}</div>
                      </el-col>
                      <div class="greyline"></div>
                      <el-col :span="12">
                        <div class="gailan-item-data">
                          <span>{{ monthCount }}</span><span style="font-size: 20px;">{{ unit }}</span>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="gailan-item-compare">
                          <p>
                            较上月用电
                            <span>{{ thanLastMonth }}%</span>
                            <img v-if="thanLastMonth >= 0" src="../../../assets/images/energy-gailan-up.png"/>
                            <img v-else src="../../../assets/images/energy-gailan-down.png"/>
                          </p>
                        </div>
                      </el-col>
                    </el-row>
                  </el-card>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="gailanbox3">
                  <el-card :body-style="{ padding: '10px' }">
                    <el-row>
                      <el-col :span="12">
                        <div class="gailan-item-tit">
                          <img src="../../../assets/images/energy-gailan-3.png"/>
                          <span>今年累计用电</span>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="gailan-item-time">运行时间：01-01至{{ monthday }}</div>
                      </el-col>
                      <div class="greyline"></div>
                      <el-col :span="12">
                        <div class="gailan-item-data">
                          <span>{{ yearCount }}</span><span style="font-size: 20px;">{{ unit }}</span>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="gailan-item-compare">
                          <p>
                            较去年用电
                            <span>{{ thanLastYear }}%</span>
                            <img v-if="thanLastYear >= 0" src="../../../assets/images/energy-gailan-up.png"/>
                            <img v-else src="../../../assets/images/energy-gailan-down.png"/>
                          </p>
                        </div>
                      </el-col>
                    </el-row>
                  </el-card>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="6">
            <div class="paihang">
              <el-card :body-style="{ padding: '10px' }">
                <div class="clearfix header">
                  <span class="card-tit">用电排行</span>
                  <div class="gailan-right">
                    <el-select v-model="value" @change="reRank">
                      <el-option
                          v-for="item in paihang"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="paihanglist">
                  <el-table
                      :data="tableData"
                      height="100%"
                      style="width: 100%">
                    <el-table-column
                        type="index"
                        label="排名"
                        width="50">
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="设备名称">
                    </el-table-column>
                    <el-table-column
                        prop="dianliang"
                        label="用电量">
                    </el-table-column>
                  </el-table>
                </div>
              </el-card>
            </div>
          </el-col>
          <el-col :span="18">
            <div class="quxian">
              <el-card :body-style="{ padding: '10px' }">
                <div class="clearfix header">
                  <span class="card-tit">总用电曲线</span>
                  <div class="gailan-right">
                    <el-button class="btn changeCharBtn" :type="selectdate" round @click="changeChar(1)">时</el-button>
                    <el-button class="btn changeCharBtn" round  :type="selectmonth"  @click="changeChar(2)">日</el-button>
                    <el-button class="btn changeCharBtn" round :type="selectyear" @click="changeChar(3)">月</el-button>
                  </div>
                </div>
                <div class="echart">
                  <div id="chartmain"></div>
                </div>
              </el-card>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="jiancedian">
              <el-card :body-style="{ padding: '10px' }">
                <div class="clearfix header">
                  <span class="card-tit">监测点状态统计</span>
                </div>
                <div class="jiancebox">
                  <el-row :gutter="40">
                    <el-col :span="24">
                      <div class="jcd-top">
                        <el-row>
                          <el-col :span="12">
                            <p>{{ onlineNum }}</p>
                            <h5>在线数</h5>
                          </el-col>
                          <el-col :span="12">
                            <p class="grey">{{ allEqNum }}</p>
                            <h5>总数</h5>
                          </el-col>
                        </el-row>
                      </div>
                      <div class="jcd-bottom">
                        <img src="../../../assets/images/energy-jiance-1.png"/>
                        <strong>智能电表</strong>
                      </div>
                    </el-col>
    <!--                <el-col :span="12">-->
    <!--                  <div class="jcd-top">-->
    <!--                    <el-row>-->
    <!--                      <el-col :span="12">-->
    <!--                        <p>3</p>-->
    <!--                        <h5>在线数</h5>-->
    <!--                      </el-col>-->
    <!--                      <el-col :span="12">-->
    <!--                        <p class="grey">5</p>-->
    <!--                        <h5>总数</h5>-->
    <!--                      </el-col>-->
    <!--                    </el-row>-->
    <!--                  </div>-->
    <!--                  <div class="jcd-bottom">-->
    <!--                    <img src="../../../assets/images/energy-jiance-1.png"/>-->
    <!--                    <strong>智能电表</strong>-->
    <!--                  </div>-->
    <!--                </el-col>-->
                  </el-row>
                </div>
              </el-card>
            </div>

            <div class="warning">
              <el-card :body-style="{ padding: '10px' }">
                <div class="clearfix header">
                  <span class="card-tit">最新告警</span>
                </div>
                <div class="warnlist">
                  <el-table
                      :data="warnData"
                      height="220"
                      style="width: 100%">
                    <el-table-column
                        prop="erea"
                        label="设备/区域">
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
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
    </el-row>
  </div>
</template>

<script>
import jquery from "jquery";
import {treeselect} from "@/api/system/dept";
import {deptAndElectricAreaTreeSelect,pageIndex, totalElectricityByDay, rank, alert, onLine} from "@/api/energy/energyoverview";
import { areatreeselect } from "@/api/energy/area";

export default {
  name: "index",
  data() {
    return {
      selectdate:'success', //此处我默认第一个按钮被选中
      selectmonth:'',
      selectyear:'',
      charType: 1,
      rankType: 1,
      onlineNum: 0,
      allEqNum: 0,
      datetime: '',
      time: '',
      todayCount: 0,
      monthCount: 0,
      yearCount: 0,
      thanYesterday: 0,
      thanLastYear: 0,
      thanLastMonth: 0,
      monthstart: '',
      monthday: '',
      value: '按日排行',
      paihang: [
        {
          value: '1',
          label: '按日排行'
        }, {
          value: '0',
          label: '按月排行'
        }
      ],
      tableData: [],
      warnData: [],
			unit: 'kWh',
      deptOptions: [],
      areaOptions: [],
      deptName: '',
      filterNode: (value, data) => {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      deptId:'',
      areaId:'',
      showSearch: false,
    };
  },
  watch: {
    deptName:{
      handler: function(newValue, oldValue) {
        this.$refs["deptTreeRef"].filter(newValue);
      },
      deep: true, // 深度监听
    }
  }, 
  mounted() {
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
    this.time = hh + ':' + mf;  						//时:分
    this.monthstart = mm + '-01';						//每个月1号
    this.monthday = mm + '-' + dd;					//今天，月-日
    // this.yesterday =

		//规定区块高度
		let winHt = window.innerHeight - 160;
		let boxHt = winHt/3;
		let chartHt = window.innerHeight - 150
		document.querySelector('.paihanglist').style.height = boxHt - 55 + 'px';
		document.querySelector('.gailanbox').style.height = boxHt - 59 + 'px';
		document.querySelector('.gailanbox2').style.height = boxHt - 59 + 'px';
		document.querySelector('.gailanbox3').style.height = boxHt - 59 + 'px';
		document.querySelector('.jiancedian').style.height = boxHt -2 + 'px';
		document.querySelector('.warnlist').style.height = boxHt - 55 + 'px';
		document.querySelector('.echart').style.height = chartHt*2/3 - 55 + 'px';

    //调用echart
    this.getTreeselect();
    this.initPage();
    this.chartmain();
    this.initRank();
    this.initAlarm();
  },
  methods: {
    /** 节点单击事件 */
    handleQuery() {
      this.initPage();
      this.chartmain();
      this.initRank();
      this.initAlarm();
    },

/** 重置按钮操作 */
    resetQuery() {
      this.deptId = '';
      this.handleQuery();
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        let data = response.data;
        if(data.length > 1 || typeof (data[0].children) !== 'undefined'){
          this.showSearch = true;
        }
        this.deptOptions = response.data;
      });
    },
    reRank(v) {
      this.rankType = v;
      this.initRank()
    },

    initRank() {
      let params = {
        deptId : this.deptId,
        type: this.rankType
      }
      this.tableData = []
      rank(params).then(res => {
        let data = res.data
        if (data) {
          for (let i = 0; i < data.length; i++) {
            this.tableData.push({
              name: data[i].sensorName,
              dianliang: data[i].value + 'kWh'
            })
          }
        }
      })
    },
    initAlarm() {
      let params = {
        deptId : this.deptId,
      }
      alert(params).then(res => {
        let data = res.data
				if (data) {
					if (data.rows) {
						for (let i = 0; i < data.rows.length; i++) {
							this.warnData.push({
								erea: data.rows[i].eqname,
								event: data.rows[i].state,
								time: data.rows[i].dt
							})
						}
					}
				}
      })
    },
    initPage() {
      let params = {
        deptId : this.deptId
      }
      pageIndex(params).then(res => {
        let data = res.data
        if (data) {
          this.todayCount = data.allOfToday
          this.monthCount = data.allOfMonth
          this.yearCount = data.allOfYear
          this.thanYesterday = (data.thanYesterday * 100).toFixed(2)
          this.thanLastMonth = (data.thanLastMonth * 100).toFixed(2)
          this.thanLastYear = (data.thanLastYear * 100).toFixed(2)
          this.unit = data.unit
        }
      })

      onLine(params).then(res => {
        let data = res.data
        if (null !== data && typeof data !== 'undefined') {
          this.allEqNum = data.allEq
          this.onlineNum = data.online
        }
      })
    },

    changeChar(type) {
      this.charType = type
      this.chartmain()
      if (this.charType === 1) {
        this.selectdate='success'
        this.selectmonth=''
        this.selectyear=''
      }else if (this.charType === 2) {
        this.selectdate=''
        this.selectmonth='success'
        this.selectyear=''
      }else{
        this.selectdate=''
        this.selectmonth=''
        this.selectyear='success'
      }
    },

    chartmain() {
      // let myChart = this.echarts.init(document.getElementById('chartmain'))
      const chartmaindom = document.getElementById('chartmain')
      chartmaindom.removeAttribute('_echarts_instance_')
      let myChart = this.echarts.init(chartmaindom)
      let params = {
        deptId : this.deptId,
        type: this.charType
      }
      totalElectricityByDay(params).then(res => {
        let data = res.data
        let dataArray = []
        let nowData = []
        let pastData = []
        let legend = ['实时数据', '历史数据']
        let fix = "";

        if (this.charType === 1) {
          fix = ":00";
        } else if (this.charType === 2) {
          fix = "日";
        } else {
          fix = "月";
        }

        for (let key in data.now) {
          dataArray.push(key + fix)
          nowData.push(data.now[key])
          pastData.push(data.past[key])
        }

        myChart.setOption({
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: legend,
          },
          xAxis: [
            {
              type: 'category',
              // prettier-ignore
              data: dataArray
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                show:true,
                //Y轴数值可添加百分号
                formatter: '{value}' + this.unit,
              },
            }
          ],
          series: [
            {
              name: '实时数据',
              type: 'bar',
              data: nowData
            },
            {
              name: '历史数据',
              type: 'bar',
              data: pastData
            }
          ]
        });
      })

    }
  },
}
</script>

<style lang="scss" scoped>
	.energy{
		padding: 15px;

		.card-tit{padding-left: 10px;border-left: 5px solid #09bec5;font-size: 18px;}

		.gailan-left{
			padding-bottom: 15px;
			.datetime{font-size: 14px;margin-left: 20px;color: #5c5c5c}
		}
		.gailan-right{
			text-align: right;
      //显示时按钮样式
      .el-button--success { //需要更改的按钮类型
        background: #09bec5 !important;
        border-color: #09bec5 !important;
      }
      //移入时按钮样式
      .el-button--success:hover {
        background: #09bec5 !important;
        border-color: #09bec5 !important;
        color: #FFF !important;
      }
			.btn{border: 0;padding: 0 20px;height: 24px;}
			.active{color: #fff;background: #09bec5;}
		}
		.gailan-item-tit{
			img{vertical-align: middle;margin-right: 10px;padding: 10px 0;}
			span{font-size: 14px;}
		}
		.gailan-item-time{font-size: 14px;color: #5c5c5c;text-align: right;white-space: nowrap;line-height: 37px;padding: 10px 0;}
		.greyline{width: 100%;border-top: 1px solid #f0f0f0;}
		.gailan-item-data{
			font-size: 24px;padding: 20px 0 0;white-space: nowrap; color: #09bec5;font-weight: bold;
			transform: scale(0.8,1);
			span{font-size: 56px;margin-right: 5px}
		}
		.gailan-item-compare{
			text-align: right; font-size: 14px; color: #5c5c5c; padding: 40px 0 0;

			p{}
			span{margin-right: 4px;}
			img{}
		}
		.quxian{
			margin: 10px 0;
			.gailan-right{display: inline-block;float: right;}
			.el-input__inner{padding: 0}
			.echart{min-height: 400px;}
		}
		.header{padding: 0 0 10px;border-bottom: 1px solid #f0f0f0;}
		.paihang{
			.gailan-right{display: inline-block;float: right;width: 100px;}
			.paihanglist{height: 100%;}
		}
		.jiancedian{
			margin: 10px 0 0;
			.jiancebox{
				height: 100%;padding: 0 20px;
				.jcd-top{
					text-align: center; padding: 20px 0; border-bottom: 1px solid #f0f0f0;
					p{
						font-size: 56px;white-space: nowrap; color: #09bec5;font-weight: bold;margin: 0;
						transform: scale(0.8,1);
					}
					p.grey{color: #b9b9b9;}
					h5{color: #5c5c5c;margin: 0;}
				}
				.jcd-bottom{
					text-align: center;
					img{display: block;margin: 20px auto 10px;}
					strong{font-size: 14px;}
				}
			}
		}
		.warning{
			margin: 10px 0 0;
		}
		#chartmain{height: 100%;padding: 30px 0 0;}
	}
</style>
