<template>
  <div class="app-container">
    <!-- <Configure selId="1" seltitle="迁安市马兰庄镇南山铁矿"> </Configure> -->
    <div class="mainbox">
      <div id="span1">尾矿物料</div>
      <div id="span2">浓密机</div>
      <div id="span3">加药装置</div>
      <div id="span4">带式过滤机</div>
      <div id="span5">1号</div>
      <div id="span6">2号</div>
      <div id="span7">3号</div>
      <div id="span8">4号</div>
      <div id="img1">
        <a>
          <img src="@/assets/hxhb/image001.png"/>
        </a>
      </div>
      <div id="img2">
        <a>
          <img src="@/assets/hxhb/image002.png"/>
        </a>
      </div>
      <div id="img3">
        <img src="@/assets/hxhb/image003.png"/>
      </div>
      <div id="img4">
        <img src="@/assets/hxhb/image004.png"/>
      </div>
      <div id="img5">
        <img src="@/assets/hxhb/image005.png"/>
      </div>
      <div id="img6">
        <a @click="showNongmiji('1297826441310859250')">
          <img src="@/assets/hxhb/image006.png" style="width:430px;"/>
        </a>
      </div>
      <div id="img7">
        <a @click="showJiayao('1297826441310859255')">
          <img src="@/assets/hxhb/image007.png" style="width: 320px;"/>
        </a>
      </div>
      <div id="img91">
        <a @click="showDaishiguolv1('1297826441310859265')">
          <img src="@/assets/hxhb/image009.png"/>
        </a>
      </div>
      <div id="img92">
        <a @click="showDaishiguolv2('1297826441310859270')">
          <img src="@/assets/hxhb/image009.png"/>
        </a>
      </div>
      <div id="img93">
        <a @click="showDaishiguolv3('1297826441310859275')">
          <img src="@/assets/hxhb/image009.png"/>
        </a>
      </div>
      <div id="img94">
        <a @click="showDaishiguolv4('1297826441310859280')">
          <img src="@/assets/hxhb/image009.png"/>
        </a>
      </div>
    </div>
    <el-dialog title="浓密机" width="900px" v-model="dialogNongmijiVisible">
      <div>
        <img src="@/assets/hxhb/image013.png"/>
      </div>
      <div>
        <table>
          <tr>
            <td class="aleft">液压站压力:</td>
            <td class="aright" colspan="3"><span>{{nongmiji.yali.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">液压站油温:</td>
            <td class="aright" colspan="3"><span>{{nongmiji.youwen.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">液压站油位:</td>
            <td class="aright" colspan="3"><span>{{nongmiji.yewei.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">远程停机控制按钮:</td>
            <td class="aright" colspan="3">
              <el-button type="danger" @click="stopNongmiji('0')">停机</el-button>
              <el-button type="info" @click="stopNongmiji('1')">取消</el-button>
            </td>
          </tr>
        </table>
      </div>
    </el-dialog>
    <el-dialog title="加药装置" width="900px" v-model="dialogJiayaoVisible">
      <div>
        <img src="@/assets/hxhb/image015.png" style="width:800px;"/>
      </div>
      <div>
        <table>
          <tr>
            <td class="aleft">搅笼运行信号:</td>
            <td colspan="3"><span>{{jiayao.jlyxxh.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">药箱液位:</td>
            <td colspan="3"><span>{{jiayao.yewei.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">加药泵运行信号1:</td>
            <td colspan="3"><span>{{jiayao.jybyxxh1.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">加药泵运行信号2:</td>
            <td colspan="3"><span>{{jiayao.jybyxxh2.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">远程停机控制按钮:</td>
            <td colspan="3">
              <el-button type="danger" @click="stopJiayao('0')">停机</el-button>
              <el-button type="info" @click="stopJiayao('1')">取消</el-button>
            </td>
          </tr>
        </table>
      </div>
    </el-dialog>
    <el-dialog title="带式过滤机1号" width="900px" v-model="dialogDaishiguolv1Visible">
      <div>
        <img src="@/assets/hxhb/image017.png"/>
      </div>
      <div>
        <table>
          <tr>
            <td class="aleft">驱动电机电流:</td>
            <td colspan="3"><span>{{daishi1.di.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">胶带带速:</td>
            <td colspan="3"><span>{{daishi1.spd.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">真空切换阀工作状态:</td>
            <td colspan="3"><span>{{daishi1.qhf.value}}</span></td>
          </tr>
<!--          <tr>-->
<!--            <td class="aleft" style="width:20%;">真空泵1运行信号:</td>-->
<!--            <td style="width:30%;"><span>{{daishi1.zkb1zt.value}}</span></td>-->
<!--            <td class="aleft" style="width:20%;">真空泵2运行信号:</td>-->
<!--            <td style="width:30%;"><span>{{daishi1.zkb2zt.value}}</span></td>-->
<!--          </tr>-->
          <tr>
            <td class="aleft">真空泵1电流:</td>
            <td><span>{{daishi1.zkb1di.value}}</span></td>
            <td class="aleft">真空泵2电流:</td>
            <td><span>{{daishi1.zkb2di.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">远程停机控制按钮:</td>
            <td colspan="3">
              <el-button type="danger" @click="stopDaishiguolv1bpq('1')">变频器停机</el-button>
<!--              <el-button type="danger" @click="stopDaishiguolv1zkb1('0')">真空泵1停机</el-button>-->
<!--              <el-button type="danger" @click="stopDaishiguolv1zkb2('0')">真空泵2停机</el-button>-->
            </td>
          </tr>
          <tr>
            <td></td>
            <td colspan="3">
              <el-button type="info" @click="stopDaishiguolv1bpq('0')">变频器取消</el-button>
<!--              <el-button type="info" @click="stopDaishiguolv1zkb1('1')">真空泵1取消</el-button>-->
<!--              <el-button type="info" @click="stopDaishiguolv1zkb2('1')">真空泵2取消</el-button>-->
            </td>
          </tr>
        </table>
      </div>
    </el-dialog>
    <el-dialog title="带式过滤机2号" width="900px" v-model="dialogDaishiguolv2Visible">
      <div>
        <img src="@/assets/hxhb/image017.png"/>
      </div>
      <div>
        <table>
          <tr>
            <td class="aleft">驱动电机电流:</td>
            <td colspan="3"><span>{{daishi2.di.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">胶带带速:</td>
            <td colspan="3"><span>{{daishi2.spd.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">真空切换阀工作状态:</td>
            <td colspan="3"><span>{{daishi2.qhf.value}}</span></td>
          </tr>
<!--          <tr>-->
<!--            <td class="aleft" style="width:20%;">真空泵1运行信号:</td>-->
<!--            <td style="width:30%;"><span>{{daishi2.zkb3zt.value}}</span></td>-->
<!--            <td class="aleft" style="width:20%;">真空泵2运行信号:</td>-->
<!--            <td style="width:30%;"><span>{{daishi2.zkb4zt.value}}</span></td>-->
<!--          </tr>-->
          <tr>
            <td class="aleft">真空泵1电流:</td>
            <td><span>{{daishi2.zkb3di.value}}</span></td>
            <td class="aleft">真空泵2电流:</td>
            <td><span>{{daishi2.zkb4di.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">远程停机控制按钮:</td>
            <td colspan="3">
              <el-button type="danger" @click="stopDaishiguolv2bpq('1')">变频器停机</el-button>
<!--              <el-button type="danger" @click="stopDaishiguolv2zkb1('0')">真空泵1停机</el-button>-->
<!--              <el-button type="danger" @click="stopDaishiguolv2zkb2('0')">真空泵2停机</el-button>-->
            </td>
          </tr>
          <tr>
            <td></td>
            <td colspan="3">
              <el-button type="info" @click="stopDaishiguolv2bpq('0')">变频器取消</el-button>
<!--              <el-button type="info" @click="stopDaishiguolv2zkb1('1')">真空泵1取消</el-button>-->
<!--              <el-button type="info" @click="stopDaishiguolv2zkb2('1')">真空泵2取消</el-button>-->
            </td>
          </tr>
        </table>
      </div>
    </el-dialog>
    <el-dialog title="带式过滤机3号" width="900px" v-model="dialogDaishiguolv3Visible">
      <div>
        <img src="@/assets/hxhb/image017.png"/>
      </div>
      <div>
        <table>
          <tr>
            <td class="aleft">驱动电机电流:</td>
            <td colspan="3"><span>{{daishi3.di.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">胶带带速:</td>
            <td colspan="3"><span>{{daishi3.spd.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">真空切换阀工作状态:</td>
            <td colspan="3"><span>{{daishi3.qhf.value}}</span></td>
          </tr>
<!--          <tr>-->
<!--            <td class="aleft" style="width:20%;">真空泵1运行信号:</td>-->
<!--            <td style="width:30%;"><span>{{daishi3.zkb1zt.value}}</span></td>-->
<!--            <td class="aleft" style="width:20%;">真空泵2运行信号:</td>-->
<!--            <td style="width:30%;"><span>{{daishi3.zkb2zt.value}}</span></td>-->
<!--          </tr>-->
          <tr>
            <td class="aleft">真空泵1电流:</td>
            <td><span>{{daishi3.zkb1di.value}}</span></td>
            <td class="aleft">真空泵2电流:</td>
            <td><span>{{daishi3.zkb2di.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">远程停机控制按钮:</td>
            <td colspan="3">
              <el-button type="danger" @click="stopDaishiguolv3bpq('1')">变频器停机</el-button>
<!--              <el-button type="danger" @click="stopDaishiguolv3zkb1('0')">真空泵1停机</el-button>-->
<!--              <el-button type="danger" @click="stopDaishiguolv3zkb2('0')">真空泵2停机</el-button>-->
            </td>
          </tr>
          <tr>
            <td></td>
            <td colspan="3">
              <el-button type="info" @click="stopDaishiguolv3bpq('0')">变频器取消</el-button>
<!--              <el-button type="info" @click="stopDaishiguolv3zkb1('1')">真空泵1取消</el-button>-->
<!--              <el-button type="info" @click="stopDaishiguolv3zkb2('1')">真空泵2取消</el-button>-->
            </td>
          </tr>
        </table>
      </div>
    </el-dialog>
    <el-dialog title="带式过滤机4号" width="900px" v-model="dialogDaishiguolv4Visible">
      <div>
        <img src="@/assets/hxhb/image017.png"/>
      </div>
      <div>
        <table>
          <tr>
            <td class="aleft">驱动电机电流:</td>
            <td colspan="3"><span>{{daishi4.di.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">胶带带速:</td>
            <td colspan="3"><span>{{daishi4.spd.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">真空切换阀工作状态:</td>
            <td colspan="3"><span>{{daishi4.qhf.value}}</span></td>
          </tr>
<!--          <tr>-->
<!--            <td class="aleft" style="width:20%;">真空泵1运行信号:</td>-->
<!--            <td style="width:30%;"><span>{{daishi4.zkb3zt.value}}</span></td>-->
<!--            <td class="aleft" style="width:20%;">真空泵2运行信号:</td>-->
<!--            <td style="width:30%;"><span>{{daishi4.zkb4zt.value}}</span></td>-->
<!--          </tr>-->
          <tr>
            <td class="aleft">真空泵1电流:</td>
            <td><span>{{daishi4.zkb3di.value}}</span></td>
            <td class="aleft">真空泵2电流:</td>
            <td><span>{{daishi4.zkb4di.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">远程停机控制按钮:</td>
            <td colspan="3">
              <el-button type="danger" @click="stopDaishiguolv4bpq('1')">变频器停机</el-button>
<!--              <el-button type="danger" @click="stopDaishiguolv4zkb1('0')">真空泵1停机</el-button>-->
<!--              <el-button type="danger" @click="stopDaishiguolv4zkb2('0')">真空泵2停机</el-button>-->
            </td>
          </tr>
          <tr>
            <td></td>
            <td colspan="3">
              <el-button type="info" @click="stopDaishiguolv4bpq('0')">变频器取消</el-button>
<!--              <el-button type="info" @click="stopDaishiguolv4zkb1('1')">真空泵1取消</el-button>-->
<!--              <el-button type="info" @click="stopDaishiguolv4zkb2('1')">真空泵2取消</el-button>-->
            </td>
          </tr>
        </table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getNongmiji, getJiayao, getDaishi,ctl } from '@/api/hxhb'
//import ztsel from '../../components/ztsel.vue'
import Configure from '@/components/Configure';
export default {
  name: 'hxhb',
  components: {    
    Configure
  },
  mounted: function (){
		document.querySelector('.sidebar-container').style = "width:0!important;display:none;";
		document.querySelector('#app .main-container').style = "margin-left:0;"
		document.querySelector('.navbar').style.display = 'none';
		document.querySelector('.tags-view-container').style.display = 'none';
	},
  data() {
    return {
      nongmiji: {
        yali: { state: false, value: '无数据' },
        youwen: { state: false, value: '无数据' },
        yewei: { state: false, value: '无数据' }
      },
      jiayao: {
        jlyxxh: { state: false, value: '无数据' },
        yewei: { state: false, value: '无数据' },
        jybyxxh1: { state: false, value: '无数据' },
        jybyxxh2: { state: false, value: '无数据' }
      },
      daishi1: {
        di: { state: false, value: '无数据' },
        spd: { state: false, value: '无数据' },
        qhf: { state: false, value: '无数据' },
        zkb1zt: { state: false, value: '无数据' },
        zkb2zt: { state: false, value: '无数据' },
        zkb1di: { state: false, value: '无数据' },
        zkb2di: { state: false, value: '无数据' }
      },
      daishi2: {
        di: { state: false, value: '无数据' },
        spd: { state: false, value: '无数据' },
        qhf: { state: false, value: '无数据' },
        zkb3zt: { state: false, value: '无数据' },
        zkb4zt: { state: false, value: '无数据' },
        zkb3di: { state: false, value: '无数据' },
        zkb4di: { state: false, value: '无数据' }
      },
      daishi3: {
        di: { state: false, value: '无数据' },
        spd: { state: false, value: '无数据' },
        qhf: { state: false, value: '无数据' },
        zkb1zt: { state: false, value: '无数据' },
        zkb2zt: { state: false, value: '无数据' },
        zkb1di: { state: false, value: '无数据' },
        zkb2di: { state: false, value: '无数据' }
      },
      daishi4: {
        di: { state: false, value: '无数据' },
        spd: { state: false, value: '无数据' },
        qhf: { state: false, value: '无数据' },
        zkb3zt: { state: false, value: '无数据' },
        zkb4zt: { state: false, value: '无数据' },
        zkb3di: { state: false, value: '无数据' },
        zkb4di: { state: false, value: '无数据' }
      },
      dialogNongmijiVisible: false,
      dialogJiayaoVisible: false,
      dialogDaishiguolv1Visible: false,
      dialogDaishiguolv2Visible: false,
      dialogDaishiguolv3Visible: false,
      dialogDaishiguolv4Visible: false
    }
  },
  methods: {
    resetNongmiji() {
      let that = this
      Object.getOwnPropertyNames(that.nongmiji)
          .map(r => that.nongmiji[r].state = false)
    },
    resetJiayao() {
      let that = this
      Object.getOwnPropertyNames(that.jiayao)
          .map(r => that.jiayao[r].state = false)
    },
    resetDaishi1() {
      let that = this
      Object.getOwnPropertyNames(that.daishi1)
          .map(r => that.daishi1[r].state = false)
    },
    resetDaishi2() {
      let that = this
      Object.getOwnPropertyNames(that.daishi2)
          .map(r => that.daishi2[r].state = false)
    },
    resetDaishi3() {
      let that = this
      Object.getOwnPropertyNames(that.daishi3)
          .map(r => that.daishi3[r].state = false)
    },
    resetDaishi4() {
      let that = this
      Object.getOwnPropertyNames(that.daishi4)
          .map(r => that.daishi4[r].state = false)
    },
    showNongmiji(equipId) {
      let that = this
      this.resetNongmiji()
      getNongmiji(equipId)
          .then(res => {
                console.info(res)
                if (res != null) {
                  res.map(r => {
                    switch (r.name) {
                      case 'plc1:yali':
                        that.nongmiji.yali.state = true
                        that.nongmiji.yali.value = r.valeu
                        break
                      case 'plc1:wendu':
                        that.nongmiji.youwen.state = true
                        that.nongmiji.youwen.value = r.valeu
                        break
                      case 'plc1:yewei':
                        that.nongmiji.yewei.state = true
                        that.nongmiji.yewei.value = r.valeu
                        break
                    }
                  })
                  Object.getOwnPropertyNames(that.nongmiji).map(r => {
                    if (that.nongmiji[r].state == false) {
                      that.nongmiji[r].value = ''
                    }
                  })
                  that.dialogNongmijiVisible = true
                }
              }
          )
    },
    showJiayao(equipId) {
      let that = this
      this.resetJiayao()
      getJiayao(equipId)
          .then(res => {
            console.info(res)
            if (res != null) {
              res.map(r => {
                switch (r.name) {
                  case 'plc1:jlzt':
                    that.jiayao.jlyxxh.state = true
                    that.jiayao.jlyxxh.value = r.valeu
                    break
                  case 'plc1:yewei':
                    that.jiayao.yewei.state = true
                    that.jiayao.yewei.value = r.valeu
                    break
                  case 'plc1:jybzt1':
                    that.jiayao.jybyxxh1.state = true
                    that.jiayao.jybyxxh1.value = r.valeu
                    break
                  case 'plc1:jybzt2':
                    that.jiayao.jybyxxh2.state = true
                    that.jiayao.jybyxxh2.value = r.valeu
                    break
                }
              })
              Object.getOwnPropertyNames(that.jiayao).map(r => {
                if (that.jiayao[r].state == false) {
                  that.jiayao[r].value = ''
                }
              })
              that.dialogJiayaoVisible = true
            }
          })
    },
    showDaishiguolv1(equipId) {
      let that = this
      this.resetDaishi1()
      getDaishi(equipId)
          .then(res => {
            console.info(res)
            if (res != null) {
              res.map(r => {
                switch (r.name) {
                  case 'dsgl1:di':
                    that.daishi1.di.state = true
                    that.daishi1.di.value = r.valeu
                    break
                  case 'dsgl1:spd':
                    that.daishi1.spd.state = true
                    that.daishi1.spd.value = r.valeu
                    break
                  case 'zkb1:qhf':
                    that.daishi1.qhf.state = true
                    that.daishi1.qhf.value = r.valeu
                    break
                  case 'zkb1:yxxh':
                    that.daishi1.zkb1zt.state = true
                    that.daishi1.zkb1zt.value = r.valeu
                    break
                  case 'zkb2:yxxh':
                    that.daishi1.zkb2zt.state = true
                    that.daishi1.zkb2zt.value = r.valeu
                    break
                  case 'zkb1:di':
                    that.daishi1.zkb1di.state = true
                    that.daishi1.zkb1di.value = r.valeu
                    break
                  case 'zkb2:di':
                    that.daishi1.zkb2di.state = true
                    that.daishi1.zkb2di.value = r.valeu
                    break
                }
              })
              Object.getOwnPropertyNames(that.daishi1).map(r => {
                if (that.daishi1[r].state == false) {
                  that.daishi1[r].value = ''
                }
              })
              that.dialogDaishiguolv1Visible = true
            }
          })
    },
    showDaishiguolv2(equipId) {
      let that = this
      this.resetDaishi2()
      getDaishi(equipId)
          .then(res => {
            console.info(res)
            if (res != null) {
              res.map(r => {
                switch (r.name) {
                  case 'dsgl2:di':
                    that.daishi2.di.state = true
                    that.daishi2.di.value = r.valeu
                    break
                  case 'dsgl2:spd':
                    that.daishi2.spd.state = true
                    that.daishi2.spd.value = r.valeu
                    break
                  case 'zkb2:qhf':
                    that.daishi2.qhf.state = true
                    that.daishi2.qhf.value = r.valeu
                    break
                  case 'zkb3:yxxh':
                    that.daishi2.zkb3zt.state = true
                    that.daishi2.zkb3zt.value = r.valeu
                    break
                  case 'zkb4:yxxh':
                    that.daishi2.zkb4zt.state = true
                    that.daishi2.zkb4zt.value = r.valeu
                    break
                  case 'zkb3:di':
                    that.daishi2.zkb3di.state = true
                    that.daishi2.zkb3di.value = r.valeu
                    break
                  case 'zkb4:di':
                    that.daishi2.zkb4di.state = true
                    that.daishi2.zkb4di.value = r.valeu
                    break
                }
              })
              Object.getOwnPropertyNames(that.daishi2).map(r => {
                if (that.daishi2[r].state == false) {
                  that.daishi2[r].value = ''
                }
              })
              that.dialogDaishiguolv2Visible = true
            }
          })
    },
    showDaishiguolv3(equipId) {
      let that = this
      this.resetDaishi3()
      getDaishi(equipId)
          .then(res => {
            if (res != null) {
              res.map(r => {
                switch (r.name) {
                  case 'dsgl1:di':
                    that.daishi3.di.state = true
                    that.daishi3.di.value = r.valeu
                    break
                  case 'dsgl1:spd':
                    that.daishi3.spd.state = true
                    that.daishi3.spd.value = r.valeu
                    break
                  case 'zkb1:qhf':
                    that.daishi3.qhf.state = true
                    that.daishi3.qhf.value = r.valeu
                    break
                  case 'zkb1:yxxh':
                    that.daishi3.zkb1zt.state = true
                    that.daishi3.zkb1zt.value = r.valeu
                    break
                  case 'zkb2:yxxh':
                    that.daishi3.zkb2zt.state = true
                    that.daishi3.zkb2zt.value = r.valeu
                    break
                  case 'zkb1:di':
                    that.daishi3.zkb1di.state = true
                    that.daishi3.zkb1di.value = r.valeu
                    break
                  case 'zkb2:di':
                    that.daishi3.zkb2di.state = true
                    that.daishi3.zkb2di.value = r.valeu
                    break
                }
              })
              Object.getOwnPropertyNames(that.daishi3).map(r => {
                if (that.daishi3[r].state == false) {
                  that.daishi3[r].value = ''
                }
              })
              that.dialogDaishiguolv3Visible = true
            }
          })
    },
    showDaishiguolv4(equipId) {
      let that = this
      this.resetDaishi4()
      getDaishi(equipId)
          .then(res => {
            console.info(res)
            if (res != null) {
              res.map(r => {
                switch (r.name) {
                  case 'dsgl2:di':
                    that.daishi4.di.state = true
                    that.daishi4.di.value = r.valeu
                    break
                  case 'dsgl2:spd':
                    that.daishi4.spd.state = true
                    that.daishi4.spd.value = r.valeu
                    break
                  case 'zkb2:qhf':
                    that.daishi4.qhf.state = true
                    that.daishi4.qhf.value = r.valeu
                    break
                  case 'zkb3:yxxh':
                    that.daishi4.zkb3zt.state = true
                    that.daishi4.zkb3zt.value = r.valeu
                    break
                  case 'zkb4:yxxh':
                    that.daishi4.zkb4zt.state = true
                    that.daishi4.zkb4zt.value = r.valeu
                    break
                  case 'zkb3:di':
                    that.daishi4.zkb3di.state = true
                    that.daishi4.zkb3di.value = r.valeu
                    break
                  case 'zkb4:di':
                    that.daishi4.zkb4di.state = true
                    that.daishi4.zkb4di.value = r.valeu
                    break
                }
              })
              Object.getOwnPropertyNames(that.daishi4).map(r => {
                if (that.daishi4[r].state == false) {
                  that.daishi4[r].value = ''
                }
              })
              that.dialogDaishiguolv4Visible = true
            }
          })
    },
    stopNongmiji(state){
      ctl('1297826441310859250','plc1:M20.6',state).then(res=>{
        console.info(res);
      })
    },
    stopJiayao(state){
      ctl('1297826441310859255','plc1:M6.6',state).then(res=>{
        console.info(res);
      })
    },
    stopDaishiguolv1bpq(state){
      ctl('1297826441310859265','jdq4:OUT1',state).then(res=>{
        console.info(res);
      })
    },
    // stopDaishiguolv1zkb1(state){
    //   ctl('1297826441310859265','jdq4:OUT2',state).then(res=>{
    //     console.info(res);
    //   })
    // },
    // stopDaishiguolv1zkb2(state){
    //   ctl('1297826441310859265','jdq4:OUT3',state).then(res=>{
    //     console.info(res);
    //   })
    // },
    stopDaishiguolv2bpq(state){
      ctl('1297826441310859270','jdq4:OUT2',state).then(res=>{
        console.info(res);
      })
    },
    // stopDaishiguolv2zkb1(state){
    //   ctl('1297826441310859270','jdq4:OUT6',state).then(res=>{
    //     console.info(res);
    //   })
    // },
    // stopDaishiguolv2zkb2(state){
    //   ctl('1297826441310859270','jdq4:OUT7',state).then(res=>{
    //     console.info(res);
    //   })
    // },
    stopDaishiguolv3bpq(state){
      ctl('1297826441310859275','jdq4:OUT1',state).then(res=>{
        console.info(res);
      })
    },
    // stopDaishiguolv3zkb1(state){
    //   ctl('1297826441310859275','jdq4:OUT2',state).then(res=>{
    //     console.info(res);
    //   })
    // },
    // stopDaishiguolv3zkb2(state){
    //   ctl('1297826441310859275','jdq4:OUT3',state).then(res=>{
    //     console.info(res);
    //   })
    // },
    stopDaishiguolv4bpq(state){
      ctl('1297826441310859280','jdq4:OUT2',state).then(res=>{
        console.info(res);
      })
    },
    // stopDaishiguolv4zkb1(state){
    //   ctl('1297826441310859280','jdq4:OUT6',state).then(res=>{
    //     console.info(res);
    //   })
    // },
    // stopDaishiguolv4zkb2(state){
    //   ctl('1297826441310859280','jdq4:OUT7',state).then(res=>{
    //     console.info(res);
    //   })
    // },
  }
}
</script>

<style lang="scss" scoped>
.mainbox {
  position: relative;
  height: 660px;
  div {
    position: absolute;
  }
}

#span1 {
  left: 20px;
  top: 20px;
}

#span2 {
  left: 300px;
  top: 45px;
}

#span3 {
  left: 565px;
  top: 45px;
}

#span4, #span5, #span6, #span7, #span8 {
  top: 630px;
}

#span4 {
  left: 10px;
}

#span5 {
  left: 220px;
}

#span6 {
  left: 420px;
}

#span7 {
  left: 620px;
}

#span8 {
  left: 820px;
}

#img1 {
  left: 100px;
  top: 15px;
}

#img2 {
  left: 362px;
  top: 25px;
}

#img3 {
  left: 914px;
  top: 53px;
  z-index: 100;
}

#img4 {
  left: 640px;
  top: 45px;
}

#img5 {
  top: 265px;
  left: 200px;
  z-index: 999;
}

#img6 {
  left: 208px;
  top: 50px;
}

#img7 {
  left: 625px;
  top: 90px;
}

//#img8{
//  left:200px;
//  top:80px;
//}
#img91, #img92, #img93, #img94 {
  top: 355px;
}

#img91 {
  left: 100px;
}

#img92 {
  left: 300px;
}

#img93 {
  left: 500px;
}

#img94 {
  left: 700px;
}

table {
  width: 100%;
}

table tr {
  line-height: 28px;
}

.aleft {
  width: 200px;
  text-align: right;
}

.aright {
  padding-left: 30px;
  text-align: left;
}

.odd {
  width: 20%;
}

.even {
  width: 30%;
}
</style>