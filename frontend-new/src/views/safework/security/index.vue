<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="安全制度编码" prop="securityNum">
        <el-input
          v-model="queryParams.securityNum"
          placeholder="请输入安全制度编码"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="安全制度分类" prop="sacuritySystemId">
        <el-select v-model="queryParams.sacuritySystemId" placeholder="请选择安全制度分类" clearable>
          <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="安全制度名称" prop="sacuritySystemName">
        <el-input
          v-model="queryParams.sacuritySystemName"
          placeholder="请输入安全制度名称"
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
          v-hasPermi="['safework:security:add']"
        >新增</el-button>
      </el-col>
<!--      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['safework:security:export']"
        >导出</el-button>
      </el-col>-->
      <el-col :span="1.5">
        <el-button
            type="info"
            plain
            icon="Upload"
            @click="handleImport"
        >导入
        </el-button>
        <el-button type="warning" plain icon="download"
                   @click="importTemplate">下载模板
        </el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="securityList">
      <el-table-column label="安全制度编码" align="center" prop="securityNum" />
      <el-table-column label="版本号" align="center" prop="version" />
      <el-table-column label="安全制度分类" align="center" prop="sacuritySystemDicName" />
      <el-table-column label="安全制度名称" align="center" prop="sacuritySystemName" />
      <el-table-column label="所属部门" align="center" prop="deptName" />
      <el-table-column label="发布日期" align="center" prop="publishDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.publishDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否现行" align="center" prop="isInforce">
        <template #default="scope">
          <span class="ok" v-if="scope.row.isInforce == 0">是</span>
          <span class="ok" v-if="scope.row.isInforce == 1">否</span>
        </template>
      </el-table-column>
      <el-table-column label="启用日期" align="center" prop="enableDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.enableDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="适用部门" align="center" prop="depNames">
        <template #default="scope">
          <template v-for="(arr,index) in scope.row.suitDeptIdArray" :key="arr">
            <template v-for="user in depts" :key="user.deptId">
              <span v-if="Number(arr) === user.deptId">{{user.deptName}}</span>
              <span v-if="Number(arr) === user.deptId && index<scope.row.suitDeptIdArray.length-1">,</span>
            </template>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="制度内容" align="center" prop="content" />
      <el-table-column label="状态" align="center" prop="delFlag">
        <template #default="scope">
          <span class="ok" v-if="scope.row.delFlag == 0">正常</span>
          <span class="ok" v-if="scope.row.delFlag == 1">停用</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:security:edit']"
          >修改</el-button>
          <el-button
            type="text"
            @click="handleLook(scope.row)"
          >查看</el-button>
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

    <!-- 添加或修改安全制度管理对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="securityRef" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="安全制度编码" prop="securityNum">
          <el-input v-model="form.securityNum" placeholder="请输入安全制度编码" />
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model="form.version" placeholder="请输入版本号" />
        </el-form-item>
        <el-form-item label="安全制度分类" prop="sacuritySystemId">
          <el-select v-model="form.sacuritySystemId" placeholder="请输入安全制度分类" clearable filterable>
            <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="安全制度名称" prop="sacuritySystemName">
          <el-input v-model="form.sacuritySystemName" placeholder="请输入安全制度名称" />
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <tree-select
              v-model:value="form.deptId"
              :options="deptOptions"
              placeholder="请选择所属部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
          />
        </el-form-item>
        <el-form-item label="发布日期" prop="publishDate">
          <el-date-picker clearable
            v-model="form.publishDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择发布日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否现行" prop="isInforce">
          <el-radio-group v-model="form.isInforce">
            <el-radio label="0">是</el-radio>
            <el-radio label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="启用日期" prop="enableDate">
          <el-date-picker clearable
            v-model="form.enableDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择启用日期">
          </el-date-picker>
        </el-form-item>
<!--        <el-form-item label="适用部门" prop="suitDeptId">
          <el-input v-model="form.suitDeptId" placeholder="请输入适用部门" />
        </el-form-item>-->
        <el-form-item label="适用部门" prop="suitDeptId">
          <el-input v-model="form.depNames" readonly @click="selectdep" style="width: 50%"/>
        </el-form-item>
        <el-form-item label="制度内容">
          <el-input v-model="form.content" placeholder="请输入制度内容" type="textarea"/>
        </el-form-item>
        <el-form-item label="说明" prop="introduce">
          <el-input v-model="form.introduce" placeholder="请输入说明" />
        </el-form-item>
        <el-form-item label="制度相关附件" prop="fileUrl">
          <FileUpload v-model.value="form.fileUrl" limit="5"/>
        </el-form-item>
        <el-form-item label="编制人" prop="preparedBy">
          <el-select v-model="form.preparedBy" multiple placeholder="请选择(多选)" filterable>
            <el-option
                v-for="item in useroptions1"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="评审人" prop="reviewBy">
          <el-select v-model="form.reviewBy" multiple placeholder="请选择(多选)" filterable>
            <el-option
                v-for="item in useroptions2"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="评审日期" prop="reviewDate">
          <el-date-picker clearable
            v-model="form.reviewDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择评审日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="参评人员" prop="partyBy">
          <el-select v-model="form.partyBy" multiple placeholder="请选择(多选)" filterable>
            <el-option
                v-for="item in useroptions3"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="填写人员" prop="insertBy">
          <el-select v-model="form.insertBy" multiple placeholder="请选择(多选)" filterable>
            <el-option
                v-for="item in useroptions4"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="填写人部门" prop="insertDept">
          <tree-select
              v-model:value="form.insertDept"
              :options="deptOptions"
              placeholder="请选择填写人部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
          />
        </el-form-item>
        <el-form-item label="评审相关附件" prop="reviewUrl">
          <FileUpload v-model.value="form.reviewUrl" limit="5"/>
        </el-form-item>
        <el-form-item label="评审意见" prop="reviewOpinion">
          <el-input v-model="form.reviewOpinion" placeholder="请输入评审意见" />
        </el-form-item>
        <el-form-item label="状态" prop="delFlag">
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
    <!-- 查看安全制度管理对话框 -->
    <el-dialog :title="title" v-model="detailopen" width="800px" append-to-body>
      <el-form ref="securityRef" :model="form" :rules="rules" label-width="180px" disabled>
        <el-form-item label="安全制度编码" prop="securityNum">
          <el-input v-model="detailform.securityNum" placeholder="请输入安全制度编码" />
        </el-form-item>
        <el-form-item label="版本号" prop="version">
          <el-input v-model="detailform.version" placeholder="请输入版本号" />
        </el-form-item>
        <el-form-item label="安全制度分类" prop="sacuritySystemId">
          <el-select v-model="detailform.sacuritySystemId" placeholder="请输入安全制度分类" clearable filterable>
            <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="安全制度名称" prop="sacuritySystemName">
          <el-input v-model="detailform.sacuritySystemName" placeholder="请输入安全制度名称" />
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <tree-select
              v-model:value="detailform.deptId"
              :options="deptOptions"
              placeholder="请选择所属部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
          />
        </el-form-item>
        <el-form-item label="发布日期" prop="publishDate">
          <el-date-picker clearable
                          v-model="detailform.publishDate"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择发布日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否现行" prop="isInforce">
          <el-radio-group v-model="detailform.isInforce">
            <el-radio label="0">是</el-radio>
            <el-radio label="1">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="启用日期" prop="enableDate">
          <el-date-picker clearable
                          v-model="detailform.enableDate"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择启用日期">
          </el-date-picker>
        </el-form-item>
        <!--        <el-form-item label="适用部门" prop="suitDeptId">
                  <el-input v-model="form.suitDeptId" placeholder="请输入适用部门" />
                </el-form-item>-->
        <el-form-item label="适用部门" prop="suitDeptId">
          <el-input v-model="detailform.depNames" readonly @click="selectdep" style="width: 50%"/>
        </el-form-item>
        <el-form-item label="制度内容">
          <el-input v-model="detailform.content" placeholder="请输入制度内容" type="textarea"/>
        </el-form-item>
        <el-form-item label="说明" prop="introduce">
          <el-input v-model="detailform.introduce" placeholder="请输入说明" />
        </el-form-item>
        <el-form-item label="制度相关附件" prop="fileUrl">
          <FileUpload v-model.value="detailform.fileUrl" limit="5"/>
        </el-form-item>
        <el-form-item label="编制人" prop="preparedBy">
          <el-select v-model="detailform.preparedBy" multiple placeholder="请选择(多选)" filterable>
            <el-option
                v-for="item in useroptions1"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="评审人" prop="reviewBy">
          <el-select v-model="detailform.reviewBy" multiple placeholder="请选择(多选)" filterable>
            <el-option
                v-for="item in useroptions2"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="评审日期" prop="reviewDate">
          <el-date-picker clearable
                          v-model="detailform.reviewDate"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择评审日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="参评人员" prop="partyBy">
          <el-select v-model="detailform.partyBy" multiple placeholder="请选择(多选)" filterable>
            <el-option
                v-for="item in useroptions3"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="填写人员" prop="insertBy">
          <el-select v-model="detailform.insertBy" multiple placeholder="请选择(多选)" filterable>
            <el-option
                v-for="item in useroptions4"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="填写人部门" prop="insertDept">
          <tree-select
              v-model:value="detailform.insertDept"
              :options="deptOptions"
              placeholder="请选择填写人部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
          />
        </el-form-item>
        <el-form-item label="评审相关附件" prop="reviewUrl">
          <FileUpload v-model.value="detailform.reviewUrl" limit="5"/>
        </el-form-item>
        <el-form-item label="评审意见" prop="reviewOpinion">
          <el-input v-model="detailform.reviewOpinion" placeholder="请输入评审意见" />
        </el-form-item>
        <el-form-item label="状态" prop="delFlag">
          <el-radio-group v-model="detailform.delFlag">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 部门信息列表 -->
    <el-dialog :title="dept.title" v-model="dept.open" width="50%" append-to-body>
      <el-form :model="queryParam1s" ref="queryRef1" :inline="true" label-width="70px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="部门名称" prop="deptName">
              <el-input
                  v-model="queryParam1s.deptName"
                  placeholder="请输入部门名称"
                  clearable
                  @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" icon="Search" @click="handleQuery1">搜索</el-button>
            <el-button type="success" @click="saveDept">确 定</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table
          ref="table"
          v-if="refreshTable"
          v-loading="loading1"
          :data="deptList"
          height="calc(100vh - 200px)"
          row-key="deptId"
          :default-expand-all="isExpandAll"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="deptName" label="部门名称"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <dict-tag :options="sys_normal_disable" :value="scope.row.status"/>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
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
  </div>
</template>

<script setup name="Security">
import { listSecurity, getSecurity, delSecurity, addSecurity, updateSecurity } from "@/api/safework/security";
import { listSecuritydic} from "@/api/safework/securitydic";
import {treeselect,listDept} from "@/api/system/dept";
import { getUserList } from "@/api/system/user";
import {getToken} from "@/utils/auth";
import {h, ref} from "vue";

const { proxy } = getCurrentInstance();

const securityList = ref([]);
const options = ref([]);
const deptOptions = ref(undefined);
const open = ref(false);
const detailopen = ref(false);
const loading = ref(true);
const loading1 = ref(true);
const refreshTable = ref(true);
const tables = ref([]);
const tableNames = ref([]);
const useroptions = ref([]);
const useroptions1 = ref([]);
const useroptions2 = ref([]);
const useroptions3 = ref([]);
const useroptions4 = ref([]);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const deptList = ref([]);
const depts = ref([]);
const total = ref(0);
const title = ref("");
const isExpandAll = ref(true);
const dept = reactive({
  // 是否显示弹出层
  open: false,
  // 弹出层标题
  title: "部门列表",
});
/***导入参数 */
const upload = reactive({
  // 是否显示弹出层（导入）
  open: false,
  // 弹出层标题（导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的人员数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: {Authorization: "Bearer " + getToken()},
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/safework/security/importData"
});

const data = reactive({
  form: {},
  detailform: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    enterpriseCode: null,
    securityNum: null,
    version: null,
    sacuritySystemId: null,
    sacuritySystemName: null,
    deptId: null,
    publishDate: null,
    isInforce: null,
    enableDate: null,
    suitDeptId: null,
    content: null,
    introduce: null,
    fileUrl: null,
    preparedBy: null,
    reviewBy: null,
    reviewDate: null,
    partyBy: null,
    insertBy: null,
    insertDept: null,
    reviewUrl: null,
    reviewOpinion: null,
  },
  queryParam1s: {
    deptName: null,
  },
  rules: {
    securityNum: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
    version: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
    sacuritySystemId: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
    sacuritySystemName: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
    deptId: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
    publishDate: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
    isInforce: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
    enableDate: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
    suitDeptId: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
    preparedBy: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
    reviewBy: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
    reviewDate: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
  }
});

const { queryParams, form, rules,queryParam1s,detailform } = toRefs(data);
const {sys_normal_disable} = proxy.useDict("sys_normal_disable");



/** 部门搜索按钮操作 */
function handleQuery1() {
  getdept();
}

/** 导入按钮操作 */
function handleImport() {
  upload.title = "导入";
  upload.open = true;
};
/** 下载模板操作 */
function importTemplate() {
  proxy.download("safework/security/importTemplate", {}, `安全制度模板${new Date().getTime()}.xlsx`);
};
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
  upload.open = false;
  upload.isUploading = false;
  proxy.$refs["uploadRef"].clearFiles();
  proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", {dangerouslyUseHTMLString: true});
  getList();
};
/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs["uploadRef"].submit();
};

//获取用户
function getUsersList() {
  getUserList().then(response => {
    useroptions.value = response.rows;//list数据
    useroptions1.value = response.rows;//list数据
    useroptions2.value = response.rows;//list数据
    useroptions3.value = response.rows;//list数据
    useroptions4.value = response.rows;//list数据
  });
}

// 多选框选中数据
function handleSelectionChange(selection) {
  tables.value = selection.map(item => item.deptId);
  tableNames.value = selection.map(item => item.deptName);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

function getdept(){
  loading1.value = true;
  listDept(queryParam1s.value).then(response => {
    deptList.value = proxy.handleTree(response.data, "deptId");
    depts.value = response.data;
    getList();
  });
  loading1.value = false;
}

//获取部门数据
function selectdep(){
  dept.open = true;
  if(form.value.suitDeptId != null && form.value.suitDeptId != ""){
    const deptIds = form.value.suitDeptId.split(",");
    proxy.$nextTick(() => {
      depts.value.forEach((dept) => {
        deptIds.forEach(deptId => {
          if(Number(deptId) == dept.deptId){
            proxy.$refs.table.toggleRowSelection(dept,true);
          }
        })
      });
    })
  }
}

function saveDept(){
  const deptIds = tables.value.join(",");
  const deptNames = tableNames.value.join(",");
  if (deptIds == "") {
    proxy.$modal.msgError("请选择部门");
    return;
  }
  form.value.suitDeptId = deptIds;//适用部门
  form.value.depNames = deptNames;
  dept.open = false;
}

/** 查询安全制度管理列表 */
function getList() {
  loading.value = true;
  listSecurity(queryParams.value).then(response => {
    if(response.total>0){
      for(let row of response.rows){
        if(row.suitDeptId != ""){
          row.suitDeptIdArray = row.suitDeptId.split(",");
        }
      }
    }

    securityList.value = response.rows;

    total.value = response.total;
    loading.value = false;
  });
}

function getDicList(){
  listSecuritydic({delFlag:0}).then(response => {
    options.value = response.rows;
  });
}

/** 查询部门下拉树结构 */
function getTreeselect() {
  treeselect().then(response => {
    deptOptions.value = response.data;
  });
};

// 取消按钮
function cancel() {
  open.value = false;
  detailopen.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    enterpriseCode: null,
    securityNum: null,
    version: null,
    sacuritySystemId: null,
    sacuritySystemName: null,
    deptId: null,
    publishDate: null,
    isInforce: null,
    enableDate: null,
    suitDeptId: null,
    content: null,
    introduce: null,
    fileUrl: null,
    preparedBy: null,
    reviewBy: null,
    reviewDate: null,
    partyBy: null,
    insertBy: null,
    insertDept: null,
    reviewUrl: null,
    reviewOpinion: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("securityRef");
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

/** 新增按钮操作 */
function handleAdd() {
  reset();
  form.value.isInforce = '0'
  form.value.delFlag = '0'
  open.value = true;
  title.value = "添加安全制度管理";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  let shu = [];
  let shu1 = [];
  let shu2 = [];
  let shu3 = [];
  getSecurity(id).then(response => {
    if(response.data.suitDeptId != ""){
      response.data.suitDeptIdArray = response.data.suitDeptId.split(",");
      var deptNames = [];
      for(let id of response.data.suitDeptIdArray){
        for(let dep of depts.value){
          if(Number(id) == dep.deptId){
            deptNames.push(dep.deptName);
          }
        }
      }
      response.data.depNames = deptNames.join(',');
    }

    let aa = response.data.preparedBy.split(",");
    aa.forEach((j, index) => {
      shu.push(parseInt(j))
    })
    response.data.preparedBy = shu;

   let bb = response.data.reviewBy.split(",");
    bb.forEach((j, index) => {
      shu1.push(parseInt(j))
    })
    response.data.reviewBy = shu1;

    let cc = response.data.insertBy.split(",");
    cc.forEach((j, index) => {
      shu2.push(parseInt(j))
    })
    response.data.insertBy = shu2;

    let dd = response.data.partyBy.split(",");
    dd.forEach((j, index) => {
      shu3.push(parseInt(j))
    })
    response.data.partyBy = shu3;

    form.value = response.data;
    open.value = true;
    title.value = "修改安全制度管理";
  });
}

function handleLook(row){
  reset();
  const id = row.id || ids.value
  let shu = [];
  let shu1 = [];
  let shu2 = [];
  let shu3 = [];
  getSecurity(id).then(response => {
    if(response.data.suitDeptId != ""){
      response.data.suitDeptIdArray = response.data.suitDeptId.split(",");
      var deptNames = [];
      for(let id of response.data.suitDeptIdArray){
        for(let dep of depts.value){
          if(Number(id) == dep.deptId){
            deptNames.push(dep.deptName);
          }
        }
      }
      response.data.depNames = deptNames.join(',');
    }

    let aa = response.data.preparedBy.split(",");
    aa.forEach((j, index) => {
      shu.push(parseInt(j))
    })
    response.data.preparedBy = shu;

    let bb = response.data.reviewBy.split(",");
    bb.forEach((j, index) => {
      shu1.push(parseInt(j))
    })
    response.data.reviewBy = shu1;

    let cc = response.data.insertBy.split(",");
    cc.forEach((j, index) => {
      shu2.push(parseInt(j))
    })
    response.data.insertBy = shu2;

    let dd = response.data.partyBy.split(",");
    dd.forEach((j, index) => {
      shu3.push(parseInt(j))
    })
    response.data.partyBy = shu3;

    detailform.value = response.data;
    detailopen.value = true;
    title.value = "修改安全制度管理";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["securityRef"].validate(valid => {
    if (valid) {
      form.value.insertBy = form.value.insertBy.join(',')
      form.value.partyBy = form.value.partyBy.join(',')
      form.value.preparedBy = form.value.preparedBy.join(',')
      form.value.reviewBy = form.value.reviewBy.join(',')

      if (form.value.id != null) {
        updateSecurity(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addSecurity(form.value).then(response => {
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
    return delSecurity(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/security/export', {
    ...queryParams.value
  }, `security_${new Date().getTime()}.xlsx`)
}
getdept();
getDicList();
getTreeselect();
getUsersList();
</script>
