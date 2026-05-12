<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
<!--      <el-form-item label="承诺人" prop="userId">-->
<!--        <el-input-->
<!--          v-model="queryParams.userId"-->
<!--          placeholder="请输入承诺人"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
    <el-form-item label="承诺卡" prop="promiseName">
        <el-input
          v-model="queryParams.promiseName"
          readonly
        />
      </el-form-item>
      <el-form-item>
<!--        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>-->
        <el-button @click="goback">返回</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['safework:promisesign:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="promisesignList">
      <el-table-column label="年份" align="center" prop="years" />
      <el-table-column label="岗位" align="center" prop="postName" />
      <el-table-column label="部门" align="center" prop="deptName" />
      <el-table-column label="主管领导" align="center" prop="nickName" />
      <el-table-column label="承诺人" align="center" prop="userName" />
      <el-table-column label="签名状态" align="center" prop="sign">
        <template #default="scope">
          <el-row justify="center" v-if="scope.row.sign !=null && scope.row.sign !=''"><el-tag type="success">已签字</el-tag></el-row>
          <el-row justify="center" v-else><el-tag type="danger">未签字</el-tag></el-row>
        </template>
      </el-table-column>

      <el-table-column label="承诺日期" align="center" prop="signTime">
        <template #default="scope">
          <span>{{ parseTime(scope.row.signTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            @click="handleLook(scope.row)"
          >查看详情</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:promisesign:remove']"
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

    <!-- 选择责任人员 -->
    <el-dialog title="选择接收人" v-model="visible" width="800px" top="5vh" append-to-body>
      <el-row>
        <el-table @row-click="clickRow" ref="table" :data="userOptions" height="260px" @selection-change="handleSelectionChange2">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="userId" label="人员编号" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="nickName" label="人员名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="deptName" label="部门" :show-overflow-tooltip="true"></el-table-column>
        </el-table>
      </el-row>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleUserIds">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Promisesign">
import { listPromisesign, getPromisesign, delPromisesign, addPromisesign, updatePromisesign,batchAdd } from "@/api/safework/promisesign";
import { listByInfo } from "@/api/system/user";
import {h} from "vue";
const { proxy } = getCurrentInstance();

const promisesignList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const userOptions = ref([]);
const visible = ref(false);
const postIds = ref([]);
const userIds = ref([]);
const tables = ref([]);
const tableNames = ref([]);

let aa = proxy.$route.query.postIds.split(",");
aa.forEach((j, index) => {
  postIds.value.push(parseInt(j))
})

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: null,
    threePromiseId: proxy.$route.query.promiseId,
    promiseName: proxy.$route.query.promiseName
  },
  rules: {
  },

});

const { queryParams, form, rules } = toRefs(data);

/** 查询承诺卡承诺人签字列表 */
function getList() {
  loading.value = true;
  userIds.value = []
  listPromisesign(queryParams.value).then(response => {
    promisesignList.value = response.rows;
    promisesignList.value.forEach((j, index) => {
      userIds.value.push(parseInt(j.userId))
    })
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
    threePromiseId: null,
    userId: null,
    delFlag: 0,
  };
  proxy.resetForm("promisesignRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}
/** 搜索按钮操作 */
function goback() {
  proxy.$router.push({
    path: '/three/promise',
  })
}

/** 查看详情按钮操作 */
function handleLook(row) {
  proxy.$router.push({
    path: '/three/promisedetail',
    query:{
      id:row.id
    }
  })
}

/** 多选框选中数据 */
function handleSelectionChange2(selection) {
  tables.value = selection.map(item => item.userId);
  tableNames.value = selection.map(item => item.nickName);
}

/** 选择巡检人员确定按钮操作 */
function handleUserIds() {
  const userIds = tables.value.join(",");
  const userNames = tableNames.value.join(",");
  if (userIds == "") {
    proxy.$modal.msgError("请选择人员");
    return;
  }
  form.value.threePromiseId = proxy.$route.query.promiseId;
  form.value.userId = userIds;
  batchAdd(form.value).then(response => {
    proxy.$modal.msgSuccess("新增成功");
    visible.value = false;
    getList();
  });
}


/** 新增按钮操作 */
function handleAdd() {
  listByInfo({userIds:userIds.value,postIds:postIds.value}).then(res => {
    userOptions.value = res.rows
    console.log(userOptions.value)
    visible.value = true;
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const idss = row.id || ids.value;
  proxy.$modal.confirm(h('p',null,[h('span', { style: 'color: black' },'确定删除该数据吗'),h('p', { style: 'color: red' }, "删除后不可恢复!!!")]),{
  }).then(function () {
    return delPromisesign(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/promisesign/export', {
    ...queryParams.value
  }, `promisesign_${new Date().getTime()}.xlsx`)
}

getList();
</script>
