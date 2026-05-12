<template>
  <div class="app-container">
    <el-form ref="safesettingRef" :model="form" :rules="rules" label-width="80px">
      <ul class="dengjiedit">
        <li>
          是否启用:
          <el-radio-group v-model="form.isQy">
            <el-radio key="0" label="0">是</el-radio>
            <el-radio key="1" label="1">否</el-radio>
          </el-radio-group>
        </li>
        <li>
          <span>特级动火有效期
          <el-input v-model="form.specialPeriodOf" style="width: 80px"/>
          h自动更新</span>
          <span style="margin-left: 100px;">提前<el-input v-model="form.specialAdvanceOf" style="width: 80px"/>h提醒到期</span>
        </li>
        <li>
          <span>一级动火有效期
          <el-input v-model="form.onePeriodOf" style="width: 80px"/>
          h自动更新</span>
          <span style="margin-left: 100px;">提前<el-input v-model="form.oneAdvanceOf" style="width: 80px"/>h提醒到期</span>
        </li>
        <li>
          <span>二级动火有效期
          <el-input v-model="form.twoPeriodOf" style="width: 80px"/>
          h自动更新</span>
          <span style="margin-left: 100px;">提前<el-input v-model="form.twoAdvanceOf" style="width: 80px"/>h提醒到期</span>
        </li>
        <li>
         <span>受限空间有效期
          <el-input v-model="form.restrictePeriodOf" style="width: 80px"/>
          h自动更新</span>
          <span style="margin-left: 100px;">提前<el-input v-model="form.restricteAdvanceOf" style="width: 80px"/>h提醒到期</span>
        </li>
        <li>
          <span>高处作业有效期
          <el-input v-model="form.highPeriodOf" style="width: 80px"/>
          天自动更新</span>
          <span style="margin-left: 100px;">提前<el-input v-model="form.highAdvanceOf" style="width: 80px"/>h提醒到期</span>
        </li>
        <li>
          <span>临时用电有效期
          <el-input v-model="form.electricPeriodOf" style="width: 80px"/>
          天自动更新</span>
          <span style="margin-left: 100px;">提前<el-input v-model="form.electricAdvanceOf" style="width: 80px"/>h提醒到期</span>
        </li>
        <li>
          <span>动土作业有效期
          <el-input v-model="form.earthPeriodOf" style="width: 80px"/>
          天自动更新</span>
          <span style="margin-left: 100px;">提前<el-input v-model="form.earthAdvanceOf" style="width: 80px"/>h提醒到期</span>
        </li>
        <li>
          <span>盲板抽堵有效期
          <el-input v-model="form.blindPeriodOf" style="width: 80px"/>
          天自动更新</span>
          <span style="margin-left: 100px;">提前<el-input v-model="form.blindAdvanceOf" style="width: 80px"/>h提醒到期</span>
        </li>
        <li>
          <span>断路作业有效期
          <el-input v-model="form.brokenPeriodOf" style="width: 80px"/>
          天自动更新</span>
          <span style="margin-left: 100px;">提前<el-input v-model="form.brokenAdvanceOf" style="width: 80px"/>h提醒到期</span>
        </li>
        <li>
         <span>吊装作业有效期
          <el-input v-model="form.hosiPeriodOf" style="width: 80px"/>
          天自动更新</span>
          <span style="margin-left: 100px;">提前<el-input v-model="form.hosiAdvanceOf" style="width: 80px"/>h提醒到期</span>
        </li>
      </ul>
    </el-form>
    <div class="dialog-footer">
      <el-button type="primary" @click="submitForm">保存</el-button>
    </div>
  </div>
</template>

<script setup name="Safesetting">
import { listPeriodconfig, getPeriodconfig, delPeriodconfig, addPeriodconfig, updatePeriodconfig } from "@/api/safework/periodconfig";
const { proxy } = getCurrentInstance();

const safesettingList = ref([]);
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

  },
  rules: {
  },
});

const { form, rules } = toRefs(data);

function getInfo(){
  listPeriodconfig().then(response => {
    if(response.rows.length>0){
      form.value = response.rows[0];
    }
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["safesettingRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updatePeriodconfig(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getInfo();
        });
      } else {
        addPeriodconfig(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getInfo();
        });
      }
    }
  });
}

getInfo();
form.value.isQy = '0';
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
