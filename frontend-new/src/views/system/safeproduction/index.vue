<template>
  <div class="rydwbigscreen">
    <div class="toptitle">
      <img src="@/assets/images/scyf/rydw-toptitle.png" @load="topimageLoaded"/>
      <div class="fangda">
        <i v-if="size == 'small'" style="cursor: pointer;" @click="changeSize()">
          <img src="@/assets/images/fangda.png">
        </i>
        <i v-if="size == 'big'" style="cursor: pointer;" @click="changeSize()">
          <img src="@/assets/images/suoxiao.png">
        </i>
      </div>
    </div>
    <!-- 右上角告警 -->
    <div class="righttopbtn" v-if="iswarning" @click="warnDrawer = true">
      <!-- 有报警加class="bling" -->
      <img src="@/assets/images/scyf/righttop-btn.png" class="bling"/>
      <audio controls="controls" loop="loop" id="warnmusic" style="display: none;">
        <source src="@/assets/images/scyf/warning.mp3" type="audio/mp3"/>
        <embed src="@/assets/images/scyf/warning.mp3"/>
      </audio>
    </div>
    <div class="warnDrawer">
      <el-drawer
          v-model="warnDrawer"
          title="人员报警"
          direction="rtl"
          size="720px"
      >
        <el-form :v-model="warndrawForm">
          <el-row :gutter="10">
            <el-col :span="7">
              <el-select v-model="params.tagAlarmType">
                <el-option label="人员聚集" value="0"/>
                <el-option label="sos按键" value="1"/>
                <el-option label="超员报警" value="2"/>
                <el-option label="缺员报警" value="3"/>
                <el-option label="串岗报警" value="4"/>
                <el-option label="离岗报警" value="5"/>
                <el-option label="静止报警" value="12"/>
              </el-select>
            </el-col>
            <el-col :span="10">
              <el-button type="primary" @click="warnCheck">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-table :data="warnList" stripe
                  height="calc(100vh - 130px)"
                  style="width: 100%;margin: 15px 0 0;">
          <el-table-column label="报警时间" prop="raiseTime" align="center" width="160"/>
          <el-table-column label="报警类型" prop="tagAlarmType" align="center">
            <template #default="scope">
              <div @click="warnDetail(scope.row)" style="cursor: pointer;">
                <el-row justify="center" v-if="scope.row.tagAlarmType == 0">人员聚集</el-row>
                <el-row justify="center" v-if="scope.row.tagAlarmType == 1">sos按键</el-row>
                <el-row justify="center" v-if="scope.row.tagAlarmType == 2">超员报警</el-row>
                <el-row justify="center" v-if="scope.row.tagAlarmType == 3">缺员报警</el-row>
                <el-row justify="center" v-if="scope.row.tagAlarmType == 4">串岗报警</el-row>
                <el-row justify="center" v-if="scope.row.tagAlarmType == 5">离岗报警</el-row>
                <el-row justify="center" v-if="scope.row.tagAlarmType == 12">静止报警</el-row>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="报警录像" align="center" width="75">
            <template #default="scope">
              <div @click="gatherReplay(scope.row)">
                <el-icon style="font-size: 24px;cursor: pointer;">
                  <VideoCameraFilled/>
                </el-icon>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-drawer>
      <el-dialog
          v-model="dialogWarnDetail"
          title="报警详情"
          width="50%"
      >
        <div class="warndttit">报警D:00000</div>
        <div class="info">
          <table>
            <tr>
              <td class="tit">报警类型</td>
              <td v-if="form.tagAlarmType==0">人员聚集</td>
              <td v-if="form.tagAlarmType==1">sos按键</td>
              <td v-if="form.tagAlarmType==2">超员报警</td>
              <td v-if="form.tagAlarmType==3">缺员报警</td>
              <td v-if="form.tagAlarmType==4">串岗报警</td>
              <td v-if="form.tagAlarmType==5">离岗报警</td>
              <td v-if="form.tagAlarmType==12">静止报警</td>
              <td class="tit">报警时间</td>
              <td>{{ form.raiseTime }}</td>
            </tr>
            <tr>
              <td class="tit">报警级别</td>
              <td>{{ form.gatherType }}</td>
              <td class="tit">聚集人数</td>
              <td>{{ form.count }}</td>
            </tr>
            <tr>
              <td class="tit">报警人</td>
              <td>{{ form.staffName }}</td>
              <td class="tit">卡ID</td>
              <td>{{ form.tagId }}</td>
            </tr>
            <tr>
              <td class="tit">处理状态</td>
              <!--							<td v-if="form.state==0">未处理</td>-->
              <td v-if="form.state==2">已处理</td>
              <td v-if="form.state==1">报警结束</td>
              <td v-else>未处理</td>
            </tr>
          </table>
        </div>
        <div class="warndttit">报警详情</div>
        <el-table :data="form.cardList" stripe
                  height="240px"
                  style="width: 100%;margin: 15px 0 0;">
          <el-table-column label="姓名" prop="staffName" align="center"/>
          <el-table-column label="人员类别" prop="bjtEntityType" align="center">
            <template #default="scope">
              <el-row justify="center" v-if="scope.row.bjtEntityType == 'staff'">内部人员</el-row>
              <el-row justify="center" v-if="scope.row.bjtEntityType == 'contractor'">承包商</el-row>
              <el-row justify="center" v-if="scope.row.bjtEntityType == 'guest'">访客</el-row>
            </template>
          </el-table-column>
          <el-table-column label="定位标签" prop="tagId" align="center"/>
        </el-table>
      </el-dialog>
    </div>

    <div class="main" :style="{ height: 'calc(100% - ' + maniHt + 'px)'}">
      <el-row>
        <el-col :span="5">
          <div class="left">
            <div class="mainbox leftbox1">
              <div class="tit">人员统计</div>
              <div class="renyuantj">
                <el-row>
                  <el-col :span="6">
                    <img src="@/assets/images/scyf/rydw-rytjico.png"/>
                  </el-col>
                  <el-col :span="6">
                    <div class="item">
                      <h3>{{ countByStaffEntity.staff }}</h3>
                      <h5>员工数</h5>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="item">
                      <h3>{{ countByStaffEntity.contractor }}</h3>
                      <h5>承包商数</h5>
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <div class="item">
                      <h3>{{ countByStaffEntity.guest }}</h3>
                      <h5>访客数</h5>
                    </div>
                  </el-col>
                </el-row>
              </div>
              <div id="rytjChart"></div>
            </div>
            <div class="mainbox leftbox2">
              <div class="tit">人员查询</div>
              <div class="midselect">
                <el-input
                    v-model="rycxinput"
                    placeholder="请输入人员名称"
                    class="rycxselect"
                >
                  <template #append>
                    <el-icon :size="16" @click="renyuanSearch">
                      <Search/>
                    </el-icon>
                  </template>
                </el-input>
              </div>

              <div class="renyuanlist">
                <div class="item" v-for="item in renyuanlist">
                  <h4><span>{{ item.type }}</span>{{ item.staffName }}</h4>
                  <div class="bot" @click="clickStaffLocation(item.tagId)">
                    <img src="@/assets/images/scyf/rydw-rycxmark.png"/> 定位
                  </div>
                </div>
              </div>
            </div>
            <div class="mainbox leftbox3">
              <div class="tit">电子围栏</div>
              <el-table :data="dzwltableData" stripe
                        height="calc(100% - 41px)"
                        style="width: 100%">
                <el-table-column label="围栏名称" prop="name" align="center"/>
                <el-table-column label="人数" prop="people" align="center"/>
                <!--                <el-table-column label="车辆数" prop="cars" align="center"/>-->
              </el-table>
            </div>
          </div>
        </el-col>
        <el-col :span="14">
          <div class="mid">
            <!--图标-->
            <div class="togglebar" v-if="toolShow">
              <div @click="showImg1" class="togglebar-icon af-item">
                <img v-if="!showico1" src="@/assets/images/icon-ks-01-a.png" style="width: 2.5rem;" title="风险点"/>
                <img v-if="showico1" src="@/assets/images/icon-ks-01-ah.png" style="width: 2.5rem;" title="风险点"/>
              </div>
              <div @click="showImg2" class="togglebar-icon af-item">
                <img v-if="!showico2" src="@/assets/images/icon-ks-02-a.png" style="width: 2.5rem;" title="可燃气体"/>
                <img v-if="showico2" src="@/assets/images/icon-ks-02-ah.png" style="width: 2.5rem;" title="可燃气体"/>
              </div>
              <div @click="showImg3" class="togglebar-icon af-item">
                <img v-if="!showico3" src="@/assets/images/icon-ks-03-a.png" style="width: 2.5rem;" title="有毒气体"/>
                <img v-if="showico3" src="@/assets/images/icon-ks-03-ah.png" style="width: 2.5rem;" title="有毒气体"/>
              </div>
              <div @click="showImg4" class="togglebar-icon af-item">
                <img v-if="!showico4" src="@/assets/images/icon-ks-04-a.png" style="width: 2.5rem;" title="监控"/>
                <img v-if="showico4" src="@/assets/images/icon-ks-04-ah.png" style="width: 2.5rem;" title="监控"/>
              </div>
              <div @click="showXiaofangImg" class="togglebar-icon af-item">
                <img v-if="!showxiaofangIco" src="@/assets/images/xiaofang02.png" style="width: 2.5rem;" title="消防"/>
                <img v-if="showxiaofangIco" src="@/assets/images/xiaofang01.png" style="width: 2.5rem;" title="消防"/>
              </div>
              <div @click="showImg7" class="togglebar-icon af-item">
                <img v-if="!showico7" src="@/assets/images/huanbao02.png" style="width: 2.5rem;" title="环保"/>
                <img v-if="showico7" src="@/assets/images/huanbao01.png" style="width: 2.5rem;" title="环保"/>
              </div>
              <div @click="showPowerImg" class="togglebar-icon af-item">
                <img v-if="!showPowerIco" src="@/assets/images/power02.png" style="width: 2.5rem;" title="能源"/>
                <img v-if="showPowerIco" src="@/assets/images/power01.png" style="width: 2.5rem;" title="能源"/>
              </div>
              <div @click="showParamImg" class="togglebar-icon af-item">
                <img v-if="!showParamIco" src="@/assets/images/shebeicanshu02.png" style="width: 2.5rem;"
                     title="设备参数"/>
                <img v-if="showParamIco" src="@/assets/images/shebeicanshu01.png" style="width: 2.5rem;"
                     title="设备参数"/>
              </div>
              <div @click="showImg9" class="togglebar-icon af-item">
                <img v-if="!showico9" src="@/assets/images/icon-ks-09-a.png" style="width: 2.5rem;"
                     title="围栏或风险区域"/>
                <img v-if="showico9" src="@/assets/images/icon-ks-09-ah.png" style="width: 2.5rem;"
                     title="围栏或风险区域"/>
              </div>
              <div @click="showPositions" class="togglebar-icon af-item">
                <img v-if="!showPosition" src="@/assets/images/icon-ks-10-a.png" style="width: 2.5rem;"
                     title="人员定位"/>
                <img v-if="showPosition" src="@/assets/images/icon-ks-10-ah.png" style="width: 2.5rem;"
                     title="人员定位"/>
              </div>
              <div @click="refreshPoint" class="togglebar-icon af-item">
                <img title="刷新" src="@/assets/images/shuaxin.png" style="width: 2.5rem;">
              </div>
            </div>

            <div class="midtree" v-if="toolShow">
              <h5>围栏图层</h5>
              <el-tree :data="midtree" :props="defaultProps" @node-click="midtreeClick"/>
            </div>

            <div class="midrttpbtn" v-if="!toolShow" @click="midrttpBtn">退出回放</div>

            <div id="cesiumContainer1"></div>
            <img src="@/assets/images/warn.gif" style="width: 30px;height: 30px" id="alarmImg"/>

            <div class="midbot">
              <div class="itembox">
                <div class="item">
                  <img src="@/assets/images/scyf/scyf-midbot-ico1.png"/>
                  <h5>现场人员定位</h5>
                </div>
                <!--                <div class="item">-->
                <!--                  <img src="@/assets/images/scyf/scyf-midbot-ico2.png"/>-->
                <!--                  <h5>在线检测与报警</h5>-->
                <!--                </div>-->
                <!--                <div class="item">-->
                <!--                  <img src="@/assets/images/scyf/scyf-midbot-ico3.png"/>-->
                <!--                  <h5>重大危险源</h5>-->
                <!--                </div>-->
                <!--                <div class="item">-->
                <!--                  <img src="@/assets/images/scyf/scyf-midbot-ico4.png"/>-->
                <!--                  <h5>双重预防体系</h5>-->
                <!--                </div>-->
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="5">
          <div class="right">
            <div class="mainbox rightbox1">
              <div class="tit">人员实时告警</div>
              <div class="ryssgj">
                <div class="ryssgjleft">
                  <div class="number">
                    <img src="@/assets/images/scyf/rydw-ssgjdatabg.png"/>
                    <span>{{ currentAlarmEntity.count }}</span>
                  </div>
                  <h5>报警总数</h5>
                </div>
                <div class="ryssgjright">
                  <img src="@/assets/images/scyf/rydw-ssgjrtbg.png"/>
                  <div class="ryssgjrightdata">
                    <div class="item">
                      离岗<span>{{ currentAlarmEntity.ligang }}</span>
                    </div>
                    <div class="item">
                      缺员<span>{{ currentAlarmEntity.queyuan }}</span>
                    </div>
                    <div class="item">
                      超员<span>{{ currentAlarmEntity.chaoyuan }}</span>
                    </div>
                    <div class="item">
                      越界<span>{{ currentAlarmEntity.chuangang }}</span>
                    </div>
                    <div class="item">
                      静止<span>{{ currentAlarmEntity.jingzhi }}</span>
                    </div>
                    <div class="item">
                      SOS<span>{{ currentAlarmEntity.sos }}</span>
                    </div>
                    <div class="item">
                      聚集<span>{{ currentAlarmEntity.juji }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mainbox">
              <div class="tit">报警类别</div>
              <div class="timechoose">
                <span :class="[bjlbtab==='1'?'active':'']" @click="bjlbTab('1')">近30天</span>
                <span :class="[bjlbtab==='2'?'active':'']" @click="bjlbTab('2')">近7天</span>
              </div>
              <div class="bjlbchart">
                <div id="bjlbchart"></div>
              </div>
            </div>
            <div class="mainbox">
              <div class="tit">围栏告警趋势图</div>
              <div class="timechoose">
                <span :class="[rygjqstab==='1'?'active':'']" @click="rygjqsTab('1')">近30天</span>
                <span :class="[rygjqstab==='2'?'active':'']" @click="rygjqsTab('2')">近7天</span>
              </div>
              <div class="rygjqst">
                <div id="rygjqst"></div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="tyxq-tc">
      <el-dialog
          title="人员详情"
          v-model="showStaffInfo"
          width="680px">
        <div class="tyxq-con">
          <el-row class="tyxq-contop">
            <div class="time fl">
              <el-date-picker
                  v-model="timeLineQueryDate"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  type="datetimerange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
              </el-date-picker>
            </div>
            <div class="fl">
              <el-button type="primary" @click="timelineClick">查询轨迹</el-button>
            </div>
          </el-row>

          <el-row>
            <el-col :span="24" class="biank">
              <el-row class="yonghum">
                <el-col :span="3"><img src="@/assets/images/touxiang.jpg" style="width:50px;"></el-col>
                <el-col :span="21">
                  <div>用户名: <span> {{ timeLineStaff.staffName }} </span></div>
                  <div>岗位：{{ timeLineStaff.postNames }}</div>
                  <div>工号：{{ timeLineStaff.staffNo }}</div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row class="rydw-li">
            <el-col :span="12" class="biank">
              <el-row class="tacnr">
                <el-col :span="6" class="txt">性别</el-col>
                <el-col :span="18">
                  <span v-if="timeLineStaff.sex == 1">男</span>
                  <span v-else>女</span>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12" class="biank">
              <el-row class="tacnr">
                <el-col :span="6" class="txt">所属部门</el-col>
                <el-col :span="18">{{ timeLineStaff.deptName }}</el-col>
              </el-row>
            </el-col>
            <el-col :span="12" class="biank">
              <el-row class="tacnr">
                <el-col :span="6" class="txt">手机号</el-col>
                <el-col :span="18">{{ timeLineStaff.phonenumber }}</el-col>
              </el-row>
            </el-col>
            <el-col :span="12" class="biank">
              <el-row class="tacnr">
                <el-col :span="6" class="txt">定位卡ID</el-col>
                <el-col :span="18">{{ timeLineStaff.tagId }}</el-col>
              </el-row>
            </el-col>
          </el-row>

          <!-- 新增表格 -->
          <el-table :data="newtableData" style="width: 100%" height="150">
            <el-table-column prop="date" label="Date" width="180"/>
            <el-table-column prop="name" label="Name" width="180"/>
            <el-table-column prop="address" label="Address"/>
          </el-table>

          <el-table :data="newtableData" style="width: 100%" height="150">
            <el-table-column prop="date" label="Date" width="180"/>
            <el-table-column prop="name" label="Name" width="180"/>
            <el-table-column prop="address" label="Address"/>
          </el-table>

        </div>
      </el-dialog>
    </div>
    <!--时间轴-->
    <div class="af-item  time-bg" v-if="showTimeLine">
      <div class="timeline">
        <div class="my-slider__tooltip" :style="style">
          <el-button
              class="my-slider__tooltip-wrapper"
              size="mini"
          >
            {{ sliderstr }}
          </el-button>
        </div>
        <el-slider
            v-model="timeLineSelection"
            :show-stops="false"
            ref="timeLine1"
            :show-tooltip="false"
            :max="timeLineMaxLength"
            :format-tooltip="formatToolTip">
        </el-slider>

      </div>
      <!-- 时间轴end-->
      <div class="return" @click="closeTimeLine">
        <img src="@/assets/images/return.png" style="width:25px;">
      </div>
    </div>

    <div>
      <div style="display: inline-block" v-for="item in childrens">
        <button @click="modelFilter(item)">{{ item.name }}</button>
      </div>
    </div>

    <div class="nronglist" v-if="this.shownrong === true">
      <div class="nronglistcon">
        <div class="closebtn" @click="closePopup">X</div>
        <el-row class="nronglistli" v-for="item in measuringPointList">
          <el-col :span="12">
            <div>{{ item.name }}</div>
          </el-col>
          <el-col :span="12">
            <div class="text-align-r cursor">实时值：{{ item.data }}&nbsp;&nbsp;
              <a style="color: dodgerblue" @click="openxq(item.no)">详情</a>
            </div>
          </el-col>
        </el-row>

        <div class="empty-con" v-if="measuringPointList.length===0">
          <el-empty description="暂无数据" :image-size="80" :src="stateImg"></el-empty>
        </div>

      </div>
    </div>

    <div class="smalltanchu" id="smalltanchuid" v-if="this.smallTanchu === true">
      <!--			<div class="smclose" @click="this.smallTanchu = false">-->
      <!--				<el-icon><Close /></el-icon>-->
      <!--			</div>-->
      <div class="item" v-for="item in measuringCheckList" @click="pickThis(item)">
        <div style="cursor:pointer;">
          <img :src="item.img"/>
          <h5> {{ item.label }} </h5>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import jquery from "jquery";
import {
  getImgSrc,
  getLayerColor,
  positionImg,
  getRiskColor,
  contractorImg,
  guestImg,
  positionSelectImg, guestSelectImg, contractorSelectImg
} from '@/utils/pointUtil'
import {
  loadHazardSource,
  getCameraByPoint,
  selectSensorData,
  getMeasuringInfo,
  getModelInfo,
  getModelInfoList
} from '@/api/system/hazard'
import {
  timeLine,
  key,
  getMapConfig,
  getChildrenMapConfig,
  lastLocation,
  lastLocationByDept,
  staffCountByEnclosure,
  countByStaff
} from '@/api/system/positioning'
import {findStaffByTag, getCardByTagId} from '@/api/system/positionCard'
import {websocketCommand} from "@/utils/websocket";
import {listObject} from '@/api/safework/object'
import {listChildrenMap} from '@/api/safework/childrenmap'
import noneStateImg from '@/assets/images/zanwu.png';
import * as echarts from '@/utils/echarts'
import {currentAlarm, alarmHistory30, alarmHistory7, alarmTrend7, alarmTrend30} from "@/api/safework/zyalarm";
import {getAreaTree, listEnclosure, selectZyEnclosureByZyAreaId} from "@/api/system/enclosure";
import Bjt3DClass from "@/utils/Bjt3DClass";
import {getAlarm, listAlarm} from "../../../api/safework/zyalarm";
import axios from "axios";
import {listGatherConfig} from "@/api/positioning/mapconfig";
import {timeLineByAlarmId} from "../../../api/system/positioning";

export default {
  name: "safeproduction",
  data() {
    return {
      heatmapLoad: null,
      form: {},
      params: {
        tagAlarmType: null
      },
      alarmPointList: [],
      bjt3D: null,
      unitName: '',
      maniHt: '',
      size: 'small',
      videourl: '',
      player: '',
      videoid: '',
      newtime: '',
      jiankongshow: false,
      isFullscreen: false,
      rycxselect: '1',
      rycxinput: '',

      bjlbtab: '2',
      rygjqstab: '2',
      yhzlqstab: '2',
      dzwltableData: [],
      childrens: [],
      measuringCheckList: [],
      measuringPointList: [],
      stateImg: noneStateImg,
      renyuanlist: [],
      renyuanlistback: [],
      loadTimer: null,
      shownrong: false,
      wsObj: null,
      pickId: null,
      showStaffInfo: false,
      newtableData: [
        {
          date: '2016-05-03',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-02',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-04',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
        {
          date: '2016-05-01',
          name: 'Tom',
          address: 'No. 189, Grove St, Los Angeles',
        },
      ],
      showTimeLine: false,
      timeLineQueryDate: [],
      timeLineData: null,
      timeLineMaxLength: 0,
      timeLineSelection: 0,
      timer: null,
      showico1: false,
      showico2: false,
      countByStaffEntity: {staff: 0, contractor: 0, guest: 0},
      showico3: false,
      showico4: false,
      showico7: false,
      showico9: false,
      showxiaofangIco: false,
      showPowerIco: false,
      showParamIco: false,
      showPosition: false,
      timeLineStaff: {
        staffName: null,
        staffNo: null,
        sex: null,
        deptName: null,
        phonenumber: null,
        tagId: null,
        postNames: null
      },
      sliderstr: '',
      style: {
        paddingLeft: '0%'
      },
      charData: null,
      smallTanchu: false,
      currentAlarmEntity: {
        count: 0,
        ligang: 0,
        chuangang: 0,
        chaoyuan: 0,
        jingzhi: 0,
        queyuan: 0,
        sos: 0,
        juji: 0
      },
      alarmHistoryList: [],
      alarmTrendNameList: [],
      alarmTrendList: [],
      alarmTrendHandleList: [],
      defaultProps: {
        children: 'children',
        label: 'label',
        areaId: 'areaId'
      },
      midtree: [
        {
          areaId: 1,
          label: '总图',
          children: []
        }
      ],
      warnDrawer: false,
      warndrawForm: reactive({
        type1: '全部',
        type2: '全部',
      }),
      warnList: [],
      warnDetailTable: [
        {
          name: '张三三',
          type: '员工',
          danwei: '生产科',
          post: '乙快充装工',
          tag: '6565'
        }, {
          name: '张三三',
          type: '员工',
          danwei: '生产科',
          post: '乙快充装工',
          tag: '6565'
        }, {
          name: '张三三',
          type: '员工',
          danwei: '生产科',
          post: '乙快充装工',
          tag: '6565'
        }, {
          name: '张三三',
          type: '员工',
          danwei: '生产科',
          post: '乙快充装工',
          tag: '6565'
        }, {
          name: '张三三',
          type: '员工',
          danwei: '生产科',
          post: '乙快充装工',
          tag: '6565'
        }
      ],
      dialogWarnDetail: false,
      iswarning: true,
      toolShow: true,
    }
  },
  mounted() {
    getAreaTree().then(res => {
      if (200 === res.code) {
        this.midtree[0].children = res.data
      } else {

      }
    })
    this.bjlbTab('2')
    this.rygjqsTab('2');
    currentAlarm().then(res => {
      console.log(res)
      this.currentAlarmEntity.ligang = res.data['ligang'] == null ? 0 : res.data['ligang']
      this.currentAlarmEntity.chuangang = res.data['chuangang'] == null ? 0 : res.data['chuangang']
      this.currentAlarmEntity.chaoyuan = res.data['chaoyuan'] == null ? 0 : res.data['chaoyuan']
      this.currentAlarmEntity.jingzhi = res.data['jingzhi'] == null ? 0 : res.data['jingzhi']
      this.currentAlarmEntity.queyuan = res.data['queyuan'] == null ? 0 : res.data['queyuan']
      this.currentAlarmEntity.sos = res.data['sos'] == null ? 0 : res.data['sos']
      this.currentAlarmEntity.juji = res.data['gather'] == null ? 0 : res.data['gather']
      this.currentAlarmEntity.count = this.currentAlarmEntity.ligang
          + this.currentAlarmEntity.chuangang
          + this.currentAlarmEntity.chaoyuan
          + this.currentAlarmEntity.jingzhi
          + this.currentAlarmEntity.queyuan
          + this.currentAlarmEntity.sos
          + this.currentAlarmEntity.juji
    })
    listEnclosure().then(res => {
      res.rows.forEach(item => {
        this.dzwltableData.push({
          name: item.name,
          people: item.tagNumbers
        })
      })
    })
    // countByStaff().then(res => {
    //   if (null != res.data.staff) {
    //     this.countByStaffEntity.staff = res.data.staff
    //   }
    //   if (null != res.data.constructor) {
    //     this.countByStaffEntity.constructor = res.data.constructor
    //   }
    //   if (null != res.data.guest) {
    //     this.countByStaffEntity.guest = res.data.guest
    //   }
    //
    // })
    let that = this
    jquery('#cesiumContainer1').html('')
    jquery(document.getElementById('cesiumContainer1')).on('click', function (e) {
      let x = e.offsetX;
      let y = e.offsetY;
      this.smallTanchu = false
      this.dataTanchu = false
      setTimeout(() => {
        if (that.smallTanchu) {
          jquery('.smalltanchu').css({'left': 'calc(20.83% + ' + x + 'px)', 'top': that.maniHt - 30 + y + 'px'});
        }
        if (that.shownrong) {
          jquery('.nronglist').css({'left': x + 'px', 'top': y + 'px'});
        }
      }, 100)

    });

    getMapConfig().then(res => {
      let data = res.data;
      if (null != data.vueComponent && data.vueComponent !== '') {
        this.type = data.vueComponent;
      }
      this.bjt3D = new Bjt3DClass();
      this.bjt3D.init('cesiumContainer1', data.mapAddress, data, () => {
        this.pointAndLayerLoad()
        this.startSocket();
        this.heatmapGather();
        this.loadLastLocationTimer()
        setTimeout(() => {
          this.bjlbChart();
          this.rygjqstChart();
        }, 1000);

      })
      this.bjt3D.pickMultipleEntity((ids) => {
        ids = ids.filter(item => typeof item === 'string' && item.indexOf('BTT') !== -1)
        this.smallTanchu = false
        if (ids.length === 1) {
          let id = ids[0]
          let entity = this.bjt3D.getById(id)
          if (typeof entity.polygon !== 'undefined') {
            //点击色块
            getModelInfo(id).then(res => {
              if (res.data.eventUrl != null) {
                this.poppage(res.data.eventUrl)
              }
            })
          } else {
            //点击点
            this.pickEntity(id);
          }
        } else if (ids.length > 1) {
          this.smallTanchu = true;
          this.measuringCheckList = []
          getModelInfoList(ids).then(res => {
            this.measuringCheckList = res.data
            res.data.forEach(item => {
              item.img = getImgSrc(item.typeId)
            })
          })
        } else {
          this.closePopup()
          this.smallTanchu = false;
        }
      });
    });

    this.alarmList();

    this.alarmTimer = setInterval(() => {
      this.getDeptAlarm();
    }, 10000)

  },

  unmounted() {
    clearInterval(this.alarmTimer)
  },

  methods: {
    musicplay() {
      console.log('播放声音');
      let music = document.getElementById('warnmusic')
      music.play()
    },
    midtreeClick(data) {
      this.bjt3D.layRemoveByType(109)
      selectZyEnclosureByZyAreaId(data.areaId).then(res => {
        res.data.forEach(item => {
          if (null != item.polygonPoint) {
            this.bjt3D.layerLoad1(item.modelId, item.name, 109, item.polygonPoint, getLayerColor(109))
          }
        })
      })
    },
    getTimeNow() {
      //当前年月日时分秒
      let yy = new Date().getFullYear();
      let mm = (new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
      let dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
      let hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours();
      let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
      let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();

      this.timeLineQueryDate[1] = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss;

      let thirtyminuts = new Date().getTime() - 30 * 60 * 1000;

      let date = new Date(parseInt(thirtyminuts));
      let Year = date.getFullYear();
      let Moth = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      let Day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
      let Hour = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
      let Minute = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
      let Sechond = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
      this.timeLineQueryDate[0] = Year + '-' + Moth + '-' + Day + ' ' + Hour + ':' + Minute + ':' + Sechond;
    },
    renyuanSearch() {
      if (this.rycxinput !== '' && this.rycxinput !== null) {
        this.renyuanlist = this.renyuanlistback.filter(item => item.staffName.indexOf(this.rycxinput) > -1)
      } else {
        this.renyuanlist = []
        this.renyuanlistback = []
        lastLocationByDept().then(res => {
          res.data.forEach(item => {
            if (null != item) {
              getCardByTagId(item.tagId).then(card => {
                let img = null
                let str = ''
                if (card.data.bjtEntityType == 'staff') {
                  str = '内部员工'
                  img = positionImg()
                } else if (card.data.bjtEntityType == 'contractor') {
                  str = '承包商'
                  img = contractorImg()
                } else if (card.data.bjtEntityType == 'guest') {
                  str = '访客'
                  img = guestImg()
                }
                this.renyuanlist.push({
                  staffName: card.data.staffName,
                  type: str,
                  tagId: item.tagId,
                  img: img
                })
                this.renyuanlistback.push({
                  staffName: card.data.staffName,
                  type: str,
                  tagId: item.tagId,
                  img: img
                })
              })
            }
          })
        })
      }
    },
    topimageLoaded() {
      this.maniHt = document.querySelector('.toptitle').clientHeight;

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
    clickStaffLocation(tagId) {
      for (let index in this.renyuanlist) {
        if (this.renyuanlist[index].tagId == tagId) {
          this.bjt3D.viewer.entities.getById(tagId).billboard.image = this.renyuanlist[index].selectImg
          continue
        }
        this.bjt3D.viewer.entities.getById(this.renyuanlist[index].tagId).billboard.image = this.renyuanlist[index].img
      }
    },
    changeSize() {
      this.toggleScreen()
      if (this.size == 'small') {
        this.size = 'big'
        document.querySelector('.sidebar-container').style = "width:0!important";
        document.querySelector('.main-container').style = "margin-left:0!important";
        document.querySelector('.app-main').style.minHeight = '100vh';
        document.querySelector('.rydwbigscreen').style.minHeight = '100vh';
        document.querySelector('.navbar').style.display = 'none';
        document.querySelector('.tags-view-container').style.display = 'none';
        document.querySelector('.hit').style.height = 'calc(100vh - 60px)';

      } else if (this.size == 'big') {
        this.size = 'small'
        document.querySelector('.sidebar-container').style.width = "";
        document.querySelector('.main-container').style.marginLeft = "";
        document.querySelector('.navbar').style.display = 'block';
        document.querySelector('.app-main').style.minHeight = 'calc(100vh - 84px)';
        document.querySelector('.rydwbigscreen').style.minHeight = 'calc(100vh - 84px)';
        document.querySelector('.tags-view-container').style.display = 'block'
        document.querySelector('.hit').style.height = '100%';
      }
    },
    bjlbTab(val) {
      jquery('#bjlbchart').html('')
      this.alarmHistoryList = []
      if (val == '2') {
        alarmHistory7().then(res => {
          this.alarmHistoryList.push(res.data['ligang'] == null ? 0 : res.data['ligang'])
          this.alarmHistoryList.push(res.data['chaoyuan'] == null ? 0 : res.data['chaoyuan'])
          this.alarmHistoryList.push(res.data['queyuan'] == null ? 0 : res.data['queyuan'])
          this.alarmHistoryList.push(res.data['chuangang'] == null ? 0 : res.data['chuangang'])
          this.alarmHistoryList.push(res.data['jingzhi'] == null ? 0 : res.data['jingzhi'])
          this.alarmHistoryList.push(res.data['sos'] == null ? 0 : res.data['sos'])
          this.alarmHistoryList.push(res.data['gather'] == null ? 0 : res.data['gather'])
          this.bjlbtab = val;
          this.bjlbChart();
        })
      } else {
        alarmHistory30().then(res => {
          this.alarmHistoryList.push(res.data['ligang'] == null ? 0 : res.data['ligang'])
          this.alarmHistoryList.push(res.data['chaoyuan'] == null ? 0 : res.data['chaoyuan'])
          this.alarmHistoryList.push(res.data['queyuan'] == null ? 0 : res.data['queyuan'])
          this.alarmHistoryList.push(res.data['chuangang'] == null ? 0 : res.data['chuangang'])
          this.alarmHistoryList.push(res.data['jingzhi'] == null ? 0 : res.data['jingzhi'])
          this.alarmHistoryList.push(res.data['sos'] == null ? 0 : res.data['sos'])
          this.alarmHistoryList.push(res.data['gather'] == null ? 0 : res.data['gather'])
          this.bjlbtab = val;
          this.bjlbChart();
        })
      }
    },
    rygjqsTab(val) {
      this.alarmTrendNameList = []
      this.alarmTrendList = []
      this.alarmTrendHandleList = []
      this.rygjqstab = val;
      if ('1' === val) {
        alarmTrend30().then(res => {
          for (let key in res.data.alarm) {
            this.alarmTrendNameList.push(key)
            this.alarmTrendList.push(res.data.alarm[key])
            this.alarmTrendHandleList.push(res.data.handle[key])
          }
          this.rygjqstChart();
        })
      } else {
        alarmTrend7().then(res => {
          for (let key in res.data.alarm) {
            this.alarmTrendNameList.push(key)
            this.alarmTrendList.push(res.data.alarm[key])
            this.alarmTrendHandleList.push(res.data.handle[key])
          }
          this.rygjqstChart();
        })
      }
    },
    yhzlqsTab(val) {
      this.yhzlqstab = val;
    },

    rytjChart() {
      let chartDom = document.getElementById('rytjChart');
      chartDom.removeAttribute('_echarts_instance_');
      let myChart = echarts.init(chartDom);
      let option;

      option = {
        tooltip: {
          trigger: 'item'
        },
        color: ['#5ba3ed', '#ffbb2e'],
        series: [
          {
            type: 'pie',
            radius: ['50%', '70%'],
            label: {
              formatter: '{b}\n{d}%',
            },
            data: this.charData,
            startAngle: 140,
            animation: false,
          }
        ]
      };
      option && myChart.setOption(option);
    },

    bjlbChart() {
      let chartDom = document.getElementById('bjlbchart');
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
          right: "5%",
          left: "15%"
        },
        xAxis: {
          type: 'category',
          data: ['离岗', '超员', '缺员', '越界', '静止', 'sos', '聚集'],
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
            data: this.alarmHistoryList,
            type: 'bar',
            barMaxWidth: '15',
            itemStyle: {
              borderRadius: [10, 10, 0, 0]
            },
            color: {
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
    rygjqstChart() {
      jquery('#rygjqst').html('')
      let chartDom = document.getElementById('rygjqst');
      chartDom.removeAttribute('_echarts_instance_');
      let myChart = echarts.init(chartDom);
      let option;
      option = {
        color: ['#fff100', '#32b16c'],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['报警数', '已处理'],
          textStyle: {
            color: "#fff"
          },
          left: "0%",
          top: "6%"
        },
        grid: {
          top: "28%",
          bottom: "18%",
          right: "7%",
          left: "15%"
        },
        xAxis: {
          type: 'category',
          data: this.alarmTrendNameList,
          axisLabel: {
            color: "#fff",
            interval: 0,
            rotate: -30
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
            name: '报警数',
            type: 'line',
            data: this.alarmTrendList,
            smooth: true
          }, {
            name: '已处理',
            type: 'line',
            data: this.alarmTrendList,
            smooth: true
          }
        ]
      };
      option && myChart.setOption(option);
    },
    pickThis(item) {
      this.getTimeNow();
      this.smallTanchu = false
      let x = jquery('.smalltanchu').css('left');
      let y = jquery('.smalltanchu').css('top')
      setTimeout(() => {
        if (this.shownrong) {
          jquery('.nronglist').css({'left': x, 'top': y});
        }
      }, 100)
      this.pickEntity(item.id)
      this.showStaffInfo = true;
    },
    closePopup: function () {
      this.shownrong = false;
    },
    loadLastLocationTimer() {
      this.loadTagLastLocation()
      this.loadTimer = setInterval(() => {
        this.loadTagLastLocation()
      }, 3000)
    },
    positionFilter(filter) {
      let positions = this.bjt3D.positionPoints;
      if (filter) {
        this.stopSocket()
        clearInterval(this.loadTimer)
        clearInterval(this.heatmapLoad)
        this.bjt3D.removeHeatmap()
        for (let i = 0; i < positions.length; i++) {
          this.bjt3D.remove(positions[i], null)
        }
      } else {
        this.loadLastLocationTimer()
        this.startSocket()
        this.heatmapGather()
      }
    },
    pointFilter(filter, typeId) {
      let typePoints = this.bjt3D.typePoints.get(parseInt(typeId));
      if (filter) {
        if (typePoints) {
          for (let i = 0; i < typePoints.length; i++) {
            this.bjt3D.remove(typePoints[i], null)
          }
        }
      } else {
        this.pointAndLayerLoad(1, typeId)
      }
    },
    layerFilter(filter) {
      if (filter) {
        let keys = this.bjt3D.typeLayers.keys();
        for (let i = 0; i < this.bjt3D.typeLayers.size; i++) {
          let typeLayer = this.bjt3D.typeLayers.get(parseInt(keys.next().value));
          if (typeLayer) {
            for (let i = 0; i < typeLayer.length; i++) {
              this.bjt3D.remove(typeLayer[i], null)
            }
          }
        }
      } else {
        this.pointAndLayerLoad(2, undefined)
      }
    },
    showPositions() {
      this.showPosition = !this.showPosition;
      this.positionFilter(this.showPosition)
    },
    showImg1() {
      this.showico1 = !this.showico1;
      this.pointFilter(this.showico1, 1);
    },
    showImg2() {
      this.showico2 = !this.showico2;
      this.pointFilter(this.showico2, 3);
    },
    showImg3() {
      this.showico3 = !this.showico3;
      this.pointFilter(this.showico3, 7);
    },
    showParamImg() {
      this.showParamIco = !this.showParamIco;
      this.pointFilter(this.showParamIco, 12);
    },
    showImg4() {
      this.showico4 = !this.showico4;
      this.pointFilter(this.showico4, 9);
    },
    showImg7() {
      this.showico7 = !this.showico7;
      this.pointFilter(this.showico7, 5);
    },
    showImg9(type) {
      this.showico9 = !this.showico9;
      this.layerFilter(this.showico9);
    },
    showXiaofangImg() {
      this.showxiaofangIco = !this.showxiaofangIco;
      this.pointFilter(this.showxiaofangIco, 8);
    },
    showPowerImg() {
      this.showPowerIco = !this.showPowerIco;
      this.pointFilter(this.showPowerIco, 4);
    },
    unique(arr) {
      const res = new Map();
      return arr.filter((a) => !res.has(a) && res.set(a, 1))
    },
    loadTagLastLocation() {
      lastLocationByDept().then(res => {
        let arr = []
        res.data.forEach(item => {
          if (null !== item) {
            let position = {
              longitude: item.longitude,
              latitude: item.latitude
            }
            let entity = this.bjt3D.viewer.entities.getById(item.tagId)
            if (typeof entity != 'undefined') {
              this.bjt3D.pointMove(item.tagId, position, 200)
            } else {
              this.countByStaffEntity.staff = 0
              this.countByStaffEntity.gest = 0
              this.countByStaffEntity.contractor = 0
              getCardByTagId(item.tagId).then(card => {
                let img = null
                let str = ''
                let selectImg = null
                if (card.data.bjtEntityType == 'staff') {
                  this.countByStaffEntity.staff += 1
                  str = '内部员工'
                  img = positionImg()
                  selectImg = positionSelectImg()
                  this.bjt3D.pointPosition(item.tagId, card.data.staffName, positionImg(), position)
                } else if (card.data.bjtEntityType == 'contractor') {
                  this.countByStaffEntity.contractor += 1
                  str = '承包商'
                  img = contractorImg()
                  selectImg = contractorSelectImg();
                  this.bjt3D.pointPosition(item.tagId, card.data.staffName, contractorImg(), position)
                } else if (card.data.bjtEntityType == 'guest') {
                  this.countByStaffEntity.guest += 1
                  str = '访客'
                  img = guestImg()
                  selectImg = guestSelectImg()
                  this.bjt3D.pointPosition(item.tagId, card.data.staffName, guestImg(), position)
                }
                this.renyuanlist.push({
                  staffName: card.data.staffName,
                  type: str,
                  tagId: item.tagId,
                  img: img,
                  selectImg: selectImg
                })
                this.renyuanlistback.push({
                  staffName: card.data.staffName,
                  type: str,
                  tagId: item.tagId,
                  img: img,
                  selectImg: selectImg
                })
              })
              this.bjt3D.positionPoints.push(item.tagId);
              this.bjt3D.positionPoints = this.unique(this.bjt3D.positionPoints)
            }
            arr.push(item.tagId)
          }
        })
        setTimeout(() => {
          this.charData = [
            {
              value: this.countByStaffEntity.staff,
              name: '内部员工'
            }, {
              value: this.countByStaffEntity.contractor,
              name: '承包商'
            }, {
              value: this.countByStaffEntity.guest,
              name: '访客'
            }]

          this.rytjChart();
        }, 1000);
        let arr2 = this.bjt3D.positionPoints.filter(i => arr.indexOf(i) === -1)
        if (arr2.length > 0) {
          arr2.forEach(i => {
            this.bjt3D.remove(i)
          })
        }
      })
    },
    startSocket() {
      let that = this
      key().then(res => {
        let url = import.meta.env.VITE_WS_BASE_API + '/socket/websocket/' + res.data.key;
        that.wsObj = new WebSocket(url);
        websocketCommand(that.wsObj, 'create', 3000, '心跳', this.getSocketData);
      });
    },
    stopSocket() {
      websocketCommand(this.wsObj, 'close')
    },
    getSocketData(e) {  // 创建接收消息函数
      const data = e
      if (data.msg && data.msg === '连接成功') {
        return
      }
      //如果消息类型是定位消息
      if (data.messageType === 'position') {
        this.socketPoint(data)
      }
    },
    reconnectWs() {

    },
    alarmList() {
      listAlarm({tagAlarmType: this.params.tagAlarmType, state: 0}).then(res => {
        this.warnList = [];
        if (res.rows != null && res.rows.length > 0) {
          res.rows.forEach(item => {
            item.raiseTime = this.dealTime(item.raiseTime);
          })
        }
        this.warnList = res.rows;
      })
    },

    //处理时间戳
    dealTime(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      const convertedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      return convertedTime;
    },
    getDeptAlarm(row) {
      listAlarm().then(res => {
        let img = document.getElementById("alarmImg");
        if (res.rows != null && res.rows.length > 0) {
          //如果是第一次进页面或页面没有报警产生则开始报警
          if (this.iswarning === false) {
            this.startAlarm();
            res.rows.forEach(item => {
              if (item.triggerId == 1) {
                this.bjt3D.addAnimaPoint(item, img);
                this.alarmPointList.push(item.id)
              }
            })
          } else {
            //如果页面已经有报警产生需要对比这次查询的数据和上次查询的数据是否有重复数据
            //如果有不重复的数据需要把之前保存的和这次查询不重复的数据对应的提醒图标删除或添加
            let array = [];
            res.rows.forEach(item => {
              if (item.triggerId == 1) {
                array.push(item.id)
              }
            })
            let needDeleteArray = this.alarmPointList.filter(x => !array.includes(x));
            let needAddArray = array.filter(x => !this.alarmPointList.includes(x));
            needDeleteArray.forEach((id, index) => {
              this.bjt3D.remove(id)
              this.alarmPointList.splice(index)
            })


            needAddArray.forEach(id => {
              getAlarm(id).then(alarm => {
                //todo 把数据加到地图里
                if (alarm.triggerId == 1) {
                  this.bjt3D.addAnimaPoint(alarm, img);
                  this.alarmPointList.push(id)
                }
              })
            })
          }
        } else {
          this.endAlarm()
        }
      })
    },
    startAlarm() {
      this.musicplay();
      this.iswarning = true;
    },
    endAlarm() {
      let music = document.getElementById('warnmusic')
      music.pause()
      this.iswarning = false;
    },
    heatmapGather() {
      let that = this
      listGatherConfig().then(config => {
        console.log(config)
        that.heatmapLoad = setInterval(() => {
          axios({
            method: 'get',
            //url: '/gather-api/deptGather/allGatherCount',
            url: config.rows[0].fileUrl + '/deptGather/allGatherCount',
          }).then((res) => {
            if (typeof res !== 'undefined') {
              that.bjt3D.cesiumHeatmap(res.data, config.rows[0])
            }
          })
        }, 5000)
      })
    },

    socketPoint(data) {
      let entity = this.bjt3D.viewer.entities.getById(data.tagId)
      if (data.out && typeof entity != 'undefined') {
        this.bjt3D.remove(data.tagId)
        return
      }

      let position = {
        longitude: data.longitude,
        latitude: data.latitude,
      }
      if (typeof entity != 'undefined') {
        //如果entity不是空的表示地图中有这张定位卡的点位  则移动点位
        this.bjt3D.pointMove(data.tagId, position, 200)
      } else {
        //地图中没有这张定位卡的点位  通过tagId查询定位卡信息后新增点位
        getCardByTagId(data.tagId).then(card => {
          if (card.data.bjtEntityType == 'staff') {
            this.bjt3D.pointPosition(data.tagId, card.data.staffName, positionImg(), position)
          } else if (card.data.bjtEntityType == 'contractor') {
            this.bjt3D.pointPosition(data.tagId, card.data.staffName, contractorImg(), position)
          } else if (card.data.bjtEntityType == 'guest') {
            this.bjt3D.pointPosition(data.tagId, card.data.staffName, guestImg(), position)
          }
        })
        this.bjt3D.positionPoints.push(data.tagId);
      }
    },
    pointAndLayerLoad(type, typeId) {
      loadHazardSource(type, typeId).then((res) => {
        listObject().then(listRes => {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].modelType == 1) {
              this.bjt3D.pointLoad(res.data[i].id, res.data[i].modelTypeId, res.data[i].modelPosition, getImgSrc(res.data[i].modelTypeId))
            } else {
              let label = res.data[i].modelLabel
              if (res.data[i].eventUrl != '' && null != res.data[i].eventUrl) {
                label = label + ' ▶';
                this.bjt3D.layerLoad2(res.data[i].id, label, res.data[i].modelTypeId, res.data[i].modelPosition, getLayerColor(res.data[i].modelTypeId))
              } else {
                if (res.data[i].areaId) {
                  listRes.rows.forEach(e => {
                    if (e.id == res.data[i].areaId) {
                      this.bjt3D.layerLoad1(res.data[i].id, label, res.data[i].modelTypeId, res.data[i].modelPosition, getLayerColor(getRiskColor(e.riskName)))
                    }
                  })
                } else {
                  this.bjt3D.layerLoad1(res.data[i].id, label, res.data[i].modelTypeId, res.data[i].modelPosition, getLayerColor(res.data[i].modelTypeId))
                }
              }
            }
          }
          this.bjt3D.removeDefaultHandler();
        })
      })
    },
    pickEntity(id) {
      this.pickId = id;
      let flag = this.bjt3D.positionPoints.indexOf(id);
      if (flag == -1) {
        //普通图标
        getModelInfo(id).then(info => {
          let infoData = info.data;
          switch (infoData.modelTypeId) {
            case 9:
              getCameraByPoint(id).then(address => {
                if (address.data != null) {
                  this.jiankongshow = true;
                  localStorage.videourl = address.msg;
                  this.jiankong(address.data)
                }
              })
              break
            case 14:
              this.tilesCutting(infoData.id)
              break;
            default:
              this.shownrong = true
              selectSensorData(id).then(res => {
                this.measuringPointList = res.data;
              })
          }
        })
      } else {
        //人员定位图标
        let param = {
          tagId: id
        }
        findStaffByTag(param).then(res => {
          this.getTimeNow();
          this.timeLineStaff = res.data
          this.showStaffInfo = true
        })
      }
    },
    //分层
    tilesCutting: function (id) {
      if (this.bjt3D.childrenTileset.has(id)) {
        this.bjt3D.unCutting(id)
        this.childrens = []
      } else {
        listChildrenMap({pointId: id}).then(map => {
          map.rows.forEach(item => {
            this.bjt3D.cutting(item)
          })
          this.childrens = map.rows
        })
      }
    },
    modelFilter(row) {
      this.bjt3D.cuttingFilter(row)
    },
    toolsControl() {
      this.toolShow = false;
    },
    midrttpBtn() {
      this.bjt3D.removeAll()
      this.bjt3D.positionPoints = [];
      this.refreshPoint()
      this.bjt3D.removeAll();
      this.startSocket();
      this.toolShow = true;
    },
    gatherReplay(row) {
      this.warnDrawer = false
      this.toolsControl();
      this.bjt3D.removeAll()
      this.positionFilter(true)
      let that = this
      setTimeout(function () {
        timeLineByAlarmId(row.id).then(res => {
          let filter = []
          res.data.forEach(item => {
            getCardByTagId(item.tagId).then(card => {
              let img = null
              if (card.data.bjtEntityType == 'staff') {
                img = positionImg()
              } else if (card.data.bjtEntityType == 'contractor') {
                img = contractorImg()
              } else if (card.data.bjtEntityType == 'guest') {
                img = guestImg()
              }
              if (!filter.includes(item.tagId)) {
                filter.push(item.tagId)
                that.bjt3D.pointPosition(item.tagId, card.data.staffName, img, item);
              } else {
                setTimeout(() => {
                  that.bjt3D.pointMove(item.tagId, item, 100);
                }, 500)
              }
            })
          })
        })
      }, 5000)
    },
    timelineClick: function () {
      clearInterval(this.loadTimer)
      clearInterval(this.heatmapLoad)
      this.bjt3D.removeAll()
      this.stopSocket()
      let that = this
      that.timeLineSelection = 0;
      const loading = that.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      timeLine(that.pickId, that.timeLineQueryDate[0], that.timeLineQueryDate[1]).then(res => {
        loading.close();
        if (res.data == null || res.data.length === 0) {
          this.$message({
            type: 'success',
            message: '未查询到该人员定位数据'
          });
          return
        }
        let data = res;
        that.timeLineMaxLength = data.data.length;
        that.timeLineData = data.data;
        that.showStaffInfo = false;
        that.showTimeLine = true;
        if (data.data.length !== 0) {
          // 2.确定相机角度和位置
          that.bjt3D.cameraChange(-90, data.data[0])
          let linePosition = [];
          for (let i = 0; i < data.data.length; i++) {
            linePosition.push(that.bjt3D.parseCartesian3(data.data[i]));
          }
          that.bjt3D.trajectory(linePosition);
          that.bjt3D.pointPosition(data.data[0].tagId, data.data[0].userName, positionImg(), data.data[0]);
          that.timer = setInterval(() => {
            that.timeLineSelection += 1;
          }, 1000);
        }
      })
    },
    formatToolTip(v) {
      let checkData = this.timeLineData[v];
      this.bjt3D.pointMove(this.timeLineData[v].tagId, this.timeLineData[v], 10);
      if (typeof checkData === 'undefined') {
        return;
      }
      let date = new Date(checkData.rowKey - 0);
      let str = date.getMonth() + 1 + "月" + date.getDate() + "日 " + date.getHours() + "点" + date.getMinutes() + "分";
      this.sliderstr = str

      const length = this.timeLineMaxLength
      const progress = v
      const left = (progress * 100) / (length * 100) * 100
      this.style.left = `${left}%`

      return str;
    },
    closeTimeLine() {
      this.refreshPoint()
      this.showTimeLine = false;
      this.showStaffInfo = false;
      this.bjt3D.removeAll();
      this.startSocket();
      clearInterval(this.timer)
    },
    refreshPoint() {
      this.countByStaffEntity.staff = 0
      this.countByStaffEntity.contractor = 0
      this.countByStaffEntity.guest = 0
      this.bjt3D.removeAll();
      this.pointAndLayerLoad();
      this.loadLastLocationTimer()
      this.renyuanlist = []
      this.renyuanlistback = []
      this.showico1 = false;
      this.showico2 = false;
      this.showico3 = false;
      this.showico4 = false;
      this.showico7 = false;
      this.showico9 = false;
      this.showParamIco = false;
      this.showxiaofangIco = false;
      this.showPowerIco = false;
    },
    warnDetail(row) {
      //获取详情
      getAlarm(row.id).then(response => {
        response.data.raiseTime = this.dealTime(response.data.raiseTime);
        this.form = response.data;
        console.log(this.form)
        this.dialogWarnDetail = true;
      });
    },
    warnCheck() {
      this.alarmList();
    }
  }
}
</script>
<style scoped lang="scss">
.rydwbigscreen {
  background: url("@/assets/images/scyf/scyf-bg.jpg") no-repeat;
  background-size: cover !important;
  height: calc(100vh - 84px);

  .warnDrawer {
    :deep .el-drawer {
      background: #031d42;

      .el-drawer__header {
        color: #fff;
        font-weight: bold;
        margin: 0;
      }

      .el-select .el-input__inner {
        background: transparent;
        border-color: #2e5186;
        color: #0d94f8;
      }
    }

    :deep .el-dialog {
      background: #031d42;

      .el-dialog__title {
        color: #fff;
        font-weight: bold;
      }

      .el-dialog__body {
        padding: 15px 20px;
        border-top: 1px solid #2e5186;
      }

      .warndttit {
        font-weight: bold;
        color: #0d94f8;
        font-size: 16px;
        line-height: 1;
        padding-left: 15px;
        border-left: 6px solid #0d94f8;
        margin: 10px 0 0;
      }

      .info {
        margin: 10px 0 30px;

        table {
          border-collapse: collapse;
          width: 100%;

          td {
            border: 1px solid #2e5186;
            padding: 10px;
            color: #fff;
          }

          .tit {
            background: #062755;
          }

          .huifang {
            color: #0d94f8;
            cursor: pointer;
          }
        }
      }
    }
  }

  :deep .el-table {
    margin: 10px 0 0;
    background: transparent;

    td.el-table__cell,
    th.el-table__cell.is-leaf {
      border: 0;
    }

    .el-table__header-wrapper th {
      background: transparent !important;
      color: #6bc8f6;
    }

    tr {
      background: transparent
    }

    tr td:first-child .cell {
      color: #00deff;
    }

    .el-table__header {
      background: url("@/assets/images/scyf/scyf-dttablebg.png") no-repeat;
      background-size: 100% 100%;
    }

    tr.el-table__row--striped td.el-table__cell,
    tr:hover td.el-table__cell {
      background: #122e5e;
    }

    .cell {
      padding: 0 5px;
    }

    td.el-table__cell {
      color: #bff7ff;
    }

    .el-table__inner-wrapper::before {
      display: none;
    }

    .level {
      background: url("@/assets/images/scyf/scyf-dtdjbg.png") no-repeat center;
      background-size: contain;
      color: #a2ddff;
      line-height: 1;
      padding: 3px 0 7px;
      font-size: 13px;
    }

    .gotodetail {
      color: #aecbe2;
      cursor: pointer;
    }
  }

  .toptitle {
    img {
      width: 100%;
      display: block;
    }

    .fangda {
      position: absolute;
      right: 20px;
      top: 15px;
      font-size: 18px;
      color: #2aa7d3;
    }
  }

  .righttopbtn {
    position: absolute;
    right: 70px;
    top: 10px;
    color: #008bff;
    font-size: 26px;
    z-index: 9;
    cursor: pointer;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, .6);
    border-radius: 50%;
    text-align: center;
    padding-top: 3px;

    img {
      width: 32px;
    }
  }

  @keyframes bling {
    from {
      opacity: 0.5;
      transform: scale(0.8, 0.8);
    }
    to {
      opacity: 1;
      transform: scale(1, 1);
    }
  }

  .bling {
    animation-name: bling;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }

  .main {
    padding: 0 20px;

    :deep .el-row {
      height: 100%;

      .el-col {
        height: 100%;
        position: relative;
      }
    }

    .mainbox {
      .tit {
        background: url("@/assets/images/scyf/scyf-boxtit.png") no-repeat;
        background-size: 100% 100%;
        color: #fff;
        font-weight: bold;
        font-size: 16px;
        font-style: italic;
        padding: 5px 10px;
      }
    }

    .left {
      height: calc(100% + 10px);
      margin-top: -10px;
      background: url("@/assets/images/scyf/scyf-barbg.png") no-repeat;
      background-size: 100% 100%;
      padding: 5px 15px;
      position: relative;
      z-index: 9;

      .leftbox1 {
        height: calc(33.33% - 20px);
        margin: 10px 0;

        .renyuantj {
          height: calc(45% - 31px);

          img {
            max-width: 100%;
            max-height: 100%;
          }

          .item {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;

            h3 {
              margin: 0;
              font-size: 22px;
              font-weight: bold;
              color: #35bbff;
              background-image: -webkit-linear-gradient(top, #fff, #35bbff);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }

            h5 {
              margin: 5px 0 0;
              font-size: 14px;
              color: #fff;
            }
          }
        }

        #rytjChart {
          height: 55%;
        }
      }

      .leftbox2 {
        height: calc(33.33% - 10px);
        margin: 10px 0;

        .midselect {
          position: relative;
          width: 100%;
          margin: 10px 0 0;

          :deep .el-input {
            .el-input-group__append {
              background: #203151;
              border: 0;
              cursor: pointer;
              padding-right: 10px;
              color: #adcae1;

              .el-icon {
                display: inline-block;
                line-height: 1.5;
              }

            }

            .el-input-group__prepend {
              background: #203151;
              border: 0;
              cursor: pointer;
            }

            .el-input__inner {
              background: #203151;
              border: 0;
              color: #adcae1;
            }

            ::placeholder {
              color: #999;
            }
          }

          :deep .el-select {
            display: block;

            .el-input__inner {
              border: 0;
              background: #203151;
              border-radius: 20px 0 0 20px;
              color: #03b6d1;
              width: 80px;
            }

            .el-select__caret {
              color: #03b6d1;
            }
          }
        }

        .renyuanlist {
          width: 102;
          margin: 0 -1%;
          height: calc(100% - 73px);
          overflow: auto;

          .item {
            width: 48%;
            margin: 5px 1%;
            float: left;
            height: calc(50% - 5px);
            background: url("@/assets/images/scyf/rydw-rycxbg.png") no-repeat;
            background-size: 100% 100%;
            padding: 10px;
            position: relative;

            h4 {
              margin: 0;
              font-size: 14px;
              color: #fff;

              span {
                font-size: 12px;
                color: #fff;
                background: #163269;
                border: 1px solid #1c5fcc;
                border-radius: 3px;
                padding: 0 5px;
                margin: 0 5px 0 0;
              }
            }

            h5 {
              font-size: 12px;
              color: #d8f2ff;
              margin: 8px 0 0;
            }

            .bot {
              position: absolute;
              right: 10px;
              bottom: 8px;
              font-size: 12px;
              color: #d8f2ff;
              cursor: pointer;

              img {
                width: 14px;
                vertical-align: middle;
              }
            }
          }
        }

        .renyuanlist:before, .renyuanlist::after {
          content: '';
          clear: both;
          display: table;
        }

        .renyuanlist::-webkit-scrollbar {
          width: 5px;
          /*滚动条宽度*/
          height: 10px;
          /*滚动条高度*/
        }

        /*定义滚动条轨道 内阴影+圆角*/
        .renyuanlist::-webkit-scrollbar-track {
          /*滚动条的背景区域的内阴影*/
          border-radius: 10px;
          background: #203151;
        }

        /*定义滑块 内阴影+圆角*/
        .renyuanlist::-webkit-scrollbar-thumb {
          border-radius: 6px;
          background-color: rgba(255, 255, 255, 0.1);
        }

      }

      .leftbox3 {
        height: calc(33.33% - 10px);
        margin: 10px 0;

      }
    }

    .mid {
      height: 100%;
      position: relative;

      .midtree {
        position: absolute;
        right: 20px;
        top: 1vh;
        background: #0e1631;
        z-index: 9;
        padding: 15px;
        border: 1px solid #344385;
        width: 220px;

        h5 {
          padding: 10px 0;
          text-align: center;
          background: #4c74c4;
          color: #fff;
          margin: 0 0 10px;
          font-size: 16px;
        }

        :deep .el-tree {
          background: transparent;

          .el-tree-node__content {
            padding: 0 15px 0 0;
            color: #fff;
          }

          .el-tree-node__content:hover,
          .el-tree-node:focus > .el-tree-node__content {
            background: rgba(255, 255, 255, .1) !important;
          }
        }
      }

      .midrttpbtn {
        position: absolute;
        right: 20px;
        top: 1vh;
        background: #0e1631;
        z-index: 9;
        color: #ff1434;
        border: 2px solid #ff1434;
        border-radius: 3px;
        padding: 5px 15px;
        cursor: pointer;
      }

      #cesiumContainer1 {
        height: 100%;
        position: relative;

        .cesium-viewer {
          position: absolute !important;
        }
      }

      #cesiumContainer1:before {
        content: '';
        width: 104%;
        height: 100%;
        background: url("@/assets/images/scyf/mapzhezhao.png") no-repeat center;
        background-size: 100% 100%;
        position: absolute;
        left: -2%;
        top: 0;
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

      .midbot {
        width: 55%;
        position: absolute;
        bottom: 0;
        left: 25%;
        padding: 0 0 15px;
        background: url("@/assets/images/scyf/scyf-midbotbg.png") no-repeat bottom;
        background-size: 100%;

        .itembox {
          width: 80%;
          margin: 0 auto;
        }

        .item {
          text-align: center;
          width: 25%;
          float: left;

          img {
            width: 50px;
          }

          h5 {
            margin: 3px 0 0;
            color: #aecbe2;
            white-space: nowrap
          }
        }
      }

      .midbot:before, .midbot::after {
        content: '';
        clear: both;
        display: table;
      }
    }

    .right {
      height: calc(100% + 10px);
      margin-top: -10px;
      background: url("@/assets/images/scyf/scyf-barbg.png") no-repeat;
      background-size: 100% 100%;
      padding: 15px;
      position: relative;
      z-index: 9;

      .mainbox {
        margin-bottom: 10px;
        height: calc(38% - 10px);

        .timechoose {
          text-align: right;
          margin: 10px 0 2px;
          position: relative;
          z-index: 9;

          span {
            font-size: 12px;
            color: #c3e1ff;
            border: 1px solid #1c7bd1;
            padding: 2px 6px;
            margin-left: 5px;
            cursor: pointer;
          }

          span.active {
            color: #fff;
            background: #10447d;
          }
        }

        .ryssgj {
          height: calc(100% - 31px);
          position: relative;

          .ryssgjleft {
            width: 26%;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);

            .number {
              position: relative;

              img {
                max-width: 100%;
                max-height: 100%;
                display: block;
                margin: 0 auto;
              }

              span {
                display: block;
                font-size: 28px;
                color: #fff;
                text-align: center;
                background-image: -webkit-linear-gradient(top, #fff, #35bbff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                position: absolute;
                left: 0;
                width: 100%;
                top: 50%;
                transform: translateY(-50%);
              }
            }

            h5 {
              margin: 5px 0 0;
              font-size: 14px;
              color: #6dd1ff;
              text-align: center;
            }
          }

          .ryssgjright {
            width: 80%;
            height: calc(100% - 20px);
            position: absolute;
            right: 0;
            top: 15px;

            img {
              width: 100%;
              height: 100%;
              position: absolute;
              bottom: 0;
              left: 0;
            }

            .ryssgjrightdata {
              height: 80%;
              width: 94%;
              margin-left: 6%;
              position: absolute;
              bottom: 0;
              left: 0;
							top: 10px;
            }

            .item {
              width: 33.3%;
              height: 33.3%;
              float: left;
              font-size: 13px;
              color: #fff;
              display: flex;
              align-items: center;
              justify-content: center;

              span {
                color: #fbcf34;
                font-size: 18px;
                font-weight: bold;
                margin: 2px 0 0 6px;
              }
            }

            .item:nth-child(4),
            .item:nth-child(5),
            .item:nth-child(6) {
              span {
                color: #ff9b58;
              }
            }
          }
        }

      }

      .rightbox1 {
        height: calc(25% - 10px);
      }

      .bjlbchart {
        height: calc(100% - 61px);
        background: url("@/assets/images/scyf/scyf-yhpctaskbg.png") no-repeat center;
        background-size: 100% 100%;

        #bjlbchart {
          height: 100%;
        }
      }

      .rygjqst {
        height: calc(100% - 30px);
        margin-top: -30px;
        position: relative;
        z-index: 1;

        #rygjqst {
          height: 100%;
        }
      }

    }

  }

}

.smalltanchu {
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  position: absolute;
  z-index: 9;

  display: flex;
  align-items: center;

  .item {
    width: 50px;
    text-align: center;
    padding: 10px 0;

    img {
      display: block;
      margin: 0 auto 0;
      width: 30px;
    }

    h5 {
      margin: 0;
    }
  }

  .smclose {
    position: absolute;
    right: 5px;
    top: 5px;
    color: #fff;
    cursor: pointer;
  }
}

.nronglist {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  pointer-events: auto;
  position: absolute;
  z-index: 9;
  // top: 40%;
  // left: 50%;
  // transform: translate(-50%, -50%);
  background-color: RGBA(0, 0, 0, 0.5);
  color: #fff;
  width: 400px;
  font-size: 14px;
  padding: 10px;

  .nronglistcon::-webkit-scrollbar {
    display: none
  }

  .nronglistcon {
    background-color: RGBA(0, 0, 0, 0.5);
    width: 100%;
    padding: 10px;
    height: 320px;
    overflow-y: scroll;
    position: relative;

    .empty-con {
      margin-top: 50px;

      :deep(.el-empty__description) {
        p {
          color: #0773ce;
        }
      }
    }

    .closebtn {
      position: absolute;
      right: 0;
      top: 0;
      width: 15px;
      height: 15px;
      line-height: 15px;
      text-align: center;
      cursor: pointer;
    }

    .nronglistli {
      line-height: 40px;
      border-bottom: 1px solid #6a6a6a;
    }
  }
}

.togglebar {
  position: absolute;
  left: 5%;
  top: 1.0vh;
  width: auto;
  height: 2.5rem;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  pointer-events: auto;
  z-index: 9;

  .togglebar-icon {
    float: left;
  }

}

.af-item {
  background: rgba(2, 11, 45, 0.8);
  cursor: pointer;
}

//时间轴
.timean {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  pointer-events: auto;
}

.time-bg {
  width: 56%;
  margin: 0 auto;
  margin-top: 50px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  pointer-events: auto;
  padding: 5px 10px;
  position: absolute;
  z-index: 9;
  left: 22%;
  top: 5%;

  .return {
    img {
      height: 25px !important;
      position: relative;
      left: 10px;
      top: 4px;
    }
  }
}

.timeline {
  width: 100%;
  position: relative;

  .my-slider__tooltip {
    text-align: left;
    position: absolute;
    top: -20px;

    .my-slider__tooltip-wrapper {
      height: 32px;
      //transform: translateX(-50%);
      //top: -50%;
      margin-left: -50px;
      background-color: RGBA(0, 0, 0, 0.7);
      border: none;
      color: #fff;
    }
  }


  :deep(.el-slider__marks-text) {
    color: #fff !important;
  }

  :deep(.el-slider__marks-text) {
    width: 110px;
    font-size: 12px;
  }
}

.tyxq-tc {
  position: relative;
  pointer-events: none;
  z-index: 999;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  pointer-events: auto;

  :deep(.el-table) {
    background: transparent;
    margin-top: 15px;

    --el-table-border-color {
      border-bottom: none !important;
    }

    .el-table__inner-wrapper::before {
      display: none;
    }

    tr {
      cursor: pointer;
    }

    .el-table__header-wrapper {
      th {
        background-color: #1c2e6a !important;
        text-align: center;
        color: #06b2f1;
        padding: 2px 0;
        height: 30px !important;
      }
    }

    .el-table__cell {
      background: #071f55 !important;
      color: #FFFFFF;
      padding: 2px 0;
      border-bottom: none !important;
      text-align: center;
      font-size: 12px;
    }

    .el-table__row--striped {
      .el-table__cell {
        background: #12295a !important;
      }
    }
  }

  :deep(.el-table::before) {
    display: none;
  }

  :deep(.el-dialog__body) {
    padding: 0 20px 20px !important;
    background: #1c2a5e !important;
    color: #fff;
    min-height: 300px;
  }

  :deep(.el-dialog__header) {
    background: #1c2a5e !important;
    padding-bottom: 20px;

    .el-dialog__title {
      color: #fff;
    }
  }


  .tyxq-con {
    .tyxq-contop {
      margin-bottom: 10px;
    }

    .yonghum {
      padding: 10px;
    }

    .time {
      margin-right: 10px;

      :deep(.el-date-editor) {
        background: transparent;
        border: 1px solid #5b67a9;

        .el-range-input {
          background: transparent;
          color: #fff;
        }
      }
    }

    .biank {
      border: 1px solid #5b67a9;
    }

    .rydw-li {
      .tacnr {
        line-height: 40px;
      }

      .txt {
        text-align: right;
        color: #70bbff;
        padding-right: .92593vh;
      }
    }
  }
}
</style>
