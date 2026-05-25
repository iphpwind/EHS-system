<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属部门" prop="deptId">
        <tree-select
            v-model:value="queryParams.deptId"
            :options="deptOptions"
            placeholder="请选择所属部门"
            :objMap="{ value: 'id', label: 'label', children: 'children' }"
            @func="getMsg"
        />
      </el-form-item>
      <el-form-item label="岗位" prop="postId">
        <el-select v-model="queryParams.postId" clearable filterable placeholder="请选择">
          <el-option
              v-for="item in postOption"
              :key="item.postId"
              :label="item.postName"
              :value="item.postId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年份" prop="years">
        <el-date-picker
            v-model="queryParams.years"
            type="year"
            value-format="YYYY"
            @change="ctimeonfirm"
            placeholder="选择年">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择">
          <el-option label="正常" value="0" />
          <el-option label="停用" value="1" />
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
          v-hasPermi="['safework:promise:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="promiseList">
      <el-table-column label="所属部门" align="center" prop="deptName" />
      <el-table-column label="承诺卡编码" align="center" prop="num" />
      <el-table-column label="岗位名称" align="center" prop="postName" />
      <el-table-column label="年份" align="center" prop="years" />
      <el-table-column label="主管领导" align="center" prop="nickName" />
      <el-table-column label="状态" align="center" prop="status" >
        <template #default="scope">
          <el-row justify="center" v-if="scope.row.status == 0"><el-tag type="success">正常</el-tag></el-row>
          <el-row justify="center" v-else><el-tag type="danger">停用</el-tag></el-row>
        </template>
      </el-table-column>
      <el-table-column label="发布人" align="center" prop="publishName" />
      <el-table-column label="发布时间" align="center" prop="publishTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.publishTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后更新时间" align="center" prop="updateTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            v-if="scope.row.publishSta == '0'"
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:promise:edit']"
          >修改</el-button>
          <el-button
              type="text"
              v-if="scope.row.publishSta == '0'"
              @click="handlePub(scope.row.id,'1')"
              v-hasPermi="['safework:promise:edit']"
          >发布</el-button>
          <el-button
              type="text"
              v-if="scope.row.publishSta == '1'"
              @click="handleLook(scope.row)"
          >查看详情</el-button>
          <el-button
              type="text"
              v-if="scope.row.publishSta == '1'"
              @click="handleUser(scope.row)"
          >承诺人员</el-button>
          <el-button
            type="text"
            v-if="scope.row.publishSatus == '1' && scope.row.status == '0'"
            @click="handleDelete(scope.row.id,'1')"
            v-hasPermi="['safework:promise:edit']"
          >停用</el-button>
          <el-button
              type="text"
              v-if="scope.row.publishSatus == '1' && scope.row.status == '1'"
              @click="handleDelete(scope.row.id,'0')"
              v-hasPermi="['safework:promise:edit']"
          >启用</el-button>
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

    <!-- 添加或修改承诺卡对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="promiseRef" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="所属部门" prop="deptId">
          <tree-select
              v-model:value="form.deptId"
              :options="deptOptions"
              placeholder="请选择所属部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
              @func="getMsg"
          />
        </el-form-item>
        <el-form-item label="承诺卡编码" prop="num">
          <el-input v-model="form.num" placeholder="请输入承诺卡编码" />
        </el-form-item>
        <el-form-item label="承诺卡名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入承诺卡名称" />
        </el-form-item>
        <el-form-item label="岗位名称" prop="postId">
          <el-select v-model="form.postId" clearable filterable placeholder="请选择">
            <el-option
                v-for="item in postOption"
                :key="item.postId"
                :label="item.postName"
                :value="item.postId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用部门" prop="applicableDept">
          <el-input v-model="form.depNames" readonly @click="selectdep"/>
        </el-form-item>
        <el-form-item label="年份" prop="years">
          <el-date-picker
              v-model="form.years"
              type="year"
              value-format="YYYY"
              @change="ctimeonfirm1"
              placeholder="选择年">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="适用区域" prop="objectId">
          <el-select v-model="form.objectId" multiple clearable filterable placeholder="请选择">
            <el-option
                v-for="item in obOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主管领导" prop="chargeUser">
          <el-select v-model="form.chargeUser" placeholder="请选择" filterable @click="userchange">
            <el-option
                v-for="item in options"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="承诺卡引言" prop="introduction">
          <el-input v-model="form.introduction" type="textarea" placeholder="限500字" max="500"/>
        </el-form-item>
        <el-form-item label="承诺事项" prop="matter">
          <el-input v-model="form.matter" type="textarea" placeholder="限500字" max="500"/>
        </el-form-item>
        <el-form-item label="上传附件" prop="fileUrl">
          <FileUpload
              v-model.value="form.fileUrl"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
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

    <!-- 查看承诺卡对话框 -->
    <el-dialog :title="title" v-model="openlook" width="800px" append-to-body>
      <el-form ref="promiseRef" :model="form" :rules="rules" label-width="180px" disabled>
        <el-form-item label="所属部门" prop="deptId">
          <tree-select
              v-model:value="form.deptId"
              :options="deptOptions"
              placeholder="请选择所属部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
              @func="getMsg"
          />
        </el-form-item>
        <el-form-item label="承诺卡编码" prop="num">
          <el-input v-model="form.num" placeholder="请输入承诺卡编码" />
        </el-form-item>
        <el-form-item label="承诺卡名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入承诺卡名称" />
        </el-form-item>
        <el-form-item label="岗位名称" prop="postId">
          <el-select v-model="form.postId" clearable filterable placeholder="请选择">
            <el-option
                v-for="item in postOption"
                :key="item.postId"
                :label="item.postName"
                :value="item.postId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用部门" prop="applicableDept">
          <el-input v-model="form.depNames" readonly @click="selectdep"/>
        </el-form-item>
        <el-form-item label="年份" prop="years">
          <el-date-picker
              v-model="form.years"
              type="year"
              value-format="YYYY"
              @change="ctimeonfirm1"
              placeholder="选择年">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="适用区域" prop="objectId">
          <el-select v-model="form.objectId" multiple clearable filterable placeholder="请选择" style="width: 100%">
            <el-option
                v-for="item in obOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主管领导" prop="chargeUser">
          <el-select v-model="form.chargeUser" placeholder="请选择" filterable @click="userchange">
            <el-option
                v-for="item in options"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="承诺卡引言" prop="introduction">
          <el-input v-model="form.introduction" type="textarea" placeholder="限500字" max="500"/>
        </el-form-item>
        <el-form-item label="承诺事项" prop="matter">
          <el-input v-model="form.matter" type="textarea" placeholder="限500字" max="500"/>
        </el-form-item>
        <el-form-item label="上传附件" prop="fileUrl">
          <FileUpload
              v-model.value="form.fileUrl"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
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
  </div>
</template>

<script setup name="Promise">
import { listPromise, getPromise, delPromise, addPromise, updatePromise,sign } from "@/api/safework/promise";
import {treeselect,listDept} from "@/api/system/dept";
import {listPost} from "@/api/system/post";
import { listObject } from "@/api/safework/object";
import { getUserList } from "@/api/system/user";
import {ref} from "vue";

const { proxy } = getCurrentInstance();

const promiseList = ref([]);
const open = ref(false);
const openlook = ref(false);
const loading = ref(true);
const loading1 = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const tableNames = ref([]);
const tables = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const total1 = ref(0);
const title = ref("");
const deptOptions = ref(undefined);
const postOption = ref(undefined);
const deptList = ref([]);
const depts = ref([]);
const refreshTable = ref(true);
const isExpandAll = ref(true);
const obOptions = ref([]);
const options = ref([]);
const dept = reactive({
  // 是否显示弹出层
  open: false,
  // 弹出层标题
  title: "部门列表",
});

const data = reactive({
  form: {
    status: '0'
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deptId: null,
    postId: null,
    years: null,
    status: '0',
  },
  queryParam1s: {
    deptName: null,
  },
  rules: {
    deptId: [
      { required: true, message: '请选择所属部门', trigger: 'change' }
    ],
    num: [
      { required: true, message: '请填写编码', trigger: 'blur' }
    ],
    name: [
      { required: true, message: '请填写承诺卡名称', trigger: 'blur' }
    ],
    objectId: [
      { required: true, message: '请选择适用区域', trigger: 'change' }
    ],
    applicableDept: [
      { required: true, message: '请选择适用部门', trigger: 'change' }
    ],
    postId: [
      { required: true, message: '请选择岗位', trigger: 'change' }
    ],
  }
});
const { queryParams, form, rules, queryParam1s} = toRefs(data);
const {sys_normal_disable} = proxy.useDict("sys_normal_disable");



//时间确认
function ctimeonfirm1(val){
  console.log(val);
  form.value.years = val;
}

//筛选时间确认
function ctimeonfirm(val){
  queryParams.value.years = val;
}

/** 展开/折叠操作 */
function toggleExpandAll() {
  refreshTable.value = false;
  isExpandAll.value = !isExpandAll.value;
  nextTick(() => {
    refreshTable.value = true;
  });
}

/** 部门搜索按钮操作 */
function handleQuery1() {
  getdept();
}

/** 初始化部门数据 */
function initTreeData() {
  // 判断部门的数据是否存在，存在不获取，不存在则获取
  if (deptOptions.value === undefined) {
    treeselect().then(response => {
      deptOptions.value = response.data;
    });
  }
}

//获取部门数据
function selectdep(){
  dept.open = true;
  if(form.value.applicableDept != null && form.value.applicableDept != ""){
    const deptIds = form.value.applicableDept.split(",");
    proxy.$nextTick(() => {
      deptList.value.forEach((dept) => {
        deptIds.forEach(deptId => {
          if(Number(deptId) == dept.deptId){
            proxy.$refs.table.toggleRowSelection(dept,true);
          }
        })
      });
    })
  }
}

function getdept(){
  loading1.value = true;
  listDept(queryParam1s.value).then(response => {
    deptList.value = proxy.handleTree(response.data, "deptId");
    depts.value = response.data;
  });
  loading1.value = false;
}

function getObject() {
  listObject({delFlag:0}).then(res => {
    obOptions.value = res.rows;
  })
}

function getPost() {
  listPost().then(response => {
    postOption.value = response.rows;
  });
}

function getMsg(data){
  let val = data.id

  if(val==null || val=='' || val == 'undefined'){
  }else{
    /*form.value.postIds = null;
    listPost({deptId:val}).then(response => {
      postOption.value = response.rows;
    });*/

    getUserList({deptId:val}).then(res => {
      options.value = res.rows;//list数据
    });
  }
}

// 多选框选中数据
function handleSelectionChange(selection) {
  tables.value = selection.map(item => item.deptId);
  tableNames.value = selection.map(item => item.deptName);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

function saveDept(){
  const deptIds = tables.value.join(",");
  const deptNames = tableNames.value.join(",");
  if (deptIds == "") {
    proxy.$modal.msgError("请选择部门");
    return;
  }
  form.value.applicableDept = deptIds;//适用部门
  form.value.depNames = deptNames;
  dept.open = false;
}

/** 查询承诺卡列表 */
function getList() {
  loading.value = true;
  listPromise(queryParams.value).then(response => {
    promiseList.value = response.rows;
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
    enterpriseCode: null,
    deptId: null,
    num: null,
    name: null,
    postId: null,
    applicableDept: null,
    years: null,
    objectId: null,
    chargeUser: null,
    introduction: null,
    matter: null,
    fileUrl: null,
    status: "0",
    publishSta: null,
    publishUser: null,
    sign: null,
    publishTime: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("promiseRef");
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
  open.value = true;
  title.value = "添加承诺卡";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getPromise(id).then(response => {
    if(response.data.applicableDept != ""){
      response.data.deptIdArray = response.data.applicableDept.split(",");
      var Names = [];
      for(let id of response.data.deptIdArray){
        for(let u of depts.value){
          if(Number(id) == u.deptId){
            Names.push(u.deptName);
          }
        }
      }
      response.data.depNames = Names.join(',');
    }
    form.value = response.data;

    listPost({deptId:form.value.deptId}).then(resp => {
      postOption.value = resp.rows;
    });
    getUserList({deptId:form.value.deptId}).then(res => {
      options.value = res.rows;//list数据
    });
    form.value.objectId = form.value.objectId.split(",");
    form.value.postId = parseInt(form.value.postId);
    form.value.chargeUser = parseInt(form.value.chargeUser);

    open.value = true;
    title.value = "修改承诺卡";
  });
}

/** 查看按钮操作 */
function handleLook(row) {
  reset();
  const id = row.id || ids.value
  getPromise(id).then(response => {
    if(response.data.applicableDept != ""){
      response.data.deptIdArray = response.data.applicableDept.split(",");
      var Names = [];
      for(let id of response.data.deptIdArray){
        for(let u of depts.value){
          if(Number(id) == u.deptId){
            Names.push(u.deptName);
          }
        }
      }
      response.data.depNames = Names.join(',');
    }
    form.value = response.data;

    listPost({deptId:form.value.deptId}).then(resp => {
      postOption.value = resp.rows;
    });
    getUserList({deptId:form.value.deptId}).then(res => {
      options.value = res.rows;//list数据
    });
    form.value.objectId = form.value.objectId.split(",");
    form.value.postId = parseInt(form.value.postId);
    form.value.chargeUser = parseInt(form.value.chargeUser);

    openlook.value = true;
    title.value = "承诺卡详情";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["promiseRef"].validate(valid => {
    if (valid) {
      form.value.objectId = form.value.objectId.join(',');
      if (form.value.id != null) {
        updatePromise(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPromise(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

function handleUser(row) {
  proxy.$router.push({
    path: '/three/promisesign',
    query:{
      promiseId:row.id,
      promiseName:row.name,
      postIds:row.postId
    }
  })
}

/** 删除按钮操作 */
function handleDelete(id,status) {
  proxy.$modal.confirm('是否确认操作此承诺卡？').then(function() {
    return updatePromise({id:id,status:status});
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("修改成功");
  }).catch(() => {});
}

function handlePub(id,status) {
  proxy.$modal.confirm('是否确认发布此承诺卡？').then(function() {
    return sign({id:id,publishSta:status,publishTime:new Date()});
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("修改成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/promise/export', {
    ...queryParams.value
  }, `promise_${new Date().getTime()}.xlsx`)
}

getList();
initTreeData();
getdept();
getObject();
getPost();
</script>
