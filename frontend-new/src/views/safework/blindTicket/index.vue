<template>
  <div class="report" v-loading="loading">
    <button v-print="'#myprint'" class="topbtn">打印</button>
    <div class="reportbox" id="myprint">
      <div class="tit">盲板抽堵安全作业票</div>
      <table>
				<tr class="tablelayout">
					<td></td><td></td><td></td><td></td><td></td>
					<td></td><td></td><td></td><td></td><td></td>
					<td></td><td></td><td></td><td></td><td></td>
					<td></td><td></td><td></td><td></td><td></td>
					<td></td><td></td><td></td><td></td>
				</tr>
        <tr>
          <td colspan="3">申请单位</td>
          <td colspan="6">{{ form.enterpriseName }}</td>
          <td colspan="2">作业单位</td>
          <td colspan="5">{{form.workUnitName}}</td>
          <td colspan="2">作业类别</td>
          <td colspan="6">
            <div class="jibiecheck">
            <div class="item">
              堵盲板
              <span v-if="form.workWay == '堵（监护人）'">√</span>
              <span v-else></span>
            </div>
            <div class="item">
              抽盲板
              <span v-if="form.workWay == '抽（监护人）'">√</span>
              <span v-else></span>
            </div>
          </div></td>
        </tr>
        <tr>
          <td colspan="3" rowspan="2">设备管道名称</td>
          <td colspan="8">管道参数</td>
          <td colspan="7">盲板参数</td>
          <td colspan="6" rowspan="2">实际作业开始时间</td>
        </tr>
        <tr>
          <td colspan="3">介质</td>
          <td colspan="3">温度</td>
          <td colspan="2">压力</td>
          <td colspan="2">材质</td>
          <td colspan="2">规格</td>
          <td colspan="3">编号</td>
        </tr>
        <tr>
          <td colspan="3">{{ form.pipelineName }}</td>
          <td colspan="3">{{ form.medium }}</td>
          <td colspan="3">{{ form.temperature }}</td>
          <td colspan="2">{{ form.mpa }}</td>
          <td colspan="2">{{ form.material }}</td>
          <td colspan="2">{{ form.spe }}</td>
          <td colspan="3">{{ form.num }}</td>
          <td colspan="6">{{ formatDate(form.startTime,'m')}}</td>
        </tr>
        <tr>
          <td colspan="4" class="noborder-rt noborder-bt">盲板位置图及编号：</td>
          <td colspan="20" class="noborder-lf noborder-bt">{{form.blindNum}}</td>
        </tr>
        <tr class="noborder">
          <td colspan="4" class="noborder-tp noborder-rt"></td>
          <td colspan="5" class="noborder">编制人：</td>
          <td colspan="9" class="noborder" >
            <span v-for="aa in app"><img :src="aa.preparedSign" alt="" class="qianming"></span>
          </td>
          <td colspan="6" class="noborder-lf noborder-tp">{{formatDate(form.startTime,'r')}}</td>
        </tr>
        <tr>
          <td colspan="4">作业负责人</td>
          <td colspan="4"><img :src="form.workChargeSign" alt="" class="qianming"></td>
          <td colspan="4">作业人</td>
          <td colspan="4">
            <span v-for="aa in form.safeOperationBlindBlinduserList"><img :src="aa.sign" alt="" class="qianming"></span>
          </td>
          <td colspan="4">监护人</td>
          <td colspan="4">
            <span v-for="aa in form.safeBlindControlList"><img :src="aa.sign" alt="" class="qianming"></span>
          </td>
        </tr>
<!--        <tr v-for="(item,index) in list">-->
<!--          <td colspan="4" v-if="item.type==1">作业人</td>-->
<!--          <td colspan="4" v-if="item.type==2">监护人</td>-->
<!--          <td><img :src="item.sign" alt="" class="qianming"></td>-->
<!--          <td colspan="2">{{item.workName}}</td>-->
<!--          <td colspan="3">特殊作业工种</td>-->
<!--          <td colspan="3">/</td>-->
<!--          <td colspan="4">特殊作业证号</td>-->
<!--          <td colspan="3">/</td>-->
<!--        </tr>-->
        <tr>
          <td colspan="4">关联的其他特殊作业及安全作业票编码</td>
          <td colspan="20">{{form.relaceWork}}</td>
        </tr>
        <tr>
          <td colspan="4">风险辨识结果</td>
          <td colspan="20">{{form.hazardIdentId}}</td>
        </tr>
        <tr>
          <td colspan="4">序号</td>
          <td colspan="12">安全措施</td>
          <td colspan="4">是否涉及</td>
          <td colspan="4">确认人</td>
        </tr>
        <tr v-for="(item,index) in blindConfirmationList">
          <td colspan="4">{{index+1}}</td>
          <td colspan="12">{{replace(item.confirmContent)}}</td>
          <td colspan="4" v-if="item.checkFlag=='true'">√</td>
          <td colspan="4" v-if="item.checkFlag=='false'">不涉及</td>
          <td colspan="4"><img :src="item.confirmSign" alt="" class="qianming"></td>
        </tr>
        <tr v-for="(item,index) in app">
          <td colspan="4">{{ leng+1+index }}</td>
          <td colspan="16">其他安全措施：{{item.safeMeasure}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编制人：<img :src="item.preparedSign" alt="" class="qianming"></td>
          <td colspan="4"></td>
        </tr>
        <tr>
          <td colspan="4">安全交底人</td>
          <td colspan="8"><img :src="form.disclosureUserSign" alt="" class="qianming"></td>
          <td colspan="4">接受交底人</td>
          <td colspan="8">
            <img :src="form.workChargeSign" alt="" class="qianming">
            <img v-for="i in form.safeOperationBlindBlinduserList" :src="i.sign" alt="" class="qianming">
            <img v-for="i in form.safeBlindControlList" :src="i.sign" alt="" class="qianming">
          </td>
        </tr>
        <tr v-for="(item,index) in blindapprovalList">
          <td colspan="4" class="noborder-rt">{{ item.operationName }}</td>
          <td colspan="6" class="noborder-lf noborder-rt">同意</td>
          <td colspan="6" class="noborder-lf noborder-rt">签字：<img :src="item.sign" alt="" class="qianming"></td>
          <td colspan="8" class="noborder-lf">{{formatDate(item.createTime,'y')}}</td>
        </tr>
        <tr v-for="(item,index) in checkList">
          <td colspan="4" class="noborder-rt">{{ item.name }}</td>
          <td colspan="6" class="noborder-lf noborder-rt">同意</td>
          <td colspan="6" class="noborder-lf noborder-rt">签字：<img :src="item.confirmSign" alt="" class="qianming"></td>
          <td colspan="8" class="noborder-lf">{{formatDate(item.updateTime,'y')}}</td>
        </tr>
      </table>
      <div class="localpic">
				<span>盲板位置图：</span>
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
          <td colspan="8" class="noborder-lf">作业单位负责人签字：<img :src="form.workChargeSign" alt="" class="qianming"></td>
        </tr>
      </table>

    </div>
  </div>
</template>

<script>
import { getBlindinfo} from "@/api/safework/blindinfo";
import { listBlindConfirmContent} from "@/api/safework/blindConfirmContent";
import { listBlindapproval, getBlindapproval, agreeFlowableTask,getFlowableTask } from "@/api/safework/blindapproval";
import { listConfirmContent, getConfirmContent, delConfirmContent, addConfirmContent, updateConfirmContent } from "@/api/safework/confirmContent";
import { listAttachment} from "@/api/safework/attachment";
import { listAttrinfo,updateAttrinfo} from "@/api/safework/attrinfo";
export default {
  name: "盲板抽堵作业票",
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
      blindConfirmationList:[],
      app:[],
      app1:{},
      leng:0,
      confirmList:[],
      blindapprovalList:[],
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
    this.getBlindScene();
    this.getlist();
    this.getcheckList();
  },

  mounted: function () {
  },

  methods: {
    getcheckList(){
      listAttrinfo({type:'3',mainId:this.id}).then(response => {
        this.checkList = response.rows;
      })
    },
    getDetail(){

      let aa=[];
      let bb=[];
      let cc=[];
      this.risklist=[];
      this.preventivelist=[];
      this.emergencylist=[];

      getBlindinfo(this.id).then(response => {
        console.log(response.data)
        this.form = response.data;
        this.form.placeInfo = this.form.safeSpecialPlace.objnames+'/'+this.form.safeSpecialPlace.unitName+'/'+this.form.safeSpecialPlace.operationSite
        this.form.pipelineName = this.form.safePipeline.name
        this.form.temperature = this.form.safePipeline.temperature
        this.form.mpa = this.form.safePipeline.mpa
        this.form.material = this.form.safePipeline.material
        this.form.spe = this.form.safePipeline.spe
        this.form.num = this.form.safePipeline.num
        this.form.medium = this.form.safePipeline.medium
        this.list = this.form.safeWorkConfirmContentList
        this.confirmList = this.list;
        this.confirmList.push({
          sign:this.form.workChargeSign
        })
        this.form.safeAttrList.forEach((j, index) => {
          if(j.type=='1'){
            this.sceneList.push(j)
            if(j.safeMeasure!=null && j.safeMeasure!=''){
              this.app.push(j)
            }
            //this.app = this.sceneList[0];
            //this.app1 = this.sceneList[1];
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

    getConfirmList(){
      listConfirmContent({blindId:this.id,pipelineId:this.form.pipelineId}).then(response => {
        this.list = response.rows;
      });
    },
    getBlindScene(){
      listBlindConfirmContent({mainId:this.id,status:'0'}).then(response => {
        this.blindConfirmationList = response.rows;
        this.leng = this.blindConfirmationList.length + 1
      });
    },
    getlist(){
      listBlindapproval({blindId:this.id}).then(response => {
        let blilist=[]
        blilist = response.rows;
        blilist.forEach((j, index) => {
          if(j.approvalId=='0000'){
          }else{
            this.blindapprovalList.push(j)
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
        }else if(type == 'r'){
          return `${year}年${month}月${day}日`;
        }else{
          return `${month}月${day}日${hours}时${minutes}分`;
        }
      }
    },
  },

}
</script>


<style scoped lang="scss">
.jibiecheck{
  .item{
    display: inline-block;
    margin-right: 20px;
    span{
      width: 20px;height: 20px;
      border: 1px solid #666;
      display: inline-block;
      text-align: center;line-height: 20px;
      margin-left: 5px;
      vertical-align: middle;
      font-weight: bold;
    }
  }
}
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
	table-layout: fixed;
  td{
    border: 1px solid #aaa;padding: 5px 10px;
    line-height: 2;font-size: 14px;
		width: 4.166%;
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
		max-width: 100px;
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




