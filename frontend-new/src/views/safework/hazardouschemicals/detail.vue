<template>
  <div class="report" v-loading="loading">
		<button v-print="'#myprint'" class="topbtn">打印</button>
		<div class="tit">危化品告知卡详情 </div>
		<div class="reportbox" id="myprint">
      
      <div :class="[level,form.riskLevel==='一级'?'red':form.riskLevel==='二级'?'orange':form.riskLevel==='三级'?'yellow':'bule']">
        <div class="tbtitle">
					有毒物品，对身体有害，请注意防护
				</div>
				<div class="tbitem">
					<h4>{{form.title}}</h4>
					{{form.chemicalReaction}}
					<img :src="form.iconImg">
					{{form.iconText}}
				</div>
				<div class="tbitem">
					<h4>健康危害</h4>
					{{form.hazardInfo}}
				</div>
				<div class="tbitem">
					<h4>理化特性</h4>
					{{form.characteristic}}
				</div>
        <div class="tbitem">
          <h4>急救处理</h4>
          {{form.firstAid}}
        </div>
        <div class="tbitem">
          <h4>应急处理</h4>
          {{form.emergency}}
        </div>
        <div class="tbitem">
          <h4>注意防护</h4>
          <span v-for="item in imgList" class="pic">
            <img style="width: 50px" :src="item">
          </span>
        </div>
      </div>
		</div>
  </div>
</template>

<script>
import { getHazardouschemicals } from "@/api/safework/hazardouschemicals";


export default {
  name: "应知应急卡岗位",
  data() {
    return {
      Id:1,
      form:{},
      imgList:[],
      sign:{}
    }
  },

  watch: {

  },
  created() {
    this.Id = this.$route.query.Id;
    this.getDetail()
  },

  mounted: function () {
  },

  methods: {
    getDetail(){
      getHazardouschemicals(this.Id).then(response => {
        this.form = response.data;
        let img = this.form.protectiveSigns.split(",")
        img.forEach((j, index) => {
          let aa = '/src/assets/images/post/'+j+'.png';
          this.imgList.push(aa)
        })
      });
    },



  },

}
</script>


<style scoped lang="scss">

.red{
  background-color: red!important;
  -webkit-print-color-adjust: exact;
	padding: 30px;
}
.orange{
  background-color: #dac011!important;
  -webkit-print-color-adjust: exact;
	padding: 30px;
}
.yellow{
  background-color: orange!important;
  -webkit-print-color-adjust: exact;
	padding: 30px;
}
.bule{
  background-color: #0067c6!important;
  -webkit-print-color-adjust: exact;
	padding: 30px;
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
.tbtitle{
	font-size: 20px;font-weight: bold;
	margin: 0 0 20px;text-align: center;
}
.tbitem{
	background: rgba(255, 255, 255, 0.8);
	border-radius: 5px;margin: 0 0 15px;
	padding: 15px;
	h4{
		padding-left: 15px;border-left: 5px solid #09bec5;
		margin: 0 0 15px;font-size: 18px;
	}
	.pic{
		margin-right: 10px;
	}
}
@media print {

}
</style>




