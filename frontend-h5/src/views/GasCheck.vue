<template>
  <div>
    <van-nav-bar title="气体检测" left-text="返回" left-arrow @click-left="$router.back()" />
    <div class="p-3">
      <van-form @submit="onSubmit">
        <van-field v-model="form.checkType" label="检测时机" readonly @click="showType=true" :rules="[{required:true}]" />
        <van-field v-model="form.oxygenPercent" label="氧气%" type="number" :rules="[{required:true}]" />
        <van-field v-model="form.flammablePercent" label="可燃%LEL" type="number" />
        <van-field v-model="form.toxicPpm" label="有毒ppm" type="number" />
        <van-field v-model="form.toxicType" label="有毒种类" placeholder="如：硫化氢" />
        <van-field v-model="form.checkLocation" label="检测地点" :rules="[{required:true}]" />
        <van-field v-model="form.checkResult" label="结果" readonly @click="showResult=true" />
        <van-field v-model="form.remark" label="备注" type="textarea" rows="2" />

        <div class="van-cell">
          <span class="van-field__label">检测仪照片</span>
          <van-uploader v-model="devicePhotos" :max-count="2" />
        </div>
        <div class="van-cell">
          <span class="van-field__label">现场照片</span>
          <van-uploader v-model="scenePhotos" :max-count="2" />
        </div>

        <div class="mt-4">
          <van-button block type="primary" native-type="submit">提交检测</van-button>
        </div>
      </van-form>
    </div>

    <van-popup v-model:show="showType" position="bottom">
      <van-picker :columns="typeColumns" @confirm="onTypeConfirm" @cancel="showType=false" />
    </van-popup>
    <van-popup v-model:show="showResult" position="bottom">
      <van-picker :columns="resultColumns" @confirm="onResultConfirm" @cancel="showResult=false" />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '../api/request'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const showType = ref(false)
const showResult = ref(false)
const devicePhotos = ref([])
const scenePhotos = ref([])

const typeColumns = [
  { text: '作业前', value: 'before' },
  { text: '作业中', value: 'during' },
  { text: '作业后', value: 'after' }
]
const resultColumns = [
  { text: '合格', value: 1 },
  { text: '不合格', value: 0 }
]

const form = reactive({
  checkType: 'before',
  oxygenPercent: 20.9,
  flammablePercent: 0,
  toxicPpm: 0,
  toxicType: '',
  checkLocation: '',
  checkResult: 1,
  remark: ''
})

function onTypeConfirm({ selectedOptions }) {
  form.checkType = selectedOptions[0].value
  showType.value = false
}
function onResultConfirm({ selectedOptions }) {
  form.checkResult = selectedOptions[0].value
  showResult.value = false
}
function onSubmit() {
  request.post('/hot-work/' + id + '/gas', {
    checkType: form.checkType,
    oxygenPercent: form.oxygenPercent,
    flammablePercent: form.flammablePercent,
    toxicPpm: form.toxicPpm,
    toxicType: form.toxicType,
    checkLocation: form.checkLocation,
    checkResult: form.checkResult,
    remark: form.remark,
    devicePhoto: devicePhotos.value.map(p => p.url || p.content).join(','),
    scenePhoto: scenePhotos.value.map(p => p.url || p.content).join(',')
  }).then(() => {
    alert('检测记录已保存')
    router.back()
  }).catch(err => alert(err.message))
}
</script>

<style scoped>
.p-3 { padding: 12px; }
.mt-4 { margin-top: 16px; }
</style>
