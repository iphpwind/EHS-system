<template>
  <div>
    <van-nav-bar :title="signTitle" left-text="返回" left-arrow @click-left="$router.back()" />
    <div class="p-3">
      <div class="sign-tip">请在下方空白区域手写签字</div>
      <canvas ref="canvas" class="sign-canvas" @touchstart="start" @touchmove="move" @touchend="end"></canvas>
      <div class="btn-group">
        <van-button type="default" block @click="clear">清空</van-button>
        <van-button type="primary" block @click="save">确认签字</van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '../api/request'

const route = useRoute()
const router = useRouter()
const { bizType, bizId, signType } = route.params

const canvas = ref(null)
let ctx = null, drawing = false, lastX = 0, lastY = 0

const signTitle = computed(() => {
  const map = { risk_analysis:'风险分析签字', safety_disclosure:'安全交底签字', responsible:'负责人签字', guardian:'监护人签字', fire_worker:'动火人签字', acceptance:'验收人签字' }
  return map[signType] || '电子签字'
})

function initCanvas() {
  const c = canvas.value
  const dpr = window.devicePixelRatio || 1
  const rect = c.getBoundingClientRect()
  c.width = rect.width * dpr
  c.height = rect.height * dpr
  ctx = c.getContext('2d')
  ctx.scale(dpr, dpr)
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
}

function getPos(e) {
  const rect = canvas.value.getBoundingClientRect()
  const touch = e.touches[0]
  return { x: touch.clientX - rect.left, y: touch.clientY - rect.top }
}

function start(e) {
  e.preventDefault()
  drawing = true
  const p = getPos(e)
  lastX = p.x; lastY = p.y
}
function move(e) {
  e.preventDefault()
  if (!drawing) return
  const p = getPos(e)
  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(p.x, p.y)
  ctx.stroke()
  lastX = p.x; lastY = p.y
}
function end() { drawing = false }
function clear() {
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
}
function save() {
  const base64 = canvas.value.toDataURL('image/png')
  request.post('/signatures', {
    bizType, bizId: Number(bizId), signType,
    signImage: base64,
    signerName: ''
  }).then(() => {
    alert('签字成功')
    router.back()
  }).catch(err => alert(err.message))
}

onMounted(() => {
  initCanvas()
})
</script>

<style scoped>
.p-3 { padding: 12px; }
.sign-tip { font-size: 14px; color: #666; margin-bottom: 8px; text-align: center; }
.sign-canvas { width: 100%; height: 200px; border: 1px dashed #999; background: #fff; touch-action: none; }
.btn-group { margin-top: 16px; display: flex; gap: 10px; }
</style>
