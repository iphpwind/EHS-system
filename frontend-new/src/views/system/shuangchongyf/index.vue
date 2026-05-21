<template>
  <div class="shuangchongyf">

		<div class="toptitle">
			<img src="@/assets/images/scyf/scyf-toptit.png" @load="topimageLoaded"/>
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
							<div class="tit">双重预防运行情况</div>
							<div class="scyfyxqk">
								<el-row :gutter="2">
									<el-col :span="8">
										<div class="circle">
											<div class="circlebox">
												<img src="@/assets/images/scyf/scyf-circle.png"/>
											</div>
											<h5>上周风险分析<br />完成率</h5>
											<div class="fenshu">{{fxwcl}}%</div>
											<!-- <div class="percent"></div> -->
										</div>
									</el-col>
									<el-col :span="8">
										<div class="circle">
											<img src="@/assets/images/scyf/scyf-circle.png"/>
											<h5>上周运行效果</h5>
											<div class="fenshu">
												<div class="green">{{unitdata.em}}</div>
												<div>{{ unitdata.e }} </div>
											</div>
										</div>
									</el-col>
									<el-col :span="8">
										<div class="score">
											<div class="scorertbx">
												<div class="scoretit">
													<span class="green"></span>
													上周排查任务完成<br/>得分
												</div>
												<div class="fen">{{unitdata.b}}</div>
												<div class="scoretit">
													<span class="red"></span>
													隐患治理情况<br/>得分
												</div>
												<div class="fen">{{unitdata.a}}</div>
											</div>
										</div>
									</el-col>
								</el-row>
							</div>
						</div>
						<div class="mainbox leftbox2">
							<div class="tit">风险管控</div>
							<div class="data">
								<el-row>
									<el-col :span="6">
										<h3>{{ objcount }}</h3>
										<h5>分析对象</h5>
									</el-col>
									<el-col :span="6">
										<h3>{{ unitcount }}</h3>
										<h5>分析单元</h5>
									</el-col>
									<el-col :span="6">
										<h3>{{ eventcount }}</h3>
										<h5>风险事件</h5>
									</el-col>
									<el-col :span="6">
										<h3>{{ measurecount }}</h3>
										<h5>管控措施</h5>
									</el-col>
								</el-row>
							</div>
							<div class="search">
								<el-input v-model="unitName" placeholder="请输入风险点名称" suffix-icon="Search" type="text" @blur="seachUnit"/>
							</div>
							<ul>
								<li v-for="(item,index) in unitList">
									<el-row>
										<el-col :span="18">
											<h5>{{item.name}}</h5>
											<p>区域：{{ item.objectName }}</p>
										</el-col>
										<el-col :span="6">
											<div style="text-align: right;">
												<div class="fengxian red" v-if="item.riskLevel == '重大风险'">{{ item.riskLevel }}</div>
												<div class="fengxian yellow" v-if="item.riskLevel == '一般风险'">{{ item.riskLevel }}</div>
												<div class="fengxian orange" v-if="item.riskLevel == '较大风险'">{{ item.riskLevel }}</div>
												<div class="fengxian blue" v-if="item.riskLevel == '低风险'">{{ item.riskLevel }}</div>
												<div><a>详情</a></div>
											</div>
										</el-col>
									</el-row>
								</li>
<!--								<li>
									<el-row>
										<el-col :span="18">
											<h5>液氮液氮液氮液氮液氮液氮</h5>
											<p>区域：氯气区A8-01234</p>
										</el-col>
										<el-col :span="6">
											<div style="text-align: right;">
												<div class="fengxian orange">重大风险</div>
												<div><a>详情</a></div>
											</div>
										</el-col>
									</el-row>
								</li>-->
							</ul>
						</div>
						<div class="mainbox leftbox3">
							<div class="tit">动态风险</div>
							<el-table :data="dtfxtableData" stripe
								height="calc(100% - 40px)"
							 style="width: 100%"> 
								<el-table-column label="风险对象名称" prop="objectName" align="center" />
								<el-table-column label="风险等级调整" prop="value" align="center">
									<template #default="scope">
										<div class="level" v-if="scope.row.value>=0">+{{ scope.row.value }}</div>
										<div class="level" v-if="scope.row.value<0">-{{ scope.row.value }}</div>
										<div></div>
									</template>
								</el-table-column>
								<el-table-column label="操作" align="center">
									<template #default>
										<div class="gotodetail">详情</div>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="mid">
						<div id="cesiumContainer"></div>
						<div class="jiankongtanchu">
						  <el-dialog
						      width="1000px"
						      height="600px"
						      v-model="jiankongshow"
						      :before-close="handleClose"
						  >
						    <div id="videoPlayer" style="width: 100%;height: 100%"></div>
						    <!--        <video class="demo-video" ref="player" muted autoplay></video>-->
						  </el-dialog>
						</div>
						<div class="midup">
							<div class="midtop">
								<el-row>
									<el-col :span="6">
										<div class="item">
											风险点：{{unitSum}}
										</div>
									</el-col>
									<el-col :span="6">
										<div class="item">
											监控设备：0
										</div>
									</el-col>
									<el-col :span="6">
										<div class="item">
											可燃气体：54
										</div>
									</el-col>
									<el-col :span="6">
										<div class="item">
											有毒气体：166
										</div>
									</el-col>
								</el-row>
							</div>
							<div class="midchoose">
								<el-row>
									<el-col :span="12">
										<div class="leftico">
											<div class="item">
												<img src="@/assets/images/scyf/scyf-mid-ico1.png" />
												风险点
											</div>
											<div class="item">
												<img src="@/assets/images/scyf/scyf-mid-ico2.png" />
												监控设备
											</div>
											<div class="item">
												<img src="@/assets/images/scyf/scyf-mid-ico3.png" />
												可燃气体
											</div>
											<div class="item">
												<img src="@/assets/images/scyf/scyf-mid-ico4.png" />
												有毒气体
											</div>
										</div>
									</el-col>
									<el-col :span="12">
										<div class="midselect">
											<img src="@/assets/images/scyf/midselectico.png" />
											<el-select v-model="midvalue" suffix-icon="CaretTop">
												<el-option
													v-for="item in midoptions"
													:key="item.value"
													:label="item.label"
													:value="item.value"
												/>
											</el-select>
										</div>
									</el-col>
								</el-row>
							</div>
						</div>

						<div class="midbot">
							<div class="itembox">
								<div class="item">
									<img src="@/assets/images/scyf/scyf-midbot-ico1.png"/>
									<h5>现场人员定位</h5>
								</div>
								<div class="item">
									<img src="@/assets/images/scyf/scyf-midbot-ico2.png"/>
									<h5>在线检测与报警</h5>
								</div>
								<div class="item">
									<img src="@/assets/images/scyf/scyf-midbot-ico3.png"/>
									<h5>重大危险源</h5>
								</div>
								<div class="item">
									<img src="@/assets/images/scyf/scyf-midbot-ico4.png"/>
									<h5>双重预防体系</h5>
								</div>
							</div>
						</div>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="right">
						<div class="mainbox">
							<div class="tit">隐患排查任务</div>
							<div class="timechoose">
								<span :class="[yhpctab==='1'?'active':'']" @click="yxpctaskTab('1')">本月</span>
								<span :class="[yhpctab==='2'?'active':'']" @click="yxpctaskTab('2')">本周</span>
							</div>
							<div class="taskdata">
								<el-row :gutter="10">
									<el-col :span="8">
										<div class="wanchenglv">
											<span>{{ task.ratio }}%</span>
											<h5>隐患排查任务<br />完成率</h5>
										</div>
									</el-col>
									<el-col :span="4">
										<div class="item">
											<span class="blue">{{ task.total }}</span>
											<h5 class="itembg1">应排查</h5>
										</div>
									</el-col>
									<el-col :span="4">
										<div class="item">
											<span class="green">{{ task.finish }}</span>
											<h5 class="itembg2">已排查</h5>
										</div>
									</el-col>
									<el-col :span="4">
										<div class="item">
											<span class="orange">{{ task.abn }}</span>
											<h5 class="itembg3">排查异常</h5>
										</div>
									</el-col>
									<el-col :span="4">
										<div class="item">
											<span class="grey">{{ task.ot }}</span>
											<h5 class="itembg4">超期未排查</h5>
										</div>
									</el-col>
								</el-row>
							</div>
						</div>
						<div class="mainbox">
							<div class="tit">隐患排查任务情况</div>
							<div class="timechoose">
								<span :class="[taskstatus==='1'?'active':'']" @click="taskStatus('1')">近30天</span>
								<span :class="[taskstatus==='2'?'active':'']" @click="taskStatus('2')">近7天</span>
							</div>
							<div class="yhpcrwqk">
								<div id="yhpcrwqk"></div>
							</div>
						</div>
						<div class="mainbox">
							<div class="tit">隐患治理</div>
							<div class="timechoose">
								<span :class="[yhzltab==='1'?'active':'']" @click="yhzlTab('1')">本月</span>
								<span :class="[yhzltab==='2'?'active':'']" @click="yhzlTab('2')">本周</span>
							</div>
							<div class="yhzlbox">
								<el-row :gutter="10">
									<el-col :span="8">
										<div class="item">
											<el-row>
												<el-col :span="8">
													<img src="@/assets/images/scyf/scyf-yhzlico3.png"/>
												</el-col>
												<el-col :span="16">
													<div class="itemrt">
														<span>{{ hazdra.ratio }}%</span>
														<h5>隐患整改率</h5>
													</div>
												</el-col>
											</el-row>
										</div>
										<div class="item">
											<el-row>
												<el-col :span="8">
													<img src="@/assets/images/scyf/scyf-yhzlico1.png"/>
												</el-col>
												<el-col :span="16">
													<div class="itemrt">
														<span>{{yibyh}}</span>
														<h5>一般隐患数</h5>
													</div>
												</el-col>
											</el-row>
										</div>
										<div class="item">
											<el-row>
												<el-col :span="8">
													<img src="@/assets/images/scyf/scyf-yhzlico2.png"/>
												</el-col>
												<el-col :span="16">
													<div class="itemrt">
														<span>{{ zdyh }}</span>
														<h5>重大隐患数</h5>
													</div>
												</el-col>
											</el-row>
										</div>
									</el-col>
									<el-col :span="16">
										<div id="yhzlchart"></div>
									</el-col>
								</el-row>
							</div>
						</div>
						<div class="mainbox">
							<div class="tit">隐患治理趋势</div>
							<div class="timechoose">
								<span :class="[yhzlqs==='1'?'active':'']" @click="yhzlQs('1')">近30天</span>
								<span :class="[yhzlqs==='2'?'active':'']" @click="yhzlQs('2')">近7天</span>
							</div>
							<div class="yhzlqs">
								<div id="yhzlqs"></div>
							</div>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>

  </div>
</template>

<script>

import {getSafeInvestigateTaskData,getLast7DaysSafeInvestigateTaskData,getSafeHazardReportData,getLast30DaysSafeInvestigateTaskData
  ,getLast7DaysSafeHazardReportData,getLastDaysSafeHazardReportData7,getLastDaysSafeHazardReportData30,getSafeHazardReportDataByType,getHazardReportDataBySourceForEchart,getHazardReportDataByLevelForEchart,getHazardReportDataByLevelForEchart7
    ,getHazardReportDataByLevelForEchart30
} from "@/api/system/safework/index";
import {getComplistPersent,listUnit} from "@/api/safework/unit";
import {getCountInfo} from "@/api/safework/measure";
import { listObjectlevel, getObjectlevel, delObjectlevel, addObjectlevel, updateObjectlevel } from "@/api/safework/objectlevel";

import {getMapConfig} from "@/api/system/positioning";
import bjt3D from "@/utils/bjt3DMap";
import {
  getCameraByPoint,
  getModelInfo,
  getModelInfoList,
  loadHazardSource,
  selectSensorData
} from "@/api/system/hazard";
import {getImgSrc, getLayerColor, getRiskColor} from "@/utils/pointUtil";
import {findStaffByTag} from "@/api/system/positionCard";
import {push,stop} from "@/api/video";
import WasmPlayer from "@easydarwin/easywasmplayer";
import {listObject} from "@/api/safework/object";
import * as echarts from '@/utils/echarts'

export default {
  name: "双重预防",

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
      midvalue: '1',
      midoptions: [
        {
          value: '1',
          label: '动态风险',
        }, {
          value: '2',
          label: '静止风险',
        },
      ],
      fxwcl: '80',  //上周风险分析完成率
      dtfxtableData: [
        {
          objectName: '汽动给水泵',
          value: 'A',
        }, {
          objectName: '汽动给水泵',
          value: 'A',
        }, {
          objectName: '汽动给水泵',
          value: 'A',
        },
      ],
			yhpctab: '2',
			taskstatus: '2',
			yhzltab: '2',
			yhzlqs: '2',
      objcount:'',
      unitcount:'',
      eventcount:'',
      measurecount:'',
      unitList:[],
      unitSum:'',
      task:{
        total:0,
        finish:0,
        ot:0,
        abn:0,
        ratio:0
      },
      tabActive:'week',
      tabActive2:'week',
      last7DaysTaskData:{
        dtList:[],
        finish:[],
        total:[]
      },
      yibyh:'',
      zdyh:'',
      hazdra:{
        total:0,
        newTotal:0,
        tbr:0,
        ur:0,
        ot:0,
        tba:0,
        caa:0,
        ratio:0,
      },
      hazrdListvalue:[],
      hazrdListname:['新增隐患','待整改','整改中','超期未整改','待验收'],
      darwin_url: '',
      newdate: '',
      last7DaysHazardData:{
        dtList:[],
        dtList1:[],
        totalList:[],
        totalList1:[],
      },
      unitdata:[],
    }
  },

  watch: {},
  created() {
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
    this.newdate = yy + mm + dd
    this.getUnit();
    this.unitlist();
    this.getoumCount();
    this.getLevelList();
    this.getSafeInvestigateTaskData();
    this.getLast7DaysSafeInvestigateTaskData();
    this.getHazardReportDataByLevelForEchart7();
    this.getSafeHazardReportData();
    this.getLastDaysSafeHazardReportData7();
  },

  mounted: function () {
    
		setTimeout(() => {
		  this.yhpcrwqk();
			this.yhzlqschart();
			this.yhzlchart();
			
			getMapConfig().then(res => {
			  let data = res.data;
			  bjt3D.init('cesiumContainer', data.mapAddress, data, () => {
			     this.pointAndLayerLoad()
			  })
			  bjt3D.pickEntity((id) => {
			    let entity = bjt3D.getById(id)
			    if (typeof entity.polygon !== 'undefined') {
			      console.log('这是个色块')
			    } else {
			      //点击点
			      this.pickEntity(id);
			    }
			  });
			});
			
		}, 600)
  },

  methods: {

    getLastDaysSafeHazardReportData7(){
      getLastDaysSafeHazardReportData7().then(response =>{
        this.last7DaysHazardData = response.data;
        this.yhzlqschart();
      })
    },
    getLastDaysSafeHazardReportData30(){
      getLastDaysSafeHazardReportData30().then(response =>{
        this.last7DaysHazardData = response.data;
        this.yhzlqschart();
      })
    },

    getSafeHazardReportData(){
      getSafeHazardReportData(this.tabActive2).then(response =>{
        this.hazrdListname=[]
        this.hazdra = response.data;
        this.yhzlchart();
      })
    },
    getHazardReportDataByLevelForEchart(){
      getHazardReportDataByLevelForEchart30().then(response =>{
        for(let item of response.data){
          var arr = {value:item.num,name:item.name}
          if(item.name=='一般隐患'){
            this.yibyh = item.num;
          }
          if(item.name=='重大隐患'){
            this.zdyh = item.num;
          }
        }
      })
    },

    getHazardReportDataByLevelForEchart7(){
      getHazardReportDataByLevelForEchart7().then(response =>{
        for(let item of response.data){
          var arr = {value:item.num,name:item.name}
          if(item.name=='一般隐患'){
            this.yibyh = item.num;
          }
          if(item.name=='重大隐患'){
            this.zdyh = item.num;
          }
        }
      })
    },

    getLast7DaysSafeInvestigateTaskData(){
      getLast7DaysSafeInvestigateTaskData().then(response =>{
        this.last7DaysTaskData = response.data;
        this.yhpcrwqk();
      })
    },

    getLast30DaysSafeInvestigateTaskData(){
      getLast30DaysSafeInvestigateTaskData().then(response =>{
        this.last7DaysTaskData = response.data;
        this.yhpcrwqk();
      })
    },

    getSafeInvestigateTaskData(){
      getSafeInvestigateTaskData(this.tabActive).then(response =>{
        this.task = response.data
      })
    },
    getLevelList() {
      listObjectlevel().then(response => {
        this.dtfxtableData = response.rows;
      });
    },

    seachUnit(){
      listUnit({name:this.unitName,delFlag:0}).then(response => {
        this.unitList = response.rows;
      });
    },

    unitlist(){
      listUnit({delFlag:0}).then(response => {
        this.unitList = response.rows;
        this.unitSum = response.total;
      });
    },
    //获取风险对象单元事件管控措施等的统计数据
    getoumCount(){
      getCountInfo().then((res) => {
        this.objcount = res.data.objectCount
        this.measurecount = res.data.measureCount
        this.unitcount = res.data.unitCount
        this.eventcount = res.data.eventCount
      })
    },
    //获取上周风险分析完成率
    getUnit(){
      getComplistPersent().then((res) => {
        this.unitdata = res.data;
        if(parseFloat(this.unitdata.e)>=parseFloat(90)){
          this.unitdata.em = '优'
        }else if(parseFloat(this.unitdata.e)<parseFloat(90) && parseFloat(80)<=parseFloat(this.unitdata.e)){
          this.unitdata.em = '良'
        }else if(parseFloat(this.unitdata.e)<parseFloat(80) && parseFloat(70)<=parseFloat(this.unitdata.e)){
          this.unitdata.em = '中'
        }else{
          this.unitdata.em = '差'
        }

        if(res.data.zongji!=null && res.data.zongji!=0){
          this.fxwcl = ((res.data.yipaicha/res.data.zongji).toFixed(2))*100;
        }else{
          this.fxwcl = 0
        }

      })
    },
    topimageLoaded() {
      let topHt = document.querySelector('.toptitle').clientHeight + 'px';
      this.maniHt = 'calc(100% - ' + topHt + ')';
    },
    pointAndLayerLoad(type, typeId) {
      loadHazardSource(type, typeId).then((res) => {
        listObject().then(listRes => {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].modelType == 1) {
              bjt3D.pointLoad(res.data[i].id, res.data[i].modelTypeId, res.data[i].modelPosition, getImgSrc(res.data[i].modelTypeId))
            } else {
              let label = res.data[i].modelLabel
              if (res.data[i].eventUrl != '' && null != res.data[i].eventUrl) {
                label = label + ' ▶';
                bjt3D.layerLoad2(res.data[i].id, label, res.data[i].modelTypeId, res.data[i].modelPosition, getLayerColor(res.data[i].modelTypeId))
              } else {
                if (res.data[i].areaId) {
                  listRes.rows.forEach(e => {
                    if (e.id == res.data[i].areaId) {
                      bjt3D.layerLoad1(res.data[i].id, label, res.data[i].modelTypeId, res.data[i].modelPosition, getLayerColor(getRiskColor(e.riskName)))
                    }
                  })
                } else {
                  bjt3D.layerLoad1(res.data[i].id, label, res.data[i].modelTypeId, res.data[i].modelPosition, getLayerColor(res.data[i].modelTypeId))
                }
              }
            }
          }
          bjt3D.removeDefaultHandler();
        })
      })
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
    pickEntity(id) {
      this.pickId = id;
      getModelInfo(id).then(info => {
        let infoData = info.data;
        switch (infoData.modelTypeId) {
          case 9:
            getCameraByPoint(id).then(address => {
              if (address.data != null) {
                this.jiankongshow = true;
                localStorage.videourl = address.msg;
                this.darwin_url = address.msg;
                this.jiankong(address.msg , address.data)
                // this.jiankong(address.data)
              }
            })
            break
        }
      })
    },
    jiankong(darwin_url, url) {
      console.log(url)
      let time = parseInt(new Date().getTime() / 1000) + '';
      this.newtime = time;
      let geturl = 'url=' + url + '&customPath=/' + this.newdate + '/' + this.newtime + '&transType=tcp';

      this.$nextTick(() => {
        this.startVedio(darwin_url, geturl)
      })
    },
    handleClose() {
      console.log(this.videoid)
      this.jiankongshow = false;
      let url = 'id=' + this.videoid
      this.$nextTick(() => {
        this.stopVedio(url)
      })
    },
    stopVedio(url) {
      console.log(this.videourl)
      this.player.destroy(this.videourl)
      stop(this.darwin_url, url).then(res => {
        console.log(res)
      })
    },
    startVedio(darwin_url, geturl) {
      push(darwin_url, geturl).then(res => {
        console.log(res)
        this.videoid = res.data
      })
      this.videourl = darwin_url + 'record/' + this.newdate + '/' + this.newtime + '/' + this.newdate + '/out.m3u8';
      console.log(this.videourl)
      // // 实例化播放器
      this.player = new WasmPlayer(null, 'videoPlayer', this.callbackfun,{
        openAudio: false
      })
      // 调用播放
      this.player.play(this.videourl, 1)
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
		yxpctaskTab(val) {
			this.yhpctab = val;
      if (this.yhpctab == 1) {//本月
        this.tabActive='currMonth'
      }else if(this.yhpctab == 2){//本周
        this.tabActive='week'
      }
      this.getSafeInvestigateTaskData();
		},

		taskStatus(val) {
			this.taskstatus = val;
			if(this.taskstatus==1){//近30天
			  this.getLast30DaysSafeInvestigateTaskData();
      }else if(this.taskstatus==2){//近7天
			  this.getLast7DaysSafeInvestigateTaskData();
      }
		},
		yhzlTab(val) {
			this.yhzltab = val;
      if (this.yhzltab == 1) {
        this.tabActive2='currMonth'
        this.getHazardReportDataByLevelForEchart();
      }else if (this.yhzltab == 2) {
        this.tabActive2='week'
        this.getHazardReportDataByLevelForEchart7();
      }
      this.getSafeHazardReportData();
		},
		yhzlQs(val) {
			this.yhzlqs = val;
			if(this.yhzlqs == 1){
			  this.getLastDaysSafeHazardReportData30();
      }else if(this.yhzlqs == 2){
        this.getLastDaysSafeHazardReportData7();
      }
		},
		yhpcrwqk() {
			let chartDom = document.getElementById('yhpcrwqk');
      chartDom.removeAttribute('_echarts_instance_');
			let myChart = echarts.init(chartDom);
			let option;
			option = {
				tooltip: {
					trigger: "axis",
				},
				grid: {
					top: "8%",
					bottom: "18%",
					right:"5%",
					left: "15%"
				},
			  xAxis: {
			    type: 'category',
			    data: this.last7DaysTaskData.dtList,
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
			      data: this.last7DaysTaskData.total,
			      type: 'bar',
						barMaxWidth: '15',
						itemStyle: {
							borderRadius: [10, 10, 0, 0]
						},
						color:{
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [{
									offset: 0, color: '#78b1ff' // 0% 处的颜色
							}, {
									offset: 1, color: '#0d4dad' // 100% 处的颜色
							}],
							global: false // 缺省为 false
						}
			    }
			  ]
			};
			option && myChart.setOption(option);
		},
		yhzlqschart() {
			let chartDom = document.getElementById('yhzlqs');
      chartDom.removeAttribute('_echarts_instance_');
			let myChart = echarts.init(chartDom);
			let option;
			option = {
				color:['#ea5514', '#4fcddd'],
			  tooltip: {
			    trigger: 'axis'
			  },
			  legend: {
			    data: ['新增隐患', '已整改隐患'],
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
			    boundaryGap: false,
			    data: this.last7DaysHazardData.dtList,
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
			      name: '新增隐患',
			      type: 'line',
			      stack: 'Total',
			      data: this.last7DaysHazardData.totalList,
						smooth: true
			    },{
			      name: '已整改隐患',
			      type: 'line',
			      stack: 'Total',
			      data: this.last7DaysHazardData.totalList1,
						smooth: true
			    }
			  ]
			};
			option && myChart.setOption(option);
		},
		yhzlchart() {
			let chartDom = document.getElementById('yhzlchart');
      chartDom.removeAttribute('_echarts_instance_');
			let myChart = echarts.init(chartDom);
			let option;

			option = {
			  tooltip: {
			    trigger: 'axis',
			  },
			  legend: {
					show: false
				},
			  grid: {
			    left: '28%',
			    right: '6%',
			    bottom: '20%',
					top: '6%'
			  },
			  xAxis: {
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
			  yAxis: {
			    type: 'category',
			    data: this.hazrdListname,
					axisLabel: {
						color: "#fff"
					},
					axisLine: {
						lineStyle: {
							color: "rgba(255, 255, 255, 0.1)"
						}
					}
			  },
			  series: [
			    {
			      name: '2011',
			      type: 'bar',
			      data: [
							{
								value: this.hazdra.newTotal,
								itemStyle: {
									color: '#ff457e'
								}
							},{
								value: this.hazdra.tbr,
								itemStyle: {
									color: '#ffc748'
								}
							},{
								value: this.hazdra.ur,
								itemStyle: {
									color: '#19e079'
								}
							},{
								value: this.hazdra.ot,
								itemStyle: {
									color: '#3ea2ff'
								}
							},{
								value: this.hazdra.tba,
								itemStyle: {
									color: '#9c9c9c'
								}
							},
						],
						barMaxWidth: '8',
						itemStyle: {
							borderRadius: [0, 10, 10, 0]
						},
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
		}
		.left{
			height: calc(100% + 10px);
			margin-top: -10px;
			background: url("@/assets/images/scyf/scyf-barbg.png") no-repeat;
			background-size: 100% 100%;
			padding: 15px;
			position:relative;z-index:9;
			.leftbox1{
				height: 28%;
				.scyfyxqk{
					height: calc( 100% - 50px );margin-top: 15px;
					:deep(.el-col) {
						position: relative;
					}
					.circle{
						position: absolute;z-index: 9;
						top: 50%;transform: translateY(-50%);
						img{
							max-height: calc(100% - 30px);
							max-width: 100%;
						}
						h5{
							margin: 0;height: 30px;
							text-align: center;
							color: #6dd1ff;
						}
					}
					.percent{
						height: calc((100% - 30px) * 0.71);
						width: 71%;
						// background: url("@/assets/images/scyf/scyf-percentwave.png") no-repeat top center;
						// background-size: cover;
						position: absolute;
						border-radius: 50%;
						left: 14.5%;
						bottom: calc(13% + 30px);
						background: #1fcabf;
						overflow: hidden;
					}
					.fenshu{
						position: absolute;
						left: 0;top: calc((100% - 30px) * 0.5);
						transform: translateY(-50%);
						text-align: center;width: 100%;
						color: #fff;
						font-optical-sizing: 18px;
						z-index: 9;
						.green{
							color: #19e079;font-size: 20px;
						}
					}
					.score{
						height: calc(86% - 30px);width: 200%;
						z-index: 1;
						position: absolute;
						right: 0;top: 7%;
						background: url("@/assets/images/scyf/scyf-qingkuangbg.png") no-repeat right;
						background-size: 100% 100%;
						border-radius: 0 100px 100px 0;
						.scorertbx{
							width: 100%;
							position: absolute;top: 50%;
							transform: translateY(-50%);
						}
						.scoretit{
							font-size: 12px;color: #f5fcfd;
							width: 50%;margin-left: 50%;
							span{
								width: 8px;height: 8px;
								border-radius: 50%;
								vertical-align: middle;
								display: inline-block;
							}
							.red{
								background: #ff4e9b;
							}
							.green{
								background: #32b16c;
							}
						}
						.fen{
							width: 50%;margin-left: 50%;
							font-size: 13px;color: #fff;font-weight: bold;
						}
					}
				}
			}
			.leftbox2{
				height: calc(42% - 20px);
				margin: 10px 0;overflow: hidden;
				.data{
					text-align: center;
					padding: 15px 0;
					h3{
						font-size: 20px;color: #63b5e2;margin: 0;
					}
					h5{
						font-size: 14px;color: #aecbe2;margin: 5px 0 0;
					}
				}
				.search{
					:deep(.el-input) {
						.el-input__inner{
							border: 0;background: #203151;
							border-radius: 20px;
							color: #aecbe2;
						}
					}
				}
				ul{
					list-style: none;padding:0;margin: 0;
					li{
						padding: 15px;border-bottom: 1px solid #354568;
						h5{
							white-space: nowrap;text-overflow: ellipsis;overflow: hidden;
							font-size: 14px;color: #fff;
							margin: 0 0 5px;
						}
						p{
							white-space: nowrap;text-overflow: ellipsis;overflow: hidden;
							color: #aecbe2;
							font-size: 12px;margin: 0;
						}
						.fengxian{
							font-size: 12px;color: #fff;padding: 0 5px;
							border-radius: 10px;
							display: inline-block;
							margin: 0 0 4px;
						}
						.red{
							background: #ff0d0d;
						}
						.orange{
							background: #E05A00;
						}
            .yellow{
							background: #e05a00;
						}
            .blue{
              background: #5cc9ff;
            }
						a{
							color: #aecbe2;
							font-size: 12px;
							border-bottom: 1px solid #aecbe2;
						}
					}
				}
			}
			.leftbox3{
				height: 30%;
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
						background: url("@/assets/images/scyf/scyf-dttablebg.png") no-repeat;
						background-size: 100% 100%;
					}
					tr.el-table__row--striped td.el-table__cell,
					tr:hover td.el-table__cell{
						background: #122e5e;
					}
					td.el-table__cell{
						color: #fff;
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
				.midselect{
					position: relative;float: right;
					:deep(.el-select) {
						.el-input__inner{
							border: 0;background: rgba(12, 36, 68, 0.8);
							border-radius: 20px;
							color: #aecbe2;padding-left: 40px;
						}
					}
					img{
						position: absolute;left: 8px;top: 8px;height: 16px;
						z-index: 9;padding-right: 8px;
						border-right: 1px solid #5c728d;
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
					width: 25%;float: left;
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
				.taskdata{
					height: calc(100% - 60px);
					.wanchenglv{
						background: url("@/assets/images/scyf/scyf-yhpcpercent.png") no-repeat top;
						background-size: 100%;
						padding: 20px 0 0;
						text-align: center;
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
						width: calc(100% - 10px);
						span{
							font-size: 20px;color: #22f2ff;
						}
						h5{
							margin: 25px 0 0;
							font-size: 12px;color: #6dd1ff;
						}
					}
					.item{
						position: absolute;
						top: 50%;
						transform: translateY(-50%);
						width: calc(100% - 10px);
						text-align: center;
						h5{
							font-size: 12px;color: #fff;
							margin: 6px 0 0;
							padding: 5px 0;
						}
						span{
							font-size: 20px;
						}
						span.blue{
							color: #5cc9ff;
						}
						span.green{
							color: #2fc589;
						}
						span.orange{
							color: #f8a12f;
						}
						span.grey{
							color: #99a3bb;
						}
						.itembg1{
							background: url("@/assets/images/scyf/scyf-yhpcbg1.png") no-repeat center;
							background-size: 100% 100%;
						}
						.itembg2{
							background: url("@/assets/images/scyf/scyf-yhpcbg2.png") no-repeat center;
							background-size: 100% 100%;
						}
						.itembg3{
							background: url("@/assets/images/scyf/scyf-yhpcbg3.png") no-repeat center;
							background-size: 100% 100%;
						}
						.itembg4{
							background: url("@/assets/images/scyf/scyf-yhpcbg4.png") no-repeat center;
							background-size: 100% 100%;
						}
					}
				}
				.yhpcrwqk{
					height: calc(100% - 60px);
					background: url("@/assets/images/scyf/scyf-yhpctaskbg.png") no-repeat center;
					background-size: 100% 100%;
					#yhpcrwqk{
						height: 100%;
					}
				}
				.yhzlbox{
					height: calc(100% - 60px);
					.item{
						background: url("@/assets/images/scyf/scyf-yhzlbg.png") no-repeat center;
						background-size: 100% 100%;
						height: 32%;
						margin: 1.5% 0;
						padding: 5px 10px;
						.itemrt{
							position: absolute;
							top: 50%;
							transform: translateY(-50%);
							padding-left: 10px;
						}
						img{
							max-height: 100%;padding: 2px 0;
							max-width: 100%;
							position: absolute;
							top: 50%;
							transform: translateY(-50%);
						}
						span{
							font-size: 15px;font-weight: bold;
							color: #f8b62d;display: block;
							line-height: 1;
						}
						h5{
							margin: 0;
							font-size: 12px;color: #fff;
							white-space: nowrap;
							line-height: 1;
						}
					}
				}
				.yhzlqs{
					height: calc(100% - 60px);
					#yhzlqs{
						height: 100%;
					}
				}
				#yhzlchart{
					height: 100%;
					background: #12274d;
				}
			}

		}

	}

}

</style>




