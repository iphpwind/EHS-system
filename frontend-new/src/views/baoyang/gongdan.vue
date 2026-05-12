<template>
	<div class="baoyanggongdan">
		<el-card class="info">
<!--			<div class="rightsearch">
				<el-button class="btn green" @click="searchOne">
					<el-icon><Search /></el-icon> 查询
				</el-button> |
				<el-button class="btn" @click="search">
					<el-icon><Filter /></el-icon> 隐藏筛查
				</el-button>
			</div>-->
			<el-row :gutter="10">
				<el-col :span="5" class="mar">
					<div class="item">
						<el-row>
							<el-col :span="7">
								<img src="@/assets/images/baoyang/baoyang-gdico1.png"/>
							</el-col>
							<el-col :span="17">
								<h3 class="blue">{{ countDataList.unexpired==null ? 0: countDataList.unexpired}}</h3>
								<h5>保养计划任务</h5>
							</el-col>
						</el-row>
					</div>
				</el-col>
				<el-col :span="5" class="mar">
					<div class="item">
						<el-row>
							<el-col :span="7">
								<img src="@/assets/images/baoyang/baoyang-gdico2.png"/>
							</el-col>
							<el-col :span="17">
								<h3 class="red">{{ countDataList.tobemaintained==null?0:countDataList.tobemaintained }}</h3>
								<h5>到期需保养计划</h5>
							</el-col>
						</el-row>
					</div>
				</el-col>
				<el-col :span="5" class="mar">
					<div class="item">
						<el-row>
							<el-col :span="7">
								<img src="@/assets/images/baoyang/baoyang-gdico3.png"/>
							</el-col>
							<el-col :span="17">
								<h3 class="green">{{ countDataList.finish==null?0:countDataList.finish }}</h3>
								<h5>已完成保养任务</h5>
							</el-col>
						</el-row>
					</div>
				</el-col>
				<el-col :span="5" class="mar">
					<div class="item">
						<el-row>
							<el-col :span="7">
								<img src="@/assets/images/baoyang/baoyang-gdico4.png"/>
							</el-col>
							<el-col :span="17">
								<h3 class="orange">{{ countDataList.tobeconfirm==null?0:countDataList.tobeconfirm}}</h3>
								<h5>待完成保养任务</h5>
							</el-col>
						</el-row>
					</div>
				</el-col>
        <el-col :span="5" class="mar">
          <div class="item">
            <el-row>
              <el-col :span="7" >
                <img src="@/assets/images/baoyang/baoyang-gdico4.png"/>
              </el-col>
              <el-col :span="17">
                <h3 class="orange">{{ countDataList.exceed==null?0:countDataList.exceed }}</h3>
                <h5>已超期保养任务</h5>
              </el-col>
            </el-row>
          </div>
        </el-col>
			</el-row>
		</el-card>
		<el-card class="tools">
			<el-form :model="form" label-width="80px">
				<el-row>
					<el-col :span="20">
						<el-row>
							<el-col :span="5">
								<el-form-item label="单元" prop="sectionId">
                  <el-select v-model="form.sectionId" placeholder="请选择单元" clearable>
                    <el-option
                        v-for="item in sectionOptions"
                        :key="item.sectionId"
                        :label="item.sectionName"
                        :value="item.sectionId"
                    />
                  </el-select>
								</el-form-item>
							</el-col>
							<el-col :span="5">
                <el-form-item label="设备名称" prop="eqId">
                  <el-select v-model="form.eqId" placeholder="请选择设备" clearable>
                    <el-option
                        v-for="item in options"
                        :key="item.eqId"
                        :label="item.eqName"
                        :value="item.eqId"
                    />
                  </el-select>
                </el-form-item>
							</el-col>
							<el-col :span="5">
                <el-form-item label="保养类型">
                  <el-select v-model="form.maintenanceType" placeholder="请选择">
                    <el-option label="周期保养" value="0" />
                    <el-option label="指定时间保养" value="1" />
                  </el-select>
                </el-form-item>
							</el-col>
              <el-col :span="5" v-if="false">
                <el-form-item label="工单号">
                  <el-input v-model="form.workorderNo" />
                </el-form-item>
              </el-col>
						</el-row>
					</el-col>
<!--					<el-col :span="2">
						<el-button class="toolbtn" @click="searchTwo">
							<el-icon><Search /></el-icon> 查询
						</el-button>
					</el-col>-->
				</el-row>
				<el-row>
					<el-col :span="20">
						<el-row>
							<el-col :span="10">
								<el-form-item label="日期">
									<el-row>
										<el-col :span="9">
											<el-date-picker
												v-model="form.date1"
												type="datetime"
												placeholder="开始日期"
                        @change="ctimeonfirm1"
                        value-format="YYYY-MM-DD HH:mm:ss"
												style="width: 100%"
											/>
										</el-col>
										<el-col :span="2" class="text-center">
											<span style="color: #aaa;">—</span>
										</el-col>
										<el-col :span="9">
											<el-date-picker
												v-model="form.date2"
												type="datetime"
												placeholder="结束日期"
                        @change="ctimeonfirm2"
                        value-format="YYYY-MM-DD HH:mm:ss"
												style="width: 100%"
											/>
										</el-col>
									</el-row>
								</el-form-item>
							</el-col>
							<el-col :span="5">
								<el-form-item label="保养状态">
									<el-select v-model="form.status" placeholder="请选择">
										<el-option label="作废" value="0" />
										<el-option label="未到期" value="1" />
                    <el-option label="待保养" value="2" />
                    <el-option label="待确认" value="3" />
									</el-select>
								</el-form-item>
							</el-col>
              <el-col :span="5" v-if="false">
                <el-form-item label="计划id">
                  <el-input v-model="form.maintenanceId" readonly />
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-button class="toolbtn" @click="searchTwo">
                  <el-icon><Search /></el-icon> 查询
                </el-button>
              </el-col>
						</el-row>
					</el-col>
					<el-col :span="2">
<!--						<el-button class="toolbtn" @click="newbuild">
							<el-icon><Plus /></el-icon> 新建
						</el-button>-->
						<!-- 新建弹出 -->
						<div class="addtanchu">
							<el-dialog
								v-model="dialogVisible"
								title="保养工单"
								width="60%"
							>
								<el-form :model="addform" ref="addformRef" label-width="100px">
									<el-row>
                    <el-input v-model="addform.maintenanceWorkorderId" v-if="false" />
                    <el-input v-model="addform.maintenanceOperator" v-if="false" />
										<el-col :span="12">
											<el-form-item label="单元">
                        <el-input v-model="addform.sectionName" readonly />
											</el-form-item>
										</el-col>
										<el-col :span="12">
											<el-form-item label="保养设备">
												<el-input v-model="addform.eqName" readonly />
											</el-form-item>
										</el-col>
										<el-col :span="24">
											<el-form-item label="保养内容">
												<el-input v-model="addform.maintenanceContent" type="textarea" readonly/>
											</el-form-item>
										</el-col>
                    <el-col :span="12">
                      <el-form-item label="保养操作人">
                        <el-input v-model="addform.maintenanceOperatorNames" readonly />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="保养确认人">
                        <el-input v-model="addform.maintenance_confirmer_name" readonly />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="计划保养时间">
                        <el-date-picker v-model="addform.startTime"  type="datetime" placeholder="计划保养时间"></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="addform.status==3">
                      <el-form-item label="申请确认时间">
                        <el-date-picker v-model="addform.apply_confirm_time"  type="datetime" placeholder="申请确认时间"></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="addform.status==4">
                      <el-form-item label="验收完成时间">
                        <el-date-picker v-model="addform.endTime"  type="datetime" placeholder="申请确认时间"></el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="保养部位" class="parts">
                        <el-row>
                          <el-col :span="8">
                            <div class="textcenter">保养部位</div>
                          </el-col>
                          <el-col :span="8">
                            <div class="textcenter">保养步骤</div>
                          </el-col>
                          <el-col :span="8"></el-col>
                        </el-row>
                        <el-row :gutter="10" v-for="(part, index) in addform.unitWorkorderPartsList" :key="index">
                          <el-col :span="8">
                            <el-input v-model="part.maintenancePartsName" readonly />
                          </el-col>
                          <el-col :span="8">
                            <el-input v-model="part.maintenanceStep" readonly />
                          </el-col>
                          <el-col :span="8">
                            <el-button @click="complishpart(part.id)" class="btn green" v-if="part.status==0 && addform.status==2">完成</el-button>
                            <el-button class="btn" v-if="part.status==1">已完成</el-button>
                          </el-col>
                        </el-row>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="使用备件" class="parts">
                        <el-row>
                          <el-col :span="4">
                            <div class="textcenter">备件名称</div>
                          </el-col>
                          <el-col :span="4">
                            <div class="textcenter">规格型号</div>
                          </el-col>
                          <el-col :span="4">
                            <div class="textcenter">单位</div>
                          </el-col>
                          <el-col :span="4">
                            <div class="textcenter">使用数量</div>
                          </el-col>
                          <el-col :span="4"></el-col>
                        </el-row>
                        <el-row :gutter="10" v-for="(attachment, index) in addform.unitWorkorderSpareList" :key="index">
                          <el-col :span="4">
                            <el-input v-model="attachment.sparePartsName" readonly />
                          </el-col>
                          <el-col :span="4">
                            <el-input v-model="attachment.sparePartsSpe" readonly />
                          </el-col>
                          <el-col :span="4">
                            <el-input v-model="attachment.sparePartsUnit" readonly />
                          </el-col>
                          <el-col :span="4">
                            <el-input v-model="attachment.num" readonly/>
                          </el-col>
                          <el-col :span="4">
                            <el-button @click="complishspare(attachment.id,addform.maintenanceWorkorderId)" class="btn green" v-if="attachment.status==0 && addform.status==2">完成</el-button>
                            <el-button class="btn" v-if="attachment.status==1">已完成</el-button>
                          </el-col>
                        </el-row>
                      </el-form-item>
                    </el-col>
                    <el-col :span="24">
                      <el-form-item label="备注信息">
                        <el-input v-model="addform.rem" type="textarea" v-if="addform.status==2"/>
                        <el-input v-model="addform.rem" type="textarea" v-if="addform.status==3 || addform.status==4" readonly/>
                      </el-form-item>
                    </el-col>
<!--                    <el-col :span="12">
                      <el-form-item label="上传保养图片">
                        <ImageUpload
                            v-model.value="addform.diagram_url"
                            :limit = "1"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="上传确认图片">
                        <ImageUpload
                            v-model.value="addform.confirm_diagram_url"
                            :limit = "1"
                        />
                      </el-form-item>
                    </el-col>-->
									</el-row>
								</el-form>
								<template #footer>
									<span class="dialog-footer">
                    <el-button @click="temSave" class="btn" v-if="addform.status==2">暂存</el-button>
										<el-button @click="save" class="btn green" v-if="addform.status==2">保养完成</el-button>
                    <el-button @click="dialogVisible = false" class="btn" v-if="addform.status==3">取消</el-button>
										<el-button @click="saveconfirm" class="btn green" v-if="addform.status==3">确认</el-button>
									</span>
								</template>
							</el-dialog>
						</div>

					</el-col>
				</el-row>
			</el-form>
		</el-card>


		<!-- <表格 -->
		<div class="table">
			<div class="header">
				<div class="card-tit">保养计划</div>
			</div>
			<el-table
			:data="tableData"
			stripe="true"
			border
			style="width: 100%"
			v-loading="loading"
			>
				<el-table-column prop="maintenanceWorkorderId" label="maintenanceWorkorderId" v-if="false"/>
				<el-table-column prop="workorderNo" label="工单号"/>
				<el-table-column prop="sectionName" label="单元"/>
				<el-table-column prop="eqName" label="设备名称"/>
        <el-table-column prop="maintenanceType" label="保养类型">
          <template #default="scope">
            <el-row justify="center" v-if="scope.row.maintenanceType == 0">周期保养</el-row>
            <el-row justify="center" v-else>指定时间保养</el-row>
          </template>
        </el-table-column>
				<el-table-column prop="maintenanceContent" label="保养内容" />
				<el-table-column prop="status" label="保养状态" >
          <template #default="scope">
            <el-row justify="center" v-if="scope.row.status == 0"><el-tag type="danger">已作废</el-tag></el-row>
            <el-row justify="center" v-if="scope.row.status == 1"><el-tag>未到期</el-tag></el-row>
            <el-row justify="center" v-if="scope.row.status == 2"><el-tag>待保养</el-tag></el-row>
            <el-row justify="center" v-if="scope.row.status == 3"><el-tag>待确认</el-tag></el-row>
            <el-row justify="center" v-if="scope.row.status == 4"><el-tag type="success">保养完成</el-tag></el-row>
          </template>
        </el-table-column>
				<el-table-column prop="maintenanceOperatorNames" label="保养操作人" />
				<el-table-column prop="maintenance_confirmer_name" label="保养确认人" />
				<el-table-column prop="startTime" label="保养计划时间" width="180" />
				<el-table-column prop="endTime" label="保养完成时间" width="180" />
				<el-table-column label="操作" width="100" fixed="right">
					<template #default="scope">
						<el-button link @click="edit(scope.row)" class="btn" v-if="scope.row.status == 2">保养</el-button>
            <el-button link @click="edit(scope.row)" class="btn" v-if="scope.row.status == 3">确认</el-button>
            <el-button link @click="edit(scope.row)" class="btn" v-if="scope.row.status == 4">详情</el-button>
            <el-button link @click="edit(scope.row)" class="btn" v-if="scope.row.status == 1">详情</el-button>
            <el-button link @click="edit(scope.row)" class="btn" v-if="scope.row.status == 0">详情</el-button>
<!--            <el-button link @click="editSta(scope.row)" class="btn" v-if="scope.row.status != 4 && scope.row.status != 0">作废</el-button>-->
<!--						<el-button link @click="record(scope.row)" class="btn green">记录</el-button>-->
					</template>
				</el-table-column>
			</el-table>

			<!-- 页码 -->
			<div class="pages">
        <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="form.pageNum"
            v-model:limit="form.pageSize"
            @pagination="getList"
        />
			</div>
		</div>

	</div>

</template>

<script>
	import { reactive } from 'vue'
  import { listDevice } from "@/api/unitmanage/device";
  import { listSection } from "@/api/unitmanage/section";
  import { listWorkorder,getWorkorder,updateWorkorder,getCountWorkorder } from "@/api/unitmanage/workorders";
  import { updateWorkorderparts} from "@/api/unitmanage/workorderparts";
  import { updateWorkorderSpare} from "@/api/unitmanage/workorderSpare";
  import { getUserList } from "@/api/system/user";
	export default {
		name: "保养工单",
		data() {
		  return {
				form: reactive({
				  gongduan: '',
					unit: '',
          eqName: '',
          maintenanceType: '',
          status: '',
          workorderNo: '',
					date1: null,
					date2: null,
          sectionId: '',
          sectionName: '',
          eqId: '',
          sectionOptions:[],
          options: [],
          pageSize:10,
          pageNum:1
				}),
				dialogVisible: false,
				addform: reactive({
					unit: '',
          eqName: '',
					rules: '',
          status: '',
					starttime: '',
					endtime: '',
          apply_confirm_time: '',
          maintenanceContent: '',
          maintenance_confirmer_name: '',
          maintenanceOperatorNames: '',
          maintenanceOperator: '',
          maintenanceConfirmer: '',
          maintenanceType_name: '',
          maintenanceWorkorderId:'',
          diagram_url:'',
          confirm_diagram_url:'',
          rem:'',
				}),
				tableData: [],
				total: 20,
        countDataList:{},
        sectionOptions:[],
        options: [],
			}
		},
		created() {
      this.form.maintenanceId = this.$route.query.id;
      this.listSection();//获取单元数据
      this.getDeviceList();//获取设备数据
      this.getList();//获取列表数据
      this.getListCount();//获取列表汇总数据
		},
    mounted(){

    },
    methods: {
      temSave(){
        this.dialogVisible = false;
        this.getList();//获取列表数据
      },
			searchOne() {

			},
			searchTwo() {
        this.getList();//获取列表数据
			},
			/*newbuild() {
				this.dialogVisible = true;
			},*/
			save() {
        this.addform.status= '3';
        updateWorkorder(this.addform).then(response => {
          this.$message({
            type: 'success',
            message: `编辑成功！`
          });
          this.dialogVisible = false;
          this.getList();
        });
			},

      saveconfirm() {
        this.addform.status= '4';
        updateWorkorder(this.addform).then(response => {
          this.$message({
            type: 'success',
            message: `确认成功！`
          });
          this.dialogVisible = false;
          this.getList();
        });
      },

			edit(row) {
        this.dialogVisible = true;
        const WorkorderId = row.maintenanceWorkorderId || ids.value
        getWorkorder(WorkorderId).then(response => {
          this.addform = response.data;
          this.open = true;
          this.title = "修改保养工单";
        });
			},
      //作废
      editSta(row) {
        const WorkorderId = row.maintenanceWorkorderId || ids.value
        this.addform.status= '0';
        this.addform.maintenanceWorkorderId= WorkorderId;
        this.$confirm('确认作废工单?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
          center: true
        }).then(() => {
          updateWorkorder(this.addform).then(response => {
            this.$message({
              type: 'success',
              message: `更新成功！`
            });
            this.getList();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消作废'
          });
        });
      },
      //保养部位完成操作
      complishpart(id,maintenanceWorkorderId){
			  console.log(id);
        this.$confirm('确认完成?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
          center: true
        }).then(() => {
          updateWorkorderparts({id:id,status: '1'}).then(response => {
            this.$message({
              type: 'success',
              message: `更新成功！`
            });

            getWorkorder(maintenanceWorkorderId).then(response => {
              this.addform = response.data;
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      //使用备件完成操作
      complishspare(id,maintenanceWorkorderId){
        console.log(id);
        this.$confirm('确认完成?', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
          center: true
        }).then(() => {
          updateWorkorderSpare({id:id,status: '1'}).then(response => {
            this.$message({
              type: 'success',
              message: `更新成功！`
            });

            getWorkorder(maintenanceWorkorderId).then(response => {
              this.addform = response.data;
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },

			record() {

			},
			confirm() {

			},

      //筛选时间确认
      ctimeonfirm1(val){
        this.starttimeresult = this.timeFormat(val);
        this.datePicker = false;
        this.form.date1 = this.starttimeresult
      },

      ctimeonfirm2(val){
        this.endtimeresult = this.timeFormat(val);
        this.datePicker = false;
        this.form.date2 = this.endtimeresult
      },

      timeFormat(time) { // 时间格式化 2019-09-08
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        let hh = time.getHours();
        let dd = time.getMinutes();
        let ss = time.getSeconds();
        return year + '-' + month + '-' + day + ' ' + hh + ':' + dd + ':' + ss;
      },

      //获取设备数据
      getDeviceList() {
        listDevice(this.queryParams).then(response => {
          this.options = response.rows;//list数据
        });
      },

      /** 查询组织下拉树结构 */
      listSection() {
        listSection(this.form).then(response => {
          this.sectionOptions = response.data;//list数据
        });
      },
      /** 查询保养工单列表 */
      getList() {
        this.loading = true;
        listWorkorder(this.form).then(response => {
          this.tableData = response.rows;//table数据
          this.total = response.total;//table总个数
          this.loading = false;
        });
      },

      /** 查询保养工单列表汇总数据 */
      getListCount() {
        this.loading = true;
        getCountWorkorder().then(response => {
          this.countDataList = response.data;
          this.loading = false;
        });
      },
		}
	}


</script>

<style scoped lang="scss">
	.baoyanggongdan{
		padding: 10px;background: #f3f3f4;
		height: calc(100vh - 84px);

		.info{
			margin: 0 0 10px;
			.rightsearch{
				text-align: right;color: #999;margin: 0 0 15px;
				.btn{
					border: 0;margin: 0 5px;border-radius: 30px;
					height: auto;padding: 5px 0;
				}
				.green{
					background: #09bec5;color: #fff;padding: 5px 15px;
				}
			}
			.item{
				padding: 20px 30px;box-shadow: 0 0 10px #eee;border-radius: 5px;
				img{}
				h3{
					margin: 0 0 15px;font-size: 36px;font-weight: bold;
				}
				h5{
					margin: 0;
				}
				.blue{color: #3a8fea;}
				.red{color: #f76c55;}
				.green{color: #0fd5ad;}
				.orange{color: #ffae00;}
			}
      .mar{
        margin-right: -18px;
      }
		}
		.tools{
			:deep(.el-card__body) {padding-bottom: 0;}
			:deep(.el-select) {width: 100%;}
			.toolbtn{
				float: right;border: 0;background: #09bec5;color: #fff;
			}
			.addtanchu{

				.danwei{
					position: absolute;right: 10px;top: 0;line-height: 32px;
					color: #aaa;
				}
				.textcenter{text-align: center;line-height: 1;}
				.parts{
					:deep(.el-row) {height: auto;margin: 10px 0 0;}
					:deep(.el-form-item__content) {
						display: block;
					}
					.partremove{
						cursor: pointer;
					}
					.partadd{
						color: #09bec5;cursor: pointer;
						:deep(.el-icon) {
							line-height: 1;vertical-align: middle;display: inline-block;
							height: auto;
						}
					}
				}
				.dialog-footer{
					display: block;width: 100%;text-align: center;margin-top: -20px;
					padding: 0 0 20px;
					.btn{
						width: 200px;
					}
					.green{background: #09bec5;color: #fff;border-color: #09bec5;}
				}
				:deep(.el-form) {
					.el-select{
						width: 100%;
					}
				}
				:deep(.el-dialog) {
					overflow: hidden;
					.el-dialog__header{
						box-shadow: 0 5px 10px #eee;
					}
				}
			}
		}
		.table{
			padding: 10px;border: 1px solid #eee;background: #fff;
			box-shadow: 0 0 5px #eee;border-radius: 5px;
			height: calc(100% - 335px);position: relative;
			margin: 10px 0 0;
			.header{
				margin: 0 0 10px;
				padding: 10px 15px;
				border-bottom: 1px solid #f0f0f0;
				.card-tit {
				  padding-left: 10px;
				  border-left: 5px solid #09bec5;
				  font-size: 18px;
				}
			}

			.btn{
				height: auto;border: 0;padding: 0;color: #09bec5;
			}
			.btn.green{
				color: #46ba7f;
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
  //1366屏幕响应
  @media screen and (max-width: 1366px) {
    .baoyanggongdan{
      height: auto;
      .info {
        .item{
          padding: 20px 15px;
          .orange{
            text-align:center;
          }
          .green{
            text-align:center;
          }
          .red{
            text-align:center;
          }
          .blue{
            text-align:center;
          }
          h5{
            text-align: center;
          }
        }
      }
    }
  }
</style>
