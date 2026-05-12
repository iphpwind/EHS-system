<template>
  <div class="safework">
		<div class="zhanwei">
			<img src="@/assets/images/safework/toptit.png"/>
		</div>
		<div class="maindata">
			<el-row :gutter="15">
				<el-col :span="4" class="item">
					<div class="box">
						<div class="middle">
						<img src="@/assets/images/safework/data-ico1.png"/>
						<h4>系统管理</h4>
						</div>
					</div>
				</el-col>
				<el-col :span="4" class="item">
					<div class="box">
						<div class="middle">
						<img src="@/assets/images/safework/data-ico2.png"/>
						<h4>双重预防机制管理</h4>
						</div>
					</div>
				</el-col>
				<el-col :span="4" class="item">
					<div class="box">
						<div class="middle">
						<img src="@/assets/images/safework/data-ico3.png"/>
						<h4>人员在岗在位管理</h4>
						</div>
					</div>
				</el-col>
				<el-col :span="4" class="item">
					<div class="box">
						<div class="middle">
						<img src="@/assets/images/safework/data-ico4.png"/>
						<h4>特殊作业</h4>
						</div>
					</div> 
				</el-col>
				<el-col :span="4" class="item">
					<div class="box">
						<div class="middle">
						<img src="@/assets/images/safework/data-ico5.png"/>
						<h4>AI智能分析</h4>
						</div>
					</div>
				</el-col>
				<el-col :span="4" class="item">
					<div class="box">
						<div class="middle">
						<img src="@/assets/images/safework/data-ico6.png"/>
						<h4>安全生产全要素管理</h4>
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="floor">
			<el-row :gutter="15">
				<el-col :span="14">
					<el-card :body-style="{ padding: '10px' }">
					  <div class="clearfix header">
					    <span class="card-tit">用户信息</span>
					    <div class="gailan-right">更多</div>
					  </div>
						<div class="userinfoup">
							<el-row class="row">
								<el-col :span="4">
									<img src="@/assets/images/safework/person.png" class="personimg"/>
								</el-col>
								<el-col :span="20" class="inforight">
									<h3>
										张三
										<img src="@/assets/images/safework/boy.png" />
										<img src="@/assets/images/safework/girl.png" />
									</h3>
									<div class="infoitem">
										<span>岗位：</span>前工序操作工
									</div>
									<div class="infoitem dangan">
										<img src="@/assets/images/safework/docu.png"/>
										个人档案
									</div>
									<div class="infoitem gonghao">
										<span>工号：</span>0092
									</div>
								</el-col>
							</el-row>
						</div>
						<div class="userinfodown">
							<el-row class="row">
								<el-col :span="12">
									<div class="infoitem">
										<span>所属组织：</span>{{ enterpriseInfo.name || '未配置' }}
									</div>
								</el-col>
								<el-col :span="12">
									<div class="infoitem">
										<span>手机号码：</span>13355358420
									</div>
								</el-col>
								<el-col :span="12">
									<div class="infoitem">
										<span>所属部门：</span>生产部
									</div>
								</el-col>
								<el-col :span="12">
									<div class="infoitem">
										<span>定位卡ID：</span>9287178
									</div>
								</el-col>
							</el-row>
						</div>
					</el-card>
				</el-col>
				<el-col :span="10">
					<el-card :body-style="{ padding: '10px' }">
					  <div class="clearfix header">
					    <span class="card-tit">我的消息</span>
					    <div class="gailan-right">更多</div>
					  </div>
						<div class="mymessage">
							<el-table :data="mymsgList" :show-header="false"
							height="100%" 
							style="width: 100%">
								<el-table-column prop="date" label="Date" width="50">
									<img src="@/assets/images/safework/warn.png" />
								</el-table-column>
								<el-table-column prop="time" label="报警时间" />
								<el-table-column prop="type" label="报警类型" width="180" />
							</el-table>
						</div>
					</el-card>
				</el-col>
			</el-row>
		</div>
  </div>
</template>

<script>

export default {
  name: "安全生产首页",
  data() {
    return {
			mymsgList: [
				{
					time: '2022-05-17  12:23:36',
					type: '人员报警'
				},
				{
					time: '2022-05-17  12:23:36',
					type: '人员报警'
				},
				{
					time: '2022-05-17  12:23:36',
					type: '人员报警'
				},
				{
					time: '2022-05-17  12:23:36',
					type: '人员报警'
				},
				{
					time: '2022-05-17  12:23:36',
					type: '人员报警'
				},
				{
					time: '2022-05-17  12:23:36',
					type: '人员报警'
				},
				{
					time: '2022-05-17  12:23:36',
					type: '人员报警'
				},
				{
					time: '2022-05-17  12:23:36',
					type: '人员报警'
				},
				{
					time: '2022-05-17  12:23:36',
					type: '人员报警'
				},
			]
    }
  },

  watch: {

  },
  created() {

  },

  mounted: function () {

  },

  methods: {

  },

}
</script>


<style scoped lang="scss">
.safework {
  background: url('@/assets/images/safework/safework-bg.jpg') no-repeat top;
	background-size: 100%;
	height: calc(100vh - 84px);
	padding: 0 20px;
	
	.el-row, .el-col{
		height: 100%;
	}
	
	.zhanwei{
		height: 24%;width: 100%;
		img{
			height: 100%;width: auto;
		}
	}
	.maindata{
		height: 22%;margin: 0 0 20px;
		.item{
			text-align: center;
			.box{
				height: 100%;cursor: pointer;
				background-size: 100% 100% !important;
				background: url('@/assets/images/safework/data-bg1.png') no-repeat;
				box-shadow: 0 0 10px rgba(0,0,0,.05);
				border-radius: 10px;
				.middle{
					position: relative;
					top: 48%;
					transform: translateY(-50%);
				}
				h4{
					padding: 15px 0;position: relative;margin: 0;
				}
				h4::after{
					content: '';width: 60px;height: 4px;
					position: absolute;left: calc(50% - 30px);
					top: 100%;background: #c1dbee;
					border-radius: 5px;
				}
			}
		}
		.item:nth-child(2) .box{
			background: url('@/assets/images/safework/data-bg2.png') no-repeat;
		}
		.item:nth-child(3) .box{
			background: url('@/assets/images/safework/data-bg3.png') no-repeat;
		}
		.item:nth-child(4) .box{
			background: url('@/assets/images/safework/data-bg4.png') no-repeat;
		}
		.item:nth-child(5) .box{
			background: url('@/assets/images/safework/data-bg5.png') no-repeat;
		}
		.item:nth-child(6) .box{
			background: url('@/assets/images/safework/data-bg6.png') no-repeat;
		}
		.item:nth-child(2) .box h4::after{background: #e4eefd;}
		.item:nth-child(3) .box h4::after{background: #d1f3f7;}
		.item:nth-child(4) .box h4::after{background: #fde4af;}
		.item:nth-child(5) .box h4::after{background: #e8c6f1;}
		.item:nth-child(6) .box h4::after{background: #fbcdc6;}
	}
	.floor{
		height: calc(54% - 40px);
		:deep(.el-card) {
			height: 100%;
			.el-card__body{
				height: 100%;
			}
		}
		.header{
			padding: 0 0 10px;border-bottom: 1px solid #f0f0f0;
		}
		.card-tit{
			padding-left: 10px;border-left: 5px solid #09bec5;font-size: 18px;
		}
		.gailan-right{
			display: inline-block;margin: 2px 0 0;
			float: right;cursor: pointer;
			font-size: 16px;
		}
		.mymessage{
			height: calc(100% - 40px);padding: 10px 0 0;
			img{
				vertical-align: middle;
			}
			:deep(.el-table) {
				td.el-table__cell{
					border: 0;padding: 12px 0;
				}
				.el-table__inner-wrapper::before{
					display: none;
				}
			}
		}
		.userinfoup{
			padding: 0 20px;height: 50%;
			img{
				vertical-align: middle;
			}
			.row{
				height: auto;
				position: relative;
				top: 50%;
				transform: translateY(-50%);
			}
			.personimg{
				max-width: 100%;
			}
			.inforight{
				padding-left: 25px;
				h3{
					margin: 10px 0 20px;
				}
				.dangan{
					color: #09bec5;margin-left: 20px;
					cursor: pointer;
				}
				.gonghao{
					display: block;
				}
			}
		}
		.infoitem{
			display: inline-block;margin: 0 0 10px;
			span{
				color: #a1aab7;
			}
		}
		.userinfodown{
			height: 30%;padding: 0 20px;
			.row{
				height: auto;
				position: relative;
				top: 50%;
				transform: translateY(-50%);
			}
			.infoitem{
				display: block;margin: 0 0 15px;
			}
		}
	}
}

</style>




