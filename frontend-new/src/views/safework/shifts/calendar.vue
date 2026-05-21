<template>
	<div class="ldcalendar">
		<div class="top">
			<el-row>
				<el-col :span="18">
					<el-button
					type="warning"
					plain
					icon="Download"
					@click="handleExport"
					>下载模板</el-button>
					<el-button
							type="info"
							plain
							icon="Upload"
							@click="handleImport"
					>导入
					</el-button>
				</el-col>
				<el-col :span="6">
					<div class="button-group">
						<el-button-group>
							<el-button @click="selectDate('prev-month')">
								上个月
							</el-button>
							<el-button @click="selectDate('today')">本月</el-button>
							<el-button @click="selectDate('next-month')">
								下个月
							</el-button>
						</el-button-group>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="calendarbox">
			<el-calendar ref="calendar">
				<template #header="{ date }">
					<el-icon @click="selectDate('prev-month')"><ArrowLeftBold /></el-icon>
					<span>{{ date }}</span>
					<el-icon @click="selectDate('next-month')"><ArrowRightBold /></el-icon>
				</template>
				<template #dateCell="{ data }">
					<div :class="data.isSelected ? 'is-selected info' : 'info'">
						<h4>{{ data.day }}</h4>
						<div class="banci" v-for="item in shiftCalendarList" :key="item.id" @click="dateClick(data,item.id)">
							<div v-if="item.date == data.day">{{ item.staffName }} {{ item.shiftName }}  <br> {{ item.startTime }} - {{ item.endTime }} </div>
						</div>
					</div>
				</template>
			</el-calendar>
		</div>
		<!-- 导入对话框 -->
		<el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
			<el-upload
				ref="uploadRef"
				:limit="1"
				accept=".xlsx, .xls"
				:headers="upload.headers"
				:action="upload.url + '?updateSupport=' + upload.updateSupport"
				:disabled="upload.isUploading"
				:on-progress="handleFileUploadProgress"
				:on-success="handleFileSuccess"
				:auto-upload="false"
				drag
			>
				<el-icon class="el-icon--upload">
				<upload-filled/>
				</el-icon>
				<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
				<template #tip>
				<div class="el-upload__tip text-center">
					<div class="el-upload__tip">
					<el-checkbox v-model="upload.updateSupport"/>
					是否更新已经存在的数据
					</div>
					<span>仅允许导入xls、xlsx格式文件。</span>
				</div>
				</template>
			</el-upload>
			<template #footer>
				<div class="dialog-footer">
				<el-button type="primary" @click="submitFileForm">确 定</el-button>
				<el-button @click="upload.open = false">取 消</el-button>
				</div>
			</template>
		</el-dialog>
		<!-- 添加或修改带班日历对话框 -->
		<el-dialog :title="title" v-model="form.open" width="500px" append-to-body>
			<el-form ref="shiftCalendarRef" :model="form" :rules="rules" label-width="120px">
				<el-form-item label="带班段名称" prop="shiftName">
					<el-select v-model="form.shiftName" placeholder="请选择">
						<el-option
							v-for="item in shiftsList"
							:key="item.shiftId"
							:label="item.shiftName"
							:value="item.shiftName"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="带班人" prop="staffId">
					<el-select v-model="form.staffId" placeholder="请选择">
						<el-option
							v-for="item in staffList"
							:key="item.staffId"
							:label="item.staffName"
							:value="item.staffNo"
						></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
				<el-button type="primary" @click="submitForm">确 定</el-button>
				<el-button @click="cancel">取 消</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import { ref } from 'vue'
import {download} from '@/utils/request'
import {getToken} from "@/utils/auth";
import {parseTime} from '@/utils/ruoyi'
import { listStaff,listNouserStaff} from "@/api/system/staff";
import { listShifts, getShifts, delShifts, addShifts, updateShifts } from "@/api/safework/shifts";
import { listShiftCalendar, getShiftCalendar, delShiftCalendar, addShiftCalendar, updateShiftCalendar } from "@/api/safework/shiftCalendar";
export default {

	name: "带班日历",
	data() {
		return {
			dialogVisible: false,
			upload : reactive({
				// 是否显示弹出层
				open: false,
				// 弹出层标题
				title: "",
				// 是否禁用上传
				isUploading: false,
				// 是否更新已经存在的数据
				updateSupport: 0,
				// 设置上传的请求头部
				headers: {Authorization: "Bearer " + getToken()},
				// 上传的地址
				url: import.meta.env.VITE_APP_BASE_API + "/safework/shiftCalendar/importData"
			}),
			shiftCalendarList:[],
			queryParams: {
				date: null,
			},
			form: {
				open:false
			},
			title:'',
			staffList:[],
			shiftsList:[],
		}
	},

	watch: {

	},
	created() {
		
	},

	mounted: function () {
		this.selectDate('today');
		this.getStaffList();
		this.getShiftList();
		// 左右按钮绑定上月/下月按钮的点击事件
		// document.getElementById("prevbtn").onclick = function(){
		// 	var evt = document.createEvent("HTMLEvents");
		// 	evt.initEvent("click", true, true);
		// 	document.querySelector('.el-button--small:first-child').dispatchEvent(evt);
		// }

	},

	methods: {
		getShiftList() {
			listShifts().then(response => {
				this.shiftsList = response.rows;
			});
		},
		/** 查询人员信息列表 */
		getStaffList() {
			listStaff().then(response => {
				this.staffList = response.rows;
			});
		},
		submitForm() {
			this.$refs["shiftCalendarRef"].validate(valid => {
				console.log("asd",this.form);
				if (valid) {
					updateShiftCalendar(this.form).then(response => {
						this.$modal.msgSuccess("修改成功");
						this.form.open = false;
						this.selectDate('today');
					});
				}
			});
		},
		cancel() {
			this.form.open = false;
		},
		selectDate(val) {
			this.$refs.calendar.selectDate(val);
			this.queryParams.date = this.formatDate();
			this.getList();
		},
		formatDate() {
			let date = new Date(this.$refs.calendar.date);  //当天
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
			month = month < 10 ? "0" + month : month;
			day = day < 10 ? "0" + day : day;
			let beforeTime = new Date(date.getTime()); //一个月前
			return parseTime(beforeTime,'{y}-{m}');
		},
		dateClick(val,id) {
			let a = val.date; //点击的日期
			let b = new Date(); //今天的日期
			if(a>b){
				// this.dialogVisible = true;
				getShiftCalendar(id).then(response => {
					this.form = response.data;
					this.form.open = true;
					this.title = "修改带班日历";
				});
			}
		},
		infoSave() {
			this.dialogVisible = false;
		},
		/** 导出按钮操作 */
		handleExport() {
			download('safework/shiftCalendar/export', {
			}, `跟班模板.xlsx`)
		},
		/** 导入按钮操作 */
		handleImport() {
			this.upload.title = "线下培训计划导入";
			this.upload.open = true;
		},
		/** 提交上传文件 */
		submitFileForm() {
			this.$refs["uploadRef"].submit();
		},
		/** 文件上传成功处理 */
		handleFileSuccess(response, file, fileList){
			this.upload.open = false;
			this.upload.isUploading = false;
			this.$refs["uploadRef"].clearFiles();
			this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
			this.selectDate('today');
		},
		getList() {
			listShiftCalendar(this.queryParams).then(response => {
				this.shiftCalendarList = response.rows;
			});
		}
	},

}
</script>

<style scoped lang="scss">
	.ldcalendar {
	  .top{
			padding: 15px 20px 10px;
			h5{
				display: inline-block;
				font-size: 16px;
				margin: 0 20px 0 0;
				line-height: 32px;height: 32px;
			}
			.btn{

			}
			.button-group{
				float: right;padding: 0px 0 0;
			}
		}
		.info{
			text-align: right;
			h4{
				font-size: 15px;font-weight: bold;
				margin: 5px 0 10px;
				color: #333;
			}
			.banci{
				font-size: 12px;color: #656565;
				line-height: 1.5;
			}
		}
		.calendarbox{
			padding: 0 20px;
		}
		:deep(.el-calendar) {

			.el-calendar__body{
				padding: 0;
			}
			.el-calendar__header{
				border: 1px solid #eaeaea;
				text-align: center;
				display: block;
				font-size: 16px;font-weight: bold;
				.el-icon{
					vertical-align: sub;
					cursor: pointer;
				}
				span{
					vertical-align: middle;
					margin: 0 15px;
				}
			}
			.el-calendar-table .el-calendar-day{
				padding: 10px 10px 15px;
			}
			.el-calendar-table td.is-selected{
				background: #e6f8fa;
				.info{
					h4{
						color: #09bec5;
					}
					.banci{
						color: #09bec5;
					}
				}
			}
			.el-calendar-table:not(.is-range) td.next,
			.el-calendar-table:not(.is-range) td.prev{
				.info{
					opacity: 0.5;
				}
			}
			.el-calendar-table thead th{
				position: relative;
				font-size: 14px;color: #fff;
				background: #09bec5;
				padding: 8px 0;
			}
			.el-calendar-table thead th:before{
				content: '星期';
			}
		}

	}
</style>
