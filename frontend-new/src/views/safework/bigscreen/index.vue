<template>
  <div class="shuangchongyf">

		<div class="toptitle">
			<img src="@/assets/images/scyf/tszy-toptit.png" @load="topimageLoaded"/>
		  <div class="fangda">
		    <i v-if="size == 'small'" style="cursor: pointer;" @click="changeSize()">
					<img src="@/assets/images/fangda.png">
				</i>
		    <i v-if="size == 'big'" style="cursor: pointer;" @click="changeSize()">
					<img src="@/assets/images/suoxiao.png">
				</i>
		  </div>
		</div>
		<div class="main" :style="{ height: maniHt}">
			<el-row>
				<el-col :span="6">
					<div class="left">
						<div class="mainbox leftbox1">
							<div class="zuoyedata">
								<el-row>
									<el-col :span="8">
										<div class="zydatalf">
											<div class="item">
												<h3>{{inproNum}}</h3>
												<h5>进行中作业</h5>
											</div>
											<div class="item">
												<h3>{{notinproNum}}</h3>
												<h5>预约计划</h5>
											</div>
										</div>
									</el-col>
									<el-col :span="16">
										<div class="zydatart">
											<el-row :gutter="5">
												<el-col v-for="item in inPro" :span="8">
													<div class="item">
														<div class="number">{{item.num}}</div>
														<h5>{{item.label}}</h5>
													</div>
												</el-col>
											</el-row>
										</div>
									</el-col>
								</el-row>
							</div>
						</div>
						<div class="mainbox leftbox2">
							<div class="tit">现场作业</div>
							<div class="midselect">
								<div class="selectleft">
									作业类型
									<img src="@/assets/images/scyf/tszy-selectline.png" />
								</div>
								<el-select v-model="ticketParam.type" suffix-icon="CaretTop" @change="selectTicketList()">
									<el-option
										v-for="item in midoptions"
										:key="item.value"
										:label="item.label"
										:value="item.value"
									/>
								</el-select>
							</div>
							<el-table :data="ticketList" stripe
								height="calc(100% - 82px)"
							 style="width: 100%">
                <el-table-column label="作业类型" prop="type" align="center">
                  <template #default="scope">
                    <span v-if="scope.row.type == 'fire'">动火作业</span>
                    <span v-if="scope.row.type == 'earth'">动土作业</span>
                    <span v-if="scope.row.type == 'electric'">临时用电</span>
                    <span v-if="scope.row.type == 'high'">高处作业</span>
                    <span v-if="scope.row.type == 'hoisting'">吊装作业</span>
                    <span v-if="scope.row.type == 'restricted'">受限空间</span>
                    <span v-if="scope.row.type == 'blind'">盲板抽堵</span>
                    <span v-if="scope.row.type == 'broken'">断路作业</span>
                  </template>
                </el-table-column>
                <el-table-column label="作业证编码" prop="id" align="center">
                  <template #default="scope">
                    <span>{{scope.row.id.slice(24)}}</span>
                  </template>
                </el-table-column>
								<el-table-column label="作业级别" prop="levelName" align="center" />
							</el-table>
						</div>
						<div class="mainbox leftbox3">
							<div class="tit">布控球</div>
							<div class="bukongqiu">
								<div class="item">
									<h3>R001</h3>
									<h5>报警数量：0</h5>
									<div class="btn">查看详细</div>
								</div>
								<div class="item">
									<h3>R001</h3>
									<h5>报警数量：0</h5>
									<div class="btn">查看详细</div>
								</div>
								<div class="item">
									<h3>R001</h3>
									<h5>报警数量：0</h5>
									<div class="btn">查看详细</div>
								</div>
								<div class="item">
									<h3>R001</h3>
									<h5>报警数量：0</h5>
									<div class="btn">查看详细</div>
								</div>
								<div class="item">
									<h3>R001</h3>
									<h5>报警数量：0</h5>
									<div class="btn">查看详细</div>
								</div>
								<div class="item">
									<h3>R001</h3>
									<h5>报警数量：0</h5>
									<div class="btn">查看详细</div>
								</div>
							</div>
						</div>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="mid">
						<div id="cesiumContainer"></div>
						<div class="midup">
							<div class="midtop">
								<el-row>
									<el-col :span="6">
										<div class="item">
											监控设备：{{unitSum}}
										</div>
									</el-col>
									<el-col :span="6">
										<div class="item">
											进行中作业：0
										</div>
									</el-col>
									<el-col :span="6">
										<div class="item">
											施工作业：54
										</div>
									</el-col>
									<el-col :span="6">
										<div class="item">
											设备检修：166
										</div>
									</el-col>
								</el-row>
							</div>
						</div>

						<div class="midbot">
							<div class="itembox">
								<div class="item">
									<img src="@/assets/images/scyf/tszy-midbotico1.png"/>
									<h5>全流程管理</h5>
								</div>
								<div class="item">
									<img src="@/assets/images/scyf/tszy-midbotico2.png"/>
									<h5>特殊作业过程管理</h5>
								</div>
								<div class="item">
									<img src="@/assets/images/scyf/tszy-midbotico3.png"/>
									<h5>应急管理智慧</h5>
								</div>
							</div>
						</div>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="right">
						<div class="mainbox">
							<div class="tit">作业趋势图</div>
							<div class="timechoose">
								<span :class="[dateParam.num===30?'active':'']" @click="zyqstTab(30)">近30天</span>
								<span :class="[dateParam.num===7?'active':'']" @click="zyqstTab(7)">近7天</span>
							</div>
							<div class="zyqst">
								<div id="zyqst"></div>
							</div>
						</div>
						<div class="mainbox">
							<div class="tit">作业票区域占比</div>
							<div class="zypqyzb">
								<div id="zypqyzb"></div>
							</div>
						</div>
						<div class="mainbox">
							<div class="tit">承包商管理</div>
							<div class="cbsgl">
								<el-row>
									<el-col :span="8">
										<div class="item">
											<h3>{{contractor.pnum}}</h3>
											<h5>人员总数</h5>
										</div>
									</el-col>
									<el-col :span="8">
										<div class="item">
											<h3>{{contractor.sannum}}</h3>
											<h5>人员资质三月内到期</h5>
										</div>
									</el-col>
									<el-col :span="8">
										<div class="item">
											<h3>{{contractor.gqnum}}</h3>
											<h5>人员资质已到期</h5>
										</div>
									</el-col>
									<el-col :span="8">
										<div class="item">
											<h3>{{contractor.bnum}}</h3>
											<h5>承包商单位量</h5>
										</div>
									</el-col>
									<el-col :span="8">
										<div class="item">
											<h3>0</h3>
											<h5>企业证书三月内到期</h5>
										</div>
									</el-col>
									<el-col :span="8">
										<div class="item">
											<h3>0</h3>
											<h5>企业资质已到期</h5>
										</div>
									</el-col>
								</el-row>
							</div>
						</div>
						<div class="mainbox">
							<div class="tit">违法记录</div>
							<div class="timechoose">
								<span :class="[wfjltab==='1'?'active':'']" @click="wfjlTab('1')">近30天</span>
								<span :class="[wfjltab==='2'?'active':'']" @click="wfjlTab('2')">近7天</span>
							</div>
							<div class="wfjl">
								<el-table :data="wfjltableData"
									height="100%"
								  style="width: 100%">
									<el-table-column label="违章人" prop="person" align="center" />
									<el-table-column label="违章描述" prop="description" align="center" />
									<el-table-column label="违章日期" prop="datetime" align="center" />
								</el-table>
							</div>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>

  </div>
</template>

<script>

import * as echarts from '@/utils/echarts'
import { aboutContractor } from "@/api/certificateManage/certificate";
import { selectInPro,selectNotInPro,selectTicketList,selectTicketByDate,selectTicketByObject } from "@/api/safework/allticket";
export default {
  name: "特殊作业",

  data() {
    return {
      unitName:'',
      maniHt: '',
      size: 'small',
      videourl: '',
      player: '',
      videoid: '',
      newtime: '',
      jiankongshow: false,
      isFullscreen: false,
      midvalue: 'fire',
      midoptions: [
        {
          value: 'fire',
          label: '动火作业',
        }, {
          value: 'earth',
          label: '动土作业',
        },{
          value: 'electric',
          label: '临时用电',
        },{
          value: 'high',
          label: '高处作业',
        },{
          value: 'hoisting',
          label: '吊装作业',
        },{
          value: 'restricted',
          label: '受限空间',
        },{
          value: 'blind',
          label: '盲板抽堵',
        },{
          value: 'broken',
          label: '断路作业',
        }
      ],
      fxwcl: '80',  //上周风险分析完成率
      xczytableData: [
        {
          type: '汽动给水泵',
          code: 'A00181715',
					level: '一级'
        },{
          type: '汽动给水泵',
          code: '0018171',
					level: '一级'
        },{
          type: '汽动给水泵',
          code: '00181711',
					level: '一级'
        },
      ],
			wfjltab: '2',
      piedata: [
				{ value: 1048, name: '热点工厂' },
				{ value: 735, name: '罐区工段' },
				{ value: 580, name: '氯气液化' },
			],
			wfjltableData: [
				{
					person: '张丹丹',
					description: '服装不标准 操作有问题',
					datetime: '2021.5.12 14:16:28'
				},{
					person: '张丹丹',
					description: '服装不标准 操作有问题',
					datetime: '2021.5.12 14:16:28'
				},{
					person: '张丹丹',
					description: '服装不标准 操作有问题',
					datetime: '2021.5.12 14:16:28'
				}
			],
      contractor:{},
      inPro:[{
        value: 'fire',
        label: '动火作业',
        num:0
      }, {
        value: 'earth',
        label: '动土作业',
        num:0
      },{
        value: 'electric',
        label: '临时用电',
        num:0
      },{
        value: 'high',
        label: '高处作业',
        num:0
      },{
        value: 'hoisting',
        label: '吊装作业',
        num:0
      },{
        value: 'restricted',
        label: '受限空间',
        num:0
      },{
        value: 'blind',
        label: '盲板抽堵',
        num:0
      },{
        value: 'broken',
        label: '断路作业',
        num:0
      }],
      inproNum:0,
      notinPro:[],
      notinproNum:0,
      ticketList:[],
      ticketParam: {type:null},
      dateParam: {
        num:7
      }
    }
  },

  watch: {},
  created() {
    this.selectInPro()
    this.selectNotInPro()
    this.selectTicketList()
    this.aboutContractor()
  },

  mounted: function () {

		setTimeout(() => {
      this.$nextTick(() => {
        this.zyqstChart();
        this.zypqyzbChart();
      })
		}, 600)

  },

  methods: {
    topimageLoaded() {
      let topHt = document.querySelector('.toptitle').clientHeight + 'px';
      this.maniHt = 'calc(100% - ' + topHt + ')';
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
        document.querySelector('.shuangchongyf').style.minHeight = '100vh';
        document.querySelector('.navbar').style.display = 'none';
        document.querySelector('.tags-view-container').style.display = 'none';
        document.querySelector('.hit').style.height = 'calc(100vh - 60px)';

      } else if (this.size == 'big') {
        this.size = 'small'
        document.querySelector('.sidebar-container').style.width = "";
        document.querySelector('.main-container').style.marginLeft = "";
        document.querySelector('.navbar').style.display = 'block';
        document.querySelector('.app-main').style.minHeight = 'calc(100vh - 84px)';
        document.querySelector('.shuangchongyf').style.minHeight = 'calc(100vh - 84px)';
        document.querySelector('.tags-view-container').style.display = 'block'
        document.querySelector('.hit').style.height = '100%';
      }
    },
		zyqstTab(val) {
			this.dateParam.num = val;
      this.zyqstChart()
		},
		wfjlTab(val) {
			this.wfjltab = val;
		},
		zyqstChart() {

      var xDate = [];
      var yDate = [];
      selectTicketByDate(this.dateParam).then(res => {
        res.rows.forEach((j, index) => {
          xDate.push(j.createDate);
          yDate.push(j.num)
        })
        let chartDom = document.getElementById('zyqst');
        chartDom.removeAttribute('_echarts_instance_');
        let myChart = echarts.init(chartDom);
        let option;
        option = {
          color:['#fff657'],
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['新增'],
            textStyle: {
              color: "#fff"
            }
          },
          grid: {
            top: "22%",
            bottom: "18%",
            right:"5%",
            left: "15%"
          },
          xAxis: {
            type: 'category',
            data: xDate,
            axisLabel: {
              color: "#fff"
            },
            axisLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 0.1)"
              }
            }
          },
          yAxis: {
            type: 'value',
            splitLine: {
              lineStyle: {
                color: "rgba(255, 255, 255, 0.1)"
              }
            },
            axisLabel: {
              color: "#fff"
            }
          },
          series: [
            {
              data: yDate,
              type: 'line',
              smooth: true
            }
          ]
        };
        option && myChart.setOption(option);

      })
		},
		zypqyzbChart() {
      this.piedata = []
      let total = 0;
      selectTicketByObject().then(res => {
        res.rows.forEach((j, index) => {
          var a = { value: j.num, name: j.objectName }
          total += parseInt(j.num);
          this.piedata.push(a)
        })
        let chartDom = document.getElementById('zypqyzb');
        chartDom.removeAttribute('_echarts_instance_');
        let myChart = echarts.init(chartDom);
        let option;
        let tarValue = 0;
        let _this = this;
        option = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: "vertical",
            top: "5%",
            right: "0%",
            left: "auto",
            textStyle: {
              color: "#fff"
            },
            icon: "circle",
            itemWidth: 8,
            formatter: function(name) {
              // pieData是饼图的数组数据
              let data = _this.piedata;
              for (let i = 0, l = data.length; i < l; i++) {
                if (data[i].name == name) {
                  tarValue = data[i].value;
                }
              }
              let arr = [name + '    ' + ((tarValue/total)*100).toFixed(2)+'%']
              return arr.join('')
            },
          },
          title: {
            text: total,
            subtext: "总计",
            left: "center",
            top: "center",
            itemGap: 0,
            textStyle: {
              fontSize: 20,
              color: '#fff'
            },
            subtextStyle: {
              fontSize: 12,
              color: '#fff'
            }
          },
          series: [
            {
              type: 'pie',
              radius: ['55%', '80%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: false,
                }
              },
              labelLine: {
                show: false
              },
              data: this.piedata
            }
          ]
        };
        option && myChart.setOption(option);

      })
		},
    aboutContractor(){
      aboutContractor().then(res => {
        this.contractor = res.rows[0]
      })
    },
    selectInPro(){
      selectInPro().then(res => {
        // this.inPro = res.rows[0]
        this.inproNum = 0
        res.rows.forEach((j, index) => {
          this.inproNum += Number(j.num)
          switch (j.type){
            case 'fire':
              this.inPro[0].num = j.num;
              break;
            case 'earth':
              this.inPro[1].num = j.num;
              break;
            case 'electric':
              this.inPro[2].num = j.num;
              break;
            case 'high':
              this.inPro[3].num = j.num;
              break;
            case 'hoisting':
              this.inPro[4].num = j.num;
              break;
            case 'restricted':
              this.inPro[5].num = j.num;
              break;
            case 'blind':
              this.inPro[6].num = j.num;
              break;
            case 'broken':
              this.inPro[7].num = j.num;
              break;
          }
        })
      })
    },
    selectNotInPro(){
      selectNotInPro().then(res => {
        // this.notinPro = res.rows[0]
        this.notinproNum = 0
        res.rows.forEach((j, index) => {
          this.notinproNum += Number(j.num)
        })
      })
    },
    selectTicketList(){
      selectTicketList(this.ticketParam).then(res => {
        this.ticketList = res.rows;
      })
    },
  },

}
</script>


<style scoped lang="scss">
.shuangchongyf {
  background: url("@/assets/images/scyf/scyf-bg.jpg") no-repeat;
  background-size: cover !important;
	height: calc(100vh - 84px);

	.toptitle{
		img{width: 100%;display: block;}

	  .fangda {
	    position: absolute;
	    right: 20px;
	    top: 15px;
	    font-size: 18px;
	    color: #2aa7d3;
	  }
	}
	.main{
		padding: 0 20px;
		:deep(.el-row) {
			height: 100%;
			.el-col{
				height: 100%;position: relative;
			}
		}
		.mainbox{
			.tit{
				background: url("@/assets/images/scyf/scyf-boxtit.png") no-repeat;
				background-size: 100% 100%;
				color: #fff;font-weight: bold;
				font-size: 16px;
				font-style: italic;
				padding: 5px 10px;
			}
		}
		.left{
			height: calc(100% + 10px);
			margin-top: -10px;
			background: url("@/assets/images/scyf/scyf-barbg.png") no-repeat;
			background-size: 100% 100%;
			padding: 5px 15px;
			position:relative;z-index:9;
			.leftbox1{
				height: calc(33.33% - 20px);margin: 10px 0;
				.zuoyedata{
					height: 100%;
					.zydatalf{
						height: 100%;
						.item{
							height: 50%;
							background: url("@/assets/images/scyf/scyf-yhpcpercent.png") no-repeat;
							background-size: 100% 100%;
							display: flex;
							align-items: center;
							justify-content: center;
							flex-direction: column;
							h3{
								margin: 0 0 5px;
								font-size: 24px;font-weight: bold;
								color: #00deff;
							}
							h5{
								margin: 0;
								font-size: 14px;color: #fff;
							}
						}
					}
					.zydatart{
						padding: 0 10px;height: 100%;
						:deep(.el-col) {
							height: calc(33.33% - 6px);
							margin: 3px 0;
						}
						.item{
							background: #003670;
							border-radius: 10px;overflow: hidden;
							height: 100%;
							padding: 5px 0 0;
							position: relative;
							.number{
								background: url("@/assets/images/scyf/tszy-circlebg.png") no-repeat center;
								background-size: contain;
								color: #fff;font-size: 18px;
								height: calc(100% - 28px);
								display: flex;
								align-items: center;
								justify-content: center;
								flex-direction: column;
							}
							h5{
								margin: 0;
								position: absolute;
								left: 0;bottom: 0;
								background: #1ec4ff;
								font-size: 12px;text-align: center;
								width: 100%;
								padding: 5px 0;
							}
						}
					}
				}

			}
			.leftbox2{
				height: calc(33.33% - 10px);margin: 10px 0;
				.midselect{
					position: relative;
					width: 100%;margin: 10px 0 0;
					:deep(.el-select) {
						display: block;
						.el-input__inner{
							border: 0;background: #203151;
							border-radius: 20px;
							color: #aecbe2;padding-left: 100px;
						}
					}
					.selectleft{
						position: absolute;left: 8px;top: 8px;height: 16px;
						z-index: 9;padding: 0 10px;
						color: #00c5e0;
						font-size: 14px;
						line-height: 1;
						img{
							position: absolute;right: -2px;top: 50%;
							transform: translateY(-50%);
						}
					}
				}
				:deep(.el-table) {
					margin: 10px 0 0;
					background: transparent;
					td.el-table__cell,
					th.el-table__cell.is-leaf{
						border: 0;
					}
					.el-table__header-wrapper th{
						background: transparent !important;
						color: #6bc8f6;
					}
					tr{
						background: transparent
					}
					tr td:first-child .cell{
						color: #00deff;
					}
					.el-table__header{
						background: url("@/assets/images/scyf/scyf-dttablebg.png") no-repeat;
						background-size: 100% 100%;
					}
					tr.el-table__row--striped td.el-table__cell,
					tr:hover td.el-table__cell{
						background: #122e5e;
					}
					td.el-table__cell{
						color: #bff7ff;
					}
					.el-table__inner-wrapper::before{
						display: none;
					}
					.level{
						background: url("@/assets/images/scyf/scyf-dtdjbg.png") no-repeat center;
						background-size: contain;
						color: #a2ddff;line-height: 1;
						padding: 3px 0 7px;font-size: 13px;
					}
					.gotodetail{
						color: #aecbe2;cursor: pointer;
					}
				}
			}
			.leftbox3{
				height: calc(33.33% - 10px);margin: 10px 0;
				.bukongqiu{
					height: calc(100% - 41px);margin-top: 10px;
					position: relative;
					.item{
						height: 33.33%;width: 50%;float: left;
						box-sizing: border-box;
						border-top: 1px solid #124d70;
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
						h3{
							margin: 0;font-size: 18px;font-weight: bold;
							color: #00deff;
						}
						h5{
							margin: 5px 0;
							font-size: 12px;color: #bff7ff;
						}
						.btn{
							display: inline-block;
							color: #fff;font-size: 12px;
							background: url("@/assets/images/scyf/tszy-bkqbtn.png") no-repeat center;
							background-size: 100% 100%;
							border-radius: 20px;padding: 0 10px;
							cursor: pointer;
						}
					}
					.item:nth-child(1),.item:nth-child(2){
						border-top: 0;
					}
					.item:hover{
						background: #143064;
					}
				}
				.bukongqiu:before, .bukongqiu::after{
					content: '';width: 1px;height: 100%;
					background: #124d70;
					position: absolute;left: 50%;top: 0;
				}
			}
		}
		.mid{
			height: 100%;
			position: relative;
			#cesiumContainer{
				height: 100%;position: relative;
				.cesium-viewer{
					position: absolute !important;
				}
			}
			#cesiumContainer:before{
				content: '';width: 104%;height: 100%;
				background: url("@/assets/images/scyf/mapzhezhao.png") no-repeat center;
				background-size: 100% 100%;
				position: absolute;left: -2%;top:0;
				z-index: 1;
				pointer-events: none;
			}
			.jiankongtanchu {
			  :deep(.el-dialog) {
			    background: rgb(36, 53, 71);

			    .player-content {
			      border: 1px solid rgb(9, 190, 197);
			    }
			  }
			}
			.midup{
				position: absolute;top:0;left:0;
				width: 100%;
				z-index: 9;
			}
			.midtop{
				padding: 0 30px;
				.item{
					font-size: 18px;color: #fff;
					text-shadow: 0 0 5px #0085c0;
					font-style: italic;
					background: url("@/assets/images/scyf/scyf-mid-itembg.png") no-repeat;
					background-size: 100% 100%;
					padding: 20px 0 25px;
					text-align: center;
				}
			}
			.midchoose{
				padding: 0 30px;
				.leftico{
					background: rgba(12, 36, 68, 0.8);
					padding: 5px 10px;border-radius: 5px;
					.item{
						width: 25%;float: left;text-align: center;
						border-right: 1px solid #eee;
						color: #fff;line-height: 1;
						font-size: 12px;
						img{
							height: 20px;
							vertical-align: middle;
						}

					}
					.item:last-child{
						border: 0;
					}
				}
				.leftico:before,.leftico::after{
					content: '';clear: both;display: table;
				}


			}
			.midbot{
				width: 55%;
				position: absolute;bottom:0;left: 25%;
				padding: 0 0 15px;
				background: url("@/assets/images/scyf/scyf-midbotbg.png") no-repeat bottom;
				background-size: 100%;
				.itembox{
					width: 80%;margin: 0 auto;
				}
				.item{
					text-align: center;
					width: 33.33%;float: left;
					img{
						width: 50px;
					}
					h5{
						margin: 3px 0 0;
						color: #aecbe2;
						white-space: nowrap
					}
				}
			}
			.midbot:before,.midbot::after{
				content: '';clear: both;display: table;
			}
		}
		.right{
			height: calc(100% + 10px);
			margin-top: -10px;
			background: url("@/assets/images/scyf/scyf-barbg.png") no-repeat;
			background-size: 100% 100%;
			padding: 15px;
			position:relative;z-index:9;
			.mainbox{
				margin-bottom: 10px;
				height: calc(25% - 10px);
				.timechoose{
					text-align: right;margin: 10px 0 2px;
					span{
						font-size: 12px;color: #c3e1ff;
						border: 1px solid #1c7bd1;
						padding: 2px 6px;margin-left: 5px;cursor: pointer;
					}
					span.active{
						color: #fff;background: #10447d;
					}
				}
				.zyqst{
					height: calc(100% - 60px);
					#zyqst{
						height: 100%;
					}
				}
				.zypqyzb{
					height: calc(100% - 31px);
					#zypqyzb{
						height: 100%;
						width: 120%;
						margin-left: -20%;
					}
				}
				.cbsgl{
					height: calc(100% - 31px);
					:deep(.el-col) {
						height: 50%;
					}
					.item{
						height: 100%;
						text-align: center;
						h3{
							margin: 0;
							color: #90d0f2;font-size: 20px;
							background: url("@/assets/images/scyf/tszy-cbsglbg.png") no-repeat top;
							background-size: contain;
							height: calc(100% - 20px);
							display: flex;
							align-items: center;
							justify-content: center;
							flex-direction: column;
						}
						h5{
							margin: 1px 0 0;
							font-size: 12px;color: #d8f2ff;
							white-space: nowrap;
						}
					}
				}
				.wfjl{
					height: calc(100% - 60px);
					:deep(.el-table) {
						background: transparent;
						td.el-table__cell,
						th.el-table__cell.is-leaf{
							border: 0;
						}
						.el-table__header-wrapper th{
							background: transparent !important;
							color: #6bc8f6;
						}
						tr{
							background: transparent;
						}
						.el-table__header{
							background: url("@/assets/images/scyf/scyf-dttablebg.png") no-repeat;
							background-size: 100% 100%;
						}
						tr:hover td.el-table__cell{
							background: url("@/assets/images/scyf/tszy-wfjltrbg.png") no-repeat bottom;
							background-size: 100% 100%;
						}
						td.el-table__cell{
							color: #bff7ff;font-size: 12px;
							background: url("@/assets/images/scyf/tszy-wfjltrbg.png") no-repeat bottom;
							background-size: 100% 100%;
							padding: 5px 0;
						}
						tr td:first-child{
							border-radius: 30px 0 0 30px;
						}
						tr td:last-child{
							border-radius: 0 30px 30px 0;
						}
						.cell{
							line-height: 1.2;
						}
						.el-table__inner-wrapper::before{
							display: none;
						}
					}
				}
			}

		}

	}

}

</style>




