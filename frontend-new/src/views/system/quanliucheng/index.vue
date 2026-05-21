<template>
  <div class="shuangchongyf">

		<div class="toptitle">
			<img src="@/assets/images/scyf/quanliucheng-toptit.png" @load="topimageLoaded"/>
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
							<div class="item">
								<img src="@/assets/images/scyf/qlc-left1ico.png" />
								<div class="itemrt">
									<h5>人员总数</h5>
									<h4>{{contractor.pnum}}</h4>
								</div>
							</div>
							<div class="item">
								<img src="@/assets/images/scyf/qlc-left1ico.png" />
								<div class="itemrt">
									<h5>人员资质三月内到期数</h5>
									<h4>{{contractor.sannum}}</h4>
								</div>
							</div>
							<div class="item">
								<img src="@/assets/images/scyf/qlc-left1ico.png" />
								<div class="itemrt">
									<h5>人员资质已到期数</h5>
									<h4>{{contractor.gqnum}}</h4>
								</div>
							</div>
							<div class="item">
								<img src="@/assets/images/scyf/qlc-left1ico.png" />
								<div class="itemrt">
									<h5>企业证书总数</h5>
									<h4>0</h4>
								</div>
							</div>
							<div class="item">
								<img src="@/assets/images/scyf/qlc-left1ico.png" />
								<div class="itemrt">
									<h5>企业证书三月内到期数</h5>
									<h4>0</h4>
								</div>
							</div>
							<div class="item">
								<img src="@/assets/images/scyf/qlc-left1ico.png" />
								<div class="itemrt">
									<h5>企业证书已到期数</h5>
									<h4>0</h4>
								</div>
							</div>
						</div>
						<div class="mainbox leftbox2">
							<div class="tit">安全承诺公告</div>
							<h3>企业名称：{{deptName}}</h3>
							<div class="bluetit">
								<img src="@/assets/images/scyf/qlc-titico.png" width="20"/>
								企业状态
							</div>
							<ul>
								<li>
									<h5>生产装置</h5>
									<span>10套</span>
								</li>
								<li>
									<h5>停产装置</h5>
									<span>3套</span>
								</li>
								<li>
									<h5>运行装置</h5>
									<span>7套</span>
								</li>
								<li>
									<h5>检修装置</h5>
									<span>1套</span>
								</li>
								<li class="blueline"></li> <!-- 间隔行 -->
<!--								<li>-->
<!--									<h5>一级动火</h5>-->
<!--									<span>1处</span>-->
<!--								</li>-->
<!--								<li>-->
<!--									<h5>停产装置</h5>-->
<!--									<span>1处</span>-->
<!--								</li>-->
<!--								<li>-->
<!--									<h5>特级动火</h5>-->
<!--									<span>3处</span>-->
<!--								</li>-->
<!--								<li>-->
<!--									<h5>检修装置</h5>-->
<!--									<span>3处</span>-->
<!--								</li>-->
<!--								<li>-->
<!--									<h5>盲板抽堵</h5>-->
<!--									<span>7处</span>-->
<!--								</li>-->
<!--								<li>-->
<!--									<h5>高处作业</h5>-->
<!--									<span>7处</span>-->
<!--								</li>-->
<!--								<li>-->
<!--									<h5>吊装作业</h5>-->
<!--									<span>1处</span>-->
<!--								</li>-->
<!--								<li>-->
<!--									<h5>临时用电</h5>-->
<!--									<span>1处</span>-->
<!--								</li>-->
<!--								<li>-->
<!--									<h5>动土作业</h5>-->
<!--									<span>1处</span>-->
<!--								</li>-->
<!--								<li>-->
<!--									<h5>断路作业</h5>-->
<!--									<span>1处</span>-->
<!--								</li>-->
                <li v-for="item in inPro">
                  <h5>{{item.label}}</h5>
                  <span>{{item.num}}处</span>
                </li>
								<li>
									<h5>检维修作业</h5>
									<span>3处</span>
								</li>
								<li>
									<h5>是否有承包商作业</h5>
									<span>是</span>
								</li>
								<li>
									<h5>是否处在试生产期</h5>
									<span>7处</span>
								</li>
								<li>
									<h5>是否开展中（扩）试</h5>
									<span>是</span>
								</li>
								<li>
									<h5>有无重大隐患</h5>
									<span>1处</span>
								</li>
								<li>
									<h5>是否处在停车状态</h5>
									<span>是</span>
								</li>
								<li class="long">
									<h5>重大危险源储罐、管道、机泵、阀门及仪表系统是否完好无泄露</h5>
									<span>是</span>
								</li>
								<li class="long">
									<h5>重大危险源储罐的液位、温度、压力是否超限运行</h5>
									<span>是</span>
								</li>
								<li class="long">
									<h5>重大危险源可燃及有毒气体报警和联锁是否处于可靠运行状态</h5>
									<span>是</span>
								</li>
							</ul>
							<div class="bluetit">
								<img src="@/assets/images/scyf/qlc-titico.png" width="20"/>
								企业承诺
							</div>
							<div class="chengnuo">
								今天我公司已进行安全风险研判，各项安全风险防控措施已落实到位，
								我承诺所有生产装置处于安全运行状态，各负责人严格履行为危险化学
								品重大危险源安全包保责任制已全面有效落实。氯气液化、液氯储槽单
								元、液氯储罐区单位等重大危险源安全风险得到监督。
							</div>
						</div>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="mid">
						<div class="mainbox">
							<div class="tit">教育培训</div>
							<div class="midbox1">
								<div class="bluetit">
									<img src="@/assets/images/scyf/qlc-titico.png" width="20"/>
									人员培训统计
								</div>
								<div class="table">
									<el-table :data="rypxtjtableData"
										height="100%"
										style="width: 100%">
										<el-table-column label="姓名" prop="name" align="center" />
										<el-table-column label="计划课程数" prop="kechengshu" align="center" />
										<el-table-column label="计划课程完成率" prop="wanchenglv" align="center" />
										<el-table-column label="计划课程学习总时长" prop="shichang" align="center" width="130" />
										<el-table-column label="自修课程数" prop="zixiushu" align="center" />
										<el-table-column label="自修课程总时长" prop="zixiushichang" align="center" />
									</el-table>
								</div>
							</div>
							<div class="midbox2">
								<el-row :gutter="10">
									<el-col :span="12">
										<div class="bluetit">
											<img src="@/assets/images/scyf/qlc-titico.png" width="20"/>
											计划完成情况
										</div>
										<div class="jhwcqk">
											<div id="jhwcqk"></div>
											<div class="jhwcqkdata">
												<div class="item">
													<h5>承包商</h5>
													<div class="percent">24%</div>
												</div>
												<div class="item">
													<h5>访客</h5>
													<div class="percent">24%</div>
												</div>
												<div class="item">
													<h5>内部员工</h5>
													<div class="percent">24%</div>
												</div>
												<div class="item">
													<h5>内部员工</h5>
													<div class="percent">24%</div>
												</div>
											</div>
										</div>
									</el-col>
									<el-col :span="12">
										<div class="bluetit">
											<img src="@/assets/images/scyf/qlc-titico.png" width="20"/>
											课程适用对象
										</div>
										<div class="kcsydx">
											<div id="kcsydx"></div>
										</div>
									</el-col>
								</el-row>
							</div>
							<div class="midbox3">
								<el-row :gutter="10">
									<el-col :span="12">
										<div class="bluetit">
											<img src="@/assets/images/scyf/qlc-titico.png" width="20"/>
											部门计划完成情况
										</div>
										<div class="percentbox">
											<div class="item" v-for="(item, index) in bmjhwcqkList" :key="index">
												<div class="h5">{{ item.title }}</div>
												<div class="line">
													<div class="color" :style="{ width: item.percent}"></div>
												</div>
												<div class="tip">{{ item.percent }}</div>
											</div>
										</div>
									</el-col>
									<el-col :span="12">
										<div class="bluetit">
											<img src="@/assets/images/scyf/qlc-titico.png" width="20"/>
											试卷合格率
										</div>
										<div class="percentbox">
											<div class="item" v-for="(item, index) in sjhglList" :key="index">
												<div class="h5">{{ item.title }}</div>
												<div class="line">
													<div class="color" :style="{ width: item.percent}"></div>
												</div>
												<div class="tip">{{ item.percent }}</div>
											</div>
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
						<div class="mainbox rightbox1">
							<div class="tit">变更管理</div>
							<div class="bggllist">
								<div class="item" v-for="item in ChangeList">
									<h4>{{item.changeName}}</h4>
									<p>变更单位：{{item.deptName}}</p>
									<p>变更级别：{{item.changeLevelName}}</p>
									<p>变更时限：{{item.changeTimeName}}</p>
									<div class="btn">详情</div>
								</div>
<!--								<div class="item">-->
<!--									<h4>变更项目1</h4>-->
<!--									<p>变更单位：生产运控部</p>-->
<!--									<p>变更缘由：测试变更缘由</p>-->
<!--									<p>变更内容：内容变更变更</p>-->
<!--									<div class="btn">详情</div>-->
<!--								</div>-->
<!--								<div class="item">-->
<!--									<h4>变更项目1</h4>-->
<!--									<p>变更单位：生产运控部</p>-->
<!--									<p>变更缘由：测试变更缘由</p>-->
<!--									<p>变更内容：内容变更变更</p>-->
<!--									<div class="btn">详情</div>-->
<!--								</div>-->
<!--								<div class="item">-->
<!--									<h4>变更项目1</h4>-->
<!--									<p>变更单位：生产运控部</p>-->
<!--									<p>变更缘由：测试变更缘由</p>-->
<!--									<p>变更内容：内容变更变更</p>-->
<!--									<div class="btn">详情</div>-->
<!--								</div>-->
							</div>
						</div>
						<div class="rightbox2">
							<div :class="[flfgtable===true?'btn active':'btn']" @click="flfgbtn">法律法规</div>
							<div :class="[aqzdtable===true?'btn active':'btn']" @click="aqzdbtn">安全制度</div>
						</div>
						<div class="rightbox3">
							<el-table :data="flfgtableData" stripe v-if="flfgtable === true"
								height="calc(100% - 10px)"
							 style="width: 100%">
								<el-table-column label="法律法规" prop="lawName" />
								<el-table-column label="发布时间" prop="publishDate" align="center" width="80" />
                <el-table-column label="是否现行" prop="xianxing" align="center" width="60" >
                  <template #default="scope">
                    <span v-if="scope.row.activeFlag == '0'">是</span>
                    <span v-if="scope.row.activeFlag == '1'">否</span>
                  </template>
                </el-table-column>
								<el-table-column label="操作" align="center" width="50">
									<template #default="scope">
										<div class="gotodetail">详情 ›</div>
									</template>
								</el-table-column>
							</el-table>
							<el-table :data="SecurityList" stripe v-if="aqzdtable === true"
								height="calc(100% - 10px)"
							 style="width: 100%">
								<el-table-column label="安全制度" prop="sacuritySystemName" />
								<el-table-column label="发布时间" prop="publishDate" align="center" width="80" />
                <el-table-column label="状态" prop="delFlag" align="center" width="60" >
                  <template #default="scope">
                    <span class="ok" v-if="scope.row.delFlag == 0">正常</span>
                    <span class="ok" v-if="scope.row.delFlag == 1">停用</span>
                  </template>
                </el-table-column>
								<el-table-column label="操作" align="center" width="50">
									<template #default="scope">
										<div class="gotodetail">详情 ›</div>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>

  </div>
</template>

<script>

import * as echarts from '@/utils/echarts'
import { listChangeManagement } from "@/api/safework/changeManagement";
import { listSecurity } from "@/api/safework/security";
import { listLawManage } from "@/api/safework/lawManage";
import { aboutContractor } from "@/api/certificateManage/certificate";
import {selectInPro} from "@/api/safework/allticket";



export default {
  name: "全流程管理",

  data() {
    return {
      unitName:'',
      maniHt: '',
      size: 'small',
      isFullscreen: false,
			flfgtable: true,
			aqzdtable: false,
      flfgtableData: [],
			rypxtjtableData: [
				{
					name: '张丹丹',
					kechengshu: '8',
					wanchenglv: '25%',
					shichang: '30分59秒',
					zixiushu: '0',
					zixiushichang: '30分59秒'
				},{
					name: '张丹丹',
					kechengshu: '8',
					wanchenglv: '25%',
					shichang: '30分59秒',
					zixiushu: '0',
					zixiushichang: '30分59秒'
				},{
					name: '张丹丹',
					kechengshu: '8',
					wanchenglv: '25%',
					shichang: '30分59秒',
					zixiushu: '0',
					zixiushichang: '30分59秒'
				},{
					name: '张丹丹',
					kechengshu: '8',
					wanchenglv: '25%',
					shichang: '30分59秒',
					zixiushu: '0',
					zixiushichang: '30分59秒'
				}
			],
			bmjhwcqkList: [
				{
					title: '外部单位',
					percent: '20%'
				},{
					title: '氯碱中控检验工',
					percent: '50%'
				},{
					title: '工会主席',
					percent: '55%'
				},{
					title: '监护勤杂班',
					percent: '38%'
				},{
					title: '氯碱工厂',
					percent: '60%'
				},{
					title: '热电工厂',
					percent: '45%'
				}
			],
			sjhglList: [
				{
					title: 'JSA分析(JHA）',
					percent: '20%'
				},{
					title: '消防安全知识培',
					percent: '50%'
				},{
					title: '热点工厂安全月',
					percent: '55%'
				},{
					title: '内网测试使用',
					percent: '38%'
				},{
					title: '年六五环境',
					percent: '60%'
				},{
					title: '每周普法教育活',
					percent: '45%'
				}
			],
			kcdxpiedata: [
				{ value: 1048, name: 'Search Engine' },
				{ value: 735, name: 'Direct' },
				{ value: 580, name: 'Email' },
				{ value: 484, name: 'Union Ads' },
				{ value: 300, name: 'Video Ads' }
			],
      ChangeList:[],
      SecurityList:[],
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
      deptName:''
    }
  },

  watch: {},
  created() {

    const store = useStore();
    this.deptName = store.getters.user.thirdDeptName==null?store.getters.user.dept.deptName:store.getters.user.thirdDeptName
    this.getLaw()
    this.getSecurity()
    this.getChangeManagement()
    this.aboutContractor()
    this.selectInPro()
  },

  mounted: function () {

		setTimeout(() => {
			this.jhwcqkChart();
			this.kcsydxChart();

		}, 600)
  },

  methods: {

    getLaw(){
      listLawManage().then(res => {
        this.flfgtableData = res.rows
      })
    },
    getChangeManagement(){
      listChangeManagement().then(res => {
        this.ChangeList = res.rows
      })
    },

    getSecurity(){
      listSecurity().then(res => {
        this.SecurityList = res.rows
      })
    },
    aboutContractor(){
      aboutContractor().then(res => {
        this.contractor = res.rows[0]
      })
    },

    selectInPro(){
      selectInPro().then(res => {
        res.rows.forEach((j, index) => {
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
		flfgbtn() {
			this.flfgtable = true;
			this.aqzdtable = false;
		},
		aqzdbtn() {
			this.aqzdtable = true;
			this.flfgtable = false;
		},
		jhwcqkChart() {
			let chartDom = document.getElementById('jhwcqk');
			chartDom.removeAttribute('_echarts_instance_');
			let myChart = echarts.init(chartDom);
			let option;

			option = {
				tooltip: {
					trigger: 'item'
				},
				title: {
				  text: '92%',
				  subtext: "完成率",
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
			      radius: ['50%', '70%'],
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
			      data: [
			        { value: 1048, name: 'Search Engine' },
			        { value: 735, name: 'Direct' },
			        { value: 580, name: 'Email' },
			        { value: 484, name: 'Union Ads' },
			        { value: 300, name: 'Video Ads' }
			      ]
			    }
			  ]
			};
			option && myChart.setOption(option);
		},
		kcsydxChart() {
			let chartDom = document.getElementById('kcsydx');
			chartDom.removeAttribute('_echarts_instance_');
			let myChart = echarts.init(chartDom);
			let option;
			let total = 0;
			let tarValue = 0;
			let _this = this;
			this.kcdxpiedata.forEach((item, index) => {
				total = total + item.value;
			});
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
				    let data = _this.kcdxpiedata;
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
				  text: '35',
				  subtext: "课程总数",
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
			      radius: ['50%', '70%'],
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
			      data: this.kcdxpiedata,
			    }
			  ]
			};
			option && myChart.setOption(option);
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
			.bluetit{
				color: #fff;font-size: 14px;
				background: url("@/assets/images/scyf/qlc-titbg.png") repeat-x;
				background-size: auto 100%;
				padding: 10px;position: relative;
				img{
					vertical-align: middle;margin-right: 5px;
				}
			}
			.bluetit::before{
				content: '';height: 100%;width: 2px;
				background: url("@/assets/images/scyf/qlc-titdot.png") repeat-x;
				background-size: 100% 100%;
				position: absolute;left: 0;top: 0;
			}
			.bluetit::after{
				content: '';height: 100%;width: 3px;
				background: url("@/assets/images/scyf/qlc-titdot.png") repeat-x;
				background-size: 100% 100%;
				position: absolute;right: 0;top: 0;
			}
		}
		.left{
			height: calc(100% + 10px);
			margin-top: -10px;
			padding: 5px 0;
			position:relative;z-index:9;
			.leftbox1{
				height: 16%;
				width: calc(100% + 4px);margin-left: -2px;
				.item{
					height: calc(50% - 2px);float: left;
					width: calc(33.33% - 4px);margin: 0 2px;
					display: flex;
					align-items: center;
					img{
						max-width: 36%;
						max-height: 100%;
						float: left;
					}
					.itemrt{
						width: 64%;float: left;
						h5{
							margin: 0;color: #bff7ff;font-size: 12px;
							height: 24px;
						}
						h4{
							margin: 0;color: #00deff;font-size: 20px;
							font-weight: bold;
						}
					}
				}
				.item::before,.item::after{
					content: '';clear: both;display: table;
				}
			}
			.leftbox1::before,.leftbox1::after{
				content: '';clear: both;display: table;
			}
			.leftbox2{
				height: 84%;
				h3{
					font-style: italic;color: #fff;
					text-shadow: 0 0 5px #87bee1;
					font-weight: bold;font-size: 16px;
					white-space: nowrap;
					margin: 15px 0 10px;
				}
				ul{
					height: calc(( 100% - 153px ) * 0.74 - 10px );
					margin: 0 0 10px;
					padding: 0;list-style: none;
					li{
						height: calc(7.14% - 2px);margin: 0 0 2px;
						width: 50%;float: left;
						display: flex;
						align-items: center;
						background: #0d2a4a;
						h5{
							margin: 0;font-size: 12px;color: #bff7ff;
							width: 80%;float: left;
							padding-left: 15px;
						}
						span{
							display: block;width: 20%;float: left;
							font-size: 12px;color: #00deff;
							line-height: 1;
							white-space: nowrap;
						}
					}
					li.blueline{
						width: 100%;background: #09295a;
					}
					li.long{
						width: 100%;
						h5{
							width: 90%;
						}
						span{
							width: 10%;
						}
					}
				}
				.chengnuo{
					height: calc(( 100% - 153px ) * 0.26 - 10px );
					background: #0d2a4a;padding: 15px;
					font-size: 12px;color: #bff7ff;
					line-height: 1.5;
				}

			}
		}
		.mid{
			height: 100%;
			position: relative;

			.mainbox{
				height: calc(100% - 90px);
				padding: 0 10px;
				.midbox1{
					height: calc(33.33% - 15px);margin: 5px 0;
					.table{
						height: calc(100% - 40px);
						padding: 0 10px 10px;background: #0d2a4a;
					}
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
							padding: 10px 0;
						}
						tr td:first-child{
							border-radius: 30px 0 0 30px;
						}
						tr td:last-child{
							border-radius: 0 30px 30px 0;
						}
						.cell{
							line-height: 1.2;padding: 0 5px;
						}
						.el-table__inner-wrapper::before{
							display: none;
						}
					}
				}
				.midbox2{
					height: calc(33.33% - 15px);margin: 5px 0;
					.jhwcqk{
						height: calc(100% - 40px);
						background: url("@/assets/images/scyf/qlc-jhwcbg.png") no-repeat;
						background-size: 100% 100%;
						position: relative;
						#jhwcqk{
							height: 100%;
							background: url("@/assets/images/scyf/qlc-jhwcbgcircle.png") no-repeat center;
							background-size: auto 90%;
						}
						.jhwcqkdata{
							height: 100%;width: 100%;position: absolute;
							top: 0;left: 0;
							pointer-events: none;
							.item{
								height: 27%;
								width: 20%;
								position: absolute;
								display: flex;
								justify-content: center;
								flex-direction: column;
								h5{
									margin: 0 0 5px;font-size: 13px;
								}
								.percent{
									font-size: 13px;color: #fff;
								}
							}
							.item:nth-child(1){
								left: 5%;top: 5%;padding-left: 10px;
								h5{
									color: #e6bc61;
								}
							}
							.item:nth-child(2){
								right: 5%;top: 5%;text-align: right;
								padding-right: 10px;
								h5{
									color: #2bc194;
								}
							}
							.item:nth-child(3){
								left: 5%;bottom: 5%;padding-left: 10px;
								h5{
									color: #e37729;
								}
							}
							.item:nth-child(4){
								right: 5%;bottom: 5%;text-align: right;
								padding-right: 10px;
								h5{
									color: #2077e4;
								}
							}
						}
					}
					.kcsydx{
						height: calc(100% - 40px);
						background: #0d2a4a;
						#kcsydx{
							height: 100%;
							width: 140%;margin-left: -40%;
						}
					}
				}
				.midbox3{
					height: calc(33.33% - 15px);margin: 5px 0;
					.percentbox{
						height: calc(100% - 40px);
						background: #0d2a4a;
						padding: 10px 15px;
						.item{
							height: 16.66%;
							display: flex;
							align-items: center;
							.h5{
								white-space: nowrap;text-overflow: ellipsis;overflow: hidden;
								width: 30%;float: left;
								font-size: 12px;color: #bff7ff;
							}
							.line{
								width: calc(60% - 20px);float: left;
								margin: 0 10px;
								background: url("@/assets/images/scyf/qlc-percent2.png") repeat-x;
								background-size: auto 100%;
								height: 16px;
								.color{
									background: url("@/assets/images/scyf/qlc-percent1.png") repeat-x;
									background-size: auto 100%;
									height: 100%;
								}
							}
							.tip{
								width: 10%;float: left;
								color: #00deff;font-size: 12px
							}
						}
						.item::before,.item::after{
							content: '';clear: both;display: table;
						}
					}
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
			height: 100%;

			.rightbox1{
				height: calc(50% - 10px);margin: 0 0 10px;
				.bggllist{
					height: calc(100% - 36px);
					padding: 10px 10px 5px;
					background: #0d2a4a;
					margin: 5px 0 0;overflow: auto;
					.item{
						height: calc(50% - 6px);margin: 0 4px 6px;
						background: url("@/assets/images/scyf/qlc-right1itembg.png") no-repeat;
						background-size: 100% 100%;
						padding: 20px 10px;
						width: calc(50% - 8px);
						float: left;
						position: relative;
						h4{
							margin: 0 0 10px;color: #fff;
							font-size: 14px;
						}
						p{
							margin: 0 0 5px;font-size: 12px;color: #bff7ff;
							white-space: nowrap;text-overflow: ellipsis;overflow: hidden;
						}
						.btn{
							float: right;color: #fff;font-size: 12px;
							padding: 3px 12px;
							border-radius: 3px;
							background: #0a4273;
							border: 1px solid #0574b2;
							position: absolute;right: 10px;bottom: 15px;
							cursor: pointer;
						}
					}
				}
				.bggllist::before,.bggllist::after{
					content: '';clear: both;display: table;
				}
			}
			.rightbox2{
				padding: 10px 0 0;text-align: center;
				.btn{
					cursor: pointer;width: 35%;display: inline-block;
					margin: 0 8px;
					color: #fff;font-size: 14px;padding: 5px 0;
					background: url("@/assets/images/scyf/qlc-rightbtn1.png") no-repeat;
					background-size: 100% 100%;
				}
				.active{
					background: url("@/assets/images/scyf/qlc-rightbtn2.png") no-repeat;
					background-size: 100% 100%;
				}
			}
			.rightbox3{
				height: calc(50% - 55px);
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
					.el-table__header{
						background: url("@/assets/images/scyf/qlc-righttablebg.png") no-repeat;
						background-size: 100% 100%;
					}
					tr.el-table__row--striped td.el-table__cell,
					tr:hover td.el-table__cell{
						background: #122e5e;
					}
					td.el-table__cell{
						color: #bff7ff;font-size: 12px;padding: 6px 0;
					}
					.el-table__inner-wrapper::before{
						display: none;
					}
					.cell{
						line-height: 1.2;
						padding: 0 3px;
					}
					.gotodetail{
						color: #00deff;cursor: pointer;
					}
				}
			}
		}

	}

}

</style>




