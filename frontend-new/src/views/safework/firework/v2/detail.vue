<template>
  <div class="app-container">
    <el-page-header @back="goBack" title="动火作业详情" />

    <el-card class="mt-4" shadow="never">
      <template #header>
        <div class="card-header">
          <span>基本信息</span>
          <el-tag :type="statusTagType(detail.status)">{{ detail.statusText }}</el-tag>
        </div>
      </template>
      <el-descriptions :column="3" border>
        <el-descriptions-item label="票号">{{ detail.ticket_no }}</el-descriptions-item>
        <el-descriptions-item label="申请人">{{ detail.applicant_name }}</el-descriptions-item>
        <el-descriptions-item label="部门">{{ detail.dept_name }}</el-descriptions-item>
        <el-descriptions-item label="动火等级">{{ detail.fireLevelText }}</el-descriptions-item>
        <el-descriptions-item label="动火区域">{{ detail.fireArea }}</el-descriptions-item>
        <el-descriptions-item label="动火方式">{{ detail.fireType }}</el-descriptions-item>
        <el-descriptions-item label="作业地点" :span="2">{{ detail.work_location }}</el-descriptions-item>
        <el-descriptions-item label="计划时间">
          {{ parseTime(detail.start_time) }} ~ {{ parseTime(detail.end_time) }}
        </el-descriptions-item>
        <el-descriptions-item label="作业内容" :span="3">{{ detail.work_content }}</el-descriptions-item>
        <el-descriptions-item label="风险分析" :span="3">{{ detail.riskAnalysis }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 流程操作 -->
    <el-card class="mt-4" shadow="never">
      <template #header><span>流程操作</span></template>
      <el-steps :active="activeStep" finish-status="success" simple>
        <el-step title="草稿" />
        <el-step title="已提交" />
        <el-step title="部门审批" />
        <el-step title="安全审批" />
        <el-step title="已批准" />
        <el-step title="作业中" />
        <el-step title="待验收" />
        <el-step title="已关闭" />
      </el-steps>

      <div class="mt-4 flex gap-2">
        <el-button type="primary" v-if="canSubmit" @click="doSubmit">提交审批</el-button>
        <el-button type="success" v-if="canDeptApprove" @click="doApprove('dept')">部门审批</el-button>
        <el-button type="success" v-if="canSafetyApprove" @click="doApprove('safety')">安全审批</el-button>
        <el-button type="success" v-if="canFinalApprove" @click="doApprove('final')">最终批准</el-button>
        <el-button type="warning" v-if="canStart" @click="doStart">开始作业</el-button>
        <el-button type="warning" v-if="canFinish" @click="doFinish">完成作业</el-button>
        <el-button type="danger" v-if="canClose" @click="doClose">验收关闭</el-button>
        <el-button v-if="canReject" @click="doApprove('reject')">驳回</el-button>
      </div>
    </el-card>

    <!-- 气体检测 -->
    <el-card class="mt-4" shadow="never">
      <template #header>
        <div class="card-header">
          <span>气体检测记录</span>
          <el-button type="primary" size="small" @click="gasOpen=true" v-if="detail.status==='5' || detail.status==='6'">新增检测</el-button>
        </div>
      </template>
      <el-table :data="gasList" size="small">
        <el-table-column prop="check_type" label="时机" width="90">
          <template #default="{row}">{{ row.check_type==='before'?'作业前':row.check_type==='during'?'作业中':'作业后' }}</template>
        </el-table-column>
        <el-table-column prop="check_time" label="时间" width="150">
          <template #default="{row}">{{ parseTime(row.check_time) }}</template>
        </el-table-column>
        <el-table-column prop="oxygen_percent" label="氧气%" />
        <el-table-column prop="flammable_percent" label="可燃%LEL" />
        <el-table-column prop="toxic_ppm" label="有毒ppm" />
        <el-table-column prop="check_result" label="结果" width="80">
          <template #default="{row}"><el-tag :type="row.check_result===1?'success':'danger'">{{ row.check_result===1?'合格':'不合格' }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="checker_name" label="检测人" width="100" />
      </el-table>
    </el-card>

    <!-- 签字记录 -->
    <el-card class="mt-4" shadow="never">
      <template #header>
        <div class="card-header">
          <span>签字记录</span>
          <el-button type="primary" size="small" @click="signOpen=true">电子签字</el-button>
        </div>
      </template>
      <div class="flex flex-wrap gap-4">
        <div v-for="s in signList" :key="s.id" class="sign-box">
          <div class="sign-label">{{ signTypeLabel(s.sign_type) }}</div>
          <img v-if="s.sign_image" :src="baseUrl + s.sign_image" class="sign-img" />
          <div v-else class="sign-placeholder">未签字</div>
          <div class="sign-user">{{ s.signer_name }} {{ parseTime(s.sign_time) }}</div>
        </div>
      </div>
    </el-card>

    <!-- 审批记录 -->
    <el-card class="mt-4" shadow="never">
      <template #header><span>审批记录</span></template>
      <el-table :data="approvalList" size="small">
        <el-table-column prop="node_name" label="节点" />
        <el-table-column prop="approver_name" label="审批人" />
        <el-table-column prop="approval_result" label="结果">
          <template #default="{row}"><el-tag :type="row.approval_result==='approve'?'success':'danger'">{{ row.approval_result==='approve'?'通过':'驳回' }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="approval_opinion" label="意见" show-overflow-tooltip />
        <el-table-column prop="approval_time" label="时间" width="150">
          <template #default="{row}">{{ parseTime(row.approval_time) }}</template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 气体检测弹窗 -->
    <el-dialog title="气体检测" v-model="gasOpen" width="500px" append-to-body>
      <el-form :model="gasForm" label-width="100px">
        <el-form-item label="检测时机">
          <el-radio-group v-model="gasForm.checkType">
            <el-radio label="before">作业前</el-radio>
            <el-radio label="during">作业中</el-radio>
            <el-radio label="after">作业后</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="氧气浓度%">
          <el-input-number v-model="gasForm.oxygenPercent" :precision="2" :min="0" :max="100" style="width:100%" />
        </el-form-item>
        <el-form-item label="可燃气体%LEL">
          <el-input-number v-model="gasForm.flammablePercent" :precision="4" :min="0" style="width:100%" />
        </el-form-item>
        <el-form-item label="有毒气体ppm">
          <el-input-number v-model="gasForm.toxicPpm" :precision="2" :min="0" style="width:100%" />
        </el-form-item>
        <el-form-item label="有毒气体种类">
          <el-input v-model="gasForm.toxicType" placeholder="如：硫化氢、一氧化碳" />
        </el-form-item>
        <el-form-item label="检测地点">
          <el-input v-model="gasForm.checkLocation" />
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
        <el-button @click="gasOpen=false">取 消</el-button>
      </template>
    </el-dialog>

    <!-- 电子签字弹窗 -->
    <el-dialog title="电子签字" v-model="signOpen" width="600px" append-to-body>
      <el-form :model="signForm" label-width="80px">
        <el-form-item label="签字类型">
          <el-select v-model="signForm.signType" style="width:100%">
            <el-option label="风险分析" value="risk_analysis" />
            <el-option label="安全交底" value="safety_disclosure" />
            <el-option label="作业负责人" value="responsible" />
            <el-option label="监护人" value="guardian" />
            <el-option label="动火人" value="fire_worker" />
            <el-option label="验收人" value="acceptance" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="sign-canvas-wrap">
        <canvas ref="signCanvas" class="sign-canvas" @mousedown="startDraw" @mousemove="drawing" @mouseup="endDraw" @mouseleave="endDraw"></canvas>
      </div>
      <div class="mt-2 flex gap-2">
        <el-button @click="clearSign">清空</el-button>
        <el-button type="primary" @click="submitSign">确认签字</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="HotWorkDetailV2">
import { ref, reactive, onMounted, computed, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getHotWork, submitHotWork, approveHotWork, startHotWork, finishHotWork, closeHotWork, getGasChecks, addGasCheck } from '@/api/hotWork'
import { saveSignature } from '@/api/signature'
import { parseTime } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const ticketId = route.query.id

const baseUrl = import.meta.env.VITE_APP_BASE_API || ''

const detail = ref({})
const gasList = ref([])
const signList = ref([])
const approvalList = ref([])

const gasOpen = ref(false)
const gasForm = reactive({ checkType: 'before', oxygenPercent: 20.9, flammablePercent: 0, toxicPpm: 0, toxicType: '', checkLocation: '', checkResult: 1, remark: '' })

const signOpen = ref(false)
const signForm = reactive({ signType: 'responsible' })
const signCanvas = ref(null)
let ctx = null, drawingFlag = false, lastX = 0, lastY = 0

const statusMap = { '1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'draft':1,'pending':2,'approved':5,'executing':6,'completed':7,'closed':8 }

const activeStep = computed(() => statusMap[String(detail.value.status)] || 0)

const canSubmit = computed(() => detail.value.status === '1' || detail.value.status === 'draft')
const canDeptApprove = computed(() => detail.value.status === '2')
const canSafetyApprove = computed(() => detail.value.status === '3')
const canFinalApprove = computed(() => detail.value.status === '4')
const canStart = computed(() => detail.value.status === '5' || detail.value.status === 'approved')
const canFinish = computed(() => detail.value.status === '6' || detail.value.status === 'executing')
const canClose = computed(() => detail.value.status === '7' || detail.value.status === 'completed')
const canReject = computed(() => ['2','3','4','5'].includes(String(detail.value.status)))

function statusTagType(s) {
  const map = { 1:'info',2:'',3:'primary',4:'primary',5:'success',6:'warning',7:'warning',8:'danger' }
  return map[s] || ''
}
function signTypeLabel(t) {
  const map = { risk_analysis:'风险分析', safety_disclosure:'安全交底', responsible:'作业负责人', guardian:'监护人', fire_worker:'动火人', acceptance:'验收人' }
  return map[t] || t
}

function load() {
  getHotWork(ticketId).then(res => {
    const d = res.data || {}
    detail.value = d
    gasList.value = d.gasChecks || []
    signList.value = d.signatures || []
    approvalList.value = d.approvals || []
  })
}

function goBack() { router.back() }

function doSubmit() {
  proxy.$modal.confirm('确认提交审批？').then(() => {
    return submitHotWork(ticketId)
  }).then(() => { proxy.$modal.msgSuccess('提交成功'); load() })
}
function doApprove(action) {
  const title = action==='reject'?'驳回':'审批'
  proxy.$modal.confirm(`确认执行${title}？`).then(() => {
    return approveHotWork(ticketId, { action, comment: '' })
  }).then(() => { proxy.$modal.msgSuccess('操作成功'); load() })
}
function doStart() {
  proxy.$modal.confirm('确认开始作业？').then(() => startHotWork(ticketId)).then(() => { proxy.$modal.msgSuccess('已开始'); load() })
}
function doFinish() {
  proxy.$modal.confirm('确认完成作业？').then(() => finishHotWork(ticketId)).then(() => { proxy.$modal.msgSuccess('已完成'); load() })
}
function doClose() {
  proxy.$modal.confirm('确认验收关闭？').then(() => closeHotWork(ticketId)).then(() => { proxy.$modal.msgSuccess('已关闭'); load() })
}

function submitGas() {
  addGasCheck(ticketId, gasForm).then(() => {
    proxy.$modal.msgSuccess('检测记录保存成功')
    gasOpen.value = false
    load()
  })
}

// 签字 canvas
function initCanvas() {
  const c = signCanvas.value
  if (!c) return
  c.width = c.offsetWidth
  c.height = c.offsetHeight
  ctx = c.getContext('2d')
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
}
function startDraw(e) {
  drawingFlag = true
  const rect = signCanvas.value.getBoundingClientRect()
  lastX = e.clientX - rect.left
  lastY = e.clientY - rect.top
}
function drawing(e) {
  if (!drawingFlag) return
  const rect = signCanvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(x, y)
  ctx.stroke()
  lastX = x
  lastY = y
}
function endDraw() { drawingFlag = false }
function clearSign() { ctx && ctx.clearRect(0, 0, signCanvas.value.width, signCanvas.value.height) }
function submitSign() {
  const base64 = signCanvas.value.toDataURL('image/png')
  saveSignature({
    bizType: 'hot_work',
    bizId: ticketId,
    signType: signForm.signType,
    signImage: base64,
    signerName: ''
  }).then(() => {
    proxy.$modal.msgSuccess('签字保存成功')
    signOpen.value = false
    clearSign()
    load()
  })
}

onMounted(() => {
  load()
})
</script>

<style scoped>
.card-header { display:flex; justify-content:space-between; align-items:center; }
.mt-4 { margin-top:16px; }
.flex { display:flex; }
.gap-2 { gap:8px; }
.gap-4 { gap:16px; }
.flex-wrap { flex-wrap:wrap; }
.sign-box { width:160px; text-align:center; border:1px solid #ddd; padding:8px; border-radius:4px; }
.sign-label { font-size:12px; color:#666; margin-bottom:4px; }
.sign-img { max-width:140px; max-height:50px; }
.sign-placeholder { width:140px; height:50px; line-height:50px; color:#999; font-size:12px; margin:0 auto; }
.sign-user { font-size:11px; color:#999; margin-top:4px; }
.sign-canvas-wrap { border:1px dashed #ccc; border-radius:4px; margin-top:8px; }
.sign-canvas { width:100%; height:200px; cursor:crosshair; }
</style>
