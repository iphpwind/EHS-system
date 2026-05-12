<template>
  <div class="home">
    <div class="head">
      <h4>{{ siteName }}</h4>
      <!-- <span>{{now}}</span> -->
      <div class="fangda">

        <i v-if="size == 'small'" style="cursor: pointer;" @click="changeSize()"><img src="@/assets/images/fangda.png"></i>
        <i v-if="size == 'big'" style="cursor: pointer;" @click="changeSize()"><img
            src="@/assets/images/suoxiao.png"></i>
      </div>
      <!--      <el-button @click="poppage('/system/hazardsource')">test</el-button>-->
    </div>
    <div class="contermy">
      <el-row class="hit" :gutter="10">
        <!-- 左侧-->
        <el-col :span="6" style="height: 100%;">
          <div class="left-con">
            <!-- 设备概览-->
            <div class="part-1 title border-p">
              <h4><img src="@/assets/images/screen/tit-1.png">设备概览</h4>

              <el-row class="juzong">
                <el-col :span="6">
                  <div class="part-1-li"><span>{{ eqAll }}</span></div>
                  <p class="text-cen">设备总数</p>
                </el-col>
                <el-col :span="6">
                  <div class="part-1-li"><span>{{ eqOnline }}</span></div>
                  <p class="text-cen">在线设备</p>
                </el-col>
                <el-col :span="6">
                  <div class="part-1-li"><span>{{ eqOffline }}</span></div>
                  <p class="text-cen">离线设备</p>
                </el-col>
                <el-col :span="6">
                  <div class="part-1-li"><span>{{ eqAlarm }}</span></div>
                  <p class="text-cen">告警设备</p>
                </el-col>
              </el-row>
            </div>


            <!-- 设备类型览-->
            <div class="part-2 title border-p">
              <h4><img src="@/assets/images/screen/tit-2.png">设备类型</h4>
              <el-row class="echart-bom juzong">
                <el-col :span="14">
                  <div class="echart-con" id="sblx">

                  </div>
                </el-col>
                <el-col :span="10" class="sblx-r">
                  <div class="sblx-ul">
                    <el-row v-for="item in eqType">
                      <el-col :span="24" class="sblx-li">
                        <el-row>
                          <el-col :span="12">
                            <div class="name">{{ item.name }}</div>
                          </el-col>
                          <el-col :span="12">
                            <div class="number text-right" style="white-space: nowrap;"><span>{{
                                item.num
                              }}台</span>/{{ item.ratio }}%
                            </div>
                          </el-col>
                        </el-row>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </div>

            <!-- 7天告警趋势-->
            <div class="part-3 title border-p">
              <h4><img src="@/assets/images/screen/tit-3.png">7天告警趋势</h4>
              <div class="height-bom juzong " id="gjqs">
              </div>
            </div>

            <!-- 能耗分析-->
            <div class="part-3 title border-p" style="margin-bottom:0;height:25%;">
              <h4><img src="@/assets/images/screen/tit-4.png">能耗分析</h4>
              <div class="height-bom juzong" id="nhfx">
              </div>
            </div>
          </div>
        </el-col>
        <!-- 中间-->
        <!-- 判断有右侧两菜单的 :span="12"  没有右侧菜单的 :span="18" -->
        <el-col :span="12">
          <div class="con-nr">
            <div class="con-nr-1">
              <div id="full_screen"
                   style="position: absolute; right: 10px;top: 10px;width: 25px;background: rgba(2, 11, 45, 0.8);">
                <img src="@/assets/images/fangda.png">
              </div>

              <div id="map_container">
                <!-- <iframe src="/system/hazardsource" width="100%" height="100%" style="border:none"></iframe>-->

                <div class="dw-indexcon">
                  <div class="dw-con">

                    <div class="leftbar">


                    </div>


                    <!--图标    -->
                    <div class="togglebar">
                      <div @click="showImg1" class="togglebar-icon af-item">
                        <img v-if="!showico1" src="@/assets/images/icon-ks-01-a.png" style="width: 2.5rem;"/>
                        <img v-if="showico1" src="@/assets/images/icon-ks-01-ah.png" style="width: 2.5rem;"/>
                      </div>

                      <div @click="showImg2" class="togglebar-icon af-item">
                        <img v-if="!showico2" src="@/assets/images/icon-ks-02-a.png" style="width: 2.5rem;"/>
                        <img v-if="showico2" src="@/assets/images/icon-ks-02-ah.png" style="width: 2.5rem;"/>
                      </div>

                      <div @click="showImg3" class="togglebar-icon af-item">
                        <img v-if="!showico3" src="@/assets/images/icon-ks-03-a.png" style="width: 2.5rem;"/>
                        <img v-if="showico3" src="@/assets/images/icon-ks-03-ah.png" style="width: 2.5rem;"/>
                      </div>

                      <div @click="showImg4" class="togglebar-icon af-item">
                        <img v-if="!showico4" src="@/assets/images/icon-ks-04-a.png" style="width: 2.5rem;"/>
                        <img v-if="showico4" src="@/assets/images/icon-ks-04-ah.png" style="width: 2.5rem;"/>
                      </div>

                      <div @click="showXiaofangImg" class="togglebar-icon af-item">
                        <img v-if="!showxiaofangIco" src="@/assets/images/xiaofang02.png" style="width: 2.5rem;"/>
                        <img v-if="showxiaofangIco" src="@/assets/images/xiaofang01.png" style="width: 2.5rem;"/>
                      </div>

                      <div @click="showImg7" class="togglebar-icon af-item">
                        <img v-if="!showico7" src="@/assets/images/huanbao02.png" style="width: 2.5rem;"/>
                        <img v-if="showico7" src="@/assets/images/huanbao01.png" style="width: 2.5rem;"/>
                      </div>

                      <div @click="showPowerImg" class="togglebar-icon af-item">
                        <img v-if="!showPowerIco" src="@/assets/images/power02.png" style="width: 2.5rem;"/>
                        <img v-if="showPowerIco" src="@/assets/images/power01.png" style="width: 2.5rem;"/>
                      </div>

                      <div @click="showParamImg" class="togglebar-icon af-item">
                        <img v-if="!showParamIco" src="@/assets/images/shebeicanshu02.png" style="width: 2.5rem;"/>
                        <img v-if="showParamIco" src="@/assets/images/shebeicanshu01.png" style="width: 2.5rem;"/>
                      </div>

                      <div @click="showImg9" class="togglebar-icon af-item">
                        <img v-if="!showico9" src="@/assets/images/icon-ks-09-a.png" style="width: 2.5rem;"/>
                        <img v-if="showico9" src="@/assets/images/icon-ks-09-ah.png" style="width: 2.5rem;"/>
                      </div>

                      <div @click="showPositions" class="togglebar-icon af-item">
                        <img v-if="!showPosition" src="@/assets/images/icon-ks-10-a.png" style="width: 2.5rem;"/>
                        <img v-if="showPosition" src="@/assets/images/icon-ks-10-ah.png" style="width: 2.5rem;"/>
                      </div>

                      <div @click="refreshPoint" class="togglebar-icon af-item">
                        <img title="刷新" src="@/assets/images/shuaxin.png" style="width: 2.5rem;">
                      </div>


                    </div>
                    <!--  右侧弹出-->
                    <!--已处理报警-->
                    <div class="r-tu af-item" v-if="showtc">
                      <div class="r-tu-con">
                        <el-row class="toptit">
                          <el-col :span="20">
                            <div class="title_text fl">
                              已处理报警
                            </div>
                          </el-col>
                          <el-col :span="4">
                            <div class="fr close" @click="close">X</div>
                          </el-col>
                        </el-row>
                        <el-row class="r-con">
                          <el-select v-model="valuer" placeholder="请选择">
                            <el-option
                                v-for="item in optionsr"
                                :key="item.valuer"
                                :label="item.labelr"
                                :value="item.valuer">
                            </el-option>
                          </el-select>
                          <el-button type="primary" class="chaxun">查询</el-button>
                        </el-row>
                        <div class="r-list">
                          <el-table
                              :data="tableDatar"
                              style="width: 100%;
                    font-size: 14px;
                    color: rgb(236, 246, 255);
                    background: transparent!important;
                    height: 100%;
                    max-height: 100%;"
                              @row-click="clickData"
                          >
                            <el-table-column
                                prop="time"
                                label="报警时间"
                                width="180">
                            </el-table-column>
                            <el-table-column
                                prop="type"
                                label="报警类型"
                                width="180">
                            </el-table-column>
                            <el-table-column
                                prop="content"
                                label="报警内容">
                            </el-table-column>
                            <el-table-column
                                prop="sxt"
                                label="关联摄像头">
                            </el-table-column>
                          </el-table>
                        </div>

                        <!--      弹出内容-->
                        <div class="tanchunr">
                          <el-dialog
                              title="报警详情"
                              v-model="dialogVisible"
                              width="30%">
                            <div class="tc-con">
                              <h4>报警详情</h4>
                              <el-row>
                                <el-col :span="12">
                                  <div class="tc-nrli">
                                    <div class="fl tc-lname">报警时间:</div>
                                    <div class="fl">2022-04-14 12:20:35</div>
                                  </div>
                                </el-col>
                                <el-col :span="12">
                                  <div class="tc-nrli">
                                    <div class="fl tc-lname">报警Id:</div>
                                    <div class="fl">f3d20002</div>
                                  </div>
                                </el-col>
                              </el-row>
                              <el-row>
                                <el-col :span="12">
                                  <div class="tc-nrli">
                                    <div class="fl tc-lname">报警类型:</div>
                                    <div class="fl">SOS</div>
                                  </div>
                                </el-col>
                                <el-col :span="12">
                                  <div class="tc-nrli">
                                    <div class="fl tc-lname"></div>
                                    <div class="fl"></div>
                                  </div>
                                </el-col>
                              </el-row>
                            </div>


                            <div class="tc-con">
                              <h4>触发报警人详情</h4>
                              <el-row>
                                <el-col :span="12">
                                  <div class="tc-nrli">
                                    <div class="fl tc-lname">人员类别:</div>
                                    <div class="fl">内部员工</div>
                                  </div>
                                </el-col>
                                <el-col :span="12">
                                  <div class="tc-nrli">
                                    <div class="fl tc-lname">所属机构:</div>
                                    <div class="fl">烟台开发区</div>
                                  </div>
                                </el-col>
                              </el-row>
                              <el-row>
                                <el-col :span="12">
                                  <div class="tc-nrli">
                                    <div class="fl tc-lname">姓名:</div>
                                    <div class="fl">汪共</div>
                                  </div>
                                </el-col>
                                <el-col :span="12">
                                  <div class="tc-nrli">
                                    <div class="fl tc-lname">所属部门</div>
                                    <div class="fl">生产部</div>
                                  </div>
                                </el-col>
                              </el-row>
                              <el-row>
                                <el-col :span="12">
                                  <div class="tc-nrli">
                                    <div class="fl tc-lname">性别:</div>
                                    <div class="fl">男</div>
                                  </div>
                                </el-col>
                                <el-col :span="12">
                                  <div class="tc-nrli">
                                    <div class="fl tc-lname">工号:</div>
                                    <div class="fl">1</div>
                                  </div>
                                </el-col>
                              </el-row>
                            </div>

                          </el-dialog>
                        </div>
                      </div>
                    </div>
                    <!--  右侧弹出end-->


                    <div class="nrong-con">

                      <div class="nronglist" v-if="shownrong">
                        <div class="nronglistcon">
                          <div class="closebtn" @click="closePopup">X</div>
                          <el-row class="nronglistli" v-for="item in measuringPointList">
                            <el-col :span="12">
                              <div>{{ item.name }}</div>
                            </el-col>
                            <el-col :span="12">
                              <div class="text-align-r cursor">实时值：{{ item.data }}&nbsp;&nbsp; <a
                                  style="color: dodgerblue"
                                  @click="openxq(item.no, item.type, item.data, item.date)">详情</a>
                              </div>
                            </el-col>
                          </el-row>

                          <div class="empty-con" v-if="measuringPointList.length==0">
                            <el-empty description="暂无数据" :image-size="80" :src="stateImg"></el-empty>
                          </div>

                        </div>
                      </div>

                      <!--监测点-->
                      <div class="popuplist">
                        <el-dialog
                            title="监测点"
                            v-model="dialogVisibleli"
                            width="700px">

                          <div class="popuplistcon">
                            <h4>监测点信息</h4>
                            <el-row>
                              <el-col :span="12">
                                <div>
                                  <el-row :gutter="10">
                                    <el-col :span="6">
                                      <div class="text-align-r colorblue">测点名称</div>
                                    </el-col>
                                    <el-col :span="18">
                                      <div>{{ measuringName }}</div>
                                    </el-col>
                                  </el-row>
                                </div>
                              </el-col>
                              <el-col :span="12">
                                <div>
                                  <el-row :gutter="10">
                                    <el-col :span="6">
                                      <div class="text-align-r colorblue">测点编号</div>
                                    </el-col>
                                    <el-col :span="18">
                                      <div>{{ measuringNo }}</div>
                                    </el-col>
                                  </el-row>
                                </div>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="12">
                                <div>
                                  <el-row :gutter="10">
                                    <el-col :span="6">
                                      <div class="text-align-r colorblue">告警上限</div>
                                    </el-col>
                                    <el-col :span="18">
                                      <div>{{ measuringMax }}</div>
                                    </el-col>
                                  </el-row>
                                </div>
                              </el-col>
                              <el-col :span="12">
                                <div>
                                  <el-row :gutter="10">
                                    <el-col :span="6">
                                      <div class="text-align-r colorblue">告警下限</div>
                                    </el-col>
                                    <el-col :span="18">
                                      <div>{{ measuringMin }}</div>
                                    </el-col>
                                  </el-row>
                                </div>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="12">
                                <div>
                                  <el-row :gutter="10">
                                    <el-col :span="6">
                                      <div class="text-align-r colorblue">值</div>
                                    </el-col>
                                    <el-col :span="18">
                                      <div>{{ openxqValue }}</div>
                                    </el-col>
                                  </el-row>
                                </div>
                              </el-col>
                              <el-col :span="12">
                                <div>
                                  <el-row :gutter="10">
                                    <el-col :span="6">
                                      <div class="text-align-r colorblue">时间</div>
                                    </el-col>
                                    <el-col :span="18">
                                      <div>{{ openxqDt }}</div>
                                    </el-col>
                                  </el-row>
                                </div>
                              </el-col>
                            </el-row>

                            <div class="chart">
                              <el-row class="chart-title">
                                <el-col :span="12"><h4>检测数据</h4></el-col>
                                <el-col :span="12">
                                  <div class="text-align-r select-dow">
                                    <!--                                    <el-select v-model="valuejc" @change="dataInformation" placeholder="请选择">-->
                                    <!--                                      <el-option-->
                                    <!--                                          v-for="item in optionsjc"-->
                                    <!--                                          :key="item.valuejc"-->
                                    <!--                                          :label="item.labeljc"-->
                                    <!--                                          :value="item.valuejc">-->
                                    <!--                                      </el-option>-->
                                    <!--                                    </el-select>-->
                                  </div>
                                </el-col>
                              </el-row>
                              <div class="chart-con" id="jcsj">

                              </div>
                            </div>

                          </div>
                        </el-dialog>
                      </div>


                    </div>


                    <div class="tyxq-tc">
                      <el-dialog
                          title="人员详情"
                          v-model="ddialogVisible"
                          width="680px">
                        <div class="tyxq-con">
                          <el-row class="tyxq-contop">
                            <div class="time fl">
                              <el-date-picker
                                  v-model="dateValue"
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
                                  <div>用户名<span>男</span></div>
                                  <div>岗位：操作工 应急卡</div>
                                  <div>工号：1</div>
                                </el-col>
                              </el-row>
                            </el-col>
                          </el-row>
                          <el-row class="rydw-li">
                            <el-col :span="12" class="biank">
                              <el-row class="tacnr">
                                <el-col :span="6" class="txt">所属机构</el-col>
                                <el-col :span="18">烟台开发区有限公司</el-col>
                              </el-row>
                            </el-col>
                            <el-col :span="12" class="biank">
                              <el-row class="tacnr">
                                <el-col :span="6" class="txt">所属部门</el-col>
                                <el-col :span="18">生产部</el-col>
                              </el-row>
                            </el-col>
                            <el-col :span="12" class="biank">
                              <el-row class="tacnr">
                                <el-col :span="6" class="txt">手机号</el-col>
                                <el-col :span="18">1358965684</el-col>
                              </el-row>
                            </el-col>
                            <el-col :span="12" class="biank">
                              <el-row class="tacnr">
                                <el-col :span="6" class="txt">定位卡ID</el-col>
                                <el-col :span="18">5080</el-col>
                              </el-row>
                            </el-col>
                          </el-row>

                        </div>
                      </el-dialog>
                    </div>

                    <!--时间轴-->
                    <div class="af-item  time-bg" v-if="showtimeline">

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
                            v-model="valuetime"
                            :show-stops="false"
                            ref="timeLine1"
                            :show-tooltip="false"
                            :max="max"
                            :format-tooltip="formatToolTip">
                        </el-slider>

                      </div>
                      <!-- 时间轴end-->
                      <div class="return" @click="closeTimeLine"><img src="@/assets/images/return.png"
                                                                      style="width:25px;"></div>
                    </div>


                  </div>
                  <!--centreend -->


                  <!--地图-->
                  <div id="cesiumContainer" class="dw-map"></div>
                  <!--地图end-->


                </div>
              </div>
            </div>
            <div class="map-border"></div>

          </div>
        </el-col>

        <!-- 右侧浮动-->
        <div class="right-con">
          <!--					<Jinhui></Jinhui>-->
          <component :is="type"></component>
        </div>

      </el-row>

    </div>

    <div class="chanxiantanchu">
      <el-dialog
          v-model="pageshow"
          width="100%">
        <iframe width="100%" height="100%" :src="pagesrc"></iframe>
      </el-dialog>
    </div>

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


  </div>
</template>

<script>

import screenfull from "screenfull"; // 引入全屏显示
import {parseTime} from '@/utils/ruoyi'
import {equimentCount, equimentType, alarmTrend} from '@/api/index'
import {totalElectricityByDay} from "@/api/energy/energyoverview";
import bjt3D from "../../../utils/bjt3DMap";
import jquery from "jquery";
import {getImgSrc, getLayerColor, positionImg} from '@/utils/pointUtil'
import {loadHazardSource, getCameraByPoint, selectSensorData, getMeasuringInfo, getModelInfo} from '@/api/system/hazard'
import {timeLine, key, getMapConfig} from '@/api/system/positioning'
import {websocketCommand} from "@/utils/websocket";
import noneStateImg from '@/assets/images/zanwu.png';
import Jinhui from '@/components/Jinhui';
import FocusCloud from '@/components/FocusCloud';
import {computed} from "vue";
import {push, stop} from "@/api/video"
import WasmPlayer from '@easydarwin/easywasmplayer'

export default {
  name: "daping",
  components: {FocusCloud, Jinhui},
  data() {
    return {
      type: 'FocusCloud',
      size: 'small',
      isFullscreen: false,
      datetime: '',
      now: '',
      week: '',
      nowTimer: null,
      eqAll: 0,
      eqOnline: 0,
      eqOffline: 0,
      elDataTitle: [],
      elData: [],
      eqType: [],
      eqAlarm: 0,
      tableHeight: window.innerHeight - 300, //表格动态高度
      screenHeight: window.innerHeight, //内容区域高度
      tableData: [{
        name: '聚合反应釜',
        message: '压力异常',
        time: '2022/4/22',
        state: '未处理'
      }, {
        name: '聚合反应釜',
        message: '压力异常',
        time: '2022/4/22',
        state: '未处理'
      }, {
        name: '聚合反应釜',
        message: '压力异常',
        time: '2022/4/22',
        state: '未处理'
      }, {
        name: '聚合反应釜',
        message: '压力异常',
        time: '2022/4/22',
        state: '未处理'
      }, {
        name: '聚合反应釜',
        message: '压力异常',
        time: '2022/4/22',
        state: '未处理'
      }, {
        name: '聚合反应釜',
        message: '压力异常',
        time: '2022/4/22',
        state: '未处理'
      }, {
        name: '聚合反应釜',
        message: '压力异常',
        time: '2022/4/22',
        state: '未处理'
      }, {
        name: '聚合反应釜',
        message: '压力异常',
        time: '2022/4/22',
        state: '未处理'
      }, {
        name: '聚合反应釜',
        message: '压力异常',
        time: '2022/4/22',
        state: '未处理'
      }, {
        name: '聚合反应釜',
        message: '压力异常',
        time: '2022/4/22',
        state: '未处理'
      }, {
        name: '聚合反应釜',
        message: '压力异常',
        time: '2022/4/22',
        state: '未处理'
      }, {
        name: '聚合反应釜',
        message: '压力异常',
        time: '2022/4/22',
        state: '未处理'
      }, {
        name: '聚合反应釜',
        message: '压力异常',
        time: '2022/4/22',
        state: '未处理'
      }, {
        name: '聚合反应釜',
        message: '压力异常',
        time: '2022/4/22',
        state: '未处理'
      }],
      measuringName: '',
      measuringNo: '',
      measuringValue: '',
      measuringMax: '',
      measuringMin: '',
      measuringDt: '',
      stateImg: noneStateImg,
      optionsjc: [{
        valuejc: '1',
        labeljc: '近6个小时'
      }, {
        valuejc: '2',
        labeljc: '近12个小时'
      }],
      valuejc: 1,
      valuetime: 0,
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }],
      value: '',

      // 右侧
      optionsr: [{
        valuer: '选项1',
        labelr: '超远'
      }, {
        valuer: '选项2',
        labelr: '缺员'
      }],
      valuer: '',
      // 右侧信息
      tableDatar: [{
        time: '2016-05-02',
        type: '类型',
        content: '内容内容',
        sxt: ''
      }, {
        time: '2016-05-02',
        type: '类型',
        content: '内容内容',
        sxt: ''
      }, {
        time: '2016-05-02',
        type: '类型',
        content: '内容内容',
        sxt: ''
      }, {
        time: '2016-05-02',
        type: '类型',
        content: '内容内容',
        sxt: ''
      }],
      // 中间弹出
      dialogVisible: false,
      openxqValue: 0,
      openxqDt: '',
      showtc: false,
      pickId: null,
      showico1: false,
      showico2: false,
      showico3: false,
      showico4: false,
      showico7: false,
      showico9: false,
      showPowerIco: false,
      showhuanbaoIco: false,
      showxiaofangIco: false,
      showPosition: false,
      // now: null,
      showParamIco: false,
      dialogVisibleli: false,
      shownrong: false,
      measuringPointList: [],
      timer: null,
      ddialogVisible: false,
      dateValue: [Date.now(), new Date().setMinutes(new Date().getMinutes() - 7)],
      sliderstr: '',
      showtimeline: false,
      style: {
        paddingLeft: '0%'
      },
      pageshow: false,
      pagesrc: '',

      jiankongshow: false,
      newdate: '',
      newtime: '',
      videoid: '',
      videourl: '',
      player: '',
      darwin_url: ''
    }
  },

  computed: {
    siteName() {
      return this.$store.state.settings.siteName || '安全生产管理平台'
    }
  },

  watch: {
    // 监听screenHeight从而改变table的高度
    // screenHeight(val) {
    //   this.screenHeight = val
    //   if (this.screenHeight>1080){
    //     this.tableHeight = 210
    //     // console.log('大于1080')
    //   }else {
    //     this.tableHeight = 140
    //     // console.log('小于1080')

    //   }
    // }
  },
  created() {
    // if (this.screenHeight>1080){
    //   this.tableHeight = 210
    //   // console.log('大于1080')
    // }else {
    //   this.tableHeight = 140
    //   // console.log('小于1080')
    // }
  },

  mounted: function () {
    jquery('#cesiumContainer').html('')
    // this.nowDate()
    // this.$store.dispatch('app/topHide', false)


    let that = this;

    jquery(document.getElementById('cesiumContainer')).on('click', function (e) {
      let x = e.offsetX;
      let y = e.offsetY;
      if (that.shownrong) {
        jquery('.nronglist').css({'display': 'block', 'left': x + 'px', 'top': y + 'px'});
      }
    });

    getMapConfig().then(res => {
      let data = res.data;
      console.log(res)
      if (null != data.vueComponent && data.vueComponent !== '') {
        this.type = data.vueComponent;
      }
      bjt3D.init('cesiumContainer', data.mapAddress, data, () => {
      //bjt3D.init('cesiumContainer', 'http://172.16.1.126:7373/JHZY_3dTiles20220704/tileset.json', data, () => {
        this.pointAndLayerLoad()
        this.startSocket();
      })
      bjt3D.pickEntity((id) => {
        let entity = bjt3D.getById(id)
        if (typeof entity.polygon !== 'undefined') {
          getModelInfo(id).then(res => {
            console.log(res)
            if (res.data.eventUrl != null) {
              this.poppage(res.data.eventUrl)
            }
          })
          console.log('这是个色块')

        } else {
          this.pickEntity(id);
        }
      }, () => {
        that.shownrong = false
      });
    });


    this.nowDate();

    window.onresize = () => {
      return (() => {
        // window.innerHeight:浏览器的可用高度
        window.screenHeight = window.innerHeight
        this.screenHeight = window.screenHeight
      })()
    }

    //this.nhfx();


    //改变导航颜色
    this.navcolorchange();


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
    this.week = week;
    this.time = hh + ':' + mf;  						//时:分
    this.monthstart = mm + '-01';						//每个月1号
    this.monthday = mm + '-' + dd;					//今天，月-日


    this.newdate = yy + mm + dd

    //console.log(gettime, week)

    // 中间地图
    const element = document.getElementById('map_container');
    document.getElementById('full_screen').addEventListener('click', () => {
      if (screenfull.isEnabled) {
        screenfull.request(element); // 元素全屏
      }
    });
    document.addEventListener('fullscreenchange', (e) => {
      // 判断退出全屏的条件
      const isFull = document.fullscreenElement
      // isFull在退出全屏的时候 是null
      if (isFull == null) {
        // console.log('退出全屏了')
        this.isFullScreen = false
      }
    });
    equimentCount().then(res => {
      this.eqAll = res.data.all
      this.eqOffline = res.data.offline
      this.eqOnline = res.data.online
      this.eqAlarm = res.data.alarm
    })
    equimentType().then(res => {
      this.eqType = res.data;
      let data = [];
      res.data.forEach((i, index) => {
        data.push({value: i.num, name: i.name})
      })
      this.sblx(data);
    })
    alarmTrend({"interval": "7"}).then(res => {
      let dataArray = [];
      let data = [];
      res.data.forEach((i, index) => {
        data.push(i.num)
        dataArray.push(parseTime(i.dt, '{m}-{d}'))
      })
      this.gjqs(dataArray, data);
    }),
        totalElectricityByDay({"type":3,"deptId":""}).then(res => {
          if (res.data != null) {
            let dataArray = [];
            let nowData = [];
            let data = res.data;
            for (let key in data.now) {
              dataArray.push(key + '月')
              nowData.push(data.now[key])
            }
            this.nhfx(dataArray, nowData)
          }
        })
  },

  methods: {
    test() {
      this.jiankongshow = true;
      //this.jiankong(address.data)
      setTimeout(() => {
        this.jiankong2()
      }, 2000)
    },
    jiankong2() {
      if (flvjs.isSupported()) {
        let video = this.$refs.player;
        if (video) {
          console.log('cccccc')
          this.player = flvjs.createPlayer({
            type: "flv",
            isLive: true,
            url: `ws://localhost:8888/rtsp/1/?url=rtsp://admin:bjt@2018@171.20.1.221:554/Streaming/Channels/101`
          });
          this.player.attachMediaElement(video);
          try {
            this.player.load();
            this.player.play();
          } catch (error) {
            console.log("error")
            console.log(error);
          }
          ;
        }
      }
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
      console.log("视频弹框关闭了！")
      console.log(this.videoid)
      this.jiankongshow = false;
      let url = 'id=' + this.videoid
      this.$nextTick(() => {
        this.stopVedio(url)
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
    callbackfun(e) {
      console.log('callbackfun', e);
    },
    stopVedio(url) {
      console.log(this.videourl)
      this.player.destroy(this.videourl)
      stop(this.darwin_url, url).then(res => {
        console.log(res)
      })
    },
    poppage(src) {
      this.pagesrc = src
      this.pageshow = true

    },
    navcolorchange() {
      document.querySelector('.navbar').style.background = '#243547';
      document.querySelector('.tags-view-container').style.background = '#1e2d3e';
      document.querySelector('.el-breadcrumb__inner a').style.color = '#97a8be';
      document.querySelector('.navbar .right-menu .avatar-container .avatar-wrapper').style.color = '#fff';
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
        document.querySelector('.home').style.minHeight = '100vh';
        document.querySelector('.navbar').style.display = 'none';
        document.querySelector('.tags-view-container').style.display = 'none';
        document.querySelector('.hit').style.height = 'calc(100vh - 60px)';


      } else if (this.size == 'big') {
        this.size = 'small'
        document.querySelector('.sidebar-container').style.width = "";
        document.querySelector('.main-container').style.marginLeft = "";
        document.querySelector('.navbar').style.display = 'block';
        document.querySelector('.app-main').style.minHeight = 'calc(100vh - 84px)';
        document.querySelector('.home').style.minHeight = 'calc(100vh - 84px)';
        document.querySelector('.tags-view-container').style.display = 'block'
        document.querySelector('.hit').style.height = '100%';
      }
    },
    nowDate() {
      this.nowTimer = setInterval(() => {
        let nowDate = new Date();
        this.now = parseTime(nowDate)
      }, 1000)
    },
    beforeUnmount() {
      if (this.nowTimer) {
        clearInterval(this.nowTimer);
        this.nowTimer = null;
      }
    },
    dataInformation() {

    },
    sblx(data) {
      const chartmaindom = document.getElementById('sblx');
      chartmaindom.removeAttribute('_echarts_instance_');
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.echarts.init(document.getElementById('sblx'))

      myChart.setOption({
        tooltip: {
          trigger: 'item'
        },
        legend: {
          bottom: '2%',
          left: 'left',
          itemWidth: 6,
          itemHeight:6,
          textStyle: {
            color: '#ffffff',
            fontSize: 10,
          },
        },
        series: [
          {
            name: '设备类型',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '40%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {},
            labelLine: {
              show: false
            },
            data: data
          }
        ]
      });
      // 绘制图表
    },
    /*能耗分析*/
    nhfx(dataArray, data) {
      const chartmaindom = document.getElementById('nhfx');
      chartmaindom.removeAttribute('_echarts_instance_');
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.echarts.init(document.getElementById('nhfx'))
      myChart.setOption({

        tooltip: {
          trigger: 'axis',
          // axisPointer: {
          //   type: 'shadow'
          // }
        },
        grid: [
          {
            bottom: '20%',
            top: '15%',
            right: '2%',
						left: '20%'
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
          data: dataArray
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
            data: data,
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
    /*告警趋势*/
    gjqs(dataArray, data) {
      const chartmaindom = document.getElementById('gjqs');
      chartmaindom.removeAttribute('_echarts_instance_');
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.echarts.init(document.getElementById('gjqs'))
      myChart.setOption({
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
          data: dataArray
        },
        grid: [
          {
            bottom: '20%',
            top: '15%',
            right: '2%'
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
            data: data,
            type: 'line',
            smooth: true
          }
        ]
      });
      // 绘制图表
    },

    // nowDate() {
    //   setInterval(() => {
    //     let nowDate = new Date();
    //     this.now = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1)
    //         + "-" + nowDate.getDate() + "  " + nowDate.getHours() + ":" + nowDate.getMinutes() + ":" + nowDate.getSeconds()
    //   }, 1000)
    // },
    openxq(no, type, value, time) {
      this.openxqValue = value;
      this.openxqDt = time;
      getMeasuringInfo(no, type, this.valuejc).then(res => {
        let data = res.data

        this.measuringName = data.name
        this.measuringNo = data.no;
        this.measuringMax = data.max;
        this.measuringMin = data.min;

        let dataTitle = [];
        let dataArray = [];

        for (let key in data.dataList) {
          dataArray.push(data.dataList[key])
          dataTitle.push(parseTime(key))
        }

        this.dialogVisibleli = true;
        this.$nextTick(() => {
          this.jcsj(dataTitle, dataArray);
        })
      })
    },
    clickData(row, event, column) {

      console.log(row)
      this.dialogVisible = true
    },
    callback() {
      console.log('初始化地图成功')
    },
    pointAndLayerLoad(type, typeId) {
      loadHazardSource(type, typeId).then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].modelType == 1) {
            bjt3D.pointLoad(res.data[i].id, res.data[i].modelTypeId, res.data[i].modelPosition, getImgSrc(res.data[i].modelTypeId))
          } else {
            let label = res.data[i].modelLabel
            if (res.data[i].eventUrl != '' && null != res.data[i].eventUrl) {
              label = label + ' ▶';
							bjt3D.layerLoad2(res.data[i].id, label, res.data[i].modelTypeId, res.data[i].modelPosition, getLayerColor(res.data[i].modelTypeId))
            }else{
							bjt3D.layerLoad1(res.data[i].id, label, res.data[i].modelTypeId, res.data[i].modelPosition, getLayerColor(res.data[i].modelTypeId))
						}

          }
        }
        bjt3D.removeDefaultHandler();
      })
    },
    pointFilter(filter, typeId) {
      let typePoints = bjt3D.typePoints.get(parseInt(typeId));
      if (filter) {
        if (typePoints) {
          for (let i = 0; i < typePoints.length; i++) {
            bjt3D.remove(typePoints[i], null)
          }
        }
      } else {
        this.pointAndLayerLoad(1, typeId)
      }
    },
    positionFilter(filter) {
      let positions = bjt3D.positionPoints;
      if (filter) {
        this.stopSocket()
        for (let i = 0; i < positions.length; i++) {
          bjt3D.remove(positions[i], null)
        }
      } else {
        this.startSocket()
      }
    },
    layerFilter(filter) {
      if (filter) {
        let keys = bjt3D.typeLayers.keys();
        for (let i = 0; i < bjt3D.typeLayers.size; i++) {
          let typeLayer = bjt3D.typeLayers.get(parseInt(keys.next().value));
          if (typeLayer) {
            for (let i = 0; i < typeLayer.length; i++) {
              bjt3D.remove(typeLayer[i], null)
            }
          }
        }
      } else {
        this.pointAndLayerLoad(2, undefined)
      }
    },
    tcClick: function () {
      this.showtc = !this.showtc;
    },
    close: function () {
      this.showtc = false;
    },
    toPopup: function () {
      this.shownrong = true;
    },
    closePopup: function () {
      this.shownrong = false;
    },


    // 检测数据
    jcsj(dataTitle, dataArray) {
      const chartmaindom = document.getElementById('jcsj');
      chartmaindom.removeAttribute('_echarts_instance_');
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.echarts.init(document.getElementById('jcsj'))

      myChart.setOption({
        grid: [
          {
            bottom: '20%',
            top: '20%'
          },
        ],
        textStyle: {
          color: 'white'
        },
        xAxis: {
          type: 'category',
          data: dataTitle
        },
        yAxis: {
          type: 'value'
        },

        series: [
          {
            symbol: "none",
            data: dataArray,
            type: 'line'
          }
        ]
      });
      // 绘制图表
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
    showPowerImg() {
      this.showPowerIco = !this.showPowerIco;
      this.pointFilter(this.showPowerIco, 4);
    },
    showXiaofangImg() {
      this.showxiaofangIco = !this.showxiaofangIco;
      this.pointFilter(this.showxiaofangIco, 8);
    },
    showParamImg() {
      this.showParamIco = !this.showParamIco;
      this.pointFilter(this.showParamIco, 12);
    },
    refreshPoint() {
      bjt3D.removeAll();
      this.pointAndLayerLoad();
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
    isJson(str) {
      if (typeof str === 'string') {
        let obj = JSON.parse(str);
        return !!(typeof obj == 'object' && obj);
      }
    },
    getSocketData(e) {  // 创建接收消息函数
      const data = e
      console.log(data)
      let entity = bjt3D.viewer.entities.getById(data.tagId)
      let position = {
        longitude: data.longitude,
        latitude: data.latitude
      }
      if (typeof entity != 'undefined') {
        bjt3D.pointMove(data.tagId, position, 200)
      } else {
        bjt3D.pointPosition(data.tagId, data.name, positionImg(), position)
        bjt3D.positionPoints.push(data.tagId);
      }
    },
    pickEntity(id) {
      this.measuringPointList = []
      this.pickId = id;
      let flag = bjt3D.positionPoints.indexOf(id);
      if (flag == -1) {
        //biaozhu
        getModelInfo(id).then(info => {
          let infoData = info.data;
          switch (infoData.modelTypeId) {
            case 9:
              getCameraByPoint(id).then(address => {
                console.log(address.data)
                if (address.data != null) {
                  this.jiankongshow = true;
                  localStorage.videourl = address.msg;
                  this.darwin_url = address.msg;
                  this.jiankong(address.msg , address.data)
                }
              })
              console.log('这是摄像头1')
              break
            default:
              this.shownrong = true
              selectSensorData(id).then(res => {
                this.measuringPointList = res.data;
              })
          }
        })
      } else {
        //renyuandingwei
        this.ddialogVisible = true
      }
    },
    timelineClick: function () {
			this.valuetime = 0;
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      timeLine(this.pickId, this.dateValue[1], this.dateValue[0]).then(res => {
        let data = res;
        this.max = data.data.length;
        this.data = data.data;
        this.showtimeline = true;
        this.ddialogVisible = false;
        this.stopSocket()
        bjt3D.removeAll()
        if (data.data.length !== 0) {
          let linePosition = [];
          for (let i = 0; i < data.data.length; i++) {
            linePosition.push(bjt3D.parseCartesian3(data.data[i]));
          }
          bjt3D.trajectory(linePosition);
          bjt3D.pointPosition(data.data[0].tagId, data.data[0].name, positionImg(), data.data[0]);
          this.timer = setInterval(() => {
            this.valuetime += 1;
          }, 1000);
        }
        loading.close();
      })
    },
    handleClose2(done) {
      this.startSocket();
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
    },
    closeTimeLine() {
      this.refreshPoint()
      this.showtimeline = false;
      this.ddialogVisible = false;
      bjt3D.removeAll();
      this.startSocket();
      clearInterval(this.timer)
    },
    formatToolTip(v) {
      let checkData = this.data[v];
      if (typeof checkData === 'undefined') {
        return;
      }
      bjt3D.pointMove(this.data[v].tagId, this.data[v], 10);
      let date = new Date(checkData.rowKey - 0);
      let str = date.getMonth() + "月" + date.getDate() + "日 " + date.getHours() + "点" + date.getMinutes() + "分";
      this.sliderstr = str

      const length = this.max
      const progress = v
      const left = (progress * 100) / (length * 100) * 100
      this.style.left = `${left}%`

      return str;
    },
    startSocket() {
      let that = this
      key().then(res => {
        let url = import.meta.env.VITE_WS_BASE_API + '/socket/websocket/' + res.data.key;
        that.wsObj = new WebSocket(url);
        websocketCommand(that.wsObj, 'create', 500, '心跳', this.getSocketData, this.reconnectWs);
      });
    },
    stopSocket() {
      this.wsObj.close(1000);
    }


  },

}
</script>


<style scoped lang="scss">
p {
  margin: 0;
}

.fl {
  float: left;
}

.border-p {
  padding: 15px
}

.text-cen {
  text-align: center;
}

.text-right {
  text-align: right;
}

.mr-20 {
  margin-right: 20px;
}

.title {
  h4 {
    font-size: 16px;
    margin: 0;

    img {
      vertical-align: middle;
      margin-right: 6px;
      padding: 2px 0;
    }
  }
}

.home {
  background: url("@/assets/images/screen/screen-bg.jpg") no-repeat;
  height: calc(100vh - 84px);
  color: #aaddff;
  font-size: 14px;
  background-size: 100% 100%;

  .head {
    background: url("@/assets/images/screen/head.png") center;
    color: #FFFFFF;
    height: 55px;
    background-size: 100% 100%;
    position: relative;

    h4 {
      margin: 0;
      padding-top: 8px;
      text-align: center;
      font-size: 30px;
      background-image: -webkit-linear-gradient(bottom, #1860c9, #07cff3);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: bold;
    }

    span {
      position: absolute;
      left: 40px;
      top: 15px;
      color: #2aa7d3;
    }

    .fangda {
      position: absolute;
      right: 20px;
      top: 20px;
      font-size: 18px;
      color: #2aa7d3;
    }

  }

  .contermy {
    height: calc(100% - 40px);
    padding: 0 0px 20px;

    .hit {
      height: 100%
    }

    .part-3 {
      background: url("@/assets/images/screen/left-2-bak.png") no-repeat;
      background-size: 100% 100%;
      height: 24%;
      margin-bottom: 2.4%;

      .height-bom {
        height: 14vh;
      }
    }

    .left-con {
      height: 100%;

      .part-1 {
        background: url("@/assets/images/screen/left-1.png") no-repeat;
        background-size: 100% 100%;
        height: 19%;
        margin-bottom: 1.9%;

        .part-1-li {
          background: url("@/assets/images/screen/pati-1bg.jpg") no-repeat;
          color: #ffb956;
          font-size: 22px;
          font-weight: bold;
          text-align: center;
          width: 70px;
          height: 70px;
          background-size: cover;
          line-height: 70px;
          margin: 0 auto;

          span {
            transform: scale(0.8, 1);
            white-space: nowrap;
          }
        }

      }

      .part-2 {
        background: url("@/assets/images/screen/left-2-bak.png") no-repeat;
        background-size: 100% 100%;
        height: 29%;
        margin-bottom: 2.9%;

        .echart-bom {
          height: 18vh;

          .echart-con {
            height: 100%;
          }

          .sblx-r {
            padding-right: 30px;

            .sblx-ul {
              .sblx-li {
                background: url("@/assets/images/screen/part7-li.jpg") no-repeat;
                color: #aaddff;
                font-size: 12px;
                height: 30px;
                line-height: 30px;
                background-size: 100% 100%;
                padding: 0 10px;
                margin-bottom: 5px;

                .number {
                  span {
                    color: #ffb956;
                  }
                }
              }
            }
          }
        }
      }


    }

    .con-nr {
      height: 100%;
      position: relative;

      .map-border {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background: url(@/assets/images/screen/map-border.png) no-repeat;
        background-size: 100% 100%;
        pointer-events: none;
      }

      .con-nr-1 {
        position: relative;
        height: 100%;

        #map_container {
          height: 100%;
        }

        #full_screen {
          position: absolute;
          right: 10px;
          top: 10px;
        }

        img {
          width: 100%;
          height: 100%;
        }
      }

      .con-nr-2 {
        padding: 10px 30px;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 73%;
        margin: 0 1%;
        background: url("@/assets/images/screen/bottom-bg.png") no-repeat;
        background-size: 100% 100%;

        .bot-left span {
          vertical-align: text-bottom;
          margin-left: 20px;
        }

        .bot-right {
          text-align: right;

          .btn {
            display: inline-block;
            margin-left: 10px;
            font-size: 20px;
            color: #2aa5d1;
            width: 44px;
            height: 44px;
            padding: 10px 0 0;
            border: 1px solid #2aa5d1;
            text-align: center;
          }
        }

        .gaojingxx {

          :deep(.el-table__header-wrapper) {
            th {
              background-color: #1c2e6a !important;
              text-align: center;
              color: #06b2f1;
              padding: 2px 0;
              height: 30px !important;
            }
          }

          :deep(.el-table) {
            --el-table-border-color {
              border-bottom: none !important;
            }
          }

          :deep(.el-table__cell) {
            background: #071f55 !important;
            color: #FFFFFF;
            padding: 2px 0;
            border-bottom: none !important;
            text-align: center;
            font-size: 12px;
          }

          :deep(.el-table__row--striped) {
            .el-table__cell {
              background: #12295a !important;
            }
          }
        }
      }
    }

    .right-con {
      height: 100%;
      position: absolute;
      right: 0;
      bottom: 0;
      z-index: 9;
      width: calc(25% - 5px);
    }

  }


  .cursor {
    cursor: pointer
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .text-align-r {
    text-align: right;
  }

  .colorblue {
    color: #8bb5f9;
  }

  .af-item {
    background: rgba(2, 11, 45, 0.8);
  }

  .danger_bottom {
    width: 100%;
    height: 100%;
  }

  .tanchunr {
    :deep(.el-dialog__body) {
      padding: 0 20px 20px !important;
      background: #1c2a5e !important;
      color: #fff;

      h4 {
        margin: 0 0 6px 0;
        color: #fff;
      }

      .tc-con {
        margin-bottom: 20px;

        .tc-nrli {
          height: 20px;
          line-height: 20px;

          .tc-lname {
            color: #83b4ff;
            padding-right: 10px;
            width: 70px;
            text-align: right;
          }
        }
      }


    }

    :deep(.el-dialog__header) {
      background: #1c2a5e !important;
      padding-bottom: 30px;

      .el-dialog__title {
        color: #fff;
      }

    }
  }

  .dw-indexcon {
    width: 100%;
    height: 100vh;

    .dw-head {
      height: 7.40741vh;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      color: #e4effc;
      padding: 1.38889vh 1.5625%;
      position: relative;
      z-index: 1;
      font-size: 14px;

      .head-left {
        color: #ffffff;
        font-weight: bold;

        .weather {
        }
      }

      .head-right {
        float: right;

        :deep(.el-input__inner) {
          background: transparent;
        }

        .jinggao {
          img {
            width: 50px;
            padding-left: 10px;
          }
        }
      }

      .head-tit {
        text-align: center;

        h4 {
          color: #e4effc;
          border-radius: 3px;
          border: 1px solid rgba(0, 139, 255, .3);
          text-align: center;
          box-shadow: inset 0 0 10px 0 rgba(36, 165, 255, .66);
          padding: 10px 30px;
          margin: 0;
          width: 70%;
        }
      }
    }

    .dw-con {
      height: 92.59259vh;
      position: relative;
      pointer-events: none;
      width: 100%;
      z-index: 1;

      //图标
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

        .togglebar-icon {
          float: left;
        }
      }

      //右侧图标
      .right-ico {
        position: absolute;
        right: 100px;
        top: .92593vh;
        border-radius: 2px;
        width: 300px;
        height: 42px;
        padding: 9px 4px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        pointer-events: auto;

        .right-nr {
          display: flex;
          height: 100%;

          input {
            width: 170px;
            height: 100%;
            color: #fff;
            background: transparent;
            border: 1px solid #275793;
            margin-left: .92593vh;
            padding: 0 .25rem;
          }

          button {
            width: 1.5rem;
            height: 1.5rem;
            padding: 0;
            margin: 0 6px;
            color: #fff;
            font-size: .75rem;
            border: none;
            background: -webkit-gradient(linear, left top, right top, from(#106cb6), to(#014886));
            background: linear-gradient(90deg, #106cb6 0, #014886);
            outline: none;

            img {
              width: 100%;
            }
          }
        }
      }

      .leftbar {
        .padd {
          padding: .92593vh;
        }

        .partl-title {
          font-size: .71291rem;
          color: #02bcf9;
          margin-bottom: 1.38889vh;
          width: 100%;
          height: 2.77778vh;
          background-image: url("@/assets/images/head-tit.png");
          background-position: 0 0, 100% 0;
          background-size: auto 2.77778vh, auto 2.77778vh;
          background-repeat: no-repeat, no-repeat;
          padding-left: 14px;
        }

        position: absolute;
        left: .52083%;
        top: .92593vh;
        height: 90.74074vh;
        width: 22%;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        font-size: .75rem;
        pointer-events: none;

        .danger_item {
          padding: .92593vh;
        }

        .data-info {
          .el-row {
            height: 100%;
          }

          flex-grow: 0;
          height: 4.375rem;
          pointer-events: auto;

          .l-info-box {
            height: 100%;
            border-radius: 2px;
            border: 1px solid #808cb2;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
            -ms-flex-direction: column;
            flex-direction: column;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            font-size: .75rem;

            .l-info-title {
              color: #83b4ff;
              margin-bottom: .50922rem;
            }

            .l-info-num {
              color: #e4effc;
              font-size: 1.27305rem;
            }
          }

        }

        .weilan {
          margin-top: .625rem;
          height: calc(60% - 7.25rem);
          pointer-events: auto;

          .search {
            width: 100%;
            height: 2.96296vh;
            margin: .92593vh 0;
            overflow: hidden;
            font-size: .75rem;

            input {
              width: 70%;
              height: 100%;
              color: #e4effc;
              background: rgba(2, 11, 45, .7);
              border: 1px solid #165b84;
              padding: 0 0;
              text-indent: 1em;
              outline: none !important;
            }

            button {
              width: calc(30% - 1.875rem);
              height: 2.96296vh;
              float: right;
              color: #fff;
              font-size: .71291rem;
              border: none;
              background: -webkit-gradient(linear, left top, left bottom, from(#0667c0), to(#0057b4));
              background: linear-gradient(180deg, #0667c0, #0057b4);
              filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#106CB6", endColorstr="#014886", GradientType=1);
              border-radius: 3px;
            }
          }

          .weilan-con {
            height: 29.62963vh;
            //修改行内线
            :deep(.el-table td, .building-top .el-table th.is-leaf) {
              border-bottom: 1px solid #3b3b3b;
            }

            //底线
            :deep(.el-table__inner-wrapper::before) {
              border-bottom: 1px solid #3b3b3b;
            }

            //背景颜色
            :deep(.el-table) {
              tr {
                background: transparent;
              }
            }

            //表头
            :deep(.el-table .el-table__header-wrapper th) {
              background-color: transparent !important;
              color: rgb(236, 246, 255) !important;
            }
          }

          //修改鼠标选中行
          :deep(.el-table__row > td) {
            background: transparent;
          }


        }

        .echart_box {
          margin-top: .625rem;
          height: 19.07407vh;
          pointer-events: auto;

          .echart_bottom {
            width: 100%;
            height: 13.88889vh;
          }
        }
      }

      //底部
      .layout-bottom {
        position: absolute;
        left: calc(2% + 0.9rem);
        bottom: 0;
        width: auto;
        height: 10%;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        pointer-events: auto;

        .layout-bottomli:last-child {
          .shuxian :after {
            content: "";
          }
        }

        .layout-botlinr {
          width: 6.61985rem;
          height: 8.33333vh;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          -ms-flex-direction: column;
          flex-direction: column;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          justify-content: center;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          font-size: .71291rem;
          color: #e4effc;
          position: relative;
          padding: .92593vh;
          text-align: center;
          cursor: pointer;

          .bottname {

          }

          .bottshu {
            font-size: 1.5rem;
          }

          .shuxian :after {
            content: "|";
            color: #5b67a9;
            font-size: 1.2rem;
            position: absolute;
            right: 0;
          }
        }
      }

      //右侧弹出
      .r-tu {
        width: 45%;
        position: absolute;
        z-index: 2000;
        top: .92593vh;
        bottom: 0;
        width: 45%;
        height: 90.74074vh;
        border-left: 1px solid #28315c;
        -webkit-box-shadow: 0 0.1875rem 0.75rem rgba(0, 0, 0, .12);
        box-shadow: 0 0.1875rem 0.75rem rgba(0, 0, 0, .12);
        -webkit-transition: all .3s ease;
        transition: all .3s ease;
        right: 0;
        padding: 0;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        pointer-events: auto;

        .r-tu-con {
          width: 100%;
          padding: 0.92593vh;

          .toptit {
            width: 100%;
            width: 100%;
            height: 4.62963vh;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;
            justify-content: space-between;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            border-bottom: 1px solid #28315c;

            .title_text {
              color: #02bcf9;
            }

            .close {
              color: #fff;
              cursor: pointer;
            }

          }

          .r-con {
            padding: 10px 0;

            :deep(.el-input__inner) {
              background-color: transparent;
            }

            .chaxun {
              margin-left: 10px;
            }
          }

          .r-list {

            //修改行内线
            :deep(.el-table td, .building-top .el-table th.is-leaf) {
              border-bottom: 1px solid #3b3b3b;
            }

            //底线
            :deep(.el-table__inner-wrapper::before) {
              border-bottom: 1px solid #3b3b3b;
            }

            //背景颜色
            :deep(.el-table) {
              tr {
                background: transparent;
              }
            }

            //表头
            :deep(.el-table .el-table__header-wrapper th) {
              background-color: transparent !important;
              color: rgb(236, 246, 255) !important;
              border-bottom: 1px solid #3b3b3b !important;
            }

            //修改鼠标选中行
            :deep(.el-table__row > td) {
              background: transparent;
            }


          }
        }

      }

      //0524
      .nrong-con {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        pointer-events: auto;
      }

      .nronglist {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        pointer-events: auto;
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
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


      //标点弹出
      .popuplist {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        pointer-events: auto;

        :deep(.el-dialog) {
          background: rgba(2, 11, 45, 0.9);

          .el-dialog__title {
            color: #ffffff;
          }

          .el-dialog__body {
            color: #ffffff;
            padding: 10px 20px 20px;
            border-top: 1px solid #6c6c6c;
          }
        }

        .popuplistcon {
          .el-row {
            height: 30px;
            line-height: 30px;
          }

          h4 {
            font-size: 16px;
            line-height: 32px;
            margin: 0;
          }

          .chart {
            margin-top: 20px;

            .chart-title {
              margin-bottom: 8px;
            }

            .select-dow {
              :deep(.el-input__inner) {
                background: transparent;
              }
            }

            .chart-con {

              background-color: RGBA(255, 255, 255, 0.2);
              height: 200px;
            }
          }

          .popuplistli {

          }
        }

        .el-dialog__body {
          padding: 10px 20px 20px;
        }
      }


    }


    .dw-map {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0px;
      top: 0px;
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


  //时间轴
  .timean {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    pointer-events: auto;
  }

  .time-bg {
    width: 90%;
    margin: 0 auto;
    margin-top: 50px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    pointer-events: auto;
    padding: 5px 10px;
    position: relative;

		.return{
			img{
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

  .jiankongtanchu {
    :deep(.el-dialog) {
      background: rgb(36, 53, 71);

      .player-content {
        border: 1px solid rgb(9, 190, 197);
      }
    }
  }

}

@media screen and (min-width: 2000px) {
  .border-p {
    padding: 40px 30px;
  }
  .home {
    .contermy {
      height: calc(100% - 100px);

      .left-con {
        .part-1 {
          .part-1-li {
            width: 110px;
            height: 110px;
            line-height: 110px;
          }
        }

        .part-2 {
          .echart-bom {
            .sblx-r {
              .sblx-ul {
                .sblx-li {
                  height: 50px;
                  line-height: 50px;
                  margin-bottom: 15px;
                }
              }
            }
          }
        }
      }
    }

    .right-con {
      .right-con-1 {
        .xjsb-nr {
          margin: 30px 0 20px;

          .shxj-li {
            height: 45px;
            line-height: 45px;
            padding: 0 30px;
          }
        }

        .right-con-1li {
          margin-bottom: 50px;

          .linr {
            padding: 10px !important;
          }
        }
      }

      .right-con-2 {
        .sbwb-con {
          margin: 30px 0 40px;

          .linr {
            padding: 10px !important;
          }
        }
      }
    }

  }

}

.chanxiantanchu {
  :deep(.el-overlay) {
    left: 200px;
    top: 80px;

    .el-overlay-dialog {
      position: absolute;
    }

    .el-dialog {
      height: calc(100vh);
      margin: 0 !important;
      background: transparent;

      .el-dialog__header {
        padding: 15px 50px 15px 30px;
        display: inline-block;
        background-size: 100% 100% !important;
        position: absolute;
        right: 0;
        top: 0;
      }

      .el-dialog__headerbtn {
        color: #949fa1;
        background: rgba(12, 28, 46, 0.9);
        height: 35px;
        width: 35px;
        line-height: 40px;
        text-align: center;
        border-radius: 50%;
      }

      .dialog-title {
        color: #00ebff;
        margin: 0 0 20px;
        font-weight: bold;
      }

      .el-dialog__body {
        background: rgba(12, 28, 46, 0.5);
        border-radius: 0;
        padding: 0;
        height: 100%;

        iframe {
          border: 0;
        }
      }
    }
  }
}

//1366屏幕相应
@media screen and (max-width: 1366px) {
  .home {
    .border-p{
      padding: 5px;
      position: relative;
      .juzong{
      position: absolute;
      top: 60%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
    }
    }
    .title{
      h4{
        font-size: 14px;
        img{
          width: 18px;
        }
      }
    }
    .contermy {
      .left-con {
        .part-1 {
          .text-cen{
            font-size: 12px;
          }
          .part-1-li{
            width: 40px;
            height: 40px;
            line-height: 40px;
            font-size: 18px;
          }
        }
        .part-2 {
          .echart-bom {
            .el-col-14{
              max-width: 65%;
              flex: 65%;
            }
            .el-col-10{
              max-width: 35%;
              flex: 35%;
            }
            .sblx-r {
              .sblx-ul {
                .sblx-li{
                  height: auto;
                  line-height: inherit;
                  padding: 0;
                  margin-bottom: 5px;
                  border-bottom: 1px solid #054984;
                  background: none;
                }
              }
            }
          }
        }


      }
    }
  }


}

</style>




