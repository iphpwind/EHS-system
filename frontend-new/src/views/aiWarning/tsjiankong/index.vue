<template>
  <div class="aijiankong">
    <div class="toptitle">
    	<img src="@/assets/images/screenyxjs/title.png" @load="topimageLoaded"/>
    </div>
		<div class="main" :style="{ height: maniHt}">
			<el-row :gutter="15">
				<el-col :span="14">
					<div class="mainleft">
						<div class="aititle">实时安全预警</div>
						<el-row :gutter="15" class="grid-content">
							<el-col :span="8" v-for="(item,index) in bjxxList" @click="fangda(item)">
								<div class="item">
									<div class="tu" id="tu">
										<canvas class="canvas" :id="'xtcanvas'+index" ref="xtcanvas"></canvas>
										<img :src="item.tp">
									</div>
									<el-row>
										<el-col :span="16">
											<div class="tit">{{item.sbdz}}</div>
											<div class="tit">{{item.createTime}}</div>
										</el-col>
										<el-col :span="8">
											<div class="tit text-right">{{item.lx}}</div>
										</el-col>
									</el-row>
								</div>
							</el-col>
						</el-row>
						<pagination
								v-show="total>0"
								:total="total"
								v-model:page="queryParams.pageNum"
								v-model:limit="queryParams.pageSize"
								@pagination="getList"
								class="mypage"
						/>
					</div>
				</el-col>
				<el-col :span="10">
					<div class="mainright">
						<div class="rightup">
							<div class="aititle">大图显示</div>
							<div @click="datuclick(bjxx.tp)" class="datuxs" id="datuxs">
								<canvas class="dtcanvas" id="dtcanvas" ref="dtcanvas"></canvas>
								<img :src="bjxx.tp">
							</div>
						</div>
						<div class="rightdown">
							<div class="aititle">监控详情</div>
							<div class="info">
								<span>
									<img src="@/assets/images/safework/ai-ico1.png" />
									事件来源：{{bjxx.sbname}}
								</span>
								<span>
									<img src="@/assets/images/safework/ai-ico2.png" />
									事件监控点：{{bjxx.sbdz}}
								</span>
								<span>
									<img src="@/assets/images/safework/ai-ico3.png" />
									事件类型：{{bjxx.lx}}
								</span>
								<span>
									<img src="@/assets/images/safework/ai-ico4.png" />
									事件时间：{{bjxx.createTime}}
								</span>
							</div>
							<button onclick="xiaojing(bjxx.id)" class="xiaojing">消警</button>
						</div>
					</div>


				</el-col>
			</el-row>
		</div>

    <el-dialog v-model="dtopen" width="100%" hight="100%" append-to-body>
      <img style="width: 100%;" :src="dturl">
    </el-dialog>

  </div>
</template>

<script>
import { listBjtsxx } from "@/api/aiWarning/bjtsxx";
import { unAlarm } from "@/api/aiWarning/report";
export default {
  name: "设备运行监视大屏",
  data() {
    return {
			maniHt: '',
      form: {},
      queryParams: {
        pageNum: 1,
        pageSize: 9,
        tenid: 158,
        sbip: null,
        sbtd: null,
        lx: null,
        fstime: null,
        tp: null,
        xzhou: null,
        yzhou: null,
        width: null,
        height: null,
        ifcl: null,
        cljg: null,
      },
      rules: {
      },
      bjxxList: [],
      bjxx:{},
      open : false,
      loading:true,
      showSearch:true,
      ids:[],
      single:true,
      multiple:true,
      total:0,
      title:"",
      dtopen: false,
      dturl: ''
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    setTimeout(() => {
      this.$nextTick(() => {
        this.topimageLoaded();
      });
    },100);

  },
  // watch: {
  //   bjxxList: {
  //     handler: function (newValue, oldValue) {
  //       setTimeout(() => {
  //         this.$nextTick(() => {
  //           this.huakuang(newValue);
  //         });
  //       },10);
  //     },
  //     deep: true, // 深度监听
  //   },
  //   bjxx: {
  //     handler: function (newValue, oldValue) {
  //       setTimeout(() => {
  //         this.$nextTick(() => {
  //           this.dthuakuang(newValue);
  //         });
  //       },10);
  //     },
  //     deep: true, // 深度监听
  //   }
  // },
  methods: {
    getList() {
      listBjtsxx(this.queryParams).then(response => {
        this.bjxxList = response.rows;
        this.bjxx = this.bjxxList[0];
        this.total = response.total;
      });

    },
    huakuang(list){
      var xtgd = document.querySelector('#tu').clientHeight;
      var xtkd = document.querySelector('#tu').clientWidth;
      for(var i = 0;i<9;i++){
        var aa = this.$refs.xtcanvas[i];
        aa.width = xtkd;
        aa.height = xtgd;
        var ctxx = aa.getContext("2d");
        ctxx.beginPath();
        ctxx.clearRect(0,0,xtkd,xtgd)
        ctxx.strokeStyle = 'red';
        ctxx.rect(xtkd*list[i].xzhou,xtgd*list[i].yzhou,xtkd*list[i].width,xtgd*list[i].height);
        ctxx.stroke();
      }
    },
    dthuakuang(list){
      var dtgd = document.querySelector('.datuxs').clientHeight;
      var dtkd = document.querySelector('.datuxs').clientWidth;
      var c = this.$refs.dtcanvas;

      c.height=dtgd;
      c.width=dtkd;
      var ctx = c.getContext("2d");
      console.log(ctx)
      ctx.beginPath();
      ctx.clearRect(0,0,dtkd,dtgd)
      ctx.strokeStyle = 'red';
      ctx.rect(dtkd*list.xzhou,dtgd*list.yzhou,dtkd*list.width,dtgd*list.height);
      ctx.stroke();
    },
    fangda(item){
      this.bjxx = item
    },
    xiaojing(id){
      this.$confirm('是否确认消除此警告', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // this.$message({
        //   type: 'success',
        //   message: '删除成功!'
        // });
        unAlarm(id).then(res => {
          this.getList()
        })


      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });
      });
    },
		topimageLoaded() {
			let topHt = document.querySelector('.toptitle').clientHeight + 'px';
			this.maniHt = 'calc(100% - ' + topHt + ' - 15px)';
		},
    datuclick(url){
      this.dtopen = true
      this.dturl = url
    }
  }
}
</script>
<style scoped lang="scss">
.canvas{
  position: absolute;
}
.dtcanvas{
  position: absolute;
}
.aijiankong{
	background: url('@/assets/images/safework/ai-bg.jpg') no-repeat center;
	background-size: cover;
	height: 100%;

	.toptitle{
			img{width: 100%;display: block;}
	}
	.main{
		padding: 0 20px;
		:deep(.el-row) {
			height: 100%;
			.el-col{
				height: 100%;
			}
		}
		.aititle{
			color: #fff;font-size: 18px;margin: 0 0 10px;
		}
		.mainleft{
			background: url('@/assets/images/safework/ai-bg-1.png') no-repeat;
			background-size: 100% 100%;
			padding: 10px 20px 15px;
			height: 100%;
			.grid-content{
				height: calc(100% - 80px);
				:deep(.el-row) {
					height: auto;
				}
				:deep(.el-col) {
					height: calc(33.33% - 10px)
				}
				img{
					width: 100%;display: block;
					height: 100%;
				}
				.tu{
					height: calc(100% - 50px);
					overflow: hidden;
				}

			}
			.item{
				height: 100%;margin: 0 0 10px;
				border: 4px solid #001f55;
				background: #0e2c56;
				.tit{
					color: #fff;font-size: 14px;margin: 0 0 5px;
					white-space: nowrap;text-overflow: ellipsis;overflow: hidden;
				}
				.text-right{
					text-align: right;
					white-space: nowrap;text-overflow: ellipsis;overflow: hidden;
				}
				:deep(.el-row) {
					padding: 5px 10px 0;
				}
			}
			.mypage{
				background: transparent;
				display: table;width: 100%;
				margin: 0;
				:deep(.el-pagination) {
					position: initial;justify-content: center;
					.el-pagination__total{
						margin: 0;font-size: 12px;color:#fff;
						background: #001f55;border: 1px solid #fff;
						border-radius: 3px 0 0 3px;
						height: 28px;padding: 0 5px;
					}
					.el-pagination__sizes{
						display: none;
					}
					.el-input__inner{
						margin: 0 0 0 -1px;font-size: 12px;color:#fff;
						background: #001f55;border: 1px solid #fff;
						height: 28px;padding: 0 5px 0 10px;
						border-radius: 0;
					}
					.el-input{
						width: 50px;
					}
					.btn-next,.btn-prev{
						margin: 0 0 0 -1px;font-size: 12px;color:#fff;
						background: #001f55;border: 1px solid #fff;
						height: 28px;padding: 0 5px 0 10px;
						border-radius: 0;
					}
					.el-pager li{
						margin: 0 0 0 -1px;font-size: 12px;color:#fff;
						background: #001f55;border: 1px solid #fff;
						height: 28px;padding: 0 5px 0 10px;
						border-radius: 0;font-weight: normal;
					}
					.el-pager li.active{
						background: #4a87dc;
					}
					.el-pagination__jump{
						height: 28px;color: #fff;font-size: 12px;
						.el-input__inner{
							margin-top: 2px;
						}

					}
				}
			}
		}
		.mainright{
			height: 100%;
			.rightup{
				background: url('@/assets/images/safework/ai-bg-2.png') no-repeat;
				background-size: 100% 100%;
				padding: 10px 20px 15px;
				height: 62%;margin: 0 0 20px;
				.datuxs{
					height: calc(100% - 40px);
				}
				.datuxs img{
					width: 100%;height: 100%;display: block;
				}
			}
			.rightdown{
				height: calc(38% - 20px);
				background: url('@/assets/images/safework/ai-bg-3.png') no-repeat;
				background-size: 100% 100%;
				padding: 10px 20px 15px;
				.info{
					span{
						display: block;padding: 6px 0;color: #fff;
						font-size: 14px;
					}
					img{
						vertical-align: middle;margin-right: 5px;
					}
				}
				.xiaojing{
					background: #001f55;cursor: pointer;
					border: 1px solid #fff;border-radius: 0;color: #fff;
					padding: 5px 50px;margin: 10px 0 0;
				}
				.xiaojing:hover{
					background: #4a87dc;
				}
			}
		}
	}
}

</style>
