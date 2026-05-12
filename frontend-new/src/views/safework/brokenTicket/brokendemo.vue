<template>
  <div class="report" v-loading="loading">
    <button v-print="'#myprint'" class="topbtn">打印</button>
    <div class="reportbox" id="myprint">
      <div class="tit">断路安全作业票</div>
      <table>
        <tr class="tablelayout">
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td colspan="4">申请单位</td>
          <td colspan="3"></td>
          <td colspan="4">作业单位</td>
          <td colspan="3"></td>
          <td colspan="3">作业负责人</td>
          <td colspan="3"></td>
        </tr>
        <tr>
          <td colspan="4">涉及相关单位部门</td>
          <td colspan="10"></td>
          <td colspan="3">监护人</td>
          <td colspan="3"></td>
        </tr>
        <tr>
          <td colspan="4">断路原因</td>
          <td colspan="16"></td>
        </tr>
        <tr>
          <td colspan="4">关联的其他特殊作业及安全作业票编号</td>
          <td colspan="16"></td>
        </tr>
        <tr>
          <td colspan="4" class="noborder-rt noborder-bt">断路地段示意图及相关说明</td>
          <td colspan="16" class="noborder-lf noborder-bt noborder-tp"></td>
        </tr>
        <tr>
          <td colspan="3" class="noborder-rt noborder-bt noborder-tp">断路相关说明：</td>
          <td colspan="17" class="noborder-lf noborder-bt noborder-tp"></td>
        </tr>
        <tr>
          <td colspan="4" class="noborder-rt noborder-bt noborder-tp">示意图：详见附件</td>
          <td colspan="16" class="noborder-lf noborder-bt noborder-tp"></td>
        </tr>
        <tr>
          <td colspan="9" class="noborder-tp noborder-rt"></td>
          <td colspan="4" class="noborder-rt noborder-lf noborder-tp">签字：</td>
          <td colspan="2" class="noborder-rt noborder-lf noborder-tp noborder-bt"></td>
          <td colspan="5" class="noborder-lf noborder-bt noborder-tp"></td>
        </tr>
        <tr>
          <td colspan="4">风险辨识结果</td>
          <td colspan="16"></td>
        </tr>
        <tr>
          <td colspan="4">作业实施时间</td>
          <td colspan="16"></td>
        </tr>
        <tr>
          <td colspan="2">序号</td>
          <td colspan="12">安全措施</td>
          <td colspan="3">是否涉及</td>
          <td colspan="3">确认人</td>
        </tr>
        <tr v-for="(item,index) in brokenConfirmationList">
          <td colspan="2">{{index+1}}</td>
          <td colspan="12">{{replace(item.confirmationContent)}}</td>
          <td colspan="3"></td>
          <td colspan="3"></td>
        </tr>
        <tr>
          <td colspan="2">{{ leng+1 }}</td>
          <td colspan="18">其他安全措施：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编制人：</td>
        </tr>
        <tr>
          <td colspan="4">安全交底人</td>
          <td colspan="4"></td>
          <td colspan="4">接受交底人</td>
          <td colspan="8"></td>
        </tr>
        <tr v-for="(item,index) in brokenapprovalList" class="noborder">
          <td colspan="4">{{ item.operationName }}</td>
          <td colspan="4"></td>
          <td colspan="4">签字：</td>
          <td colspan="8"></td>
        </tr>
        <tr v-for="(item,index) in checkList" class="noborder">
          <td colspan="4">{{ item.checkName }}</td>
          <td colspan="4"></td>
          <td colspan="4">签字：</td>
          <td colspan="8"></td>
        </tr>
      </table>
      <div class="localpic">
        <span>断路作业简图：</span>
      </div>
    </div>
  </div>
</template>

<script>
import { listBrokenInfo, getBrokenInfo, delBrokenInfo, addBrokenInfo, updateBrokenInfo } from "@/api/safework/brokenInfo";
import { listBrokenConfirmContent} from "@/api/safework/brokenConfirmContent";
import { listBrokenApproval } from "@/api/safework/brokenApproval";
import { listBrokenattr, getBrokenattr, delBrokenattr, addBrokenattr, updateBrokenattr } from "@/api/safework/brokenattr";
import {listBrokenSceneConfirmation} from "@/api/safework/brokenSceneConfirmation";
import {listApprovalProcess} from "@/api/safework/approvalProcess";
import {listCheckDic} from "@/api/safework/checkDic";
export default {
  name: "断路作业票",
  data() {
    return {
      title: '基础信息',
      attAddress:[],
      Camerashow: false,
      form:{
      },
      list:[],
      sceneList:[],
      approvalProcessList:[],
      checkDicList:[],
      id:null,
      workState:null,
      fjlist:[],
      workList:[],
      brokenConfirmationList:[],
      app:{},
      app1:{},
      leng:0,
      jhList:[],
      brokenapprovalList:[],
      confirmList:[],
      worksign:null,
      workTime:null,
      checkList:[],
    }
  },

  watch: {

  },
  created() {
    this.id = this.$route.query.id;
    this.workState = this.$route.query.workState;
    this.getDetail();
    this.getBrokenScene();
    this.getlist();
    this.getcheckList();
  },

  mounted: function () {
  },

  methods: {
    getDetail(){
      getBrokenInfo(this.id).then(response => {
        this.form = response.data;
        this.form.placeInfo = this.form.safeSpecialPlace.objnames+'/'+this.form.safeSpecialPlace.unitName+'/'+this.form.safeSpecialPlace.operationSite
        this.list = this.form.brokenControlChargeList;//负责监护人信息
        if(this.list!=null && this.list.length>0){
          this.list.forEach((m, index) => {
            if(m.type=='2'){
              this.worksign = m.sign
              this.workTime = m.createTime
            }
            if(m.type=='1'){
              this.jhList.push(m)
            }
            this.confirmList.push({
              sign:m.sign
            })
          })
        }
        this.form.safeAttrList.forEach((j, index) => {
          if(j.type=='1'){
            this.sceneList.push(j)
            this.app = this.sceneList[0];
            this.app1 = this.sceneList[1];
          }
          if(j.type=='2'){
            this.approvalProcessList.push(j)
          }
          if(j.type=='3'){
            this.checkDicList.push(j)
          }
        })
        let a = this.form.relaceWork.split(',')
        this.workList = a
        this.getConfirmList();
        this.getFujian();
      })
    },

    getcheckList(){
      listCheckDic({operationType:'3',status:'0'}).then(response => {//内部
        this.checkList = response.rows;
      });
    },

    getBrokenScene(){
      listBrokenSceneConfirmation({status:'0'}).then(response => {
        this.brokenConfirmationList = response.rows;
        this.leng = this.brokenConfirmationList.length + 1
      });
    },
    getlist(){
      listApprovalProcess({operationType:'3',status:'0'}).then(response => {
        this.brokenapprovalList = response.rows;
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




