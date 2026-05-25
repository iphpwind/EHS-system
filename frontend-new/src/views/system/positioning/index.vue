<template>


  <div class="dw-indexcon">
    <!--  header-->
    <div class="dw-head af-item">
      <el-row>
        <el-col :span="9">
          <div class="head-left">
            <div style="padding-left: 5px;">时间：2020-01-01</div>
            <div class="weather">
              <iframe allowtransparency="true" frameborder="0" width="317" height="28" scrolling="no"
                      src="//tianqi.2345.com/plugin/widget/index.htm?s=3&z=1&t=1&v=0&d=1&bd=0&k=&f=ffffff&ltf=009944&htf=cc0000&q=1&e=0&a=1&c=54511&w=317&h=28&align=left"></iframe>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="head-tit">
            <h4>人员在岗定位</h4>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="head-right">
            <div class="fl">
              <el-select v-model="value" placeholder="请选择">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="fl jinggao">
              <!--              <img src="@/assets/images/jinggao.png">-->
              <!--              动态图片-->
              <img src="@/assets/images/jinggao.gif">
            </div>
          </div>


        </el-col>
      </el-row>
    </div>
    <!--  header-->


    <!--centre -->
    <div class="dw-con">

      <!--<el-button type="text" @click="ddialogVisible = true" >人员定位按钮</el-button>-->

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
import {getImgSrc, positionImg} from '@/utils/pointUtil'
import {websocketCommand} from "@/utils/websocket";
import {timeLine, key, getMapConfig} from '@/api/system/positioning'
import {toRaw} from '@vue/reactivity'
import jquery from 'jquery'
import { useAppStore } from '@/store/modules/app'

export default {
  name: "index",
  data() {
    return {
      wsObj: null,
      timer: null,
      pickId: '',
      max: 0,
      valuetime: 0,
      showtimeline: false,
      dialogVisible: false,
      data: null,
      // 弹窗
      ddialogVisible: false,
      /*时间选择器*/
      dateValue: [Date.now(), new Date().setMinutes(new Date().getMinutes() - 7)],

      sliderstr: '',
      style: {
        paddingLeft: '0%'
      }
    }
  },

  setup() {
    onMounted(() => {

    })
  },
  created() {

  },
  // computed: {
  //   style() {
  //     const length = this.max,
  //         progress = this.sliderstr,
  //         left = progress / length * 100
  //     return {
  //       paddingLeft: `${left}%`,
  //       // paddingLeft: '20%'
  //     }
  //   },
  // },

  mounted() {
    this.appStore.topHide(false)
    jquery('#cesiumContainer').html('')
    let that = this
    getMapConfig().then(res => {
      let data = res.data;
      console.log(data)
      bjt3D.init('cesiumContainer', data.mapAddress, data, function () {
        key().then(res => {
          let url = import.meta.env.VITE_WS_BASE_API + '/socket/websocket/' + res.data.key;
          that.wsObj = new WebSocket(url);
          websocketCommand(that.wsObj, 'create', 5000, function () {
            that.wsObj.send('')
          }, this.getSocketData, function (){});
        });
      })
    });
  },
  methods: {
    handleClose(done) {
      let that = this
      key().then(res => {
        let url = import.meta.env.VITE_WS_BASE_API + '/socket/websocket/' + res.data.key;
        that.wsObj = new WebSocket(url);
        websocketCommand(that.wsObj, 'create', 5000, function () {
          that.wsObj.send('')
        }, this.getSocketData, function (){});
      });
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
    },
    closeTimeLine() {
      this.showtimeline = false;
      this.dialogVisible = false;
      bjt3D.removeAll();
      let that = this
      key().then(res => {
        let url = import.meta.env.VITE_WS_BASE_API + '/socket/websocket/' + res.data.key;
        that.wsObj = new WebSocket(url);
        websocketCommand(that.wsObj, 'create', 5000, function () {
          that.wsObj.send('')
        }, this.getSocketData, function (){});
      });
      clearInterval(this.timer)
    },
    // 时间轴
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
        this.wsObj.close();
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

    clickData(row, event, column) {
      this.dialogVisible = true
    },
    callback() {
      console.log('初始化地图成功')
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
        }
        bjt3D.pickEntity((id) => {
          this.ddialogVisible = true
          this.pickId = id;
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
//#cesiumContainer {
//  width: 100%;
//  height: 100%;
//}

.el-slider__marks-text {
  top: 20px;

  span {
    display: inline-block;
    height: 8px !important;
    overflow: hidden;
  }
}

.el-slider__runway {
  height: 30px;

  .el-slider__bar {
    height: 30px;
  }

  .el-slider__button-wrapper {
    top: -2px;
  }
}

.el-slider__stop {
  display: none;
}


.return {
  padding: 4px 0 0 20px;
}

.anniu {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  pointer-events: auto;
}


.tyxq-tc {
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


.fl {
  float: left;
}

.fr {
  float: right;
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
    position: relative;
    pointer-events: none;
    z-index: 1;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    pointer-events: auto;
    //图标
    .togglebar {
      position: absolute;
      left: calc(22% + 0.9rem);
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
      left: calc(22% + 0.9rem);
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


  }


  .dw-map {
    width: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
    bottom: 0;
  }
}


</style>
