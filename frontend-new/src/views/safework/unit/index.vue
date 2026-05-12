<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="分析对象" prop="objectId">
        <el-select v-model="queryParams.objectId" clearable filterable placeholder="全部">
          <el-option
              v-for="item in obOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单元类型" prop="type">
        <el-select v-model="queryParams.type" clearable filterable placeholder="全部">
          <el-option
              key="设备设施"
              label="设备设施"
              value="设备设施"
          ></el-option>
          <el-option
              key="作业活动"
              label="作业活动"
              value="作业活动"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="风险等级" prop="riskLevel">
        <el-select v-model="queryParams.riskLevel" clearable filterable placeholder="全部">
          <el-option
              v-for="item in riskOptions"
              :key="item.riskLevelName"
              :label="item.riskLevelName"
              :value="item.riskLevelName"
          ></el-option>
        </el-select>
      </el-form-item>
<!--      <el-form-item label="责任部门" prop="deptId">-->
<!--        &lt;!&ndash;          <el-input v-model="form.deptId" placeholder="请输入责任部门" />&ndash;&gt;-->
<!--        <tree-select-->
<!--            v-model:value="queryParams.deptId"-->
<!--            :options="deptOptions"-->
<!--            placeholder="全部"-->
<!--            :objMap="{ value: 'id', label: 'label', children: 'children' }"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="编码" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入分析单元编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入分析单元名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="delFlag">
        <el-select v-model="queryParams.delFlag" clearable filterable placeholder="请选择">
          <el-option
              key="0"
              label="正常"
              value="0"
          ></el-option>
          <el-option
              key="1"
              label="停用"
              value="1"
          ></el-option>
        </el-select>
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
          v-hasPermi="['safework:unit:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['safework:unit:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:unit:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:unit:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="Download"
            @click="unitform"
            v-hasPermi="['safework:unit:export']"
        >导出模板</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="upload"
            @click="handleImport"
            v-hasPermi="['safework:unit:export']"
        >导入</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table height="calc(100vh - 330px)" v-loading="loading" :data="unitList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="${comment}" align="center" prop="id" />-->
      <el-table-column label="分析对象" align="center" prop="objectName" />
      <el-table-column label="编码" align="center" prop="code" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="单元类型" align="center" prop="type" />
      <el-table-column label="是否重大危险源" align="center" prop="ifMajor" />
      <el-table-column label="风险等级" align="center" prop="riskLevel" >
        <template #default="scope">
          <el-row justify="center" v-if="scope.row.riskLevel == '重大风险'"><span class="level" style="background-color: rgb(233, 0, 0);">{{scope.row.riskLevel}}</span></el-row>
          <el-row justify="center" v-else-if="scope.row.riskLevel == '较大风险'"><span class="level" style="background-color: rgb(239, 102, 0);">{{scope.row.riskLevel}}</span></el-row>
          <el-row justify="center" v-else-if="scope.row.riskLevel == '一般风险'"><span class="level" style="background-color: rgb(218, 192, 17);">{{scope.row.riskLevel}}</span></el-row>
          <el-row justify="center" v-else-if="scope.row.riskLevel == '低风险'"><span class="level" style="background-color: rgb(40, 140, 223);">{{scope.row.riskLevel}}</span></el-row>
          <el-row justify="center" v-else><span class="level" style="background-color: rgb(162,165,168);">暂未评级</span></el-row>
        </template>
      </el-table-column>
      <el-table-column label="责任部门" align="center" prop="enterpriseName" />
      <el-table-column label="所属岗位" align="center" prop="postName" />
      <el-table-column label="管控层级" align="center" prop="levelName" />
      <el-table-column label="负责人" align="center" prop="userName" />
      <el-table-column label="状态" align="center" prop="delFlag">
        <template #default="scope">
          <el-row justify="center" v-if="scope.row.delFlag == 0"><el-tag type="success">正常</el-tag></el-row>
          <el-row justify="center" v-else><el-tag type="danger">禁用</el-tag></el-row>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:unit:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:unit:remove']"
          >删除</el-button>
          <el-button
              type="text"
              @click="record(scope.row)"
          >风险等级</el-button>
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

    <!-- 添加或修改风险分析单元对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="unitRef" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="分析对象" prop="objectId">
<!--          <el-input v-model="form.objectId" placeholder="请输入分析单元编码" />-->
          <el-select v-model="form.objectId" clearable filterable placeholder="请选择">
            <el-option
                v-for="item in obOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入分析单元编码" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分析单元名称" />
        </el-form-item>
        <el-form-item label="单元类型" prop="type">
          <!--          <el-input v-model="form.objectId" placeholder="请输入分析单元编码" />-->
          <el-select v-model="form.type" clearable filterable placeholder="请选择">
            <el-option
                key="设备设施"
                label="设备设施"
                value="设备设施"
            ></el-option>
            <el-option
                key="作业活动"
                label="作业活动"
                value="作业活动"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否重大危险源" prop="ifMajor">
          <!--          <el-input v-model="form.objectId" placeholder="请输入分析单元编码" />-->
          <el-select v-model="form.ifMajor" clearable filterable placeholder="请选择">
            <el-option
                key="是"
                label="是"
                value="是"
            ></el-option>
            <el-option
                key="否"
                label="否"
                value="否"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="风险等级" prop="riskLevel">
<!--          <el-input v-model="form.riskLevel" placeholder="请输入风险等级" />-->
          <el-select v-model="form.riskLevel" clearable filterable placeholder="请选择">
            <el-option
                v-for="item in riskOptions"
                :key="item.riskLevelName"
                :label="item.riskLevelName"
                :value="item.riskLevelName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="责任部门" prop="deptId">
<!--          <el-input v-model="form.deptId" placeholder="请输入责任部门" />-->
          <tree-select
              v-model:value="form.deptId"
              :options="deptOptions"
              placeholder="请选择所属部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
          />
        </el-form-item>
        <el-form-item label="所属岗位" prop="postId">
<!--          <el-input v-model="form.postId" placeholder="请输入所属岗位" />-->
          <el-select v-model="form.postId" clearable filterable placeholder="请选择">
            <el-option
                v-for="item in postOptions"
                :key="item.postId"
                :label="item.postName"
                :value="item.postId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="管控层级" prop="levelId">
<!--          <el-input v-model="form.levelId" placeholder="请输入管控层级id" />-->
          <el-select v-model="form.levelId" clearable filterable placeholder="请选择">
            <el-option
                v-for="item in leOptions"
                :key="item.id"
                :label="item.levelName"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" prop="userId">
          <el-select v-model="form.userId" clearable filterable placeholder="请选择">
            <el-option
                v-for="item in personcolumns"
                :key="item.staffId"
                :label="item.staffDeptName"
                :value="item.staffId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="现场照片" prop="imgList">
          <ImageUpload
              v-model="form.imgList"
          />
        </el-form-item>
        <el-form-item label="相关资料" prop="fileList">
          <FileUpload
              v-model.value="form.fileList"
          />
<!--          <transition-group class="upload-file-list el-upload-list el-upload-list&#45;&#45;text" name="el-fade-in-linear" tag="ul">-->
<!--            <li :key="file.id" class="el-upload-list__item ele-upload-list__item-content" v-for="(file, index) in fileList">-->
<!--              <el-link :href="file.address" :underline="false" target="_blank">-->
<!--                <span class="el-icon-document"> {{ getFileName(file.address) }} </span>-->
<!--              </el-link>-->
<!--              <div class="ele-upload-list__item-content-action">-->
<!--                <el-link :underline="false" @click="handleDeletefile(index)" type="danger">删除</el-link>-->
<!--              </div>-->
<!--            </li>-->
<!--          </transition-group>-->
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.delFlag">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
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

<script setup name="Unit">
import { listUnit, getUnit, delUnit, addUnit, updateUnit } from "@/api/safework/unit";
import { getStaff,listStaff } from "@/api/system/staff";
import {treeselect} from "@/api/system/dept";
import { listObject } from "@/api/safework/object";
import { listLevel } from "@/api/safework/level";
import { listRisklevel } from "@/api/safework/risklevel";
import {userList} from "@/api/system/user";
import {getToken} from "../../../utils/auth";
import {listPost} from "@/api/system/post";
import {h} from "vue";
const { proxy } = getCurrentInstance();

const unitList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const deptOptions = ref(undefined);
const postOptions = ref([]);
const obOptions = ref([]);
const leOptions = ref([]);
const riskOptions = ref([]);
const personcolumns = ref([]);
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
  url: import.meta.env.VITE_APP_BASE_API + "/safework/unit/importData"
});

const handleFileSuccess = (response, file, fileList) => {
  upload.importOpen = false;
  proxy.$refs["uploadRef"].clearFiles();
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
  getList();
};

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    objectId: null,
    code: null,
    name: null,
    type: null,
    ifMajor: null,
    riskLevel: null,
    deptId: null,
    postId: null,
    levelId: null,
    userId: null,
    delFlag: '0'
  },
  rules: {
    objectId: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
    name: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
    code: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
    type: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
    ifMajor: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
    deptId: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
    levelId: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
    userId: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);


//部门修改触发事件
function getposts(){
  listPost().then(response => {
    postOptions.value = response.rows;
    console.log(postOptions.value)
  });
}

/** 查询风险分析单元列表 */
function getList() {
  loading.value = true;
  listUnit(queryParams.value).then(response => {
    unitList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
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
    objectId: null,
    code: null,
    name: null,
    type: null,
    ifMajor: null,
    riskLevel: null,
    deptId: null,
    postId: null,
    levelId: null,
    userId: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("unitRef");
}

/** 查询部门下拉树结构 */
function getTreeselect() {
  treeselect().then(response => {
    deptOptions.value = response.data;
  });
};

/* 查询风险分析对象 */

function getObject() {
  listObject({delFlag:0}).then(res => {
    obOptions.value = res.rows;
  })
}

/* 查询单元管控层级 */
function getLevel() {
  listLevel({delFlag:0}).then(res => {
    leOptions.value = res.rows;
  })
}

/*查询风险等级*/
function getRisk() {
  listRisklevel({delFlag:0}).then(res => {
    riskOptions.value = res.rows;
  })
}
/* 查询人员 */
function getUser(){
  listStaff({delFlag:'0'}).then(response => {
    personcolumns.value = response.rows;//list数据
  });
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
  form.value.delFlag = '0';
  open.value = true;
  title.value = "添加风险分析单元";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getUnit(id).then(response => {
    console.log("333333")
    console.log(postOptions.value)
    form.value = response.data;
    open.value = true;
    title.value = "修改风险分析单元";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["unitRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateUnit(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addUnit(form.value).then(response => {
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
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据及以下的风险事件、风险管控措施吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delUnit(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/unit/export', {
    ...queryParams.value
  }, `unit_${new Date().getTime()}.xlsx`)
}

function record(row) {
  proxy.$router.push({
    path: '/safework/ranking',
    query:{
      unitId:row.id,
      userId:row.userId,
      levelId:row.levelId,
      code:row.code
    }
  })
}


function unitform(){
  proxy.download('safework/unit/exportTemplate', {
    ...queryParams.value
  }, `风险单元_${new Date().getTime()}.xlsx`)
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

getList();
getTreeselect();
getposts();
getLevel();
getObject();
getUser();
getRisk();
</script>
<style>
.level{
  border-radius: 5px;
  padding: 2px 5px;
  color: #fff;
}
</style>
