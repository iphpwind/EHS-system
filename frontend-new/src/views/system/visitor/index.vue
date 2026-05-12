<template>
  <div class="visitor">
		<div class="top">访客预约</div>
		<div class="company">
			<h3>{{dept.deptName}}</h3>
			<h4>欢迎您的来访</h4>
		</div>

		<div class="list" v-if="visitList.length>0">
			<div class="item" v-for="(item, index) in visitList" :key="index">
				<div class="time">
					{{ item.startTime }}
					<span>-</span>
					{{ item.endTime }}
				</div>
				<div class="info">
					<el-row>
						<el-col :span="10">
							<div class="name">{{ item.name }}</div>
							<div class="tel">{{ item.phone }}</div>
						</el-col>
						<el-col :span="4">
							<div class="reason">{{item.reason}}</div>
							<div class="arrow">
								<img src="@/assets/images/visitor/listarrow.png"/>
							</div>
						</el-col>
						<el-col :span="10">
							<div class="name">{{ item.staffName }}</div>
							<div class="tel">{{ item.staffPhone }}</div>
						</el-col>
					</el-row>
				</div>
				<div class="txzbtn" v-if="item.result === '同意'" @click="gotocard(item)">
					<el-icon :size="18"><Postcard /></el-icon> 通行证
				</div>
				<div class="status" v-if="item.result === '未回执'"><!-- 待审核 -->
					<img src="@/assets/images/visitor/status-wait.png"/>
				</div>
				<div class="status" v-if="item.result === '同意'"><!-- 通过 -->
					<img src="@/assets/images/visitor/status-access.png"/>
				</div>
				<div class="status" v-if="item.result === '拒绝'"><!-- 拒绝 -->
					<img src="@/assets/images/visitor/status-refuse.png"/>
				</div>
				<div class="status" v-if="item.result === '已过期'"><!-- 过期 -->
					<img src="@/assets/images/visitor/status-outdate.png"/>
				</div>
			</div>
		</div>
		<div class="tips" v-else>暂无预约记录</div>
		<div class="bottombtn" @click="gotoform">
			访客预约
		</div>
  </div>
</template>

<script>
import {getToken,listVisitReservation} from "@/api/safework/visitReservation";
import {getDeptNoLog} from "@/api/system/dept"
import {parseTime} from "@/utils/ruoyi";
export default {
  data() {
    return {
      visitList: [
				{
					starttime: '2023/08/11 12:00:00',
					endtime: '2023/08/11 18:00:00',
					visitor: '曹鹏',
					visitortel: '18912349876',
					contactor: 'JUSTIN',
					contactortel: '18912349876',
					status: 0,   //待审核0，通过1，拒绝2，过期3
				},{
					starttime: '2023/08/11 12:00:00',
					endtime: '2023/08/11 18:00:00',
					visitor: '曹鹏',
					visitortel: '18912349876',
					contactor: 'JUSTIN',
					contactortel: '18912349876',
					status: 1,   //待审核0，通过1，拒绝2，过期3
				},{
					starttime: '2023/08/11 12:00:00',
					endtime: '2023/08/11 18:00:00',
					visitor: '曹鹏',
					visitortel: '18912349876',
					contactor: 'JUSTIN',
					contactortel: '18912349876',
					status: 2,   //待审核0，通过1，拒绝2，过期3
				},{
					starttime: '2023/08/11 12:00:00',
					endtime: '2023/08/11 18:00:00',
					visitor: '曹鹏',
					visitortel: '18912349876',
					contactor: 'JUSTIN',
					contactortel: '18912349876',
					status: 3,   //待审核0，通过1，拒绝2，过期3
				}
			],
      openid:'o6og3wlOiJ0Oa_CMGwzxXZSUC7bc',
      dept:{},
      enterpriseCode:158
    }
  },

  watch: {

  },
  created() {
    let url = window.location.href;
    let params = new URLSearchParams(new URL(url).search);
    // alert(params)
    let code = params.get('code');
    let company = params.get('company');
    // alert(code)

    // console.log(localStorage.getItem("openid"))

    if (code != null && code != '' && localStorage.getItem("openid") == null){
      this.getOpenid(code)
      this.enterpriseCode = company
      this.getDept(company)
    }
    if ( company != null && company != '' && localStorage.getItem("openid") !=null && localStorage.getItem("openid") != '' ) {
      this.enterpriseCode = company
      this.openid = localStorage.getItem("openid")
      this.getDept(company)
      this.getList()
    }


    let openid = this.$route.query.openid;
    let enterpriseCode = this.$route.query.enterpriseCode;

    if (openid != null && openid != '' && enterpriseCode != null && enterpriseCode != ''){
      this.enterpriseCode = enterpriseCode
      this.openid = openid
      this.getDept(enterpriseCode)
      this.getList()
    }

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
				document.querySelector('.bottombtn').style = 'width: 400px;left: calc(50% - 100px)';
			}
		}, 500)

  },

  methods: {
    getDept(deptId){
      getDeptNoLog(deptId).then(res => {
        this.dept = res.data
      })
    },
    getOpenid(code){
      getToken({code:code}).then(res => {
        this.openid = res
        localStorage.setItem("openid",this.openid)
        this.getList()
      })
    },
    getList(){
      let date = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}');
      listVisitReservation({openid:this.openid}).then(res => {
        this.visitList = res.rows
        this.visitList.forEach(function (arr, index) {
          if(parseTime(arr.endTime, '{y}-{m}-{d} {h}:{i}:{s}') < date){
            arr.result = '已过期'
          }
        })
      })
    },
		gotoform() {
			this.$router.push({
			  path: '/system/visitor/form',
        query:{
          openid:this.openid,
          enterpriseCode:this.enterpriseCode
        }
			})
		},
		gotocard(item) {
			this.$router.push({
			  path: '/system/visitor/card',
        query:{
          openid:this.openid,
          enterpriseCode:this.enterpriseCode,
          id:item.id
        }
			})
		},
  },

}
</script>


<style scoped lang="scss">
.visitor{
	//width: 480px;
  margin: 0 auto;
	background: url("@/assets/images/visitor/homebg.jpg") no-repeat;
	background-size: cover;
	min-height: 100vh;
	position: relative;
	.top{
		text-align: center;
		color: #555;
		padding: 10px 0;
	}
	.company{
		margin: 30px 0 0;
		text-align: center;
		background: url("@/assets/images/visitor/company-bg.png") no-repeat;
		background-size: cover;
		color: #318dda;
		padding: 30px 0 40px;
		h3{
			margin: 0;font-size: 17px;
			font-weight: bold;
		}
		h4{
			margin: 10px 0 0;font-size: 16px;
			color: #fff;background: #10c3fd;
			padding: 10px 30px;
			border-radius: 10px;
			display: inline-block;
		}
	}
	.tips{
		text-align: center;
		margin: 10px 0 0;
		font-size: 14px;color: #666;
	}
	.bottombtn{
		color: #fff;text-align: center;
		background: url("@/assets/images/visitor/btnbg.jpg") repeat-x;
		background-size: auto 100%;
		border-radius: 30px;
		width: 88%;padding: 10px 0;
		position: fixed;
		left: 6%;bottom: 15px;
		cursor: pointer;
	}
	.list{
		padding: 0 15px 60px;
		.item{
			padding: 15px;background: #fff;
			border-radius: 5px;
			margin: 0 0 10px;
			box-shadow: 0 0 10px #98c9f5;
			position: relative;
			.time{
				font-size: 12px;color: #565656;
				padding: 0 0 10px;border-bottom: 1px dashed #eee;
				span{
					vertical-align: middle;
				}
			}
			.info{
				text-align: center;
				padding: 20px 0 10px;
				.name{
					font-size: 16px;color: #333;
				}
				.tel{
					font-size: 14px;color: #565656;
				}
				.reason{
					font-size: 12px;color: #aaa;
					margin: 0 0 5px;
				}
				.arrow{
					img{
						height: 16px;
					}
				}
			}
			.txzbtn{
				width: 32%;margin: 0 auto;
				border-radius: 30px;border: 1px solid #10c3fd;
				text-align: center;
				padding: 5px 0;
				font-size: 14px;color: #333;
				cursor: pointer;
				:deep .el-icon{
					vertical-align: middle;
				}
			}
			.status{
				position: absolute;
				right: 10px;top: 10px;
				width: 15%;
				img{
					width: 100%;
				}
			}
		}
	}
}
</style>




