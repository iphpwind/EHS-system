<template>
  <div class="app-container">
    <el-form ref="invesTsuserRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="未排查推送人" prop="wpcUserId">
        <el-select multiple v-model="user1">
          <el-option
              v-for="item in userOptions"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="超期未整改推送人" prop="cqwzgUserId">
        <el-select multiple v-model="user2">
          <el-option
              v-for="item in userOptions"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <!--      <el-button @click="cancel">取 消</el-button>-->
    </div>
  </div>
</template>

<script setup name="InvesTsuser">
import { listInvesTsuser, getInvesTsuser, delInvesTsuser, addInvesTsuser, updateInvesTsuser } from "@/api/safework/invesTsuser";
import { getUserList } from '@/api/system/user'
const { proxy } = getCurrentInstance();

const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");
const userOptions = ref([]);
const user1 = ref();
const user2 = ref(null);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deptId: null,
    wpcUserId: null,
    cqwzgUserId: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);


function getUser(){
  getUserList().then(response => {
    userOptions.value = response.rows;
  });
}

/** 查询预警推送人员列表 */
function getList() {
  loading.value = true;
  listInvesTsuser(queryParams.value).then(response => {
    if (response.total>0){
      form.value = response.rows[0]
      user1.value = []
      user2.value = []
      if (form.value.cqwzgUserId){
        let b = []
        b = form.value.cqwzgUserId.split(',')
        b.forEach((j, index) => {
          user2.value.push(Number(j))
        })
      }
      if (form.value.wpcUserId){
        let b = []
        b = form.value.wpcUserId.split(',')
        b.forEach((j, index) => {
          user1.value.push(Number(j))
        })
      }
    }
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
    deptId: null,
    wpcUserId: null,
    cqwzgUserId: null,
    createTime: null,
    updateTime: null
  };
  proxy.resetForm("invesTsuserRef");
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
  title.value = "添加预警推送人员";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const id = row.id || ids.value
  getInvesTsuser(id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改预警推送人员";
  });
}

/** 提交按钮 */
function submitForm() {

  proxy.$refs["invesTsuserRef"].validate(valid => {
    if (valid) {
      form.value.cqwzgUserId = user2.value.join(',')
      form.value.wpcUserId = user1.value.join(',')
      if (form.value.id != null) {
        updateInvesTsuser(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addInvesTsuser(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除预警推送人员编号为"' + idss + '"的数据项？').then(function() {
    return delInvesTsuser(idss);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('safework/invesTsuser/export', {
    ...queryParams.value
  }, `invesTsuser_${new Date().getTime()}.xlsx`)
}
getUser();
getList();
</script>
