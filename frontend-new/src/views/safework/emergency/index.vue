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
          v-hasPermi="['safework:emergency:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="emergencyList" @selection-change="handleSelectionChange">
      <el-table-column label="所属部门" align="center" prop="deptName" />
<!--      <el-table-column label="适用区域" align="center" prop="objectId" />-->
      <el-table-column label="适用区域" align="center" prop="objectId">
        <template #default="scope">
          <template v-for="(arr,index) in scope.row.objectIdArray" :key="arr">
            <template v-for="obj in obOptions" :key="obj.id">
              <span v-if="arr === obj.id">{{obj.name}}</span>
              <span v-if="arr === obj.id && index<scope.row.objectIdArray.length-1">,</span>
            </template>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="关联岗位卡名称" align="center" prop="postName" />
      <el-table-column label="应急卡编号" align="center" prop="num" />
      <el-table-column label="应急卡名称" align="center" prop="name" />
<!--      <el-table-column label="事故风险" align="center" prop="accidentRisk" />
      <el-table-column label="发生场所" align="center" prop="accurPlace" />
      <el-table-column label="工艺说明" align="center" prop="imgUrl" />
      <el-table-column label="事故特性" align="center" prop="characteristics" />
      <el-table-column label="危害描述" align="center" prop="hazardDescription" />
      <el-table-column label="步骤说明" align="center" prop="stepExplain" />
      <el-table-column label="处理措施" align="center" prop="dealMeasures" />
      <el-table-column label="主要负责人" align="center" prop="chargeUser" />
      <el-table-column label="注意事项" align="center" prop="attention" />
      <el-table-column label="内部应急电话" align="center" prop="innerTel" />
      <el-table-column label="外部应急电话" align="center" prop="outerTel" />
      <el-table-column label="相关附件" align="center" prop="fileUrl" />-->
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <el-row justify="center" v-if="scope.row.status == 0"><el-tag type="success">正常</el-tag></el-row>
          <el-row justify="center" v-else><el-tag type="danger">停用</el-tag></el-row>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['safework:emergency:edit']"
          >修改</el-button>
          <el-button
              type="text"
              @click="handleLook(scope.row)"
          >查看</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:emergency:remove']"
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

    <!-- 添加或修改应急卡对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="emergencyRef" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="所属部门" prop="deptId">
          <tree-select
              v-model:value="form.deptId"
              :options="deptOptions"
              placeholder="请选择所属部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
              @func="getMsg"
          />
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
        <el-form-item label="关联岗位卡名称" prop="postId">
          <el-select v-model="form.postId" clearable filterable placeholder="请选择">
            <el-option
                v-for="item in postOption"
                :key="item.postId"
                :label="item.postName"
                :value="item.postId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应急卡编号" prop="num">
          <el-input v-model="form.num" placeholder="请输入应急卡编号" />
        </el-form-item>
        <el-form-item label="应急卡名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入应急卡名称" />
        </el-form-item>
        <el-form-item label="事故风险" prop="accidentRisk">
          <el-input v-model="form.accidentRisk" type="textarea" placeholder="限500字" max="500"/>
        </el-form-item>
        <el-form-item label="发生场所" prop="accurPlace">
          <el-input v-model="form.accurPlace" type="textarea" placeholder="限500字" max="500"/>
        </el-form-item>
        <el-form-item label="工艺说明" prop="imgUrl">
          <ImageUpload
              v-model.value="form.imgUrl"
          />
        </el-form-item>
        <el-form-item label="事故特征" prop="characteristics">
          <el-input v-model="form.characteristics" type="textarea" placeholder="限500字" max="500"/>
        </el-form-item>
        <el-form-item label="危害描述" prop="hazardDescription">
          <el-input v-model="form.hazardDescription" type="textarea" placeholder="限500字" max="500"/>
        </el-form-item>
        <el-form-item label="步骤说明" prop="stepExplain">
          <el-input v-model="form.stepExplain" type="textarea" placeholder="限500字" max="500"/>
        </el-form-item>
        <el-form-item label="处理措施" prop="dealMeasures">
          <el-input v-model="form.dealMeasures" type="textarea" placeholder="限500字" max="500"/>
        </el-form-item>
        <el-form-item label="主要负责人" prop="chargeUser">
          <el-select v-model="form.chargeUser" placeholder="请选择" filterable @click="userchange">
            <el-option
                v-for="item in options"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="注意事项" prop="attention">
          <el-input v-model="form.attention" type="textarea" placeholder="限500字" max="500"/>
        </el-form-item>
        <el-form-item label="内部应急电话" prop="innerTel">
          <el-input v-model="form.innerTel" placeholder="请输入内部应急电话" />
        </el-form-item>
        <el-form-item label="外部应急电话" prop="outerTel">
          <el-input v-model="form.outerTel" placeholder="请输入外部应急电话" />
        </el-form-item>
        <el-form-item label="相关附件" prop="fileUrl">
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
    <!-- 查看应急卡对话框 -->
    <el-dialog :title="title" v-model="openlook" width="800px" append-to-body>
      <el-form ref="emergencyRef" :model="form" :rules="rules" label-width="150px" disabled>
        <el-form-item label="所属部门" prop="deptId">
          <el-input v-model="form.deptName" readonly/>
        </el-form-item>
        <el-form-item label="适用区域" prop="objectId">
          <el-input v-model="form.objnames" readonly/>
        </el-form-item>
        <el-form-item label="关联岗位卡名称" prop="postId">
          <el-input v-model="form.postName" readonly/>
        </el-form-item>
        <el-form-item label="应急卡编号" prop="num">
          <el-input v-model="form.num" readonly />
        </el-form-item>
        <el-form-item label="应急卡名称" prop="name">
          <el-input v-model="form.name" readonly />
        </el-form-item>
        <el-form-item label="事故风险" prop="accidentRisk">
          <el-input v-model="form.accidentRisk" type="textarea" readonly/>
        </el-form-item>
        <el-form-item label="发生场所" prop="accurPlace">
          <el-input v-model="form.accurPlace" type="textarea" readonly/>
        </el-form-item>
        <el-form-item label="工艺说明" prop="imgUrl">
          <ImageUpload
              v-model.value="form.imgUrl"
          />
        </el-form-item>
        <el-form-item label="事故特征" prop="characteristics">
          <el-input v-model="form.characteristics" type="textarea" readonly/>
        </el-form-item>
        <el-form-item label="危害描述" prop="hazardDescription">
          <el-input v-model="form.hazardDescription" type="textarea" readonly/>
        </el-form-item>
        <el-form-item label="步骤说明" prop="stepExplain">
          <el-input v-model="form.stepExplain" type="textarea" readonly/>
        </el-form-item>
        <el-form-item label="处理措施" prop="dealMeasures">
          <el-input v-model="form.dealMeasures" type="textarea" readonly/>
        </el-form-item>
        <el-form-item label="主要负责人" prop="chargeUser">
          <el-input v-model="form.nickName" readonly />
        </el-form-item>
        <el-form-item label="注意事项" prop="attention">
          <el-input v-model="form.attention" type="textarea" readonly/>
        </el-form-item>
        <el-form-item label="内部应急电话" prop="innerTel">
          <el-input v-model="form.innerTel" readonly />
        </el-form-item>
        <el-form-item label="外部应急电话" prop="outerTel">
          <el-input v-model="form.outerTel" readonly />
        </el-form-item>
        <el-form-item label="相关附件" prop="fileUrl">
          <FileUpload
              v-model.value="form.fileUrl"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="0" disabled>正常</el-radio>
            <el-radio label="1" disabled>停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup name="Emergency">
import { listEmergency, getEmergency, delEmergency, addEmergency, updateEmergency } from "@/api/safework/emergency";
import {h, ref} from "vue";
import {treeselect} from "@/api/system/dept";
import {listPost} from "@/api/system/post";
import { listObject } from "@/api/safework/object";
import { getUserList } from "@/api/system/user";

const { proxy } = getCurrentInstance();

const emergencyList = ref([]);
const open = ref(false);
const openlook = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const deptOptions = ref(undefined);
const postOption = ref(undefined);
const obOptions = ref([]);
const options = ref([]);

const data = reactive({
  form: {
    status: '0'
  },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    enterpriseCode: null,
    deptId: null,
    objectId: null,
    postId: null,
    num: null,
    name: null,
    accidentRisk: null,
    accurPlace: null,
    imgUrl: null,
    characteristics: null,
    hazardDescription: null,
    stepExplain: null,
    dealMeasures: null,
    chargeUser: null,
    attention: null,
    innerTel: null,
    outerTel: null,
    fileUrl: null,
    status: '0',
  },
  rules: {
    deptId: [
      { required: true, message: '请选择所属部门', trigger: 'change' }
    ],
    objectId: [
      { required: true, message: '请选择适用区域', trigger: 'change' }
    ],
    postId: [
      { required: true, message: '请选择关联岗位', trigger: 'change' }
    ],
    name: [
      { required: true, message: '请填写应急卡名称', trigger: 'blur' }
    ],
    num: [
      { required: true, message: '请填写应急卡编号', trigger: 'blur' }
    ],
    accidentRisk: [
      { required: true, message: '请填写事故风险', trigger: 'blur' }
    ],
    accurPlace: [
      { required: true, message: '请填写发生场所', trigger: 'blur' }
    ],
    imgUrl: [
      { required: true, message: '请填写工艺说明', trigger: 'blur' }
    ],
    characteristics: [
      { required: true, message: '请填写事故特性', trigger: 'blur' }
    ],
    hazardDescription: [
      { required: true, message: '请填写危害描述', trigger: 'blur' }
    ],
    stepExplain: [
      { required: true, message: '请填写步骤说明', trigger: 'blur' }
    ],
    dealMeasures: [
      { required: true, message: '请填写处理措施', trigger: 'blur' }
    ],
    chargeUser: [
      { required: true, message: '请选择主要负责人', trigger: 'blur' }
    ],
    attention: [
      { required: true, message: '请填写注意事项', trigger: 'blur' }
    ],
    innerTel: [
      { required: true, message: '请填写内部应急电话', trigger: 'blur' }
    ],
    outerTel: [
      { required: true, message: '请填写外部应急电话', trigger: 'blur' }
    ],
    fileUrl: [
      { required: true, message: '请添加附件', trigger: 'blur' }
    ],
    status: [
      { required: true, message: '请选择状态', trigger: 'blur' }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询应急卡列表 */
function getList() {
  loading.value = true;
  listEmergency(queryParams.value).then(response => {
    if(response.total>0){
      for(let row of response.rows){
        if(row.objectId != ""){
          row.objectIdArray = row.objectId.split(",");
        }
      }
    }
    emergencyList.value = response.rows;
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
    objectId: null,
    postId: null,
    num: null,
    name: null,
    accidentRisk: null,
    accurPlace: null,
    imgUrl: null,
    characteristics: null,
    hazardDescription: null,
    stepExplain: null,
    dealMeasures: null,
    chargeUser: null,
    attention: null,
    innerTel: null,
    outerTel: null,
    fileUrl: null,
    status: "0",
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("emergencyRef");
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

/** 查询岗位列表 */
function getPost() {
  listPost().then(response => {
    postOption.value = response.rows;
  });
}

function getMsg(data){
  let val = data.id

  if(val==null || val=='' || val == 'undefined'){
  }else{
    getUserList({deptId:val}).then(res => {
      options.value = res.rows;//list数据
    });
  }
}

function getObject() {
  listObject({delFlag:0}).then(res => {
    obOptions.value = res.rows;
  })
}

//获取用户
/*function getUserList(val) {
  if(form.value.deptId==null || form.value.deptId==''){
    proxy.$modal.msgWarning("先选择所属部门");
  }else{
    getUserList({deptId:val}).then(response => {
      options.value = response.rows;//list数据
    });
  }
}*/

//点击主要负责人触发事件
function userchange(){
  if(form.value.deptId==null || form.value.deptId==''){
    proxy.$modal.msgWarning("先选择所属部门");
  }
}

//点击适用区域触发事件
function objectchange(){
  if(form.value.deptId==null || form.value.deptId==''){
    proxy.$modal.msgWarning("先选择所属部门");
  }
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
  title.value = "添加应急卡";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getEmergency(id).then(response => {
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
    title.value = "修改应急卡";
  });
}

/** 修改按钮操作 */
function handleLook(row) {
  reset();
  const id = row.id || ids.value
  getEmergency(id).then(response => {
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
    title.value = "修改应急卡";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["emergencyRef"].validate(valid => {
    if (valid) {
      form.value.objectId = form.value.objectId.join(',');
      if (form.value.id != null) {
        updateEmergency(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEmergency(form.value).then(response => {
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
    return delEmergency(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/emergency/export', {
    ...queryParams.value
  }, `emergency_${new Date().getTime()}.xlsx`)
}

getList();
initTreeData();
getObject();
getPost();
</script>
