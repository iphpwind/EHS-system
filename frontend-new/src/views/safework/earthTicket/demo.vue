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
          <td colspan="8"></td>
          <td colspan="3">作业申请时间</td>
          <td colspan="5"></td>
        </tr>
        <tr>
          <td colspan="4">作业单位</td>
          <td colspan="3"></td>
          <td colspan="4">作业地点</td>
          <td colspan="4"></td>
          <td colspan="4">作业内容</td>
          <td colspan="3"></td>
        </tr>
        <tr>
          <td colspan="4">监护人</td>
          <td colspan="6"></td>
          <td colspan="4">作业负责人</td>
          <td colspan="6"></td>
        </tr>
        <tr>
          <td colspan="4">关联的其他特殊作业及安全作业票编号</td>
          <td colspan="16"></td>
        </tr>
        <tr>
          <td colspan="20" class="noborder-bt">作业范围、内容、方式（包括深度、面积、并附简图）</td>
        </tr>
        <tr>
          <td colspan="3" class="noborder-rt noborder-bt noborder-tp">范围：</td>
          <td colspan="17" class="noborder-lf noborder-bt noborder-tp"></td>
        </tr>
        <tr>
          <td colspan="3" class="noborder-rt noborder-bt noborder-tp">内容：</td>
          <td colspan="17" class="noborder-lf noborder-bt noborder-tp"></td>
        </tr>
        <tr>
          <td colspan="3" class="noborder-rt noborder-bt noborder-tp">方式：</td>
          <td colspan="17" class="noborder-lf noborder-bt noborder-tp"></td>
        </tr>
        <tr>
          <td colspan="3" class="noborder-rt noborder-bt noborder-tp">简图：</td>
          <td colspan="17" class="noborder-lf noborder-bt noborder-tp">
          </td>
        </tr>
        <tr>
          <td colspan="11" class="noborder-rt noborder-bt noborder-tp"></td>
          <td colspan="3" class="noborder">签字：</td>
          <td colspan="3" class="noborder"></td>
          <td colspan="3" class="noborder-lf noborder-bt noborder-tp">{{}}</td>
        </tr>
        <tr>
          <td colspan="4">风险辨识结果</td>
          <td colspan="16"></td>
        </tr>
        <tr>
          <td colspan="4">作业实施时间</td>
          <td colspan="16">自__至__止</td>
        </tr>
        <tr>
          <td colspan="2">序号</td>
          <td colspan="12">安全措施</td>
          <td colspan="3">是否涉及</td>
          <td colspan="3">确认人</td>
        </tr>
        <tr v-for="(item,index) in confirmationList">
          <td colspan="2">{{index+1}}</td>
          <td colspan="12">{{replace(item.confirmationContent)}}</td>
          <td colspan="3"></td>
          <td colspan="3"></td>
        </tr>
        <!--        <tr v-for="(item,index) in aqcsList">-->
        <!--          <td colspan="2">{{aqindex+1+index}}</td>-->
        <!--          <td colspan="15">其他安全措施：{{item.remark}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;编制人：<img :src="item.compilerSign" alt="" class="qianming"></td>-->
        <!--          <td colspan="3"></td>-->
        <!--          <td colspan="4"></td>-->
        <!--        </tr>-->
        <tr>
          <td colspan="4">安全交底人</td>
          <td colspan="4"></td>
          <td colspan="4">接受交底人</td>
          <td colspan="8"></td>
        </tr>
        <tr v-for="(item,index) in approvalList">
          <td colspan="4">{{ item.operationName }}</td>
          <td colspan="4"></td>
          <td colspan="4">签字：</td>
          <td colspan="8"></td>
        </tr>
        <tr v-for="(item,index) in checkDicList">
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

import { listEarthConfirmation, getEarthConfirmation, delEarthConfirmation, addEarthConfirmation, updateEarthConfirmation } from "@/api/safework/earthConfirmation";
import { listApprovalProcess} from "@/api/safework/approvalProcess";
import { listCheckDic} from "@/api/safework/checkDic";

export default {
  name: "动土作业票",
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
      listEarthConfirmation({status:'0'}).then(response => {
        this.confirmationList = response.rows;
      });
    },
    getcheck(){
      listApprovalProcess({operationType:'1',status:'0'}).then(response => {
        this.approvalList = response.rows;
      });
    },
    getaccept(){
      listCheckDic({operationType:'1',status:'0'}).then(response => {//内部
        this.checkDicList = response.rows;
      });
    },
  },

}
</script>


<style scoped lang="scss">
.report{
  padding: 0 15px;
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
  z-index: 999;position: relative;outline: none;
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
    height: 30px;
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




