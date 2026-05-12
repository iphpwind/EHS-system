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
          <td colspan="3">{{ form.enterpriseName }}</td>
          <td colspan="4">作业单位</td>
          <td colspan="3">{{form.workUnitName}}</td>
          <td colspan="3">作业负责人</td>
          <td colspan="3"><span v-for="aa in confirmList"><img :src="aa.sign" alt="" class="qianming"></span></td>
        </tr>
        <tr>
          <td colspan="4">涉及相关单位部门</td>
          <td colspan="10">{{form.sjUnit}}</td>
          <td colspan="3">监护人</td>
          <td colspan="3"><span v-for="aa in jhList"><img :src="aa.sign" alt="" class="qianming"></span></td>
        </tr>
        <tr>
          <td colspan="4">断路原因</td>
          <td colspan="16">{{form.brokenReason}}</td>
        </tr>
        <tr>
          <td colspan="4">关联的其他特殊作业及安全作业票编号</td>
          <td colspan="16">{{form.relaceWork}}</td>
        </tr>
        <tr>
          <td colspan="4" class="noborder-rt noborder-bt">断路地段示意图及相关说明</td>
          <td colspan="16" class="noborder-lf noborder-bt noborder-tp"></td>
        </tr>
        <tr>
          <td colspan="3" class="noborder-rt noborder-bt noborder-tp">断路相关说明：</td>
          <td colspan="17" class="noborder-lf noborder-bt noborder-tp">{{ form.brokenExplain }}</td>
        </tr>
        <tr>
          <td colspan="4" class="noborder-rt noborder-bt noborder-tp">示意图：详见附件</td>
          <td colspan="16" class="noborder-lf noborder-bt noborder-tp"></td>
        </tr>
        <tr>
          <td colspan="9" class="noborder-tp noborder-rt"></td>
          <td colspan="4" class="noborder-rt noborder-lf noborder-tp">签字：</td>
          <td colspan="2" class="noborder-rt noborder-lf noborder-tp noborder-bt"><img :src="worksign" alt="" class="qianming"></td>
          <td colspan="5" class="noborder-lf noborder-bt noborder-tp">{{workTime}}</td>
        </tr>
        <tr>
          <td colspan="4">风险辨识结果</td>
          <td colspan="16">{{form.hazardIdentId}}</td>
        </tr>
        <tr>
          <td colspan="4">作业实施时间</td>
          <td colspan="16">自{{formatDate(form.checkEnd,'y')}}至{{formatDate(form.applyAccept,'y')}}止</td>
        </tr>
        <tr>
          <td colspan="2">序号</td>
          <td colspan="12">安全措施</td>
          <td colspan="3">是否涉及</td>
          <td colspan="3">确认人</td>
        </tr>
        <tr v-for="(item,index) in brokenConfirmationList">
          <td colspan="2">{{index+1}}</td>
          <td colspan="12">{{replace(item.confirmContent)}}</td>
          <td colspan="3" v-if="item.checkFlag=='true'">√</td>
          <td colspan="3" v-if="item.checkFlag=='false'">不涉及</td>
          <td colspan="3"><img :src="item.confirmSign" alt="" class="qianming"></td>
        </tr>
        <tr v-for="(item,index) in app">
          <td colspan="2">{{ leng+1+index }}</td>
          <td colspan="18">其他安全措施：{{item.safeMeasure}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编制人：<img :src="item.preparedSign" alt="" class="qianming"></td>
        </tr>
        <tr>
          <td colspan="4">安全交底人</td>
          <td colspan="4"><img :src="form.disclosureUserSign" alt="" class="qianming"></td>
          <td colspan="4">接受交底人</td>
          <td colspan="8">
            <span v-for="(item,index) in confirmList">
              <img :src="item.sign" alt="" class="qianming">
            </span>
            <span v-for="(item,index) in jhList">
              <img :src="item.sign" alt="" class="qianming">
            </span>
          </td>
        </tr>
        <tr v-for="(item,index) in brokenapprovalList" class="noborder">
          <td colspan="4">{{ item.operationName }}</td>
          <td colspan="4">同意</td>
          <td colspan="4">签字：<img :src="item.sign" alt="" class="qianming"></td>
          <td colspan="8">{{ item.createTime }}</td>
        </tr>
        <tr v-for="(item,index) in checkList" class="noborder">
          <td colspan="4">{{ item.name }}</td>
          <td colspan="4">同意</td>
          <td colspan="4">签字：<img :src="item.userSign" alt="" class="qianming"></td>
          <td colspan="8">{{ item.createTime }}</td>
        </tr>
      </table>
      <div class="localpic">
        <span>断路作业简图：</span>
        <div v-for="(item,index) in fjlist">
          <img :src="item.address" alt="" class="qianming">
        </div>
      </div>

      <div class="tit">安全交底和风险告知确认卡</div>
      <table>
        <tr class="tablelayout">
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td colspan="5">作业单位</td>
          <td colspan="7">{{form.workUnitName}}</td>
          <td colspan="5">车间项目负责人</td>
          <td colspan="7"><img :src="form.disclosureUserSign" alt="" class="qianming"></td>
        </tr>
        <tr>
          <td colspan="5">作业时间</td>
          <td colspan="19">自{{formatDate(form.checkEnd,'y')}}至{{formatDate(form.applyAccept,'y')}}止</td>
        </tr>
        <tr>
          <td colspan="24" v-if="form.safeOperationFireworkSafety.basicInformationCheck!=null">基本要求: {{form.safeOperationFireworkSafety.basicInformationCheck}}</td>
          <td colspan="24" v-else>基本要求: {{form.safeOperationFireworkSafety.basicInformation}}</td>
        </tr>
        <tr>
          <td colspan="5" rowspan="6">安全交底和风险告知内容</td>
          <td colspan="19" v-if="form.safeOperationFireworkSafety.scopeEnvironmentCheck!=null">作业许可范围及作业环境：{{form.safeOperationFireworkSafety.scopeEnvironmentCheck}}</td>
          <td colspan="19" v-else>作业许可范围及作业环境：{{form.safeOperationFireworkSafety.scopeEnvironment}}</td>
        </tr>
        <tr>
          <td colspan="19">作业风险：
            <span v-for="(item,index) in risklist">
              <el-checkbox v-model="risklist[index].id" style="margin-right: 10px;" disabled>{{item.name}}</el-checkbox>
            </span>
          </td>
        </tr>
        <tr>
          <td colspan="19">防范措施（工艺、设备、个体防护等）：
            <span v-for="(item,index) in preventivelist">
              <el-checkbox v-model="preventivelist[index].id" style="margin-right: 10px;" disabled>{{item.name}}</el-checkbox>
            </span>
          </td>
        </tr>
        <tr>
          <td colspan="19">应急措施：
            <span v-for="(item,index) in emergencylist">
              <el-checkbox v-model="emergencylist[index].id" style="margin-right: 10px;" disabled>{{item.name}}</el-checkbox>
            </span>
          </td>
        </tr>
        <tr>
          <td colspan="24" v-if="form.safeOperationFireworkSafety.remarkCheck!=null">其他注意事项：{{form.safeOperationFireworkSafety.remarkCheck}}</td>
          <td colspan="24" v-else>其他注意事项：{{form.safeOperationFireworkSafety.remark}}</td>
        </tr>
        <tr>
          <td colspan="24" v-if="form.safeOperationFireworkSafety.confirmationCopyCheck!=null">工作单位确认文案：{{form.safeOperationFireworkSafety.confirmationCopyCheck}}</td>
          <td colspan="24" v-else>工作单位确认文案：{{form.safeOperationFireworkSafety.confirmationCopy}}</td>
        </tr>
        <tr>
          <td colspan="24">企业负责人签字: <img :src="form.disclosureUserSign" alt="" class="qianming"></td>
        </tr>
        <tr style="margin-bottom: 20px">
          <td colspan="16" class="noborder-rt"></td>
          <td colspan="8" class="noborder-lf">作业单位负责人签字：<span v-for="(item,index) in confirmList"><img :src="item.sign" alt="" class="qianming"></span></td>
        </tr>
      </table>

    </div>
  </div>
</template>

<script>
import { listBrokenInfo, getBrokenInfo, delBrokenInfo, addBrokenInfo, updateBrokenInfo } from "@/api/safework/brokenInfo";
import { listBrokenConfirmContent} from "@/api/safework/brokenConfirmContent";
import { listBrokenApproval } from "@/api/safework/brokenApproval";
import { listBrokenSceneConfirmation, getBrokenSceneConfirmation, delBrokenSceneConfirmation, addBrokenSceneConfirmation, updateBrokenSceneConfirmation } from "@/api/safework/brokenSceneConfirmation";
import { listAttachment} from "@/api/safework/attachment";
import { listBrokenattr, getBrokenattr, delBrokenattr, addBrokenattr, updateBrokenattr } from "@/api/safework/brokenattr";
export default {
  name: "断路作业票",
  data() {
    return {
      title: '基础信息',
      attAddress:[],
      Camerashow: false,
      form:{
        safeOperationFireworkSafety:{
          basicInformationCheck:false
        }
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
      risklist:[],
      preventivelist:[],
      emergencylist:[]
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
    replace(content){
      if(content == null){
        content = ''
      }
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
    getDetail(){

      let aa=[];
      let bb=[];
      let cc=[];
      this.risklist=[];
      this.preventivelist=[];
      this.emergencylist=[];

      getBrokenInfo(this.id).then(response => {
        this.form = response.data;
        this.form.placeInfo = this.form.safeSpecialPlace.objnames+'/'+this.form.safeSpecialPlace.unitName+'/'+this.form.safeSpecialPlace.operationSite
        this.list = this.form.brokenControlChargeList;//负责监护人信息
        if(this.list!=null && this.list.length>0){
          this.list.forEach((m, index) => {
            if(m.type=='2'){
              this.worksign = m.sign
              this.workTime = m.createTime
              this.confirmList.push(m)
            }
            if(m.type=='1'){
              this.jhList.push(m)
            }
            /*this.confirmList.push({
              sign:m.sign
            })*/
          })
        }
        this.form.safeAttrList.forEach((j, index) => {
          if(j.type=='1'){
            this.sceneList.push(j)
            if(j.safeMeasure!=null && j.safeMeasure!=''){
              this.app.push(j)
            }
            /*this.app = this.sceneList[0];
            this.app1 = this.sceneList[1];*/
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
        // this.getConfirmList();
        this.getFujian();

        if(this.form.safeOperationFireworkSafety!=null){
          aa = this.form.safeOperationFireworkSafety.operationRisk.split('\n');
          bb = this.form.safeOperationFireworkSafety.preventive.split('\n');
          cc = this.form.safeOperationFireworkSafety.emergency.split('\n');

          if(this.form.safeOperationFireworkSafety.operationRiskCheck!=null && this.form.safeOperationFireworkSafety.operationRiskCheck!=''){
            let dd = [];
            dd = this.form.safeOperationFireworkSafety.operationRiskCheck.split('\n');
            dd.forEach((j, index1) => {
              let ee = j.split('%%');
              this.risklist.push({
                id:JSON.parse(ee[0]),
                name:ee[1]
              })
            })
          }else{
            aa.forEach((i, index) => {
              this.risklist.push({
                id:false,
                name:i
              })
            })
          }
          console.log(this.risklist)

          if(this.form.safeOperationFireworkSafety.preventiveCheck!=null && this.form.safeOperationFireworkSafety.preventiveCheck!=''){
            let dd = [];
            dd = this.form.safeOperationFireworkSafety.preventiveCheck.split('\n');
            dd.forEach((j, index1) => {
              let ee = j.split('%%');
              this.preventivelist.push({
                id:JSON.parse(ee[0]),
                name:ee[1]
              })
            })
          }else{
            this.preventivelist.push({
              id:false,
              name:i
            })
          }

          if(this.form.safeOperationFireworkSafety.emergencyCheck!=null && this.form.safeOperationFireworkSafety.emergencyCheck!=''){
            let dd = [];
            dd = this.form.safeOperationFireworkSafety.emergencyCheck.split('\n');
            dd.forEach((j, index1) => {
              let ee = j.split('%%');
              this.emergencylist.push({
                id:JSON.parse(ee[0]),
                name:ee[1]
              })
            })
          }else{
            this.emergencylist.push({
              id:false,
              name:i
            })
          }
        }


      })
    },

    getcheckList(){
      listBrokenattr({type:'3',mainId:this.id}).then(response => {
        this.checkList = response.rows;
      })
    },

    getBrokenScene(){
      listBrokenConfirmContent({mainId:this.id,status:'0'}).then(response => {
        this.brokenConfirmationList = response.rows;
        this.leng = this.brokenConfirmationList.length + 1
      });
    },
    getlist(){
      listBrokenApproval({mainId:this.id}).then(response => {
        let blilist=[]
        blilist = response.rows;
        blilist.forEach((j, index) => {
          if(j.approvalId=='0000'){
          }else{
            this.brokenapprovalList.push(j)
          }
        })
        this.length = response.rows.length
      });
    },
    getFujian(){
      listAttachment({paId:this.id,type:3}).then(res => {
        this.fjlist = res.rows;
      })
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




