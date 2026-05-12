<template>
  <div class="app-container training-record">
    <el-row :gutter="20" class="stat-cards">
      <el-col :xs="24" :sm="8">
        <el-card class="stat-card">
          <div class="stat-icon blue"><el-icon><Reading /></el-icon></div>
          <div class="stat-info">
            <p class="stat-num">{{ studyRecords.length }}</p>
            <p class="stat-label">已学课程</p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8">
        <el-card class="stat-card">
          <div class="stat-icon green"><el-icon><DocumentChecked /></el-icon></div>
          <div class="stat-info">
            <p class="stat-num">{{ examRecords.length }}</p>
            <p class="stat-label">已考试卷</p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="8">
        <el-card class="stat-card">
          <div class="stat-icon orange"><el-icon><Timer /></el-icon></div>
          <div class="stat-info">
            <p class="stat-num">{{ totalHours }}</p>
            <p class="stat-label">学习时长(小时)</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="record-card">
      <template #header>
        <div class="card-header">
          <span>学习记录</span>
          <el-button type="primary" size="small" icon="Download" @click="exportExcel">导出档案</el-button>
        </div>
      </template>
      <el-table :data="studyRecords" border>
        <el-table-column type="index" width="50" />
        <el-table-column label="课程名称" prop="courseName" />
        <el-table-column label="学习时长" width="120">
          <template #default="scope">
            {{ formatTime(scope.row.totalTime) }}
          </template>
        </el-table-column>
        <el-table-column label="最近学习" width="180">
          <template #default="scope">
            {{ scope.row.lastStudy ? scope.row.lastStudy.substring(0, 19).replace('T', ' ') : '-' }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="record-card">
      <template #header>
        <div class="card-header">
          <span>考试记录</span>
        </div>
      </template>
      <el-table :data="examRecords" border>
        <el-table-column type="index" width="50" />
        <el-table-column label="试卷名称" prop="paperTitle" />
        <el-table-column label="得分" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.pass ? 'success' : 'danger'">{{ scope.row.score }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="正确/总数" width="120">
          <template #default="scope">
            {{ scope.row.correctCount }}/{{ scope.row.totalCount }}
          </template>
        </el-table-column>
        <el-table-column label="是否通过" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.pass ? 'success' : 'danger'">{{ scope.row.pass ? '通过' : '未通过' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="考试时间" width="180">
          <template #default="scope">
            {{ scope.row.submitTime ? scope.row.submitTime.substring(0, 19).replace('T', ' ') : '-' }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup name="TrainingRecord">
import { Reading, DocumentChecked, Timer } from '@element-plus/icons-vue';

const studyRecords = ref([]);
const examRecords = ref([]);
const totalHours = ref('0.0');

function loadRecords() {
  // 学习记录
  const sRecords = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('study_record_')) {
      try {
        sRecords.push(JSON.parse(localStorage.getItem(key)));
      } catch (e) {}
    }
  }
  studyRecords.value = sRecords;
  const totalSeconds = sRecords.reduce((sum, r) => sum + (r.totalTime || 0), 0);
  totalHours.value = (totalSeconds / 3600).toFixed(1);

  // 考试记录
  try {
    examRecords.value = JSON.parse(localStorage.getItem('exam_records') || '[]');
  } catch (e) {
    examRecords.value = [];
  }
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}时${m}分${s}秒`;
  if (m > 0) return `${m}分${s}秒`;
  return `${s}秒`;
}

function exportExcel() {
  // 构造CSV
  let csv = '\uFEFF课程名称,学习时长(秒),最近学习时间\n';
  studyRecords.value.forEach(r => {
    csv += `${r.courseName || ''},${r.totalTime || 0},${r.lastStudy || ''}\n`;
  });
  csv += '\n试卷名称,得分,正确数,总数,是否通过,考试时间\n';
  examRecords.value.forEach(r => {
    csv += `${r.paperTitle || ''},${r.score || 0},${r.correctCount || 0},${r.totalCount || 0},${r.pass ? '通过' : '未通过'},${r.submitTime || ''}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `个人培训档案_${new Date().toISOString().substring(0, 10)}.csv`;
  link.click();
}

loadRecords();
</script>

<style scoped lang="scss">
.training-record {
  padding: 16px;
}
.stat-cards {
  margin-bottom: 20px;
}
.stat-card {
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 16px;
}
.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #fff;
  margin-right: 16px;
}
.stat-icon.blue { background: linear-gradient(135deg, #1a56db, #3b82f6); }
.stat-icon.green { background: linear-gradient(135deg, #059669, #10b981); }
.stat-icon.orange { background: linear-gradient(135deg, #d97706, #f59e0b); }
.stat-info {
  flex: 1;
}
.stat-num {
  font-size: 26px;
  font-weight: 700;
  margin: 0;
  color: #1f2937;
}
.stat-label {
  font-size: 13px;
  color: #888;
  margin: 4px 0 0;
}
.record-card {
  margin-bottom: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
@media (max-width: 768px) {
  .stat-card {
    margin-bottom: 12px;
  }
}
</style>
