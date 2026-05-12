<template>
  <div class="report" v-loading="loading">
    <button v-print="'#myprint'" class="topbtn">打印</button>

    <div class="reportbox" id="myprint">
      <div class="tit">动土安全作业票</div>
      <table>
				<tr class="tablelayout">
					<td></td><td></td><td></td><td></td><td></td>
					<td></td><td></td><td></td><td></td><td></td>
					<td></td><td></td><td></td><td></td><td></td>
					<td></td><td></td><td></td><td></td><td></td>
				</tr>
        <tr>
          <td colspan="4">作业申请单位</td>
          <td colspan="8">{{ form.deptName }}</td>
          <td colspan="3">作业申请时间</td>
          <td colspan="5">{{ formatDate(form.createTime,'y') }}</td>
        </tr>
        <tr>
          <td colspan="4">作业单位</td>
          <td colspan="3">{{form.operationDeptName}}</td>
          <td colspan="4">作业地点</td>
          <td colspan="4">{{form.placeInfo}}</td>
          <td colspan="4">作业内容</td>
          <td colspan="3">{{form.workCont}}</td>
        </tr>
        <tr>
          <td colspan="4">监护人</td>
          <td colspan="6">
            <span v-for="(item,index) in form.safeOperationEarthControlList">
              <img :src="item.sign" alt="" class="qianming">
            </span>
          </td>
          <td colspan="4">作业负责人</td>
          <td colspan="6">
            <img :src="form.responsibleSign" alt="" class="qianming"></td>
        </tr>
        <tr>
          <td colspan="4">关联的其他特殊作业及安全作业票编号</td>
          <td colspan="16">{{form.unitOperationType}}</td>
        </tr>
        <tr>
          <td colspan="20" class="noborder-bt">作业范围、内容、方式（包括深度、面积、并附简图）</td>
        </tr>
        <tr>
          <td colspan="3" class="noborder-rt noborder-bt noborder-tp">范围：</td>
          <td colspan="17" class="noborder-lf noborder-bt noborder-tp">{{ form.workScope }}</td>
        </tr>
        <tr>
          <td colspan="3" class="noborder-rt noborder-bt noborder-tp">内容：</td>
          <td colspan="17" class="noborder-lf noborder-bt noborder-tp">{{ form.workCont }}</td>
        </tr>
        <tr>
          <td colspan="3" class="noborder-rt noborder-bt noborder-tp">方式：</td>
          <td colspan="17" class="noborder-lf noborder-bt noborder-tp">{{ form.workWay }}</td>
        </tr>
        <tr>
          <td colspan="3" class="noborder-rt noborder-bt noborder-tp">简图：</td>
          <td colspan="17" class="noborder-lf noborder-bt noborder-tp">
            <div v-for="(item,index) in fjlist">
              <img :src="item.address" alt="" class="qianming">
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="11" class="noborder-rt noborder-bt noborder-tp"></td>
          <td colspan="3" class="noborder">签字：</td>
          <td colspan="3" class="noborder"><img :src="form.responsibleSign" alt="" class="qianming"></td>
          <td colspan="3" class="noborder-lf noborder-bt noborder-tp">{{}}</td>
        </tr>
        <tr>
          <td colspan="4">风险辨识结果</td>
          <td colspan="16">{{form.hazardContent}}</td>
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
        <tr v-for="(item,index) in confirmationList">
          <td colspan="2">{{index+1}}</td>
          <td colspan="12">{{replace(item.confirmContent)}}</td>
          <td colspan="3" v-if="item.checkFlag=='1'">√</td>
          <td colspan="3" v-if="item.checkFlag=='0'">不涉及</td>
          <td colspan="3"><img :src="item.userSign" alt="" class="qianming"></td>
        </tr>
<!--        <tr v-for="(item,index) in aqcsList">-->
<!--          <td colspan="2">{{aqindex+1+index}}</td>-->
<!--          <td colspan="15">其他安全措施：{{item.remark}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编制人：<img :src="item.compilerSign" alt="" class="qianming"></td>-->
<!--          <td colspan="3"></td>-->
<!--          <td colspan="4"></td>-->
<!--        </tr>-->
        <tr>
          <td colspan="4">安全交底人</td>
          <td colspan="4"><img :src="form.safetyDisclosureSign" alt="" class="qianming"></td>
          <td colspan="4">接受交底人</td>
          <td colspan="8">
            <img :src="form.controlSign" alt="" class="qianming">，
            <img :src="form.responsibleSign" alt="" class="qianming">
          </td>
        </tr>
        <tr v-for="(item,index) in approvalList">
          <td colspan="4">{{ item.operationName }}</td>
          <td colspan="4">同意</td>
          <td colspan="4">签字：<img :src="item.sign" alt="" class="qianming"></td>
          <td colspan="8">{{ formatDate(item.createTime,'y') }}</td>
        </tr>
        <tr v-for="(item,index) in checkList">
          <td colspan="4">{{ item.operationName }}</td>
          <td colspan="4">同意</td>
          <td colspan="4">签字：<img :src="item.userSign" alt="" class="qianming"></td>
          <td colspan="8">{{ formatDate(item.createTime,'y') }}</td>
        </tr>
      </table>
<!--      <div class="localpic">-->
<!--				<span>动土作业简图：</span>-->
<!--				<div v-for="(item,index) in fjlist">-->
<!--				  <img :src="item.address" alt="" class="qianming">-->
<!--				</div>-->
<!--			</div>-->


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
          <td colspan="7">{{form.operationDeptName}}</td>
          <td colspan="5">车间项目负责人</td>
          <td colspan="7"><img :src="form.safetyDisclosureSign" alt="" class="qianming"></td>
        </tr>
        <tr>
          <td colspan="5">作业内容</td>
          <td colspan="19">{{form.operationContent}}</td>
        </tr>
        <tr>
          <td colspan="5">作业时间</td>
          <td colspan="19">自{{formatDate(form.checkEnd,'y')}}至{{formatDate(form.applyAccept,'y')}}止</td>
        </tr>
        <tr>
          <td colspan="24" v-if="form.safeOperationEarthSafety.basicInformationCheck!=null">基本要求: {{form.safeOperationEarthSafety.basicInformationCheck}}</td>
          <td colspan="24" v-else>基本要求: {{form.safeOperationEarthSafety.basicInformation}}</td>
        </tr>
        <tr>
          <td colspan="5" rowspan="6">安全交底和风险告知内容</td>
          <td colspan="19" v-if="form.safeOperationEarthSafety.scopeEnvironmentCheck!=null">作业许可范围及作业环境：{{form.safeOperationEarthSafety.scopeEnvironmentCheck}}</td>
          <td colspan="19" v-else>作业许可范围及作业环境：{{form.safeOperationEarthSafety.scopeEnvironment}}</td>
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
          <td colspan="24" v-if="form.safeOperationEarthSafety.remarkCheck!=null">其他注意事项：{{form.safeOperationEarthSafety.remarkCheck}}</td>
          <td colspan="24" v-else>其他注意事项：{{form.safeOperationEarthSafety.remark}}</td>
        </tr>
        <tr>
          <td colspan="24" v-if="form.safeOperationEarthSafety.confirmationCopyCheck!=null">工作单位确认文案：{{form.safeOperationEarthSafety.confirmationCopyCheck}}</td>
          <td colspan="24" v-else>工作单位确认文案：{{form.safeOperationEarthSafety.confirmationCopy}}</td>
        </tr>
        <tr>
          <td colspan="24">企业负责人签字: <img :src="form.safetyDisclosureSign" alt="" class="qianming"></td>
        </tr>
        <tr>
          <td colspan="16" class="noborder-rt noborder-tp"></td>
          <td colspan="8" class="noborder-lf noborder-tp">作业单位现场负责人签字：<img :src="form.responsibleSign" alt="" class="qianming"></td>
        </tr>

      </table>

    </div>
  </div>
</template>

<script>

import { getEarth } from "@/api/safework/earth";
import { listEarthSceneContent } from "@/api/safework/earthSceneContent";
import { listEarchApproval } from "@/api/safework/earchApproval";


import { getBlindinfo} from "@/api/safework/blindinfo";
import { listBlindConfirmContent} from "@/api/safework/blindConfirmContent";
import { listBlindapproval, getBlindapproval, agreeFlowableTask,getFlowableTask } from "@/api/safework/blindapproval";
import { listConfirmContent, getConfirmContent, delConfirmContent, addConfirmContent, updateConfirmContent } from "@/api/safework/confirmContent";

export default {
  name: "盲板抽堵作业票",
  data() {
    return {
      title: '基础信息',
      attAddress:[],
      Camerashow: false,
      form:{
      },
      list:[],
      sceneList:[],
      checkDicList:[],
      id:null,
      workState:null,
      fjlist:[],
      workList:[],
      confirmationList:[],
      app:{},
      leng:0,
      confirmList:[],
      approvalList:[],
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
    this.getScene();
    // this.getlist();
  },

  mounted: function () {
  },

  methods: {
    getDetail(){

      let aa=[];
      let bb=[];
      let cc=[];
      this.risklist=[];
      this.preventivelist=[];
      this.emergencylist=[];

      getEarth(this.id).then(response => {
        console.log(response.data)
        this.form = response.data;
        this.form.placeInfo = this.form.objnames+'/'+this.form.unitName+'/'+this.form.operationSite
        this.approvalList = this.form.safeOperationEarthApprovalList
        this.checkList = this.form.safeOperationEarthCheck
        let a = this.form.unitOperationType.split(',')
        this.workList = a

        if (this.form.workImg != '' && this.form.workImg != null){
          this.fjlist = this.form.workImg.split(',')
        }


        if(this.form.safeOperationEarthSafety!=null){
          aa = this.form.safeOperationEarthSafety.operationRisk.split('\n');
          bb = this.form.safeOperationEarthSafety.preventive.split('\n');
          cc = this.form.safeOperationEarthSafety.emergency.split('\n');

          if(this.form.safeOperationEarthSafety.operationRiskCheck!=null && this.form.safeOperationEarthSafety.operationRiskCheck!=''){
            let dd = [];
            dd = this.form.safeOperationEarthSafety.operationRiskCheck.split('\n');
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

          if(this.form.safeOperationEarthSafety.preventiveCheck!=null && this.form.safeOperationEarthSafety.preventiveCheck!=''){
            let dd = [];
            dd = this.form.safeOperationEarthSafety.preventiveCheck.split('\n');
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

          if(this.form.safeOperationEarthSafety.emergencyCheck!=null && this.form.safeOperationEarthSafety.emergencyCheck!=''){
            let dd = [];
            dd = this.form.safeOperationEarthSafety.emergencyCheck.split('\n');
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

        // this.getConfirmList();
        // this.getFujian();
    },

    // getConfirmList(){
    //   listConfirmContent({pId:this.id,pipelineId:this.form.pipelineId}).then(response => {
    //     this.list = response.rows;
    //   });
    // },
    getScene(){
      listEarthSceneContent({pId:this.id}).then(response => {
        this.confirmationList = response.rows;
        this.leng = this.confirmationList.length + 1
      });
    },
    getlist(){
      listBlindapproval({blindId:this.id}).then(response => {
        let blilist=[]
        blilist = response.rows;
        blilist.forEach((j, index) => {
          if(j.approvalId=='0000'){
          }else{
            this.approvalList.push(j)
          }
        })
        this.length = response.rows.length
      });
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




