<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
              v-model="deptName"
              placeholder="请输入部门名称"
              clearable
              prefix-icon="Search"
              style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container down-tree">
          <el-tree
              :data="deptOptions"
              :props="{ label: 'label', children: 'children' }"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="deptTreeRef"
              default-expand-all
              @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="70px">
          <el-form-item label="账号" prop="userName">
            <el-input
                v-model="queryParams.userName"
                placeholder="请输入账号"
                clearable
                style="width: 240px"
                @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="用户姓名" prop="nickName">
            <el-input
                v-model="queryParams.nickName"
                placeholder="请输入用户姓名"
                clearable
                style="width: 240px"
                @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            <el-button @click="showAdvancedSearch = !showAdvancedSearch">
              {{ showAdvancedSearch ? '收起' : '高级搜索' }}
            </el-button>
          </el-form-item>
        </el-form>
        <div v-if="showAdvancedSearch" style="margin-bottom: 15px;">
          <el-form :model="queryParams" ref="advancedSearchRef" :inline="true" label-width="70px">
            <el-form-item label="手机号" prop="phonenumber">
              <el-input
                  v-model="queryParams.phonenumber"
                  placeholder="请输入手机号"
                  clearable
                  style="width: 200px"
                  @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input
                  v-model="queryParams.email"
                  placeholder="请输入邮箱"
                  clearable
                  style="width: 200px"
                  @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="创建时间" style="width: 308px">
              <el-date-picker
                  v-model="dateRange"
                  value-format="YYYY-MM-DD"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-form>
        </div>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
                type="primary"
                plain
                icon="Plus"
                @click="handleAdd"
                v-hasPermi="['system:user:add']"
            >新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="success"
                plain
                icon="Edit"
                :disabled="single"
                @click="handleUpdate"
                v-hasPermi="['system:user:edit']"
            >修改
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="danger"
                plain
                icon="Delete"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermi="['system:user:remove']"
            >删除
            </el-button>
          </el-col>
          <!-- <el-col :span="1.5">
            <el-button
                type="info"
                plain
                icon="Upload"
                @click="handleImport"
                v-hasPermi="['system:user:import']"
            >导入
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
                type="warning"
                plain
                icon="Download"
                @click="handleExport"
                v-hasPermi="['system:user:export']"
            >导出
            </el-button>
          </el-col> -->
          <el-col :span="1.5">
            <el-button
                type="info"
                plain
                icon="Upload"
                @click="handleImport"
                v-hasPermi="['system:user:import']"
            >导入
            </el-button>
            <el-button type="warning" plain icon="download"
                       @click="importTemplate">下载模板
            </el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
        </el-row>

        <el-table height="calc(100vh - 310px)" v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center"/>
<!--          <el-table-column label="用户编号" align="center" key="userId" prop="userId" v-if="columns[0].visible"/>-->
          <el-table-column label="账号" align="center" key="userName" prop="userName" v-if="columns[1].visible"
                           :show-overflow-tooltip="true"/>
          <!-- <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName" v-if="columns[2].visible"
                           :show-overflow-tooltip="true"/> -->
          <el-table-column label="姓名" align="center" key="staffName" prop="staffName" v-if="columns[7].visible"/>
          <el-table-column label="部门" align="center" key="deptName" prop="dept.deptName" v-if="columns[3].visible"
                           :show-overflow-tooltip="true"/>
          <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber" v-if="columns[4].visible"
                           width="120"/>
          <el-table-column label="状态" align="center" key="status" v-if="columns[5].visible">
            <template #default="scope">
              <el-switch
                  v-model="scope.row.status"
                  active-value="0"
                  inactive-value="1"
                  @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[6].visible" width="160">
            <template #default="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width" fixed="right">
            <template #default="scope">
              <el-tooltip content="修改" placement="top" v-if="scope.row.userId !== 1">
                <el-button
                    type="text"
                    icon="Edit"
                    @click="handleUpdate(scope.row)"
                    v-hasPermi="['system:user:edit']"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top" v-if="scope.row.userId !== 1">
                <el-button
                    type="text"
                    icon="Delete"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['system:user:remove']"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="重置密码" placement="top" v-if="scope.row.userId !== 1">
                <el-button
                    type="text"
                    icon="Key"
                    @click="handleResetPwd(scope.row)"
                    v-hasPermi="['system:user:resetPwd']"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="分配角色" placement="top" v-if="scope.row.userId !== 1">
                <el-button
                    type="text"
                    icon="CircleCheck"
                    @click="handleAuthRole(scope.row)"
                    v-hasPermi="['system:user:edit']"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form :model="form" :rules="rules" ref="userRef" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="员工" prop="staffName">
              <el-input v-model="form.staffName" placeholder="请选择员工" readonly @click="getStffList"/>
            </el-form-item>
            <el-form-item label="员工id" prop="staffId" v-if="false">
              <el-input v-model="form.staffId" />
              <el-input v-model="form.email" />
              <el-input v-model="form.phonenumber" />
              <el-input v-model="form.sex" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="flag">
          <el-col :span="24">
            <el-form-item label="所属部门" prop="deptId">
              <tree-select
                  v-model:value="form.deptId"
                  :options="deptOptions"
                  placeholder="请选择所属部门"
                  :objMap="{ value: 'id', label: 'label', children: 'children' }"
                  @func="getMsg"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户账号" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入账号" v-if="form.userId == undefined"/>
              <el-input v-model="form.userName" placeholder="请输入账号" v-if="form.userId != undefined" readonly/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户姓名" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入用户姓名"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item v-if="form.userId == undefined" label="密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入密码" type="password" show-password/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色">
              <el-select filterable v-model="form.roleIds" multiple placeholder="请选择">
                <el-option
                    v-for="item in roleOptions"
                    :key="item.roleId"
                    :label="item.roleName"
                    :value="item.roleId"
                    :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                    v-for="dict in sys_normal_disable"
                    :key="dict.value"
                    :label="dict.value"
                >{{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 用户导入对话框 -->
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
                <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                         @click="importTemplate">下载模板
                </el-link>
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

    <!-- 人员信息列表 -->
    <el-dialog :title="staff.title" v-model="staff.open" width="50%" append-to-body>
      <el-form :model="queryParam1s" ref="queryRef1" :inline="true" label-width="70px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="工号" prop="staffNo">
              <el-input
                  v-model="queryParam1s.staffNo"
                  placeholder="请输入工号"
                  clearable
                  @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="用户姓名" prop="staffName">
              <el-input
                  v-model="queryParam1s.staffName"
                  placeholder="请输入用户姓名"
                  clearable
                  @keyup.enter="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" icon="Search" @click="handleQuery1">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table v-loading="loading" :data="staffList" @row-click="closeDetail">
        <el-table-column label="工号" align="center" key="staffNo" prop="staffNo"/>
        <el-table-column label="姓名" align="center" key="staffName" prop="staffName"/>
        <el-table-column label="性别" align="center" prop="sex">
          <template #default="scope">
            <el-row justify="center" v-if="scope.row.sex == 0">男性</el-row>
            <el-row justify="center" v-if="scope.row.sex == 1">女性</el-row>
          </template>
        </el-table-column>
        <el-table-column label="部门" align="center" key="deptName" prop="deptName"/>
        <el-table-column label="岗位" align="center" key="postName" prop="postName">
          <template #default="scope">
            <template v-for="(arr,index) in scope.row.postIds" :key="arr">
              <template v-for="user in postList" :key="user.postId">
                <span v-if="Number(arr) === user.postId">{{user.postName}}</span>
                <span v-if="Number(arr) === user.postId && index<scope.row.postIds.length-1">,</span>
              </template>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="手机号" align="center" key="phonenumber" prop="phonenumber"/>
      </el-table>
      <pagination
          v-show="total1 > 0"
          :total="total1"
          v-model:page="queryParam1s.pageNum"
          v-model:limit="queryParam1s.pageSize"
          @pagination="getStaffList"
          style="position: relative;"
      />
    </el-dialog>
  </div>
</template>

<script setup name="User">
import {getToken} from "@/utils/auth";
import {treeselect} from "@/api/system/dept";
import {changeUserStatus, listUser, resetUserPwd, delUser, getUser, updateUser, addUser} from "@/api/system/user";
import { listStaff,listNouserStaff} from "@/api/system/staff";
import {listPost, addPost, delPost, getPost, updatePost} from "@/api/system/post";
import { h } from 'vue';

const router = useRouter();
const {proxy} = getCurrentInstance();
const {sys_normal_disable, sys_user_sex} = proxy.useDict("sys_normal_disable", "sys_user_sex");

const staffList = ref([]);
const userList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const showAdvancedSearch = ref(false);
const flag = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const total1 = ref(0);
const title = ref("");
const dateRange = ref([]);
const deptName = ref("");
const deptOptions = ref(undefined);
const initPassword = ref(undefined);
const roleOptions = ref([]);
const postList = ref([]);
/*** 用户导入参数 */
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: {Authorization: "Bearer " + getToken()},
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/system/user/importData"
});
const staff = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: "员工列表",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0
});
// 列显隐信息
const columns = ref([
  {key: 0, label: `用户编号`, visible: false},
  {key: 1, label: `账号`, visible: true},
  {key: 2, label: `用户姓名`, visible: true},
  {key: 3, label: `部门`, visible: true},
  {key: 4, label: `手机号码`, visible: false},
  {key: 5, label: `状态`, visible: true},
  {key: 6, label: `创建时间`, visible: false},
  {key: 7, label: `姓名`, visible: true},
]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userName: undefined,
    phonenumber: undefined,
    status: undefined,
    deptId: undefined,
    nickName: undefined,
    email: undefined,
  },
  queryParam1s: {
    pageNum: 1,
    pageSize: 10,
    staffNo: null,
    staffName: null,
    delFlag:'0',
  },
  rules: {
    userName: [{required: true, message: "账号不能为空", trigger: "blur"}, {
      min: 2,
      max: 20,
      pattern:/^[a-zA-Z0-9]+$/,
      message: "账号长度必须介于 2 和 20 之间,且只能为数字和字母组合不包含特殊字符",
      trigger: "blur"
    }],
    password: [{required: true, message: "用户密码不能为空", trigger: "blur"}, {
      pattern:/^(?![A-Za-z0-9]+$)(?![a-z0-9\W]+$)(?![A-Za-z\W]+$)(?![A-Z0-9\W]+$)[a-zA-Z0-9\W]{8,}$/,
      message: "用户密码长度必须8位以上且含有大小写字母、数字、特殊字符",
      trigger: "blur"
    }],
    //staffName: [{required: true, message: "请选择人员信息", trigger: "blur"}],
    roleIds: [{required: true, message: "请选择用户角色", trigger: "blur"}],
    deptId: [{required: true, message: "请选择部门或者人员", trigger: "blur"}],
    nickName: [{required: true, message: "请填写用户姓名", trigger: "blur"}],
  }
});

const {queryParams, form, rules,queryParam1s} = toRefs(data);

/** 通过条件过滤节点  */
const filterNode = (value, data) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
/** 根据名称筛选部门树 */
watch(deptName, val => {
  proxy.$refs["deptTreeRef"].filter(val);
});

function closeDetail(row){
  form.value.staffName=row.staffName;
  form.value.staffId=row.staffId;
  form.value.email=row.email;
  form.value.phonenumber=row.phonenumber;
  form.value.sex=row.sex;
  form.value.deptId=row.deptId;
  form.value.postIds=row.postIds;
  form.value.nickName=row.staffName;
  staff.open = false;
  flag.value = false;
};

function getStffList(){
  getStaffList();
  staff.open = true;
};

/** 查询部门下拉树结构 */
function getTreeselect() {
  treeselect().then(response => {
    deptOptions.value = response.data;
  });
};

/** 查询用户列表 */
function getList() {
  loading.value = true;
  listUser(proxy.addDateRange(queryParams.value, dateRange.value)).then(res => {
    loading.value = false;
    userList.value = res.rows;
    total.value = res.total;
  });
};
/** 查询人员信息列表 */
function getStaffList() {
  listNouserStaff(queryParam1s.value).then(response => {
    staffList.value = response.rows;
    total1.value = response.total;
  });
};

function getPosts(){
  listPost().then(response => {
    postList.value = response.rows;
  });
}

function getMsg(data){
  let val = data.id

  if(val==null || val=='' || val == 'undefined'){
    // proxy.$modal.msgWarning("先选择所属部门");
  }else{
    form.value.deptId = val;
  }

}

/** 节点单击事件 */
function handleNodeClick(data) {
  queryParams.value.deptId = data.id;
  form.value.deptId = data.id;
  handleQuery();
};

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
};

/** 人员信息搜索按钮操作 */
function handleQuery1() {
  queryParam1s.value.pageNum = 1;
  getStaffList();
};

/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = [];
  proxy.resetForm("queryRef");
  handleQuery();
};

/** 删除按钮操作 */
function handleDelete(row) {
  const userIds = row.userId || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delUser(userIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {
  });
};

/** 导出按钮操作 */
function handleExport() {
  proxy.download("system/user/export", {
    ...queryParams.value,
  }, `user_${new Date().getTime()}.xlsx`);
};

/** 用户状态修改  */
function handleStatusChange(row) {
  let text = row.status === "0" ? "启用" : "停用";
  proxy.$modal.confirm('确认要"' + text + '""' + row.userName + '"用户吗?').then(function () {
    return changeUserStatus(row.userId, row.status);
  }).then(() => {
    proxy.$modal.msgSuccess(text + "成功");
  }).catch(function () {
    row.status = row.status === "0" ? "1" : "0";
  });
};

/** 更多操作 */
function handleCommand(command, row) {
  switch (command) {
    case "handleResetPwd":
      handleResetPwd(row);
      break;
    case "handleAuthRole":
      handleAuthRole(row);
      break;
    default:
      break;
  }
};

/** 跳转角色分配 */
function handleAuthRole(row) {
  const userId = row.userId;
  router.push("/system/user-auth/role/" + userId);
};

/** 重置密码按钮操作 */
function handleResetPwd(row) {
  proxy.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    inputPattern:/^(?![A-Za-z0-9]+$)(?![a-z0-9\W]+$)(?![A-Za-z\W]+$)(?![A-Z0-9\W]+$)[a-zA-Z0-9\W]{8,}$/,
    inputErrorMessage: "用户密码长度必须8位以上且含有大小写字母、数字、特殊字符",
  }).then(({value}) => {
    resetUserPwd(row.userId, value).then(response => {
      proxy.$modal.msgSuccess("修改成功，新密码是：" + value);
    });
  }).catch(() => {
  });
};

/** 选择条数  */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.userId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 导入按钮操作 */
function handleImport() {
  upload.title = "用户导入";
  upload.open = true;
};

/** 下载模板操作 */
function importTemplate() {
  proxy.download("system/user/importTemplate", {}, `user_template_${new Date().getTime()}.xlsx`);
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

/** 初始化部门数据 */
function initTreeData() {
  // 判断部门的数据是否存在，存在不获取，不存在则获取
  if (deptOptions.value === undefined) {
    treeselect().then(response => {
      deptOptions.value = response.data;
    });
  }
};

/** 重置操作表单 */
function reset() {
  form.value = {
    userId: undefined,
    deptId: null,
    userName: undefined,
    nickName: undefined,
    password: undefined,
    phonenumber: undefined,
    email: undefined,
    sex: undefined,
    status: "0",
    remark: undefined,
    postIds: [],
    roleIds: [],
    staffId: undefined,
  };
  proxy.resetForm("userRef");
};

/** 取消按钮 */
function cancel() {
  open.value = false;
  reset();
};

/** 新增按钮操作 */
function handleAdd() {
  reset();
  initTreeData();
  flag.value = true;
  getUser().then(response => {
    roleOptions.value = response.roles;
    open.value = true;
    title.value = "添加用户";
/*    form.password.value = initPassword.value;*/
  });
};

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  initTreeData();
  flag.value = true;
  const userId = row.userId || ids.value;
  getUser(userId).then(response => {
    form.value = response.data;
    roleOptions.value = response.roles;
    form.value.postIds = response.postIds;
    form.value.roleIds = response.roleIds;
    open.value = true;
    title.value = "修改用户";
    form.password = "";

    if(form.value.staffName!=null && form.value.staffName!=''){
      flag.value = false;
    }
  });
};

/** 提交按钮 */
function submitForm() {
  proxy.$refs["userRef"].validate(valid => {
    if (valid) {
      if (form.value.userId != undefined) {
        updateUser(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addUser(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
};

getTreeselect();
getPosts();
getList();
</script>
<style scoped lang="scss">
.down-tree{
  height:calc(100vh - 160px);
  overflow-y:scroll;
}
.down-tree::-webkit-scrollbar {display:none}
</style>
