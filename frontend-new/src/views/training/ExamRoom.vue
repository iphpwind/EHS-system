<template>
  <div class="exam-room p-4">
    <el-card v-if="examData">
      <div class="flex justify-between items-center mb-4">
        <h2>{{ examData.paper?.title || '在线考试' }}</h2>
        <el-tag :type="timeLeft < 300 ? 'danger' : 'primary'" size="large">
          剩余时间: {{ formatTime(timeLeft) }}
        </el-tag>
      </div>

      <div v-if="currentQuestion" class="question-area mt-4">
        <h3>第 {{ currentIndex + 1 }} 题：{{ currentQuestion.content }}</h3>
        <div class="options mt-4">
          <div v-for="(option, idx) in currentQuestion.options" :key="idx" class="option-item mb-2">
            <el-radio v-model="answers[currentIndex]" :label="option.label">
              {{ option.label }}. {{ option.text }}
            </el-radio>
          </div>
        </div>
      </div>

      <div class="flex justify-between mt-4">
        <el-button @click="prevQuestion" :disabled="currentIndex === 0">上一题</el-button>
        <el-button type="primary" @click="nextQuestion" v-if="currentIndex < questions.length - 1">下一题</el-button>
        <el-button type="success" @click="submitExam" v-else>提交试卷</el-button>
      </div>

      <div class="answer-card mt-4">
        <h4>答题卡</h4>
        <div class="grid grid-cols-10 gap-2 mt-2">
          <el-button 
            v-for="(q, idx) in questions" 
            :key="idx"
            :type="answers[idx] ? 'primary' : 'info'"
            size="small"
            @click="goToQuestion(idx)"
          >
            {{ idx + 1 }}
          </el-button>
        </div>
      </div>
    </el-card>

    <div v-else class="text-center p-8">
      <el-button type="primary" @click="startExam">开始考试</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { startExam as apiStartExam, submitExam as apiSubmitExam } from '@/api/training'

const route = useRoute()
const router = useRouter()

const examData = ref(null)
const questions = ref([])
const currentIndex = ref(0)
const answers = ref<Record<number, string>>({})
const timeLeft = ref(0)
let timer: number | null = null

const currentQuestion = computed(() => questions.value[currentIndex.value])

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const startExam = async () => {
  try {
    const paperId = Number(route.params.id)
    const res = await apiStartExam(paperId)
    examData.value = res.data
    questions.value = res.data.questions || []
    timeLeft.value = (res.data.duration || 60) * 60
    startTimer()
    ElMessage.success('考试开始')
  } catch (error) {
    console.error('开始考试失败:', error)
    ElMessage.error('开始考试失败')
  }
}

const startTimer = () => {
  timer = window.setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) {
      clearInterval(timer!)
      submitExam()
    }
  }, 1000)
}

const nextQuestion = () => {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
  }
}

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const goToQuestion = (idx: number) => {
  currentIndex.value = idx
}

const submitExam = async () => {
  try {
    await ElMessageBox.confirm('确定提交试卷吗？', '提示', { type: 'warning' })
    const paperId = Number(route.params.id)
    await apiSubmitExam({ paperId, answers: answers.value })
    ElMessage.success('提交成功')
    clearInterval(timer!)
    router.push('/training/my')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('提交失败:', error)
      ElMessage.error('提交失败')
    }
  }
}

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
