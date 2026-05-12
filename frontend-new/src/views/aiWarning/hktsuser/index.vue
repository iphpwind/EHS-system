<template>
  <div class="app-container">
<!--    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">-->
<!--      <el-form-item label="租户id" prop="tenId">-->
<!--        <el-input-->
<!--          v-model="queryParams.tenId"-->
<!--          placeholder="请输入租户id"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="user_id" prop="userId">-->
<!--        <el-input-->
<!--          v-model="queryParams.userId"-->
<!--          placeholder="请输入user_id"-->
<!--          clearable-->
<!--          @keyup.enter="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>-->
<!--        <el-button icon="Refresh" @click="resetQuery">重置</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['aiWarning:hktsuser:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['aiWarning:hktsuser:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['aiWarning:hktsuser:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['aiWarning:hktsuser:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="hktsuserList" @selection-change="handleSelectionChange">
<!--      <el-table-column type="selection" width="55" align="center" />-->
<!--      <el-table-column label="${comment}" align="center" prop="id" />-->
<!--      <el-table-column label="租户id" align="center" prop="tenId" />-->
      <el-table-column label="用户" align="center" prop="nickName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            type="text"
            icon="Delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['aiWarning:hktsuser:remove']"
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

<!--    &lt;!&ndash; 添加或修改AI告警推送人员对话框 &ndash;&gt;-->
<!--    <el-dialog :title="title" v-model="open" width="500px" append-to-body>-->
<!--      <el-form ref="hktsuserRef" :model="form" :rules="rules" label-width="80px">-->
<!--&lt;!&ndash;        <el-form-item label="租户id" prop="tenId">&ndash;&gt;-->
<!--&lt;!&ndash;          <el-input v-model="form.tenId" placeholder="请输入租户id" />&ndash;&gt;-->
<!--&lt;!&ndash;        </el-form-item>&ndash;&gt;-->
<!--        <el-form-item label="user_id" prop="userId">-->
<!--          <el-input v-model="form.userId" placeholder="请输入user_id" />-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <template #footer>-->
<!--        <div class="dialog-footer">-->
<!--          <el-button type="primary" @click="submitForm">确 定</el-button>-->
<!--          <el-button @click="cancel">取 消</el-button>-->
<!--        </div>-->
<!--      </template>-->
<!--    </el-dialog>-->
    <!-- 选择责任人员 -->
    <el-dialog title="选择推送人" v-model="open" width="800px" top="5vh" append-to-body>
      <el-row>
        <el-table @row-click="clickRow" ref="tables" :data="userOptions" @selection-change="handleSelectionChange2"
                  height="260px">
          <el-table-column :selectable="selectable" type="selection" width="55"></el-table-column>
          <el-table-column prop="userId" label="人员编号" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="nickName" label="人员名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="dept.deptName" label="部门" :show-overflow-tooltip="true"></el-table-column>
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

<script setup name="Hktsuser">
import { listHktsuser, getHktsuser, delHktsuser, addHktsuser, updateHktsuser } from "@/api/aiWarning/hktsuser";
import { listUser } from "@/api/system/user";
import {h} from "vue";
const { proxy } = getCurrentInstance();

const hktsuserList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const userOptions = ref([]);
const tables = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    tenId: null,
    userId: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询责任人列表 **/
function getUserList(){
  listUser().then(response => {
    userOptions.value = response.rows;
  });
}
/** 多选框选中数据 */
function handleSelectionChange2(selection) {
  tables.value = selection.map(item => item.userId);
}
/** 选择巡检人员确定按钮操作 */
function handleUserIds() {

  tables.value.forEach(tsuser => {
    let aa = {};
    aa.userId = tsuser;
    addHktsuser(aa).then(response => {
    });
  })
  proxy.$nextTick(() => {
    getList()
    open.value = false;
  })

}


/** 查询AI告警推送人员列表 */
function getList() {
  loading.value = true;
  listHktsuser(queryParams.value).then(response => {
    hktsuserList.value = response.rows;
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
    tenId: null,
    userId: null,
    createTime: null,
    updateTime: null
  };
  proxy.resetForm("hktsuserRef");
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
  title.value = "添加AI告警推送人员";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getHktsuser(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改AI告警推送人员";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["hktsuserRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateHktsuser(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addHktsuser(form.value).then(response => {
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
    return delHktsuser(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('aiWarning/hktsuser/export', {
    ...queryParams.value
  }, `hktsuser_${new Date().getTime()}.xlsx`)
}

getList();
getUserList();
const userIds = computed(() => {
  return hktsuserList.value.map((item) => item.userId)
})
const selectable = (row, index) => {
  if (userIds.value.includes(row.userId)) {
    return false
  }else {
    return true
  }
}
</script>
