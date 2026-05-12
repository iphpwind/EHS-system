<template>
  <div class="report" v-loading="loading">
    <button v-print="'#myprint'" class="topbtn">打印</button>
    <div class="reportbox" id="myprint">
      <div class="tit">动火作业票</div>
      <table style="margin-bottom:0;">
        <tr class="tablelayout">
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td colspan="5">作业申请单位</td>
          <td colspan="9">{{ form.deptName }}</td>
          <td colspan="4">作业申请时间</td>
          <td colspan="6">{{formatDate(form.createTime,'y')}}</td>
        </tr>
        <tr>
          <td colspan="5">作业内容</td>
          <td colspan="9">{{ form.operationContent }}</td>
          <td colspan="4">动火地点及动火部位</td>
          <td colspan="6">{{form.safeObjectName + "/" + form.safeUnitName + "/" + form.operationSite}}</td>
        </tr>
        <tr>
          <td colspan="5">动火作业级别</td>
          <td colspan="9">
            <div class="jibiecheck">
              <div v-for="aa in fireworkLevelList" class="item">
                {{aa.levelName}}
                <span v-if="form.levelId == aa.id">√</span>
                <span v-else></span>
              </div>
            </div>
          </td>
          <td colspan="4">动火方式</td>
          <td colspan="6">{{form.workType}}</td>
        </tr>
        <tr>
          <td colspan="5">动火人及证书编号</td>
          <td colspan="19">
            <span v-for="aa in form.safeOperationFireworkFireuserList"><img :src="aa.sign" alt="" class="qianming">:{{aa.certificate}};</span>
          </td>
        </tr>
        <tr>
          <td colspan="5">作业单位</td>
          <td colspan="9">{{form.operationDeptName}}</td>
          <td colspan="4">作业负责人</td>
          <td colspan="6"><img :src="form.responsibleSign" alt="" class="qianming"></td>
        </tr>
        <tr>
          <td colspan="5">分析点名称</td>
          <td colspan="4">分析人</td>
          <td colspan="5">分析时间</td>
          <td colspan="4">分析项目</td>
          <td colspan="3">分析数据</td>
          <td colspan="4">标准</td>
        </tr>
      </table>
      <table v-for="item in form.safeOperationFireworkAnalysisList" style="margin-bottom:0;margin-top: -11px;">
        <tr class="tablelayout">
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td>
        </tr>
        <tr v-for="aa in item.analysisList">
          <td colspan="5">{{item.analysisSiteName}}</td>
          <td colspan="4"><img :src="item.analysisUserSign" alt="" class="qianming"></td>
          <td colspan="5">{{formatDate(item.createTime,'m')}}</td>
          <td colspan="4">{{aa.analysisName}}</td>
          <td colspan="3">{{aa.analysisResult}}</td>
          <td colspan="4" v-if="aa.analysisType == '0'">{{aa.numLow}}-{{aa.numUp}}{{aa.numUnit}}</td>
          <td colspan="4" v-if="aa.analysisType == '1'">{{aa.stringArea}}</td>
        </tr>
      </table>
      <table style="margin-top: -11px;">
        <tr class="tablelayout">
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td colspan="5">关联的其他特殊作业及安全作业票编号</td>
          <td colspan="19">{{form.unitOperationType}}</td>
        </tr>
        <tr>
          <td colspan="5">风险辨识结果</td>
          <td colspan="19">{{form.hazardContent}}</td>
        </tr>
        <tr>
          <td colspan="5">动火作业实施时间</td>
          <td colspan="19">自{{formatDate(form.checkEnd,'y')}}至{{formatDate(form.applyAccept,'y')}}止</td>
        </tr>
        <tr>
          <td colspan="2">序号</td>
          <td colspan="15">安全措施</td>
          <td colspan="3">是否涉及</td>
          <td colspan="4">确认人</td>
        </tr>
        <tr v-for="(item,index) in form.safeOperationFireworkSceneContentList">
          <td colspan="2">{{index+1}}</td>
          <td colspan="15">{{replace(item.confirmContent)}}</td>
          <td colspan="3" v-if="item.checkFlag==true">√</td>
          <td colspan="3" v-if="item.checkFlag==false">不涉及</td>
          <td colspan="4"><img :src="item.userSign" alt="" class="qianming"></td>
        </tr>
        <tr v-for="(item,index) in aqcsList">
          <td colspan="2">{{aqindex+1+index}}</td>
          <td colspan="15">其他安全措施：{{item.remark}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编制人：<img :src="item.compilerSign" alt="" class="qianming"></td>
          <td colspan="3"></td>
          <td colspan="4"></td>
        </tr>
        <tr>
          <td colspan="5">安全交底人</td>
          <td colspan="7"><img :src="form.safetyDisclosureSign" alt="" class="qianming"></td>
          <td colspan="5">接受交底人</td>
          <td colspan="7">
            <img :src="form.controlSign" alt="" class="qianming">
            <img :src="form.responsibleSign" alt="" class="qianming">
            <img v-for="i in form.safeOperationFireworkFireuserList" :src="i.sign" alt="" class="qianming">
          </td>
        </tr>
        <tr>
          <td colspan="5">监护人</td>
          <td colspan="19">
              <span v-for="(item,index) in form.safeOperationFireworkControlList">
                <img :src="item.sign" alt="" class="qianming">
              </span>
          </td>
        </tr>
        <tr v-for="(item,index) in form.safeOperationFireworkApprovalList" class="noborder">
          <td colspan="5">{{ item.operationName }}</td>
          <td colspan="7">同意</td>
          <td colspan="5">签字：<img :src="item.sign" alt="" class="qianming"></td>
          <td colspan="7">{{ item.createTime }}</td>
        </tr>
        <tr v-for="(item,index) in form.safeOperationFireworkCheckList" class="noborder">
          <td colspan="5">{{ item.checkName }}</td>
          <td colspan="7">同意</td>
          <td colspan="5">签字：<img :src="item.userSign" alt="" class="qianming"></td>
          <td colspan="7">{{ item.createTime }}</td>
        </tr>
      </table>

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
          <td colspan="5">参与作业人员</td>
          <td colspan="19"><img :src="form.fireworkSign" alt="" class="qianming"></td>
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
          <td colspan="24">企业负责人签字: <img :src="form.safetyDisclosureSign" alt="" class="qianming"></td>
        </tr>
        <tr>
          <td colspan="16" class="noborder-rt noborder-bt"></td>
          <td colspan="8" class="noborder-lf noborder-bt">作业单位现场负责人签字：<img :src="form.responsibleSign" alt="" class="qianming"></td>
        </tr>
        <tr>
          <td colspan="16" class="noborder-rt noborder-tp"></td>
          <td colspan="8" class="noborder-lf noborder-tp">时间：{{formatDate(form.responsibleSignTime,'y')}}</td>
        </tr>
<!--				<tr>-->
<!--					<td colspan="8">动火作业级别</td>-->
<!--					<td colspan="12">-->

<!--					</td>-->
<!--				</tr>-->

      </table>

    </div>
  </div>
</template>

<script>
import { listFirework, getFirework, delFirework, addFirework, updateFirework } from "@/api/safework/firework";
import { listFireworkLevel } from "@/api/safework/fireworkLevel";
export default {
  name: "动火作业票",
  data() {
    return {
      title: '基础信息',
      aqindex:0,
      form:{
				safeOperationFireworkSafety:{
					basicInformationCheck:false
				}
      },
      fireworkLevelList:[],
      aqcsList:[],
      risklist:[],
      preventivelist:[],
      emergencylist:[]
    }
  },

  watch: {

  },
  created() {
    this.id = this.$route.query.id;
    this.getFireworkLevelList();
    this.getInfo();
  },

  mounted: function () {
  },

  methods: {
    getInfo(){
      let aa=[];
      let bb=[];
      let cc=[];
      this.risklist=[];
      this.preventivelist=[];
      this.emergencylist=[];
      getFirework(this.id).then(response => {
        this.form = response.data;
        this.aqindex = this.form.safeOperationFireworkSceneContentList.length;
        this.form.safeOperationFireworkSceneUserList.forEach((i, index) => {
          if(i.remark!=null && i.remark!=''){
            this.aqcsList.push(i)
          }
        })

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
    getFireworkLevelList(){
      listFireworkLevel({status:"0"}).then(response => {
        this.fireworkLevelList = response.rows;
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
      width: 4.166%;
    }
  }
}
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
@media print {
  .reportbox table{
    width: 100%;
  }
  .localpic{
    width: 100%;
  }
}
</style>




