<template>
  <!--设备数据-->
  <div class="paramenter">
    <el-card :body-style="{ padding: '10px' }">
      <el-row :gutter="15">
        <el-col :span="24">
          <!--区域设备导航-->
          <el-row :gutter="30">
            <el-col :span="4">
              <div class="qysb">

                <div class="head-container tree">
                  <h4>区域设备导航</h4>
                  <el-input
                      v-model="deptName"
                      placeholder="请输入名称"
                      clearable
                      prefix-icon="Search"
                      style="margin-bottom: 20px"
                  />
                </div>
                <div class="head-container tree down-tree">
                  <el-tree
                      :current-node-key="0"
                      :highlight-current="true"
                      :data="deptOptions"
                      :props="{ label: 'label', children: 'children' }"
                      :expand-on-click-node="false"
                      :filter-node-method="filterNode"
                      ref="deptTreeRef"
                      default-expand-all
                      node-key="id"
                      @node-click="handleNodeClick"
                  />
                </div>
              </div>
            </el-col>

            <el-col :span="20" style="border-left: 1px solid rgb(231, 232, 237);">

              <div class="sbgl-com">
                <div class="sbgl-top">
                  <!-- <el-select v-model="sbtype" suffix-icon="CaretTop">
                    <el-option
                      v-for="item in sboptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select> -->
                  <div class="state">
                    <el-row>
                      <el-col :span="3">
                        <div @click="change(null)" class="state-li"><i
                            :class="{active:isActive == null}"></i>全部设备：<span>{{ allEqNum }}</span></div>
                      </el-col>
                      <el-col :span="3">
                        <div @click="change(1)" class="state-li"><i :class="{active:isActive == 1}"></i>在线设备：<span
                            class="green">{{ onlineNum }}</span></div>
                      </el-col>
                      <el-col :span="3">
                        <div @click="change(0)" class="state-li"><i :class="{active:isActive == 0}"></i>离线设备：<span
                            class="redcolor">{{ allEqNum - onlineNum }}</span></div>
                      </el-col>
                      <el-col :span="3">
                        <div @click="change1(2)" class="state-li"><i :class="{active:isActive == 2}"></i>运行：<span
                            class="green">{{runEq}}</span></div>
                      </el-col>
                      <el-col :span="3">
                        <div @click="change1(3)" class="state-li"><i :class="{active:isActive == 3}"></i>待机：<span
                            class="orange">{{stopEq}}</span></div>
                      </el-col>
                      <el-col :span="3">
                        <div @click="change1(4)" class="state-li"><i :class="{active:isActive == 4}"></i>告警：<span
                            class="redcolor">{{warnEq}}</span></div>
                      </el-col>
                      <el-col :span="3">
                        <div @click="change1(5)" class="state-li"><i :class="{active:isActive == 5}"></i>关机：<span
                            class="gray">{{shutdownEq}}</span></div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
                <el-row :gutter="12" v-loading="loading">
                  <el-col :lg="8" :xl="6" class="gl" v-for="item in industryAreaSensorList">
                    <el-card :body-style="{ padding: '6px 15px 10px' }"
                             v-hasPermi="['industry:industrySensorData:list']">
                      <div class="li-title">
                        <el-row>
                          <el-col :span="6">
                            <div v-if="item.sensorCurr == 1">
                              <img src="@/assets/images/name-icoz.png">
                            </div>
                            <div v-else>
                              <img src="@/assets/images/name-icol.png">
                            </div>
                            <div class="li-subtit"><i v-if="item.sensorCurr == 1" class="i green">在线</i>
                              <i v-else class="i red">离线</i></div>
                          </el-col>
                          <el-col :span="18">
                            <div class="name">{{ item.sensorName }}
															<span v-hasPermi="['industry:industrySensorData:control']" v-show="item.commandFlag == '1'" @click="handleSensorTwo(item)">
																<img src="@/assets/images/gongye-weixiu.png"/>
															</span>
														</div>
                            <div class="name">{{ item.sensorCode }}</div>
                            <div class="state">
                              <el-row
                                  v-if="item.equipmentYxStatusList !== undefined && item.equipmentYxStatusList != null && item.equipmentYxStatusList.length>0 || item.equipmentYcStatusList !== undefined && item.equipmentYcStatusList != null && item.equipmentYcStatusList.length>0 ">
                                <el-col :span="6">
                                  <div v-if="item.statusCurr==='run'" class="runtext"><span class="run"></span>运行
                                  </div>
                                  <div v-else class="graytext"><span class="grey"></span>运行</div>
                                </el-col>
                                <el-col :span="6">
                                  <div v-if="item.statusCurr==='stop'" class="stoptext"><span class="stop"></span>待机
                                  </div>
                                  <div v-else class="graytext"><span class="grey"></span>待机</div>
                                </el-col>
                                <el-col :span="6">
                                  <div v-if="item.statusCurr==='warn'" class="warntext"><span class="warn"></span>告警
                                  </div>
                                  <div v-else class="graytext"><span class="grey"></span>告警</div>
                                </el-col>
                                <el-col :span="6">
                                  <div v-if="item.statusCurr==='shutdown'" class="graytext2"><span class="gray2"></span>关机
                                  </div>
                                  <div v-else class="graytext"><span class="grey"></span>关机</div>
                                </el-col>
                              </el-row>
                            </div>
                          </el-col>
                        </el-row>
                      </div>
                      <div class="data-top">
                        <el-row>
                          <el-col :span="10"><span>通信时间</span></el-col>
                          <el-col :span="14"><span class="rt">{{ item.equipmentDt }}</span></el-col>
                        </el-row>
                      </div>
                      <div class="data " @click.native="handleSensor(item)">
                        <div class="dataitem zaixian" v-for="yc in item.equipmentYcList">
                          <el-row class="" v-if="yc.ifshow == '是'">
                            <el-col :span="12"><span>{{ yc.ycName }}</span></el-col>
                            <el-col :span="12"><span class="rt">{{ yc.ycValue }}{{ yc.ycUnit }}</span></el-col>
                          </el-row>
                        </div>
                        <div class="dataitem zaixian" v-for="yx in item.equipmentYxList">
                          <el-row class="" v-if="yx.ifshow == '是'">
                            <el-col :span="12"><span>{{ yx.yxName }}</span></el-col>
                            <el-col :span="12">
                              <span class="rt" v-if="yx.yxCurr == 0">{{ yx.yxDes0 }}</span>
                              <span class="rt" v-else-if="yx.yxCurr == 1">{{ yx.yxDes1 }}</span>
                              <span class="rt" v-else-if="yx.yxCurr == 2">{{ yx.yxDes2 }}</span>
                              <span class="rt" v-else-if="yx.yxCurr == 3">{{ yx.yxDes3 }}</span>
                              <span class="rt" v-else-if="yx.yxCurr == 4">{{ yx.yxDes4 }}</span>
                              <span class="rt" v-else-if="yx.yxCurr == 5">{{ yx.yxDes5 }}</span>
                              <span class="rt" v-else-if="yx.yxCurr == 6">{{ yx.yxDes6 }}</span>
                              <span class="rt" v-else-if="yx.yxCurr == 7">{{ yx.yxDes7 }}</span>
                              <span class="rt" v-else-if="yx.yxCurr == 8">{{ yx.yxDes8 }}</span>
                              <span class="rt" v-else-if="yx.yxCurr == 9">{{ yx.yxDes9 }}</span>
                              <span class="rt" v-else-if="yx.yxCurr == 10">{{ yx.yxDes10 }}</span>
                            </el-col>
                          </el-row>
                        </div>
                      </div>
                    </el-card>
                  </el-col>

                </el-row>
              </div>

              <pagination
                  v-show="total>0"
                  :total="total"
                  v-model:page="queryParams.pageNum"
                  v-model:limit="queryParams.pageSize"
                  @pagination="getList"
              />


            </el-col>
          </el-row>
        </el-col>
      </el-row>

    </el-card>

    <el-dialog v-model="open"
               custom-class="mydialog"
               width="1200px"
    >
      <div class="paramenter-on">
        <el-row :gutter="15">
          <el-col :span="18">
            <el-card :body-style="{ padding: '10px' }">
              <div class="title">
                <span class="card-tit">设备概要</span>
              </div>
              <el-row class="sbgy-ul">
                <el-col :span="12">
                  <div class="sbgy-li">
                    <el-row>
                      <el-col :span="4" class="ico"><img src="@/assets/images/sbtz-ico1.png"></el-col>
                      <el-col :span="20">
                        <div class="name">设备名称：<span>{{ sensorData.sensor.equipmentName }}</span></div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="sbgy-li">
                    <el-row>
                      <el-col :span="4" class="ico"><img src="@/assets/images/sbtz-ico2.png"></el-col>
                      <el-col :span="20">
                        <div class="name">所属区域：<span>{{ sensorData.industryAreaSensor.areaName }}</span></div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="sbgy-li">
                    <el-row>
                      <el-col :span="4" class="ico"><img src="@/assets/images/sbtz-ico3.png"></el-col>
                      <el-col :span="20">
                        <div class="name">当前状态：<span>{{
                            sensorData.sensor.equipmentCurr == 1 ? '在线' : '离线'
                          }}</span>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="sbgy-li">
                    <el-row>
                      <el-col :span="4" class="ico"><img src="@/assets/images/sbtz-ico4.png"></el-col>
                      <el-col :span="20">
                        <div class="name">生产厂商：<span>{{ sensorData.sensor.equipmentFactory }}</span></div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="sbgy-li">
                    <el-row>
                      <el-col :span="4" class="ico"><img src="@/assets/images/sbtz-ico5.png"></el-col>
                      <el-col :span="20">
                        <div class="name">设备编号：<span>{{ sensorData.sensor.equipmentId }}</span></div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="sbgy-li">
                    <el-row>
                      <el-col :span="4" class="ico"><img src="@/assets/images/sbtz-ico6.png"></el-col>
                      <el-col :span="20">
                        <div class="name">所属岗位：<span>{{ sensorData.sensor.deptName }}</span></div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="sbgy-li">
                    <el-row>
                      <el-col :span="4" class="ico"><img src="@/assets/images/sbtz-ico7.png"></el-col>
                      <el-col :span="20">
                        <div class="name">设备类型：<span>{{ sensorData.sensor.termName }}</span></div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="sbgy-li">
                    <el-row>
                      <el-col :span="4" class="ico"><img src="@/assets/images/sbtz-ico8.png"></el-col>
                      <el-col :span="20">
                        <div class="name">设备规格：<span>{{ sensorData.sensor.modalName }}</span></div>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="6">
            <div class="thumbpic">
              <img v-if="sensorData.sensor.equipmentImg" :src="sensorData.sensor.equipmentImg">
              <img v-else src="@/assets/no_img.png">
            </div>
          </el-col>
        </el-row>

        <div class="sbmx-nr">
          <el-card :body-style="{ padding: '10px' }">
            <div class="title">
              <span class="card-tit">设备明细</span>
            </div>
            <div class="sbmx-con">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="实时数据" name="first">
                  <el-table
                      :data="sensorData.realList"
                      stripe
                      height="100%"
                      style="width: 100%">
                    <el-table-column
                        prop="name"
                        label="名称">
                    </el-table-column>
                    <el-table-column
                        prop="value"
                        label="本次数据">
                    </el-table-column>
                    <el-table-column
                        prop="time"
                        label="本次时间">
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
                <el-tab-pane label="历史数据" name="second">
                  <div class="">
                    <el-row class="freeze-con">
                      <el-col :span="24">
                      </el-col>
                      <el-col :span="24" class="freeze-nr">
                        <div class="fl pading10">
                          <div class="fl tit">日期</div>
                          <div class="fl">
                            <el-date-picker
                                v-model="queryParams2.day"
                                type="date"
                                value-format="YYYY-MM-DD"
                                placeholder="选择日期">
                            </el-date-picker>
                          </div>
                        </div>
                        <div class="fl pading10">
                          <div class="fl tit">测点</div>
                          <div class="fl">
                            <el-select v-model="queryParams2.historyId" placeholder="请选择" @change="changeType">
                              <el-option
                                  v-for="item in sensorData.historyList"
                                  :key="item.id"
                                  :label="item.name"
                                  :value="item.id">
                              </el-option>
                            </el-select>
                          </div>
                        </div>
                        <div class="fl pading10">
                          <el-button class="inquirebtn" @click="search">查询</el-button>
                        </div>
                      </el-col>
                    </el-row>
                  </div>

                  <div class="pad10" v-if="show">
                    <el-row>
                      <el-radio-group v-model="tabPosition" size="small" fill="#09bec5" @change="chkCharts">
                        <el-radio-button label="tubiao">图表</el-radio-button>
                        <el-radio-button label="biaodan">表单</el-radio-button>
                      </el-radio-group>
                    </el-row>
                  </div>

                  <div class="echart-con" id="chart" v-show="tabPosition == 'tubiao'">

                  </div>
                  <div class="echart-con" v-show="tabPosition == 'biaodan'">
                    <el-table
                        :data="allList.slice((currentPage-1)*pagesize,currentPage*pagesize)"
                        style="width: 100%;" height="464px"
                        :row-style="{height: '42px'}">
                      <el-table-column
                          prop="value"
                          label="值">
                      </el-table-column>
                      <el-table-column
                          prop="date"
                          label="时间">
                      </el-table-column>
                    </el-table>
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[5,10,20,40]"
                        :page-size="pagesize"
                        layout="total,sizes,prev,pager,next,jumper"
                        :total="allList.length"

                    >
                    </el-pagination>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="历史增量查询" name="third">
                  <el-row class="freeze-con">

                    <el-form :rules="rules" :model="queryParams3" ref="queryParams3Ref">
                      <el-col :span="12" class="freeze-nr">
                        <div class="fl pading10">
                          <div class="fl tit">日期</div>
                          <div class="fl">
                            <el-form-item prop="startDay" style="display: inline-block">
                              <el-date-picker
                                  v-model="queryParams3.startDay"
                                  type="date"
                                  value-format="YYYY-MM-DD"
                                  placeholder="选择开始日期">
                              </el-date-picker>
                            </el-form-item>
                            -
                            <el-form-item prop="endDay" style="display: inline-block">
                              <el-date-picker
                                  v-model="queryParams3.endDay"
                                  type="date"
                                  value-format="YYYY-MM-DD"
                                  placeholder="选择结束日期">
                              </el-date-picker>
                            </el-form-item>
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="12" class="freeze-nr">
                        <div class="fl pading10">
                          <div class="fl tit">时间</div>
                          <div class="fl">
                            <el-form-item prop="startHour" style="display: inline-block">
                              <el-time-picker
                                  v-model="queryParams3.startHour"
                                  value-format="HH:mm:00"
                                  placeholder="选择开始时间">
                              </el-time-picker>
                            </el-form-item>
                            -
                            <el-form-item prop="endHour" style="display: inline-block">
                              <el-time-picker
                                  v-model="queryParams3.endHour"
                                  value-format="HH:mm:00"
                                  placeholder="选择结束时间">
                              </el-time-picker>
                            </el-form-item>
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="12" class="freeze-nr">
                        <div class="fl pading10">
                          <div class="fl tit">测点</div>
                          <div class="fl">
                            <el-form-item prop="ycId" style="display: inline-block">
                              <el-select v-model="queryParams3.ycId" placeholder="请选择">
                                <el-option
                                    v-for="item in sensorData.historyList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                              </el-select>
                            </el-form-item>
                          </div>
                        </div>
                        <div class="fl pading10">
                          <el-button class="inquirebtn" @click="historyIncrementSearch">查询</el-button>
                        </div>
                      </el-col>
                      <el-col :span="12" class="freeze-nr zjzl">
                        <p>总计增量：{{ incrementCount }}</p>
                      </el-col>
                    </el-form>
                  </el-row>
                  <el-table
                      :data="historyIncrement"
                      stripe
                      height="calc(100% - 100px)"
                      style="width: 100%">
                    <el-table-column
                        prop="startTime"
                        label="开始时间">
                    </el-table-column>
                    <el-table-column
                        prop="startVal"
                        label="开始时间值">
                    </el-table-column>
                    <el-table-column
                        prop="endTime"
                        label="结束时间">
                    </el-table-column>
                    <el-table-column
                        prop="endVal"
                        label="结束时间值">
                    </el-table-column>
                    <el-table-column
                        prop="increment"
                        label="增量">
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-card>
        </div>
      </div>

    </el-dialog>

		<el-dialog v-model="openTwo"
		           custom-class="mydialog"
		           width="1200px"
		>
		  <div class="paramenter-on">
		    <el-row :gutter="15">
		      <el-col :span="18">
		        <el-card :body-style="{ padding: '10px' }">
		          <div class="title">
		            <span class="card-tit">设备概要</span>
		          </div>
		          <el-row class="sbgy-ul">
		            <el-col :span="12">
		              <div class="sbgy-li">
		                <el-row>
		                  <el-col :span="4" class="ico"><img src="@/assets/images/sbtz-ico1.png"></el-col>
		                  <el-col :span="20">
		                    <div class="name">设备名称：<span>{{ sensorData.sensor.equipmentName }}</span></div>
		                  </el-col>
		                </el-row>
		              </div>
		            </el-col>
		            <el-col :span="12">
		              <div class="sbgy-li">
		                <el-row>
		                  <el-col :span="4" class="ico"><img src="@/assets/images/sbtz-ico2.png"></el-col>
		                  <el-col :span="20">
		                    <div class="name">所属区域：<span>{{ sensorData.industryAreaSensor.areaName }}</span></div>
		                  </el-col>
		                </el-row>
		              </div>
		            </el-col>
		            <el-col :span="12">
		              <div class="sbgy-li">
		                <el-row>
		                  <el-col :span="4" class="ico"><img src="@/assets/images/sbtz-ico3.png"></el-col>
		                  <el-col :span="20">
		                    <div class="name">当前状态：<span>{{
		                        sensorData.sensor.equipmentCurr == 1 ? '在线' : '离线'
		                      }}</span>
		                    </div>
		                  </el-col>
		                </el-row>
		              </div>
		            </el-col>
		            <el-col :span="12">
		              <div class="sbgy-li">
		                <el-row>
		                  <el-col :span="4" class="ico"><img src="@/assets/images/sbtz-ico4.png"></el-col>
		                  <el-col :span="20">
		                    <div class="name">生产厂商：<span>{{ sensorData.sensor.equipmentFactory }}</span></div>
		                  </el-col>
		                </el-row>
		              </div>
		            </el-col>
		            <el-col :span="12">
		              <div class="sbgy-li">
		                <el-row>
		                  <el-col :span="4" class="ico"><img src="@/assets/images/sbtz-ico5.png"></el-col>
		                  <el-col :span="20">
		                    <div class="name">设备编号：<span>{{ sensorData.sensor.equipmentId }}</span></div>
		                  </el-col>
		                </el-row>
		              </div>
		            </el-col>
		            <el-col :span="12">
		              <div class="sbgy-li">
		                <el-row>
		                  <el-col :span="4" class="ico"><img src="@/assets/images/sbtz-ico6.png"></el-col>
		                  <el-col :span="20">
		                    <div class="name">所属岗位：<span>{{ sensorData.sensor.deptName }}</span></div>
		                  </el-col>
		                </el-row>
		              </div>
		            </el-col>
		            <el-col :span="12">
		              <div class="sbgy-li">
		                <el-row>
		                  <el-col :span="4" class="ico"><img src="@/assets/images/sbtz-ico7.png"></el-col>
		                  <el-col :span="20">
		                    <div class="name">设备类型：<span>{{ sensorData.sensor.termName }}</span></div>
		                  </el-col>
		                </el-row>
		              </div>
		            </el-col>
		            <el-col :span="12">
		              <div class="sbgy-li">
		                <el-row>
		                  <el-col :span="4" class="ico"><img src="@/assets/images/sbtz-ico8.png"></el-col>
		                  <el-col :span="20">
		                    <div class="name">设备规格：<span>{{ sensorData.sensor.modalName }}</span></div>
		                  </el-col>
		                </el-row>
		              </div>
		            </el-col>
		          </el-row>
		        </el-card>
		      </el-col>
		      <el-col :span="6">
		        <div class="thumbpic">
		          <img v-if="sensorData.sensor.equipmentImg" :src="sensorData.sensor.equipmentImg">
		          <img v-else src="@/assets/no_img.png">
		        </div>
		      </el-col>
		    </el-row>

		    <div class="sbmx-nr">
		      <el-card :body-style="{ padding: '10px' }">
		        <div class="title">
		          <span class="card-tit">设备明细</span>
		        </div>
		        <div class="sbmx-con">
							<el-table
							    :data="sensorData.realList"
							    stripe
							    height="100%"
							    style="width: 100%"
                  >
							  <el-table-column
							      prop="name"
							      label="名称">
							  </el-table-column>
								<el-table-column
								    prop="time"
								    label="本次时间">
								</el-table-column>
							  <el-table-column
							      prop="value"
							      label="本次数据">
                    <template #default="scope">
                      <div class="state" v-if="scope.row.type == 'yx'">
                        <span v-for="(item,index) in scope.row.statusArr" :key="index" :class="[stateActive==scope.row.no+item.index?'active':'']" @click="stateChange(item.index,scope.row.type,scope.row.no,scope.row.serial)">{{item.value}}</span>
                      </div>
                      <div class="input" v-if="scope.row.type == 'yc'">
                        <el-input placeholder="Please input" v-model="setYcVal" @blur="stateChange('',scope.row.type,scope.row.no,scope.row.serial)"/>
                      </div>
                    </template>
							  </el-table-column>
							  <el-table-column
							      prop="value" width="100px"
							      label="操作">
										<div class="handle" @click="cgcmd()">操作</div>
							  </el-table-column>
							</el-table>
		        </div>
		      </el-card>
		    </div>
		  </div>

		</el-dialog>
  </div>
</template>

<script>
import {treeselect} from "@/api/industry/industryArea";
import {getUserProfile} from "@/api/system/user";
import {listRealIndustryAreaSensor,listRealIndustryAreaSensorAll} from "@/api/industry/industryAreaSensor";
import {getIndustrySensorData, getYcHis, getYxHis, historyIncrement, cgCmd} from "@/api/industry/industrySensorData"
import {onLine,onLineAll} from "@/api/industry/base";
import {parseTime} from "@/utils/ruoyi";
import {deptAndIndustryAreaTreeSelect} from "@/api/industry/base";


export default {
  name: "index",
  data() {
    return {
      incrementCount: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 12,
        industryAreaId: null,
        deptId: '',
      },
      cityNames: [],
      queryParams2: {
        historyId: null,
        day: null,
        type: null
      },
      historyIncrement: [],
      queryParams3: {
        ycId: null,
        startDay: null,
        endDay: null,
        startHour: null,
        endHour: null,
        type: null
      },
      rules: {
        startDay: [
          {required: true, message: "开始日期不能为空", trigger: "blur"}
        ],
        endDay: [
          {required: true, message: "结束日期不能为空", trigger: "blur"}
        ],
        startHour: [
          {required: true, message: "开始时间不能为空", trigger: "blur"}
        ],
        endHour: [
          {required: true, message: "结束时间不能为空", trigger: "blur"}
        ],
        ycId: [
          {required: true, message: "测点不能为空", trigger: "blur"}
        ]
      },
      industryAreaSensorList: [],
      areaOptions: [],
      user: {
        dept: {}
      },
      loading: true,
      total: 0,
      open: false,
      title: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      sensorData: {},
      activeName: 'first',
      dataList: [],
      allEqNum: '',
      onlineNum: '',
      runEq: '',
      stopEq: '',
      warnEq: '',
      shutdownEq: '',
      unit: '',
      tabPosition: 'tubiao',
      show: false,
      allList: [],
      currentPage: 1,   //默认页码为1
      pagesize: 10,  //默认一页显示10条
      isActive: null,
      lister: '',
      statusCurr: '',
      deptOptions: [],
      deptName: '',
      filterNode: (value, data) => {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
			openTwo: false,
			stateActive: null,
      cgcmdparams:{
        termAddr:'',
        equipSerial:'',
        type:'',
        attributeKey:'',
        attributeValue:''
      },
      setYcVal:'',
    };
  },
  watch: {
    deptName: {
      handler: function (newValue, oldValue) {
        this.$refs["deptTreeRef"].filter(newValue);
      },
      deep: true, // 深度监听
    }
  },
  created() {
    this.cityNames = this.$route.query
  },
  mounted() {
    this.getUser();
    this.getTreeSelect();
    // this.getList();
    // this.getOnline();
    // this.lister = setInterval(() => {
    //   this.getOnline();
    //   this.getList();
    // },30000)
  },
  destroyed() {
    clearInterval(this.lister);
  },
  methods: {
		stateChange(value,type,no,serial) {
      if(type == 'yx'){
        this.stateActive = no+value;
        this.cgcmdparams.attributeValue = value;
      }
      if(type == 'yc'){
        this.cgcmdparams.attributeValue = this.setYcVal;
      }
      this.cgcmdparams.attributeKey = serial;
      this.cgcmdparams.type = type;
		},
    historyIncrementSearch() {
      this.$refs["queryParams3Ref"].validate(valid => {
        if (valid) {
          let that = this;
          that.incrementCount = 0
          historyIncrement(this.queryParams3).then(res => {
            this.historyIncrement = res.data
            res.data.forEach(i => {
              that.incrementCount += i.increment
            })
          })
        }
      })
    },
    change(a) {
      this.isActive = a;
      this.queryParams.sensorCurr = a;
      this.queryParams.pageNum = 1;
      this.getList()
      this.getOnline()
    },

    change1(a){
      this.isActive = a;
      this.queryParams.sensorCurr=null;
      this.queryParams.yxzt = a;
      this.queryParams.pageNum = 1;
      this.getList()
      this.getOnline()
    },

    getUser() {
      getUserProfile().then(response => {
        this.user = response.data;
      });
    },
    handleNodeClick(data) {
      this.queryParams.industryAreaId = '';
      this.queryParams.deptId = '';
      if (data.type != null) {
        this.queryParams.industryAreaId = data.id;
      } else {
        this.queryParams.deptId = data.id;
      }
      this.getList();
      this.getOnline()
    },
    getList() {
      this.loading = true;
      console.log(this.isActive)
      if(this.isActive!=null && (this.isActive=='2' || this.isActive=='3' || this.isActive=='4' || this.isActive=='5')){
        listRealIndustryAreaSensorAll(this.queryParams).then(response => {
          this.industryAreaSensorList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      }else{
        listRealIndustryAreaSensor(this.queryParams).then(response => {
          this.industryAreaSensorList = response.rows;
          this.total = response.total;
          this.loading = false;
          for (let dat of this.industryAreaSensorList) {
            let statusCurr = '';
            if (dat.equipmentYxStatusList !== undefined && dat.equipmentYxStatusList != null && dat.equipmentYxStatusList.length > 0) {
              for (let dd of dat.equipmentYxStatusList) {
                if (dd.yxstatusCode == 'run' && dd.yxCurr == 1) {
                  statusCurr = 'run';
                } else if (dd.yxstatusCode == 'stop' && dd.yxCurr == 1) {
                  statusCurr = 'stop';
                } else if (dd.yxstatusCode == 'warn' && dd.yxCurr == 1) {
                  statusCurr = 'warn';
                }
              }
            } else if (dat.equipmentYcStatusList !== undefined && dat.equipmentYcStatusList != null && dat.equipmentYcStatusList.length > 0) {
              for (let dd of dat.equipmentYcStatusList) {
                if (dd.ycstatusCode == 'run' && dd.ycCurr == 1) {
                  statusCurr = 'run';
                } else if (dd.ycstatusCode == 'stop' && dd.ycCurr == 1) {
                  statusCurr = 'stop';
                } else if (dd.ycstatusCode == 'warn' && dd.ycCurr == 1) {
                  statusCurr = 'warn';
                }
              }
            }
            if (statusCurr == '') {
              dat.statusCurr = 'shutdown';
            } else {
              dat.statusCurr = statusCurr;
            }
          }
        });
      }
    },
    getOnline() {
      onLine(this.queryParams).then(res => {
        let data = res.data
        if (null !== data && typeof data !== 'undefined') {
          this.allEqNum = data.allEq
          this.onlineNum = data.online
        }
      })
      onLineAll(this.queryParams).then(res => {
        let data = res.data
        if (null !== data && typeof data !== 'undefined') {
          this.runEq = data.runEq
          this.shutdownEq = data.shutdownEq
          this.warnEq = data.warnEq
          this.stopEq = data.stopEq
        }
      })
    },
    /** 查询区域下拉树结构 */
    getTreeSelect() {
      deptAndIndustryAreaTreeSelect(this.cityNames, {status: "0", delFlag: '0'}).then(response => {
        this.deptOptions = response.data;
        if (this.deptOptions.length > 0) {
          this.$nextTick(() => {
            this.$refs["deptTreeRef"].setCurrentKey(this.deptOptions[0].id);
            this.handleNodeClick(this.deptOptions[0])
          })
        }
        // this.$refs.tree.setCurrentKey(this.curren)
      }, error => {
        console.log(error)
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    /** 数据概览按钮操作 */
    handleSensor(row) {
      this.show = false;
      this.dataList = [];
      this.allList = [];
      this.historyIncrement = []
      this.incrementCount = 0
      this.unit = null;
      getIndustrySensorData(row.id).then(response => {
        if (response.code == 200) {
          let realList = [];
          var historyList = [];
          if (response.data.equipmentYcList.length > 0) {
            for (let yc of response.data.equipmentYcList) {
              historyList.push({
                id: yc.ycNo,
                name: yc.ycName,
                type: 'yc'
              })
              if (yc.ycValue == null) {
                yc.ycValue = 0
              }
              realList.push({
                name: yc.ycName,
                value: yc.ycValue + yc.ycUnit,
                time: yc.ycDt
              })
            }
          }
          if (response.data.equipmentYxList.length > 0) {
            for (let yx of response.data.equipmentYxList) {
              historyList.push({
                id: yx.yxNo,
                name: yx.yxName,
                type: 'yx'
              })
              let value = "";
              if (response.data.equipmentYxList.length > 0 && yx.yxCurr != null) {
                for (let yx2 of response.data.sensor.yxs) {
                  if (yx.yxNo == yx2.yxNo) {
                    switch (yx.yxCurr) {
                      case 0:
                        value = yx2.yxDes0;
                        break;
                      case 1:
                        value = yx2.yxDes1;
                        break;
                      case 2:
                        value = yx2.yxDes2;
                        break;
                      case 3:
                        value = yx2.yxDes3;
                        break;
                      case 4:
                        value = yx2.yxDes4;
                        break;
                      case 5:
                        value = yx2.yxDes5;
                        break;
                      case 6:
                        value = yx2.yxDes6;
                        break;
											case 7:
												value = yx2.yxDes7;
                        break;
											case 8:
												value = yx2.yxDes8;
                        break;
											case 9:
												value = yx2.yxDes9;
                        break;
											case 10:
												value = yx2.yxDes10;
                        break;
                      default:
                        break;
                    }
                    break;
                  }
                }
              }
              realList.push({
                no:yx.yxNo,
                name: yx.yxName,
                value: value,
                time: yx.yxDt
              })
            }
          }
          response.data.realList = realList;
          response.data.historyList = historyList;
          this.sensorData = response.data;
        }
        this.open = true;
        this.activeName = "first";
        this.queryParams2.day = null;
        this.queryParams2.historyId = null;
        this.queryParams3.startDay = null
        this.queryParams3.endDay = null
        this.queryParams3.startHour = null
        this.queryParams3.endHour = null
        this.queryParams3.ycId = null
        const chartmaindom = document.getElementById('chart');
        if (chartmaindom != null) {
          chartmaindom.removeAttribute('_echarts_instance_');
        }
        let myChart = this.echarts.init(document.getElementById('chart'))
        myChart.clear()
      });
    },
		handleSensorTwo(row) {
		  this.show = false;
		  this.dataList = [];
		  this.allList = [];
		  this.historyIncrement = []
		  this.incrementCount = 0
		  this.unit = null;
		  getIndustrySensorData(row.id).then(response => {
		    if (response.code == 200) {
		      let realList = [];
		      var historyList = [];
		      if (response.data.equipmentYcList.length > 0) {
		        for (let yc of response.data.equipmentYcList) {
		          historyList.push({
		            id: yc.ycNo,
		            name: yc.ycName,
		            type: 'yc'
		          })
		          if (yc.ycValue == null) {
		            yc.ycValue = 0
		          }
              if(yc.commandFlag == '1'){
                  realList.push({
                    no:yc.ycNo,
                    name: yc.ycName,
                    serial:yc.ycSerial,
                    value: yc.ycValue + yc.ycUnit,
                    time: yc.ycDt,
                    type: 'yc',
                    commandFlag:yc.commandFlag
                })
              }

		        }
		      }
		      if (response.data.equipmentYxList.length > 0) {
		        for (let yx of response.data.equipmentYxList) {
		          historyList.push({
		            id: yx.yxNo,
		            name: yx.yxName,
		            type: 'yx'
		          })
		          let value = "";
              let statusArr =[];
		          if (response.data.equipmentYxList.length > 0 && yx.yxCurr != null) {
		            for (let yx2 of response.data.sensor.yxs) {
		              if (yx.yxNo == yx2.yxNo) {
		                switch (yx.yxCurr) {
		                  case 0:
		                    value = yx2.yxDes0;
		                    break;
		                  case 1:
		                    value = yx2.yxDes1;
		                    break;
		                  case 2:
		                    value = yx2.yxDes2;
		                    break;
		                  case 3:
		                    value = yx2.yxDes3;
		                    break;
		                  case 4:
		                    value = yx2.yxDes4;
		                    break;
		                  case 5:
		                    value = yx2.yxDes5;
		                    break;
		                  case 6:
		                    value = yx2.yxDes6;
		                    break;
											case 7:
												value = yx2.yxDes7;
												break;
											case 8:
												value = yx2.yxDes8;
												break;
											case 9:
												value = yx2.yxDes9;
												break;
											case 10:
												value = yx2.yxDes10;
												break;
		                  default:
		                    break;
		                }
		                break;
		              }
		            }
		          }
              for(var i = 0;i < 11;i++){
                var key = 'yxDes'+i;
                let value = yx[key];
                if(value != '' && value != null){
                  let cur = {'ycno':yx.yxNo,'index':i,'value':yx[key]}
                  statusArr.push(cur)
                }
              }
              if(yx.commandFlag == '1'){
                realList.push({
                  no:yx.yxNo,
                  name: yx.yxName,
                  serial:yx.yxSerial,
                  value: value,
                  time: yx.yxDt,
                  type: 'yx',
                  commandFlag:yx.commandFlag,
                  statusArr: statusArr
                })
              }
		        }
		      }
		      response.data.realList = realList;
		      response.data.historyList = historyList;
		      this.sensorData = response.data;
          this.cgcmdparams.termAddr = this.sensorData.sensor.termChanserial;
          this.cgcmdparams.equipSerial = this.sensorData.sensor.equipmentSerial;
		    }
		    this.openTwo = true;
		    this.activeName = "first";
		    this.queryParams2.day = null;
		    this.queryParams2.historyId = null;
		    this.queryParams3.startDay = null
		    this.queryParams3.endDay = null
		    this.queryParams3.startHour = null
		    this.queryParams3.endHour = null
		    this.queryParams3.ycId = null
		    const chartmaindom = document.getElementById('chart');
		    if (chartmaindom != null) {
		      chartmaindom.removeAttribute('_echarts_instance_');
		    }
		    let myChart = this.echarts.init(document.getElementById('chart'))
		    myChart.clear()
		  });
		},
    changeType(val) {
      for (let history of this.sensorData.historyList) {
        if (history.id == val) {
          this.queryParams2.type = history.type;
        }
      }
    },
    search() {
      this.dataList = [];
      this.allList = [];
      this.show = true;
      this.unit = null;
      if (this.queryParams2.type == 'yc') {
        this.searchYc();
      } else if (this.queryParams2.type == 'yx') {
        this.searchYx();
      }
    },
    searchYc() {
      this.queryParams2.type = 'yc'
      getYcHis(this.queryParams2).then(response => {
        let data = response.data.ycHisData;
        this.unit = response.data.ycunit
        this.dataList.push({
          type: 'line',
          showSymbol: false,
          lineStyle: {
            width: 1
          },
          data: response.data.ycHisData
        })
        for (let i = 0; i < data.length; i++) {
          let date = parseTime(data[i].name)
          this.allList.push({
            value: data[i].value[1] + (this.unit != null ? this.unit : ""),
            dateValue: data[i].name,
            date: date
          })
        }
        this.allList.sort(function (a, b) {
          return b.dateValue - a.dateValue;//	降序，升序则反之
        });
        this.chart()//这个是绘制图形的函数
      });
    },
    searchYx() {
      this.queryParams2.type = 'yc'
      getYxHis(this.queryParams2).then(response => {
        let data = response.data.yxHisData;
        this.dataList.push({
          type: 'line',
          showSymbol: false,
          lineStyle: {
            width: 1
          },
          data: response.data.yxHisData
        })
        for (let i = 0; i < data.length; i++) {
          let date = parseTime(data[i].name)
          this.allList.push({
            value: this.yxState(data[i].value[1]),
            dateValue: data[i].name,
            date: date
          })
        }
        this.allList.sort(function (a, b) {
          return b.dateValue - a.dateValue;//	降序，升序则反之
        });
        this.chart()//这个是绘制图形的函数
      });
    },
    chkCharts(val) {
      if (val == 'tubiao') {
        this.chart()//这个是绘制图形的函数
      }
    },
    handleSizeChange(size) {   //一页显示多少条
      this.pagesize = size;
    },
    handleCurrentChange(currentPage) {  //页码更改方法
      this.currentPage = currentPage;
    },
    chart() {
      var that = this;
      const chartmaindom = document.getElementById('chart');
      chartmaindom.removeAttribute('_echarts_instance_');
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.echarts.init(document.getElementById('chart'))
      myChart.clear()
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'time',
          axisLabel: {
            formatter: function (value, index) {
              var date = new Date(value);
              var hour = date.getHours();
              var minutes = date.getMinutes();
              if (hour < 10) {
                hour = '0' + hour;
              }
              if (minutes < 10) {
                minutes = '0' + minutes;
              }
              return hour + ':' + minutes;
            },
          },
          boundaryGap: false,
          //data: this.chartList
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            show: true,
            //Y轴数值可添加百分号
            formatter: function (value, index) {
              if (that.queryParams2.type == 'yc') {
                return value + (that.unit != null ? that.unit : "");
              } else if (that.queryParams2.type == 'yx') {
                return that.yxState(value)
              }
            }
          },
        },
        series: this.dataList
      });
      // 绘制图表
    },
    yxState(value) {
      for (let yx of this.sensorData.sensor.yxs) {
        if (yx.yxNo == this.queryParams2.historyId) {
          switch (value) {
            case 0:
              return yx.yxDes0;
            case 1:
              return yx.yxDes1;
            case 2:
              return yx.yxDes2;
            case 3:
              return yx.yxDes3;
            case 4:
              return yx.yxDes4;
            case 5:
              return yx.yxDes5;
            case 6:
              return yx.yxDes6;
						case 7:
							return yx.yxDes7;
						case 8:
							return yx.yxDes8;
						case 9:
							return yx.yxDes9;
						case 10:
							return yx.yxDes10;
            default:
              break;
          }
          break;
        }
      }
    },
    // 忱工控制命令
    cgcmd() {
      cgCmd(this.cgcmdparams).then(response => {
        if (response.code == 200) {
          this.$message.success("操作成功");
        } else {
          this.$message.error("操作失败");
        }
      })
    }
  },
}
</script>

<style scoped lang="scss">
.paramenter {
  padding: 15px;

  :deep(.mydialog) {
    height: 90%;
    margin: 0 !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .el-dialog__body {
      padding: 15px;
      height: calc(100% - 30px);
    }
  }

  .fl {
    float: left;
  }

  .text-right {
    text-align: right;
  }

  .pading10 {
    padding-left: 10px;
  }

  .greyline {
    width: 100%;
    border-top: 1px solid #f0f0f0;
  }

  .lborder {
    border-left: 1px solid #f0f0f0;
  }

  .card-tit {
    padding-left: 10px;
    border-left: 5px solid #09bec5;
    font-size: 18px;
  }

  .qysb {
    .qysb-head {
      .title {
        color: #333333;
        font-size: 18px;
      }

      .ico {
        margin-top: 4px;
      }
    }

    .tree {
      h4 {
        margin: 10px 0 10px;
        color: #09bec5;
        font-weight: bold;
        font-size: 16px;
        border-bottom: 1px solid #e7e8ed;
        padding: 0 0 15px;
      }

    }

  }

  .head-tit {
    .ico {
      background: #09bec5;
      color: #fff;
      font-size: 12px;
      padding: 2px 12px;
      border-radius: 50px;
      margin-left: 10px;
    }

    .datetime {
      font-size: 14px;
      color: #5c5c5c;
    }

  }

  .paramenter-on {
    padding: 15px;
    height: 100%;

    .thumbpic {
      height: 248px;
      padding: 10px;
      border: 1px solid #dedede;
      border-radius: 5px;
      box-shadow: 0 0 10px #dedede;

      img {
        max-width: 100%;
        max-height: 100%;
        display: block;
        margin: 0 auto;
      }
    }

    .title {
      border-bottom: 1px solid #ebebeb;
      padding-bottom: 10px;

      .card-tit {
        padding-left: 10px;
        border-left: 5px solid #09bec5;
        font-size: 18px;
      }
    }

    .sbgy-ul {
      padding: 15px 0 0;

      .sbgy-li {
        padding: 5px 0;

        .ico {
          text-align: center;
        }

        .name {
          font-size: 15px;
          color: #a1aab7;
          line-height: 31px;

          span {
            color: #252631;
          }
        }

      }
    }

    .sbmx-nr {
      padding-top: 15px;
      height: calc(100% - 238px);

      :deep(.el-card) {
        height: 100%;

        .el-card__body {
          height: 100%;
        }

        .sbmx-con {
          height: calc(100% - 40px);

          .el-tabs {
            height: 100%;

            .el-tabs__content {
              height: calc(100% - 50px);

              .el-tab-pane {
                height: 100%;
              }
            }
          }
					.state{
						span{
							border: 1px solid #999;
							color: #999;margin-right: 5px;padding: 0 10px;
							border-radius: 3px;
							line-height: 24px;
							display: inline-block;
							cursor: pointer;
						}
						.active{
							background: #09bec5;border-color: #09bec5;
							color: #fff;
						}
					}
					.handle{
						cursor: pointer;
						color: #09bec5;
					}
        }
      }
    }

    .echart-con {
      height: calc(100% - 32px);
    }
  }


  .sbgl-com {
    height: calc(100vh - 200px);
    overflow-y: auto;
    overflow-x: hidden;

    .sbgl-top {
      position: relative;
      text-align: center;
      padding: 5px 0 10px;
      margin-bottom: 10px;
      border-bottom: 1px solid #eee;

      :deep(.el-select) {
        width: 120px;

        .el-input__inner {
          border: 0;
          font-size: 16px;
          color: #09bec5;
        }

        .el-icon {
          font-size: 16px;
          color: #09bec5;
        }

        .el-select-dropdown__item.selected {
          color: #09bec5;
        }
      }

      .state {
        // position: absolute;right: 0;top: 6px;
        //text-align: right;
        font-size: 16px;
        color: #5c5c5c;
        width: 90%;
        margin: 0 auto;

        span {
          color: #09bec5;
          font-size: 20px;
        }

        i {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 5px;
          display: inline-block;
          border: 2px solid #dcdcdc;
        }

        i.active {
          border: 4px solid #09bec5;
        }

        .state-li {
          cursor: pointer;

          .green {
            color: #22ac38;
          }

          .redcolor {
            color: #fc3a3a;
          }
          .orange {
            color: #dc6413;
          }
          .gray {
            color: #afaaa7;
          }
        }
      }
    }

    .li-subtit {
      .h4 {
        display: inline-block;
        margin-right: 5px;
        font-size: 14px;
      }

      .i {
        font-size: 12px;
        border-radius: 20px;
        display: inline-block;
        font-style: normal;
        color: #fff;
        padding: 0 5px;
      }

      .i.green {
        background: #22ad38;
      }

      .i.red {
        background: #fd3b3c;
      }

      :deep(.el-icon) {
        float: right;
        color: #5c5c5c;
      }
    }

    .data-top {
      span {
        display: block;
        color: #555;
        font-size: 14px;
      }

      span.rt {
        text-align: right;
      }
    }

    .data {
      //background: #f7f7f7;border-radius:5px;overflow-y: auto;
      //height: 180px;padding: 10px;margin: 10px 0 0;
      //line-height: 2;

      background: #f9ffff;
      border-radius: 5px;
      height: 90px;
      padding: 10px;
      margin: 10px 0 0;
      line-height: 1.5;
      overflow-y: auto;
      border: 1px solid #f0f9f9;
			cursor: pointer;
      //.zaixian:nth-child(1){
      //  span{
      //    font-size: 16px;
      //    color: #333333;
      //  }
      //  .rt{
      //    font-size: 18px;
      //    color: #1bb0d7;
      //    font-weight: bold;
      //
      //  }
      //}

      .dataitem {
        span {
          display: block;
          color: #555;
          font-size: 14px;
        }

        span.rt {
          text-align: right;
        }
      }
    }

    .gl {
      margin-bottom: 10px;

    }

    .li-title {
      padding: 5px 0;
      text-align: left;
      border-bottom: 1px solid #f5f5f5;
      margin-bottom: 10px;

      img {
        width: 30px;
      }

      h4 {
        font-size: 14px;
        margin: 5px 0 10px;
        color: #666
      }

      .li-subtit {
        width: 34px;
        text-align: center;

        i {
          display: block;
        }
      }

      .name {
        font-size: 16px;
        text-align: right;
        margin: 3px 0 8px;
				img{
					cursor: pointer;
					width: 16px;vertical-align: text-top;
				}
      }

      .state {
        text-align: right;
        font-size: 14px;
        height: 19px;

        span {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid transparent;
          display: inline-block;
        }

        .run {
          background: #22ac38;
        }

        .runtext {
          color: #22ac38;
        }

        .gray {
          background: #B1B1B1;
        }

        .graytext {
          color: #B1B1B1;
        }

        .gray2 {
          background: #4a4646;
        }

        .graytext2 {
          color: #585656;
        }

        .stop {
          background: #f49d0c;
        }

        .stoptext {
          color: #f49d0c;
        }

        .grey {
          border-color: #B1B1B1;
        }

        .warn {
          background: #fc3a3a;
        }

        .warntext {
          color: #fc3a3a;
        }

        .green.checked {
          background: #22ac38;
        }

        .orange.checked {
          background: #f49d0c;
        }

        .warn.checked {
          background: #fc3a3a;
        }
      }

      .outline {
        .grey {
          border-color: #afb0b0;
        }
      }
    }

    .li-con {
      font-size: 12px;
      color: #5c5c5c;

      .li-con-nr {
        line-height: 30px;
        padding: 0 10px;
      }

    }
  }

  .freeze-con {

    .button-ico {
      .btn {
        border: 0;
        padding: 0 20px;
        height: 24px;
      }

      .active {
        color: #fff;
        background: #09bec5;
      }
    }
  }

  .zjzl {
    float: right;

    p {
      margin: 0;
      line-height: 32px;
      font-size: 16px;
      color: #09bec5;
    }
  }

  .freeze-nr {

    .tit {
      line-height: 32px;
      padding-right: 6px;
    }

    .inquirebtn {
      background: #09bec5;
      color: #fff;
      border: none;
    }
  }

  .pad10 {
    padding: 10px;
  }
}
</style>
