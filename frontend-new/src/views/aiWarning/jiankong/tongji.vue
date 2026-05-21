<template>
  <div class="jiankongtongji">
		<div class="searchbox">
		  <el-form :model="queryParams" label-width="100%">
		    <el-row :gutter="30">
					<el-col :span="7">
					  <el-form-item label="起止时间">
              <el-date-picker
                  v-model="value2"
                  @change="change2()"
                  type="datetimerange"
                  :shortcuts="shortcuts"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
              />
					  </el-form-item>
<!--						<div class="timetab">-->
<!--							<span :class="[timeTab===0?'active':'']" @click="timeTabClick(0)">当天</span>-->
<!--							<span :class="[timeTab===1?'active':'']" @click="timeTabClick(1)">近一周</span>-->
<!--							<span :class="[timeTab===2?'active':'']" @click="timeTabClick(2)">近一月</span>-->
<!--						</div>-->
					</el-col>
		      <el-col :span="6">
		        <el-form-item label="相机名称">
              <el-select v-model="queryParams.sbtd" placeholder="请选择状态" clearable>
                <el-option
                    v-for="dict in xjList"
                    :key="dict.sbtd"
                    :label="dict.sbdz"
                    :value="dict.sbtd"
                />
              </el-select>
		        </el-form-item>
		      </el-col>
					<el-col :span="6">
						<el-form-item label="告警类型">
              <el-select v-model="queryParams.lx" placeholder="请选择状态" clearable>
                <el-option
                    v-for="dict in lxList"
                    :key="dict.lx"
                    :label="dict.lx"
                    :value="dict.lx"
                />
              </el-select>
						</el-form-item>
					</el-col>
		      <el-col :span="5">
		        <el-button type="primary" @click="search()" style="margin-top: 32px;">统计</el-button>
		      </el-col>
		    </el-row>
		  </el-form>
		</div>
		<div class="floor">
			<el-row :gutter="30">
				<el-col :span="6">
					<div class="box maindata">
						<div class="item">
							<img src="@/assets/images/screenyxjs/tongji-ico1.png" />
							<h5>报类型数量</h5>
							<span>{{lxtotal}}</span>
						</div>
						<div class="item">
							<img src="@/assets/images/screenyxjs/tongji-ico2.png" />
							<h5>告警总数量</h5>
							<span>{{zstotal}}</span>
						</div>
					</div>
				</el-col>
				<el-col :span="10">
					<div class="box">
						<div class="tit">
							<h4>24h告警态势</h4>
						</div>
						<div class="chartbox">
							<div id="warnqushi"></div>
						</div>
					</div>
				</el-col>
				<el-col :span="8">
					<div class="box">
						<div class="tit">
							<h4>告警类型占比</h4>
						</div>
						<div class="chartbox">
							<div id="warntype"></div>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="floor" style="margin: 0;">
			<el-row :gutter="30">
				<el-col :span="12">
					<div class="box">
						<div class="tit">
							<h4>告警统计 (日期)</h4>
						</div>
						<div class="chartbox">
							<div id="datetongji"></div>
						</div>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="box">
						<div class="tit">
							<h4>告警统计(相机)</h4>
						</div>
						<div class="chartbox">
							<div id="cameratongji"></div>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
  </div>
</template>

<script>
	import * as echarts from '@/utils/echarts'
  import { selectLxList,selectTdBjxx,selectLxBjxx,selectDateBjxx,selectDayBjxx } from "@/api/aiWarning/bjxx";
  import { listSbxx } from "@/api/aiWarning/sbxx";
	export default {
		data() {
			return {
        shortcuts: [{
          text: '最近一周',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
          },
        }, {
          text: '最近一个月',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
          },
        }, {
          text: '最近三个月',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
          },
        }],

        value2:  [new Date()- 3600 * 1000 * 24, new Date()],
				timeTab: 2,
        queryParams:{

        },
        params:{

        },
        xjList:[],
        lxList:[],
        lxtotal:0,
        zstotal:0
			}
		},

		watch: {

		},
		created() {

      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
      this.queryParams.createTime = this.timeFormat(start)
      this.queryParams.updateTime = this.timeFormat(end)
      this.params.createTime = this.timeFormat(start)
      this.params.updateTime = this.timeFormat(end)

      this.getLx()
      this.getXj()
		},

		mounted: function () {
			setTimeout(() => {
			  this.warnqushiChart();
			  this.warntypeChart();
			  this.datetongjiChart();
			  this.cameratongji();
			}, 300)
		},

		methods: {
      search() {
        if (this.value2 != null && this.value2 != ''){
          this.queryParams.createTime = this.timeFormat(this.value2[0])
          this.queryParams.updateTime = this.timeFormat(this.value2[1])
        }else {
          this.queryParams.createTime = null
          this.queryParams.updateTime = null
        }
        this.warnqushiChart();
        this.warntypeChart();
        this.datetongjiChart();
        this.cameratongji();
      },
      getLx(){
        selectLxList().then(res => {
          this.lxList = res.rows
        })
      },
      getXj(){
        listSbxx().then(res => {
          this.xjList = res.rows
        })
      },
      // formathour(data){
      //   var nDate=new Date(data)
      //   var year= nDate.getFullYear().toString()
      //   var hours = year.substring(2,4)
      //   return hours
      // },
      // formatData(data){
      //   const nDate=new Date(data)
      //
      //   console.log(nDate)
      //
      //   var month=(nDate.getMonth()+1).toString().padStart(2,0)
      //   var day=nDate.getDate().toString()
      //   return month+'.'+day
      // },
      change2(){
        // this.queryParams.createTime = this.timeFormat(this.value2[0])
        // this.queryParams.updateTime = this.timeFormat(this.value2[1])
      },
      timeFormat(time) { // 时间格式化 2019-09-08
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        let hh = time.getHours();
        let dd = time.getMinutes();
        let ss = time.getSeconds();
        return year + '-' + month + '-' + day + ' ' + hh + ':' + dd + ':' + ss;
      },

			timeTabClick(val) {
				this.timeTab = val;
			},
			warnqushiChart() {
				let chartDom = document.getElementById('warnqushi');
				let myChart = echarts.init(chartDom);
				let option;
        selectDayBjxx(this.params).then(res => {
          var list = res.rows;
          var datelist = []
          var numlist = []
          for(var i=0;i<list.length;i++){
            numlist.push(list[i].num)
            datelist.push( list[i].time )
          }

          option = {
            tooltip: {
              trigger: 'axis'
            },
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#ce5452' // 0% 处的颜色
              }, {
                offset: 1, color: '#5cbaec' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            },
            grid: {
              top: '16%',
              bottom: '10%'
            },
            xAxis: {
              type: 'category',
              data: datelist
            },
            yAxis: {
              type: 'value',
              name: "每小时的告警总数",
            },
            series: [
              {
                data: numlist,
                type: 'line',
                smooth: true
              }
            ]
          };
          option && myChart.setOption(option);

        })

			},
			warntypeChart() {
				let chartDom = document.getElementById('warntype');
				let myChart = echarts.init(chartDom);
				let option;

        selectLxBjxx(this.queryParams).then(res => {

          this.lxtotal = res.total
          var list = res.rows;
          var numlist = []
          for(var i=0;i<list.length;i++){
            var num = {
              value:list[i].num,
              name:list[i].lx
            }
            numlist.push(num)
          }
          option = {
            tooltip: {
              trigger: 'item'
            },
            series: [
              {
                type: 'pie',
                radius: '60%',
                data: numlist,
              }
            ]
          };
          option && myChart.setOption(option);


        })
			},
			datetongjiChart() {
				let chartDom = document.getElementById('datetongji');
				let myChart = echarts.init(chartDom);
				let option;

        selectDateBjxx(this.queryParams).then(res => {
          var list = res.rows;
          var datelist = []
          var numlist = []
          this.zstotal = 0
          for(var i=0;i<list.length;i++){
            numlist.push(list[i].num)
            // datelist.push( this.formatData(list[i].time) )
            datelist.push( list[i].time )
            this.zstotal+=Number(list[i].num)
          }

          option = {
            tooltip: {
              trigger: 'axis'
            },
            color: ['#5cbaec'],
            grid: {
              top: '16%',
              bottom: '10%'
            },
            xAxis: {
              type: 'category',
              data: datelist
            },
            yAxis: {
              type: 'value',
            },
            series: [
              {
                data: numlist,
                type: 'line',
                areaStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                      offset: 0, color: '#5cbaec' // 0% 处的颜色
                    }, {
                      offset: 1, color: 'rgba(92,186,236,0)' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                  },
                }
              }
            ]
          };
          option && myChart.setOption(option);

        })


			},
			cameratongji() {
				let chartDom = document.getElementById('cameratongji');
				let myChart = echarts.init(chartDom);
				let option;

        selectTdBjxx(this.queryParams).then(res => {
          var list = res.rows;
          var datelist = []
          var numlist = []
          for(var i=0;i<list.length;i++){
            numlist.push(list[i].num)
            datelist.push(list[i].sbdz)
          }

          option = {
            tooltip: {
              trigger: 'axis'
            },
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: '#5cbaec' // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(92,186,236,0)' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            },
            grid: {
              top: '16%',
              bottom: '10%'
            },
            xAxis: {
              type: 'category',
              data: datelist
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                data: numlist,
                type: 'bar'
              }
            ]
          };
          option && myChart.setOption(option);

        })


			},
		},

	}
</script>


<style scoped lang="scss">
.jiankongtongji {
  height: calc(100vh - 84px);
  overflow: auto;
  background: #f8f8f8;
  padding: 15px;

	:deep(.el-row) {
		height: 100%;
		.el-col{
			height: 100%;
			position: relative;
		}
	}

	.searchbox {
	  background: #fff;
	  padding: 10px 30px 0;
	  margin: 0 0 20px;
		height: 100px;
		:deep(.el-form-item) {
			display: block;
			.el-select{
				width: 100%;
			}
		}
		.timetab{
			position: absolute;right: 15px;top: 5px;
			span{
				color: #555;margin-left: 20px;
				font-size: 14px;
				cursor: pointer;
			}
			span.active{
				color: #09bec5;
			}
		}
	}
	.floor{
		height: calc(50% - 70px);margin: 0 0 20px;

		.box{
			background: #fff;height: 100%;
			padding: 15px;
			.tit{
				position: relative;
				h4{
					font-size: 16px;margin: 0;
					font-weight: bold;color: #333;
				}
			}
			.chartbox{
				height: calc(100% - 20px);
				#warnqushi{
					height: 100%;
				}
				#warntype{
					height: 100%;
				}
				#datetongji{
					height: 100%;
				}
				#cameratongji{
					height: 100%;
				}
			}
		}
		.maindata{
			background: transparent;padding: 0;
			.item{
				text-align: center;
				height: calc(50% - 10px);
				background: #fff;
				margin: 0 0 20px;
				display: flex;
				align-items: center;
				justify-content: center;
				img{
					width: 60px;height: auto;
				}
				h5{
					display: inline-block;margin: 0 10px;
					font-size: 18px;
					color: #555;
				}
				span{
					font-size: 30px;font-weight: bold
				}
			}
			.item:last-child{
				margin: 0;
			}
		}
	}
}

</style>




