<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="预案名称" prop="reservePlan">
        <el-input
            v-model="queryParams.reservePlan"
            placeholder="请输入预案名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="预案类别" prop="planTypeId">
        <el-select v-model="queryParams.planTypeId" placeholder="请选择预案类别" @keyup.enter="handleQuery">
          <el-option v-for="item in planType"
                     :key="item.id"
                     :label="item.typeName"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预案级别" prop="planLevelId">
        <el-select v-model="queryParams.planLevelId" placeholder="请选择预案级别" @keyup.enter="handleQuery">
          <el-option v-for="item in planLevel"
                     :key="item.id"
                     :label="item.levelName"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" @keyup.enter="handleQuery">
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
            v-hasPermi="['safework:emergencyplan:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['safework:emergencyplan:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="emergencyplanList" @selection-change="handleSelectionChange">
      <el-table-column label="预案备案编号" align="center" prop="planNumber" />
      <el-table-column label="预案名称" align="center" prop="reservePlan" />
      <el-table-column label="预案类别" align="center" prop="typeName" />
      <el-table-column label="预案级别" align="center" prop="levelName" />
      <el-table-column label="适用领域" align="center" prop="applicationName" />
      <el-table-column label="发布日期" align="center" prop="publishDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.publishDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布单位" align="center" prop="publishDept" />
      <el-table-column label="签发人" align="center" prop="signBy" />
      <el-table-column label="发布状态" align="center" prop="publishStatus">
        <template #default="scope">
          <el-row justify="center" v-if="scope.row.publishStatus == 0"><el-tag type="success">已发布</el-tag></el-row>
          <el-row justify="center" v-else><el-tag type="danger">未发布</el-tag></el-row>
        </template>
      </el-table-column>
      <el-table-column label="版本号" align="center" prop="versionNumber" />
      <el-table-column label="修订记录" align="center" prop="upplanNum">
        <template #default="scope">
          <el-row @click="hadleRecord(scope.row)" justify="center" style="cursor: pointer;color: #9eaab5;">{{scope.row.upplanNum}}</el-row>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <el-row justify="center" v-if="scope.row.status == 0"><el-tag type="success">正常</el-tag></el-row>
          <el-row justify="center" v-else><el-tag type="danger">禁用</el-tag></el-row>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              v-if="scope.row.publishStatus!='1' && scope.row.status=='0'"
              @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
              type="text"
              v-if="scope.row.publishStatus=='0' && scope.row.status=='0'"
              @click="handleUpsta(scope.row)"
          >发布</el-button>
          <el-button
              type="text"
              v-if="scope.row.publishStatus=='1'"
              @click="handleUpsta(scope.row)"
          >撤销</el-button>
          <el-button
              type="text"
              v-if="scope.row.status=='0'"
              @click="handleDelete(scope.row)"
          >停用</el-button>
          <el-button
              type="text"
              v-if="scope.row.status=='0'"
              @click="handleXiud(scope.row)"
          >修订</el-button>
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

    <!-- 添加或修改应急预案对话框 -->
    <el-dialog :title="title" v-model="open" width="1000px" append-to-body>
      <el-form ref="emergencyplanRef" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="预案备案编号" prop="planNumber" >
          <el-input v-model="form.planNumber" placeholder="请输入预案备案编号" />
        </el-form-item>
        <el-form-item label="文件版本号" prop="versionNumber" >
          <el-input v-model="form.versionNumber" placeholder="请输入文件版本号" />
        </el-form-item>
        <el-form-item label="预案名称" prop="reservePlan" >
          <el-input v-model="form.reservePlan" placeholder="请输入预案名称" />
        </el-form-item>
        <el-form-item label="预案类别" prop="planTypeId">
          <el-select v-model="form.planTypeId" placeholder="请选择预案类别" @keyup.enter="handleQuery">
            <el-option v-for="item in planType"
                       :key="item.id"
                       :label="item.typeName"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预案级别" prop="planLevelId">
          <el-select v-model="form.planLevelId" placeholder="请选择预案级别" @keyup.enter="handleQuery">
            <el-option v-for="item in planLevel"
                       :key="item.id"
                       :label="item.levelName"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用部门" prop="applicableDept">
          <tree-select
              v-model:value="form.applicableDept"
              :options="deptOptions"
              placeholder="请选择适用部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
          />
        </el-form-item>
        <el-form-item label="适用领域" prop="planApplicablesId">
          <el-select v-model="form.planApplicablesId" placeholder="请选择适用领域" @keyup.enter="handleQuery">
            <el-option v-for="item in planApplicables"
                       :key="item.id"
                       :label="item.applicationName"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="危险源关联" prop="dangerSourse">
          <el-input v-model="form.dangerSourse" type="textarea" placeholder="请输入内容" />
        </el-form-item>
<!--        <el-form-item label="预案摘要" prop="planAbstract">
          <Editortwo v-model="form.planAbstract" @editdata="editordata" :min-height="192"/>
        </el-form-item>-->
        <el-form-item label="预案摘要" prop="planAbstract">
          <el-input v-model="form.planAbstract" type="textarea"/>
        </el-form-item>
        <el-form-item label="相关附件" prop="files">
          <FileUpload
              v-model.value="form.files"
          />
        </el-form-item>
        <el-form-item label="编制人" prop="preparedBy">
          <el-input v-model="form.preparedBy" placeholder="请输入编制人" />
        </el-form-item>
        <el-form-item label="编制单位(部门)" prop="preparedDept">
          <el-input v-model="form.preparedDept" placeholder="请输入编制单位(部门)" />
        </el-form-item>
        <el-form-item label="发布日期" prop="publishDate">
          <el-date-picker clearable
                          v-model="form.publishDate"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择发布日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发布文号" prop="publishNumber">
          <el-input v-model="form.publishNumber" placeholder="请输入发布文号" />
        </el-form-item>
        <el-form-item label="发布单位" prop="publishDept">
          <el-input v-model="form.publishDept" placeholder="请输入发布单位" />
        </el-form-item>
        <el-form-item label="签发人" prop="signBy">
          <el-input v-model="form.signBy" placeholder="请输入签发人" />
        </el-form-item>
        <el-form-item label="预案备案时间" prop="planDate">
          <el-date-picker clearable
                          v-model="form.planDate"
                          type="date"
                          value-format="YYYY-MM-DD"
                          placeholder="请选择预案备案时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预案备案部门" prop="planDept">
          <tree-select
              v-model:value="form.planDept"
              :options="deptOptions"
              placeholder="请选择适用部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
          />
        </el-form-item>
        <el-form-item label="备注" prop="rem">
          <el-input v-model="form.rem" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="状态">
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
    <!-- 修订内容 -->
    <el-dialog title="修订" v-model="openup" width="700px" append-to-body>
      <el-form ref="emergencyplanupRef" :model="upform" :rules="rules1" label-width="180px">
        <el-form-item label="修订内容说明" prop="updateReason" >
          <el-input v-model="upform.updateReason" placeholder="请输入修订内容说明" />
        </el-form-item>
        <el-form-item label="相关附件" prop="files">
          <FileUpload
              v-model.value="upform.files"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="tijiao">确 定</el-button>
          <el-button @click="upcancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Emergencyplan">
import { listEmergencyplan, getEmergencyplan, delEmergencyplan, addEmergencyplan, updateEmergencyplan } from "@/api/safework/emergencyplan";
import {listPlanlevel} from "@/api/safework/planlevel";
import {listPlantype} from "@/api/safework/plantype";
import {ref} from "vue";
import {treeselect} from "@/api/system/dept";
import {listPlanapplications} from "@/api/safework/planapplications";
import Editortwo from '../../../components/Editortwo/index.vue'
import {addUpplan} from "@/api/safework/upplan";

const { proxy } = getCurrentInstance();

const emergencyplanList = ref([]);
const open = ref(false);
const openup = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const planType = ref([]);
const planLevel = ref([]);
const planApplicables = ref([]);
const deptOptions = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  upform: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deptId: null,
    planNumber: null,
    versionNumber: null,
    reservePlan: null,
    planTypeId: null,
    planLevelId: null,
    applicableDept: null,
    planApplicablesId: null,
    dangerSourse: null,
    planAbstract: null,
    files: null,
    preparedBy: null,
    preparedDept: null,
    publishDate: null,
    publishNumber: null,
    publishDept: null,
    signBy: null,
    planDate: null,
    planDept: null,
    rem: null,
    status: null,
    publishStatus: null,
  },
  rules: {
    planNumber: [
      { required: true, message: '请填写预案备案编号', trigger: 'blur' }
    ],
    versionNumber: [
      { required: true, message: '请填写文件版本号', trigger: 'blur' }
    ],
    reservePlan: [
      { required: true, message: '请填写预案名称', trigger: 'blur' }
    ],
    planTypeId: [
      { required: true, message: '请填写预案类别', trigger: 'change' }
    ],
    planLevelId: [
      { required: true, message: '请填写预案级别', trigger: 'change' }
    ],
    planApplicablesId: [
      { required: true, message: '请填写适用领域', trigger: 'change' }
    ],
    planAbstract: [
      { required: true, message: '请填写预案摘要', trigger: 'blur' }
    ],
    preparedBy: [
      { required: true, message: '请填写编制人', trigger: 'blur' }
    ],
    preparedDept: [
      { required: true, message: '请填写编制人单位', trigger: 'blur' }
    ],
    publishDate: [
      { required: true, message: '请填写发布日期', trigger: 'blur' }
    ],
    publishNumber: [
      { required: true, message: '请填写发布文号', trigger: 'blur' }
    ],
    publishDept: [
      { required: true, message: '请填写发布单位', trigger: 'blur' }
    ],
    signBy: [
      { required: true, message: '请填写签发人', trigger: 'blur' }
    ],

  },
  rules1: {
    updateReason: [
      { required: true, message: '请填写修订内容说明', trigger: 'blur' }
    ],
  },
  components: {
    Editortwo
  },
});

const { queryParams, form, rules, upform,rules1 } = toRefs(data);

function editordata (data) {
  form.value.planAbstract = data
}

//处理修订记录
function hadleRecord(row){
  proxy.$router.push({
    path: '/allpervasive/emergency12/upplan',
    query:{
      emergencyPlanId:row.id
    }
  })
}

/** 查询应急预案列表 */
function getList() {
  loading.value = true;
  listEmergencyplan(queryParams.value).then(response => {
    emergencyplanList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

//获取预案级别字典
function getlevelList() {
  listPlanlevel().then(response => {
    planLevel.value = response.rows;
  });
}

//获取预案类别
function gettypeList() {
  listPlantype().then(response => {
    planType.value = response.rows;
  });
}

function getPlanapplications() {
  listPlanapplications().then(response => {
    planApplicables.value = response.rows;
  });
}


function initTreeData() {
  // 判断部门的数据是否存在，存在不获取，不存在则获取
  deptOptions.value=[]
  treeselect().then(response => {
    deptOptions.value = response.data;
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

function upcancel(){
  openup.value = false;
  upform.value = {
    updateReason:null,
    files:null
  };
  proxy.resetForm("emergencyplanupRef");
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    deptId: null,
    planNumber: null,
    versionNumber: null,
    reservePlan: null,
    planTypeId: null,
    planLevelId: null,
    applicableDept: null,
    planApplicablesId: null,
    dangerSourse: null,
    planAbstract: null,
    files: null,
    preparedBy: null,
    preparedDept: null,
    publishDate: null,
    publishNumber: null,
    publishDept: null,
    signBy: null,
    planDate: null,
    planDept: null,
    rem: null,
    status: "0",
    publishStatus: "0",
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("emergencyplanRef");
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
  form.value.status = '0';
  //localStorage.removeItem('avalue');
  open.value = true;
  title.value = "添加应急预案";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getEmergencyplan(id).then(response => {
    form.value = response.data;
    //localStorage.avalue = form.value.planAbstract
    open.value = true;
    title.value = "修改应急预案";
  });
}

/** 提交按钮 */
function submitForm() {
  //localStorage.removeItem('avalue');
  proxy.$refs["emergencyplanRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateEmergencyplan(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEmergencyplan(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

//提交修订内容
function tijiao(){
  proxy.$refs["emergencyplanupRef"].validate(valid => {
    if (valid) {
      addUpplan(upform.value).then(response => {
        proxy.$modal.msgSuccess("新增成功");
        openup.value = false;
        getList();
      });
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const idss = row.id || ids.value;
  proxy.$modal.confirm('是否确认停用应急预案编号为"' + idss + '"的数据项？').then(function() {
    return updateEmergencyplan({id:idss,status:'1'});
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("停用成功");
  }).catch(() => {});
}

function handleUpsta(row) {
  const idss = row.id || ids.value;
  let item = []
  if(row.publishStatus=='0'){
    item.publishStatus = '1'
  }else{
    item.publishStatus = '0'
  }
  proxy.$modal.confirm('是否确认停用应急预案编号为"' + idss + '"的数据项？').then(function() {
    return updateEmergencyplan({id:idss,publishStatus:item.publishStatus});
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("停用成功");
  }).catch(() => {});
}

function handleXiud(row){
  upform.value.emergencyPlanId = row.id || ids.value;
  openup.value = true;
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/emergencyplan/export', {
    ...queryParams.value
  }, `emergencyplan_${new Date().getTime()}.xlsx`)
}

getList();
getlevelList();
gettypeList();
getPlanapplications();
initTreeData();
</script>
