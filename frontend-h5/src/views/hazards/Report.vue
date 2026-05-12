<template>
  <div class="page">
    <van-nav-bar title="隐患上报" left-arrow @click-left="$router.back()" fixed />
    <div class="content">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field v-model="form.hazard_description" name="hazard_description" label="隐患描述" type="textarea" rows="3" placeholder="请详细描述发现的隐患" :rules="[{ required: true, message: '请填写隐患描述' }]" />

          <van-field name="hazard_level" label="风险等级">
            <template #input>
              <van-radio-group v-model="form.hazard_level" direction="horizontal">
                <van-radio name="major" icon-size="16px">重大</van-radio>
                <van-radio name="general" icon-size="16px">一般</van-radio>
                <van-radio name="low" icon-size="16px">低</van-radio>
              </van-radio-group>
            </template>
          </van-field>

          <van-field v-model="form.location" name="location" label="隐患位置" placeholder="请输入具体位置" />

          <van-field v-model="form.department" name="department" label="所属部门" placeholder="请输入部门名称" />

          <van-field v-model="form.rectification_responsible" name="rectification_responsible" label="整改责任人" placeholder="请输入责任人" />

          <van-field v-model="form.rectification_deadline" name="rectification_deadline" label="整改期限" placeholder="选择日期" readonly is-link @click="showDatePicker = true" />
        </van-cell-group>

        <div style="margin: 20px 16px;">
          <van-button round block type="primary" native-type="submit" :loading="loading">提交上报</van-button>
        </div>
      </van-form>
    </div>

    <van-calendar v-model:show="showDatePicker" @confirm="onDateConfirm" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { createHazard } from '../../api/hazards'

const router = useRouter()
const loading = ref(false)
const showDatePicker = ref(false)

const form = ref({
  hazard_description: '',
  hazard_level: 'general',
  location: '',
  department: '',
  rectification_responsible: '',
  rectification_deadline: ''
})

function onDateConfirm(date) {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  form.value.rectification_deadline = y + '-' + m + '-' + day
  showDatePicker.value = false
}

function onSubmit() {
  loading.value = true
  createHazard({
    hazard_description: form.value.hazard_description,
    hazard_level: form.value.hazard_level,
    location: form.value.location,
    department: form.value.department,
    rectification_responsible: form.value.rectification_responsible,
    rectification_deadline: form.value.rectification_deadline
  }).then(() => {
    showToast('隐患上报成功')
    router.back()
  }).catch(err => {
    showToast(err.message || '上报失败')
  }).finally(() => {
    loading.value = false
  })
}
</script>

<style scoped>
.content { padding: 56px 0 20px; }
</style>
