<template>
  <div class="page">
    <van-nav-bar title="申请作业票" left-arrow @click-left="$router.back()" fixed />

    <div class="content">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <!-- 作业类型选择 -->
          <van-field name="ticketType" label="作业类型">
            <template #input>
              <van-picker-group title="选择作业类型">
                <van-picker :columns="typeColumns" @confirm="onTypeConfirm" />
              </van-picker-group>
            </template>
          </van-field>
          <van-cell title="当前选择" :value="typeNames[form.ticketType] || '请选择'" is-link @click="showTypePicker = true" />

          <van-field v-model="form.projectName" name="projectName" label="项目名称" placeholder="请输入项目名称" :rules="[{ required: true, message: '请填写项目名称' }]" />

          <van-field v-model="form.workContent" name="workContent" label="工作内容" type="textarea" rows="3" placeholder="请描述工作内容" :rules="[{ required: true, message: '请填写工作内容' }]" />

          <van-field v-model="form.workLocation" name="workLocation" label="工作地点" placeholder="请输入工作地点" :rules="[{ required: true, message: '请填写工作地点' }]" />

          <!-- 动火作业额外字段 -->
          <template v-if="form.ticketType === 'hot'">
            <van-field name="fireLevel" label="动火级别">
              <template #input>
                <van-radio-group v-model="form.fireLevel" direction="horizontal">
                  <van-radio name="一级">一级</van-radio>
                  <van-radio name="二级">二级</van-radio>
                  <van-radio name="特级">特级</van-radio>
                </van-radio-group>
              </template>
            </van-field>
            <van-field v-model="form.fireType" name="fireType" label="动火类型" placeholder="请输入" />
            <van-field v-model="form.fireArea" name="fireArea" label="动火区域" placeholder="请输入" />
          </template>

          <!-- 高处作业额外字段 -->
          <template v-if="form.ticketType === 'high'">
            <van-field v-model="form.workHeight" name="workHeight" label="作业高度(m)" placeholder="请输入" type="number" />
          </template>

          <van-field v-model="form.startTime" name="startTime" label="开始时间" placeholder="选择日期" readonly is-link @click="showStartDate = true" />

          <van-field v-model="form.endTime" name="endTime" label="结束时间" placeholder="选择日期" readonly is-link @click="showEndDate = true" />
        </van-cell-group>

        <div style="margin: 20px 16px;">
          <van-button round block type="primary" native-type="submit" :loading="loading">提交申请</van-button>
        </div>
      </van-form>
    </div>

    <!-- 类型选择 -->
    <van-popup v-model:show="showTypePicker" position="bottom" round>
      <van-picker :columns="typeColumns" @confirm="onTypeConfirm" @cancel="showTypePicker = false" />
    </van-popup>

    <van-calendar v-model:show="showStartDate" @confirm="onStartDate" />
    <van-calendar v-model:show="showEndDate" @confirm="onEndDate" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { createTicket, ticketTypeNames } from '../api/workticket'

const router = useRouter()
const loading = ref(false)
const showTypePicker = ref(false)
const showStartDate = ref(false)
const showEndDate = ref(false)

const typeNames = ticketTypeNames
const typeColumns = [
  { text: '动火作业', value: 'hot' },
  { text: '受限空间', value: 'confined' },
  { text: '高处作业', value: 'high' },
  { text: '吊装作业', value: 'hoisting' },
  { text: '动土作业', value: 'earth' },
  { text: '断路作业', value: 'road' },
  { text: '盲板抽堵', value: 'blind' }
]

const form = ref({
  ticketType: 'hot',
  projectName: '',
  workContent: '',
  workLocation: '',
  fireLevel: '二级',
  fireType: '',
  fireArea: '',
  workHeight: '',
  startTime: '',
  endTime: ''
})

function onTypeConfirm({ value }) {
  form.value.ticketType = value
  showTypePicker.value = false
}

function formatDate(date) {
  const d = new Date(date)
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + ' ' +
    String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
}

function onStartDate(date) {
  form.value.startTime = formatDate(date)
  showStartDate.value = false
}

function onEndDate(date) {
  form.value.endTime = formatDate(date)
  showEndDate.value = false
}

function onSubmit() {
  loading.value = true
  const data = {
    project_name: form.value.projectName,
    work_content: form.value.workContent,
    work_location: form.value.workLocation,
    start_time: form.value.startTime,
    end_time: form.value.endTime
  }

  if (form.value.ticketType === 'hot') {
    data.fire_level = form.value.fireLevel
    data.fire_type = form.value.fireType
    data.fire_area = form.value.fireArea
  }
  if (form.value.ticketType === 'high') {
    data.work_height = form.value.workHeight
  }

  createTicket(form.value.ticketType, data).then(() => {
    showToast('申请已提交')
    router.back()
  }).catch(err => {
    showToast(err.message || '提交失败')
  }).finally(() => {
    loading.value = false
  })
}
</script>

<style scoped>
.content { padding: 56px 0 20px; }
</style>
