<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="年份" prop="yeaes">
        <el-select v-model="queryParams.yeaes" placeholder="请选择年份" clearable>
          <el-option
              v-for="item in yeares"
              :key="item"
              :label="item"
              :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="季度" prop="typeId">
        <el-select v-model="queryParams.quarter" placeholder="请选择季度">
          <el-option label="每年" value="每年" />
          <el-option label="全年" value="全年" />
          <el-option label="下半年" value="下半年" />
          <el-option label="上半年" value="上半年" />
          <el-option label="第一季度" value="第一季度" />
          <el-option label="第二季度" value="第二季度" />
          <el-option label="第三季度" value="第三季度" />
          <el-option label="第四季度" value="第四季度" />
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="targetTypeDicId">
        <el-select v-model="queryParams.targetTypeDicId" placeholder="请选择目标责任类型" clearable>
          <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="考核部门" prop="typeId">
        <tree-select
            v-model:value="queryParams.typeId"
            :options="deptOptions"
            placeholder="请选择考核部门"
            :objMap="{ value: 'id', label: 'label', children: 'children' }"
        />
      </el-form-item>
      <el-form-item label="目标考核标题" prop="title">
        <el-input
            v-model="queryParams.title"
            placeholder="请输入标题"
            clearable
            @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="考试结论" prop="conclusion">
        <el-select v-model="queryParams.conclusion" placeholder="考试结论">
          <el-option label="通过" value="1" />
          <el-option label="不通过" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="delFlag">
        <el-select v-model="queryParams.delFlag" placeholder="请选择状态" clearable>
          <el-option label="正常" value="0" />
          <el-option label="禁用" value="1" />
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
            v-hasPermi="['safework:targetUserExamine:add']"
        >新增</el-button>
      </el-col>
      <!--      <el-col :span="1.5">
              <el-button
                type="warning"
                plain
                icon="Download"
                @click="handleExport"
                v-hasPermi="['safework:targetUserExamine:export']"
              >导出</el-button>
            </el-col>-->
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="targetUserExamineList" @selection-change="handleSelectionChange">
      <el-table-column label="年份" align="center" prop="yeaes" />
      <el-table-column label="季度" align="center" prop="quarter" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="类型" align="center" prop="targetTypeDicName" />
      <el-table-column label="级别" align="center" prop="targetLevelDicName" />
      <el-table-column label="所属部门" align="center" prop="suitDeptId" >
        <template #default="scope">
          <template v-for="(arr,index) in scope.row.suitDeptIdArray" :key="arr">
            <template v-for="user in depts" :key="user.deptId">
              <span v-if="Number(arr) === user.deptId">{{user.deptName}}</span>
              <span v-if="Number(arr) === user.deptId && index<scope.row.suitDeptIdArray.length-1">,</span>
            </template>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="考核部门" align="center" prop="typeName" />
      <el-table-column label="总分值" align="center" prop="totalScore" />
      <el-table-column label="考核结果" align="center" prop="conclusion">
        <template #default="scope">
          <el-row justify="center" v-if="scope.row.conclusion == 1"><el-tag type="success">通过</el-tag></el-row>
          <el-row justify="center" v-else><el-tag type="danger">不通过</el-tag></el-row>
        </template>
      </el-table-column>
      <el-table-column label="考核日期" align="center" prop="examineTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.examineTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
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
              @click="handleUpdate(scope.row)"
              v-hasPermi="['safework:targetUserExamine:edit']"
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

    <!-- 添加或修改安全考核管理对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="targetDeptExamineRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="考核部门" prop="typeId">
<!--          <el-input v-model="form.typeName" placeholder="请输入考核人" readonly @click="getStffList" style="width: 50%"/>-->
          <tree-select
              v-model:value="form.typeId"
              :options="deptOptions"
              placeholder="请选择考核部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
          />
        </el-form-item>
        <el-table v-loading="loading" :data="subtableList" style="width: 100%" height="200">
          <el-table-column label="考核项目" align="center" prop="examineProjectDicName"/>
          <el-table-column label="考核内容" align="center" prop="examineContent"/>
          <el-table-column label="分值" align="center" prop="score"/>
          <el-table-column label="评定标准" align="center" prop="evaluateStandard"/>
          <el-table-column label="考核说明" align="center" prop="examineIllustrate"/>
          <el-table-column align="center" label="得分值">
            <template #default="scope">
              <el-input v-model="scope.row.scoreValue" @blur="calcu" type="number"/>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item label="总分值" prop="totalScore">
          <el-input v-model="form.totalScore" placeholder="总分值" readonly/>
        </el-form-item>
        <el-form-item label="考核结论" prop="conclusion">
          <el-radio-group v-model="form.conclusion">
            <el-radio label="1">通过</el-radio>
            <el-radio label="2">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="考核日期" prop="examineTime">
          <el-date-picker clearable
                          v-model="form.examineTime"
                          type="datetime"
                          value-format="YYYY-MM-DD HH:mm:ss"
                          placeholder="请选择考核日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="填报人" prop="fillinUserName">
          <el-input v-model="form.fillinUserName" placeholder="请输入填报人" />
        </el-form-item>
        <el-form-item label="填报人部门" prop="fillinDeptName">
          <el-input v-model="form.fillinDeptName" placeholder="请输入填报人部门" />
        </el-form-item>
        <el-form-item label="填报日期" prop="fillinTime">
          <el-date-picker clearable
                          v-model="form.fillinTime"
                          type="datetime"
                          value-format="YYYY-MM-DD HH:mm:ss"
                          placeholder="请选择填报日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="检查情况" prop="inspectionSituation">
          <el-input v-model="form.inspectionSituation" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注" prop="rem">
          <el-input v-model="form.rem" type="textarea" placeholder="请输入备注" />
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
    <el-dialog title="查看安全考核管理" v-model="lookopen" width="800px" append-to-body>
      <el-form ref="targetDeptExamineRef" :model="form" :rules="rules" label-width="120px" disabled>
        <el-form-item label="考核部门" prop="typeId">
          <tree-select
              v-model:value="form.typeId"
              :options="deptOptions"
              placeholder="请选择考核部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
          />
        </el-form-item>
        <el-table v-loading="loading" :data="subtableList" style="width: 100%" height="200">
          <el-table-column label="考核项目" align="center" prop="examineProjectDicName"/>
          <el-table-column label="考核内容" align="center" prop="examineContent"/>
          <el-table-column label="分值" align="center" prop="score"/>
          <el-table-column label="评定标准" align="center" prop="evaluateStandard"/>
          <el-table-column label="考核说明" align="center" prop="examineIllustrate"/>
          <el-table-column align="center" label="得分值">
            <template #default="scope">
              <el-input v-model="scope.row.scoreValue" @blur="calcu" type="number"/>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item label="总分值" prop="totalScore">
          <el-input v-model="form.totalScore" placeholder="总分值" readonly/>
        </el-form-item>
        <el-form-item label="考核结论" prop="conclusion">
          <el-radio-group v-model="form.conclusion">
            <el-radio label="1">通过</el-radio>
            <el-radio label="2">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="考核日期" prop="examineTime">
          <el-date-picker clearable
                          v-model="form.examineTime"
                          type="datetime"
                          value-format="YYYY-MM-DD HH:mm:ss"
                          placeholder="请选择考核日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="填报人" prop="fillinUserName">
          <el-input v-model="form.fillinUserName" placeholder="请输入填报人" />
        </el-form-item>
        <el-form-item label="填报人部门" prop="fillinDeptName">
          <el-input v-model="form.fillinDeptName" placeholder="请输入填报人部门" />
        </el-form-item>
        <el-form-item label="填报日期" prop="fillinTime">
          <el-date-picker clearable
                          v-model="form.fillinTime"
                          type="datetime"
                          value-format="YYYY-MM-DD HH:mm:ss"
                          placeholder="请选择填报日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="检查情况" prop="inspectionSituation">
          <el-input v-model="form.inspectionSituation" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注" prop="rem">
          <el-input v-model="form.rem" type="textarea" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.delFlag">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="选择目标考核" v-model="exampleopen" width="1000px" append-to-body>
      <el-form :model="queryParam2s" :inline="true" label-width="70px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="标题">
              <el-input
                  v-model="queryParam2s.title"
                  placeholder="请输入名称"
                  clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="年份">
              <el-select v-model="queryParam2s.yeaes" placeholder="请选择年份" clearable>
                <el-option
                    v-for="item in yeares"
                    :key="item"
                    :label="item"
                    :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="级别">
              <el-select v-model="queryParam2s.targetLevelDicId" placeholder="请选择级别" clearable>
                <el-option
                    v-for="item in options1"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" icon="Search" @click="handleQuery2">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="targetDutyList" height="calc(100vh - 200px)" @row-click="closeDetail">
        <el-table-column label="年份" align="center" prop="yeaes" />
        <el-table-column label="季度" align="center" prop="quarter" />
        <el-table-column label="类型" align="center" prop="targetTypeDicName" />
        <el-table-column label="级别" align="center" prop="targetLevelDicName" />
        <el-table-column label="标题" align="center" prop="title" />
        <el-table-column label="所属部门" align="center" prop="suitDeptId" >
          <template #default="scope">
            <template v-for="(arr,index) in scope.row.suitDeptIdArray" :key="arr">
              <template v-for="user in depts" :key="user.deptId">
                <span v-if="Number(arr) === user.deptId">{{user.deptName}}</span>
                <span v-if="Number(arr) === user.deptId && index<scope.row.suitDeptIdArray.length-1">,</span>
              </template>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="制定人" align="center" prop="formulateUser" />
        <el-table-column label="制定日期" align="center" prop="formulateTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.formulateTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
          v-show="total1>0"
          :total="total1"
          v-model:page="queryParam2s.pageNum"
          v-model:limit="queryParam2s.pageSize"
          @pagination="getTargetDuty"
      />
    </el-dialog>
  </div>
</template>

<script setup name="TargetDeptExamine">
import { listTargetUserExamine, getTargetUserExamine, delTargetUserExamine, addTargetUserExamine, updateTargetUserExamine } from "@/api/safework/targetUserExamine";
import {h, ref} from "vue";
import { listTargetTypeDic} from "@/api/safework/targetTypeDic";
import {listDept,treeselect} from "@/api/system/dept";
import { listTargetLevelDic} from "@/api/safework/targetLevelDic";
import { listTargetDuty} from "@/api/safework/targetDuty";
import {listPost, addPost, delPost, getPost, updatePost} from "@/api/system/post";
import {parseTime} from '@/utils/ruoyi'

const { proxy } = getCurrentInstance();
const store = useStore();
const targetUserExamineList = ref([]);
const exampleopen = ref(false);
const open = ref(false);
const lookopen = ref(false);
const loading = ref(true);
const loading1 = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const total1 = ref(0);
const total2 = ref(0);
const title = ref("");
const yeares = ref([]);
const options = ref([]);
const depts = ref([]);
const options1 = ref([]);
const targetDutyList = ref([]);
const subtableList = ref([]);
const deptOptions = ref(undefined);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    typeId: null,
    totalScore: null,
    conclusion: null,
    examineTime: null,
    fillinUserName: null,
    fillinDeptName: null,
    fillinTime: null,
    inspectionSituation: null,
    rem: null,
    type: '2',
  },
  queryParam2s:{
    pageNum: 1,
    pageSize: 10,
    targetLevelDicId:'',
    yeaes:'',
    title:'',
    status:'2'
  },

  queryParam1s: {
    pageNum: 1,
    pageSize: 10,
    staffNo: null,
    staffName: null,
    delFlag:'0',
  },
  rules: {
    typeId: [
      { required: true, message: "考核部门不能为空", trigger: "blur" }
    ],
    totalScore: [
      { required: true, message: "总分值不能为空", trigger: "blur" }
    ],
    conclusion: [
      { required: true, message: "考核结论不能为空", trigger: "blur" }
    ],
    examineTime: [
      { required: true, message: "考核日期不能为空", trigger: "blur" }
    ],
    fillinUserName: [
      { required: true, message: "填报人不能为空", trigger: "blur" }
    ],
    fillinDeptName: [
      { required: true, message: "填报人部门不能为空", trigger: "blur" }
    ],
    fillinTime: [
      { required: true, message: "填报日期不能为空", trigger: "blur" }
    ],
    inspectionSituation: [
      { required: true, message: "检查情况不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules, queryParam1s, queryParam2s } = toRefs(data);

/** 查询部门下拉树结构 */
function getTreeselect() {
  treeselect().then(response => {
    deptOptions.value = response.data;
  });
};


function calcu(){
  let count=0;
  subtableList.value.forEach((j, index) => {
    if(j.scoreValue!=null){
      count = parseInt(count) + parseInt(j.scoreValue);
    }
  })
  form.value.totalScore = count;
}

function closeDetail(row){
  console.log(row);
  exampleopen.value = false;
  open.value = true;
  subtableList.value = row.subtableList;
  form.value.targetDutyId = row.id
}

/** 人员信息搜索按钮操作 */
function handleQuery1() {
  queryParam1s.value.pageNum = 1;
  getStaffList();
};


function handleQuery2(){
  queryParam2s.value.pageNum = 1;
  getTargetDuty();
}

function getTargetDuty(){
  listTargetDuty(queryParam2s.value).then(response => {
    if(response.total>0){
      for(let row of response.rows){
        if(row.suitDeptId != ""){
          row.suitDeptIdArray = row.suitDeptId.split(",");
        }
      }
    }
    targetDutyList.value = response.rows;
    total1.value = response.total;
  });
}

function getLevelDicList(){
  listTargetLevelDic({delFlag:'0'}).then(response => {
    options1.value = response.rows;
  });
}

function getdept(){
  loading1.value = true;
  listDept({delFlag:'0',status:'0'}).then(response => {
    depts.value = response.data;
    getList();
  });
  loading1.value = false;
}

function getTypeDicList(){
  listTargetTypeDic({delFlag:'0'}).then(response => {
    options.value = response.rows;
  });
}

function years() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    years.push(i);
  }
  return years;
}

/** 查询安全考核管理列表 */
function getList() {
  loading.value = true;
  listTargetUserExamine(queryParams.value).then(response => {
    if(response.total>0){
      for(let row of response.rows){
        if(row.suitDeptId != ""){
          row.suitDeptIdArray = row.suitDeptId.split(",");
        }
      }
    }
    targetUserExamineList.value = response.rows;
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
    typeId: null,
    totalScore: null,
    conclusion: null,
    examineTime: null,
    fillinUserName: null,
    fillinDeptName: null,
    fillinTime: null,
    inspectionSituation: null,
    rem: null,
    type: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("targetDeptExamineRef");
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
  form.value.delFlag = '0'
  form.value.type = '2'
  form.value.fillinUserName = store.getters.user.nickName
  form.value.fillinDeptName = store.getters.user.dept.deptName
  form.value.fillinTime = formatDate(new Date())

  exampleopen.value = true;
  title.value = "添加部门考核管理";
}

function formatDate(params) {
  let date = new Date(params);
  let time = new Date(date.getTime());
  return parseTime(time,'{y}-{m}-{d} {h}:{i}:{s}');
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getTargetUserExamine(id).then(response => {
    form.value = response.data;
    subtableList.value = form.value.subtableList;
    open.value = true;
    title.value = "修改部门考核管理";
  });
}

/** 查看按钮操作 */
function handleLook(row) {
  reset();
  const id = row.id
  getTargetUserExamine(id).then(response => {
    form.value = response.data;
    subtableList.value = form.value.subtableList;
    lookopen.value = true;
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["targetDeptExamineRef"].validate(valid => {
    if (valid) {
      form.value.subtableList = subtableList.value;
      if (form.value.id != null) {
        updateTargetUserExamine(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addTargetUserExamine(form.value).then(response => {
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
    return delTargetUserExamine(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

getdept();
getTreeselect();
getTypeDicList();
getLevelDicList();
getTargetDuty();
yeares.value = years();
</script>
