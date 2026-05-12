<template>
	<div class="xunjiantj">

		<!-- 筛选 -->
		<el-card class="box-card">
			<template #header>
				<div class="card-header">
					<span>巡检统计</span>
				</div>
			</template>
			<div class="seachform">
				<el-form :model="form">
					<el-row :gutter="20">
						<el-col :span="5">
							<el-form-item label="单元名称">
								<el-input v-model="queryParams.sectionName" placeholder="请输入" />
							</el-form-item>
						</el-col>
						<el-col :span="8">
							<el-form-item label="日期">
								<el-row :gutter="0">
									<el-col :span="11">
										<el-date-picker
											v-model="queryParams.beginDay"
											value-format="YYYY-MM-DD"
											type="date"
											style="width: 100%"
										/>
									</el-col>
									<el-col :span="2" class="text-center" style="padding: 0;">
										<span style="color: #ccc;line-height: 30px;display: block;">—</span>
									</el-col>
									<el-col :span="11">
										<el-date-picker
											v-model="queryParams.endDay"
											value-format="YYYY-MM-DD"
											style="width: 100%"
										/>
									</el-col>
								</el-row>
							</el-form-item>
						</el-col>
						<el-col :span="11">
							<el-form-item>
								<el-button class="checkbtn" @click="check">查询</el-button>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<div></div>
		</el-card>

		<!-- 数据总览 -->
		<div class="databox">
			<el-row :gutter="10">
				<el-col :span="6">
					<div class="dataitem">
						<el-col :span="8">
							<img src="@/assets/images/xunjian/xunjian-tj-ico1.png"/>
						</el-col>
						<el-col :span="16">
							<h3 style="color: #3a8fea;">{{siteAllCnt}}</h3>
							<h4>巡检点总数</h4>
						</el-col>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="dataitem">
						<el-col :span="8">
							<img src="@/assets/images/xunjian/xunjian-tj-ico3.png"/>
						</el-col>
						<el-col :span="16">
							<h3 style="color: #0fd5ad;">{{runningSiteAllCnt}}</h3>
							<h4>运行中巡检点总数</h4>
						</el-col>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="dataitem">
						<el-col :span="8">
							<img src="@/assets/images/xunjian/xunjian-tj-ico2.png"/>
						</el-col>
						<el-col :span="16">
							<h3 style="color: #ffae00;">{{missAllCnt}}</h3>
							<h4>漏检总数</h4>
						</el-col>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="dataitem">
						<el-col :span="8">
							<img src="@/assets/images/xunjian/xunjian-tj-ico4.png"/>
						</el-col>
						<el-col :span="16">
							<h3 style="color: #f43900;">{{faultAllCnt}}</h3>
							<h4>异常总数</h4>
						</el-col>
					</div>
				</el-col>
			</el-row>
		</div>

		<!-- 表格 -->
		<div class="table">
			<el-table
			:data="tableData"
			stripe="true"
			border
			style="width: 100%"
			v-loading="loading"
			>
				<el-table-column prop="sectionName" sortable label="单元名称"/>
				<el-table-column prop="siteCnt" sortable label="巡检点总数"/>
				<el-table-column prop="runningSiteCnt" sortable label="运行中巡检点点数" />
				<el-table-column prop="missCnt" sortable label="漏检点数" />
				<el-table-column prop="faultCnt" sortable label="异常点数" />
				<el-table-column label="操作" width="200" fixed="right">
					<template #default="scope">
						<el-button @click="handleClick(scope.row)" class="handlebtn">查看详情</el-button>
					</template>
				</el-table-column>
			</el-table>

			<!-- 页码 -->
			<div class="pages">
				<el-pagination
					background
					:total="total"
					v-model:page="queryParams.pageNum"
					v-model:limit="queryParams.pageSize"
					@@pagination="getList"
					ref="page"
				/>
				<el-button @click="confirm" class="pagebtn">确定</el-button>
			</div>
		</div>

		<!-- 巡检详情弹出 -->
		<div class="detailtc">
			<el-dialog
				v-model="dialogVisible"
				:show-close="showClose"
				width="calc(100% - 200px)"
				:modal="mask"
				:close-on-click-modal="maskclose"
			>
				<!-- 筛选 -->
				<el-card class="box-card">
					<template #header>
						<div class="card-header">
							<span>巡检统计</span>
							<el-button class="btn" @click="dialogVisible = false">
								<el-icon style="margin-right: 5px;"><Back /></el-icon>返回
							</el-button>
						</div>
					</template>
					<div class="seachform">
						<el-form :model="queryParams2">
							<el-row :gutter="20">
								<el-col :span="5">
									<el-form-item label="巡检点名称">
										<el-input v-model="queryParams2.siteName" placeholder="请输入" />
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="日期">
										<el-row :gutter="0">
											<el-col :span="11">
												<el-date-picker
													v-model="queryParams2.beginDay"
													value-format="YYYY-MM-DD"
													type="date"
													style="width: 100%"
												/>
											</el-col>
											<el-col :span="2" class="text-center" style="padding: 0;">
												<span style="color: #ccc;line-height: 30px;display: block;">—</span>
											</el-col>
											<el-col :span="11">
												<el-date-picker
													v-model="queryParams2.endDay"
													value-format="YYYY-MM-DD"
													style="width: 100%"
												/>
											</el-col>
										</el-row>
									</el-form-item>
								</el-col>
								<el-col :span="11">
									<el-form-item>
										<el-button class="checkbtn" @click="detailcheck">查询</el-button>
									</el-form-item>
								</el-col>
							</el-row>
						</el-form>
					</div>
					<div></div>
				</el-card>

				<!-- 表格 -->
				<div class="table">
					<el-table
					:data="tableData2"
					stripe="true"
					border
					style="width: 100%"
					v-loading="loading2"
					>
						<el-table-column prop="siteId" sortable label="巡检点编号"/>
						<el-table-column prop="siteName" sortable label="巡检点名称"/>
						<el-table-column prop="checkedCnt" sortable label="已巡检次数" />
						<el-table-column prop="missCnt" sortable label="漏检数" />
						<el-table-column prop="faultCnt" sortable label="异常总数" />
					</el-table>

					<!-- 页码 -->
					<div class="pages">
						<el-pagination
						background
							:total="total2"
							v-model:page="queryParams2.pageNum"
							v-model:limit="queryParams2.pageSize"
							@@pagination="getList2"
							ref="detailpage"
						/>
						<el-button @click="detailconfirm" class="pagebtn">确定</el-button>
					</div>
				</div>
			</el-dialog>
		</div>

	</div>

</template>

<script>
	import { listStatistics, listStatisticsSite } from "@/api/unitManage/statistics";
	import { reactive } from 'vue'
	import { ref } from 'vue'

	export default {
		name: "巡检统计",
		data() {
		  return {
				loading: true,
				loading2: true,
				currentPage: 1,
				total: 0,
				total2: 0,
				detailcurrentPage: 1,
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					sectionName: '',
					beginDay: '',
					endDay: ''
				},
				queryParams2: {
					pageNum: 1,
					pageSize: 10,
					sectionId: null,
					siteName: '',
					beginDay: '',
					endDay: ''
				},
				siteAllCnt:0,
				runningSiteAllCnt:0,
				faultAllCnt:0,
				missAllCnt:0,
				detailform : reactive({
				  name: '',
				  date1: '',
				  date2: '',
				}),
				tableData : [],
				dialogVisible: false,
				mask: false,
				maskclose: false,
				showClose: false,
				tableData2 : [],
			}
		},
		mounted() {
			this.getList();
			document.getElementsByClassName('el-pagination__jump')[0].childNodes[0].nodeValue = '跳转至'
			document.getElementsByClassName('el-pagination__jump')[0].childNodes[2].nodeValue = ''
		},
		methods: {
			handleClick(row) {
				this.dialogVisible = true;
				this.queryParams2.pageNum = 1;
				this.queryParams2.sectionId = row.sectionId;
				this.getList2();
			},
			handleCurrentChange(number) {  //页码切换
				console.log(number)
			},
			confirm() {  //跳转页码点击确认
				let t_value = this.$refs.page.$el.lastElementChild.lastElementChild.childNodes[1].value;
	　　　if(t_value==""){
　　　　　this.$Message.info('请填写页数');
　　　　　return false;
	　　　}
	　　　if(t_value>Math.ceil(this.total/this.num)){
	　　　　this.$Message.info('超过总页数，无法跳转');
	　　　　this.$refs.page.$el.lastElementChild.lastElementChild.childNodes[1].value = this.current;
	　　　　return false;
	　　　}
	　　　this.current = parseInt(t_value);
			},
			detailhandleCurrentChange(number) {
				console.log(number)
			},
			detailconfirm() {
				let t_value = this.$refs.detailpage.$el.lastElementChild.lastElementChild.childNodes[1].value;
	　　　if(t_value==""){
　　　　　this.$Message.info('请填写页数');
　　　　　return false;
	　　　}
	　　　if(t_value>Math.ceil(this.total/this.num)){
	　　　　this.$Message.info('超过总页数，无法跳转');
	　　　　this.$refs.detailpage.$el.lastElementChild.lastElementChild.childNodes[1].value = this.current;
	　　　　return false;
	　　　}
	　　　this.current = parseInt(t_value);
			},
			check(){
				this.queryParams.pageNum = 1;
				this.getList();
			},
			getList(){
				this.loading = true;
				this.siteAllCnt = 0;
				this.runningSiteAllCnt = 0;
				this.faultAllCnt = 0;
				this.missAllCnt = 0;
				listStatistics(this.queryParams).then(response => {
				  this.tableData = response.rows;
				  this.total = response.total;
				  this.loading = false;
					if(this.tableData.length > 0){
						for(var data of this.tableData){
							this.siteAllCnt += data.siteCnt;
							this.runningSiteAllCnt += data.runningSiteCnt;
							this.faultAllCnt += data.faultCnt;
							this.missAllCnt += data.missCnt;
						}
					}
				});
			},
			detailcheck(){
				this.queryParams2.pageNum = 1;
				this.getList2();
			},
			getList2(){
				this.loading2 = true;
				listStatisticsSite(this.queryParams2).then(response => {
				  this.tableData2 = response.rows;
				  this.total2 = response.total;
				  this.loading2 = false;
				});
			}
		}
	}


</script>

<style scoped lang="scss">
	.xunjiantj{
		padding: 10px;
		background: #f3f3f3;
		height: calc(100vh - 84px);

		.box-card{
			.card-header{
				span{
					padding: 0 10px;border-left: 4px solid #09bec5;font-size: 18px;
				}
				.btn{
					float: right;padding: 6px 15px;border: 0;border-radius: 20px;
					background: url("@/assets/images/xunjian/btn-bg.jpg") repeat-y;
					background-size: 100%;color: #fff;
					height: auto;
				}
			}
			.seachform{
				.checkbtn{
					background: #09bec5;padding: 0 25px;border: 0;color: #fff;
				}
				:deep(.el-form-item--default) {margin: 0;}
			}
		}

		.databox{
			margin: 10px 0;
			.dataitem{
				background: #fff;border-radius: 3px;padding: 30px 40px;
				box-shadow: 0 0 5px #eee;
				h3{
					font-weight: bold;font-size: 36px;letter-spacing: -2px;margin: -5px 0 15px;
				}
				h4{
					margin: 0;font-size: 14px;
				}
				img{max-width: 100%;}
			}
			.dataitem:before,.dataitem::after{
				content: '';display: table;clear: both;
			}
		}
		.table{
			padding: 20px;border: 1px solid #eee;background: #fff;
			box-shadow: 0 0 5px #eee;border-radius: 3px;
			height: calc(100% - 290px);position: relative;
			margin: 10px 0 0;

			.handlebtn{
				height: auto;border: 0;padding: 0;color: #09bec5;
			}

			:deep(.el-table) {

				.el-table__header-wrapper th{
					text-align: center;background: #09bec5 !important;color: #fff;border: 0;
				}
				.sort-caret.ascending{
					border-bottom-color: #fff !important;
				}
				.sort-caret.descending{
					border-top-color: #fff !important;
				}
				td.el-table__cell{text-align: center;border-color: #d2eef1;}
				.el-table__inner-wrapper::before{
					display: none;
				}
				.el-table__row--striped td.el-table__cell{
					background: #f6fcfc !important;
				}
				.el-table__row:hover  td.el-table__cell{
					background: #f6fcfc !important;
				}
			}
			:deep(.el-table--border::after) {
				display: none;
			}
			:deep(.el-table--border::before) {
				display: none;
			}
			.pages{
				position: absolute;padding-right: 70px;
				right: 20px;bottom: 10px;
				:deep(.el-pagination) {
					padding: 0;
					.el-pager li{
						outline: none;background: transparent;border: 1px solid #ddd;
					}
					.el-pager li.active{
						background: #09bec5;border-color: #09bec5;font-weight: normal;
					}
				}
				.pagebtn{
					position: absolute;right: 0;top: 0;
				}
			}
		}
		.detailtc{
			:deep(.el-dialog) {
				margin-top: calc(100vh - 84px);
				padding: 10px;
				background: #f3f3f3;
				margin-left: 200px;
				margin-top: 84px !important;
				margin-bottom: 0;margin-right: 0;
				height: calc(100vh - 84px);
				border: 0;border-radius: 0;

				.el-dialog__header{display: none;}
				.el-dialog__body{padding: 0;height: 100%;}
				.table{
					height: calc(100% - 145px);
				}
			}
		}
	}
  //1366屏幕响应
  @media screen and (max-width: 1366px) {
    .xunjiantj{
      height: auto;
      .table{
        padding: 20px 20px 50px;
      }
    }
  }
</style>
