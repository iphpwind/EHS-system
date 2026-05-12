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
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-radio-group v-model="radio3" size="medium" @change="timechose">
        <el-radio-button label="近一月"></el-radio-button>
        <el-radio-button label="近三月"></el-radio-button>
      </el-radio-group>
    </el-form>

    <el-table height="calc(100vh - 330px)" v-loading="loading" :data="unitList" @selection-change="handleSelectionChange">
<!--      <el-table-column type="selection" width="55" align="center" />-->
<!--      <el-table-column label="${comment}" align="center" prop="id" />-->
      <el-table-column label="分析对象" align="center" prop="objectName" />
      <el-table-column label="编码" align="center" prop="code" />
      <el-table-column label="名称" align="center" prop="name" />
      <el-table-column label="风险等级" align="center" prop="riskLevel" >
        <template #default="scope">
          <el-row justify="center" v-if="scope.row.riskLevel == '重大风险'"><span class="level" style="color: rgb(233, 0, 0);">{{scope.row.riskLevel}}</span></el-row>
          <el-row justify="center" v-else-if="scope.row.riskLevel == '较大风险'"><span class="level" style="color: rgb(239, 102, 0);">{{scope.row.riskLevel}}</span></el-row>
          <el-row justify="center" v-else-if="scope.row.riskLevel == '一般风险'"><span class="level" style="color: rgb(218, 192, 17);">{{scope.row.riskLevel}}</span></el-row>
          <el-row justify="center" v-else-if="scope.row.riskLevel == '低风险'"><span class="level" style="color: rgb(40, 140, 223);">{{scope.row.riskLevel}}</span></el-row>
          <el-row justify="center" v-else><span class="level" style="background-color: rgb(162,165,168);">暂未评级</span></el-row>
        </template>
      </el-table-column>
      <el-table-column label="有效开始时间" align="center" prop="effeTime" >
        <template #default="scope">
          <span>{{ QparseTime(scope.row.effeTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效结束时间" align="center" prop="effeTime" >
        <template #default="scope">
          <span>{{ parseTime(scope.row.effeTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人" align="center" prop="userName" />
      <el-table-column label="负责人电话" align="center" prop="phonenumber" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script setup name="Unit">
import { listUnit, getUnit, delUnit, addUnit, updateUnit } from "@/api/safework/unit";
import { getStaff } from "@/api/system/staff";
import {treeselect} from "@/api/system/dept";
import { listObject } from "@/api/safework/object";
import { listLevel } from "@/api/safework/level";
import { listRisklevel } from "@/api/safework/risklevel";
import {userList} from "@/api/system/user";
import {getToken} from "../../../utils/auth";
import {listPost} from "@/api/system/post";
import {parseTime} from "../../../utils";
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
const radio3 = ref("近一月")
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
// 获取当前时间
const currentDate = new Date();

// 将当前时间加一个月
currentDate.setMonth(currentDate.getMonth() + 1);
const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    objectId: null,
    effeTime: parseTime(currentDate, '{y}-{m}-{d}'),
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
function postchange(){
  console.log("45455"+form.value.postIds)
  if(form.value.deptId==null || form.value.deptId==''){
    proxy.$modal.msgWarning("先选择所属部门");
  }
  // else{
  //   form.value.postIds = null;
  //   listPost({deptId:form.value.deptId}).then(response => {
  //     postOptions.value = response.rows;
  //   });
  // }
}
function timechose(date){
  queryParams.value.effeTime='';
  // 获取当前时间
  const current = new Date();


  if(date == '近一月'){
    radio3.value = '近一月';
    // 将当前时间加一个月
    current.setMonth(currentDate.getMonth() + 1);

  }
  if(date == '近三月'){
    radio3.value = '近三月';
    // 将当前时间加三个月
    current.setMonth(currentDate.getMonth() + 3);
  }
  queryParams.value.effeTime=parseTime(current, '{y}-{m}-{d}');
  getList();
}
function getMsg(data){
  console.log('0000+')
  console.log(data)

  let val = data.id

  if(val==null || val=='' || val == 'undefined'){
        // proxy.$modal.msgWarning("先选择所属部门");
    }else{
      form.value.postIds = null;
      listPost({deptId:val}).then(response => {
        postOptions.value = response.rows;
      });
    }

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
  postOptions.value = []
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
  userList().then(res => {
    personcolumns.value = res.rows
  })
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
    form.value = response.data;
    listPost({deptId:form.value.deptId}).then(response => {
      postOptions.value = response.rows;
    });
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
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
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
      levelId:row.levelId
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

getObject();

</script>
<style>
.level{
  border-radius: 5px;
  padding: 2px 5px;
  color: #fff;
}
</style>
