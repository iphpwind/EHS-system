<template>
	<div class="jiludan">
		<div class="botbox">
		  <el-card class="box-card">
		    <template #header>
		      <div class="card-header">设备点检记录单</div>
					<div class="tools">
					  <span @click="">
							<img src="@/assets/images/xunjian/daochu.png" width="20"/>
						</span>
						<span @click="">
							<img src="@/assets/images/xunjian/goback.png" width="20"/>
						</span>
					</div>
		    </template>
				<div class="topinfo">
					<el-row>
						<el-col :span="6">
							<img src="@/assets/images/xunjian/jilu-ico1.png" width="20"/>
							<span>
								<i>设备编号：</i>1111111112344
							</span>
						</el-col>
						<el-col :span="6">
							<img src="@/assets/images/xunjian/jilu-ico2.png" width="20"/>
							<span>
								<i>设备名称：</i>设备123
							</span>
						</el-col>
						<el-col :span="6">
							<img src="@/assets/images/xunjian/jilu-ico3.png" width="20"/>
							<span>
								<i>所在单元：</i>1单元
							</span>
						</el-col>
						<el-col :span="6">
							<img src="@/assets/images/xunjian/jilu-ico4.png" width="20"/>
							<span>
								<i>点检月份：</i>10月
							</span>
						</el-col>
					</el-row>
				</div>
		    <div class="table">
					<el-table :data="tableData"
										:fit="false"
										stripe
										border
										style="width: 100%"
					>
						<el-table-column prop="number" label="序号" width="3%" />
						<el-table-column prop="content" label="点检内容" width="6%"/>
						<el-table-column label="点检结果">
							<el-table-column prop="one" label="1" width="3%">
								<!-- 判断如果one的值为1，则显示对勾 -->
								<template #default="scope">
									<el-icon v-if="scope.row.one==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="two" label="2" width="3%" >
								<!-- 判断如果two的值为1，则显示对勾 -->
								<template #default="scope">
									<el-icon v-if="scope.row.two==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="three" label="3" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.three==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="four" label="4" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.four==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="five" label="5" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.five==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="six" label="6" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.six==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="seven" label="7" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.seven==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="eight" label="8" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.eight==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="nine" label="9" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.nine==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="ten" label="10" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.ten==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="eleven" label="11" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.eleven==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="twelve" label="12" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.twelve==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="thirteen" label="13" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.thirteen==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="fourteen" label="14" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.fourteen==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="fifteen" label="15" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.fifteen==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="sixteen" label="16" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.sixteen==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="seventeen" label="17" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.seventeen==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="eighteen" label="18" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.eighteen==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="nineteen" label="19" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.nineteen==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="twenty" label="20" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.twenty==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="twentyone" label="21" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.twentyone==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="twentytwo" label="22" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.twentytwo==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="twentythree" label="23" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.twentythree==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="twentyfour" label="24" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.twentyfour==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="twentyfive" label="25" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.twentyfive==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="twentysix" label="26" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.twentysix==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="twentyseven" label="27" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.twentyseven==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="twentyeight" label="28" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.twentyeight==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="twentynine" label="29" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.twentynine==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="thirty" label="30" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.thirty==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="thirtyone" label="31" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.thirtyone==='1'"><CircleCheck /></el-icon>
								</template>
							</el-table-column>
						</el-table-column>
					</el-table>
					
					<el-table :data="tableData2" id="table2"
										:fit="false"
										stripe
										border
										style="width: 100%"
										:span-method="arraySpanMethod"
					>
						<el-table-column prop="person" label="点检人" width="9%"/>
						<el-table-column prop="one" label="1" width="3%" />
						<el-table-column prop="two" label="2" width="3%" />
						<el-table-column prop="three" label="3" width="3%" />
						<el-table-column prop="four" label="4" width="3%" />
						<el-table-column prop="five" label="5" width="3%" />
						<el-table-column prop="six" label="6" width="3%" />
						<el-table-column prop="seven" label="7" width="3%" />
						<el-table-column prop="eight" label="8" width="3%" />
						<el-table-column prop="nine" label="9" width="3%" />
						<el-table-column prop="ten" label="10" width="3%" />
						<el-table-column prop="eleven" label="11" width="3%" />
						<el-table-column prop="twelve" label="12" width="3%" />
						<el-table-column prop="thirteen" label="13" width="3%" />
						<el-table-column prop="fourteen" label="14" width="3%" />
						<el-table-column prop="fifteen" label="15" width="3%" />
						<el-table-column prop="sixteen" label="16" width="3%" />
						<el-table-column prop="seventeen" label="17" width="3%" />
						<el-table-column prop="eighteen" label="18" width="3%" />
						<el-table-column prop="nineteen" label="19" width="3%" />
						<el-table-column prop="twenty" label="20" width="3%" />
						<el-table-column prop="twentyone" label="21" width="3%" />
						<el-table-column prop="twentytwo" label="22" width="3%" />
						<el-table-column prop="twentythree" label="23" width="3%" />
						<el-table-column prop="twentyfour" label="24" width="3%" />
						<el-table-column prop="twentyfive" label="25" width="3%" />
						<el-table-column prop="twentysix" label="26" width="3%" />
						<el-table-column prop="twentyseven" label="27" width="3%" />
						<el-table-column prop="twentyeight" label="28" width="3%" />
						<el-table-column prop="twentynine" label="29" width="3%" />
						<el-table-column prop="thirty" label="30" width="3%" />
						<el-table-column prop="thirtyone" label="31" width="3%" />
					</el-table>
		    </div>
		  </el-card>
		</div>
	</div>
</template>

<script>
	export default {
	  name: "设备点检记录单",
	  data() {
	    return {
	      tableData: [
					{
						number: '1',
						content: '设备点02891',
						one: '1',
						two: '1',
						three: '0',
						four: '0',
						five: '1',
						six: '1',
						seven: '1',
						eight: '1',
						nine: '1',
						ten: '1',
						eleven: '1',
						twelve: '1',
						thirteen: '1',
						fourteen: '1',
						fifteen: '1',
						sixteen: '1',
						seventeen: '1',
						eighteen: '1',
						nineteen: '1',
						twenty: '1',
						twentyone: '1',
						twentytwo: '1',
						twentythree: '1',
						twentyfour: '1',
						twentyfive: '1',
						twentysix: '1',
						twentyseven: '1',
						twentyeight: '1',
						twentynine: '1',
						thirty: '1',
						thirtyone: '1'
					},
					{
						number: '2',
						content: '设备点02891',
						one: '1',
						two: '1',
						three: '1',
					},
				],
				tableData2: [
					{
						person: '点检人',
						one: '张三',
						two: '李四',
						three: '张三'
					},
					{
						one: '张三',
						two: '李四',
						three: '张三'
					},
					{
						one: '张三',
						two: '李四',
						three: '张三'
					}
				],
	    }
	  },
	
	
	  watch: {
	    
	  },
	  created() {
	
	  },
	
	  mounted: function () {
	    
	  },
	
	  methods: {
	    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
				if (columnIndex === 0) {
					if (rowIndex === 0) {
						return {
							rowspan: 3, 
							colspan: 1,
						}
					} else {
						return {
							rowspan: 0,
							colspan: 0,
						}
					}
				}
			}
	
	  },
	
	
	}
</script>

<style scoped lang="scss">
	.jiludan {
	  background: #f1f1f1;
	  height: calc(100vh - 84px);
	  padding: 10px;
		:deep(.el-row) {height: 100%;}
		:deep(.el-col) {height: 100%;}
		.botbox{
			
		}
		.box-card{
		  padding: 15px;
			:deep(.el-card__header) {
				padding: 0 0 15px;position: relative;
			}
			:deep(.el-card__body) {
				padding: 0;
			}
		  .card-header{
		    padding-left: 10px;border-left: 5px solid #09bec5;
		    line-height: 1;
		  }
			.tools{
				position: absolute;right: 0;top: 0;
				span{margin-left: 15px;cursor: pointer;}
			}
			.topinfo{
				margin: 25px 0 0;
				img{
					vertical-align: middle;
					margin-right: 10px;
				}
				span{
					font-size: 14px;
					i{
						font-style: normal;color: #999;
					}
				}
			}
		}
		.table{
		  position: relative;padding: 20px 0 0;
		  height:calc(100% - 40px);
		  :deep(.el-table) {
				.el-icon{color: #09bec5;font-size: 20px;}
		    .el-table__empty-block{
		      width:100% !important
		    }
		    .el-table__header{
		      width: 100% !important;
		    }
		    .el-table__body{
		      width: 100% !important;
		    }
				tr:hover td{background-color: transparent;}
		    th.el-table__cell{
		      background: #09bec5 !important;
		      color: #fff;
		      text-align: center;
		      height:35px !important;padding:3px 0;
		    }
		    .is-group tr:last-child th.el-table__cell{
		      background: #fff !important;
		      color: #09bec5;
		    }
		    .cell{
		      text-align: center;padding:0;
		    }
		    .el-table__body tr.el-table__row--striped td.el-table__cell{
		      background: #f6fcfc;
		    }
		    .el-table--border, .el-table--group {
		      border: 2px solid #dff3f5!important;
		    }
		  }
		}
		#table2{
			margin-top: -1px;
			:deep(.el-table__header-wrapper) {
				display: none;
			}
			:deep(tr:first-child td:first-child .cell) {
					color: #09bec5;font-weight: bold;font-size: 16px;
			}
		}
	}
</style>