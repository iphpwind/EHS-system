<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="课程编码" prop="courseCode">
        <el-input
          v-model="queryParams.courseCode"
          placeholder="请输入课程编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="课程名称" prop="courseName">
        <el-input
          v-model="queryParams.courseName"
          placeholder="请输入课程名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['safework:onlineCourse:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:onlineCourse:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:onlineCourse:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:onlineCourse:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="onlineCourseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="课程编码" align="center" prop="courseCode" />
      <el-table-column label="适用部门" align="center" prop="department" >
        <template #default="scope">
          <template v-for="(arr,index) in scope.row.department" :key="arr">
            <template v-for="dept in childDepts" :key="dept.deptId">
              <span v-if="Number(arr) === dept.deptId">{{dept.deptName}}</span>
              <span v-if="Number(arr) === dept.deptId && index<scope.row.department.length-1">,</span>
            </template>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="课程名称" align="center" prop="courseName" />
      <el-table-column label="所属分类" align="center" prop="categoryName" />
      <el-table-column label="所属级别" align="center" prop="level" >
        <template #default="scope">
          <dict-tag :options="courseLevel" :value="scope.row.level"/>
        </template>
      </el-table-column>
      <el-table-column label="关键字" align="center" prop="keywords" />
      <el-table-column label="素材" align="center" prop="materials" />
      <!-- <el-table-column label="封面" align="center" prop="cover" /> -->
			<el-table-column label="封面" align="center" prop="cover" >
			  <template #default="scope">
					<img :src="scope.row.cover" width="70" height="70"/>
			  </template>
			</el-table-column>
      <el-table-column label="教程简介" align="center" prop="courseSummary" />
      <el-table-column label="适用对象" align="center" prop="targetAudience" >
        <template #default="scope">
          <dict-tag :options="course_target" :value="scope.row.targetAudience"/>
        </template>
      </el-table-column>  
      <el-table-column label="首次学习是否可跳过" align="center" prop="skipFirstLearning" >
        <template #default="scope">
          <span v-if="scope.row.skipFirstLearning == 0">否</span>
          <span v-if="scope.row.skipFirstLearning == 1">是</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="createUserName" />
      <el-table-column label="状态" align="center" prop="status" >
        <template #default="scope">
          <dict-tag :options="status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:onlineCourse:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:onlineCourse:remove']"
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

    <!-- 添加或修改培训课程对话框 -->
    <el-dialog :title="title" v-model="open" width="880px" append-to-body custom-class="mydialog">
      <el-form ref="onlineCourseRef" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="课程编码" prop="courseCode">
          <el-input v-model="form.courseCode" placeholder="请输入课程编码" />
        </el-form-item>
        <el-form-item label="适用部门" prop="department">
          <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全选/全不选</el-checkbox>
          <el-tree
            class="tree-border"
            :data="deptOptions"
            show-checkbox
            ref="deptRef"
            node-key="id"
            empty-text="加载中..."
            :props="{ label: 'label', children: 'children' }"
          ></el-tree>
        </el-form-item>
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="form.courseName" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="所属分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择所属分类">
            <el-option
                v-for="dict in categoryList"
                :key="dict.id"
                :label="dict.name"
                :value="dict.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属级别" prop="level">
          <el-select v-model="form.level" placeholder="请选择所属级别" clearable>
            <el-option
                v-for="dict in courseLevel"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字" prop="keywords">
          <el-input v-model="form.keywords" placeholder="请输入关键字" />
        </el-form-item>
        <el-form-item label="素材" prop="materials">
          <el-button type="primary" @click="sucaiAdd">新建</el-button>
        </el-form-item>
        <el-form-item >
          <div class="timutable">
            <el-table :data="fileData" border style="width: 100%">
              <el-table-column type="index" width="50" />
              <el-table-column label="文件类型" width="150">
                <template #default="scope">
                  <span v-if="scope.row.type == 1">视频</span>
                  <span v-if="scope.row.type == 2">音频</span>
                  <span v-if="scope.row.type == 3">文档</span>
                </template>
              </el-table-column>
              <el-table-column label="文件名称" width="200">
                <template #default="scope">
                  <span v-if="scope.row.url != null">{{ scope.row.url.substring(scope.row.url.lastIndexOf('/')+1) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="时长" width="150" prop="times"/>
              <el-table-column label="操作" width="120">
                <template #default="scope">
                  <div class="timuhandle">
                    <el-icon @click="handleFileDelete(scope.row)" style="color: red;"><Delete /></el-icon>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
				<!-- 素材新增弹出 -->
				<el-dialog
					v-model="sucaiVisible"
					title="上传素材"
					width="620px"
				>
					<el-form-item label="文件类型" prop="type">
					  <el-select v-model="form.type" placeholder="请选择" @change="typeChange">
							<el-option
								v-for="item in typeoptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</el-form-item>
					<!-- <div v-if="form.type=='1'||form.type=='2'">
						<el-form-item label="上传视频/音频" prop="" append-to-body>
						  <el-upload
                ref="uploadRef1"
								class="upload-demo"
                :headers="upload.headers"
								:action="upload.url"
                :on-success="handleFileSuccess"
								:limit="1"
							>
								<el-button type="primary">上传视频/音频</el-button>
								<template #tip>
									<div style="color: red;">
										注：请上传20M内的mp4格式文件
									</div>
								</template>
							</el-upload>
						</el-form-item>
					</div>
					<div v-if="form.type=='3'">
						<el-form-item label="上传文档" prop="" append-to-body>
						  <el-upload
                ref="uploadRef2"
								class="upload-demo"
                :headers="upload.headers"
								:action="upload.url"
                :on-success="handleFileSuccess"
								:limit="1"
							>
							<el-button type="primary">上传文档</el-button>
								<template #tip>
									<div style="color: red;">
										注：支持文件格式pdf
									</div>
								</template>
							</el-upload>
						</el-form-item>
					</div> -->
					<el-form-item label="时长" prop="times">
					  <el-input placeholder="请输入时长" v-model="form.times"/>
					</el-form-item>
					<el-form-item label="文件上传" prop="upload" class="formupload">
						<form ref="qiniuDataForm" method="post" action="http://upload.qiniup.com"
					    enctype="multipart/form-data"  @submit.prevent="saveReport()">
					    <!-- <input name="key" type="hidden" :value="qiniuName">
					    <input name="x:fileName" type="hidden" :value="qiniuName"> -->
					    <input name="token" type="hidden" :value="upToken">
					    <input name="file" type="file" ref="file" :accept="fileType" class="uploadinput1" />
					    <input type="submit" value="上传文件" class="uploadinput2" />
					  </form>
					</el-form-item>
					
					<template #footer>
						<span class="dialog-footer">
							<el-button @click="sucaiVisible = false">取消</el-button>
							<el-button type="primary" @click="sucaiConfirm">确定</el-button>
						</span>
					</template>

          
          <!-- <input type="file" id="avatar" name="file" accept="image/png, image/jpeg" required @change="changeFile"> -->
					
					<div class="uploadTips" v-if="uploadFinish === true">上传成功！</div>
				</el-dialog>

        <el-form-item label="封面" prop="cover">
          <ImageUpload
              v-model.value="form.cover"
              :limit = "1"
          />
        </el-form-item>
        <el-form-item label="教程简介" prop="courseSummary">
          <el-input v-model="form.courseSummary" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="适用对象" prop="targetAudience">
          <el-radio-group v-model="form.targetAudience">
            <el-radio
                v-for="dict in course_target"
                :key="dict.value"
                :label="dict.value"
              >{{dict.label}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
				<div v-if="form.targetAudience!=1">
					<el-form-item label="首次学习是否可跳过" prop="skipFirstLearning">
						<el-radio-group v-model="form.skipFirstLearning">
							<el-radio label="0">否</el-radio>
							<el-radio label="1">是</el-radio>
						</el-radio-group>
					</el-form-item>
				</div>
        <el-form-item label="绑定试卷" prop="bindExam">
          <el-input v-model="form.bindExam" type="hidden"/>
          <el-input v-model="paperTitle" placeholder=""></el-input>
          <el-button type="button" @click="addtimu">添加试卷</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 添加试卷弹出 -->
		<div class="addtimutanchu">
			<el-dialog
				v-model="dialogAddtimu"
				title="选择试卷"
				width="60%"
			>
				<div class="search">
					<el-row :gutter="15">
						<el-col :span="7">
            <el-form-item label="所属分类" >
              <el-select v-model="paperQueryParams.classificationId" clearable placeholder="请输入分类">
                <el-option
                    v-for="item in classificationList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="试卷名称"  >
              <el-input
                  v-model="paperQueryParams.title"
                  placeholder="请输入试卷名称"
                  clearable
                  @keyup.enter="handleQuery"
              />
            </el-form-item>
            </el-col>
						<el-col :span="3">
							<el-button type="primary" @click="popSearch">查询</el-button>
						</el-col>
					</el-row>
					<el-table
						ref="multipleTableRef"
						:data="paperTableData"
						style="width: 100%"
            @select="select"
 					>
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="试卷名称" align="center" prop="title"/>
          <el-table-column label="命题方式" align="center" prop="propositionMethod" :formatter="topicFormatter"/>
          <el-table-column label="及格分数" align="center" prop="passingMark"/>
					</el-table>
				</div>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="dialogAddtimu = false">取消</el-button>
						<el-button type="primary" @click="addtimuConfirm">
							确定
						</el-button>
					</span>
				</template>
			</el-dialog>
		</div>
		
		
  </div>
</template>

<script setup name="OnlineCourse">
import { listOnlineCourse, getOnlineCourse, delOnlineCourse, addOnlineCourse, updateOnlineCourse } from "@/api/safework/onlineCourse";
import { listCourseFiles, getCourseFiles, delCourseFiles, addCourseFiles, updateCourseFiles,uploadFile,getQiNiuUpToken,getQinNiuUrl } from "@/api/safework/courseFiles";
import {listPaper, getPaper, delPaper, addPaper, updatePaper} from "@/api/safework/paper";
import { listCategory} from "@/api/safework/category";
import {selectChildrenDeptByDept} from '@/api/system/dept';
import {treeselect} from "../../../api/system/dept";
import {getToken} from "@/utils/auth";
import {listClassification} from "@/api/safework/classification";
import axios from 'axios'
import {h} from "vue";
const { proxy } = getCurrentInstance();
const { status,courseLevel,course_target } = proxy.useDict('status','courseLevel','course_target');
const onlineCourseList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const deptNodeAll = ref(false);
const deptOptions = ref([]);
const deptRef = ref(null); 
const categoryList = ref([]);
const fileData = ref([]);
const childDepts = ref([]);
const dialogAddtimu = ref(false);
const paperTableData = ref([]);
const classificationList = ref([]);
const upload = reactive({
  // 是否显示弹出层（设备导入）
  importOpen: false,
  // 弹出层标题（设备导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: {Authorization: "Bearer " + getToken()},
  // 上传的地址
  url: ref(import.meta.env.VITE_APP_BASE_API + "/file/upload")
});

const data = reactive({
  form: {
    targetAudience:1,
    skipFirstLearning:1,
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    enterpriseCode: null,
    courseCode: null,
    department: null,
    courseName: null,
    category: null,
    level: null,
    keywords: null,
    materials: null,
    cover: null,
    courseSummary: null,
    targetAudience:null,
    skipFirstLearning:null,
    bindExam: null,
    createdBy: null,
    updatedBy: null,
    status: null,
    courseId:null,
  },
  fileQueryParams: {
    pageNum: 1,
    pageSize: 10,
    courseId:null,
  },
  paperQueryParams: {
    pageNum: 1,
    pageSize: 10,
    deptId: null,
    classificationId: null,
    paperCode: null,
    title: null,
    validity: null,
    propositionMethod: null,
    topicType: null,
    passingMark: null,
    duration: null,
    releaseState: null
  },
  rules: {
  },
  selectPaper:[],
  paperTitle:null,
  uploadResult:{
    type : '',
    url : '',
    times : ''
  },
  upToken:'',
  qiniuName:'',
  fileType:'.pdf,.jpg,.jpeg',
	uploadFinish: false,
});

const { queryParams, form, rules,fileQueryParams,paperQueryParams,selectPaper,paperTitle,uploadResult,upToken,qiniuName,fileType,uploadFinish } = toRefs(data);

// 素材新增
const sucaiVisible = ref(false);
const type = ref('');
const typeoptions = [
  {
    value: '1',
    label: '视频',
  },
	{
	  value: '2',
	  label: '音频',
	},
	{
	  value: '3',
	  label: '文档',
	},
];
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    baseURL: import.meta.env.VITE_APP_BASE_API,
    // 超时
    timeout: 100000
})
const handleFileSuccess = (response, file, fileList) => {
  form.value.url = response.data.url;
  uploadResult.value.url = response.data.url;
};
function typeChange(type){
  if(type == '1'){
    fileType.value = '.video,.mp4'
  }else if(type == '2'){
    fileType.value = '.audio,.mp3'
  }else{
    fileType.value = '.pdf'
  }
}
function saveReport() {
  var file = proxy.$refs["file"].files[0];
  const formData = new FormData(proxy.$refs["qiniuDataForm"]);
  formData.append("key", file.name);
  service.post('https://upload.qiniup.com', formData).then(function (res) {
    let resultKey = res.data.key
    getQinNiuUrl({key:res.data.key}).then(response =>{
      form.value.url = decodeURIComponent(response)
      form.value.qiniuFileKey = resultKey
      uploadResult.value.url = decodeURIComponent(response)
			if(uploadResult.value.url.length>0){
				setTimeout(() => {
				  uploadFinish.value = true;
					setTimeout(() => {
					  uploadFinish.value = false;
					}, 2000)
				}, 400)
			}
    })
  })
	
}
function getUpToken(){
  getQiNiuUpToken().then(response => {
    upToken.value = response.msg
  });
}
function changeFile(e){
  var file = e.target.files[0];
  let formData = new FormData();
  formData.append("file", file);
  uploadFile(formData).then(response => {
  
  });
}
function addtimuConfirm(){
  form.value.bindExam = selectPaper.value.id
  paperTitle.value = selectPaper.value.title
  dialogAddtimu.value = false
}
function popSearch(){
  getPaperList();
}
function select(selection, row) {
    // 取消所有勾选
    proxy.$refs["multipleTableRef"].clearSelection();
    // 将当前行选中
    proxy.$refs["multipleTableRef"].toggleRowSelection(row, true);
    // proxy.$emit('handle-selection', row);
    selectPaper.value = row;
}

function topicFormatter(item) {
  let str = ''
  if (0 == item.propositionMethod) {
    str = '固定命题'
  } else {
    str = '随机命题'
  }
  return str
}
function getClassList() {
  listCategory({state: 0}).then(res => {
    classificationList.value = res.rows
  })
}
/** 查询线上教育-试卷列表 */
function getPaperList() {
  paperTableData.value = null;
  listPaper(paperQueryParams.value).then(response => {
    paperTableData.value = response.rows;
  });
}
function addtimu() {
  if(form.value.targetAudience == 1){
    paperQueryParams.value.propositionMethod = 1
  }else{
    paperQueryParams.value.propositionMethod = null
  }
  getPaperList();
	dialogAddtimu.value = true;
	// proxy.$refs["multipleTableRef"].clearSelection();
}
/** 删除按钮操作 */
function handleFileDelete(row) {
  const idss = row.id
  if(row.id == null){
    fileData.value = [];
  }else{
    proxy.$modal.confirm('确定删除吗?!').then(function() {
      return delCourseFiles(idss);
    }).then(() => {
      getCourseFileList();
      proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {});
  }
}

function sucaiAdd() {
	sucaiVisible.value = true;
	type.value = '';
  getUpToken();
  // fileData.value = [];
  proxy.$refs["uploadRef1"].clearFiles();
  proxy.$refs["uploadRef2"].clearFiles();
  
}
/** 查询培训课程素材列表 */
function getCourseFileList() {
  listCourseFiles(fileQueryParams.value).then(response => {
    fileData.value = response.rows;
  });
}
function sucaiConfirm() {
	sucaiVisible.value = false;
  uploadResult.value.type = form.value.type;
  uploadResult.value.times = form.value.times;
  fileData.value.push(uploadResult.value)
  if (form.value.id != null) {
    form.value.courseId = form.value.id
    addCourseFiles(form.value).then(response => {
      proxy.$modal.msgSuccess("新增成功");
    });
    // getCourseFileList();
  }
} 
/** 查询教育培训所属分类字典列表 */
function getCategoryList() {
  queryParams.value.pageSize = 100;
  listCategory(queryParams.value).then(response => {
    categoryList.value = response.rows;
  });
}

/** 查询培训课程列表 */
function getList() {
  loading.value = true;
  listOnlineCourse(queryParams.value).then(response => {
    if(response.total>0){
      for(let row of response.rows){
        if(row.department != ""){
          row.department = row.department.split(",");
        }
      }
    }
    onlineCourseList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}
/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value, type) {
  deptRef.value.setCheckedNodes(value ? deptOptions.value : []);
}

/** 所有部门节点数据 */
function getDeptAllCheckedKeys() {
  // 目前被选中的部门节点
  let checkedKeys = deptRef.value.getCheckedKeys();
  // 半选中的部门节点
  let halfCheckedKeys = deptRef.value.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys;
}

/** 查询部门树结构 */
function getDeptTreeselect() {
  return treeselect().then(response => {
    deptOptions.value = response.data;
    return response;
  });
}

// 查询登录账套下部门列表
function getDeptsByParentId(){
  selectChildrenDeptByDept().then(response =>{
    childDepts.value = response.data;
  })
}
// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    enterpriseCode: null,
    courseCode: null,
    department: null,
    courseName: null,
    category: null,
    level: null,
    keywords: null,
    materials: null,
    cover: null,
    courseSummary: null,
    targetAudience: null,
    skipFirstLearning: null,
    bindExam: null,
    createdBy: null,
    createTime: null,
    updatedBy: null,
    updateTime: null,
    status: 0,
    type:null,
    times:null
  };
  proxy.resetForm("onlineCourseRef");
  paperTitle.value = null;
  fileData.value = [];
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
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
  reset();
  open.value = true;
  title.value = "添加培训课程";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getOnlineCourse(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改培训课程";
    if(response.data.bindExam != null && response.data.bindExam !=''){
      getPaper(response.data.bindExam).then(response => {
        paperTitle.value = response.data.title
      });
    }
  });
  fileQueryParams.value.courseId = row.id || ids.value;
  getCourseFileList();
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["onlineCourseRef"].validate(valid => {
    if (valid) {
      form.value.department = getDeptAllCheckedKeys();
	    form.value.department = form.value.department.toString();
      if (form.value.id != null) {
        updateOnlineCourse(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addOnlineCourse(form.value).then(response => {
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
    return delOnlineCourse(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/onlineCourse/export', {
    ...queryParams.value
  }, `onlineCourse_${new Date().getTime()}.xlsx`)
}

getList();
getCategoryList();
getDeptTreeselect();
getDeptsByParentId();
getClassList();
</script>

<style scoped lang="scss">
	.mydialog{
		.el-input{
			width: 214px;
		}
		.avatar-uploader{
			border: 1px dashed #ddd;
		}
		
		.el-icon.avatar-uploader-icon {
		  font-size: 28px;
		  color: #8c939d;
		  width: 120px;
		  height: 120px;
		  text-align: center;
		}
	}
	.uploadTips{
		position: absolute;z-index: 999;
		left: 50%;transform: translateX(-50%);
		top: 50%;transform: translateY(-50%);
		padding: 20px;border-radius: 5px;
		background: rgba(0, 0, 0, 0.6);
		color: #fff;
	}
	.formupload{
		position: relative;
		.uploadinput1{
			border-radius: 3px;border: 1px solid #ddd;
			padding: 4px 5px;width: 214px;
		}
		.uploadinput2{
			position: absolute;
			left: 225px;
			border: 0;
			background: #42b983;
			border-radius: 3px;
			color: #fff;line-height: 32px;height: 32px;
			cursor: pointer;outline: none;
		}
	}
	
</style>
