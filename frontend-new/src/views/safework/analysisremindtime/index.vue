<template>
  <div class="app-container">
    <el-form ref="safesettingRef" :model="form" :rules="rules" label-width="80px">

      <ul class="dengjiedit">
        
        <li>
          <span>动火作业需间隔多长时间提醒分析化验

          <el-input v-model="form.fireWorkAnalysisRemindTime" style="width: 80px"/>
          分钟</span>
          <span style="margin-left: 100px;">提前<el-input v-model="form.beforeFireWorkAnalysisRemindTime" style="width: 80px"/>分钟提醒</span>
        </li>
        <li>
          <span>受限空间需间隔多长时间提醒分析化验
          <el-input v-model="form.restrictedWorkAnalysisRemindTime" style="width: 80px"/>
          分钟</span>
          <span style="margin-left: 100px;">提前<el-input v-model="form.beforeRestrictedWorkAnalysisRemindTime" style="width: 80px"/>分钟提醒</span>
        </li>
        <li>
          <span>临时用电需间隔多长时间提醒分析化验
          <el-input v-model="form.electricWorkAnalysisRemindTime" style="width: 80px"/>
          分钟</span>
          <span style="margin-left: 100px;">提前<el-input v-model="form.beforeElectricWorkAnalysisRemindTime" style="width: 80px"/>分钟提醒</span>
        </li>
       
      </ul>
    </el-form>
    <div class="dialog-footer">
      <span>备注：分析化验间隔时间需大于等于0，提前提醒时间需小于间隔时间，为0时则默认不发送提前提醒时间</span>
   
    </div>
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
  padding:30px;
  list-style: none;
 
  li{
    margin: 0 0 10px;
    font-size: 14px;
  }
  :deep(.el-select) {
    display: inline-block;width: 100px;
    margin: 0 5px;
  }
}
.dialog-footer {
  padding:5px 30px;
  list-style: none;
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
