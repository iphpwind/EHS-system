<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="所属部门" prop="deptId">
        <tree-select
            v-model:value="queryParams.deptId"
            :options="deptOptions"
            placeholder="全部"
            :objMap="{ value: 'id', label: 'label', children: 'children' }"
        />
      </el-form-item>
      <el-form-item label="作业类型" prop="workType">
        <el-select v-model="queryParams.workType" clearable filterable placeholder="全部">
          <el-option key="0" label="动火作业" value="0"></el-option>
          <el-option key="1" label="动土作业" value="1"></el-option>
          <el-option key="2" label="吊装作业" value="2"></el-option>
          <el-option key="3" label="断路作业" value="3"></el-option>
          <el-option key="4" label="高处作业" value="4"></el-option>
          <el-option key="5" label="临时用电" value="5"></el-option>
          <el-option key="6" label="盲板抽堵" value="6"></el-option>
          <el-option key="7" label="受限空间" value="7"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="作业名称" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入分析作业名称"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table height="calc(100vh - 330px)" v-loading="loading" :data="unitList">
      <el-table-column label="所属部门" align="center" prop="enterpriseName" />
      <el-table-column label="作业类型" align="center" prop="workType" >
        <template #default="scope">
          <el-row justify="center" v-if="scope.row.workType == '0'">动火作业</el-row>
          <el-row justify="center" v-if="scope.row.workType == '1'">动土作业</el-row>
          <el-row justify="center" v-if="scope.row.workType == '2'">吊装作业</el-row>
          <el-row justify="center" v-if="scope.row.workType == '3'">断路作业</el-row>
          <el-row justify="center" v-if="scope.row.workType == '4'">高处作业</el-row>
          <el-row justify="center" v-if="scope.row.workType == '5'">临时用电</el-row>
          <el-row justify="center" v-if="scope.row.workType == '6'">盲板抽堵</el-row>
          <el-row justify="center" v-if="scope.row.workType == '7'">受限空间</el-row>

        </template>
      </el-table-column>
      <el-table-column label="作业名称" align="center" prop="name" />
      <el-table-column label="作业场所" align="center" prop="objectName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
              type="text"
              icon="Edit"
              @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
              type="text"
              @click="handleWork(scope.row)"
          >工作分析表</el-button>
          <el-button
              type="text"
              v-if="scope.row.safeId!=null && scope.row.safeId!=''"
              @click="lookRecord(scope.row)"
          >查看安全交底</el-button>
          <el-button
              type="text"
              v-if="(scope.row.safeId==null || scope.row.safeId=='') && scope.row.workType!=null && scope.row.workType!=''"
              @click="lookRecord(scope.row)"
          >新建安全交底</el-button>
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

    <!-- 编辑 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form ref="unitRef" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="所属部门" prop="enterpriseName">
          <el-input v-model="form.enterpriseName" readonly/>
        </el-form-item>
        <el-form-item label="作业名称" prop="name">
          <el-input v-model="form.name" readonly/>
        </el-form-item>
        <el-form-item label="作业场所" prop="objectName">
          <el-input v-model="form.objectName" readonly/>
        </el-form-item>
        <el-form-item label="作业类型" prop="workType">
          <el-select v-model="form.workType" clearable filterable placeholder="请选择">
            <el-option key="0" label="动火作业" value="0"></el-option>
            <el-option key="1" label="动土作业" value="1"></el-option>
            <el-option key="2" label="吊装作业" value="2"></el-option>
            <el-option key="3" label="断路作业" value="3"></el-option>
            <el-option key="4" label="高处作业" value="4"></el-option>
            <el-option key="5" label="临时用电" value="5"></el-option>
            <el-option key="6" label="盲板抽堵" value="6"></el-option>
            <el-option key="7" label="受限空间" value="7"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作业方式/备注" prop="workMethod">
          <el-input v-model="form.workMethod" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 查看安全交底 -->
    <el-dialog :title="title" v-model="lookopen" width="600px" append-to-body>
      <el-form ref="unitRef" :model="disclosure" :rules="rules1" label-width="150px">
        <el-form-item label="基础信息" prop="basicInformation">
          <el-input v-model="disclosure.basicInformation" type="textarea"/>
        </el-form-item>
        <el-form-item label="作业证许可范围及作业环境" prop="scopeEnvironment">
          <el-input v-model="disclosure.scopeEnvironment" type="textarea"/>
        </el-form-item>
        <el-form-item label="作业风险" prop="operationRisk">
          <el-input v-model="disclosure.operationRisk" type="textarea"/>
        </el-form-item>
        <el-form-item label="防范措施" prop="preventive">
          <el-input v-model="disclosure.preventive" type="textarea"/>
        </el-form-item>
        <el-form-item label="应急措施" prop="emergency">
          <el-input v-model="disclosure.emergency" type="textarea"/>
        </el-form-item>
        <el-form-item label="其他注意事项" prop="remark">
          <el-input v-model="disclosure.remark" type="textarea"/>
        </el-form-item>
        <el-form-item label="工作单位确认文案" prop="confirmationCopy">
          <el-input v-model="disclosure.confirmationCopy" type="textarea"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="looksub">编辑</el-button>
          <el-button @click="lookcancel">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Unit">
import { listUnit, getUnit, delUnit, updateUnitWork } from "@/api/safework/unit";
import {treeselect} from "@/api/system/dept";
import { listDisclosure, getDisclosure, delDisclosure, addDisclosure, updateDisclosure } from "@/api/safework/disclosure";
import {h} from "vue";
const { proxy } = getCurrentInstance();

const unitList = ref([]);
const open = ref(false);
const lookopen = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const deptOptions = ref(undefined);


const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    objectId: null,
    code: null,
    name: null,
    type: '作业活动',
    ifMajor: null,
    riskLevel: null,
    deptId: null,
    postId: null,
    levelId: null,
    userId: null,
    delFlag: '0'
  },
  disclosure: {},
  rules: {
    workMethod: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
    workType: [
      { required: true, message: '请填写必填项', trigger: 'blur' }
    ],
  }
});

const { queryParams, form, rules,disclosure } = toRefs(data);


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
// 取消按钮
function lookcancel() {
  lookopen.value = false;
  reset();
}

function looksub(){
  if (disclosure.value.id != null) {
    updateDisclosure(disclosure.value).then(response => {
      proxy.$modal.msgSuccess("修改成功");
      lookopen.value = false;
      getList();
    });
  } else {
    addDisclosure(disclosure.value).then(response => {
      proxy.$modal.msgSuccess("新增成功");
      lookopen.value = false;
      getList();
    });
  }
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

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getUnit(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "编辑";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["unitRef"].validate(valid => {
    if (valid) {
      updateUnitWork(form.value).then(response => {
        proxy.$modal.msgSuccess("修改成功");
        open.value = false;
        getList();
      });
    }
  });
}

function lookRecord(row){
  disclosure.value.unitId = row.id;
  listDisclosure({unitId:row.id}).then(response => {
    if(response.rows.length>0){
      disclosure.value = response.rows[0]
    }
    lookopen.value = true;
  });
}

function handleWork(row){
  proxy.$router.push({
    path: '/SpecialOperation/workAnalysis',
    query:{
      unitId:row.id
    }
  })
}

getList();
getTreeselect();
</script>
<style>
.level{
  border-radius: 5px;
  padding: 2px 5px;
  color: #fff;
}
</style>
