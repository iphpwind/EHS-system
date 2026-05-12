<template>
  <div class="app-container">
    <!-- 添加或修改萤石云配置对话框 -->
      <el-form ref="ysconfigRef" :model="form" :rules="rules" label-width="180px">
        <el-form-item label="企业名称" prop="deptId">
          <tree-select
              v-model:value="form.deptId"
              :options="deptOptions"
              placeholder="请选择所属部门"
              :objMap="{ value: 'id', label: 'label', children: 'children' }"
          />
        </el-form-item>
        <el-form-item label="萤石云AppKey" prop="appkey">
          <el-input v-model="form.appkey" placeholder="请输入萤石云AppKey" />
        </el-form-item>
        <el-form-item label="萤石云Secret" prop="secret">
          <el-input v-model="form.secret" placeholder="请输入萤石云Secret" />
        </el-form-item>
      </el-form>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">保存</el-button>
      </div>

  </div>
</template>

<script setup name="Ysconfig">
import { listYsconfig, getYsconfig, delYsconfig, addYsconfig, updateYsconfig } from "@/api/safework/ysconfig";
import {treeselect} from "@/api/system/dept";

const { proxy } = getCurrentInstance();

const ysconfigList = ref([]);
const open = ref(false);
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
    deptId: null,
    appkey: null,
    secret: null
  },
  rules: {
    deptId: [
      { required: true, message: "所属企业不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询萤石云配置列表 */
function getList() {
  listYsconfig().then(response => {
    if(response.rows.length>0){
      form.value = response.rows[0];
    }

  });
}


/** 查询部门下拉树结构 */
function getTreeselect() {
  treeselect().then(response => {
    deptOptions.value = response.data;
  });
};

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
    appkey: null,
    secret: null
  };
  proxy.resetForm("ysconfigRef");
}


/** 提交按钮 */
function submitForm() {
  proxy.$refs["ysconfigRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateYsconfig(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addYsconfig(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

getList();
getTreeselect();
</script>
