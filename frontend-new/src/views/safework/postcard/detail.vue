<template>
  <div class="report" v-loading="loading">
		<button v-print="'#myprint'" class="topbtn">打印</button>

		<div class="reportbox" id="myprint">
			<div class="tit">岗位安全风险告知卡</div>
      <table :class="[level,form.riskLevel==='一级'?'red':form.riskLevel==='二级'?'orange':form.riskLevel==='三级'?'yellow':'bule']">
        <tr>
          <td colspan="4">岗位安全风险告知卡</td>
        </tr>
        <tr>
          <td>作业名称</td>
          <td colspan="3">{{form.name}}</td>
        </tr>
        <tr>
          <td>作业对象</td>
          <td>{{form.workObject}}</td>
          <td>危险等级</td>
          <td>{{form.riskLevel}}</td>
        </tr>
        <tr>
          <td>主要危害因素</td>
          <td colspan="3">{{form.mainHazardFactors}}</td>
        </tr>
        <tr>
          <td>易发生事故类型</td>
          <td colspan="3">{{form.accidentProne}}</td>
        </tr>
        <tr>
          <td>岗位操作注意事项</td>
          <td colspan="3">{{form.attention}}</td>
        </tr>
        <tr>
          <td>须穿戴的劳动防护用品</td>
          <td colspan="3">{{form.protectiveEquipment}}</td>
        </tr>
        <tr>
          <td>应急处置措施</td>
          <td colspan="3">{{form.emergencyMeasure}}</td>
        </tr>
        <tr>
          <td>安全警示标志</td>
          <td colspan="3">
            <div v-for="item in imgList" class="jingshi">
              <img style="width: 50px" :src="item">
            </div>
          </td>
        </tr>
        <tr>
          <td>告知人：(签名)</td>
          <td><img :src="form.sign" class="qianming"></td>
          <td>接受人：(签名)</td>
          <td><img :src="sign.sign" class="qianming"></td>
        </tr>
      </table>
		</div>
  </div>
</template>

<script>
import { getPostcard } from "@/api/safework/postcard";
import { getPostsign } from "@/api/safework/postsign";

export default {
  name: "应知应急卡岗位",
  data() {
    return {
      postId:1,
      signId:1,
      form:{},
      imgList:[],
      sign:{}
    }
  },

  watch: {

  },
  created() {
    this.postId = this.$route.query.postId;
    this.signId = this.$route.query.signId;
    this.getDetail()
  },

  mounted: function () {
  },

  methods: {
    getDetail(){
      getPostcard(this.postId).then(response => {
        this.form = response.data;
        let img = this.form.safetyWarningSigns.split(",")
        img.forEach((j, index) => {
          let aa = 'http://localhost:3001/post/'+j+'.png';
          this.imgList.push(aa)
        })
      });
      getPostsign(this.signId).then(res => {
        this.sign = res.data;
      })
    },



  },

}
</script>


<style scoped lang="scss">
.red{
  background-color: red!important;
  -webkit-print-color-adjust: exact;
}
.orange{
  background-color: #dac011!important;
  -webkit-print-color-adjust: exact;
}
.yellow{
  background-color: orange!important;
  -webkit-print-color-adjust: exact;
}
.bule{
  background-color: #0067c6!important;
  -webkit-print-color-adjust: exact;
}
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
			z-index: 999;position: relative;
		}
.reportbox table{
	border-collapse: collapse;
	border: 1px solid #aaa;
	td{
		border: 1px solid #aaa;padding: 5px 10px;
		line-height: 2;
	}
	tr td:first-child{
		width:200px;
	}
	.jingshi{
		display: inline-block;
	}
	.qianming{
		height: 30px;
	}
}
@media print {

}
</style>




