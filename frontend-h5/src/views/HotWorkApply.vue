<template>
  <div>
    <van-nav-bar title="动火作业申请" left-text="返回" left-arrow @click-left="$router.back()" />
    <div class="p-3">
      <van-form @submit="onSubmit">
        <van-field v-model="form.projectName" label="项目名称" placeholder="请输入" :rules="[{required:true}]" />
        <van-field v-model="form.fireLevel" label="动火等级" readonly placeholder="请选择" @click="showLevel=true" :rules="[{required:true}]" />
        <van-field v-model="form.fireArea" label="动火区域" placeholder="如：A车间反应区" :rules="[{required:true}]" />
        <van-field v-model="form.fireType" label="动火方式" placeholder="如：气焊、电焊" />
        <van-field v-model="form.workLocation" label="作业地点" placeholder="详细地点" :rules="[{required:true}]" />
        <van-field v-model="form.workContent" label="作业内容" type="textarea" rows="3" placeholder="详细描述作业内容" :rules="[{required:true}]" />
        <van-field v-model="form.riskAnalysis" label="风险分析" type="textarea" rows="3" placeholder="识别并分析风险" />

        <div class="van-cell">
          <span class="van-field__label">现场照片</span>
          <van-uploader v-model="photos" :max-count="3" />
        </div>

        <div class="mt-4">
          <van-button block type="primary" native-type="submit">提交申请</van-button>
        </div>
      </van-form>
    </div>

    <van-popup v-model:show="showLevel" position="bottom">
      <van-picker :columns="levelColumns" @confirm="onLevelConfirm" @cancel="showLevel=false" />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import request from '../api/request'

const router = useRouter()
const showLevel = ref(false)
const photos = ref([])
const levelColumns = [
  { text: '特级动火', value: 1 },
  { text: '一级动火', value: 2 },
  { text: '二级动火', value: 3 }
]

const form = reactive({
  projectName: '',
  fireLevel: '',
  fireLevelValue: null,
  fireArea: '',
  fireType: '',
  workLocation: '',
  workContent: '',
  riskAnalysis: '',
  startTime: new Date().toISOString().slice(0,19).replace('T',' '),
  endTime: ''
})

function onLevelConfirm({ selectedOptions }) {
  form.fireLevel = selectedOptions[0].text
  form.fireLevelValue = selectedOptions[0].value
  showLevel.value = false
}

function onSubmit() {
  request.post('/hot-work', {
    projectName: form.projectName,
    fireLevel: form.fireLevelValue,
    fireArea: form.fireArea,
    fireType: form.fireType,
    workLocation: form.workLocation,
    workContent: form.workContent,
    riskAnalysis: form.riskAnalysis,
    startTime: form.startTime,
    endTime: form.endTime,
    safetyMeasures: JSON.stringify({ photos: photos.value.map(p => p.url || p.content) })
  }).then(res => {
    alert('申请成功，票号：' + res.data.ticketNo)
    router.push('/')
  }).catch(err => alert(err.message))
}
</script>

<style scoped>
.p-3 { padding: 12px; }
.mt-4 { margin-top: 16px; }
</style>
