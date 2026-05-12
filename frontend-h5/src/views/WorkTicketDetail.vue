<template>
  <div class="page">
    <van-nav-bar :title="typeName + '详情'" left-arrow @click-left="$router.back()" fixed />

    <div class="content">
      <!-- 作业票基本信息 -->
      <van-cell-group inset title="基本信息">
        <van-cell title="票证编号" :value="detail.ticket_no || '-'" />
        <van-cell title="项目名称" :value="detail.project_name || detail.projectName || '-'" />
        <van-cell title="工作内容" :value="detail.work_content || detail.workContent || '-'" />
        <van-cell title="工作地点" :value="detail.work_location || detail.workLocation || '-'" />
        <van-cell title="开始时间" :value="detail.start_time || detail.startTime || '-'" />
        <van-cell title="结束时间" :value="detail.end_time || detail.endTime || '-'" />
        <van-cell title="状态">
          <template #value>
            <van-tag :type="getStatusColor()">{{ getStatusText() }}</van-tag>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 审批人信息 -->
      <van-cell-group v-if="detail.approver_name" inset title="审批信息">
        <van-cell title="审批人" :value="detail.approver_name" />
        <van-cell v-if="detail.approval_comment" title="审批意见" :value="detail.approval_comment" />
      </van-cell-group>

      <!-- 安全措施（仅动火作业） -->
      <van-cell-group v-if="type === 'hot' && detail.fire_level" inset title="动火作业信息">
        <van-cell title="动火级别" :value="detail.fire_level" />
        <van-cell title="动火类型" :value="detail.fire_type || '-'" />
        <van-cell title="动火区域" :value="detail.fire_area || '-'" />
      </van-cell-group>

      <!-- 操作按钮 -->
      <div class="action-btns">
        <van-button v-if="canSubmit" type="primary" block round @click="doSubmit">提交审批</van-button>
        <van-button v-if="canApprove" type="warning" block round style="margin-top:10px" @click="showApprove = true">审批</van-button>
        <van-button v-if="canStart" type="success" block round style="margin-top:10px" @click="doStart">开始作业</van-button>
        <van-button v-if="canFinish" type="info" block round style="margin-top:10px" @click="doFinish">完成作业</van-button>
        <van-button v-if="canClose" type="danger" block round style="margin-top:10px" @click="doClose">关闭</van-button>
      </div>
    </div>

    <!-- 审批弹窗 -->
    <van-dialog v-model:show="showApprove" title="审批意见" show-cancel-button @confirm="doApprove">
      <van-field v-model="approveComment" label="意见" placeholder="请输入审批意见" />
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getTicketDetail, submitTicket, approveTicket, startWork, finishWork, closeWork, ticketTypeNames } from '../api/workticket'

const route = useRoute()
const router = useRouter()
const type = computed(() => route.query.type || 'hot')
const id = computed(() => route.params.id)
const typeName = computed(() => ticketTypeNames[type.value] || '作业票')

const detail = ref({})
const showApprove = ref(false)
const approveComment = ref('')

// 状态判断
const status = computed(() => detail.value.status || detail.value.main_status || '0')
const canSubmit = computed(() => status.value === '1' || status.value === 'draft')
const canApprove = computed(() => status.value === '2' || status.value === 'submitted')
const canStart = computed(() => status.value === '4' || status.value === 'approved')
const canFinish = computed(() => status.value === '5' || status.value === 'executing')
const canClose = computed(() => status.value === '6' || status.value === 'finished')

function getStatusText() {
  const s = status.value
  const map = { '1': '草稿', '2': '待审批', '3': '审批中', '4': '已批准', '5': '作业中', '6': '已完成', '7': '已关闭' }
  return map[String(s)] || s
}

function getStatusColor() {
  const s = status.value
  if (s === '1') return 'default'
  if (s === '4' || s === '6' || s === '7') return 'success'
  return 'warning'
}

function doSubmit() {
  submitTicket(type.value, id.value).then(() => {
    showToast('已提交审批')
    loadDetail()
  }).catch(err => showToast(err.message || '提交失败'))
}

function doApprove() {
  approveTicket(type.value, id.value, { action: 'approve', comment: approveComment.value }).then(() => {
    showToast('审批完成')
    showApprove.value = false
    loadDetail()
  }).catch(err => showToast(err.message || '审批失败'))
}

function doStart() {
  startWork(type.value, id.value).then(() => {
    showToast('已开始作业')
    loadDetail()
  }).catch(err => showToast(err.message || '操作失败'))
}

function doFinish() {
  finishWork(type.value, id.value).then(() => {
    showToast('作业已完成')
    loadDetail()
  }).catch(err => showToast(err.message || '操作失败'))
}

function doClose() {
  closeWork(type.value, id.value).then(() => {
    showToast('已关闭')
    router.back()
  }).catch(err => showToast(err.message || '操作失败'))
}

function loadDetail() {
  getTicketDetail(type.value, id.value).then(res => {
    detail.value = res.data || res || {}
  }).catch(() => {})
}

onMounted(() => {
  if (!localStorage.getItem('token')) {
    router.push('/login')
  } else {
    loadDetail()
  }
})
</script>

<style scoped>
.content { padding: 56px 0 20px; }
.action-btns { padding: 20px 16px; }
</style>
