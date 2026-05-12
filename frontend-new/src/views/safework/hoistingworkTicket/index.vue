<template>
  <div class="report" v-loading="loading">
    <button v-print="'#myprint'" class="topbtn">打印</button>
    <div class="reportbox" id="myprint">
      <div class="tit">吊装作业作业票</div>
      <table>
        <tr class="tablelayout">
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td colspan="3">作业申请单位</td>
          <td colspan="4">{{ form.deptName }}</td>
          <td colspan="3">作业单位</td>
          <td colspan="3">{{form.operationDeptName}}</td>
          <td colspan="3">作业申请时间</td>
          <td colspan="4">{{formatDate(form.createTime,'y')}}</td>
        </tr>
        <tr>
          <td colspan="3">吊装地点</td>
          <td colspan="4">{{form.safeObjectName + "/" + form.safeUnitName + "/" + form.operationSite}}</td>
          <td colspan="3">吊具名称</td>
          <td colspan="3">{{form.spreader}}</td>
          <td colspan="3">吊物内容</td>
          <td colspan="4">{{form.operationContent}}</td>
        </tr>
        <tr>
          <td colspan="3">吊装作业人</td>
          <td colspan="4">
            <div v-for="item in form.safeOperationHoistingWorkuserList">
              <img :src="item.sign" alt="" class="qianming">
            </div>
          </td>
          <td colspan="3">司索人</td>
          <td colspan="4">
            <div v-for="item in form.safeOperationHoistingLineuserList">
              <img :src="item.sign" alt="" class="qianming">
            </div>
          </td>
          <td colspan="3">监护人</td>
          <td colspan="3">
            <span v-for="(item,index) in form.safeOperationHoistingworkControlList">
              <img :src="item.sign" alt="" class="qianming">
            </span>
          </td>
        </tr>
        <tr>
          <td colspan="3">指挥人员</td>
          <td colspan="4"><img :src="form.responsibleSign" alt="" class="qianming"></td>
          <td colspan="6">吊物质量(t)及作业级别</td>
          <td colspan="7">{{form.weight}},{{form.levelName}}</td>
        </tr>
        <tr>
          <td colspan="3">作业实施时间</td>
          <td colspan="17">自{{formatDate(form.checkEnd,'y')}}至{{formatDate(form.applyAccept,'y')}}止</td>
        </tr>
<!--        <tr>-->
<!--          <td colspan="9" class="noborder-rt"></td>-->
<!--          <td colspan="4" class="noborder-rt noborder-lf noborder-tp">作业单位临时用电负责人签字：</td>-->
<!--          <td colspan="2" class="noborder-rt noborder-lf noborder-tp noborder-bt"><img :src="form.responsibleSign" alt="" class="qianming"></td>-->
<!--          <td colspan="5" class="noborder-lf noborder-bt noborder-tp">{{responsibleSignTime}}</td>-->
<!--        </tr>-->
        <tr>
          <td colspan="2">序号</td>
          <td colspan="12">安全措施</td>
          <td colspan="3">是否涉及</td>
          <td colspan="3">确认人</td>
        </tr>
        <tr v-for="(item,index) in form.safeOperationHoistingworkSceneContentList">
          <td colspan="2">{{index+1}}</td>
          <td colspan="12">{{replace(item.confirmContent)}}</td>
          <td colspan="3" v-if="item.checkFlag==true">√</td>
          <td colspan="3" v-if="item.checkFlag==false">不涉及</td>
          <td colspan="3"><img :src="item.userSign" alt="" class="qianming"></td>
        </tr>
        <tr v-for="(item,index) in aqcsList">
          <td colspan="2">{{aqindex+1+index}}</td>
          <td colspan="15">其他安全措施：{{item.remark}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编制人：<img :src="item.compilerSign" alt="" class="qianming"></td>
          <td colspan="3"></td>
          <td colspan="3"></td>
        </tr>
<!--        <tr>-->
<!--          <td colspan="2">{{}}</td>-->
<!--          <td colspan="11">其他安全措施</td>-->
<!--          <td colspan="7">编制人</td>-->
<!--        </tr>-->
<!--        <tr v-for="(item,index) in form.safeOperationHoistingworkSceneUserList">-->
<!--          <td v-if="item.remark != null && item.remark != ''" colspan="2">{{index+1}}</td>-->
<!--          <td v-if="item.remark != null && item.remark != ''" colspan="11">{{item.remark}}</td>-->
<!--          <td v-if="item.remark != null && item.remark != ''" colspan="7">签字：<img :src="item.compilerSign" alt="" class="qianming"></td>-->
<!--        </tr>-->
        <tr>
          <td colspan="4">安全交底人</td>
          <td colspan="6"><img :src="form.safetyDisclosureSign" alt="" class="qianming"></td>
          <td colspan="4">接受交底人</td>
          <td colspan="6">
            <img :src="form.controlSign" alt="" class="qianming">
            <img :src="form.responsibleSign" alt="" class="qianming">
            <img v-for="i in form.safeOperationHoistingWorkuserList" :src="i.sign" alt="" class="qianming">
            <img v-for="i in form.safeOperationHoistingLineuserList" :src="i.sign" alt="" class="qianming">
          </td>
        </tr>
        <tr v-for="(item,index) in form.safeOperationHoistingworkApprovalList" class="noborder">
          <td colspan="4">{{ item.operationName }}</td>
          <td colspan="4">同意</td>
          <td colspan="4">签字：<img :src="item.sign" alt="" class="qianming"></td>
          <td colspan="8">{{ item.createTime }}</td>
        </tr>
        <tr v-for="(item,index) in form.safeOperationHoistingworkCheckList" class="noborder">
          <td colspan="4">{{ item.checkName }}</td>
          <td colspan="4">同意</td>
          <td colspan="4">签字：<img :src="item.userSign" alt="" class="qianming"></td>
          <td colspan="8">{{ item.createTime }}</td>
        </tr>
      </table>

      <div class="tit">安全交底和风险告知确认卡</div>
      <table>
        <tr class="tablelayout">
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
          <td></td><td></td><td></td><td></td><td></td>
        </tr>
        <tr>
          <td colspan="4">作业单位</td>
          <td colspan="6">{{form.operationDeptName}}</td>
          <td colspan="4">车间项目负责人</td>
          <td colspan="6"><img :src="form.safetyDisclosureSign" alt="" class="qianming"></td>
        </tr>
        <tr>
          <td colspan="4">作业内容</td>
          <td colspan="16">{{form.operationContent}}</td>
        </tr>
        <tr>
          <td colspan="4">作业时间</td>
          <td colspan="16">自{{form.startTime}}至{{form.endTime}}止</td>
        </tr>
        <tr>
          <td colspan="4">参与作业人员</td>
          <td colspan="16"><img :src="form.workerSign" alt="" class="qianming"></td>
        </tr>
        <tr>
          <td colspan="24" v-if="form.safeOperationHoistingworkSafety.basicInformationCheck!=null">基本要求: {{form.safeOperationHoistingworkSafety.basicInformationCheck}}</td>
          <td colspan="24" v-else>基本要求: {{form.safeOperationHoistingworkSafety.basicInformation}}</td>
        </tr>
        <tr>
          <td colspan="5" rowspan="6">安全交底和风险告知内容</td>
          <td colspan="19" v-if="form.safeOperationHoistingworkSafety.scopeEnvironmentCheck!=null">作业许可范围及作业环境：{{form.safeOperationHoistingworkSafety.scopeEnvironmentCheck}}</td>
          <td colspan="19" v-else>作业许可范围及作业环境：{{form.safeOperationHoistingworkSafety.scopeEnvironment}}</td>
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
          <td colspan="24" v-if="form.safeOperationHoistingworkSafety.remarkCheck!=null">其他注意事项：{{form.safeOperationHoistingworkSafety.remarkCheck}}</td>
          <td colspan="24" v-else>其他注意事项：{{form.safeOperationHoistingworkSafety.remark}}</td>
        </tr>
        <tr>
          <td colspan="24" v-if="form.safeOperationHoistingworkSafety.confirmationCopyCheck!=null">工作单位确认文案：{{form.safeOperationHoistingworkSafety.confirmationCopyCheck}}</td>
          <td colspan="24" v-else>工作单位确认文案：{{form.safeOperationHoistingworkSafety.confirmationCopy}}</td>
        </tr>
        <tr>
          <td colspan="20">企业负责人签字: <img :src="form.controlSign" alt="" class="qianming"></td>
        </tr>
        <tr>
          <td colspan="12" class="noborder-rt noborder-bt"></td>
          <td colspan="8" class="noborder-lf noborder-bt">作业单位现场负责人签字：<img :src="form.safetyDisclosureSign" alt="" class="qianming"></td>
        </tr>
        <tr>
          <td colspan="12" class="noborder-rt noborder-tp"></td>
          <td colspan="8" class="noborder-lf noborder-tp">时间：{{form.responsibleSignTime}}</td>
        </tr>

      </table>

    </div>
  </div>
</template>

<script>
import { listHoistingwork, getHoistingwork, delHoistingwork, addHoistingwork, updateHoistingwork } from "@/api/safework/hoistingwork";
export default {
  name: "吊装作业作业票",
  data() {
    return {
      title: '基础信息',
      form:{
				safeOperationHoistingworkSafety:{
					basicInformationCheck:false
				}
      },
      aqindex:0,
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
    this.getInfo();
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
    getInfo(){

      let aa=[];
      let bb=[];
      let cc=[];
      this.risklist=[];
      this.preventivelist=[];
      this.emergencylist=[];

      getHoistingwork(this.id).then(response => {
        this.form = response.data

        this.aqindex = this.form.safeOperationHoistingworkSceneContentList.length;
        this.form.safeOperationHoistingworkSceneContentList.forEach((i, index) => {
          if(i.remark!=null && i.remark!=''){
            this.aqcsList.push(i)
          }
        })

        if(this.form.safeOperationHoistingworkSafety!=null){
          aa = this.form.safeOperationHoistingworkSafety.operationRisk.split('\n');
          bb = this.form.safeOperationHoistingworkSafety.preventive.split('\n');
          cc = this.form.safeOperationHoistingworkSafety.emergency.split('\n');

          if(this.form.safeOperationHoistingworkSafety.operationRiskCheck!=null && this.form.safeOperationHoistingworkSafety.operationRiskCheck!=''){
            let dd = [];
            dd = this.form.safeOperationHoistingworkSafety.operationRiskCheck.split('\n');
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

          if(this.form.safeOperationHoistingworkSafety.preventiveCheck!=null && this.form.safeOperationHoistingworkSafety.preventiveCheck!=''){
            let dd = [];
            dd = this.form.safeOperationHoistingworkSafety.preventiveCheck.split('\n');
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

          if(this.form.safeOperationHoistingworkSafety.emergencyCheck!=null && this.form.safeOperationHoistingworkSafety.emergencyCheck!=''){
            let dd = [];
            dd = this.form.safeOperationHoistingworkSafety.emergencyCheck.split('\n');
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




