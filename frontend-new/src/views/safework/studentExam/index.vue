<template>
  <div class="app-container exam-center">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="试卷名称" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入试卷名称" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="8" v-for="paper in paperList" :key="paper.id">
        <el-card class="exam-card" shadow="hover">
          <div class="exam-header">
            <h4>{{ paper.title }}</h4>
            <el-tag :type="paper.propositionMethod == 0 ? 'primary' : 'success'">
              {{ paper.propositionMethod == 0 ? '固定命题' : '随机命题' }}
            </el-tag>
          </div>
          <div class="exam-meta">
            <p><el-icon><Timer /></el-icon> 考试时长：{{ paper.duration }}分钟</p>
            <p><el-icon><Trophy /></el-icon> 及格分数：{{ paper.passingMark }}分</p>
            <p><el-icon><Document /></el-icon> 题目数量：{{ paper.questionCount || '随机' }}</p>
          </div>
          <el-button type="primary" class="exam-btn" @click="startExam(paper)">立即考试</el-button>
        </el-card>
      </el-col>
    </el-row>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 考试弹窗 -->
    <el-dialog v-model="examVisible" :title="currentPaper.title" width="800px" :close-on-click-modal="false" :show-close="false">
      <div class="exam-timer">
        <el-icon><Timer /></el-icon>
        剩余时间：<span :class="{ 'time-warning': remainingTime < 60 }">{{ formatTime(remainingTime) }}</span>
      </div>
      <div class="question-list">
        <div v-for="(q, idx) in questionList" :key="q.id" class="question-item">
          <p class="question-title">{{ idx + 1 }}. {{ q.title }}（{{ q.fraction }}分）</p>
          <div v-if="q.questionType == 1" class="options">
            <el-radio-group v-model="answers[q.id]">
              <el-radio v-for="(opt, oi) in parseOptions(q.options)" :key="oi" :label="opt.value">{{ opt.label }}</el-radio>
            </el-radio-group>
          </div>
          <div v-else-if="q.questionType == 2" class="options">
            <el-checkbox-group v-model="answers[q.id]">
              <el-checkbox v-for="(opt, oi) in parseOptions(q.options)" :key="oi" :label="opt.value">{{ opt.label }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div v-else-if="q.questionType == 3" class="options">
            <el-radio-group v-model="answers[q.id]">
              <el-radio label="A">正确</el-radio>
              <el-radio label="B">错误</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="confirmSubmit(false)">暂存</el-button>
        <el-button type="primary" @click="confirmSubmit(true)">提交试卷</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="StudentExam">
import { listPaper } from "@/api/safework/paper";
import { getAllQuestionByPaperQuestionIds } from "@/api/safework/paper_question_selection";
import { Timer, Trophy, Document } from '@element-plus/icons-vue';

const { proxy } = getCurrentInstance();
const paperList = ref([]);
const total = ref(0);
const loading = ref(true);
const showSearch = ref(true);
const queryParams = reactive({ pageNum: 1, pageSize: 12, title: '', releaseState: 1 });

const examVisible = ref(false);
const currentPaper = ref({});
const questionList = ref([]);
const answers = reactive({});
const remainingTime = ref(0);
const examTimer = ref(null);

function getList() {
  loading.value = true;
  listPaper(queryParams).then(res => {
    paperList.value = (res.rows || []).filter(p => p.releaseState == 1);
    total.value = res.total || 0;
    loading.value = false;
  });
}

function handleQuery() {
  queryParams.pageNum = 1;
  getList();
}

function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

function startExam(paper) {
  currentPaper.value = paper;
  examVisible.value = true;
  remainingTime.value = (paper.duration || 30) * 60;
  Object.keys(answers).forEach(k => delete answers[k]);
  questionList.value = [];
  getAllQuestionByPaperQuestionIds({ testPaperId: paper.id }).then(res => {
    questionList.value = res.data || [];
    // 多选初始化数组
    questionList.value.forEach(q => {
      if (q.questionType == 2) answers[q.id] = [];
    });
  });
  startExamTimer();
}

function startExamTimer() {
  stopExamTimer();
  examTimer.value = setInterval(() => {
    remainingTime.value--;
    if (remainingTime.value <= 0) {
      stopExamTimer();
      proxy.$modal.msgWarning('考试时间已结束，自动提交');
      doSubmit();
    }
  }, 1000);
}

function stopExamTimer() {
  if (examTimer.value) {
    clearInterval(examTimer.value);
    examTimer.value = null;
  }
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function parseOptions(optionsJson) {
  try {
    return JSON.parse(optionsJson || '[]');
  } catch (e) {
    return [];
  }
}

function confirmSubmit(final) {
  if (final) {
    proxy.$modal.confirm('确定提交试卷吗？提交后将无法修改').then(() => {
      doSubmit();
    });
  } else {
    proxy.$modal.msgSuccess('答案已暂存');
    saveExamProgress();
  }
}

function doSubmit() {
  stopExamTimer();
  let score = 0;
  let correct = 0;
  questionList.value.forEach(q => {
    const userAns = answers[q.id];
    const rightAns = q.answer;
    let isCorrect = false;
    if (q.questionType == 2) {
      isCorrect = Array.isArray(userAns) && userAns.sort().join(',') == rightAns;
    } else {
      isCorrect = userAns == rightAns;
    }
    if (isCorrect) {
      score += Number(q.fraction || 0);
      correct++;
    }
  });
  const pass = score >= (currentPaper.value.passingMark || 60);
  const record = {
    paperId: currentPaper.value.id,
    paperTitle: currentPaper.value.title,
    score,
    correctCount: correct,
    totalCount: questionList.value.length,
    pass,
    submitTime: new Date().toISOString()
  };
  const records = JSON.parse(localStorage.getItem('exam_records') || '[]');
  records.push(record);
  localStorage.setItem('exam_records', JSON.stringify(records));
  examVisible.value = false;
  proxy.$modal.msgSuccess(pass ? `考试通过！得分：${score}` : `考试未通过，得分：${score}`);
}

function saveExamProgress() {
  const key = `exam_progress_${currentPaper.value.id}`;
  localStorage.setItem(key, JSON.stringify({ answers, remainingTime: remainingTime.value }));
}

onBeforeUnmount(() => {
  stopExamTimer();
});

getList();
</script>

<style scoped lang="scss">
.exam-center {
  padding: 16px;
}
.exam-card {
  margin-bottom: 20px;
}
.exam-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.exam-header h4 {
  margin: 0;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 70%;
}
.exam-meta p {
  margin: 6px 0;
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
}
.exam-btn {
  width: 100%;
  margin-top: 10px;
}
.exam-timer {
  text-align: center;
  font-size: 16px;
  color: #1a56db;
  font-weight: 600;
  padding: 10px;
  background: #eef2ff;
  border-radius: 8px;
  margin-bottom: 16px;
}
.time-warning {
  color: #dc2626;
}
.question-list {
  max-height: 500px;
  overflow-y: auto;
}
.question-item {
  padding: 16px;
  border-bottom: 1px solid #eee;
}
.question-title {
  font-weight: 500;
  margin-bottom: 10px;
}
.options {
  padding-left: 12px;
}
@media (max-width: 768px) {
  .exam-timer {
    font-size: 14px;
  }
  .question-list {
    max-height: 350px;
  }
}
</style>
