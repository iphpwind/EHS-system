<template>
  <div>
    <van-nav-bar :title="detail.ticket_no || '作业详情'" left-text="返回" left-arrow @click-left="$router.back()" />
    <div class="p-3">
      <van-cell-group>
        <van-cell title="状态" :value="detail.statusText" />
        <van-cell title="申请人" :value="detail.applicant_name" />
        <van-cell title="部门" :value="detail.dept_name" />
        <van-cell title="动火等级" :value="detail.fireLevelText" />
        <van-cell title="动火区域" :value="detail.fireArea" />
        <van-cell title="作业地点" :value="detail.work_location" />
        <van-cell title="作业内容" :label="detail.work_content" />
        <van-cell title="风险分析" :label="detail.riskAnalysis" />
      </van-cell-group>

      <div class="mt-4">
        <van-button block type="primary" v-if="canSubmit" @click="doSubmit">提交审批</van-button>
        <van-button block type="success" v-if="canDeptApprove" @click="doApprove('dept')">部门审批通过</van-button>
        <van-button block type="success" v-if="canSafetyApprove" @click="doApprove('safety')">安全审批通过</van-button>
        <van-button block type="success" v-if="canFinalApprove" @click="doApprove('final')">最终批准</van-button>
        <van-button block type="warning" v-if="canStart" @click="doStart">开始作业</van-button>
        <van-button block type="warning" v-if="canFinish" @click="doFinish">完成作业</van-button>
        <van-button block type="danger" v-if="canClose" @click="doClose">验收关闭</van-button>
        <van-button block v-if="canReject" @click="doApprove('reject')">驳回</van-button>
      </div>

      <van-divider>气体检测</van-divider>
      <van-cell-group>
        <van-cell v-for="g in gasList" :key="g.id"
          :title="`${g.check_type==='before'?'作业前':g.check_type==='during'?'作业中':'作业后'} | ${g.oxygen_percent}%O2 ${g.flammable_percent}%LEL`"
          :label="`检测人：${g.checker_name} | 结果：${g.check_result===1?'合格':'不合格'}`"
          :value="parseTime(g.check_time)"
        />
      </van-cell-group>
      <van-button block type="primary" size="small" class="mt-2" v-if="detail.status==='5' || detail.status==='6'" @click="$router.push('/gas/' + id)">新增气体检测</van-button>

      <van-divider>签字确认</van-divider>
      <div class="sign-list">
        <div v-for="s in signList" :key="s.id" class="sign-item">
          <img v-if="s.sign_image" :src="baseUrl + s.sign_image" />
          <div v-else class="no-sign">未签</div>
          <div class="sign-name">{{ signLabel(s.sign_type) }}</div>
        </div>
      </div>
      <van-button block type="primary" size="small" class="mt-2" @click="goSign('responsible')">负责人签字</van-button>
      <van-button block type="primary" size="small" class="mt-2" @click="goSign('guardian')">监护人签字</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '../api/request'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const baseUrl = ''

const detail = ref({})
const gasList = ref([])
const signList = ref([])

const canSubmit = computed(() => detail.value.status === '1' || detail.value.status === 'draft')
const canDeptApprove = computed(() => detail.value.status === '2')
const canSafetyApprove = computed(() => detail.value.status === '3')
const canFinalApprove = computed(() => detail.value.status === '4')
const canStart = computed(() => detail.value.status === '5')
const canFinish = computed(() => detail.value.status === '6')
const canClose = computed(() => detail.value.status === '7')
const canReject = computed(() => ['2','3','4','5'].includes(String(detail.value.status)))

function load() {
  request.get('/hot-work/' + id).then(res => {
    const d = res.data || {}
    detail.value = d
    gasList.value = d.gasChecks || []
    signList.value = d.signatures || []
  })
}

function doSubmit() {
  request.post('/hot-work/' + id + '/submit').then(() => { alert('提交成功'); load() })
}
function doApprove(action) {
  request.post('/hot-work/' + id + '/approve', { action, comment: '' }).then(() => { alert('操作成功'); load() })
}
function doStart() {
  request.post('/hot-work/' + id + '/start').then(() => { alert('作业开始'); load() })
}
function doFinish() {
  request.post('/hot-work/' + id + '/finish').then(() => { alert('作业完成'); load() })
}
function doClose() {
  request.post('/hot-work/' + id + '/close').then(() => { alert('已关闭'); load() })
}
function goSign(type) {
  router.push(`/sign/hot_work/${id}/${type}`)
}
function signLabel(t) {
  const map = { risk_analysis:'风险分析', safety_disclosure:'安全交底', responsible:'负责人', guardian:'监护人', fire_worker:'动火人', acceptance:'验收人' }
  return map[t] || t
}
function parseTime(t) {
  return t ? new Date(t).toLocaleString() : ''
}
onMounted(load)
</script>

<style scoped>
.p-3 { padding: 12px; }
.mt-2 { margin-top: 8px; }
.mt-4 { margin-top: 16px; }
.sign-list { display:flex; flex-wrap:wrap; gap:10px; }
.sign-item { width:80px; text-align:center; }
.sign-item img { width:80px; height:40px; border:1px solid #ccc; border-radius:4px; }
.no-sign { width:80px; height:40px; line-height:40px; border:1px dashed #ccc; color:#999; font-size:12px; border-radius:4px; }
.sign-name { font-size:12px; color:#666; margin-top:4px; }
</style>
