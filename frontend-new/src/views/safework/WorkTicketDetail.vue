<template>
  <div class="app-container">
    <el-page-header @back="goBack" :title="title">
      <template #content>
        <span class="text-lg font-bold">{{ ticketTypeText }}作业票详情</span>
      </template>
      <template #extra>
        <el-button type="primary" size="small" icon="Download" @click="handleExportPDF">导出PDF</el-button>
      </template>
    </el-page-header>

    <!-- 基本信息 -->
    <el-card class="mt-4" shadow="never">
      <template #header>
        <div class="card-header">
          <span>基本信息</span>
          <el-tag :type="statusTagType(detail.status || detail.main_status)">{{ detail.statusText || statusText(detail.status || detail.main_status) }}</el-tag>
        </div>
      </template>
      <el-descriptions :column="3" border>
        <el-descriptions-item label="票号">{{ detail.ticket_no || detail.ticketNo }}</el-descriptions-item>
        <el-descriptions-item label="申请人">{{ detail.applicant_name || detail.createUserName }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ detail.dept_name || detail.deptName }}</el-descriptions-item>
        <el-descriptions-item v-if="ticketType === 'firework'" label="动火等级">
          <el-tag :type="levelTag(detail.fire_level || detail.fireLevel)">{{ detail.fireLevelText }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item v-if="ticketType === 'firework'" label="动火区域">{{ detail.fire_area || detail.fireArea }}</el-descriptions-item>
        <el-descriptions-item v-if="ticketType === 'firework'" label="动火方式">{{ detail.fire_type || detail.fireType }}</el-descriptions-item>
        <el-descriptions-item v-if="ticketType === 'restricted'" label="原有介质">{{ detail.medium_name || detail.mediumName }}</el-descriptions-item>
        <el-descriptions-item v-if="ticketType === 'highwork'" label="高处等级">{{ detail.highLevelText }}</el-descriptions-item>
        <el-descriptions-item label="作业地点" :span="ticketType === 'firework' ? 2 : undefined">
          {{ detail.work_location || detail.operationSite || detail.workLocation }}
        </el-descriptions-item>
        <el-descriptions-item label="计划时间" :span="2">
          {{ parseTime(detail.start_time || detail.startTime) }} ~ {{ parseTime(detail.end_time || detail.endTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="作业内容" :span="3">
          {{ detail.work_content || detail.operationContent || detail.workContent }}
        </el-descriptions-item>
        <el-descriptions-item v-if="detail.remark" label="备注" :span="3">{{ detail.remark }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 风险辨识与管控措施 -->
    <el-card v-if="riskMeasures && riskMeasures.length > 0" class="mt-4" shadow="never">
      <template #header><span>风险辨识与管控措施 (GB 30871-2022)</span></template>
      <RiskMeasureTable
        :model-value="riskMeasures"
        :readonly="true"
      />
    </el-card>

    <!-- 流程状态 -->
    <el-card class="mt-4" shadow="never">
      <template #header><span>流程状态</span></template>
      <el-steps :active="activeStep" finish-status="success" simple style="max-width:100%">
        <el-step title="草稿" />
        <el-step title="已提交" />
        <el-step title="部门审批" />
        <el-step title="安全审批" />
        <el-step title="已批准" />
        <el-step title="作业中" />
        <el-step title="待验收" />
        <el-step title="已关闭" />
      </el-steps>

      <div class="mt-4 flex gap-2 flex-wrap">
        <el-button type="primary" v-if="canSubmit" @click="doAction('submit')">提交审批</el-button>
        <el-button type="success" v-if="canDeptApprove" @click="doApprove('dept')">部门审批通过</el-button>
        <el-button type="success" v-if="canSafetyApprove" @click="doApprove('safety')">安全审批通过</el-button>
        <el-button type="success" v-if="canFinalApprove" @click="doApprove('final')">最终批准</el-button>
        <el-button type="warning" v-if="canStart" @click="doAction('start')">开始作业</el-button>
        <el-button type="warning" v-if="canFinish" @click="doAction('finish')">完成作业</el-button>
        <el-button type="danger" v-if="canClose" @click="doAction('close')">验收关闭</el-button>
        <el-button v-if="canReject" @click="doApprove('reject')">驳回</el-button>
      </div>
    </el-card>

    <!-- 气体检测记录 -->
    <el-card class="mt-4" shadow="never">
      <template #header>
        <div class="card-header">
          <span>气体检测记录</span>
          <el-button type="primary" size="small" @click="gasOpen = true"
            v-if="detail.status === '5' || detail.status === '6' || detail.status === 'approved' || detail.status === 'executing' || detail.main_status === '5' || detail.main_status === '6'">
            新增检测
          </el-button>
        </div>
      </template>
      <el-table :data="gasList" size="small" :empty-text="'暂无气体检测记录'">
        <el-table-column prop="check_type" label="检测时机" width="100">
          <template #default="{ row }">{{ checkTypeText(row.check_type) }}</template>
        </el-table-column>
        <el-table-column prop="check_time" label="检测时间" width="160">
          <template #default="{ row }">{{ parseTime(row.check_time) }}</template>
        </el-table-column>
        <el-table-column prop="oxygen_percent" label="氧气%" width="100" align="center" />
        <el-table-column prop="flammable_percent" label="可燃%LEL" width="120" align="center" />
        <el-table-column prop="toxic_ppm" label="有毒ppm" width="120" align="center">
          <template #default="{ row }">
            {{ row.toxic_ppm }} <span v-if="row.toxic_type" class="text-gray-400">({{ row.toxic_type }})</span>
          </template>
        </el-table-column>
        <el-table-column prop="check_location" label="检测地点" show-overflow-tooltip />
        <el-table-column prop="check_result" label="结果" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.check_result === 1 ? 'success' : 'danger'" size="small">
              {{ row.check_result === 1 ? '合格' : '不合格' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="checker_name" label="检测人" width="100" />
        <el-table-column prop="remark" label="备注" show-overflow-tooltip width="120" />
      </el-table>
    </el-card>

    <!-- 监控视频上传（特级作业，GB 30871-2022 合规） -->
    <el-card v-if="detail.risk_level === 'special'" class="mt-4" shadow="never">
      <template #header>
        <div class="card-header">
          <span>监控视频上传</span>
        </div>
      </template>
      <VideoUpload
        :ticket-id="ticketId"
        v-model="detail.video_url"
        @success="handleVideoSuccess"
      />
    </el-card>

    <!-- 签字记录 -->
    <el-card class="mt-4" shadow="never">
      <template #header>
        <div class="card-header">
          <span>签字记录</span>
          <el-button type="primary" size="small" @click="openSignCanvas">电子签字</el-button>
        </div>
      </template>
      <div v-if="signList.length > 0" class="flex flex-wrap gap-4">
        <div v-for="s in signList" :key="s.id || s.sign_type" class="sign-box">
          <div class="sign-label">{{ signTypeLabel(s.sign_type) }}</div>
          <img v-if="s.sign_image" :src="getSignUrl(s.sign_image)" class="sign-img" />
          <div v-else class="sign-placeholder">未签字</div>
          <div class="sign-user">{{ s.signer_name || '' }} {{ parseTime(s.sign_time) }}</div>
        </div>
      </div>
      <el-empty v-else description="暂无签字记录" :image-size="60" />
    </el-card>

    <!-- 审批记录 -->
    <el-card class="mt-4" shadow="never">
      <template #header><span>审批记录</span></template>
      <el-table :data="approvalList" size="small" :empty-text="'暂无审批记录'">
        <el-table-column prop="node_name" label="审批节点" width="120" />
        <el-table-column prop="approver_name" label="审批人" width="100" />
        <el-table-column prop="approval_result" label="审批结果" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.approval_result === 'approve' ? 'success' : 'danger'" size="small">
              {{ row.approval_result === 'approve' ? '通过' : '驳回' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="approval_opinion" label="审批意见" show-overflow-tooltip />
        <el-table-column prop="approval_time" label="审批时间" width="160">
          <template #default="{ row }">{{ parseTime(row.approval_time) }}</template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 气体检测弹窗 -->
    <el-dialog title="气体检测记录" v-model="gasOpen" width="500px" append-to-body>
      <el-form :model="gasForm" label-width="110px">
        <el-form-item label="检测时机">
          <el-radio-group v-model="gasForm.checkType">
            <el-radio label="before">作业前</el-radio>
            <el-radio label="during">作业中</el-radio>
            <el-radio label="after">作业后</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="氧气浓度 (%)">
          <el-input-number v-model="gasForm.oxygenPercent" :precision="2" :min="0" :max="100" style="width:100%" />
        </el-form-item>
        <el-form-item label="可燃气体 (%LEL)">
          <el-input-number v-model="gasForm.flammablePercent" :precision="4" :min="0" style="width:100%" />
        </el-form-item>
        <el-form-item label="有毒气体 (ppm)">
          <el-input-number v-model="gasForm.toxicPpm" :precision="2" :min="0" style="width:100%" />
        </el-form-item>
        <el-form-item label="有毒气体种类">
          <el-input v-model="gasForm.toxicType" placeholder="如：硫化氢(H2S)、一氧化碳(CO)" />
        </el-form-item>
        <el-form-item label="检测地点">
          <el-input v-model="gasForm.checkLocation" placeholder="请填写具体检测位置" />
        </el-form-item>
        <el-form-item label="检测结果">
          <el-radio-group v-model="gasForm.checkResult">
            <el-radio :label="1">合格</el-radio>
            <el-radio :label="0">不合格</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="gasForm.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitGas">确 定</el-button>
        <el-button @click="gasOpen = false">取 消</el-button>
      </template>
    </el-dialog>

    <!-- 审批弹窗 -->
    <el-dialog title="审批操作" v-model="approveOpen" width="500px" append-to-body>
      <el-form :model="approveForm" label-width="80px">
        <el-form-item label="审批结果">
          <el-radio-group v-model="approveForm.action">
            <el-radio-button value="dept">部门审批通过</el-radio-button>
            <el-radio-button value="safety">安全审批通过</el-radio-button>
            <el-radio-button value="final">最终批准</el-radio-button>
            <el-radio-button value="reject">驳回</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批意见">
          <el-input v-model="approveForm.comment" type="textarea" :rows="3" placeholder="请输入审批意见" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitApprove">确 定</el-button>
        <el-button @click="approveOpen = false">取 消</el-button>
      </template>
    </el-dialog>

    <!-- 电子签字弹窗 -->
    <el-dialog title="电子签字" v-model="signOpen" width="600px" append-to-body>
      <el-form :model="signForm" label-width="80px">
        <el-form-item label="签字类型">
          <el-select v-model="signForm.signType" style="width:100%">
            <el-option label="风险分析人" value="risk_analysis" />
            <el-option label="安全交底人" value="safety_disclosure" />
            <el-option label="作业负责人" value="responsible" />
            <el-option label="监护人" value="guardian" />
            <el-option label="作业人" value="worker" />
            <el-option label="验收人" value="acceptance" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="sign-canvas-wrap">
        <canvas ref="signCanvas" class="sign-canvas"
          @mousedown="startDraw" @mousemove="drawing" @mouseup="endDraw" @mouseleave="endDraw"
          @touchstart.prevent="startDrawTouch" @touchmove.prevent="drawingTouch" @touchend.prevent="endDraw">
        </canvas>
      </div>
      <div class="mt-2 flex gap-2">
        <el-button @click="clearSign">清空</el-button>
        <el-button type="primary" @click="submitSign">确认签字</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { parseTime } from '@/utils/ruoyi'
import { saveSignature } from '@/api/signature'
import RiskMeasureTable from './components/RiskMeasureTable.vue'
import VideoUpload from './VideoUpload.vue'

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()

const ticketId = route.query.id as string
const ticketType = computed(() => (route.query.ticketType as string) || 'firework')

const ticketTypeText = computed(() => {
  const map: Record<string, string> = {
    firework: '动火', restricted: '受限空间', highwork: '高处',
    hoistingwork: '吊装', earth: '动土', broken: '断路', blind: '盲板抽堵', electricwork: '临时用电'
  }
  return map[ticketType.value] || ticketType.value
})

const title = computed(() => `${ticketTypeText.value}作业票详情`)

// ============ 详情数据 ============
const detail = ref<any>({})
const gasList = ref<any[]>([])
const signList = ref<any[]>([])
const approvalList = ref<any[]>([])
const riskMeasures = ref<any[]>([])

// ============ 状态判断 ============
const statusMap: Record<string, number> = {
  '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
  'draft': 1, 'pending': 2, 'approved': 5, 'executing': 6, 'completed': 7, 'closed': 8
}

const activeStep = computed(() => {
  const s = detail.value.status || detail.value.main_status
  return statusMap[String(s)] || 0
})

const canSubmit = computed(() => [1, '1', 'draft'].includes(detail.value.status || detail.value.main_status))
const canDeptApprove = computed(() => [2, '2'].includes(detail.value.status || detail.value.main_status))
const canSafetyApprove = computed(() => [3, '3'].includes(detail.value.status || detail.value.main_status))
const canFinalApprove = computed(() => [4, '4'].includes(detail.value.status || detail.value.main_status))
const canStart = computed(() => [5, '5', 'approved'].includes(detail.value.status || detail.value.main_status))
const canFinish = computed(() => [6, '6', 'executing'].includes(detail.value.status || detail.value.main_status))
const canClose = computed(() => [7, '7', 'completed'].includes(detail.value.status || detail.value.main_status))
const canReject = computed(() => {
  const s = String(detail.value.status || detail.value.main_status || '')
  return ['2', '3', '4', '5'].includes(s)
})

// ============ 工具方法 ============
const statusTagType = (s: any) => {
  const map: Record<string, string> = { '1': 'info', '2': '', '3': 'primary', '4': 'primary', '5': 'success', '6': 'warning', '7': 'warning', '8': 'danger' }
  return map[String(s)] || ''
}

const statusText = (s: any) => {
  const map: Record<string, string> = { '1': '草稿', '2': '已提交', '3': '部门审批通过', '4': '安全审批通过', '5': '已批准', '6': '作业中', '7': '待验收', '8': '已关闭' }
  return map[String(s)] || String(s)
}

const levelTag = (level: number) => {
  const map: Record<number, string> = { 1: 'danger', 2: 'warning', 3: 'success' }
  return map[level] || 'info'
}

const checkTypeText = (type: string) => {
  const map: Record<string, string> = { before: '作业前', during: '作业中', after: '作业后' }
  return map[type] || type
}

const signTypeLabel = (t: string) => {
  const map: Record<string, string> = {
    risk_analysis: '风险分析人', safety_disclosure: '安全交底人', responsible: '作业负责人',
    guardian: '监护人', fire_worker: '作业人', worker: '作业人', acceptance: '验收人'
  }
  return map[t] || t
}

const getSignUrl = (url: string) => {
  if (url.startsWith('data:') || url.startsWith('http')) return url
  const baseUrl = (import.meta as any).env?.VITE_APP_BASE_API || ''
  return baseUrl + url
}

// ============ API ============
const loadApi = async () => {
  try {
    const type = ticketType.value
    if (type === 'firework') return await import('@/api/hotWork')
    if (type === 'restricted') return await import('@/api/safework/restrictedwork')
    if (type === 'highwork') return await import('@/api/safework/highwork')
    if (type === 'hoistingwork') return await import('@/api/safework/hoistingwork')
    if (type === 'earth') return await import('@/api/safework/earth')
    return await import('@/api/hotWork')
  } catch {
    return await import('@/api/hotWork')
  }
}

// ============ 数据加载 ============
const load = async () => {
  try {
    const api = await loadApi()
    const getMethod = api.getHotWork || api.getRestrictedwork || api.getHighwork || api.getEarthwork
    if (getMethod) {
      const res = await getMethod(ticketId)
      const d = res.data || {}
      detail.value = d
      gasList.value = d.gasChecks || []
      signList.value = d.signatures || []
      approvalList.value = d.approvals || []
      riskMeasures.value = d.risk_measures || d.riskMeasures || []
    }
  } catch (e) {
    console.error('加载详情失败', e)
  }
}

const goBack = () => { router.back() }

// ============ 流程操作 ============
const doAction = async (action: string) => {
  const titles: Record<string, string> = {
    submit: '确认提交审批？', start: '确认开始作业？', finish: '确认完成作业？', close: '确认验收关闭？'
  }
  try {
    await proxy.$modal.confirm(titles[action] || `确认执行${action}操作？`)
    const api = await loadApi()
    const methods: Record<string, string> = {
      submit: 'submitHotWork', start: 'startHotWork', finish: 'finishHotWork', close: 'closeHotWork'
    }
    const methodName = methods[action]
    if (methodName && (api as any)[methodName]) {
      await (api as any)[methodName](ticketId)
      proxy.$modal.msgSuccess('操作成功')
      load()
    }
  } catch { /* 取消 */ }
}

const doApprove = async (action: string) => {
  const title = action === 'reject' ? '确认驳回？' : '确认审批通过？'
  try {
    await proxy.$modal.confirm(title)
    const api = await loadApi()
    const approveMethod = (api as any).approveHotWork
    if (approveMethod) {
      await approveMethod(ticketId, { action, comment: '' })
      proxy.$modal.msgSuccess('操作成功')
      approveOpen.value = false
      load()
    }
  } catch { /* 取消 */ }
}

// ============ 气体检测 ============
const gasOpen = ref(false)
const gasForm = reactive({
  checkType: 'before', oxygenPercent: 20.9, flammablePercent: 0,
  toxicPpm: 0, toxicType: '', checkLocation: '', checkResult: 1, remark: ''
})

const submitGas = async () => {
  try {
    const api = await loadApi()
    const addGasMethod = (api as any).addGasCheck
    if (addGasMethod) {
      await addGasMethod(ticketId, gasForm)
      proxy.$modal.msgSuccess('检测记录保存成功')
      gasOpen.value = false
      load()
    }
  } catch (e) {
    console.error('保存气体检测失败', e)
  }
}

// ============ 审批弹窗 ============
const approveOpen = ref(false)
const approveForm = reactive({ action: 'dept', comment: '' })

const submitApprove = async () => {
  try {
    const api = await loadApi()
    const approveMethod = (api as any).approveHotWork
    if (approveMethod) {
      await approveMethod(ticketId, { action: approveForm.action, comment: approveForm.comment })
      proxy.$modal.msgSuccess('审批操作成功')
      approveOpen.value = false
      load()
    }
  } catch { /* ignore */ }
}

// =========== 视频上传成功 ===========
const handleVideoSuccess = (data: any) => {
  proxy?.$modal.msgSuccess('视频上传成功')
  load() // 重新加载详情，刷新video_url
}

// ============ 电子签字 ============
const signOpen = ref(false)
const signForm = reactive({ signType: 'responsible' })
const signCanvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let drawingFlag = false
let lastX = 0, lastY = 0

const openSignCanvas = () => {
  signOpen.value = true
  setTimeout(initCanvas, 200)
}

const initCanvas = () => {
  const c = signCanvas.value
  if (!c) return
  c.width = c.offsetWidth
  c.height = c.offsetHeight
  ctx = c.getContext('2d')
  if (ctx) {
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
  }
}

const getCanvasPos = (clientX: number, clientY: number) => {
  const rect = signCanvas.value!.getBoundingClientRect()
  return { x: clientX - rect.left, y: clientY - rect.top }
}

const startDraw = (e: MouseEvent) => { startDrawCore(e.clientX, e.clientY) }
const drawing = (e: MouseEvent) => { drawingCore(e.clientX, e.clientY) }

const startDrawTouch = (e: TouchEvent) => {
  const t = e.touches[0]
  startDrawCore(t.clientX, t.clientY)
}
const drawingTouch = (e: TouchEvent) => {
  const t = e.touches[0]
  drawingCore(t.clientX, t.clientY)
}

const startDrawCore = (x: number, y: number) => {
  drawingFlag = true
  const p = getCanvasPos(x, y)
  lastX = p.x; lastY = p.y
}

const drawingCore = (x: number, y: number) => {
  if (!drawingFlag || !ctx) return
  const p = getCanvasPos(x, y)
  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(p.x, p.y)
  ctx.stroke()
  lastX = p.x; lastY = p.y
}

const endDraw = () => { drawingFlag = false }
const clearSign = () => {
  if (ctx && signCanvas.value) { ctx.clearRect(0, 0, signCanvas.value.width, signCanvas.value.height) }
}

const submitSign = () => {
  if (!signCanvas.value) return
  const base64 = signCanvas.value.toDataURL('image/png')
  saveSignature({
    bizType: ticketType.value,
    bizId: ticketId,
    signType: signForm.signType,
    signImage: base64,
    signerName: ''
  }).then(() => {
    proxy.$modal.msgSuccess('签字保存成功')
    signOpen.value = false
    clearSign()
    load()
  }).catch((e: any) => {
    console.error('签字保存失败', e)
  })
}

// ============ PDF导出 ============
const handleExportPDF = async () => {
  try {
    const api = await loadApi()
    const exportMethod = (api as any).exportHotWorkPDF
    if (exportMethod) {
      const res = await exportMethod(ticketId)
      const blob = new Blob([res], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${ticketType.value}_${detail.value.ticket_no || ticketId}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    }
  } catch (e) {
    console.error('导出PDF失败', e)
  }
}

onMounted(() => {
  if (ticketId) load()
})
</script>

<style scoped>
.mt-4 { margin-top: 16px; }
.mt-2 { margin-top: 8px; }
.flex { display: flex; }
.gap-2 { gap: 8px; }
.gap-4 { gap: 16px; }
.flex-wrap { flex-wrap: wrap; }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sign-box {
  width: 160px;
  text-align: center;
  border: 1px solid #e5e7eb;
  padding: 10px;
  border-radius: 6px;
  background: #fff;
}
.sign-label {
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
  font-weight: 500;
}
.sign-img {
  max-width: 140px;
  max-height: 60px;
  border: 1px solid #eee;
  border-radius: 3px;
}
.sign-placeholder {
  width: 140px;
  height: 60px;
  line-height: 60px;
  color: #ccc;
  font-size: 13px;
  margin: 0 auto;
  border: 1px dashed #ddd;
  border-radius: 3px;
}
.sign-user {
  font-size: 11px;
  color: #999;
  margin-top: 6px;
}

.sign-canvas-wrap {
  border: 1px dashed #ccc;
  border-radius: 4px;
  margin-top: 8px;
  background: #fafafa;
}
.sign-canvas {
  width: 100%;
  height: 200px;
  cursor: crosshair;
  touch-action: none;
}

.text-gray-400 { color: #9ca3af; }
</style>
