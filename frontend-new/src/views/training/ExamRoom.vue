<template>
  <div class="exam-room">
    <!-- 未开始考试：欢迎页面 -->
    <el-card v-if="!examStarted && !examFinished" class="exam-welcome">
      <div class="welcome-content text-center p-8">
        <h2 class="text-2xl mb-4">{{ paperInfo?.title || '在线考试' }}</h2>
        <div class="paper-info mb-6">
          <el-descriptions :column="2" border size="large">
            <el-descriptions-item label="题目数量">{{ paperInfo?.questionCount || 0 }} 题</el-descriptions-item>
            <el-descriptions-item label="考试时长">{{ paperInfo?.duration || 60 }} 分钟</el-descriptions-item>
            <el-descriptions-item label="总分">{{ paperInfo?.totalScore || 100 }} 分</el-descriptions-item>
            <el-descriptions-item label="及格分">{{ paperInfo?.passScore || 60 }} 分</el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="exam-tips mb-6 text-left">
          <el-alert title="考试须知" type="warning" :closable="false">
            <ul class="tips-list">
              <li>考试过程中请勿退出全屏模式，否则将被记录违规</li>
              <li>页面切换超过 3 次将自动交卷</li>
              <li>时间到后将自动提交试卷</li>
              <li>请确保网络稳定，答案会自动保存</li>
            </ul>
          </el-alert>
        </div>
        <el-button type="primary" size="large" @click="startExam" :loading="starting">
          开始考试
        </el-button>
      </div>
    </el-card>

    <!-- 考试中 -->
    <el-card v-else-if="examStarted && !examFinished" class="exam-main">
      <!-- 顶部信息栏 -->
      <div class="exam-header flex justify-between items-center mb-4">
        <h2>{{ examData?.paper?.title || '在线考试' }}</h2>
        <div class="header-right flex gap-3">
          <el-tag :type="timeLeft < 300 ? 'danger' : 'primary'" size="large">
            <el-icon><Clock /></el-icon>
            剩余: {{ formatTime(timeLeft) }}
          </el-tag>
          <el-tag v-if="violationCount > 0" type="danger" size="large">
            违规: {{ violationCount }}/3
          </el-tag>
          <el-button type="success" size="small" @click="submitExam">
            交卷
          </el-button>
        </div>
      </div>

      <!-- 题型筛选 & 进度 -->
      <div class="exam-progress mb-4 p-3 bg-gray-50 rounded">
        <div class="flex justify-between items-center flex-wrap gap-2">
          <div class="flex gap-2">
            <el-tag :type="filterType === 'all' ? 'primary' : 'info'" class="cursor-pointer" @click="filterType = 'all'">
              全部({{ questions.length }})
            </el-tag>
            <el-tag :type="filterType === 'single' ? 'primary' : 'info'" class="cursor-pointer" @click="filterType = 'single'">
              单选({{ typeCounts.single }})
            </el-tag>
            <el-tag :type="filterType === 'multiple' ? 'primary' : 'info'" class="cursor-pointer" @click="filterType = 'multiple'">
              多选({{ typeCounts.multiple }})
            </el-tag>
            <el-tag :type="filterType === 'essay' ? 'primary' : 'info'" class="cursor-pointer" @click="filterType = 'essay'">
              简答({{ typeCounts.essay }})
            </el-tag>
          </div>
          <div class="flex gap-4 text-sm text-gray-500">
            <span>已答: {{ answeredCount }}/{{ questions.length }}</span>
            <span v-if="autoSaveTime">上次保存: {{ autoSaveTime }}</span>
          </div>
        </div>
      </div>

      <!-- 题目区域 -->
      <div v-if="filteredQuestions.length > 0 && currentFilteredQuestion" class="question-area">
        <div class="question-header flex justify-between items-center mb-4">
          <h3 class="text-lg">
            <el-tag :type="questionTypeTag(currentFilteredQuestion.type)" size="small" class="mr-2">
              {{ questionTypeText(currentFilteredQuestion.type) }}
            </el-tag>
            第 {{ currentFilteredIndex + 1 }} / {{ filteredQuestions.length }} 题
            <span class="text-sm text-gray-400 ml-2">
              (总第 {{ questions.indexOf(currentFilteredQuestion) + 1 }} 题)
            </span>
          </h3>
          <span class="text-sm text-gray-500">
            {{ currentFilteredQuestion.score }} 分
          </span>
        </div>

        <div class="question-content p-4 bg-white rounded border">
          <h4 class="mb-4 text-base leading-relaxed">{{ currentFilteredQuestion.content }}</h4>

          <!-- 单选题 -->
          <div v-if="currentFilteredQuestion.type === 'single'" class="options ml-4">
            <div
              v-for="(option, idx) in currentFilteredQuestion.options"
              :key="idx"
              class="option-item mb-3 cursor-pointer p-2 rounded hover:bg-blue-50"
              :class="{ 'bg-blue-50 border border-blue-300': getAnswer(getRealIndex()) === option.label }"
              @click="setAnswer(getRealIndex(), option.label)"
            >
              <el-radio v-model="answers[getRealIndex()]" :label="option.label" class="w-full">
                <span class="font-bold mr-1">{{ option.label }}.</span>{{ option.text }}
              </el-radio>
            </div>
          </div>

          <!-- 多选题 -->
          <div v-if="currentFilteredQuestion.type === 'multiple'" class="options ml-4">
            <el-checkbox-group
              v-model="multipleAnswers[getRealIndex()]"
              @change="onMultipleChange(getRealIndex())"
            >
              <div
                v-for="(option, idx) in currentFilteredQuestion.options"
                :key="idx"
                class="option-item mb-3 cursor-pointer p-2 rounded hover:bg-blue-50"
              >
                <el-checkbox :label="option.label" class="w-full">
                  <span class="font-bold mr-1">{{ option.label }}.</span>{{ option.text }}
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </div>

          <!-- 简答题 -->
          <div v-if="currentFilteredQuestion.type === 'essay'" class="essay-answer">
            <el-input
              v-model="answers[getRealIndex()]"
              type="textarea"
              :rows="6"
              placeholder="请输入您的答案..."
              maxlength="2000"
              show-word-limit
            />
          </div>
        </div>

        <!-- 导航按钮 -->
        <div class="flex justify-between mt-4">
          <el-button @click="prevFilteredQuestion" :disabled="currentFilteredIndex === 0">
            上一题
          </el-button>
          <el-button
            v-if="currentFilteredIndex < filteredQuestions.length - 1"
            type="primary"
            @click="nextFilteredQuestion"
          >
            下一题
          </el-button>
          <el-button
            v-else
            type="success"
            @click="submitExam"
          >
            提交试卷
          </el-button>
        </div>
      </div>

      <el-empty v-else :description="'暂无' + filterTypeText + '题目'" />

      <!-- 答题卡 -->
      <div class="answer-card mt-6 p-4 border rounded bg-white">
        <div class="flex justify-between items-center mb-3">
          <h4 class="text-base font-bold">答题卡</h4>
          <div class="flex gap-3 text-xs">
            <span class="flex items-center gap-1">
              <span class="w-3 h-3 inline-block rounded" style="background: #e6f4ff; border: 1px solid #409EFF;"></span> 已答
            </span>
            <span class="flex items-center gap-1">
              <span class="w-3 h-3 inline-block rounded" style="background: #f5f5f5; border: 1px solid #d9d9d9;"></span> 未答
            </span>
            <span class="flex items-center gap-1">
              <span class="w-3 h-3 inline-block rounded" style="background: #409EFF; border: 1px solid #409EFF;"></span> 当前
            </span>
          </div>
        </div>
        <div class="answer-grid">
          <div
            v-for="(q, idx) in questions"
            :key="idx"
            class="answer-item cursor-pointer"
            :class="{
              'answered': hasAnswer(idx),
              'current': questions.indexOf(currentFilteredQuestion) === idx,
              'unanswered': !hasAnswer(idx)
            }"
            @click="jumpToQuestion(idx)"
          >
            <el-badge :value="q.type === 'single' ? '单' : q.type === 'multiple' ? '多' : '简'" :type="q.type === 'single' ? 'primary' : q.type === 'multiple' ? 'warning' : 'info'" class="answer-badge">
              <span class="answer-num">{{ idx + 1 }}</span>
            </el-badge>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 考试结束 -->
    <el-card v-else-if="examFinished" class="exam-result text-center p-8">
      <el-result
        :icon="examResult?.passed ? 'success' : 'error'"
        :title="examResult?.passed ? '恭喜，考试通过！' : '很遗憾，未通过'"
      >
        <template #sub-title>
          <div class="result-info">
            <p>得分: <strong>{{ examResult?.score }} 分</strong></p>
            <p>正确: {{ examResult?.correctCount }} 题 / 共 {{ examResult?.totalCount }} 题</p>
            <p v-if="examResult?.violations">违规次数: {{ examResult?.violations }}</p>
          </div>
        </template>
        <template #extra>
          <el-button type="primary" @click="router.push('/training/my')">返回我的学习</el-button>
        </template>
      </el-result>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Clock } from '@element-plus/icons-vue'
import { startExam as apiStartExam, submitExam as apiSubmitExam } from '@/api/training'

const route = useRoute()
const router = useRouter()

// ==================== 状态变量 ====================
const examStarted = ref(false)
const examFinished = ref(false)
const starting = ref(false)
const paperInfo = ref<any>(null)
const examData = ref<any>(null)
const examResult = ref<any>(null)
const questions = ref<any[]>([])
const currentFilteredIndex = ref(0)
const timeLeft = ref(0)
const filterType = ref<'all' | 'single' | 'multiple' | 'essay'>('all')
const violationCount = ref(0)
const autoSaveTime = ref('')
const isFullscreen = ref(false)

// answers: 用于单选和简答（string类型）
const answers = ref<Record<number, string>>({})
// multipleAnswers: 用于多选（string[]类型）
const multipleAnswers = ref<Record<number, string[]>>({})

let timer: number | null = null
let autoSaveTimer: number | null = null
let localStorageKey = ''

// ==================== 计算属性 ====================

// 统计各题型数量
const typeCounts = computed(() => ({
  single: questions.value.filter(q => q.type === 'single').length,
  multiple: questions.value.filter(q => q.type === 'multiple').length,
  essay: questions.value.filter(q => q.type === 'essay').length
}))

// 已答数量
const answeredCount = computed(() => {
  let count = 0
  questions.value.forEach((_, idx) => {
    if (hasAnswer(idx)) count++
  })
  return count
})

// 按题型筛选题目
const filteredQuestions = computed(() => {
  if (filterType.value === 'all') return questions.value
  return questions.value.filter(q => q.type === filterType.value)
})

const currentFilteredQuestion = computed(() => {
  return filteredQuestions.value[currentFilteredIndex.value] || null
})

const filterTypeText = computed(() => {
  const map: Record<string, string> = { all: '', single: '单选题', multiple: '多选题', essay: '简答题' }
  return map[filterType.value] || ''
})

// ==================== 工具方法 ====================

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const questionTypeTag = (type: string) => {
  const map: Record<string, string> = { single: 'primary', multiple: 'warning', essay: 'info' }
  return map[type] || 'info'
}

const questionTypeText = (type: string) => {
  const map: Record<string, string> = { single: '单选', multiple: '多选', essay: '简答' }
  return map[type] || type
}

// 获取在全部questions中的真实索引
const getRealIndex = () => {
  const q = currentFilteredQuestion.value
  if (!q) return 0
  return questions.value.indexOf(q)
}

// 判断是否已答
const hasAnswer = (idx: number) => {
  const q = questions.value[idx]
  if (!q) return false
  if (q.type === 'multiple') {
    return multipleAnswers.value[idx] && multipleAnswers.value[idx].length > 0
  }
  return !!answers.value[idx]
}

// 获取答案（用于显示）
const getAnswer = (idx: number) => {
  return answers.value[idx] || ''
}

// 设置答案（单选/简答）
const setAnswer = (idx: number, value: string) => {
  answers.value[idx] = value
}

// 多选题变化
const onMultipleChange = (idx: number) => {
  // 多选题的答案存储在 multipleAnswers 中
}

// ==================== 题目导航 ====================

const prevFilteredQuestion = () => {
  if (currentFilteredIndex.value > 0) {
    currentFilteredIndex.value--
  }
}

const nextFilteredQuestion = () => {
  if (currentFilteredIndex.value < filteredQuestions.value.length - 1) {
    currentFilteredIndex.value++
  }
}

const jumpToQuestion = (realIdx: number) => {
  // 找到真实索引在筛选列表中的位置
  const q = questions.value[realIdx]
  if (!q) return
  // 检查当前筛选是否包含该题
  if (filterType.value !== 'all' && q.type !== filterType.value) {
    filterType.value = 'all'
  }
  // 使用 nextTick 确保筛选更新后再设置索引
  nextTick(() => {
    const filteredIdx = filteredQuestions.value.findIndex(fq => fq === q)
    if (filteredIdx >= 0) {
      currentFilteredIndex.value = filteredIdx
    }
  })
}

// ==================== 考试流程 ====================

const startExam = async () => {
  starting.value = true
  try {
    const paperId = Number(route.params.id)
    const res = await apiStartExam(paperId)
    examData.value = res.data
    questions.value = res.data.questions || []
    timeLeft.value = (res.data.duration || 60) * 60

    // 初始化localStorage key
    localStorageKey = `exam_${paperId}_${Date.now()}`
    // 尝试恢复保存的答案
    const saved = localStorage.getItem(localStorageKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        answers.value = parsed.answers || {}
        multipleAnswers.value = parsed.multipleAnswers || {}
        timeLeft.value = parsed.timeLeft || timeLeft.value
      } catch (e) { /* ignore */ }
    }

    examStarted.value = true
    startTimer()
    enterFullscreen()
    ElMessage.success('考试开始')
  } catch (error) {
    console.error('开始考试失败:', error)
    ElMessage.error('开始考试失败')
  } finally {
    starting.value = false
  }
}

const startTimer = () => {
  if (timer) clearInterval(timer)
  timer = window.setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(timer!)
      ElMessage.warning('考试时间到，系统将自动交卷')
      submitExam()
    }
  }, 1000)
}

const submitExam = async () => {
  try {
    await ElMessageBox.confirm(
      `还有 ${answeredCount.value}/${questions.value.length} 题未作答，确定提交试卷吗？`,
      '提示',
      { type: 'warning', confirmButtonText: '确认交卷', cancelButtonText: '继续检查' }
    )
  } catch {
    return // 用户取消
  }

  try {
    // 合并单选/简答和多选答案
    const submitAnswers: Record<number, string | string[]> = { ...answers.value }
    Object.keys(multipleAnswers.value).forEach((key) => {
      const idx = Number(key)
      submitAnswers[idx] = multipleAnswers.value[idx]
    })

    const paperId = Number(route.params.id)
    const res = await apiSubmitExam({
      paperId,
      answers: submitAnswers,
      violations: violationCount.value,
      usedTime: (examData.value?.duration || 60) * 60 - timeLeft.value
    })

    if (timer) clearInterval(timer)
    if (autoSaveTimer) clearInterval(autoSaveTimer)
    localStorage.removeItem(localStorageKey)
    exitFullscreen()

    examFinished.value = true
    examResult.value = res.data || { passed: true, score: 0 }
    ElMessage.success('交卷成功')
  } catch (error: any) {
    console.error('提交失败:', error)
    ElMessage.error(error?.message || '提交失败')
  }
}

// ==================== 自动保存 ====================

const autoSave = () => {
  if (!localStorageKey) return
  const data = {
    answers: answers.value,
    multipleAnswers: multipleAnswers.value,
    timeLeft: timeLeft.value,
    timestamp: Date.now()
  }
  localStorage.setItem(localStorageKey, JSON.stringify(data))
  const now = new Date()
  autoSaveTime.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
}

// 监听答案变化自动保存（防抖2秒）
let autoSaveDebounce: number | null = null
watch([answers, multipleAnswers], () => {
  if (autoSaveDebounce) clearTimeout(autoSaveDebounce)
  autoSaveDebounce = window.setTimeout(() => {
    autoSave()
  }, 2000)
}, { deep: true })

// ==================== 防作弊 ====================

const enterFullscreen = async () => {
  try {
    const el = document.documentElement
    if (el.requestFullscreen) {
      await el.requestFullscreen()
    } else if ((el as any).webkitRequestFullscreen) {
      await (el as any).webkitRequestFullscreen()
    } else if ((el as any).msRequestFullscreen) {
      await (el as any).msRequestFullscreen()
    }
    isFullscreen.value = true
  } catch (e) {
    console.warn('全屏失败:', e)
  }
}

const exitFullscreen = () => {
  try {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen()
    }
    isFullscreen.value = false
  } catch (e) { /* ignore */ }
}

const onFullscreenChange = () => {
  const isFs = !!(document.fullscreenElement || (document as any).webkitFullscreenElement)
  if (!isFs && isFullscreen.value && examStarted.value && !examFinished.value) {
    violationCount.value++
    ElMessage.warning(`检测到退出全屏，违规次数: ${violationCount.value}/3`)
    if (violationCount.value >= 3) {
      ElMessage.error('违规次数已达上限，系统将自动交卷')
      submitExam()
    } else {
      // 3秒后重新进入全屏
      setTimeout(() => {
        if (!examFinished.value) enterFullscreen()
      }, 3000)
    }
  }
  isFullscreen.value = isFs
}

const onVisibilityChange = () => {
  if (document.hidden && examStarted.value && !examFinished.value) {
    violationCount.value++
    ElMessage.warning(`检测到页面切换，违规次数: ${violationCount.value}/3`)
    if (violationCount.value >= 3) {
      ElMessage.error('违规次数已达上限，系统将自动交卷')
      submitExam()
    }
  }
}

const onBeforeUnload = (e: BeforeUnloadEvent) => {
  if (examStarted.value && !examFinished.value) {
    autoSave()
    e.preventDefault()
    e.returnValue = ''
  }
}

// ==================== 生命周期 ====================

onMounted(async () => {
  // 监听全屏变化
  document.addEventListener('fullscreenchange', onFullscreenChange)
  document.addEventListener('webkitfullscreenchange', onFullscreenChange)
  // 监听页面可见性变化
  document.addEventListener('visibilitychange', onVisibilityChange)
  // 监听页面关闭/刷新
  window.addEventListener('beforeunload', onBeforeUnload)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (autoSaveDebounce) clearTimeout(autoSaveDebounce)
  if (autoSaveTimer) clearInterval(autoSaveTimer)

  document.removeEventListener('fullscreenchange', onFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  window.removeEventListener('beforeunload', onBeforeUnload)

  exitFullscreen()
})
</script>

<style scoped>
.exam-room {
  min-height: 80vh;
  padding: 16px;
  background: #f5f7fa;
}

.exam-welcome {
  max-width: 700px;
  margin: 40px auto;
}

.tips-list {
  margin: 8px 0 0 16px;
  line-height: 2;
}

.exam-main {
  max-width: 960px;
  margin: 0 auto;
}

.exam-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cursor-pointer {
  cursor: pointer;
}

.question-content {
  min-height: 200px;
}

.option-item {
  transition: all 0.2s;
}

.answer-card {
  user-select: none;
}

.answer-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 8px;
}

.answer-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.answer-item.answered {
  background: #e6f4ff;
  border-color: #91caff;
  color: #1677ff;
}

.answer-item.current {
  background: #409EFF;
  border-color: #409EFF;
  color: #fff;
}

.answer-item.unanswered {
  background: #f5f5f5;
  border-color: #e8e8e8;
  color: #999;
}

.answer-item:hover {
  transform: scale(1.05);
}

.answer-num {
  font-variant-numeric: tabular-nums;
}

.answer-badge {
  display: flex;
  align-items: center;
}

.exam-result {
  max-width: 500px;
  margin: 40px auto;
}

.result-info p {
  margin: 8px 0;
  font-size: 15px;
}

@media (max-width: 768px) {
  .answer-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
