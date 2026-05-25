<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="回执结果" prop="result">
        <el-select v-model="queryParams.result" clearable filterable placeholder="全部">
          <el-option
              key="拒绝"
              label="拒绝"
              value="拒绝"
          ></el-option>
          <el-option
              key="同意"
              label="同意"
              value="同意"
          ></el-option>
          <el-option
              key="未回执"
              label="未回执"
              value="未回执"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预约开始时间">
        <el-date-picker
            v-model="value2"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="visitReservationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="${comment}" align="center" prop="id" />-->
<!--      <el-table-column label="公司id" align="center" prop="enterpriseCode" />-->
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="手机号" align="center" prop="phone" />
<!--      <el-table-column label="性别" align="center" prop="sex" />-->
<!--      <el-table-column label="证件类型" align="center" prop="credentialType" />-->
<!--      <el-table-column label="证件号" align="center" prop="credentialNum" />-->
      <el-table-column label="公司名称" align="center" prop="company" />
<!--      <el-table-column label="车牌号码" align="center" prop="carNum" />-->
<!--      <el-table-column label="员工id" align="center" prop="staffId" />-->
      <el-table-column label="访问事由" align="center" prop="reason" />
      <el-table-column label="被访人员" align="center" prop="staffName" />
      <el-table-column label="预约开始时间" align="center" prop="startTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预约结束时间" align="center" prop="endTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="回执结果" align="center" prop="result" />
<!--      <el-table-column label="拒绝原因" align="center" prop="content" />-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            @click="handleUpdate(scope.row)"
          >查看详情</el-button>
          <el-button
              v-if="scope.row.staffId == staffid && scope.row.result == '未回执'"
              type="text"
              @click="handleChange(scope.row)"
          >回执</el-button>
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

    <!-- 添加或修改访客预约对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="visitReservationRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" readonly placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" readonly placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="证件号" prop="credentialNum">
          <el-input v-model="form.credentialNum" readonly placeholder="请输入证件号" />
        </el-form-item>
        <el-form-item label="公司名称" prop="company">
          <el-input v-model="form.company" readonly placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="车牌号码" prop="carNum">
          <el-input v-model="form.carNum" readonly placeholder="请输入车牌号码" />
        </el-form-item>
        <el-form-item label="被访员工" prop="staffName">
          <el-input v-model="form.staffName" readonly placeholder="请输入员工id" />
        </el-form-item>
        <el-form-item label="访问事由" prop="reason">
          <el-input v-model="form.reason" placeholder="请输入访问事由" />
        </el-form-item>
        <el-form-item label="预约开始时间" prop="startTime">
          <el-input v-model="form.startTime" readonly/>
        </el-form-item>
        <el-form-item label="预约结束时间" prop="endTime">
          <el-input v-model="form.endTime" readonly/>
        </el-form-item>
        <el-form-item label="回执结果" prop="result">
          <el-input v-model="form.result" readonly placeholder="请输入回执结果" />
        </el-form-item>
        <el-form-item label="拒绝原因">
          <textarea v-model="form.content" readonly :min-height="400"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
<!--          <el-button type="primary" @click="submitForm">确 定</el-button>-->
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog :title="title" v-model="changeOpen" width="500px" append-to-body>
      <el-form ref="visitReservationRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" readonly placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" readonly placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="证件号" prop="credentialNum">
          <el-input v-model="form.credentialNum" readonly placeholder="请输入证件号" />
        </el-form-item>
        <el-form-item label="公司名称" prop="company">
          <el-input v-model="form.company" readonly placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="车牌号码" prop="carNum">
          <el-input v-model="form.carNum" readonly placeholder="请输入车牌号码" />
        </el-form-item>
        <el-form-item label="被访员工" prop="staffName">
          <el-input v-model="form.staffName" readonly placeholder="请输入员工id" />
        </el-form-item>
        <el-form-item label="访问事由" prop="reason">
          <el-input v-model="form.reason" placeholder="请输入访问事由" />
        </el-form-item>
        <el-form-item label="预约开始时间" prop="startTime">
          <el-input v-model="form.startTime" readonly/>
        </el-form-item>
        <el-form-item label="预约结束时间" prop="endTime">
          <el-input v-model="form.endTime" readonly/>
        </el-form-item>
        <el-form-item label="回执结果" prop="result">
          <el-radio-group v-model="form.result">
            <el-radio label="同意"></el-radio>
            <el-radio label="拒绝"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.result == '拒绝'" label="拒绝原因">
          <textarea v-model="form.content" :min-height="400"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="changeCancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup name="VisitReservation">
import { listVisitReservation, getVisitReservation, delVisitReservation, addVisitReservation, updateVisitReservation } from "@/api/safework/visitReservation";
import { listVisitorUser } from "@/api/safework/visitorUser";
import {parseTime} from "@/utils/ruoyi";
const userStore = useUserStore()
const userStore = useUserStore()
const { proxy } = getCurrentInstance();

const visitReservationList = ref([]);
const userList = ref([]);
const open = ref(false);
const changeOpen = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const changeTitle = ref("");
const staffid = ref("");
const value2 = ref('')

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    enterpriseCode: userStore.user.thirdDeptId == null ? userStore.user.deptId:userStore.user.thirdDeptId ,
    name: null,
    phone: null,
    sex: null,
    credentialType: null,
    credentialNum: null,
    company: null,
    carNum: null,
    staffId: null,
    reason: null,
    startTime: null,
    endTime: null,
    result: null,
    content: null,

  },

  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);


// function change2(){
//
// }
function timeFormat(time) { // 时间格式化 2019-09-08
  let year = time.getFullYear();
  let month = time.getMonth() + 1;
  let day = time.getDate();
  let hh = time.getHours();
  let dd = time.getMinutes();
  let ss = time.getSeconds();
  return year + '-' + month + '-' + day + ' ' + hh + ':' + dd + ':' + ss;
}

/** 查询访客预约列表 */
function getList() {
  if (value2.value != null && value2.value != ''){
    queryParams.value.createTime = timeFormat(value2.value[0])
    queryParams.value.updateTime = timeFormat(value2.value[1])
  }else {
    queryParams.value.createTime = null
    queryParams.value.updateTime = null
  }


  let date = parseTime(new Date(), '{y}-{m}-{d} {h}:{i}:{s}');
  // console.log(date)

  loading.value = true;
  listVisitReservation(queryParams.value).then(response => {
    visitReservationList.value = response.rows;


    visitReservationList.value.forEach(function (arr, index) {


      // console.log(parseTime(arr.endTime, '{y}-{m}-{d} {h}:{i}:{s}'))

      if(parseTime(arr.endTime, '{y}-{m}-{d} {h}:{i}:{s}') < date){
        arr.result = '已过期'
      }
    })

    total.value = response.total;
    loading.value = false;
  });
}

function getUser() {

  console.log(userStore.user)

  queryParams.value.staffId = null
  staffid.value = userStore.user.userId
  listVisitorUser().then(response => {
    userList.value = response.rows;
    let userId = userStore.user.userId
    let a=false
    userList.value.forEach(function (arr, index) {
      if(arr.userId == userId){
        a=true
      }
    })
    if (a){
      getList();
    }else {
      queryParams.value.staffId = staffid.value
      getList();
    }
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

function changeCancel() {
  changeOpen.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    enterpriseCode: null,
    name: null,
    phone: null,
    sex: null,
    credentialType: null,
    credentialNum: null,
    company: null,
    carNum: null,
    staffId: null,
    reason: null,
    startTime: null,
    endTime: null,
    result: null,
    content: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("visitReservationRef");
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
  title.value = "添加访客预约";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getVisitReservation(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "查看访客预约";
  });
}

function handleChange(row) {
  reset();
  const id = row.id || ids.value
  getVisitReservation(id).then(response => {
    form.value = response.data;
    changeOpen.value = true;
    changeTitle.value = "回执";
  });
}

/** 提交按钮 */
function submitForm() {


  updateVisitReservation(form.value).then(response => {
    proxy.$modal.msgSuccess("回执成功");
    changeOpen.value = false;
    getList();
  });

  // proxy.$refs["visitReservationRef"].validate(valid => {
  //   if (valid) {
  //     if (form.value.id != null) {
  //       updateVisitReservation(form.value).then(response => {
  //         proxy.$modal.msgSuccess("修改成功");
  //         open.value = false;
  //         getList();
  //       });
  //     } else {
  //       addVisitReservation(form.value).then(response => {
  //         proxy.$modal.msgSuccess("新增成功");
  //         open.value = false;
  //         getList();
  //       });
  //     }
  //   }
  // });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const idss = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除访客预约编号为"' + idss + '"的数据项？').then(function() {
    return delVisitReservation(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/visitReservation/export', {
    ...queryParams.value
  }, `visitReservation_${new Date().getTime()}.xlsx`)
}

getUser();
</script>
