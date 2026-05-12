<template>
  <div class="report" v-loading="loading">
    <button v-print="'#myprint1'" class="topbtn">打印</button>
    <div class="reportbox" id="myprint1">
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
          <td colspan="6"></td>
          <td colspan="4">车间项目负责人</td>
          <td colspan="6"></td>
        </tr>
        <tr>
          <td colspan="4">作业内容</td>
          <td colspan="16"></td>
        </tr>
        <tr>
          <td colspan="4">作业时间</td>
          <td colspan="16"></td>
        </tr>
        <tr>
          <td colspan="4">参与作业人员</td>
          <td colspan="16"></td>
        </tr>
        <tr>
          <td colspan="16">基本要求: {{form.basicInformation}}</td>
          <td colspan="4"></td>
        </tr>
        <tr>
          <td colspan="4" rowspan="6">安全交底和风险告知内容</td>
          <td colspan="12">作业许可范围及作业环境：{{form.scopeEnvironment}}</td>
          <td colspan="4"></td>
        </tr>
        <tr>
          <td colspan="12">作业风险：{{form.operationRisk}}</td>
          <td colspan="4"></td>
        </tr>
        <tr>
          <td colspan="12">防范措施（工艺、设备、个体防护等）：{{form.preventive}}</td>
          <td colspan="4"></td>
        </tr>
        <tr>
          <td colspan="12">应急措施：{{form.emergency}}</td>
          <td colspan="4"></td>
        </tr>
        <tr>
          <td colspan="12">其他注意事项：{{form.remark}}</td>
          <td colspan="4"></td>
        </tr>
        <tr>
          <td colspan="16">企业负责人签字:</td>
        </tr>
        <tr>
          <td colspan="12" class="noborder-rt noborder-bt"></td>
          <td colspan="8" class="noborder-lf noborder-bt">作业单位现场负责人签字：</td>
        </tr>
        <tr>
          <td colspan="12" class="noborder-rt noborder-tp"></td>
          <td colspan="8" class="noborder-lf noborder-tp">时间：</td>
        </tr>

      </table>
    </div>
  </div>
</template>

<script>
import { listSafetyDisclosureSheetDic } from "@/api/safework/safetyDisclosureSheetDic";
export default {
  name: "安全交底和风险告知确认卡",
  data() {
    return {
      title: '安全交底和风险告知确认卡',
      attAddress:[],
      Camerashow: false,
      form:{
      },
    }
  },

  created() {
    this.getList();
  },

  mounted: function () {
  },

  methods: {
    getList(){
      listSafetyDisclosureSheetDic({status:'0', operationType:"7"}).then(response => {
				if(response.rows.length>0){
					this.form = response.rows[0];
				}
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




