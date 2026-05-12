<template>
	<div class="xunjiantj">
		
		<!-- 筛选 -->
		<el-card class="box-card">
			<template #header>
				<div class="card-header">
					<span>漏检数据查看</span>
				</div>
			</template>
			<div class="seachform">
				<el-form :model="queryParams">
					<el-row :gutter="20">
						<el-col :span="5">
							<el-form-item label="巡检点编号">
								<el-input v-model="queryParams.siteCode" placeholder="请输入" />
							</el-form-item>
						</el-col>
						<el-col :span="5">
							<el-form-item label="单元">
								<el-select v-model="queryParams.sectionId" placeholder="请选择" clearable>
									<el-option
										v-for="item in unitList"
										:key="item.sectionId"
										:label="item.sectionName"
										:value="item.sectionId"
									/>
								</el-select>
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
						<el-col :span="6">
							<el-form-item>
								<el-button class="checkbtn" @click="check">查询</el-button>
								<el-button class="checkbtn" @click="daochu" v-hasPermi="['unitManage:statistics:export']">导出</el-button>
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
			:data="tableData" 
			stripe="true" 
			border 
			style="width: 100%"
			v-loading="loading"
			>
				<el-table-column prop="sectionName" sortable label="工段"/>
				<el-table-column prop="sectionNameUnit" sortable label="单元"/>
				<el-table-column prop="siteCode" sortable label="巡检点编号" />
				<el-table-column prop="siteName" sortable label="巡检点名称" />
				<el-table-column prop="day" sortable label="漏检日期" />
				<el-table-column prop="time" sortable label="漏检周期" />
			</el-table>
			
			<!-- 页码 -->
			<pagination
			background
				:total="total"
				v-model:page="queryParams.pageNum"
				v-model:limit="queryParams.pageSize"
				@pagination="getList"
				ref="page"
			/>
		</div>
		
	</div>
	
</template>

<script>
	import { listMissTask } from "@/api/unitManage/statistics";
	import { listSection } from "@/api/unitmanage/section";
	import {download} from '@/utils/request'
	import { reactive } from 'vue'
	import { ref } from 'vue'
	
	export default {
		name: "漏检数据查看",
		data() {
		  return {
				loading: true,
				total: 0,
				unitList:[],
				queryParams:{
					pageNum: 1,
					pageSize: 10,
					siteCode: '',
					sectionId: null,
					beginDay: '',
					endDay: ''
				},
				tableData : [],
			}
		},
		mounted() {
			this.getUnitList();
			this.getList();
			document.getElementsByClassName('el-pagination__jump')[0].childNodes[0].nodeValue = '跳转至'
			document.getElementsByClassName('el-pagination__jump')[0].childNodes[2].nodeValue = ''
		},
		methods: {
			confirm() {
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
			check() {
				this.queryParams.pageNum = 1;
				this.getList();
			},
			getList(){
				this.loading = true;
				listMissTask(this.queryParams).then(response => {
				  this.tableData = response.rows;
				  this.total = response.total;
				  this.loading = false;
				});
			},
			daochu() {
				download('unitManage/statistics/exportMissTask', {
					...this.queryParams
				}, `漏检数据_${new Date().getTime()}.xlsx`)
			},
			getUnitList(){
				listSection({
					sectionType : '1',
					status : '0',
					delFlag : '0'
				}).then(response => {
				  this.unitList = response.data;
				});
			},
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
			height: calc(100% - 145px);position: relative;
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
		
	}
</style>