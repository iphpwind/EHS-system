<template>
  <div class="container">
    <!-- <Configure selId="2"  seltitle="额尔古纳诚诚矿业"> </Configure> -->
    <div class="mainbox">
      <div class="fldiv" @click="showDf12()">
        <img src="@/assets/hxhb/tc12s.jpg"/>
        <div class="mc">陶瓷过滤机DF12</div>
      </div>
      <div class="fldiv" @click="showDf45()">
        <img src="@/assets/hxhb/tc45s.jpg"/>
        <div class="mc">陶瓷过滤机DF45</div>
      </div>
      <div class="fldiv" @click="showDf36()">
        <img src="@/assets/hxhb/tc36s.jpg"/>
        <div class="mc">陶瓷过滤机DF36</div>
      </div>
    </div>
    <el-dialog title="陶瓷过滤机DF12" width="900px" v-model="dialogDf12Visible">
      <div>
        <img src="@/assets/hxhb/tc12.jpg"/>
      </div>
      <div>
        
        <table>
          <tr>
            <td class="aleft">主轴正转:</td>
            <td><span>{{df12.q000.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">主轴反转:</td>
            <td><span>{{df12.q001.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">搅拌电机运行:</td>
            <td><span>{{df12.q002.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">真空泵运行:</td>
            <td><span>{{df12.q003.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">超声波运行:</td>
            <td><span>{{df12.q005.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">远程停机控制按钮:</td>
            <td>
              <el-button type="danger" @click="stopDf12('0')">搅拌电机停止</el-button>
              <el-button type="info" @click="stopDf12('1')">搅拌电机取消</el-button>
            </td>
          </tr>
        </table>
      </div>
    </el-dialog>
    <el-dialog title="陶瓷过滤机DF45" width="900px" v-model="dialogDf45Visible">
      <div>
        <img src="@/assets/hxhb/tc45.jpg"/>
      </div>
      <div>
        <table>
          <tr>
            <td class="aleft">主轴正转:</td>
            <td><span>{{df45.q000.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">主轴反转:</td>
            <td><span>{{df45.q001.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">搅拌电机运行:</td>
            <td><span>{{df45.q002.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">真空泵运行:</td>
            <td><span>{{df45.q003.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">超声波运行:</td>
            <td><span>{{df45.q005.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">远程停机控制按钮:</td>
            <td>
              <el-button type="danger" @click="stopDf45('0')">搅拌电机停止</el-button>
              <el-button type="info" @click="stopDf45('1')">搅拌电机取消</el-button>
            </td>
          </tr>
        </table>
      </div>
    </el-dialog>
    <el-dialog title="陶瓷过滤机DF36" width="900px" v-model="dialogDf36Visible">
      <div>
        <img src="@/assets/hxhb/tc36.jpg"/>
      </div>
      <div>
        <table>
          <tr>
            <td class="aleft">主轴正转:</td>
            <td><span>{{df36.q000.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">主轴反转:</td>
            <td><span>{{df36.q001.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">搅拌电机运行:</td>
            <td><span>{{df36.q002.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">真空泵运行:</td>
            <td><span>{{df36.q003.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">超声波运行:</td>
            <td><span>{{df36.q005.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">远程停机控制按钮:</td>
            <td>
              <el-button type="danger" @click="stopDf36('0')">搅拌电机停止</el-button>
              <el-button type="info" @click="stopDf36('1')">搅拌电机取消</el-button>
            </td>
          </tr>
        </table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDf, ctl } from '@/api/hxhb'
//import ztsel from '../../components/ztsel.vue'
import Configure from '@/components/Configure';
export default {
  name: 'taoci',
  components: {    
    Configure
  },
  data() {
    return {
      df12: {
        q000: { state: false, value: '' },
        q001: { state: false, value: '' },
        q002: { state: false, value: '' },
        q003: { state: false, value: '' },
        q005: { state: false, value: '' },
        m1006:{ state: false, value: '' }
      },
      df45: {
        q000: { state: false, value: '' },
        q001: { state: false, value: '' },
        q002: { state: false, value: '' },
        q003: { state: false, value: '' },
        q005: { state: false, value: '' },
        m1006:{ state: false, value: '' }
      },
      df36: {
        q000: { state: false, value: '' },
        q001: { state: false, value: '' },
        q002: { state: false, value: '' },
        q003: { state: false, value: '' },
        q005: { state: false, value: '' },
        m1006:{ state: false, value: '' }
      },
      dialogDf12Visible: false,
      dialogDf45Visible: false,
      dialogDf36Visible: false
    }
  },
	mounted: function (){
		document.querySelector('.sidebar-container').style = "width:0!important;display:none;";
		document.querySelector('#app .main-container').style = "margin-left:0;"
		document.querySelector('.navbar').style.display = 'none';
		document.querySelector('.tags-view-container').style.display = 'none';
	},
  methods: {
    resetDf12() {
      let that = this
      Object.getOwnPropertyNames(that.df12)
          .map(r => that.df12[r].state = false)
    },
    resetDf45() {
      let that = this
      Object.getOwnPropertyNames(that.df45)
          .map(r => that.df45[r].state = false)
    },
    resetDf36() {
      let that = this
      Object.getOwnPropertyNames(that.df36)
          .map(r => that.df36[r].state = false)
    },
    showDf12() {
      let that = this
      this.resetDf12()
      getDf('1297826441310859285')
          .then(res => {
            console.info(res)
            if (res != null) {
              res.map(r => {
                switch (r.name) {
                  case 'plc7:q000':
                    that.df12.q000.state = true
                    that.df12.q000.value = r.valeu
                    break
                  case 'plc7:q001':
                    that.df12.q001.state = true
                    that.df12.q001.value = r.valeu
                    break
                  case 'plc7:q002':
                    that.df12.q002.state = true
                    that.df12.q002.value = r.valeu
                    break
                  case 'plc7:q003':
                    that.df12.q003.state = true
                    that.df12.q003.value = r.valeu
                    break
                  case 'plc7:q005':
                    that.df12.q005.state = true
                    that.df12.q005.value = r.valeu
                    break
                  case 'plc7:m1006':
                    that.df12.m1006.state = true
                    that.df12.m1006.value = r.valeu
                    break
                }
              })
              Object.getOwnPropertyNames(that.df12).map(r => {
                if (that.df12[r].state == false) {
                  that.df12[r].value = ''
                }
              })
              that.dialogDf12Visible = true
            }
          })
    },
    showDf45() {
      let that = this
      this.resetDf45()
      getDf('1297826441310859290')
          .then(res => {
            console.info(res)
            if (res != null) {
              res.map(r => {
                switch (r.name) {
                  case 'plc8:q000':
                    that.df45.q000.state = true
                    that.df45.q000.value = r.valeu
                    break
                  case 'plc8:q001':
                    that.df45.q001.state = true
                    that.df45.q001.value = r.valeu
                    break
                  case 'plc8:q002':
                    that.df45.q002.state = true
                    that.df45.q002.value = r.valeu
                    break
                  case 'plc8:q003':
                    that.df45.q003.state = true
                    that.df45.q003.value = r.valeu
                    break
                  case 'plc8:q005':
                    that.df45.q005.state = true
                    that.df45.q005.value = r.valeu
                    break
                  case 'plc8:m1006':
                    that.df45.m1006.state = true
                    that.df45.m1006.value = r.valeu
                    break
                }
              })
              Object.getOwnPropertyNames(that.df45).map(r => {
                if (that.df45[r].state == false) {
                  that.df45[r].value = ''
                }
              })
              that.dialogDf45Visible = true
            }
          })
    },
    showDf36() {
      let that = this
      this.resetDf36()
      getDf('1297826441310859295')
          .then(res => {
            if (res != null) {
              res.map(r => {
                switch (r.name) {
                  case 'plc9:q000':
                    that.df36.q000.state = true
                    that.df36.q000.value = r.valeu
                    break
                  case 'plc9:q001':
                    that.df36.q001.state = true
                    that.df36.q001.value = r.valeu
                    break
                  case 'plc9:q002':
                    that.df36.q002.state = true
                    that.df36.q002.value = r.valeu
                    break
                  case 'plc9:q003':
                    that.df36.q003.state = true
                    that.df36.q003.value = r.valeu
                    break
                  case 'plc9:q005':
                    that.df36.q005.state = true
                    that.df36.q005.value = r.valeu
                    break
                  case 'plc9:m1006':
                    that.df36.m1006.state = true
                    that.df36.m1006.value = r.valeu
                    break
                }
              })
              Object.getOwnPropertyNames(that.df36).map(r => {
                if (that.df36[r].state == false) {
                  that.df36[r].value = ''
                }
              })
              that.dialogDf36Visible = true
            }
          })
    },
    stopDf12(state){
      ctl('1297826441310859285','plc7:m1006',state)
      .then(res=>{
        console.info(res);
      })
    },
    stopDf45(state){
      ctl('1297826441310859290','plc8:m1006',state)
      .then(res=>{
        console.info(res);
      })
    },
    stopDf36(state){
      ctl('1297826441310859295','plc9:m1006',state)
      .then(res=>{
        console.info(res);
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.fldiv {
  display: block;
  float: left;
  text-align: center;
  cursor: pointer;
  img {
    margin: 2px;
  }
  .mc {
    margin-top: 5px;
  }
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