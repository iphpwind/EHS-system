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
          <td colspan="6"></td>
          <td colspan="2">作业单位</td>
          <td colspan="5"></td>
          <td colspan="2">作业类别</td>
          <td colspan="6">
            <div class="jibiecheck">
              <div class="item">
                堵盲板
                <span></span>
              </div>
              <div class="item">
                抽盲板
                <span></span>
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
          <td colspan="3" style="height: 40px"></td>
          <td colspan="3"></td>
          <td colspan="3"></td>
          <td colspan="2"></td>
          <td colspan="2"></td>
          <td colspan="2"></td>
          <td colspan="3"></td>
          <td colspan="6"></td>
        </tr>
        <tr>
          <td colspan="4" class="noborder-rt noborder-bt">盲板位置图及编号：</td>
          <td colspan="20" class="noborder-lf noborder-bt"></td>
        </tr>
        <tr class="noborder">
          <td colspan="4" class="noborder-tp noborder-rt"></td>
          <td colspan="5" class="noborder">编制人：</td>
          <td colspan="9" class="noborder" ></td>
          <td colspan="6" class="noborder-lf noborder-tp">&nbsp;年&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;日</td>
        </tr>
        <tr>
          <td colspan="4">作业负责人</td>
          <td colspan="4"></td>
          <td colspan="4">作业人</td>
          <td colspan="4"></td>
          <td colspan="4">监护人</td>
          <td colspan="4"></td>
        </tr>
        <tr>
          <td colspan="4">关联的其他特殊作业及安全作业票编码</td>
          <td colspan="20"></td>
        </tr>
        <tr>
          <td colspan="4">风险辨识结果</td>
          <td colspan="20"></td>
        </tr>
        <tr>
          <td colspan="4">序号</td>
          <td colspan="12">安全措施</td>
          <td colspan="4">是否涉及</td>
          <td colspan="4">确认人</td>
        </tr>
        <tr v-for="(item,index) in blindConfirmationList">
          <td colspan="4">{{index+1}}</td>
          <td colspan="12">{{replace(item.confirmationContent)}}</td>
          <td colspan="4"></td>
          <td colspan="4"></td>
        </tr>
        <tr>
          <td colspan="4">{{leng}}</td>
          <td colspan="16">其他安全措施：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编制人：</td>
          <td colspan="4"></td>
        </tr>
        <tr>
          <td colspan="4">安全交底人</td>
          <td colspan="8"></td>
          <td colspan="4">接受交底人</td>
          <td colspan="8"></td>
        </tr>
        <tr v-for="(item,index) in approvalProcessList">
          <td colspan="4" class="noborder-rt">{{ item.operationName }}</td>
          <td colspan="6" class="noborder-lf noborder-rt"></td>
          <td colspan="6" class="noborder-lf noborder-rt">签字：</td>
          <td colspan="8" class="noborder-lf"></td>
        </tr>
        <tr v-for="(item,index) in checkDicList">
          <td colspan="4" class="noborder-rt">{{ item.checkName }}</td>
          <td colspan="6" class="noborder-lf noborder-rt"></td>
          <td colspan="6" class="noborder-lf noborder-rt">签字：</td>
          <td colspan="8" class="noborder-lf"></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import { listBlindConfirmation, getBlindConfirmation, delBlindConfirmation, addBlindConfirmation, updateBlindConfirmation } from "@/api/safework/blindConfirmation";
import { listApprovalProcess} from "@/api/safework/approvalProcess";
import { listCheckDic} from "@/api/safework/checkDic";
export default {
  name: "盲板抽堵作业票",
  data() {
    return {
      title: '盲板抽堵安全作业票模板',
      attAddress:[],
      Camerashow: false,
      form:{
      },
      blindConfirmationList:[],
      approvalProcessList:[],
      checkDicList:[],
      leng:0
    }
  },

  watch: {

  },
  created() {
    this.getList();
    this.getcheck();
    this.getaccept();
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
    getList(){
      listBlindConfirmation({status:'0'}).then(response => {
        this.blindConfirmationList = response.rows;
        this.leng = this.blindConfirmationList.length+1
      });
    },
    getcheck(){
      listApprovalProcess({operationType:'6',status:'0'}).then(response => {
        this.approvalProcessList = response.rows;
      });
    },
    getaccept(){
      listCheckDic({operationType:'6',status:'0'}).then(response => {//内部
        this.checkDicList = response.rows;
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




