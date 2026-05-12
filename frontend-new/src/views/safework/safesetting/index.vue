<template>
  <div class="app-container">
    <el-form ref="safesettingRef" :model="form" :rules="rules" label-width="80px">
      <ul class="dengjiedit">
        <li>
          1) 区域内有一级动火作业,风险等级
          <el-select v-model="form.oneType" placeholder="请选择">
            <el-option label="调高" value="1"/>
            <el-option label="调低" value="-1"/>
          </el-select>
          <el-select v-model="form.oneLevelFire" placeholder="请选择">
            <el-option label="0" value="0"/>
            <el-option label="1" value="1"/>
            <el-option label="2" value="2"/>
            <el-option label="3" value="3"/>
          </el-select>
          个等级
        </li>
        <li>
          2) 区域内有二级动火作业,风险等级
          <el-select v-model="form.twoType" placeholder="请选择">
            <el-option label="调高" value="1"/>
            <el-option label="调低" value="-1"/>
          </el-select>
          <el-select v-model="form.twoLevelFire" placeholder="请选择">
            <el-option label="0" value="0"/>
            <el-option label="1" value="1"/>
            <el-option label="2" value="2"/>
            <el-option label="3" value="3"/>
          </el-select>
          个等级
        </li>
        <li>
          3) 区域内有特级动火作业,风险等级
          <el-select v-model="form.threeType" placeholder="请选择">
            <el-option label="调高" value="1"/>
            <el-option label="调低" value="-1"/>
          </el-select>
          <el-select v-model="form.threeLevelFire" placeholder="请选择">
            <el-option label="0" value="0"/>
            <el-option label="1" value="1"/>
            <el-option label="2" value="2"/>
            <el-option label="3" value="3"/>
          </el-select>
          个等级
        </li>
        <li>
          4) 区域内有受限空间作业,风险等级
          <el-select v-model="form.fourType" placeholder="请选择">
            <el-option label="调高" value="1"/>
            <el-option label="调低" value="-1"/>
          </el-select>
          <el-select v-model="form.restrictedWork" placeholder="请选择">
            <el-option label="0" value="0"/>
            <el-option label="1" value="1"/>
            <el-option label="2" value="2"/>
            <el-option label="3" value="3"/>
          </el-select>
          个等级
        </li>
        <li>
          5) 区域内有盲板堵抽作业,风险等级
          <el-select v-model="form.fiveType" placeholder="请选择">
            <el-option label="调高" value="1"/>
            <el-option label="调低" value="-1"/>
          </el-select>
          <el-select v-model="form.blindWork" placeholder="请选择">
            <el-option label="0" value="0"/>
            <el-option label="1" value="1"/>
            <el-option label="2" value="2"/>
            <el-option label="3" value="3"/>
          </el-select>
          个等级
        </li>
        <li>
          6) 区域内有高处作业,风险等级
          <el-select v-model="form.sixType" placeholder="请选择">
            <el-option label="调高" value="1"/>
            <el-option label="调低" value="-1"/>
          </el-select>
          <el-select v-model="form.heightWork" placeholder="请选择">
            <el-option label="0" value="0"/>
            <el-option label="1" value="1"/>
            <el-option label="2" value="2"/>
            <el-option label="3" value="3"/>
          </el-select>
          个等级
        </li>
        <li>
          7) 区域内有吊装作业,风险等级
          <el-select v-model="form.sevenType" placeholder="请选择">
            <el-option label="调高" value="1"/>
            <el-option label="调低" value="-1"/>
          </el-select>
          <el-select v-model="form.hoistingWork" placeholder="请选择">
            <el-option label="0" value="0"/>
            <el-option label="1" value="1"/>
            <el-option label="2" value="2"/>
            <el-option label="3" value="3"/>
          </el-select>
          个等级
        </li>
        <li>
          8) 区域内有临时用电作业,风险等级
          <el-select v-model="form.eightType" placeholder="请选择">
            <el-option label="调高" value="1"/>
            <el-option label="调低" value="-1"/>
          </el-select>
          <el-select v-model="form.electricWork" placeholder="请选择">
            <el-option label="0" value="0"/>
            <el-option label="1" value="1"/>
            <el-option label="2" value="2"/>
            <el-option label="3" value="3"/>
          </el-select>
          个等级
        </li>
        <li>
          9) 区域内有动土作业,风险等级
          <el-select v-model="form.nineType" placeholder="请选择">
            <el-option label="调高" value="1"/>
            <el-option label="调低" value="-1"/>
          </el-select>
          <el-select v-model="form.earthWork" placeholder="请选择">
            <el-option label="0" value="0"/>
            <el-option label="1" value="1"/>
            <el-option label="2" value="2"/>
            <el-option label="3" value="3"/>
          </el-select>
          个等级
        </li>
        <li>
          10) 区域内有断路作业,风险等级
          <el-select v-model="form.tenType" placeholder="请选择">
            <el-option label="调高" value="1"/>
            <el-option label="调低" value="-1"/>
          </el-select>
          <el-select v-model="form.brokenWork" placeholder="请选择">
            <el-option label="0" value="0"/>
            <el-option label="1" value="1"/>
            <el-option label="2" value="2"/>
            <el-option label="3" value="3"/>
          </el-select>
          个等级
        </li>
      </ul>
    </el-form>
    <div class="dialog-footer">
      <el-button type="primary" @click="submitForm">保存</el-button>
    </div>
  </div>
</template>

<script setup name="Safesetting">
import { listSafesetting, getSafesetting, delSafesetting, addSafesetting, updateSafesetting } from "@/api/safework/safesetting";

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
    oneType:'1',
    oneLevelFire:'0',
    twoType:"1",
    twoLevelFire:"0",
    threeType:"1",
    threeLevelFire:"0",
    fourType:"1",
    restrictedWork:"0",
    fiveType:"1",
    blindWork:"0",
    sixType:"1",
    heightWork:"0",
    sevenType:"1",
    hoistingWork:"0",
    eightType:"1",
    electricWork:"0",
    earthWork:"0",
    nineType:"1",
    brokenWork:"0",
    tenType:"1"
  },
  rules: {
  },
});

const { form, rules } = toRefs(data);

function getInfo(){
  listSafesetting().then(response => {
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
        updateSafesetting(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getInfo();
        });
      } else {
        addSafesetting(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getInfo();
        });
      }
    }
  });
}

getInfo();
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
