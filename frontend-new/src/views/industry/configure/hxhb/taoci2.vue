<template>
  <div class="container">
    <!-- <Configure selId="3"  seltitle="灵宝市金瑞选矿设备"> </Configure> -->
    <div class="mainbox">
      <div class="fldiv" @click="showDf1()">
        <img src="@/assets/hxhb/tc12s.jpg"/>
        <div class="mc">陶瓷过滤机</div>
      </div>
    </div>
    <el-dialog title="陶瓷过滤机" width="900px" v-model="dialogDf1Visible">
      <div>
        <img src="@/assets/hxhb/tc12.jpg"/>
      </div>
      <div>

        <table>
          <tr>
            <td class="aleft">主轴正转:</td>
            <td><span>{{df1.q000.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">主轴反转:</td>
            <td><span>{{df1.q001.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">搅拌电机运行:</td>
            <td><span>{{df1.q002.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">真空泵运行:</td>
            <td><span>{{df1.q003.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">超声波运行:</td>
            <td><span>{{df1.q005.value}}</span></td>
          </tr>
          <tr>
            <td class="aleft">远程停机控制按钮:</td>
            <td>
              <el-button type="danger" @click="stopDf1('0')">搅拌电机停止</el-button>
              <el-button type="info" @click="stopDf1('1')">搅拌电机取消</el-button>
            </td>
          </tr>
        </table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDf, ctl } from '@/api/hxhb'
import Configure from '@/components/Configure';

export default {
  name: 'taoci2',
  components: {
    Configure
  },
  data() {
    return {
      df1: {
        q000: { state: false, value: '' },
        q001: { state: false, value: '' },
        q002: { state: false, value: '' },
        q003: { state: false, value: '' },
        q005: { state: false, value: '' },
        m1006:{ state: false, value: '' }
      },
      dialogDf1Visible: false
    }
  },
  mounted: function (){
		document.querySelector('.sidebar-container').style = "width:0!important;display:none;";
		document.querySelector('#app .main-container').style = "margin-left:0;"
		document.querySelector('.navbar').style.display = 'none';
		document.querySelector('.tags-view-container').style.display = 'none';
	},
  methods: {
    resetDf1() {
      let that = this
      Object.getOwnPropertyNames(that.df1)
          .map(r => that.df1[r].state = false)
    },
    showDf1() {
      let that = this
      this.resetDf1()
      getDf('1297826441310859300')
          .then(res => {
            console.info(res)
            if (res != null) {
              res.map(r => {
                switch (r.name) {
                  case 'plc10:q000':
                    that.df1.q000.state = true
                    that.df1.q000.value = r.valeu
                    break
                  case 'plc10:q001':
                    that.df1.q001.state = true
                    that.df1.q001.value = r.valeu
                    break
                  case 'plc10:q002':
                    that.df1.q002.state = true
                    that.df1.q002.value = r.valeu
                    break
                  case 'plc10:q003':
                    that.df1.q003.state = true
                    that.df1.q003.value = r.valeu
                    break
                  case 'plc10:q005':
                    that.df1.q005.state = true
                    that.df1.q005.value = r.valeu
                    break
                  case 'plc10:m1006':
                    that.df1.m1006.state = true
                    that.df1.m1006.value = r.valeu
                    break
                }
              })
              Object.getOwnPropertyNames(that.df1).map(r => {
                if (that.df1[r].state == false) {
                  that.df1[r].value = ''
                }
              })
              that.dialogDf1Visible = true
            }
          })
    },
    stopDf1(state){
      ctl('1297826441310859300','plc10:m1006',state)
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