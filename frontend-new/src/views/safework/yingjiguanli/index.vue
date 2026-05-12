<template>
  <div class="shuangchongyf">

		<div class="toptitle">
			<img src="@/assets/images/scyf/yingji-toptitle.png" @load="topimageLoaded"/>
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
						<div class="mainbox leftbox0">
							<div class="tianqitit">
								<el-row>
									<el-col :span="8">
										<img src="@/assets/images/scyf/yingji-tianqiico.png"/>
										<span>烟台市</span>
									</el-col>
									<el-col :span="16">
										<h4>23°C—32°C<span>多云</span></h4>
									</el-col>
								</el-row>
							</div>
							<div class="tianqidata">
								<el-row :gutter="10">
									<el-col :span="8">
										<div class="item item1">
											<img src="@/assets/images/scyf/yingji-tianqi1.png"/>
											<div class="tianqidatart">
												<div>空气指数</div>
												<div>优31</div>
											</div>
										</div>
									</el-col>
									<el-col :span="8">
										<div class="item item2">
											<img src="@/assets/images/scyf/yingji-tianqi2.png"/>
											<div class="tianqidatart">
												<div>湿度</div>
												<div>70%</div>
											</div>
										</div>
									</el-col>
									<el-col :span="8">
										<div class="item item3">
											<img src="@/assets/images/scyf/yingji-tianqi3.png"/>
											<div class="tianqidatart">
												<div>风速</div>
												<div>5km/h</div>
											</div>
										</div>
									</el-col>
								</el-row>
							</div>
						</div>
						<div class="mainbox leftbox1">
							<div class="tit">应急预案类型占比 </div>
							<div class="scyfyxqk">
								<el-row :gutter="2">
									<el-col :span="9">
										<div class="circle">
											<img src="@/assets/images/scyf/scyf-circle.png"/>
											<div class="fenshu">
												<div class="number">3</div>
												<h5>总计</h5>
											</div>
										</div>
									</el-col>
									<el-col :span="15">
										<div class="score">
											<div class="scorertbx">
												<el-row :gutter="30">
													<el-col :span="12">
														<el-progress type="circle" 
														:percentage="25" 
														:stroke-width="20"
														color="#27d2c8"
														>
															<template #default="{ percentage }">
																<div class="text1">{{ percentage }}%</div>
															</template>
														</el-progress>
														<h5>现场处置</h5>
													</el-col>
													<el-col :span="12">
														<el-progress type="circle" 
														:percentage="25" 
														:stroke-width="20"
														color="#00a3ff"
														>
															<template #default="{ percentage }">
																<div class="text2">{{ percentage }}%</div>
															</template>
														</el-progress>
														<h5>综合预案</h5>
													</el-col>
												</el-row>
											</div>
										</div>
									</el-col>
								</el-row>
							</div>
							<div class="yjyalxzbbot">
								<div class="btn1" @click="yjyaTanchu">
									<img src="@/assets/images/scyf/yingji-yjyaico.png"/>
									启动应急预案
								</div>
								<div class="btn2">
									液氯储槽应急预案演练方案
								</div>
							</div>
						</div>
						<div class="mainbox leftbox2">
							<div class="tit">应急队伍</div>
							<div class="search">
								<el-input v-model="unitName" placeholder="请输入风险点名称" suffix-icon="Search" type="text" @blur="seachUnit"/>
							</div>
							<ul>
								<li v-for="(item,index) in duiwuList" :key="index" @click="yjdwTanchu(item.id)">
									<el-row :gutter="10">
										<el-col :span="4">
											<div class="paiming">{{ index+1 }}</div>
										</el-col>
										<el-col :span="20">
											<h5>{{ item.teamName }}</h5>
											<span>级别：{{ item.teamLevel }}</span>
											<span style="margin-left: 15px;">负责人：{{ item.leaderStaffName }}</span>
										</el-col>
									</el-row>
								</li>
							</ul>
						</div>
						<div class="mainbox leftbox3">
							<div class="tit">应急物资</div>
							<ul>
								<li v-for="(item,index) in yjwuziList" :key="index">
									<h5>
										<img src="@/assets/images/scyf/yingji-wuziico.png"/>
										{{ item.suppliesName }}
									</h5>
									<span>所属区域：{{ item.area }}</span>
									<span style="margin-left: 15px;">存放位置：{{ item.location }}</span>
									<el-icon class="arrow" @click="yjwzTanchu"><ArrowRight /></el-icon>
								</li>
							</ul>
						</div>
					</div>
				</el-col>
				<el-col :span="18">
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
									<el-col :span="4">
										<div class="item">
											监控设备：0
										</div>
									</el-col>
									<el-col :span="4">
										<div class="item">
											进行中作业：0
										</div>
									</el-col>
									<el-col :span="4">
										<div class="item">
											应急物资：54
										</div>
									</el-col>
									<el-col :span="4">
										<div class="item">
											消防物资：166
										</div>
									</el-col>
									<el-col :span="4">
										<div class="item">
											环保物资：166
										</div>
									</el-col>
									<el-col :span="4">
										<div class="item">
											施工作业：54
										</div>
									</el-col>
								</el-row>
							</div>
							<div class="midchoose">
								<el-row>
									<el-col :span="12">
										<div class="leftico">
											<div class="item">
												<img src="@/assets/images/scyf/yingji-midico1.png" />
												监控设备
											</div>
											<div class="item">
												<img src="@/assets/images/scyf/yingji-midico2.png" />
												进行中作业
											</div>
											<div class="item">
												<img src="@/assets/images/scyf/yingji-midico3.png" />
												应急物资
											</div>
											<div class="item">
												<img src="@/assets/images/scyf/yingji-midico4.png" />
												消防物资
											</div>
											<div class="item">
												<img src="@/assets/images/scyf/yingji-midico5.png" />
												环保物资
											</div>
											<div class="item">
												<img src="@/assets/images/scyf/yingji-midico6.png" />
												施工作业
											</div>
										</div>
									</el-col>
									<el-col :span="12">
										<div class="midselect">
											<img src="@/assets/images/scyf/rydw-midbtn1.png" class="img1" />
											<img src="@/assets/images/scyf/rydw-midbtn2.png" class="img2" />
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
								</div>>
							</div>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="tanchubox">
			<el-dialog
				v-model="dialogYjwz"
				width="50%"
			>
				<div class="tit">
					<img src="@/assets/images/scyf/yingji-tanchutit.png"/>
					应急物资
				</div>
				<div class="shaixuan">
					<el-form :model="shaixuan" label-width="90px">
						<el-row>
							<el-col :span="8">
								<el-form-item label="所属区域">
									<el-select v-model="wuziQueryParams.areaId" placeholder="请选择">
                    <el-option
                        v-for="obj in objectList"
                        :key="obj.id"
                        :label="obj.name"
                        :value="obj.id">
                    </el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="物资分类">
									<el-select v-model="wuziQueryParams.suppliesTypeId" placeholder="请选择">
                    <el-option
                        v-for="obj in typeList"
                        :key="obj.id"
                        :label="obj.typeName"
                        :value="obj.id">
                    </el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="物资名称">
									<el-input v-model="wuziQueryParams.suppliesName" placeholder="请输入物资名称" />
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="存放位置">
									<el-input v-model="wuziQueryParams.location" placeholder="请输入存放位置" />
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="是否到期">
									<el-select v-model="wuziQueryParams.isValidityPeriod" placeholder="请选择">
										<el-option label="全部"/>
										<el-option label="是" value="true" />
										<el-option label="否" value="false" />
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="">
									<el-button type="primary" @click="getWuziList">查询</el-button>
								</el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</div>
				<el-table :data="yjwztableData" style="width: 100%" height="240px">
					<el-table-column prop="area" label="所属区域" width="120" />
					<el-table-column prop="suppliesTypeName" label="物资分类" width="120" />
					<el-table-column prop="suppliesName" label="物资名称" />
					<el-table-column prop="location" label="存放位置" />
					<el-table-column prop="suppliesNum" label="数量" />
					<el-table-column prop="validityPeriod" label="有效期至" width="120" />
				</el-table>
			</el-dialog>
			
			<el-dialog
				v-model="dialogYjya"
				width="50%"
			>
				<div class="tit">
					<img src="@/assets/images/scyf/yingji-tanchutit.png"/>
					启动应急预案
				</div>
				<div class="mytable">
					<table>
						<tr>
							<td colspan="2">预案名称
								<div class="mytbtit">液氯储槽应急预案演练方案</div>
							</td>
						</tr>
						<tr>
							<td>预案类别</td>
							<td>综合预案</td>
						</tr>
						<tr>
							<td>预案级别</td>
							<td>公司级</td>
						</tr>
						<tr>
							<td>适用领域</td>
							<td>安全级</td>
						</tr>
						<tr>
							<td>预案摘要</td>
							<td>
								<div class="orange">注意事项<br />预案摘对违反规定的人员，由现场管理人员请出演练现场
								演练结束后，将对违规人员进行通报批评</div>
							</td>
						</tr>
						<tr>
							<td>相关附件</td>
							<td>2022年6月液氯储槽泄露应急演练方案.pdf
								<el-icon :size="20"><Download /></el-icon>
							</td>
						</tr>
					</table>
				</div>
			</el-dialog>
			
			<el-dialog
				v-model="dialogYjdw"
				width="50%"
			>
				<div class="tit">
					<img src="@/assets/images/scyf/yingji-tanchutit.png"/>
					应急队伍
				</div>
				<div class="mytable">
					<table>
						<tr>
							<td colspan="4">队伍名称
								<div class="mytbtit">{{ teamInfo.teamName }}</div>
							</td>
						</tr>
						<tr>
							<td>队伍级别</td>
							<td colspan="3">{{teamInfo.teamLevel }}</td>
						</tr>
						<tr>
							<td>队伍负责人</td>
							<td>{{ teamInfo.leaderStaffName }}</td>
							<td>负责人部门</td>
							<td>{{ teamInfo.leaderStaffDeptName }}</td>
						</tr>
						<tr>
							<td>应急职务</td>
							<td>{{ teamInfo.emergencyJob }}</td>
							<td>电话号码</td>
							<td>{{ teamInfo.phone }}</td>
						</tr>
						<tr>
							<td>队伍描述</td>
							<td colspan="3">{{ teamInfo.remark }}</td>
						</tr>
					</table>
					<div class="teams">
						<div class="teamth">
							<el-row>
								<el-col :span="12">队员名称</el-col>
								<el-col :span="12">手机号</el-col>
							</el-row>
						</div>
						<ul>
							<li>
								<el-row v-for="item in teamInfo.team">
									<el-col :span="12">{{ item.staffName }}</el-col>
									<el-col :span="12">{{ item.phonenumber }}</el-col>
								</el-row>
							</li>
						</ul>
					</div>
				</div>
			</el-dialog>
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
import {push} from "@/api/video";
import WasmPlayer from "@easydarwin/easywasmplayer";
import {listObject} from "@/api/safework/object";
import * as echarts from '@/utils/echarts'
import {getInner, listInner} from "@/api/safework/communicate";
import {listSupplies} from "@/api/safework/supplies";
import {objectMerge} from "@/utils";
import {listType} from "@/api/safework/suppliestype";

export default {
  name: "双重预防",

  data() {
    return {
      wuziQueryParams: {
        areaId: null,
        suppliesTypeId: null,
        suppliesName: null,
        location: null,
        isValidityPeriod: null
      },
      objectList: [],
      typeList: [],
      teamInfo: {},
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
			duiwuList: [

			],
			yjwuziList: [
				{
					name: '消防战斗服',
					area: '顺丁橡胶装置',
					location: '101室'
				},{
					name: '消防战斗服',
					area: '顺丁橡胶装置',
					location: '101室'
				},{
					name: '消防战斗服',
					area: '顺丁橡胶装置',
					location: '101室'
				}
			],
			dialogYjwz: false,
			dialogYjya: false,
			dialogYjdw: false,
			shaixuan: reactive({
				area: '全部',
				sort: '全部',
				name: '',
				location: '',
				end: '全部',
			}),
			yjwztableData: [

			]
    }
  },

  watch: {},
  created() {

    listType().then(res => {
      this.typeList = res.rows
    })

    listObject().then(res => {
      this.objectList = res.rows
    })

    listInner().then(res => {
      this.duiwuList = res.rows
    })

    listSupplies().then(res => {
      this.yjwuziList = res.rows
    })
  },

  mounted: function () {
    
		setTimeout(() => {
		  
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
    objectMerge,
    getWuziList() {
      listSupplies(this.wuziQueryParams).then(res => {
        this.yjwztableData = res.rows
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
		yjwzTanchu() {
      this.shaixuan = []
      listSupplies(this.wuziQueryParams).then(res => {
        this.yjwztableData = res.rows
        this.dialogYjwz = true;
      })
    },
		yjyaTanchu() {
			this.dialogYjya = true;
		},
		yjdwTanchu(id) {
      getInner(id).then(res => {
        console.log(res)
        this.teamInfo = res.data
        this.dialogYjdw = true;
      })
		}
  },

}
</script>


<style scoped lang="scss">
.shuangchongyf {
  background: url("@/assets/images/scyf/scyf-bg.jpg") no-repeat;
  background-size: cover !important;
	height: calc(100vh - 84px);
	.tanchubox{
		:deep .el-dialog{
			background: url("@/assets/images/scyf/yingji-tanchubg.png") no-repeat;
			background-size: cover;
			.tit{
				color: #fff;font-size: 20px;
				margin: -40px 0 30px;
				img{
					vertical-align: middle;height: 20px;
					margin-right: 5px;
				}
			}
			.el-dialog__close{
				font-size: 24px;color: #4082f7;
			}
			.shaixuan{
				.el-form-item__label{
					font-size: 15px;font-weight: normal;
					color: #fff;
				}
				.el-input__inner{
					background: transparent;
					border: 1px solid #0876bb;
					color: #fff;
				}
			}
			.el-table{
				background: transparent;
				text-align: center;
				border: 1px solid #0876bb;
				th.el-table__cell{
					background: transparent !important;
					border-bottom: 1px solid #0876bb;
					color: #05a6ff;font-size: 14px;
				}
				tr, tr:hover td{
					background: transparent;
				}
				td{
					border-bottom: 1px solid #0876bb;
					color: #fff;font-size: 14px;
				}
				.el-table__inner-wrapper::before{
					display: none;
				}
			}
			.mytable{
				table{
					width: 100%;border-collapse: collapse;
					border: 1px solid #0876bb;
					tr{
						
					}
					tr td{
						border-bottom: 1px solid #0876bb;
						font-size: 14px;
						padding: 5px 15px;color: #fff;
						line-height: 2;
					}
					tr:first-child{
						background: rgba(255,255,255,.1);
					}
					tr td:nth-child(odd){
						color: #05a6ff;white-space: nowrap;
						border-left: 1px solid #0876bb;
						width: 90px;
					}
					.mytbtit{
						font-size: 18px;font-weight: bold;color: #fff;
						margin: 5px 0 0;
					}
					.orange{
						color: #ff9922;
					}
					.el-icon{
						vertical-align: middle;margin-left: 5px;
						cursor: pointer;
					}
				}
			}
			.teams{
				text-align: center;line-height: 2;
				margin: 20px 0 0;
				.teamth{
					background: #05396b;
					color: #05a6ff;
					padding: 5px 0;
				}
				ul{
					list-style: none;padding: 0;margin: 0;
					height: 160px;overflow: auto;
					li{
						color: #fff;padding: 5px;
					}
					li:nth-child(even){
						background: rgba(255,255,255,.1);
					}
				}
				ul::-webkit-scrollbar {
				  width: 5px;
				  /*滚动条宽度*/
				  height: 10px;
				  /*滚动条高度*/
				}
				
				/*定义滚动条轨道 内阴影+圆角*/
				ul::-webkit-scrollbar-track {
				  /*滚动条的背景区域的内阴影*/
				  border-radius: 10px;
				  background: #203151;
				}
				
				/*定义滑块 内阴影+圆角*/
				ul::-webkit-scrollbar-thumb {
				  border-radius: 6px;
				  background-color: rgba(255, 255, 255, 0.1);
				}
			}
		}
	}
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
		:deep .el-row{
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
			.leftbox0{
				height: 14%;
				.tianqitit{
					color: #fff;
					img{
						vertical-align: middle;
					}
					h4{
						margin: 0;font-size: 24px;font-weight: bold;
						line-height: 1;
					}
					span{
						font-size: 16px;margin-left: 10px;
						font-weight: normal;vertical-align: middle;
					}
				}
				.tianqidata{
					height: calc(100% - 47px);margin: 10px 0;
					.item{
						border-radius: 5px;
						height: 100%;
						padding: 0 10px 0 5px;
						display: flex;
						align-items: center;
						justify-content: center;
						img{
							height: 34px;
						}
						.tianqidatart{
							width: calc(100% - 34px);
							text-align: right;
							font-size: 12px;color: #fff;
							line-height: 1.8;
						}
					}
					.item1{
						background: rgba(232, 183, 113, 0.3);
					}
					.item2{
						background: rgba(45, 121, 155, 0.3);
					}
					.item3{
						background: rgba(208, 91, 92, 0.3);
					}
				}
			}
			.leftbox1{
				height: 33%;
				.scyfyxqk{
					height: calc( 50% - 10px );margin-top: 10px;
					:deep .el-col{
						position: relative;
					}
					.circle{
						position: relative;z-index: 9;
						height: 100%;
						img{
							height: 100%;display: block;margin: 0 auto;
						}
						.fenshu{
							width: 100%;height: 100%;
							position: absolute;left: 0;top: 0;
							display: flex;
							align-items: center;
							justify-content: center;
							flex-direction: column;
							.number{
								font-size: 30px;color: #fff;
							}
							h5{
								margin: 0;color: #6dd1ff;font-size: 16px
							}
						}
					}
					.score{
						height: 96%;width: 140%;
						z-index: 1;
						position: absolute;
						right: 0;top: 2%;
						background: url("@/assets/images/scyf/scyf-qingkuangbg.png") no-repeat right;
						background-size: 100% 100%;
						border-radius: 0 100px 100px 0;
						.scorertbx{
							width: 70%;margin-left: 30%;
							padding: 0 50px 0 10px;
							position: absolute;
							top: 50%;transform: translateY(-50%);
							:deep .el-progress{
								width: 100%;height: 100%;
								.el-progress-circle{
									width: 100% !important;height: 100% !important;
								}
								.el-progress-circle__track {
									stroke: rgba(175, 175, 175, 0.35);
								}
								.text1{
									color: #27d2c8;font-weight: bold;
								}
								.text2{
									color: #00a3ff;font-weight: bold;
								}
							}
							h5{
								margin: 4px 0 0;font-size: 12px;
								color: #d8f2ff;text-align: center;
							}
						}
					}
				}
				.yjyalxzbbot{
					height: calc(50% - 41px);
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					margin-top: 10px;
					.btn1{
						line-height: 35px;color: #fff;width: 100%;
						font-size: 14px;
						background: url("@/assets/images/scyf/yingji-yjyabg.png") repeat-y;
						background-size: 100% auto;
						border-radius: 20px;padding: 0 15px;
						margin: 0 0 10px;
						cursor: pointer;
						img{
							vertical-align: middle;margin-right: 10px;
						}
					}
					.btn2{
						background: url("@/assets/images/scyf/yingji-yjyabg2.png") no-repeat;
						background-size: 100% 100%;
						width: 100%;line-height: 50px;
						font-size: 13px;color: #d19b4b;
						padding-left: 65px;
						cursor: pointer;
					}
				}
			}
			.leftbox2{
				height: calc(33% - 20px);
				margin: 10px 0;overflow: hidden;
				.search{
					margin: 10px 0 0;
					:deep .el-input{
						.el-input__inner{
							border: 0;background: #203151;
							border-radius: 20px;
							color: #aecbe2;
						}
					}
				}
				ul{
					list-style: none;padding:0;margin: 0;
					height: calc(100% - 74px);
					overflow: auto;
					li{
						padding: 5px;
						background: url("@/assets/images/scyf/qlc-righttablebg.png") no-repeat;
						background-size: 100% 100%;
						cursor: pointer;
						h5{
							white-space: nowrap;text-overflow: ellipsis;overflow: hidden;
							font-size: 14px;color: #fff;
							margin: 0 0 5px;
						}
						span{
							color: #d8f2ff;
							font-size: 12px;margin: 0;
						}
						.paiming{
							text-align: center;color: #fff;font-weight: bold;
							font-size: 16px;
							background: url("@/assets/images/scyf/yingji-duiwupm.png") no-repeat center;
							background-size: auto 100%;
							margin: 5px 0 0;
							padding: 5px 0;
						}
					}
				}
				ul::-webkit-scrollbar {
				  width: 5px;
				  /*滚动条宽度*/
				  height: 10px;
				  /*滚动条高度*/
				}
				
				/*定义滚动条轨道 内阴影+圆角*/
				ul::-webkit-scrollbar-track {
				  /*滚动条的背景区域的内阴影*/
				  border-radius: 10px;
					background: #203151;
				}
				
				/*定义滑块 内阴影+圆角*/
				ul::-webkit-scrollbar-thumb {
				  border-radius: 6px;
				  background-color: rgba(255, 255, 255, 0.1);
				}
			}
			.leftbox3{
				height: 20%;
				ul{
					list-style: none;padding:0;margin: 0;
					height: calc(100% - 32px);
					overflow: auto;
					li{
						padding: 5px;
						border-bottom: 2px solid #324361;
						position: relative;
						h5{
							white-space: nowrap;text-overflow: ellipsis;overflow: hidden;
							font-size: 14px;color: #fff;
							margin: 0 0 5px;
							img{
								vertical-align: middle;
							}
						}
						span{
							color: #d8f2ff;
							font-size: 12px;margin: 0;
						}
						.arrow{
							color: #fff;background: #3c4365;
							width: 25px;height: 25px;text-align: center;
							line-height: 25px;
							position: absolute;right: 5px;
							border-radius: 50%;
							top: 50%;
							transform: translateY(-50%);
							cursor: pointer;
						}
					}
				}
				ul::-webkit-scrollbar {
				  width: 5px;
				  /*滚动条宽度*/
				  height: 10px;
				  /*滚动条高度*/
				}
				
				/*定义滚动条轨道 内阴影+圆角*/
				ul::-webkit-scrollbar-track {
				  /*滚动条的背景区域的内阴影*/
				  border-radius: 10px;
					background: #203151;
				}
				
				/*定义滑块 内阴影+圆角*/
				ul::-webkit-scrollbar-thumb {
				  border-radius: 6px;
				  background-color: rgba(255, 255, 255, 0.1);
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
						width: 16.66%;float: left;text-align: center;
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
					background: rgba(12, 36, 68, 0.8);
					padding-left: 80px;
					border-radius: 20px;
					:deep .el-select{
						.el-input__inner{
							border: 0;background: rgba(12, 36, 68, 0.8);
							color: #aecbe2;
						}
					}
					img{
						position: absolute;top: 8px;height: 16px;
						z-index: 9;padding-right: 8px;
						border-right: 1px solid #5c728d;
						cursor: pointer;
					}
					.img1{
						left: 10px;
					}
					.img2{
						left: 40px;
					}
				}

			}
			.midbot{
				width: 36.66%;
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

	}

}

</style>
