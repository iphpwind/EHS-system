<template>
  <div class="fengxianguankong">
		<div class="table">
		  <div class="header">
		    <el-row>
		      <el-col :span="12"><div class="card-tit">风险管控措施</div></el-col>
<!--		      <el-col :span="12">-->
<!--						<el-button class="toolbtn" @click="goback">-->
<!--						  <el-icon><Back /></el-icon> 返回-->
<!--						</el-button>-->
<!--					</el-col>-->
		    </el-row>
			</div>
			<div class="topform">
				<el-form :model="eventParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
<!--					<el-form-item label="管控方式" prop="mode">-->
<!--						<el-input-->
<!--							v-model="queryParams.mode"-->
<!--							placeholder="请输入管控方式"-->
<!--							clearable-->
<!--							@keyup.enter="handleQuery"-->
<!--						/>-->
<!--					</el-form-item>-->
          <el-form-item label="分析对象" prop="objectId">
            <el-select v-model="eventParams.objectId" clearable filterable placeholder="全部" @change="seChange($event)">
              <el-option
                  v-for="item in obOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单元" prop="unitId">
            <el-select v-model="eventParams.unitId" clearable filterable placeholder="全部">
              <el-option
                  v-for="item in unitOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
<!--          <el-form-item label="风险事件" prop="eventId">-->
<!--            <el-select v-model="queryParams.eventId" clearable filterable placeholder="请选择" @change="seChange($event)">-->
<!--              <el-option-->
<!--                  v-for="item in eventOptions"-->
<!--                  :key="item.id"-->
<!--                  :label="item.name"-->
<!--                  :value="item.id"-->
<!--              ></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->

					<el-form-item class="fr">
						<el-button icon="Search" @click="handleQuery" class="chaxun">搜索</el-button>
						<el-button icon="Refresh" @click="resetQuery" >重置</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-row :gutter="20" class="mainbox">
				<el-col :span="6" :xs="24">
					<div class="leftbar">
						<el-table
								ref="singleTable"
								:data="tableData"
								highlight-current-row
								@cell-click="eventClick"
								height="100%"
								style="width: 100%">
<!--        accName      -->
              <el-table-column label="风险事件（最严重后果）" align="center" prop="name" >
                  <template #default="scope">
                    <span>{{scope.row.name}}({{scope.row.accName}})</span>
                  </template>
              </el-table-column>
						</el-table>
					</div>
				</el-col>
				<el-col :span="18" class="righttable">
					<div class="topword">
						<div class="item"><el-icon><Warning /></el-icon><span>检查标准：</span>{{events.standard}}</div>
						<div class="item"><el-icon><DataAnalysis /></el-icon><span>不符合标准情况及后果：</span>{{events.conseq}}</div>
					</div>
					<div class="toolbtn">
							<el-button class="btn"
									plain
									icon="Download"
									@click="measureform"
									v-hasPermi="['safework:measure:export']"
							>导出模板</el-button>
							<el-button class="btn"
									plain
									icon="upload"
									@click="handleImport"
									v-hasPermi="['safework:measure:export']"
							>导入</el-button>
							<el-button class="btn"
									plain
									icon="Plus"
									@click="handleAdd"
									v-hasPermi="['safework:measure:add']"
							>新增</el-button>
	<!--          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>-->
					</div>

					<el-table
					v-loading="loading" border
					:data="measureList"
					@selection-change="handleSelectionChange"
					height="calc(100% - 150px)"
					>
						<el-table-column type="selection" width="55" align="center" />
						<el-table-column label="管控方式" align="center" prop="mode" />
						<el-table-column label="措施分类" align="center" prop="className" />
						<el-table-column label="管控措施描述" align="center" prop="depict" />
            <el-table-column label="负责人" align="center" prop="userNames" />
            <el-table-column label="周期" align="center" prop="cycles" />
						<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
							<template #default="scope">
								<el-button
										class="btn"
										type="text"
										icon="Edit"
										@click="handleUpdate(scope.row)"
										v-hasPermi="['safework:measure:edit']"
								>修改</el-button>
								<el-button
									class="btn"
										type="text"
										icon="Delete"
										@click="handleDelete(scope.row)"
										v-hasPermi="['safework:measure:remove']"
								>删除</el-button>
							</template>
						</el-table-column>
					</el-table>

					<pagination
							v-show="total>0"
							:total="total"
							v-model:page="queryParams.pageNum"
							v-model:limit="queryParams.pageSize"
							@pagination="getList"
					/>
				</el-col>
			</el-row>
		</div>


    <!-- 添加或修改风险管控措施对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="measureRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="管控方式" prop="mode">
          <el-input v-model="form.mode" placeholder="请输入管控方式" />
        </el-form-item>
        <el-form-item label="管控分类" prop="classId">
          <el-select v-model="form.classId" clearable filterable placeholder="请选择">
            <el-option
                v-for="item in methodList"
                :key="item.id"
                :label="item.controlMethodClassifyone+'-'+item.controlMethodClassifytwo"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="措施细分" prop="mince">
          <el-input v-model="form.mince" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="管控措施描述" prop="depict">
          <el-input v-model="form.depict" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="隐患排查内容" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div class="attr">
        <div class="addbtn"><el-button type="primary" @click="addAttr">新增排查周期</el-button></div>
        <div class="attr-buttom" style="background: #e5e2e2;margin-top: 10px;padding: 10px;border-bottom: 1px solid #f5f5f5;">
          <el-row :gutter="10" >
            <el-col :span="5">岗位负责人</el-col>
            <el-col :span="5">周期</el-col>
            <el-col :span="5">单位</el-col>
            <el-col :span="5">管控层级</el-col>
            <el-col :span="4">操作</el-col>
          </el-row>
        </div>

        <div v-for="(value,index) in form.measureArrList" class="attrli">
          <el-row :gutter="10">
            <el-col :span="5">
              <el-input v-model="value.chargeName"></el-input>
            </el-col>
            <el-col :span="5">
              <el-input v-model="value.cycle"></el-input>
            </el-col>
            <el-col :span="5">
              <el-input v-model="value.unit"></el-input>
            </el-col>
            <el-col :span="5">
              <el-input v-model="value.unitLevelName"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button @click="deleteAttr(index,value.id)">删除</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="添加风险管控措施属性" v-model="arropen" width="500px" append-to-body>
      <el-form ref="measureArrRef" :model="arrform" :rules="rules" label-width="100px">
        <el-form-item label="岗位负责人" prop="chargeUser">
          <el-select v-model="arrform.chargeUser" placeholder="请选择" filterable>
            <el-option
                v-for="item in useroptions"
                :key="item.staffId"
                :label="item.staffDeptName"
                :value="item.staffId"
                @click="getUserName(item.staffName)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="周期" prop="cycle">
          <el-input v-model="arrform.cycle" placeholder="请输入周期" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-select v-model="arrform.unit" placeholder="请输入单位">
            <el-option label="时" value="时" />
            <el-option label="天" value="天" />
            <el-option label="月" value="月" />
            <el-option label="年" value="年" />
          </el-select>
        </el-form-item>
        <el-form-item label="管控层级" prop="unitLevelId">
          <el-select v-model="arrform.unitLevelId" placeholder="请选择" clearable filterable>
            <el-option
                v-for="item in leveloptions"
                :key="item.id"
                :label="item.levelName"
                :value="item.id"
                @click="getlevelName(item.levelName)"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="arrsubmitForm">确 定</el-button>
          <el-button @click="arrcancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog :title="upload.title" v-model="upload.importOpen" width="400px" append-to-body>
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
            <!--            <div class="el-upload__tip">
                          <el-checkbox v-model="upload.updateSupport"/>
                          是否更新已经存在的对象数据
                        </div>-->
            <span>仅允许导入xls、xlsx格式文件。</span>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.importOpen = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Measure">
import { listMeasure, getMeasure, delMeasure, addMeasure, updateMeasure } from "@/api/safework/measure";
import { listEvent } from "@/api/safework/event";
import { listControlmethod } from "@/api/safework/controlmethod";
import {getToken} from "../../../utils/auth";
import { listUnit } from "@/api/safework/unit";
import { listObject } from "@/api/safework/object";
import { getUserList } from "@/api/system/user";
import { listStaff } from "@/api/system/staff";
import { listLevel} from "@/api/safework/level";
import {h} from "vue";
const { proxy } = getCurrentInstance();

const measureList = ref([]);
const methodList = ref([]);
const tableData = ref([]);
const open = ref(false);
const arropen = ref(false);
const loading = ref(false);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const obOptions = ref([]);
const unitOptions = ref([]);
const eventOptions = ref([]);
const useroptions = ref([]);
const leveloptions = ref([]);

const upload = reactive({
  // 是否显示弹出层（导入）
  importOpen: false,
  // 弹出层标题（导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: {Authorization: "Bearer " + getToken()},
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/safework/measure/importData"
});

const handleFileSuccess = (response, file, fileList) => {
  upload.importOpen = false;
  proxy.$refs["uploadRef"].clearFiles();
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
  getList();
};

const data = reactive({
  form: {},
  arrform: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    eventId: null,
    mode: null,
    classId: null,
  },
  eventParams: {
    objectId: null,
    unitId: null
  },
  rules: {
    classId: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
    depict: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
    content: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
  },
  events: {
    standard:'',
    conseq:''
  }
});

const { queryParams, form, rules, events,eventParams,arrform } = toRefs(data);

function getUserName(val){
  arrform.value.chargeName = val;
}

function getlevelName(val){
  arrform.value.unitLevelName = val;
}

/** 查询风险分析单元管控层级字典列表 */
function getlevelList() {
  listLevel({delFlag:0}).then(response => {
    leveloptions.value = response.rows;
  });
}

function addAttr(){
  arreset();
  console.log(form.value.measureArrList)
  arropen.value = true;
}

function deleteAttr(index,id){

  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    /*if (id) {
      return delAttributes(id);
    }*/
  }).then(() => {
    form.value.measureArrList.splice(index,1)
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});

}

function arrsubmitForm(){
  arropen.value = false;
  proxy.$refs["measureArrRef"].validate(valid => {
    if (valid) {
      form.value.measureArrList.push(arrform.value)
    }
  });
}

function getObject() {
  listObject({delFlag:0}).then(res => {
    obOptions.value = res.rows;
  })
}
function getUnit() {
  listUnit({delFlag:0,objectId:eventParams.value.objectId}).then(res => {
    unitOptions.value = res.rows
  })
}
function seChange(val) {
  getUnit();
}


function getEvent() {
  listEvent(eventParams.value).then(res => {
    tableData.value = res.rows
  })
}
function getMethod() {
  listControlmethod({delFlag:0}).then(res => {
    methodList.value = res.rows;
  })
}

function eventClick(row) {
  events.value = row
  queryParams.value.eventId = row.id
  // form.value.eventId = row.id
  getList()
}

/** 查询风险管控措施列表 */
function getList() {
  loading.value = true;
  listMeasure(queryParams.value).then(response => {
    measureList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

//获取用户
function getUsersList() {
  listStaff({delFlag:'0'}).then(response => {
    useroptions.value = response.rows;//list数据
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 取消按钮
function arrcancel() {
  arropen.value = false;
  arreset();
}

// 表单重置
function arreset() {
  arrform.value = {
    id: null,
    chargeUser: null,
    cycle: null,
    unit: null,
    unitLevelId: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  // proxy.resetForm("measureArrRef");
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    eventId: null,
    mode: null,
    classId: null,
    mince: null,
    depict: null,
    content: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    measureArrList: []
  };
  proxy.resetForm("measureRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  // getList();
  getEvent();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {

  if (events.value.id != null && events.value.id != ''){
    reset();
    open.value = true;
    title.value = "添加风险管控措施";
  } else {
    proxy.$modal.msgError('请选择风险事件！')
  }

}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getMeasure(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改风险管控措施";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["measureRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateMeasure(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        form.value.eventId = events.value.id;
        addMeasure(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const idss = row.id || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delMeasure(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

//导出模板
function measureform(){
  proxy.download('safework/measure/exportTemplate', {
    ...queryParams.value
  }, `风险管控措施_${new Date().getTime()}.xlsx`)
}
/** 导入 */
function handleImport(){
  upload.title = "导入";
  upload.importOpen = true;
}

/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
};

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/measure/export', {
    ...queryParams.value
  }, `measure_${new Date().getTime()}.xlsx`)
}

// getList();
getObject();
getUnit();
//getEvent();
getMethod();
getUsersList();
getlevelList();
</script>

<style scoped lang="scss">
	.fengxianguankong{
		padding: 10px;background: #f3f3f4;
		height: calc(100vh - 84px);

		.table{
		  padding: 10px;border: 1px solid #eee;background: #fff;
		  box-shadow: 0 0 5px #eee;border-radius: 5px;
		  height: 100%;position: relative;
		  .header{
		    margin: 0 0 10px;
		    padding: 10px 15px;
		    border-bottom: 1px solid #f0f0f0;
		    .card-tit {
		      padding-left: 10px;
		      border-left: 5px solid #09bec5;
		      font-size: 18px;
		    }
				.toolbtn{
				  float: right;border: 0;color: #fff;
					border-radius: 20px;
					height: auto;padding: 5px 15px;
					background-image:linear-gradient(to right, #38dfd8, #1dc2bc);
				}
		  }
			.topform{
				padding: 5px 0 0 15px;border-bottom: 1px solid #eee;
				margin-bottom: 15px;
				.fr{float: right;}
				.chaxun{
					border:0;background: #09bec5;color: #fff;
				}
			}
		  .btn{
		    height: auto;border: 0;padding: 0;color: #09bec5;
		  }
		  .btn.green{
		    color: #46ba7f;
		  }
			.mainbox{
				height: calc(100% - 120px);
			}
			.leftbar{
				height: calc(100% - 15px);
				border: 1px solid #eee;
				:deep(.el-table) {
					.el-table__header-wrapper th{
					  font-size: 16px;font-weight: normal;
						padding: 20px 0;color: #333;
					}
					.el-scrollbar{
						margin: 15px;border: 1px solid #eee;
						width: calc(100% - 30px);
						height: calc(100% - 30px);
						.el-table__body{
							width: 100% !important;
							table-layout: auto;
							text-align: left;
							.el-table__cell{text-align: left;}
						}
					}
				}
				:deep(.el-table__inner-wrapper::before) {
					display: none;
				}
			}
			.righttable{
				padding: 10px 20px 10px 10px !important;
				height: 100%;
				.topword{
					color: #999;font-size: 14px;
					line-height: 18px;vertical-align: middle;
					.item{
						margin: 0 0 10px;
					}
					:deep(.el-icon) {
						color: #09bec5;font-size: 16px;
						margin-right: 10px;
						vertical-align: middle;
					}
					span{
						color: #333;vertical-align: middle;
					}
				}
				.toolbtn{
					margin: 10px 0;
					.btn{
						float: right;border: 1px solid #09bec5;
						color: #09bec5;padding: 8px 15px;
						margin: 0 5px;
					}
				}
				.toolbtn:before,.toolbtn::after{
					content: '';display: table;clear: both;
				}
				.pagination-container{
					margin: 0;position:relative;
				}
				:deep(.el-pagination.is-background .el-pager li:not(.disabled).active) {
					background: #09bec5;
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
					.el-table__border-left-patch{
						display: none;
					}
					.btn{
						color: #09bec5;
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
      .attr{
        padding:10px 20px 20px;
        .attr-buttom{
          border-bottom: 1px solid #f5f5f5;
          padding: 10px;
          background: #fbfbfb;
        }
        .attrli{

          margin: 10px 0;
        }
        .addbtn{
          margin-bottom: 10px;
        }
      }

		}
	}
</style>
