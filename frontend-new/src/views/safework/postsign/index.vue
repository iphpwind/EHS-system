<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="岗位告知卡" prop="threePostId">
        <el-input
          v-model="queryParams.postName"
          placeholder="请输入岗位告知卡"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item>-->
<!--        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>-->
<!--        <el-button icon="Refresh" @click="resetQuery">重置</el-button>-->
<!--      </el-form-item>-->
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['safework:postsign:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['safework:postsign:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="postsignList" @selection-change="handleSelectionChange">
      <el-table-column label="告知人" align="center" prop="userName" />
      <el-table-column label="签字状态" align="center" prop="sign" >
        <template #default="scope">
          <span v-if="scope.row.sign == '' || scope.row.sign == null">未签名</span>
          <span v-else>已签名</span>
        </template>
      </el-table-column>
      <el-table-column label="签字日期" align="center" prop="updateTime" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Edit"
            @click="godetail(scope.row)"
            v-hasPermi="['safework:postsign:edit']"
          >查看详情</el-button>
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['safework:postsign:remove']"
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
        <el-table @row-click="clickRow" ref="table" :data="userOptions" @selection-change="handleSelectionChange2"
                  height="260px">
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

<script setup name="Postsign">
import { listPostsign, getPostsign, delPostsign, addPostsign, updatePostsign, batchAdd } from "@/api/safework/postsign";
import { listByInfo } from "@/api/system/user";
import {h} from "vue";

const { proxy } = getCurrentInstance();

const postsignList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const postIds = ref([]);
const userOptions = ref([]);
const visible = ref(false);
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
    threePostId: proxy.$route.query.postId,
    postName:proxy.$route.query.postName,
    userId: null,
    sign: null,
    publishSatus: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询岗位告知卡接收人签名列表 */
function getList() {
  loading.value = true;
  userIds.value = []
  listPostsign(queryParams.value).then(response => {
    postsignList.value = response.rows;
    postsignList.value.forEach((j, index) => {
      userIds.value.push(parseInt(j.userId))
    })
    total.value = response.total;
    loading.value = false;
  });
}
// function getUserList() {
//
//   listBypostid(postIds.value).then(res => {
//     console.log(res)
//     userOptions.value = res.data
//   })
// }

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    threePostId: null,
    userId: null,
    sign: null,
    publishSatus: null,
    delFlag: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null
  };
  proxy.resetForm("postsignRef");
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
  form.value.threePostId = proxy.$route.query.postId;
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

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getPostsign(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改岗位告知卡接收人签名";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["postsignRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updatePostsign(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPostsign(form.value).then(response => {
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
    return delPostsign(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/postsign/export', {
    ...queryParams.value
  }, `postsign_${new Date().getTime()}.xlsx`)
}
function godetail(row){
  proxy.$router.push({
    path: '/three/postdetail',
    query:{
      postId:row.threePostId,
      signId:row.id
    }
  })
}

getList();
</script>
