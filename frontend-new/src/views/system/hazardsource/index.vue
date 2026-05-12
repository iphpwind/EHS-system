<template>


  <div class="dw-indexcon">
    <!--  header-->
    <!--    <div class="dw-head af-item">-->
    <!--      <el-row>-->
    <!--        <el-col :span="9">-->
    <!--          <div class="head-left">-->
    <!--            <div style="padding-left: 5px;">时间：{{ now }}</div>-->
    <!--            <div class="weather">-->
    <!--              <iframe allowtransparency="true" frameborder="0" width="317" height="28" scrolling="no"-->
    <!--                      style="pointer-events: none"-->
    <!--                      src="//tianqi.2345.com/plugin/widget/index.htm?s=3&z=1&t=1&v=0&d=1&bd=0&k=&f=ffffff&ltf=009944&htf=cc0000&q=1&e=0&a=1&c=54511&w=317&h=28&align=left"></iframe>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--        </el-col>-->
    <!--        <el-col :span="6">-->
    <!--          <div class="head-tit">-->
    <!--            <h4>重大危险源</h4>-->
    <!--          </div>-->
    <!--        </el-col>-->
    <!--        <el-col :span="9">-->
    <!--          <div class="head-right">-->
    <!--            <div class="fl">-->
    <!--              <el-select v-model="value" placeholder="请选择">-->
    <!--                <el-option-->
    <!--                    v-for="item in options"-->
    <!--                    :key="item.value"-->
    <!--                    :label="item.label"-->
    <!--                    :value="item.value">-->
    <!--                </el-option>-->
    <!--              </el-select>-->
    <!--            </div>-->
    <!--            <div class="fl jinggao">-->
    <!--              <img src="@/assets/images/jinggao.png">-->
    <!--              &lt;!&ndash;              动态图片&ndash;&gt;-->
    <!--              &lt;!&ndash;              <img src="@/assets/images/jinggao.gif">&ndash;&gt;-->
    <!--            </div>-->
    <!--          </div>-->


    <!--        </el-col>-->
    <!--      </el-row>-->
    <!--    </div>-->
    <!--  header-->

    <!--centre -->
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

      <!--    右侧图标-->
      <!--      <div class="right-ico af-item">-->
      <!--        <div class="right-nr">-->
      <!--          <input type="text" placeholder="请输入人员姓名">-->
      <!--          <button><img data-v-0cc9555c="" src="@/assets/images/rico1.jpg"></button>-->
      <!--          <button><img data-v-0cc9555c="" src="@/assets/images/rico2.jpg"></button>-->
      <!--          <button><img data-v-0cc9555c="" src="@/assets/images/rico3.png"></button>-->
      <!--        </div>-->
      <!--      </div>-->

      <!--      底部-->
      <!--      <div class="layout-bottom">-->
      <!--        <el-row>-->
      <!--          <el-col :span="6" class="layout-bottomli">-->
      <!--            <div class="af-item layout-botlinr">-->
      <!--              <div class="shuxian">-->
      <!--                <div class="bottname">特殊作业</div>-->
      <!--                <div class="bottshu">3</div>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--          </el-col>-->
      <!--          <el-col :span="6" class="layout-bottomli">-->
      <!--            <div class="af-item layout-botlinr">-->
      <!--              <div class="shuxian">-->
      <!--                <div class="bottname">设备监控</div>-->
      <!--                <div class="bottshu">3</div>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--          </el-col>-->
      <!--          <el-col :span="6" class="layout-bottomli">-->
      <!--            <div class="af-item layout-botlinr">-->
      <!--              <div class="shuxian">-->
      <!--                <div class="bottname">未处理报警</div>-->
      <!--                <div class="bottshu">3</div>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--          </el-col>-->

      <!--          <el-col :span="6" class="layout-bottomli" @click="tcClick">-->
      <!--            <div class="af-item layout-botlinr">-->
      <!--              <div class="shuxian">-->
      <!--                <div class="bottname">已处理报警</div>-->
      <!--                <div class="bottshu">3</div>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--          </el-col>-->

      <!--        </el-row>-->
      <!--      </div>-->
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
        <!--        <el-button type="primary" @click="toPopup">主要按钮</el-button>-->


        <!--        <el-button type="primary" @click="toPopup">主要按钮</el-button>-->

        <div class="nronglist" v-if="shownrong">
          <div class="nronglistcon">
            <div class="closebtn" @click="closePopup">X</div>
            <el-row class="nronglistli" v-for="item in measuringPointList">
              <el-col :span="12">
                <div>{{ item.name }}</div>
              </el-col>
              <el-col :span="12">
                <div class="text-align-r cursor">实时值：{{ item.data }}&nbsp;&nbsp; <a style="color: dodgerblue"
                                                                                    @click="openxq(item.no)">详情</a>
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
                        <div>一号库一号烟感报警器</div>
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
                        <div>555001</div>
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
                        <div>999999</div>
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
                        <div>-555001</div>
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
                        <div>0</div>
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
                        <div>2022-01-01 05:02:23</div>
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
                      <el-select v-model="valuejc" placeholder="请选择">
                        <el-option
                            v-for="item in optionsjc"
                            :key="item.valuejc"
                            :label="item.labeljc"
                            :value="item.valuejc">
                        </el-option>
                      </el-select>
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
        <div class="return" @click="closeTimeLine"><img src="@/assets/images/return.png" style="width:25px;"></div>
      </div>


    </div>
    <!--centreend -->


    <!--地图-->
    <div id="cesiumContainer" class="dw-map"></div>
    <!--地图end-->


  </div>


</template>

<script>
import {defineComponent, onMounted, ref, reactive} from 'vue';
import bjt3D from "../../../utils/bjt3DMap";
import {getImgSrc, getLayerColor, positionImg} from '@/utils/pointUtil'
import {addHazardSource, loadHazardSource, addLayer, selectSensorData} from '@/api/system/hazard'
import {timeLine, key, getMapConfig} from '@/api/system/positioning'
import jquery from 'jquery'
import {websocketCommand} from "@/utils/websocket";
import noneStateImg from '@/assets/images/zanwu.png';

export default {
  name: "index",
  data() {
    return {
      wsObj: null,
      stateImg: noneStateImg,
      optionsjc: [{
        valuejc: '选项1',
        labeljc: '近6个小时'
      }, {
        valuejc: '选项2',
        labeljc: '近12个小时'
      }],
      valuejc: '',
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
      now: null,
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
      }
    }
  },
  setup() {
  },
  created() {

  },
  mounted() {
    jquery('#cesiumContainer').html('')
    this.nowDate()
    this.$store.dispatch('app/topHide', false)


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
      bjt3D.init('cesiumContainer', data.mapAddress, data, () => {
      //bjt3D.init('cesiumContainer', 'http://172.16.1.126:7373/HP_3dTiles20220126/tileset.json', data, () => {
        this.pointAndLayerLoad()
        this.startSocket();
      })
      bjt3D.pickEntity((id) => {
        let entity = bjt3D.getById(id)
        if (typeof entity.polygon !== 'undefined') {
          console.log('这是个色块')
        } else {
          this.pickEntity(id)
        }
      }, () => {
        that.shownrong = false
      });
    });
  },
  unmounted() {
    clearInterval(this.nowTimer)
  },
  methods: {
    nowDate() {
      this.nowTimer = setInterval(() => {
        let nowDate = new Date();
        this.now = nowDate.getFullYear() + "-" + (nowDate.getMonth() + 1)
            + "-" + nowDate.getDate() + "  " + nowDate.getHours() + ":" + nowDate.getMinutes() + ":" + nowDate.getSeconds()
      }, 1000)
    },
    openxq(no) {
      this.dialogVisibleli = true;
      this.$nextTick(() => {
        this.jcsj();
      })
    },
    clickData(row, event, column) {

      console.log(row)
      this.dialogVisible = true
    },
    callback() {
      console.log('初始化地图成功')
    },
    // 中间弹出
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
    },
    pointAndLayerLoad(type, typeId) {
      loadHazardSource(type, typeId).then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].modelType == 1) {
            bjt3D.pointLoad(res.data[i].id, res.data[i].modelTypeId, res.data[i].modelPosition, getImgSrc(res.data[i].modelTypeId))
          } else {
            bjt3D.layerLoad1(res.data[i].id, res.data[i].modelLabel, res.data[i].modelTypeId, res.data[i].modelPosition, getLayerColor(res.data[i].modelTypeId))
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
    jcsj() {
      // 基于准备好的dom，初始化echarts实例
      const chartmaindom = document.getElementById('jcsj');
      chartmaindom.removeAttribute('_echarts_instance_');
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
          data: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
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
      const data = e && e.detail.data
      if (this.isJson(data)) {
        let json = JSON.parse(data)
        let entity = bjt3D.viewer.entities.getById(json.userId)
        if (typeof entity != 'undefined') {
          bjt3D.pointMove(json.userId, json.position, 200)
        } else {
          bjt3D.pointPosition(json.userId, json.userName, positionImg(), json.position)
          bjt3D.positionPoints.push(json.userId);
        }
      }
    },
    pickEntity(id) {
      this.pickId = id;
      let flag = bjt3D.positionPoints.indexOf(id);

      if (flag == -1) {
        //biaozhu
        console.log(id)
        this.shownrong = true
        selectSensorData(id).then(res => {
          this.measuringPointList = res.data;
        })
      } else {
        //renyuandingwei
        this.ddialogVisible = true
      }
    },
    timelineClick: function () {
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
        bjt3D.removeAll()
        this.startSocket();
        console.log(data)
        if (data.data.length !== 0) {
          let linePosition = [];
          for (let i = 0; i < data.data.length; i++) {
            linePosition.push(bjt3D.parseCartesian3(data.data[i]));
          }
          bjt3D.trajectory(linePosition);
          bjt3D.pointPosition(data.data[0].userId, data.data[0].userName, positionImg(), data.data[0]);
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
      bjt3D.pointMove(this.data[v].userId, this.data[v], 10);
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
        websocketCommand(that.wsObj, 'create', 5000, function () {
          that.wsObj.send('')
        }, this.getSocketData, this.reconnectWs);
      });
    },
    stopSocket() {
      this.wsObj.close()
    },
    reconnectWs() {
      if (this.wsObj) {
        this.startSocket();
      }
    },
  }
}
</script>

<style lang="scss" scoped>
//#cesiumContainer {
//  width: 100%;
//  height: 100%;
//}
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
      left: calc(2% + 0.9rem);
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
  z-index: 1;
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
  margin-top: 40px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  pointer-events: auto;
  padding: 5px 10px;
  position: relative;


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

</style>
