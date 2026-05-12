<template>
  <div class="exam-page">
    <van-nav-bar title="在线考试" left-arrow @click-left="handleBack">
      <template #right>
        <span class="countdown" :class="{ urgent: remainingSecs < 300 }">{{ fmtTime(remainingSecs) }}</span>
      </template>
    </van-nav-bar>

    <div class="exam-body" v-if="!submitted">
      <!-- 进度指示 -->
      <div class="exam-progress">
        <van-progress :percentage="(currentIdx + 1) / questions.length * 100" stroke-color="#1a56db" />
        <span class="progress-text">{{ currentIdx + 1 }} / {{ questions.length }}</span>
      </div>

      <!-- 题目区 -->
      <div class="question-card" v-if="currentQ">
        <div class="q-header">
          <van-tag :type="typeColor[currentQ.type]" size="medium">{{ typeLabel[currentQ.type] }}</van-tag>
          <span class="q-score">（{{ currentQ.score || 5 }}分）</span>
        </div>
        <div class="q-title">{{ currentIdx + 1 }}. {{ currentQ.title }}</div>

        <!-- 单选题 -->
        <van-radio-group v-if="currentQ.type === 'single'" v-model="currentAnswer" class="q-options">
          <van-radio v-for="(opt, oi) in parseOptions(currentQ.options)" :key="oi" :name="opt" class="q-option">
            {{ opt }}
          </van-radio>
        </van-radio-group>

        <!-- 多选题 -->
        <van-checkbox-group v-else-if="currentQ.type === 'multiple'" v-model="currentMultiAnswer" class="q-options" :max="parseOptions(currentQ.options).length">
          <van-checkbox v-for="(opt, oi) in parseOptions(currentQ.options)" :key="oi" :name="opt" class="q-option">
            {{ opt }}
          </van-checkbox>
        </van-checkbox-group>

        <!-- 判断题 -->
        <div v-else-if="currentQ.type === 'judge'" class="q-options">
          <van-button :type="currentAnswer === '正确' ? 'success' : 'default'" block class="judge-btn" @click="currentAnswer = '正确'">✅ 正确</van-button>
          <van-button :type="currentAnswer === '错误' ? 'danger' : 'default'" block class="judge-btn" @click="currentAnswer = '错误'">❌ 错误</van-button>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="exam-bottom">
        <van-button v-if="currentIdx > 0" @click="prevQ">上一题</van-button>
        <van-button v-if="currentIdx < questions.length - 1" type="primary" @click="nextQ">下一题</van-button>
        <van-button v-else type="danger" @click="submitExam">交卷</van-button>
      </div>
    </div>

    <!-- 结果页 -->
    <div class="exam-result" v-else>
      <div class="result-score">{{ resultData.score }}分</div>
      <div class="result-result" :class="resultData.passed ? 'passed' : 'failed'">{{ resultData.passed ? '✅ 通过' : '❌ 未通过' }}</div>
      <van-cell-group inset style="margin-top:20px">
        <van-cell title="正确" :value="resultData.right + '题'" />
        <van-cell title="错误" :value="resultData.wrong + '题'" />
        <van-cell title="用时" :value="fmtSeconds(resultData.duration)" />
      </van-cell-group>
      <van-button type="primary" block style="margin:20px" @click="router.back()">返回</van-button>
    </div>

    <!-- 切屏警告 -->
    <van-dialog v-model:show="showCheatWarn" title="警告"
      :message="'已切出' + cheatCount + '次，超过5次将自动交卷！'" confirm-button-text="知道了" />
    <van-dialog v-model:show="showAutoSubmit" title="提示"
      message="切屏超过限制，已自动交卷。" confirm-button-text="确定" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import request from '../../api/request'

const route = useRoute()
const router = useRouter()
const paperId = route.params.paperId

const questions = ref([])
const currentIdx = ref(0)
const currentAnswer = ref('')
const currentMultiAnswer = ref([])
const answers = reactive({}) // { questionId: answer }
const startTime = Date.now()
let resultId = null
let totalDuration = 3000 // 默认50分钟（秒）
let remainingSecs = ref(totalDuration)
let timerInterval = null
let cheatCount = ref(0)
let showCheatWarn = ref(false)
let showAutoSubmit = ref(false)

const submitted = ref(false)
const resultData = reactive({ score: 0, passed: false, right: 0, wrong: 0, duration: 0 })

const typeLabel = { single: '单选', multiple: '多选', judge: '判断' }
const typeColor = { single: 'primary', multiple: 'warning', judge: 'success' }

const currentQ = computed(() => questions.value[currentIdx.value] || null)

function parseOptions(opts) {
  if (!opts) return []
  if (Array.isArray(opts)) return opts
  try { const p = JSON.parse(opts); return Array.isArray(p) ? p : [] } catch { return String(opts).split(/[,;；，]/) }
}

function fmtTime(s) { const m = Math.floor(s / 60); const sec = s % 60; return `${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}` }
function fmtSeconds(s) { const m = Math.floor(s / 60); return m > 0 ? `${m}分${s%60}秒` : `${s}秒` }

function onVisibilityChange() {
  if (document.hidden) {
    cheatCount.value++
    if (cheatCount.value >= 3) showCheatWarn.value = true
    if (cheatCount.value >= 5) { showAutoSubmit.value = true; submitExam() }
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    if (remainingSecs.value <= 0) { submitExam(); return }
    remainingSecs.value--
  }, 1000)
}

function prevQ() {
  saveAnswer()
  if (currentIdx.value > 0) currentIdx.value--
  loadAnswer()
}

function nextQ() {
  saveAnswer()
  if (currentIdx.value < questions.value.length - 1) currentIdx.value++
  loadAnswer()
}

function saveAnswer() {
  const q = currentQ.value
  if (!q) return
  answers[q.id || q.question_id] = q.type === 'multiple' ? [...currentMultiAnswer.value] : currentAnswer.value
}

function loadAnswer() {
  const q = currentQ.value
  if (!q) return
  const prev = answers[q.id || q.question_id]
  if (q.type === 'multiple') { currentMultiAnswer.value = Array.isArray(prev) ? prev : [] }
  else { currentAnswer.value = prev || '' }
}

async function submitExam() {
  if (submitted.value) return
  saveAnswer()
  stopTimer()
  submitted.value = true

  const duration = Math.floor((Date.now() - startTime) / 1000)
  const answerList = Object.entries(answers).map(([qid, ans]) => ({
    questionId: Number(qid),
    answer: Array.isArray(ans) ? ans.join(',') : String(ans)
  }))

  try {
    const res = await request.post('/training-v2/exam/submit', {
      resultId, paperId,
      answers: answerList,
      duration
    })
    const data = res.data || res
    Object.assign(resultData, {
      score: data.exam_score || data.score || 0,
      passed: data.is_passed === 1 || data.is_passed === true,
      right: data.right_count || data.correct_count || 0,
      wrong: data.wrong_count || data.error_count || 0,
      duration
    })
  } catch (e) {
    showToast('提交失败: ' + (e.message || '未知错误'))
    submitted.value = false
    startTimer()
  }
}

function stopTimer() { if (timerInterval) { clearInterval(timerInterval); timerInterval = null } }

function handleBack() {
  if (!submitted.value && Object.keys(answers).length > 0) {
    showDialog({ title: '提示', message: '确定放弃考试吗？作答将不被保存。' }).then(() => router.back()).catch(() => {})
  } else { router.back() }
}

async function startExam() {
  try {
    const res = await request.post('/training-v2/exam/start', { paperId })
    const data = res.data || res
    resultId = data.resultId || data.id
    questions.value = data.questions || data.questionList || []
    totalDuration = data.total_duration || data.duration || 3000
    remainingSecs.value = totalDuration
    startTimer()
  } catch (e) { showToast('开始考试失败'); router.back() }
}

onMounted(() => {
  startExam()
  document.addEventListener('visibilitychange', onVisibilityChange)
})
onBeforeUnmount(() => { stopTimer(); document.removeEventListener('visibilitychange', onVisibilityChange) })
</script>

<style scoped>
.countdown { font-size: 15px; font-weight: 700; color: #333; }
.countdown.urgent { color: #ee0a24; animation: pulse 1s infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
.exam-body { padding: 12px; }
.exam-progress { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
.progress-text { font-size: 13px; color: #666; white-space: nowrap; }
.question-card { background: #fff; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
.q-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.q-score { color: #999; font-size: 13px; }
.q-title { font-size: 15px; font-weight: 600; margin-bottom: 14px; line-height: 1.6; }
.q-options { display: flex; flex-direction: column; gap: 10px; }
.q-option { margin: 0; padding: 10px; background: #f7f8fa; border-radius: 8px; }
.judge-btn { margin-bottom: 8px; border-radius: 8px; }
.exam-bottom { display: flex; gap: 10px; padding: 12px 0; }
.exam-bottom .van-button { flex: 1; border-radius: 8px; }
.exam-result { padding: 20px; text-align: center; }
.result-score { font-size: 48px; font-weight: 700; color: #1a56db; margin-bottom: 8px; }
.result-result { font-size: 20px; font-weight: 600; }
.result-result.passed { color: #07c160; }
.result-result.failed { color: #ee0a24; }
</style>
