<template>
  <div class="app-container">
    <el-form ref="rpbaseRef" :model="form" :rules="rules" label-position="right" label-width="180px">
      <ul class="jiangcheng">
        <li>
          <el-form-item label="排查项有异常且上报">
            <el-radio v-model="form.oneType" label="1">奖</el-radio>
            <el-radio v-model="form.oneType" label="-1">惩</el-radio>
            <el-input-number v-model="form.oneNum" :min="1" label="描述文字">
            </el-input-number>
          </el-form-item>
        </li>
        <li>
          <el-form-item label="排查项有异常未上报">
            <el-radio v-model="form.twoType" label="1">奖</el-radio>
            <el-radio v-model="form.twoType" label="-1">惩</el-radio>
            <el-input-number v-model="form.twoNum" :min="1" label="描述文字">
            </el-input-number>
          </el-form-item>
        </li>
        <li>
          <el-form-item label="临时上报隐患">
            <el-radio v-model="form.threeType" label="1">奖</el-radio>
            <el-radio v-model="form.threeType" label="-1">惩</el-radio>
            <el-input-number v-model="form.threeNum" :min="1" label="描述文字">
            </el-input-number>
          </el-form-item>
        </li>
        <li>
          <el-form-item label="排查任务未完成（一条）">
            <el-radio v-model="form.fourType" label="1">奖</el-radio>
            <el-radio v-model="form.fourType" label="-1">惩</el-radio>
            <el-input-number v-model="form.fourNum" :min="1" label="描述文字">
            </el-input-number>
          </el-form-item>
        </li>
        <li>
          <el-form-item label="隐患整改超期奖惩">
            <el-radio v-model="form.fiveType" label="1">奖</el-radio>
            <el-radio v-model="form.fiveType" label="-1">惩</el-radio>
            <el-input-number v-model="form.fiveNum" :min="1" label="描述文字">
            </el-input-number>
          </el-form-item>
        </li>
        <li>
            <el-form-item label="每个积分对应金额">
              <el-input-number v-model="form.money" :min="1" label="描述文字">
              </el-input-number>
            </el-form-item>
        </li>
      </ul>
    </el-form>
    <div class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
<!--      <el-button @click="cancel">取 消</el-button>-->
    </div>
  </div>
</template>

<script setup name="Rpbase">
import { listRpbase, getRpbase, delRpbase, addRpbase, updateRpbase } from "@/api/safework/rpbase";

const { proxy } = getCurrentInstance();

const rpbaseList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {
    id:null,
    oneNum: 1,
    oneType: '1',
    twoNum: 1,
    twoType: '-1',
    threeNum: 1,
    threeType: '1',
    fourNum: 1,
    fourType: '-1',
    fiveNum: 1,
    fiveType: '-1',
    money: 1,
  },
  rules: {
  }
});

const { form, rules } = toRefs(data);

/** 查询奖惩规则列表 */
function getList() {
  loading.value = true;
  listRpbase().then(response => {
    if (response.total>0){
      form.value = response.rows[0]
    }
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["rpbaseRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateRpbase(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addRpbase(form.value).then(response => {
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
.dengjiedit{
  padding:0;list-style: none;
  li{
    margin: 0 0 10px
  }
  :deep(.el-select) {
    display: inline-block;width: 100px;
    margin: 0 5px;
  }
}
.jiangcheng{
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
