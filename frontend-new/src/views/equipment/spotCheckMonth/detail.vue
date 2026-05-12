<template>
	<div class="jiludan">
		<div class="botbox">
		  <el-card class="box-card">
		    <template #header>
		      <div class="card-header">设备点检记录单</div>
		    </template>
				<div class="topinfo">
					<el-row>
						<el-col :span="6">
							<img src="@/assets/images/xunjian/jilu-ico1.png" width="20"/>
							<span>
								<i>设备编号：</i>{{eqCode}}
							</span>
						</el-col>
						<el-col :span="6">
							<img src="@/assets/images/xunjian/jilu-ico2.png" width="20"/>
							<span>
								<i>设备名称：</i>{{eqName}}
							</span>
						</el-col>
						<el-col :span="6">
							<img src="@/assets/images/xunjian/jilu-ico3.png" width="20"/>
							<span>
								<i>所在单元：</i>{{sectionName}}
							</span>
						</el-col>
						<el-col :span="6">
							<img src="@/assets/images/xunjian/jilu-ico4.png" width="20"/>
							<span>
								<i>点检月份：</i>{{ parseTime(monthTime, '{y}-{m}') }}月
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
						<el-table-column prop="orderNum" label="序号" width="3%" />
						<el-table-column prop="content" label="点检内容" width="6%"/>
						<el-table-column label="点检结果">
							<el-table-column prop="one" label="1" width="3%">
								<!-- 判断如果one的值为1，则显示对勾 -->
								<template #default="scope">
									<el-icon v-if="scope.row.one==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.one==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.one==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="two" label="2" width="3%" >
								<!-- 判断如果two的值为1，则显示对勾 -->
								<template #default="scope">
									<el-icon v-if="scope.row.two==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.two==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.two==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="three" label="3" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.three==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.three==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.three==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="four" label="4" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.four==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.four==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.four==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="five" label="5" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.five==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.five==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.five==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="six" label="6" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.six==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.six==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.six==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="seven" label="7" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.seven==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.seven==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.seven==='2'"><Warning color="red"/></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="eight" label="8" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.eight==='0'"><CircleClose color="orange"/></el-icon>
									<el-icon v-if="scope.row.eight==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.eight==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="nine" label="9" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.nine==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.nine==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.nine==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="ten" label="10" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.ten==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.ten==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.ten==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="eleven" label="11" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.eleven==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.eleven==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.eleven==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="twelve" label="12" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.twelve==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.twelve==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.twelve==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="thirteen" label="13" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.thirteen==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.thirteen==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.thirteen==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="fourteen" label="14" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.fourteen==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.fourteen==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.fourteen==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="fifteen" label="15" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.fifteen==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.fifteen==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.fifteen==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="sixteen" label="16" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.sixteen==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.sixteen==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.sixteen==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="seventeen" label="17" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.seventeen==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.seventeen==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.seventeen==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="eighteen" label="18" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.eighteen==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.eighteen==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.eighteen==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="nineteen" label="19" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.nineteen==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.nineteen==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.nineteen==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="twenty" label="20" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.twenty==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.twenty==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.twenty==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="twentyone" label="21" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.twentyone==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.twentyone==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.twentyone==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="twentytwo" label="22" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.twentytwo==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.twentytwo==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.twentytwo==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="twentythree" label="23" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.twentythree==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.twentythree==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.twentythree==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="twentyfour" label="24" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.twentyfour==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.twentyfour==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.twentyfour==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="twentyfive" label="25" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.twentyfive==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.twentyfive==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.twentyfive==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="twentysix" label="26" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.twentysix==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.twentysix==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.twentysix==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="twentyseven" label="27" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.twentyseven==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.twentyseven==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.twentyseven==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="twentyeight" label="28" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.twentyeight==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.twentyeight==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.twentyeight==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="twentynine" label="29" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.twentynine==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.twentynine==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.twentynine==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="thirty" label="30" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.thirty==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.thirty==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.thirty==='2'"><Warning /></el-icon>
								</template>
							</el-table-column>
							<el-table-column prop="thirtyone" label="31" width="3%" >
								<template #default="scope">
									<el-icon v-if="scope.row.thirtyone==='0'"><CircleClose /></el-icon>
									<el-icon v-if="scope.row.thirtyone==='1'"><CircleCheck /></el-icon>
									<el-icon v-if="scope.row.thirtyone==='2'"><Warning /></el-icon>
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
import { getSpotCheckMonth } from "@/api/equipment/spotCheckMonth";
import {useRoute} from 'vue-router'
	export default {
	  name: "设备点检记录单",
	  data() {
	    return {
				eqCode: null,
				eqName: null,
				sectionName: null,
				monthTime: null,
	      tableData: [],
	      tableData2: [{
					person: '点检人'
				}],
				userName: null
	    }
	  },
	
	
	  watch: {
	    
	  },
	  created() {
	  },
	
	  mounted: function () {
			const route = useRoute();
			this.id = route.params.id;
	    this.getList();
	  },
	
	  methods: {
			getList(){
				this.tableData2 = [{
					person: '点检人',
					one: null,
					two: null,
					three: null,
					four: null,
					five: null,
					six: null,
					seven: null,
					eight: null,
					nine: null,
					ten: null,
					eleven: null,
					twelve: null,
					thirteen: null,
					fourteen: null,
					fifteen: null,
					sixteen: null,
					seventeen: null,
					eighteen: null,
					nineteen: null,
					twenty: null,
					twentyone: null,
					twentytwo: null,
					twentythree: null,
					twentyfour: null,
					twentyfive: null,
					twentysix: null,
					twentyseven: null,
					twentyeight: null,
					twentynine: null,
					thirty: null,
					thirtyone: null
				}];
				getSpotCheckMonth(this.id).then(response =>{
					this.eqCode = response.data.eqCode;
					this.eqName = response.data.eqName;
					this.sectionName = response.data.sectionName;
					this.monthTime = response.data.monthTime;
					this.tableData = response.data.eqSpotCheckContentList;
					this.userName = response.data.userName;
					for(var i=0; i < this.tableData.length; i++){
						if(this.tableData[i].one != null && this.tableData2[0].one == null){
							this.tableData2[0].one = this.userName;
						}else if(this.tableData[i].two != null && this.tableData2[0].two == null){
							this.tableData2[0].two = this.userName;
						}else if(this.tableData[i].three != null && this.tableData2[0].three == null){
							this.tableData2[0].three = this.userName;
						}else if(this.tableData[i].four != null && this.tableData2[0].four == null){
							this.tableData2[0].four = this.userName;
						}else if(this.tableData[i].five != null && this.tableData2[0].five == null){
							this.tableData2[0].five = this.userName;
						}else if(this.tableData[i].six != null && this.tableData2[0].six == null){
							this.tableData2[0].six = this.userName;
						}else if(this.tableData[i].seven != null && this.tableData2[0].seven == null){
							this.tableData2[0].seven = this.userName;
						}else if(this.tableData[i].eight != null && this.tableData2[0].eight == null){
							this.tableData2[0].eight = this.userName;
						}else if(this.tableData[i].nine != null && this.tableData2[0].nine == null){
							this.tableData2[0].nine = this.userName;
						}else if(this.tableData[i].ten != null && this.tableData2[0].ten == null){
							this.tableData2[0].ten = this.userName;
						}else if(this.tableData[i].eleven != null && this.tableData2[0].eleven == null){
							this.tableData2[0].eleven = this.userName;
						}else if(this.tableData[i].twelve != null && this.tableData2[0].twelve == null){
							this.tableData2[0].twelve = this.userName;
						}else if(this.tableData[i].thirteen != null && this.tableData2[0].thirteen == null){
							this.tableData2[0].thirteen = this.userName;
						}else if(this.tableData[i].fourteen != null && this.tableData2[0].fourteen == null){
							this.tableData2[0].fourteen = this.userName;
						}else if(this.tableData[i].fifteen != null && this.tableData2[0].fifteen == null){
							this.tableData2[0].fifteen = this.userName;
						}else if(this.tableData[i].sixteen != null && this.tableData2[0].sixteen == null){
							this.tableData2[0].sixteen = this.userName;
						}else if(this.tableData[i].seventeen != null && this.tableData2[0].seventeen == null){
							this.tableData2[0].seventeen = this.userName;
						}else if(this.tableData[i].eighteen != null && this.tableData2[0].eighteen == null){
							this.tableData2[0].eighteen = this.userName;
						}else if(this.tableData[i].nineteen != null && this.tableData2[0].nineteen == null){
							this.tableData2[0].nineteen = this.userName;
						}else if(this.tableData[i].twenty != null && this.tableData2[0].twenty == null){
							this.tableData2[0].twenty = this.userName;
						}else if(this.tableData[i].twentyone != null && this.tableData2[0].twentyone == null){
							this.tableData2[0].twentyone = this.userName;
						}else if(this.tableData[i].twentytwo != null && this.tableData2[0].twentytwotwentytwo == null){
							this.tableData2[0].twentytwo = this.userName;
						}else if(this.tableData[i].twentythree != null && this.tableData2[0].twentythree == null){
							this.tableData2[0].twentythree = this.userName;
						}else if(this.tableData[i].twentyfour != null && this.tableData2[0].twentyfour == null){
							this.tableData2[0].twentyfour = this.userName;
						}else if(this.tableData[i].twentyfive != null && this.tableData2[0].twentyfive == null){
							this.tableData2[0].twentyfive = this.userName;
						}else if(this.tableData[i].twentysix != null && this.tableData2[0].twentysix == null){
							this.tableData2[0].twentysix = this.userName;
						}else if(this.tableData[i].twentyseven != null && this.tableData2[0].twentyseven == null){
							this.tableData2[0].twentyseven = this.userName;
						}else if(this.tableData[i].twentyeight != null && this.tableData2[0].twentyeight == null){
							this.tableData2[0].twentyeight = this.userName;
						}else if(this.tableData[i].twentynine != null && this.tableData2[0].twentynine == null){
							this.tableData2[0].twentynine = this.userName;
						}else if(this.tableData[i].thirty != null && this.tableData2[0].thirty == null){
							this.tableData2[0].thirty = this.userName;
						}else if(this.tableData[i].thirtyone != null && this.tableData2[0].thirtyone == null){
							this.tableData2[0].thirtyone = this.userName;
						}
					}
				});
			},
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