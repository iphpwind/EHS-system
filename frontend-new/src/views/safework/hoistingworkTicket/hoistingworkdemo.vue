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
          <td colspan="4"></td>
          <td colspan="3">作业单位</td>
          <td colspan="3"></td>
          <td colspan="3">作业申请时间</td>
          <td colspan="4"></td>
        </tr>
        <tr>
          <td colspan="3">吊装地点</td>
          <td colspan="4"></td>
          <td colspan="3">吊具名称</td>
          <td colspan="3"></td>
          <td colspan="3">吊物内容</td>
          <td colspan="4"></td>
        </tr>
        <tr>
          <td colspan="3">吊装作业人</td>
          <td colspan="4"></td>
          <td colspan="3">司索人</td>
          <td colspan="4"></td>
          <td colspan="3">监护人</td>
          <td colspan="3"></td>
        </tr>
        <tr>
          <td colspan="3">指挥人员</td>
          <td colspan="4"></td>
          <td colspan="6">吊物质量(t)及作业级别</td>
          <td colspan="7"></td>
        </tr>
        <tr>
          <td colspan="3">作业实施时间</td>
          <td colspan="17">自&nbsp;&nbsp;年&nbsp;&nbsp;月&nbsp;&nbsp;日&nbsp;&nbsp;时&nbsp;&nbsp;分至&nbsp;&nbsp;年&nbsp;&nbsp;月&nbsp;&nbsp;日&nbsp;&nbsp;时&nbsp;&nbsp;分</td>
        </tr>
        <tr>
          <td colspan="2">序号</td>
          <td colspan="12">安全措施</td>
          <td colspan="3">是否涉及</td>
          <td colspan="3">确认人</td>
        </tr>
        <tr v-for="(item,index) in hoistingworkConfirmationList">
          <td colspan="2">{{index+1}}</td>
          <td colspan="12">{{replace(item.confirmationContent)}}</td>
          <td colspan="3"></td>
          <td colspan="3"></td>
        </tr>
        <tr>
          <td colspan="2">{{leng}}</td>
          <td colspan="12">其他安全措施：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编制人：</td>
          <td colspan="3"></td>
          <td colspan="3"></td>
        </tr>
        <tr>
          <td colspan="4">安全交底人</td>
          <td colspan="6"></td>
          <td colspan="4">接受交底人</td>
          <td colspan="6"></td>
        </tr>
        <tr v-for="(item,index) in hoistingworkapprovalList" class="noborder">
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

    </div>
  </div>
</template>

<script>
import { listHoistingwork, getHoistingwork, delHoistingwork, addHoistingwork, updateHoistingwork } from "@/api/safework/hoistingwork";
import { listHoistingworkSceneConfirmation} from "@/api/safework/hoistingworkSceneConfirmation";
import { listApprovalProcess } from "@/api/safework/approvalProcess";
import { listCheckDic } from "@/api/safework/checkDic";
export default {
  name: "吊装作业作业票",
  data() {
    return {
      title: '基础信息',
      form:{
      },
      id:null,
      hoistingworkConfirmationList:[],
      leng:0,
      hoistingworkapprovalList:[],
      checkList:[],
    }
  },

  watch: {

  },
  created() {
    this.id = this.$route.query.id;
    this.workState = this.$route.query.workState;
    this.getHoistingworkScene();
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
    getcheckList(){
      listCheckDic({operationType:"2",status:"0"}).then(response => {
        this.checkList = response.rows;
      })
    },

    getHoistingworkScene(){
      listHoistingworkSceneConfirmation({status:'0'}).then(response => {
        this.hoistingworkConfirmationList = response.rows;
        this.leng = this.hoistingworkConfirmationList.length + 1
      });
    },
    getlist(){
      listApprovalProcess({operationType:"2",status:"0"}).then(response => {
        let blilist=[]
        blilist = response.rows;
        blilist.forEach((j, index) => {
          if(j.approvalId=='0000'){
          }else{
            this.hoistingworkapprovalList.push(j)
          }
        })
        this.length = response.rows.length
      });
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




