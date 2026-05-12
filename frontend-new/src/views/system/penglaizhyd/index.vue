<template>
  <div class="home">
    <!-- 地图  判断如果灰色图标，就加grey样式 -->
    <div id="allmap" class="allmap">
      <div class="item" v-for="(item, index) in regionList" :key="index" :style="item.style">
        <div class="market" @click="mapinfoShow(item)">
          <img src="@/assets/images/penglaiaqyd/map-ico.png"/>
        </div>
        <div class="info" v-show="item.infoshow === true">
          <div @click="item.infoshow = false" class="close">
            <el-icon>
              <Close/>
            </el-icon>
          </div>
          <h5>
            <img src="@/assets/images/penglaiaqyd/map-info-ico1.png"/>
            名称：{{ item.deptName }}
          </h5>
          <h5>
            <img src="@/assets/images/penglaiaqyd/map-info-ico2.png"/>
            地址：{{ item.address }}
          </h5>
          <h5>
            <img src="@/assets/images/penglaiaqyd/map-info-ico3.png"/>
            状态：正常
            <img src="@/assets/images/penglaiaqyd/map-state-normal.png"/>
          </h5>
          <div class="line">
            <img src="@/assets/images/penglaiaqyd/map-info-line.png"/>
          </div>
          <div class="btn" @click="regionRightDetails(item)">
            <img src="@/assets/images/penglaiaqyd/map-btn-ico.png"/>
            详情
          </div>
          <div class="tag">
            <img src="@/assets/images/penglaiaqyd/map-info-tag.png"/>
          </div>
        </div>
      </div>
    </div>

    <!-- 顶部 -->
    <div class="top">
      <div class="top-middle">蓬莱区智慧用电管控平台</div>
      <div class="top-left">
        <div style="margin-bottom: 5px;">
          <!--          <i class="el-icon-time"></i>-->
          <span>{{ datetime }}</span>
        </div>
        <div>
          <!--          <i class="el-icon-sunny"></i>-->
          <span>
						<iframe allowtransparency="true" frameborder="0" width="317" height="50"
                    scrolling="no"
                    src="//tianqi.2345.com/plugin/widget/index.htm?s=3&z=1&t=1&v=0&d=1&bd=0&k=&f=ffffff&ltf=ffffff&htf=ffffff&q=1&e=0&a=1&c=54511&w=317&h=50&align=left">
						</iframe>
	        </span>
        </div>
      </div>
    </div>

    <!-- 右侧菜单 -->
    <div class="rightlist-btn" @click="rightlistBtn" v-if="rightlistbtn == true">
      <img src="@/assets/images/penglaiaqyd/rightlist-btn.png"/>
    </div>
    <div class="rightlist">
      <el-drawer
          v-model="rightdrawer"
          direction="rtl"
          :with-header="false"
      >
        <div class="rightlist-openbtn" @click="rightlistClose">
          <img src="@/assets/images/penglaiaqyd/rightlist-openbtn.png"/>
        </div>
        <div class="tit">企业列表</div>
        <div class="table" id="table2">
          <el-table
              :data="regionList"
              height="100%"
              tripe
              style="width: 100%"
          >
            <el-table-column align="center"
                             type="index"
                             label="序号"
                             width="50">
            </el-table-column>
            <el-table-column align="center"
                             prop="deptName"
                             label="企业名称">
            </el-table-column>
            <el-table-column align="center"
                             prop="detail"
                             label="查看"
                             width="50">
              <template #default="scope">
                <div @click="regionRightDetails(scope.row)" style="cursor: pointer;">
                  <el-icon :size="16">
                    <Document/>
                  </el-icon>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-drawer>
    </div>

    <!--		<div id="rightbox" class="rightbox">
          <div class="lfbx">
            <div class="lfbx-topline">
              <img src="@/assets/images/penglaiaqyd/box-bg-top.png" width="100%"/>
            </div>
            <div class="rightlist">
              <div class="tit">企业列表</div>
              <div class="table" id="table2">
                <el-table
                  :data="regionList"
                  height="100%"
                  tripe
                  style="width: 100%"
                >
                  <el-table-column align="center"
                    type="index"
                    label="序号"
                    width="50">
                  </el-table-column>
                  <el-table-column align="center"
                    prop="name"
                    label="企业名称">
                  </el-table-column>
                  <el-table-column align="center"
                    prop="detail"
                    label="查看"
                    width="50">
                    <template #default="scope">
                      <div @click="regionRightDetails(scope.row)" style="cursor: pointer;">
                        <el-icon :size="16"><Document /></el-icon>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="lfbx-botline">
              <img src="@/assets/images/penglaiaqyd/box-bg-bot.png" width="100%"/>
            </div>
          </div>
        </div>-->
    <!-- 左侧 -->
    <div id="leftbox" class="leftbox">
      <div class="lfbx lfbx-1">
        <div class="lfbx-topline">
          <img src="@/assets/images/penglaiaqyd/box-bg-top.png" width="100%"/>
        </div>
        <div class="lfbx-mid">
          <el-row :gutter="10" class="midmid">
            <el-col :span="12">
              <el-row :gutter="10">
                <el-col :span="12">
                  <img src="@/assets/images/penglaiaqyd/lefttop-ico1.png" width="50"/>
                </el-col>
                <el-col :span="12">
                  <h5>接入企业</h5>
                  <p class="color1">{{ countCompany }}</p>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="12">
              <el-row>
                <el-col :span="12">
                  <img src="@/assets/images/penglaiaqyd/lefttop-ico2.png" width="50"/>
                </el-col>
                <el-col :span="12">
                  <h5>当前报警</h5>
                  <p class="color2">{{ countAlarm }}</p>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div class="lfbx-botline">
          <img src="@/assets/images/penglaiaqyd/box-bg-bot.png" width="100%"/>
        </div>
      </div>

      <!-- 当前报警 -->
      <div class="lfbx lfbx-2">
        <div class="lfbx-topline">
          <img src="@/assets/images/penglaiaqyd/box-bg-top.png" width="100%"/>
        </div>
        <div class="lfbx-mid">
          <div class="tit">当前报警</div>
          <div class="table" id="table1">
            <el-table
                :data="warnList"
                height="100%"
                tripe
                style="width: 100%">
              <el-table-column
                  prop="xhDt" align="center"
                  label="时间"
                  width="120">
              </el-table-column>
              <el-table-column
                  prop="deptName" align="center"
                  label="企业">
              </el-table-column>
              <el-table-column
                  prop="yxSerialName" align="center"
                  label="报警事件"
                  width="80">
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="lfbx-botline">
          <img src="@/assets/images/penglaiaqyd/box-bg-bot.png" width="100%"/>
        </div>
      </div>

      <!-- 报警统计 -->
      <div class="lfbx lfbx-3">
        <div class="lfbx-topline">
          <img src="@/assets/images/penglaiaqyd/box-bg-top.png" width="100%"/>
        </div>
        <div class="lfbx-mid">
          <div class="tit">报警统计</div>
          <div class="tabs">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
              <el-tab-pane label="报警类型" name="first">
                <div class="tabscon one">
                  <div class="datachoose">
                    <el-row>
                      <el-col :span="3">日期</el-col>
                      <el-col :span="8">
                        <el-date-picker
                            v-model="begainDate"
                            type="date"
                            value-format="YYYY-MM-DD">
                        </el-date-picker>
                      </el-col>
                      <el-col :span="1">－</el-col>
                      <el-col :span="8">
                        <el-date-picker
                            v-model="endDate"
                            type="date"
                            value-format="YYYY-MM-DD">
                        </el-date-picker>
                      </el-col>
                      <el-col :span="4">
                        <el-button size="mini" @click="selectByDate()">查询</el-button>
                      </el-col>
                    </el-row>
                  </div>
                  <div id="echart1" class="echart1"></div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="报警趋势" name="second">
                <div class="tabscon two">
                  <div id="echart2" class="echart2"></div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="报警排名" name="third">
                <div class="tabscon three">
                  <div class="datachoose">
                    <el-row>
                      <el-col :span="3">日期</el-col>
                      <el-col :span="8">
                        <el-date-picker
                            v-model="begainDate2"
                            type="date"
                            value-format="YYYY-MM-DD">
                        </el-date-picker>
                      </el-col>
                      <el-col :span="1">－</el-col>
                      <el-col :span="8">
                        <el-date-picker
                            v-model="endDate2"
                            type="date"
                            value-format="YYYY-MM-DD">
                        </el-date-picker>
                      </el-col>
                      <el-col :span="4">
                        <el-button size="mini" @click="getRanking()">查询</el-button>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="table" id="table2">
                    <el-table
                        :data="rankingList"
                        height="100%"
                        tripe
                        style="width: 100%">
                      <el-table-column
                          type="index"
                          label="排名"
                          width="50">
                      </el-table-column>
                      <el-table-column
                          prop="deptName"
                          label="企业名称">
                      </el-table-column>
                      <el-table-column
                          prop="count"
                          label="报警件数"
                          width="70">
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="lfbx-botline">
          <img src="@/assets/images/penglaiaqyd/box-bg-bot.png" width="100%"/>
        </div>
      </div>
    </div>

    <!-- 详情弹出 -->
    <div class="detailDialog">
      <el-dialog
          v-model="drawer"
          width="80%"
          :show-close="false"
      >
        <template #title>
          <div class="myheader">
            <img src="@/assets/images/penglaiaqyd/detail-toptitico.png" width="20"/>
            企业明细
          </div>
          <div class="close" @click="drawer = false">
            <el-icon :size="24">
              <CircleClose/>
            </el-icon>
          </div>
        </template>
        <div class="baseinfo">
          <el-row>
            <el-col :span="8">
              <img src="@/assets/images/penglaiaqyd/detail-info-ico1.png" width="50"/>
              <div class="right">
                <h5>企业名称</h5>
                <h4>{{ deptInformation.deptName }}</h4>
              </div>
            </el-col>
            <el-col :span="6">
              <img src="@/assets/images/penglaiaqyd/detail-info-ico2.png" width="50"/>
              <div class="right">
                <h5>企业地址</h5>
                <h4>{{ deptInformation.address }}</h4>
              </div>
            </el-col>
            <el-col :span="5">
              <img src="@/assets/images/penglaiaqyd/detail-info-ico3.png" width="50"/>
              <div class="right">
                <h5>联系人</h5>
                <h4>{{ deptInformation.leader }}</h4>
              </div>
            </el-col>
            <el-col :span="5">
              <img src="@/assets/images/penglaiaqyd/detail-info-ico4.png" width="50"/>
              <div class="right">
                <h5>联系电话</h5>
                <h4>{{ deptInformation.phone }}</h4>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="dialogmain">
          <el-row :gutter="10">
            <el-col :span="12">
              <div class="botleft">
                <div class="tit">
                  |<span>用电监测</span>|
                </div>
                <el-row :gutter="10" class="botleftrow">
                  <el-col :span="7">
                    <div class="leftitem">
                      <img src="@/assets/images/penglaiaqyd/lefttop-ico1.png" width="50"/>
                      <div class="itemword">
                        <h5>接入设备</h5>
                        <p style="color: #fa6689;">{{ sensorList.length }}</p>
                      </div>
                    </div>
                    <div class="leftitem">
                      <img src="@/assets/images/penglaiaqyd/lefttop-ico2.png" width="50"/>
                      <div class="itemword">
                        <h5>当前报警</h5>
                        <p style="color: #ab74fb;">{{ companyAlarm.length }}</p>
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="17">
                    <div class="bluetit">
                      <img src="@/assets/images/penglaiaqyd/detail-titico1.png" width="20"/>
                      当前报警
                    </div>
                    <div class="table">
                      <el-table
                          :data="companyAlarm"
                          height="100%"
                          tripe
                          style="width: 100%">
                        <el-table-column
                            prop="xhDt" align="center"
                            label="时间"
                            width="120">
                        </el-table-column>
                        <el-table-column
                            prop="equipmentName" align="center"
                            label="设备">
                        </el-table-column>
                        <el-table-column
                            prop="yxSerialName" align="center"
                            label="报警事件"
                            width="80">
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-col>
                </el-row>
                <div class="botchart">
                  <div class="bluetit">
                    <img src="@/assets/images/penglaiaqyd/detail-titico2.png" width="20"/>
                    报警统计
                  </div>
                  <el-tabs tab-position="left" @tab-click="detailTabClick">
                    <el-tab-pane label="报警类型">
                      <div id="echart3"></div>
                    </el-tab-pane>
                    <el-tab-pane label="报警趋势">
                      <div id="echart4"></div>
                    </el-tab-pane>
                    <el-tab-pane label="报警排名">
                      <div class="table" id="table2">
                        <el-table
                            :data="alarmSort"
                            height="100%"
                            tripe
                            style="width: 100%">
                          <el-table-column
                              type="index"
                              label="排名"
                              width="50">
                          </el-table-column>
                          <el-table-column
                              prop="name"
                              label="设备">
                          </el-table-column>
                          <el-table-column
                              prop="value"
                              label="报警件数"
                              width="70">
                          </el-table-column>
                        </el-table>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="botright">
                <div class="tit">
                  |<span>设备列表</span>|
                </div>
                <div class="equiplist">
                  <el-row>
                    <el-col
                        :span="4" v-for="(item, index) in equiplist"
                        :key="index"
                        :class="[item.active===1?'item active':'item']"
                        @click="equipTab(item)"
                    >
                      <div class="sblbitembx">
                        <div v-if="item.status === 1">
                          <img src="@/assets/images/penglaiaqyd/eqonline.png"/>
                          <h5 style="color: #22ac38;">在线</h5>
                        </div>
                        <div v-if="item.status === 0">
                          <img src="@/assets/images/penglaiaqyd/eqoutline.png"/>
                          <h5 style="color: #fc3a3a;">离线</h5>
                        </div>
                        <h3>{{ item.name }}</h3>
                        <!--<h4>设备名称</h4>-->
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <div class="equipinfo">
                  <div class="bluetit">
                    <img src="@/assets/images/penglaiaqyd/detail-titico3.png" width="20"/>
                    实时数据
                  </div>
                  <div class="eqinfoli">
                    <el-row :gutter="15">
                      <el-col :span="6" class="item">
                        <div class="infotit">
                          <img src="@/assets/images/penglaiaqyd/detail-dataico1.png"/>
                          <div class="infotitrt">
                            <h4>功率</h4>
                            <h5>（kW）</h5>
                          </div>
                        </div>
                        <p>有功功率<span>{{ currentData.activePower }}</span></p>
                        <p>A相有功功率<span>{{ currentData.activePowerA }}</span></p>
                        <p>B相有功功率<span>{{ currentData.activePowerB }}</span></p>
                        <p>C相有功功率<span>{{ currentData.activePowerC }}</span></p>
                        <div class="btn normal" v-if="currentData.powerYuex === false">
                          <el-icon>
                            <CircleCheck/>
                          </el-icon>
                          未发现异常
                        </div>
                        <div class="btn normal" v-if="currentData.powerYuex === true">
                          <el-icon>
                            <Warning/>
                          </el-icon>
                          发现异常
                        </div>
                      </el-col>
                      <el-col :span="6" class="item">
                        <div class="infotit">
                          <img src="@/assets/images/penglaiaqyd/detail-dataico3.png"/>
                          <div class="infotitrt">
                            <h4>电压</h4>
                            <h5>（V）</h5>
                          </div>
                        </div>
                        <p>A相电压<span>{{ currentData.voltageA }}</span></p>
                        <p>B相电压<span>{{ currentData.voltageB }}</span></p>
                        <p>C相电压<span>{{ currentData.voltageC }}</span></p>
                        <div class="btn normal" v-if="currentData.voltageYuex === false">
                          <el-icon>
                            <CircleCheck/>
                          </el-icon>
                          未发现异常
                        </div>
                        <div class="btn normal" v-if="currentData.voltageYuex === true">
                          <el-icon>
                            <Warning/>
                          </el-icon>
                          发现异常
                        </div>
                      </el-col>
                      <el-col :span="6" class="item">
                        <div class="infotit">
                          <img src="@/assets/images/penglaiaqyd/detail-dataico2.png"/>
                          <div class="infotitrt">
                            <h4>电流</h4>
                            <h5>（A）</h5>
                          </div>
                        </div>
                        <p>A相电流<span>{{ currentData.currentA }}</span></p>
                        <p>B相电流<span>{{ currentData.currentB }}</span></p>
                        <p>C相电流<span>{{ currentData.currentC }}</span></p>
                        <div class="btn normal" v-if="currentData.currentYuex === false">
                          <el-icon>
                            <CircleCheck/>
                          </el-icon>
                          未发现异常
                        </div>
                        <div class="btn normal" v-if="currentData.currentYuex === true">
                          <el-icon>
                            <Warning/>
                          </el-icon>
                          发现异常
                        </div>
                      </el-col>
                      <el-col :span="6" class="item">
                        <div class="infotit">
                          <img src="@/assets/images/penglaiaqyd/detail-dataico4.png"/>
                          <div class="infotitrt">
                            <h4>温度</h4>
                            <h5>（℃）</h5>
                          </div>
                        </div>
                        <p>A相温度<span>{{ currentData.wenduA }}</span></p>
                        <p>B相温度<span>{{ currentData.wenduBB }}</span></p>
                        <p>C相温度<span>{{ currentData.wenduC }}</span></p>
                        <div class="btn normal" v-if="currentData.wenduYuex === false">
                          <el-icon>
                            <CircleCheck/>
                          </el-icon>
                          未发现异常
                        </div>
                        <div class="btn normal" v-if="currentData.wenduYuex === true">
                          <el-icon>
                            <Warning/>
                          </el-icon>
                          发现异常
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import * as echarts from '@/utils/echarts'
import {allCompany} from '@/api/system/electricBasic'
import {
  getAllCompanyYxhisList,
  sensoryxhisByDate,
  countYxByCompany,
  last7DayCountYx,
  sortByCompany,
  getYxhisListByDept,
  getyxByCompany,
  getyxhisList, getyxhisList2
} from "@/api/sensor/sensor";
import {listRealIndustryAreaSensor} from "@/api/industry/industryAreaSensor";
import {listRealAmmeter, listRealAmmeterByDeptId} from "@/api/energy/ammeter";
import {getSensorData} from "@/api/energy/sensorData";


export default {
  data() {
    return {
      echart2Title: [],
      echart2Data: [],
      echart4Title: [],
      echart4Data: [],
      echartOneTitle: 0,
      echartThreeTitle: 0,
      countAlarm: 0,
      countCompany: 0,
      rightdrawer: false,
      rightlistbtn: true,
      warnList: [],
      piedata2: [],
      warnList1: [
        {
          eventTimeStr: '2022-07-27 13:32',
          regionName: '一车间电表',
          eventName: '超负荷'
        }, {
          eventTimeStr: '2022-07-26 16:00',
          regionName: '二车间电表',
          eventName: '断电'
        }, {
          eventTimeStr: '2022-07-25 09:02',
          regionName: '三车间电表',
          eventName: '超负荷'
        }, {
          eventTimeStr: '2022-07-24 13:32',
          regionName: '四车间电表',
          eventName: '断电'
        }, {
          eventTimeStr: '2022-07-23 13:32',
          regionName: '五车间电表',
          eventName: '超负荷'
        }
      ],
      activeName: 'first',
      begainDate: '',
      endDate: '',
      begainDate2: '',
      endDate2: '',
      deptInformation: null,
      rankingList: [
        {
          company: '烟台安诺其精细化工有限公司',
          warnNum: '60'
        },
      ],
      rankingList1: [
        {
          company: '一车间电表',
          warnNum: '60'
        }, {
          company: '二车间电表',
          warnNum: '57'
        }, {
          company: '三车间电表',
          warnNum: '54'
        }, {
          company: '四车间电表',
          warnNum: '43'
        }, {
          company: '五车间电表',
          warnNum: '31'
        }, {
          company: '六车间电表',
          warnNum: '31'
        }, {
          company: '生活区电表',
          warnNum: '29'
        }
      ],
      companyAlarm: [],
      regionList: [
        {
          name: '康爱特（烟台）气体有限公司'
        }, {
          name: '康爱特维迅（蓬莱）化学有限公司'
        }, {
          name: '烟台安诺其精细化工有限公司'
        }, {
          name: '蓬莱红卫化工有限公司'
        }, {
          name: '蓬莱环成乙炔化工有限公司'
        }, {
          name: '烟台蓬莱区天阳化工有限公司'
        }, {
          name: '山东汇洋石油有限公司'
        }
      ],
      mapCompanyList: [
        {
          name: '康爱特（烟台）气体有限公司',
          address: '海润南路6号',
          infoshow: false,
          style: {
            left: '24%',
            top: '20%'
          }
        }, {
          name: '康爱特维迅（蓬莱）化学有限公司',
          address: '海润南路6号',
          infoshow: false,
          style: {
            left: '15%',
            top: '19%'
          }
        }, {
          name: '烟台安诺其精细化工有限公司',
          address: '海润南路6号',
          infoshow: false,
          style: {
            left: '32%',
            top: '18%'
          }
        }, {
          name: '蓬莱红卫化工有限公司',
          address: '海润南路6号',
          infoshow: false,
          style: {
            left: '6%',
            top: '22%'
          }
        }, {
          name: '蓬莱环成乙炔化工有限公司',
          address: '海润南路6号',
          infoshow: false,
          style: {
            left: '25%',
            top: '30%'
          }
        }, {
          name: '烟台蓬莱区天阳化工有限公司',
          address: '海润南路6号',
          infoshow: false,
          style: {
            left: '15%',
            top: '28%'
          }
        }, {
          name: '山东汇洋石油有限公司',
          address: '海润南路6号',
          infoshow: false,
          style: {
            left: '6%',
            top: '32%'
          }
        }
      ],
      drawer: false,
      sensorList: [],
      alarmSort: [],
      currentData: {
        wenduYuex: false,
        wenduA: null,
        wenduBB: null,
        wenduC: null,
        currentYuex: false,
        currentA: null,
        currentB: null,
        currentC: null,
        voltageYuex: false,
        voltageA: null,
        voltageB: null,
        voltageC: null,
        powerYuex: false,
        activePower: null,
        activePowerA: null,
        activePowerB: null,
        activePowerC: null,
      },
      equiplist: [
        {
          status: 1, //在线
          name: '一车间电表',
          active: 1,
        }
      ],
      piedata: [],
    }
  },
  mounted: function () {
    this.getDate();
    //setInterval(this.getDate);
    setTimeout(() => {
      getAllCompanyYxhisList().then(res => {
        if (res.rows) {
          this.countAlarm = res.rows.length
          this.warnList = res.rows
        }
      })
      allCompany().then(res => {
        this.regionList = []
        if (res.data) {
          this.countCompany = res.data.length
          res.data.forEach(item => {
            item.style = {left: item.lat + '%', top: item.lng + '%'}
            this.regionList.push(item)
          })
        }
      })
      last7DayCountYx().then(res => {
        console.log(res)
        for (let key in res.data) {
          this.echart2Title.push(key)
          this.echart2Data.push(res.data[key])
        }
      })
      this.getRanking();
      this.selectByDate();
      this.getWindowHt();
    }, 600)
  },
  created() {

  },
  watch: {},
  methods: {
    getRanking() {
      sortByCompany(this.begainDate2, this.endDate2).then(res => {
        this.rankingList = res.data
      })
    },
    selectByDate() {
      sensoryxhisByDate(this.begainDate, this.endDate).then(res => {
        this.piedata = [{value: res.data[0].fuhe, name: '超负荷'},
          {value: res.data[0].wendu, name: '超温度'},
          {value: res.data[0].guoqianya, name: '过欠压'},
          {value: res.data[0].loudian, name: '漏电流'},
          {value: res.data[0].quexiang, name: '缺相'},
          {value: res.data[0].guoliu, name: '过流'},]
        this.echartOneTitle = this.parseZero(res.data[0].fuhe)
            + this.parseZero(res.data[0].wendu)
            + this.parseZero(res.data[0].guoqianya)
            + this.parseZero(res.data[0].loudian)
            + this.parseZero(res.data[0].quexiang)
            + this.parseZero(res.data[0].guoliu)
      })
      this.$nextTick(() => {
				setTimeout(() => {
					this.echartOne();
				}, 300)
      })
    },
    getWindowHt() {
      var winHt = window.innerHeight;
      document.getElementById('allmap').style.height = winHt - 200 + 'px';  //地图高度
      document.getElementById('leftbox').style.height = winHt - 180 + 'px';  //左侧高度
    },
    getDate() {
      //获取当前日期、时间、周几
      //当前年月日时分秒
      let today = new Date();
      let yy = today.getFullYear();
      let mm = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
      let dd = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();

      let prevSevenDay = new Date(today.setDate(today.getDate() - 7));
      let lastsevendd = prevSevenDay.getDate() < 10 ? '0' + prevSevenDay.getDate() : prevSevenDay.getDate();
      let lastsevenyear = prevSevenDay.getFullYear();
      let lastsevenmonth = (prevSevenDay.getMonth() + 1) < 10 ? '0' + (prevSevenDay.getMonth() + 1) : prevSevenDay.getMonth() + 1;

      let hh = new Date().getHours();
      let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
      let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds();
      var gettime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf;
      //当前星期
      let wk = new Date().getDay();
      let weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      let week = weeks[wk];
      this.datetime = gettime + ' ' + week;
      this.endDate = yy + '-' + mm + '-' + dd;
      this.begainDate = lastsevenyear + '-' + lastsevenmonth + '-' + lastsevendd;
      this.endDate2 = yy + '-' + mm + '-' + dd;
      this.begainDate2 = lastsevenyear + '-' + lastsevenmonth + '-' + lastsevendd;
    },
    rightlistBtn() {
      this.rightdrawer = true;
      this.rightlistbtn = false;
      this.$nextTick(() => {
        var winHt = window.innerHeight;
        document.getElementById('table2').style.height = winHt - 180 + 'px';
      })

    },
    rightlistClose() {
      this.rightdrawer = false;
      this.rightlistbtn = true;
    },
    parseZero(val) {
      return parseInt(val == null ? '0' : val)
    },
    regionRightDetails(row) {
      this.currentData = {
        wenduYuex: false,
        wenduA: null,
        wenduBB: null,
        wenduC: null,
        currentYuex: false,
        currentA: null,
        currentB: null,
        currentC: null,
        voltageYuex: false,
        voltageA: null,
        voltageB: null,
        voltageC: null,
        powerYuex: false,
        activePower: null,
        activePowerA: null,
        activePowerB: null,
        activePowerC: null,
      }
      this.companyAlarm = []
      this.alarmSort = []
      this.echartThreeTitle = null
      this.echart4Title = []
      this.echart4Data = []

      let alarmList = new Map()

      getYxhisListByDept(row.deptId).then(res => {
        this.companyAlarm = res.rows
        res.rows.forEach(item => {
          if (alarmList.has(item.equipmentName)) {
            alarmList.set(item.equipmentName, alarmList.get(item.equipmentName) + 1)
          } else {
            alarmList.set(item.equipmentName, 1)
          }
        })
        this.alarmSort = []
        for (let key of alarmList.keys()) {
          this.alarmSort.push({
            name: key,
            value: alarmList.get(key)
          })
        }
      })
      getyxByCompany(row.deptId).then(res => {
        this.piedata2 = [{value: res.data[0].fuhe, name: '超负荷'},
          {value: res.data[0].wendu, name: '超温度'},
          {value: res.data[0].guoqianya, name: '过欠压'},
          {value: res.data[0].loudian, name: '漏电流'},
          {value: res.data[0].quexiang, name: '缺相'},
          {value: res.data[0].guoliu, name: '过流'},]
        this.echartThreeTitle = this.parseZero(res.data[0].fuhe)
            + this.parseZero(res.data[0].wendu)
            + this.parseZero(res.data[0].guoqianya)
            + this.parseZero(res.data[0].loudian)
            + this.parseZero(res.data[0].quexiang)
            + this.parseZero(res.data[0].guoliu)
        this.$nextTick(() => {
          this.echartThree()
        })
      })

      countYxByCompany(row.deptId).then(res => {
        for (let key in res.data) {
          this.echart4Title.push(key)
          this.echart4Data.push(res.data[key])
        }
      })

      this.equiplist = []
      listRealAmmeterByDeptId({deptId: row.deptId, pageNum: 1, pageSize: 100000}).then(res => {
        console.log(res)
        this.sensorList = res.rows;
        this.sensorList.forEach((item, index) => {
          let active = 0;
          if (index === 0) {
            active = 1
            getSensorData(item.id).then(res => {
              this.currentData = res.data
            })
          }
          this.equiplist.push({
            status: item.sensorName == null ? 0 : 1, //在线
            name: item.sensorName,
            id: item.id,
            active: active,
          })
        })
      })
      this.deptInformation = row
      this.drawer = true;
    },
    mapCompanyDetail(item) {
      this.drawer = true;
      this.deptInformation = item
      this.$nextTick(() => {
        this.echartThree()
      })
    },
    mapinfoShow(val) {
      this.mapCompanyList.forEach(function (item, index) {
        item.infoshow = false;
      })
      val.infoshow = true;
    },
    handleClick(tab, event) {
      if (tab.index == '0') {
        this.$nextTick(() => {
          this.echartOne()
        })
      }
      if (tab.index == '1') {
        this.$nextTick(() => {
          this.echartTwo()
        })
      }
    },
    detailTabClick(tab, event) {
      if (tab.index == '0') {
        this.$nextTick(() => {
          this.echartThree()
        })
      }
      if (tab.index == '1') {
        this.$nextTick(() => {
          this.echartFour()
        })
      }
    },
    equipTab(val) {
      console.log(val)
      this.equiplist.forEach(function (item, index) {
        item.active = 0;
      })
      getSensorData(val.id).then(res => {
        console.log(res)
        this.currentData = res.data
        res.data.equipmentYcList.forEach(item => {
          if (item.ycName === 'A相温度') {
            this.currentData.wenduA = item.ycValue
          }
          if (item.ycName === 'B相温度') {
            this.currentData.wenduB = item.ycValue
          }
          if (item.ycName === 'C相温度') {
            this.currentData.wenduC = item.ycValue
          }
        })
      })
      val.active = 1;
    },
    echartOne() {
      let chartDom = document.getElementById('echart1');
      chartDom.removeAttribute('_echarts_instance_');
      let myChart = echarts.init(chartDom);
      let option;
      let _this = this;
      option = {
        color: ['#d8561c', '#ea9b12', '#fff100', '#f29b76'],
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: "vertical",
          top: "15%",
          right: "0%",
          left: "auto",
          textStyle: {
            color: "#fff"
          },
          icon: "circle",
          itemWidth: 8,
          formatter: function (name) {
            // pieData是饼图的数组数据
            let data = _this.piedata;
            let total = 0;
            let tarValue = 0;
            for (let i = 0, l = data.length; i < l; i++) {
              total += parseInt(data[i].value);
              if (data[i].name == name) {
                tarValue = data[i].value;
              }
            }
            let arr
            if (tarValue != 0) {
              arr = [name + '    ' + ((tarValue / total) * 100).toFixed(2) + '%']
            } else {
              arr = [name + '    0%']
            }
            return arr.join('')
          },
        },
        title: {
          text: this.echartOneTitle,
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
            radius: ['60%', '80%'],
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
    },
    echartThree() {
      let chartDom = document.getElementById('echart3');
      chartDom.removeAttribute('_echarts_instance_');
      let myChart = echarts.init(chartDom);
      let option;
      let _this = this;
      option = {
        color: ['#d8561c', '#ea9b12', '#fff100', '#f29b76'],
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: "vertical",
          top: "15%",
          right: "0%",
          left: "auto",
          textStyle: {
            color: "#fff"
          },
          icon: "circle",
          itemWidth: 8,
          formatter: function (name) {
            // pieData是饼图的数组数据
            let data = _this.piedata2;
            let total = 0;
            let tarValue = 0;
            for (let i = 0, l = data.length; i < l; i++) {
              total += parseInt(data[i].value);
              if (data[i].name == name) {
                tarValue = data[i].value;
              }
            }
            let arr
            if (tarValue != 0) {
              arr = [name + '    ' + ((tarValue / total) * 100).toFixed(2) + '%']
            } else {
              arr = [name + '    0%']
            }
            return arr.join('')
          },
        },
        title: {
          text: this.echartThreeTitle,
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
            radius: ['60%', '80%'],
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
            data: this.piedata2
          }
        ]
      };
      option && myChart.setOption(option);
    },
    echartTwo() {
      let chartDom = document.getElementById('echart2');
      chartDom.removeAttribute('_echarts_instance_');
      let myChart = echarts.init(chartDom);
      let option;
      option = {
        color: ['#fff657'],
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
          right: "5%",
          left: "15%"
        },
        xAxis: {
          type: 'category',
          data: this.echart2Title,
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
            data: this.echart2Data,
            type: 'line',
            smooth: true
          }
        ]
      };
      option && myChart.setOption(option);
    },
    echartFour() {
      let chartDom = document.getElementById('echart4');
      chartDom.removeAttribute('_echarts_instance_');
      let myChart = echarts.init(chartDom);
      let option;
      option = {
        color: ['#fff657'],
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
          right: "5%",
          left: "15%"
        },
        xAxis: {
          type: 'category',
          data: this.echart4Title,
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
            data: this.echart4Data,
            type: 'line',
            smooth: true
          }
        ]
      };
      option && myChart.setOption(option);
    }
  }
}
</script>

<style scoped lang="scss">
.home {
  height: calc(100vh - 84px);
  position: relative;
  background: url("@/assets/images/penglaiaqyd/detailbox-bg.jpg") no-repeat;
  background-size: 100% 100%;

  .allmap {
    width: 40%;
    position: absolute;
    left: 30%;
    top: 100px;
    background: url("@/assets/images/penglaiaqyd/midmap.png") no-repeat left center;
    background-size: contain;

    .item {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 40px;
      height: 45px;

      .market {
        cursor: pointer;

        img {

        }
      }

      .info {
        background: url("@/assets/images/penglaiaqyd/map-info-bg.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        width: 310px;
        height: 190px;
        left: 198px;
        bottom: 84px;
        padding: 25px;
        color: #fff;
        z-index: 999;

        .close {
          position: absolute;
          right: 15px;
          top: 14px;
          color: #fff;
          font-size: 18px;
          cursor: pointer;
        }

        .tag {
          position: absolute;
          right: 50%;
          top: 100%;
          width: 100%;
          pointer-events: none;
        }

        h5 {
          margin: 0;
          line-height: 2;

        }

        img {
          vertical-align: text-bottom;
        }

        .btn {
          width: 50%;
          margin: 15px auto 0;
          background: url("@/assets/images/penglaiaqyd/map-info-btn.png");
          background-size: 100% 100%;
          color: #fff;
          text-align: center;
          padding: 5px 0;
          border-radius: 20px;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }

    // .item:nth-child(1){
    // 	left: 24%;top:20%;
    // }
    // .item:nth-child(2){
    // 	left: 15%;top:19%;
    // }
    // .item:nth-child(3){
    // 	left: 32%;top:18%;
    // }
    // .item:nth-child(4){
    // 	left: 6%;top:22%;
    // }
    // .item:nth-child(5){
    // 	left: 25%;top:30%;
    // }
    // .item:nth-child(6){
    // 	left: 15%;top:28%;
    // }
    // .item:nth-child(7){
    // 	left: 6%;top:32%;
    // }
  }

  .detailDialog {
    :deep .el-dialog {
      background: transparent;
      box-shadow: 0 0 0 transparent;
      height: 80%;
      margin-top: 6% !important;

      .el-dialog__header {
        padding: 0;
        background: transparent;
        position: relative;
      }

      .el-dialog__body {
        background: #343944;
        padding: 15px;
        height: calc(100% - 42px);
      }
    }

    .myheader {
      background: url("@/assets/images/penglaiaqyd/detail-toptit.png") no-repeat;
      background-size: 100% 100%;
      display: inline-block;
      padding: 10px 50px 10px 15px;
      font-weight: bold;
      color: #00ebff;

      img {
        vertical-align: middle;
      }
    }

    .close {
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 10px;
      color: #eee;
    }

    .baseinfo {
      background: #001a3d;
      padding: 40px 15px;
      margin: 0 0 10px;

      img {
        float: left;
        margin-right: 10px
      }

      .right {
        width: calc(100% - 60px);
        color: #fff;

        h5 {
          margin: 0 0 10px;
          font-size: 16px;
        }

        h4 {
          margin: 0;
          color: #00ebff;
          font-weight: bold;
          font-size: 18px;
          white-space: nowrap;
        }
      }
    }

    .dialogmain {
      height: calc(100% - 140px);

      .tit {
        font-size: 16px;
        color: #04c6d8;
        padding: 0 0 10px;
        border-bottom: 1px solid #0e2b52;
        margin: 0 0 20px;

        span {
          color: #fff;
          margin: 0 6px;
        }
      }

      .bluetit {
        color: #fff;
        font-size: 14px;
        background: url("@/assets/images/scyf/qlc-titbg.png") repeat-x;
        background-size: auto 100%;
        padding: 10px;
        position: relative;

        img {
          vertical-align: middle;
          margin-right: 5px;
        }
      }

      .bluetit::before {
        content: '';
        height: 100%;
        width: 2px;
        background: url("@/assets/images/scyf/qlc-titdot.png") repeat-x;
        background-size: 100% 100%;
        position: absolute;
        left: 0;
        top: 0;
      }

      .bluetit::after {
        content: '';
        height: 100%;
        width: 3px;
        background: url("@/assets/images/scyf/qlc-titdot.png") repeat-x;
        background-size: 100% 100%;
        position: absolute;
        right: 0;
        top: 0;
      }

      :deep .el-row {
        height: 100%;

        .el-col {
          height: 100%;
        }
      }

      .botleft {
        height: 100%;
        background: #00132e;
        padding: 15px;

        .botleftrow {
          height: calc(50% - 25px);

          .leftitem {
            height: calc(50% - 5px);
            margin: 0 0 5px;
            background: #001b3b;
            position: relative;

            img {
              width: 45px;
              top: 50%;
              transform: translateY(-50%);
              position: absolute;
              left: 15px;
            }

            .itemword {
              position: absolute;
              right: 15px;
              top: 50%;
              text-align: right;
              transform: translateY(-50%);
              width: calc(100% - 50px);

              h5 {
                color: #fff;
                margin: 0 0 5px;
                text-align: right;
              }

              p {
                margin: 0;
                font-size: 24px;
              }
            }
          }

          .table {
            height: calc(100% - 45px);
          }
        }

        .botchart {
          height: calc(50% - 25px);

          :deep .el-tabs {
            height: calc(100% - 40px);

            .el-tabs__header .el-tabs__item {
              border: 0;
              color: #00ebff;
              text-align: center;
              background: url("@/assets/images/penglaiaqyd/tab-bg.png") no-repeat;
              background-size: 100% 100%;
              margin: 10px 0;
            }

            .el-tabs__header .el-tabs__nav {
              border: 0;
              width: 100%;
              position: absolute;
              top: 50%;
              transform: translateY(-50%) !important;
            }

            .el-tabs__header {
              width: 25%;
              position: relative;
            }

            .el-tabs__content {
              width: calc(75% - 10px);
              height: 100%;
            }

            .el-tabs__header .el-tabs__item.is-active {
              color: #fff582;
              background: url("@/assets/images/penglaiaqyd/tab-bg-acitve.png") no-repeat;
              background-size: 100% 100%;
            }

            .el-tabs__nav-wrap.is-left::after {
              display: none;
            }

            .el-tabs__active-bar.is-left {
              display: none;
            }

            .el-tab-pane {
              height: 100%;
            }
          }

          #echart3 {
            height: 100%;
            width: 140%;
            margin-left: -40%;
          }

          #echart4 {
            height: 100%;
          }

          .table {
            height: 100%;
          }
        }
      }

      .botright {
        height: 100%;
        background: #00132e;

        .tit {
          padding: 15px 15px 10px;
        }

        .equiplist {
          height: 28%;
          padding: 0 15px 5px;
          overflow: auto;
          margin-right: 1%;

          .item {
            text-align: center;
            color: #fff;
            cursor: pointer;
            position: relative;
            border-bottom: 2px solid transparent;

            h5 {
              margin: 0;
            }

            h3 {
              margin: 15px 0 5px;
              font-size: 16px;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }

            h4 {
              margin: 0;
              font-size: 14px
            }

            .sblbitembx {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              width: 100%;
            }
          }

          .item.active {
            border-bottom: 2px solid #00aed9;
          }

          .item.active::before {
            content: '';
            width: 10px;
            height: 6px;
            border-top: 6px solid #00aed9;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            position: absolute;
            top: 100%;
            left: calc(50% - 5px);
          }
        }

        .equiplist::-webkit-scrollbar {
          width: 5px;
          /*滚动条宽度*/
          height: 10px;
          /*滚动条高度*/
        }

        /*定义滚动条轨道 内阴影+圆角*/
        .equiplist::-webkit-scrollbar-track {
          /*滚动条的背景区域的内阴影*/
          border-radius: 10px;
          background: #203151;
        }

        /*定义滑块 内阴影+圆角*/
        .equiplist::-webkit-scrollbar-thumb {
          border-radius: 6px;
          background-color: rgba(255, 255, 255, 0.1);
        }

        .equipinfo {
          height: calc(72% - 52px);
          padding: 15px;
          background: #000e22;

          .eqinfoli {
            height: calc(100% - 42px);

            .item {
              display: flex;
              justify-content: center;
              flex-direction: column;
              position: relative;

              .infotit {
                padding-bottom: 10px;
                margin: 0 0 10px;
                border-bottom: 1px solid #2b3747;

                img {
                  width: 40px;
                  float: left;
                }

                .infotitrt {
                  width: calc(100% - 50px);
                  margin-left: 10px;
                  float: left;
                  color: #fff;

                  h4 {
                    margin: 0 0 5px;
                    font-size: 16px;
                  }

                  h5 {
                    font-size: 12px;
                    margin: 0;
                    white-space: nowrap;
                  }
                }
              }

              .infotit::before, .infotit::after {
                content: '';
                clear: both;
                display: table;
              }

              p {
                margin: 0;
                color: #fff;
                font-size: 12px;
                line-height: 1;
                padding: 5px 0;

                span {
                  float: right;
                  vertical-align: middle;
                }
              }

              .btn {
                width: 75%;
                margin: 40px auto 0;
                border-radius: 10px;
                text-align: center;
                padding: 2px 0 3px;

                :deep .el-icon {
                  vertical-align: middle;
                }
              }

              .normal {
                color: #1beb6d;
                border: 1px solid #1beb6d;
              }

              .unnormal {
                color: #fff;
                border: 1px solid #f39800;
                background: #f39800;
              }
            }

            .item:nth-child(1) {
              p {
                span {
                  color: #ffc100;
                }
              }
            }

            .item:nth-child(2) {
              p {
                span {
                  color: #fd932b;
                }
              }
            }

            .item:nth-child(3) {
              p {
                span {
                  color: #78cc4f;
                }
              }
            }

            .item:nth-child(4) {
              p {
                span {
                  color: #4f90cc;
                }
              }
            }

            .item + .item::before {
              content: '';
              width: 10px;
              height: 100%;
              position: absolute;
              left: -5px;
              top: 0;
              background: url("@/assets/images/penglaiaqyd/detail-info-line.png") no-repeat center;
              background-size: 100% 85%;
            }
          }
        }
      }
    }

  }

  .top {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 90px;
    padding: 0 30px;
    background: url("@/assets/images/penglaiaqyd/top-bg.png") no-repeat;
    background-size: 100% 100%;

    .top-left {
      padding-top: 15px;
      font-size: 14px;
      width: 50%;
      float: left;

      span {
        vertical-align: text-bottom;
        margin-left: 15px;
        color: #00ebff;
      }

      i {
        color: #00ebff;
      }
    }

    .top-right {
      float: right;
      padding: 28px 0 0;

      .el-dropdown-link {
        color: #00ebff;
        border: 1px solid #00ebff;
        border-radius: 3px;
        padding: 2px 10px 2px 20px;
        outline: none;
      }
    }

    .top-middle {
      background: url("@/assets/images/penglaiaqyd/toptitle-bg.png") no-repeat;
      background-size: 100% 100%;
      font-size: 28px;
      font-weight: bold;
      padding: 15px 0;
      width: 440px;
      text-align: center;
      position: absolute;
      bottom: 10px;
      left: 50%;
      margin-left: -220px;
      color: #00ebff;
    }
  }

  .rightlist-btn {
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -120px;
    cursor: pointer;
  }

  .rightlist {
    #table2 {
      height: calc(100% - 60px);
    }

    :deep .el-overlay {
      pointer-events: none;
      background: transparent;
    }

    :deep .el-drawer {
      pointer-events: auto;
      width: 25% !important;
      height: calc(100vh - 84px);
      top: 84px;
      background: url("@/assets/images/penglaiaqyd/rightlist-bg.png") no-repeat;
      background-size: 100% 100%;
      box-shadow: 0 0 0 transparent;
      overflow: initial;

      .rightlist-openbtn {
        position: absolute;
        top: 0;
        right: 100%;
        height: 100%;
        cursor: pointer;

        img {
          height: 100%;
        }
      }

      .tit {
        width: 55%;
        text-align: center;
        color: #00ebff;
        font-size: 18px;
        font-weight: bold;
        background: url("@/assets/images/penglaiaqyd/box-title-bg.png") no-repeat center;
        background-size: contain;
        line-height: 1;
        margin: 15px 0;
      }

      i {
        display: block;
        width: 20px;
        height: 20px;
        margin: 0 auto;
      }

      .online {
        background: url("@/assets/images/penglaiaqyd/online.png");
        background-size: 100%;
      }

      .outline {
        background: url("@/assets/images/penglaiaqyd/outline.png");
        background-size: 100%;
      }
    }
  }

  .table {
    :deep(.el-table::before) {
      display: none;
    }

    /*修改table 表体的背景颜色和文字颜色*/
    :deep(.el-table) {
      background-color: transparent;

      th,
      td, tr {
        background-color: transparent !important;
        font-size: 12px;
      }

      .cell {
        padding: 0 5px;
      }

      .el-table__expanded-cell {
        background-color: transparent !important;
      }

      // 表头背景色
      th.el-table__cell {
        color: #00ebff;
        font-weight: normal;
        padding: 5px 0;
        height: auto;
      }

      tr > td {
        color: #fff;
        padding: 5px 0;
      }

      .el-table__body tr:nth-child(odd) {
        background-color: #0a1127 !important;
      }

      th.el-table__cell.is-leaf,
      td.el-table__cell {
        border: 0;
      }

      // hover效果
      tr:hover > td {
        background-color: rgba(0, 0, 0, 0) !important;
      }

      tbody tr:hover > td {
        background-color: #0a1127 !important;
        // text-align: center;
      }

      // 滚动条宽高
      .el-table__body-wrapper::-webkit-scrollbar {
        width: 5px;
        height: 5px;
      }

      .el-table__body-wrapper::-webkit-scrollbar {
        width: 5px;
        /*滚动条宽度*/
        height: 10px;
        /*滚动条高度*/
      }

      /*定义滚动条轨道 内阴影+圆角*/
      .el-table__body-wrapper::-webkit-scrollbar-track {
        box-shadow: 0px 1px 3px #0a1127 inset;
        /*滚动条的背景区域的内阴影*/
        border-radius: 10px;
      }

      /*定义滑块 内阴影+圆角*/
      .el-table__body-wrapper::-webkit-scrollbar-thumb {
        box-shadow: 0px 1px 3px #0a1127 inset;
        border-radius: 6px;
        background-color: #0a1127;
      }
    }
  }

  .lfbx {
    background: rgba(21, 27, 43, 0.8);
    border: 2px solid #0e9ead;
    position: relative;

    .tit {
      width: 48%;
      text-align: center;
      color: #00ebff;
      font-size: 18px;
      font-weight: bold;
      background: url("@/assets/images/penglaiaqyd/box-title-bg.png") no-repeat center;
      background-size: contain;
      line-height: 1;
      margin: 0 0 15px;
    }
  }

  .lfbx-topline img {
    display: block;
    width: calc(100% + 6px);
    position: absolute;
    left: -3px;
    top: -3px;
  }

  .lfbx-botline img {
    display: block;
    width: calc(100% + 6px);
    position: absolute;
    left: -3px;
    bottom: -3px;
    right: -3px;
  }

  .rightbox {
    position: absolute;
    right: 30px;
    top: 100px;
    width: 26%;

    .lfbx {
      height: calc(100% - 20px);
      padding: 15px;

      .rightlist {
        height: 100%;

        #table2 {
          height: calc(100% - 30px);
        }
      }
    }
  }

  .leftbox {
    position: absolute;
    left: 30px;
    top: 100px;
    width: 26%;

    .lfbx-1 {
      height: 16%;
      margin: 0 0 15px;
      padding: 0 30px;

      .lfbx-mid {
        text-align: right;
        height: 100%;
        position: relative;

        h5 {
          color: #fff;
          margin: 0 0 10px;
        }

        p {
          font-size: 36px;
          font-weight: bold;
          margin: 0;
        }

        p.color1 {
          color: #fa6689
        }

        p.color2 {
          color: #f564f8
        }

        .midmid {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
        }
      }
    }

    .lfbx-2 {
      height: 33%;
      margin: 0 0 15px;
      padding: 15px;

      .lfbx-mid {
        height: 100%;
      }

      .table {
        height: calc(100% - 33px);
      }
    }

    .lfbx-3 {
      height: calc(51% - 50px);
      padding: 15px;

      .lfbx-mid {
        height: 100%;
      }

      .tabs {
        height: calc(100% - 30px);

        :deep .el-tabs {
          height: 100%;

          .el-tabs__header .el-tabs__item {
            border: 0;
            color: #00ebff;
            width: 29.3%;
            text-align: center;
            background: url("@/assets/images/penglaiaqyd/tab-bg.png") no-repeat;
            background-size: 100% 100%;
          }

          .el-tabs__header .el-tabs__item:nth-child(2) {
            margin: 0 6%;
          }

          .el-tabs__header .el-tabs__nav {
            border: 0;
            width: 100%;
          }

          .el-tabs__header {
            border: 0;
          }

          .el-tabs__header .el-tabs__item.is-active {
            color: #fff582;
            background: url("@/assets/images/penglaiaqyd/tab-bg-acitve.png") no-repeat;
            background-size: 100% 100%;
          }

          .el-tabs__content {
            height: calc(100% - 55px);
          }

          .el-tab-pane {
            height: 100%;
          }

          // .el-tab-pane{
          //   display: block !important;

          // }
        }

        .tabscon {
          padding-top: 15px;
          background: url("@/assets/images/penglaiaqyd/tab-line.png") no-repeat top;
          background-size: 100% auto;
          height: 100%;

          .datachoose {
            font-size: 12px;
            color: #00ebff;
            text-align: center;
            line-height: 25px;

            :deep(.el-date-editor.el-input) {
              width: 100%;
              font-size: 12px;

              .el-input__inner {
                height: 25px;
                line-height: 25px;
                color: #00ebff;
                background: transparent;
                border-color: #00ebff;
                padding: 0 10px;
              }

              .el-input__prefix {
                display: none;
              }

              .el-input__suffix {
                top: -5px;
              }
            }

            :deep .el-button--mini {
              padding: 0 10px;
              border: 0;
              background: #00ebff;
              color: #0a1127;
              line-height: 25px;
              height: 25px;
              float: right;
            }
          }

          #echart1 {
            height: calc(100% - 25px);
            width: 140%;
            margin-left: -40%;
          }

          #echart2 {
            height: 100%;
          }

          .table {
            margin: 10px 0 0;
            height: calc(100% - 35px);
          }
        }

        .two {
          h4 {
            font-size: 14px;
            color: #00ebff;
            text-align: center;
            font-weight: bold;
          }
        }

      }

    }

  }

  .detaildrawer {

    :deep(.el-drawer) {
      background: transparent;

      .el-drawer__header {
        position: absolute;
        top: 25px;
        right: 25px;
        z-index: 99;
        padding: 0;
        color: #aaddff;
      }

      .el-drawer__body {
        padding: 0;
      }
    }

    .detailbox {
      background: url("@/assets/images/penglaiaqyd/detailbox-bg.jpg") no-repeat;
      background-size: 100% 100%;
      height: 100%;
      position: relative;
      z-index: 10;
      padding: 15px 25px 15px 15px;

      .info {
        margin-top: 85px;
        position: relative;
        background: url(@/assets/images/penglaiaqyd/detail-info-bg.png);
        background-size: 100% 100%;
        border: 1px solid #00ebff;
        padding: 15px 0;

        .info-left {
          padding-left: 30px;
        }

        .btnline {
          position: absolute;
          right: 16.66%;
          height: 100%;
          padding: 10px 0;
          top: 0;
        }

        h5 {
          color: #fff;
          padding-top: 10px;
          margin: 0 0 10px;
        }

        h4 {
          font-weight: bold;
          color: #00ebff;
          height: 18px;
          // white-space: nowrap;
        }

        .btn {
          color: #00ebff;
          width: 100px;
          padding: 10px 0;
          text-align: center;
          border-radius: 3px;
          border: 2px solid #00ebff;
          margin: 4% auto 0;
          cursor: pointer;
        }
      }

      .detaillist {

        .detlist-tit {
          font-size: 18px;
          color: #00ebff;
          margin: 15px 0 0;

          img {
            vertical-align: middle;
          }

          .detlist-tit-line {
            display: block;
            margin: 10px 0 20px;
          }
        }

        .detlist-choose {
          font-size: 18px;
          color: #00ebff;
          text-align: center;
          margin: 0 0 5px;

          h5 {
            line-height: 32px;
          }

          :deep(.el-date-editor.el-input) {
            width: 100%;
            font-size: 12px;

            .el-input__inner {
              height: 32px;
              line-height: 32px;
              color: #00ebff;
              background: transparent;
              border-color: #00ebff;
            }

            .el-input__prefix {
              display: none;
            }

            .el-input__suffix {
              top: -5px;
            }
          }

          :deep(.el-button--small) {
            padding: 0 20px;
            border: 0;
            background: #00ebff;
            color: #0a1127;
            line-height: 32px;

          }

          :deep(.el-select) {
            width: 100%;
            color: #00ebff;
            border: 1px solid #00ebff;
            border-radius: 3px;

            .el-input__inner {
              background: transparent;
              border: 0;
              line-height: 30px;
              height: 30px;
              color: #00ebff;
            }

            .el-input__icon {
              line-height: 32px;
              color: #00ebff;
            }

            .popper__arrow {
              display: none;
            }

            .el-select-dropdown {
              margin: 2px -1px;
              border-color: #1e6a86;
              background: rgba(0, 14, 54, 0.8);

              .el-select-dropdown__item {
                color: #fff;
              }

              .el-select-dropdown__item.selected {
                color: #fff;
                font-weight: normal;
              }

              .el-select-dropdown__item.hover {
                color: #00ebff;
                background: transparent;
              }
            }
          }

          .warntypebox {
            position: relative;

            .quanbu-amount {
              position: absolute;
              right: 60px;
              top: 0;
              line-height: 30px;
              font-size: 14px;
            }
          }


        }

        .list {
          height: calc(100vh - 350px);
          padding-right: 10px;
          margin-top: 15px;
          // overflow-y: scroll;
          // overflow-x: hidden;

          .item {
            height: calc((100vh - 350px) / 3 - 10px);
            background: url(@/assets/images/penglaiaqyd/detail-listitembg.jpg) no-repeat;
            background-size: 100% 100%;
            margin-bottom: 10px;
            padding: 10px;
            text-align: right;
            position: relative;

            .pic {
              height: calc((100vh - 350px) / 3 - 30px);
              overflow: hidden;

              img {
                min-height: 100%;
              }
            }

            h5, p, span {
              color: #fff;
              font-size: 14px;
              margin: 0 0 10px;
            }

            .reason {
              position: absolute;
              right: 0px;
              bottom: 0px;
            }
          }

          :deep(.el-pagination) {
            text-align: center;

            .el-pagination__total {
              background: #16356b;
              color: #fff;
              margin: 0;
              padding: 0 10px;
            }

            button:disabled {
              background: #16356b;
            }

            .btn-next, .btn-prev {
              background: #16356b;
              color: #fff
            }

            .el-pager li {
              background: #16356b;
              color: #fff
            }

            .el-pager li.active {
              color: #00ebff;
            }
          }
        }

        .list::-webkit-scrollbar {
          width: 10px;
          height: 10px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }

        /*定义滚动条轨道
        内阴影+圆角*/
        .list::-webkit-scrollbar-track {
          -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          background-color: rgba(255, 255, 255, 0.2);
        }

        /*定义滑块
        内阴影+圆角*/
        .list::-webkit-scrollbar-thumb {
          border-radius: 10px;
          -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, .3);
          background-color: #555;
        }

      }

    }
  }

}
</style>