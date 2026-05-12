<template>
  <div class="app-container">
    <el-form ref="codeRulesRef" :model="form" :rules="rules" label-width="80px">
      <ul class="rule">
        <li>
          <el-form-item label="动火作业:" prop="fire">
            <el-input v-model="form.fire" placeholder="请输入动火作业" />+日期时间编号编码规则
          </el-form-item>
        </li>
        <li>
          <el-form-item label="动土作业:" prop="earth">
            <el-input v-model="form.earth" placeholder="请输入动土作业" />+日期时间编号编码规则
          </el-form-item>
        </li>
        <li>
          <el-form-item label="临时用电:" prop="electric">
            <el-input v-model="form.electric" placeholder="请输入临时用电" />+日期时间编号编码规则
          </el-form-item>
        </li>
        <li>
          <el-form-item label="高处作业:" prop="high">
            <el-input v-model="form.high" placeholder="请输入高处作业" />+日期时间编号编码规则
          </el-form-item>
        </li>
        <li>
          <el-form-item label="吊装作业:" prop="hoisting">
            <el-input v-model="form.hoisting" placeholder="请输入吊装作业" />+日期时间编号编码规则
          </el-form-item>
        </li>
        <li>
          <el-form-item label="受限空间:" prop="restricted">
            <el-input v-model="form.restricted" placeholder="请输入受限空间" />+日期时间编号编码规则
          </el-form-item>
        </li>
        <li>
          <el-form-item label="盲板抽堵:" prop="blind">
            <el-input v-model="form.blind" placeholder="请输入盲板抽堵" />+日期时间编号编码规则
          </el-form-item>
        </li>
        <li>
          <el-form-item label="断路作业:" prop="broken">
            <el-input v-model="form.broken" placeholder="请输入断路作业" />+日期时间编号编码规则
          </el-form-item>
        </li>
      </ul>
    </el-form>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
  </div>
</template>

<script setup name="CodeRules">
import { listCodeRules, addCodeRules, updateCodeRules } from "@/api/safework/codeRules";

const { proxy } = getCurrentInstance();

const codeRulesList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    deptId: null,
    fire: null,
    earth: null,
    electric: null,
    high: null,
    hoisting: null,
    restricted: null,
    blind: null,
    broken: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询作业票编码规则列表 */
function getList() {
  loading.value = true;
  listCodeRules(queryParams.value).then(response => {
    if (response.total>0){
      form.value = response.rows[0]
    }
  });
}

// 取消按钮

// 表单重置
function reset() {
  form.value = {
    id: null,
    deptId: null,
    fire: null,
    earth: null,
    electric: null,
    high: null,
    hoisting: null,
    restricted: null,
    blind: null,
    broken: null
  };
  proxy.resetForm("codeRulesRef");
}


/** 提交按钮 */
function submitForm() {
  proxy.$refs["codeRulesRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateCodeRules(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCodeRules(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

getList();
</script>
<style scoped lang="scss">
.rule{
  padding:0;list-style: none;
  li{
    margin: 0 0 10px
  }
  :deep(.el-form) {

    .el-form-item__label{
      position: relative;
    }
    .el-form-item__label:before{
      content: "*";color: red;
      position: absolute;left: 0;top: 3px;font-size: 16px;
    }
  }
}
</style>
