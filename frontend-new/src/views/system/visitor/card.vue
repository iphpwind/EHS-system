<template>
  <div class="visitor">
		<div class="top">
			<el-icon :size="18" @click="goback"><ArrowLeft /></el-icon>
			通行证
		</div>
		<div class="toptitle">
			<img src="@/assets/images/visitor/card-title.png" />
		</div>
		<div class="mainbox">
			<div class="cardtop">
				<el-row>
					<el-col :span="18">
						<div class="bianhao">编号：{{id.slice(14)}}</div>
						<div class="name">
							{{form.name}} <span>访客（{{form.sex}}）</span>
						</div>
						<div class="tel">{{form.phone}}</div>
					</el-col>
					<el-col :span="6">
						<div class="personpic">
							<img src="@/assets/images/visitor/cardperson.png"/>
						</div>
					</el-col>
				</el-row>
			</div>
			<div class="cardbot">
				<div class="baseinfo">
					<el-row>
						<el-col :span="8">
							<h4>所属单位：</h4>
						</el-col>
						<el-col :span="16">
							<h5>{{form.company}}</h5>
						</el-col>
						<el-col :span="8">
							<h4>证件号码：</h4>
						</el-col>
						<el-col :span="16">
							<h5>{{form.credentialNum}}</h5>
						</el-col>
					</el-row>
				</div>
				<div class="detailinfo">
					<el-row>
						<el-col :span="8">
							<h4>被访人姓名</h4>
						</el-col>
						<el-col :span="16">
							<h5>{{form.staffName}}</h5>
						</el-col>
						<el-col :span="8">
							<h4>被访人手机号</h4>
						</el-col>
						<el-col :span="16">
							<h5>{{form.staffPhone}}</h5>
						</el-col>
						<el-col :span="8">
							<h4>预约开始时间</h4>
						</el-col>
						<el-col :span="16">
							<h5>{{form.startTime}}</h5>
						</el-col>
						<el-col :span="8">
							<h4>预约结束时间</h4>
						</el-col>
						<el-col :span="16">
							<h5>{{form.createTime}}</h5>
						</el-col>
						<el-col :span="8">
							<h4>来访事由</h4>
						</el-col>
						<el-col :span="16">
							<h5>{{form.reason}}</h5>
						</el-col>
						<el-col :span="8">
							<h4>车牌号</h4>
						</el-col>
						<el-col :span="16">
							<h5>{{form.carNum}}</h5>
						</el-col>
					</el-row>
				</div>
			</div>
		</div>
		<div class="tips">
			更新于 {{date}}
			<el-icon @click="refreshTime"><Refresh /></el-icon>
<!--      <i class="el-icon-refresh"></i>-->
      <span style="color: red" v-if="outShow">已过期</span>
		</div>
		<div class="passpic">
			<img src="@/assets/images/visitor/card-pass.png"/>
		</div>
  </div>
</template>

<script>
import {getVisitReservation} from "@/api/safework/visitReservation"
import {parseTime} from "@/utils/ruoyi";
export default {
  data() {
    return {
      openid:null,
      enterpriseCode:null,
      id:null,
      form:{},
      date:'',
      outShow: false
    }
  },

  watch: {

  },
  created() {
    this.date = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}');
    this.openid = this.$route.query.openid;
    this.enterpriseCode = this.$route.query.enterpriseCode;
    this.id = this.$route.query.id
    this.getInfo()
  },

  mounted: function () {
		setTimeout(() => {
		  //判断，若手机端，去掉顶部和侧边栏
		  var windowWidth = document.body.clientWidth;
		  if(windowWidth<1200){
		  	document.querySelector('.sidebar-container').style = "width:0!important";
		  	document.querySelector('.main-container').style = "margin-left:0!important";
		  	document.querySelector('.app-main').style.minHeight = '100vh';
		  	document.querySelector('.visitor').style.width = '100%';
		  	document.querySelector('.navbar').style.display = 'none';
		  	document.querySelector('.tags-view-container').style.display = 'none';
		  }else{
				document.querySelector('.visitor').style.minHeight = '100%';
			}
		}, 500)

  },

  methods: {
    refreshTime() {

      console.log('ppppppp')
      this.date = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}');
      if (this.date > parseTime(this.form.endTime, '{y}-{m}-{d} {h}:{i}:{s}')){
        this.outShow = true
      }
    },

    getInfo() {
      getVisitReservation(this.id).then(res => {
        this.form = res.data
        if (this.date > parseTime(this.form.endTime, '{y}-{m}-{d} {h}:{i}:{s}')){
          this.outShow = true
        }
      })
    },

		goback() {
			this.$router.push({
			  path: '/system/visitor/index',
        query:{
          openid: this.openid,
          enterpriseCode: this.enterpriseCode
        }
      })
		}
  },

}
</script>


<style scoped lang="scss">
.visitor{
	//width: 480px;
  margin: 0 auto;
	background: #e6f0fe;
	min-height: 100vh;
	position: relative;
	padding: 0 0 100px;
	.top{
		text-align: center;
		color: #555;
		padding: 10px 0;
		background: #fff;
		position: relative;
		:deep(.el-icon) {
			position: absolute;left: 10px;top: 10px;
			cursor: pointer;
		}
	}
	.toptitle{
		img{
			width: 100%;display: block
		}
	}
	.mainbox{
		margin: 0 10px;
		background: #fff;
		position: relative;
		top: -80px;z-index: 1;
		box-shadow: 0 3px 10px #b9c8de;
		border-radius: 3px;
		.cardtop{
			background: url("@/assets/images/visitor/company-bg.png") no-repeat top;
			background-size: 100%;
			padding: 10px 20px 15px;
			position: relative;
			border-radius: 3px 3px 0 0;
			.bianhao{
				font-size: 12px;color: #70a9d6;
				padding: 6px 12px;
				background: rgba(255, 255, 255, 0.4);
				border-radius: 30px;display: inline-block;
				margin: 0 0 15px;
			}
			.name{
				font-size: 18px;color: #3a7be4;font-weight: bold;
				margin: 0 0 15px;
				span{
					font-size: 14px;color: #555;font-weight: normal;
					margin-left: 10px;
				}
			}
			.tel{
				color: #555;font-size: 14px;
			}
			.personpic{
				img{
					width: 100%;
				}
			}
		}
		.cardtop::before,.cardtop::after{
			content: '';width: 7px;height: 15px;
			background: #b9c8de;
			position: absolute;
			opacity: 0.6;
		}
		.cardtop::before{
			left: 0;bottom: -7px;
			border-radius: 0 50px 50px 0;
		}
		.cardtop::after{
			right: 0;bottom: -7px;
			border-radius: 50px 0 0 50px;
		}
		.cardbot{
			padding: 15px 20px;
			position: relative;
			h4{
				margin: 0;color: #666;
				font-size: 14px;
				padding: 10px 0;
				white-space: nowrap;
			}
			h5{
				margin: 0;padding: 6px 0;
				font-size: 14px;
				text-align: right;
				white-space: nowrap;
			}
			.detailinfo{
				padding: 5px 15px;margin: 10px 0 0;
				background: #f8fbff;
				border-radius: 10px;
			}
		}
		.cardbot::before{
			content: '';
			width: calc(100% - 30px);
			height: 1px;border-top: 1px dashed #eee;
			position: absolute;top: 0;left: 15px;
		}
	}
	.tips{
		text-align: center;font-size: 12px;color: #999;
		padding: 15px 0 0;
		position: relative;top: -80px;
	}
	.passpic{
		position: absolute;bottom: 0;left: 0;
		img{
			width: 100%;display: block;
		}
	}
}

</style>




