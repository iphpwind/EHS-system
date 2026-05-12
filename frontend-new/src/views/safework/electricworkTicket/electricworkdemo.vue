<template>
  <div class="report" v-loading="loading">
    <button v-print="'#myprint'" class="topbtn">打印</button>
    <div class="reportbox" id="myprint">
      <div class="tit">临时用电作业票</div>
      <table>
        <tr class="tablelayout">
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td colspan="5">申请单位</td>
          <td colspan="9"></td>
          <td colspan="4">作业申请时间</td>
          <td colspan="6"></td>
        </tr>
        <tr>
          <td colspan="5">作业地点</td>
          <td colspan="9"></td>
          <td colspan="4">作业内容</td>
          <td colspan="6"></td>
        </tr>
        <tr>
          <td colspan="5">电源接入点及许可用电功率</td>
          <td colspan="9"></td>
          <td colspan="4">工作电压</td>
          <td colspan="6"></td>
        </tr>
        <tr>
          <td colspan="5">用电设备名称及额定功率</td>
          <td colspan="6"></td>
          <td colspan="3">监护人</td>
          <td colspan="4"></td>
          <td colspan="3">用电人</td>
          <td colspan="3"></td>
        </tr>
        <tr>
          <td colspan="5">作业人</td>
          <td colspan="9"></td>
          <td colspan="4">电工证号</td>
          <td colspan="6"></td>
        </tr>
        <tr>
          <td colspan="5">作业负责人</td>
          <td colspan="9"></td>
          <td colspan="4">电工证号</td>
          <td colspan="6"></td>
        </tr>
        <tr>
          <td colspan="5">关联的其他特殊作业<br>及安全作业票编号</td>
          <td colspan="19"></td>
        </tr>
        <tr>
          <td colspan="5">风险辨识结果</td>
          <td colspan="19"></td>
        </tr>
        <tr>
          <td colspan="24">可燃气体分析（运行的生产装置、罐区和具有火灾爆炸危险场所）</td>
        </tr>
        <tr>
          <td colspan="5">分析点名称</td>
          <td colspan="4">分析人</td>
          <td colspan="5">分析时间</td>
          <td colspan="4">分析项目</td>
          <td colspan="3">分析数据</td>
          <td colspan="4">标准</td>
        </tr>
        <tr>
          <td colspan="5" style="height: 40px"></td>
          <td colspan="4"></td>
          <td colspan="5"></td>
          <td colspan="4"></td>
          <td colspan="3"></td>
          <td colspan="4"></td>
        </tr>
        <tr>
          <td colspan="5">作业实施时间</td>
          <td colspan="19">自&nbsp;&nbsp;年&nbsp;&nbsp;月&nbsp;&nbsp;日&nbsp;&nbsp;时&nbsp;&nbsp;分至&nbsp;&nbsp;年&nbsp;&nbsp;月&nbsp;&nbsp;日&nbsp;&nbsp;时&nbsp;&nbsp;分</td>
        </tr>
        <tr>
          <td colspan="2">序号</td>
          <td colspan="15">安全措施</td>
          <td colspan="3">是否涉及</td>
          <td colspan="4">确认人</td>
        </tr>
        <tr v-for="(item,index) in electricworkConfirmationList">
          <td colspan="2">{{index+1}}</td>
          <td colspan="15">{{replace(item.confirmationContent)}}</td>
          <td colspan="3"></td>
          <td colspan="4"></td>
        </tr>
        <tr>
          <td colspan="2">{{leng}}</td>
          <td colspan="15">其他安全措施：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编制人：</td>
          <td colspan="3"></td>
          <td colspan="4"></td>
        </tr>
        <tr>
          <td colspan="5">安全交底人</td>
          <td colspan="9"></td>
          <td colspan="4">接受交底人</td>
          <td colspan="6"></td>
        </tr>
        <tr v-for="(item,index) in electricworkapprovalList" class="noborder">
          <td colspan="5">{{ item.operationName }}</td>
          <td colspan="7">同意</td>
          <td colspan="5">签字：</td>
          <td colspan="7"></td>
        </tr>
        <tr v-for="(item,index) in checkList" class="noborder">
          <td colspan="5">{{ item.checkName }}</td>
          <td colspan="7">同意</td>
          <td colspan="5">签字：</td>
          <td colspan="7"></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { listElectricwork, getElectricwork, delElectricwork, addElectricwork, updateElectricwork } from "@/api/safework/electricwork";
import { listElectricworkSceneConfirmation} from "@/api/safework/electricworkSceneConfirmation";
import { listApprovalProcess } from "@/api/safework/approvalProcess";
import { listCheckDic } from "@/api/safework/checkDic";
export default {
  name: "临时用电作业票",
  data() {
    return {
      title: '基础信息',
      aqcsList:[],
      leng:0,
      length:0,
      aqindex:0,
      form:{
        safeOperationElectricworkSafety:{
          basicInformationCheck:false
        }
      },
      electricworkapprovalList:[],
      checkList:[],
    }
  },

  watch: {

  },
  created() {
    this.id = this.$route.query.id;
    this.workState = this.$route.query.workState;
    this.getElectricworkScene();
    this.getlist();
    this.getcheckList();
  },

  mounted: function () {
  },

  methods: {
    getcheckList(){
      listCheckDic({operationType:"5",status:"0"}).then(response => {
        this.checkList = response.rows;
      })
    },
    getElectricworkScene(){
      listElectricworkSceneConfirmation({status:'0'}).then(response => {
        this.electricworkConfirmationList = response.rows;
        this.leng = this.electricworkConfirmationList.length + 1
      });
    },
    getlist(){
      listApprovalProcess({operationType:"5",status:"0"}).then(response => {
        let blilist=[]
        blilist = response.rows;
        blilist.forEach((j, index) => {
          if(j.approvalId=='0000'){
          }else{
            this.electricworkapprovalList.push(j)
          }
        })
        this.length = response.rows.length
      });
    },
    replace(content){
      return content.replace(/\$\{wow\}/g, '( )');
    },

    formatDate(dateString,type) {

      if (dateString == null || dateString == ''){
        return '_____'
      } else {

        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 月份从0开始，需要加1
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        if (type == 'y'){
          return `${year}年${month}月${day}日${hours}时${minutes}分`;
        }else {
          return `${month}月${day}日${hours}时${minutes}分`;
        }
      }
    },
    getInfo(){
      getElectricwork(this.id).then(response => {
        this.form = response.data;
        let aa = ''
        if(this.form.safeOperationElectricworkDetailsList.length>0){
          this.form.safeOperationElectricworkDetailsList.forEach((j, index) => {
            if(aa==''){
              aa = j.name+j.power
            }
            aa = aa+';'+j.name+j.power
          })
        }
        this.form.electricworkDetail = aa;

        this.aqindex = this.form.safeOperationElectricworkSceneContentList.length;
        this.form.safeOperationElectricworkSceneUserList.forEach((i, index) => {
          if(i.remark!=null && i.remark!=''){
            this.aqcsList.push(i)
          }
        })
      })
    }
  },

}
</script>


<style scoped lang="scss">
.report{
  padding: 15px 15px;
  height: 100%;overflow: auto;
}
.tit{
  text-align: center;font-weight: bold;
  font-size: 20px;margin:20px 0;
  position: relative;
}
.topbtn{
  float: right;color: #fff;
  background: #09bec5;border-radius: 3px;padding: 5px 10px;
  border: 0;cursor: pointer;
  z-index: 999;position: relative;
  top: 20px;right: 40px;outline: none;
}
.localpic{
  width: 80%;max-width: 950px;
  margin: 0 auto 20px;
}
.reportbox table{
  margin: 0 auto 20px;width: 80%;
  max-width: 950px;
  border-collapse: collapse;
  td{
    border: 1px solid #aaa;padding: 5px 10px;
    line-height: 2;font-size: 14px;
  }
  .noborder-lf{
    border-left: 0;
  }
  .noborder-rt{
    border-right: 0;
  }
  .noborder-tp{
    border-top: 0;
  }
  .noborder-bt{
    border-bottom: 0;
  }
  .noborder{
    border: 0;
  }
  .jingshi{
    display: inline-block;
  }
  .qianming{
    height: 25px;margin-right: 15px;
    vertical-align: middle;
  }
  tr.tablelayout{
    border: 0;
    td{
      border: 0;
      width: 4.166%;
    }
  }
}
@media print {
  .reportbox table{
    width: 100%;
  }
  .localpic{
    width: 100%;
  }
}
</style>




