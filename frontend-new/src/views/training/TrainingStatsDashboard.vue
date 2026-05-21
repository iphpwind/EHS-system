<template>
  <div class="training-stats-dashboard">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><DataBoard /></el-icon>
        培训统计分析看板
      </h2>
      <div class="header-actions">
        <el-button @click="loadData">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 统计概览卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <div class="stat-card stat-training">
          <div class="stat-icon">📚</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.training.total }}</div>
            <div class="stat-label">培训总数</div>
            <div class="stat-sub">
              <span class="success">已完成 {{ stats.training.completed }}</span>
              <span class="warning">待完成 {{ stats.training.pending }}</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-course">
          <div class="stat-icon">🎓</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.course.total }}</div>
            <div class="stat-label">课程总数</div>
            <div class="stat-sub">
              <span class="primary">已发布 {{ stats.course.published }}</span>
              <span class="info">草稿 {{ stats.course.draft }}</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-exam">
          <div class="stat-icon">📝</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.exam.total }}</div>
            <div class="stat-label">考试总数</div>
            <div class="stat-sub">
              <span class="success">通过率 {{ passRate }}%</span>
              <span class="primary">平均分 {{ stats.exam.avg_score }}</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-cert">
          <div class="stat-icon">🏆</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.certificate.total }}</div>
            <div class="stat-label">证书总数</div>
            <div class="stat-sub">
              <span class="success">有效 {{ stats.certificate.valid }}</span>
              <span class="warning">即将过期 {{ expiringCertCount }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 可视化区域 -->
    <el-row :gutter="20" class="charts-row">
      <!-- 培训类型分布 -->
      <el-col :span="8">
        <div class="chart-card">
          <div class="card-title">培训类型分布</div>
          <div ref="typeChartRef" class="chart-container"></div>
        </div>
      </el-col>
      <!-- 月度培训趋势 -->
      <el-col :span="8">
        <div class="chart-card">
          <div class="card-title">月度培训趋势</div>
          <div ref="trendChartRef" class="chart-container"></div>
        </div>
      </el-col>
      <!-- 培训完成率趋势 -->
      <el-col :span="8">
        <div class="chart-card">
          <div class="card-title">培训完成率趋势</div>
          <div ref="completionChartRef" class="chart-container"></div>
        </div>
      </el-col>
    </el-row>

    <!-- 合规率和待办 -->
    <el-row :gutter="20" class="charts-row">
      <!-- 合规率概览 -->
      <el-col :span="8">
        <div class="chart-card">
          <div class="card-title">培训合规率概览</div>
          <div class="compliance-overview">
            <div class="compliance-rate">
              <el-progress
                type="circle"
                :percentage="complianceSummary.overall_compliance_rate"
                :color="complianceColor"
                :width="140"
              >
                <template #default>
                  <div class="rate-content">
                    <div class="rate-value">{{ complianceSummary.overall_compliance_rate }}%</div>
                    <div class="rate-label">合规率</div>
                  </div>
                </template>
              </el-progress>
            </div>
            <div class="compliance-stats">
              <div class="stat-item success">
                <span class="dot"></span>
                <span class="label">完全合规</span>
                <span class="value">{{ complianceSummary.compliant }}</span>
              </div>
              <div class="stat-item warning">
                <span class="dot"></span>
                <span class="label">部分合规</span>
                <span class="value">{{ complianceSummary.partial }}</span>
              </div>
              <div class="stat-item danger">
                <span class="dot"></span>
                <span class="label">不合规</span>
                <span class="value">{{ complianceSummary.nonCompliant }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <!-- 部门培训排行 -->
      <el-col :span="8">
        <div class="chart-card">
          <div class="card-title">部门培训排行</div>
          <div ref="deptRankChartRef" class="chart-container"></div>
        </div>
      </el-col>
      <!-- 培训排行榜 -->
      <el-col :span="8">
        <div class="chart-card">
          <div class="card-title">个人培训排行 TOP10</div>
          <div class="leaderboard">
            <div
              v-for="(item, index) in leaderboard"
              :key="item.id"
              class="leader-item"
            >
              <div class="rank" :class="getRankClass(index)">{{ index + 1 }}</div>
              <div class="user-info">
                <div class="user-name">{{ item.real_name }}</div>
                <div class="dept-name">{{ item.dept_name }}</div>
              </div>
              <div class="user-stats">
                <span class="stat">
                  <el-icon><CircleCheck /></el-icon>
                  {{ item.completed }}
                </span>
                <span class="stat">
                  <el-icon><Clock /></el-icon>
                  {{ item.total_hours }}h
                </span>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 待办任务 -->
    <el-row :gutter="20" class="charts-row">
      <!-- 待完成培训 -->
      <el-col :span="8">
        <div class="chart-card">
          <div class="card-title">待完成培训</div>
          <div class="task-list">
            <el-table :data="pendingTraining" border size="small" max-height="250">
              <el-table-column prop="real_name" label="人员" width="80" />
              <el-table-column prop="course_name" label="课程" min-width="120" show-overflow-tooltip />
              <el-table-column label="剩余" width="60" align="center">
                <template #default="{ row }">
                  <el-tag v-if="row.days_remaining <= 7" type="danger" size="small">
                    {{ row.days_remaining }}天
                  </el-tag>
                  <span v-else>{{ row.days_remaining }}天</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
      <!-- 即将过期证书 -->
      <el-col :span="8">
        <div class="chart-card">
          <div class="card-title">即将过期证书 (30天内)</div>
          <div class="task-list">
            <el-table :data="expiringCerts" border size="small" max-height="250">
              <el-table-column prop="real_name" label="人员" width="80" />
              <el-table-column prop="certificate_name" label="证书" min-width="120" show-overflow-tooltip />
              <el-table-column label="剩余" width="60" align="center">
                <template #default="{ row }">
                  <el-tag type="warning" size="small">
                    {{ row.days_remaining }}天
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
      <!-- 未通过考试 -->
      <el-col :span="8">
        <div class="chart-card">
          <div class="card-title">未通过考试</div>
          <div class="task-list">
            <el-table :data="failedExams" border size="small" max-height="250">
              <el-table-column prop="real_name" label="人员" width="80" />
              <el-table-column prop="exam_name" label="考试" min-width="120" show-overflow-tooltip />
              <el-table-column label="分数" width="60" align="center">
                <template #default="{ row }">
                  <span style="color: #f56c6c;">{{ row.score }}/{{ row.passing_score }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 部门培训明细 -->
    <div class="list-section">
      <div class="section-header">
        <span class="section-title">部门培训明细</span>
      </div>
      <el-table :data="deptStats" border stripe>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="dept_name" label="部门名称" min-width="150" />
        <el-table-column label="人员数" width="80" align="center">
          <template #default="{ row }">
            {{ row.user_count }}
          </template>
        </el-table-column>
        <el-table-column label="培训次数" width="100" align="center">
          <template #default="{ row }">
            {{ row.training_count }}
          </template>
        </el-table-column>
        <el-table-column label="完成次数" width="100" align="center">
          <template #default="{ row }">
            {{ row.completed_count }}
          </template>
        </el-table-column>
        <el-table-column label="人均培训" width="100" align="center">
          <template #default="{ row }">
            {{ row.avg_training_per_user }}
          </template>
        </el-table-column>
        <el-table-column label="完成率" width="120" align="center">
          <template #default="{ row }">
            <el-progress
              :percentage="Math.round(row.completion_rate || 0)"
              :color="getProgressColor(row.completion_rate)"
              :width="80"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, nextTick } from 'vue';
import { DataBoard, Refresh, CircleCheck, Clock } from '@element-plus/icons-vue';
import * as echarts from 'echarts';
import {
  getTrainingStats,
  getDeptTrainingStats,
  getTrainingCompliance,
  getTrainingTasks,
  getCompletionTrend,
  getTrainingLeaderboard
} from '@/api/trainingStats';

const typeChartRef = ref<HTMLDivElement>();
const trendChartRef = ref<HTMLDivElement>();
const completionChartRef = ref<HTMLDivElement>();
const deptRankChartRef = ref<HTMLDivElement>();

let typeChart: echarts.ECharts | null = null;
let trendChart: echarts.ECharts | null = null;
let completionChart: echarts.ECharts | null = null;
let deptRankChart: echarts.ECharts | null = null;

// 统计数据
const stats = reactive({
  training: { total: 0, completed: 0, pending: 0, in_progress: 0, expired: 0 },
  course: { total: 0, published: 0, draft: 0, video: 0, document: 0, offline: 0 },
  exam: { total: 0, passed: 0, failed: 0, avg_score: 0, avg_score_rate: 0 },
  certificate: { total: 0, valid: 0, expired: 0, pending: 0 },
  monthlyTrend: [],
  typeDistribution: []
});

const complianceSummary = reactive({
  total: 0,
  compliant: 0,
  partial: 0,
  nonCompliant: 0,
  overall_compliance_rate: 100
});

const pendingTraining = ref<any[]>([]);
const expiringCerts = ref<any[]>([]);
const failedExams = ref<any[]>([]);
const leaderboard = ref<any[]>([]);
const deptStats = ref<any[]>([]);
const completionTrend = ref<any[]>([]);
const expiringCertCount = ref(0);

// 计算属性
const passRate = computed(() => {
  if (stats.exam.total === 0) return 0;
  return Math.round((stats.exam.passed / stats.exam.total) * 100);
});

const complianceColor = computed(() => {
  const rate = complianceSummary.overall_compliance_rate;
  if (rate >= 90) return '#67c23a';
  if (rate >= 70) return '#e6a23c';
  return '#f56c6c';
});

// 获取排行样式
const getRankClass = (index: number) => {
  if (index === 0) return 'gold';
  if (index === 1) return 'silver';
  if (index === 2) return 'bronze';
  return '';
};

// 获取进度条颜色
const getProgressColor = (rate: number) => {
  if (rate >= 90) return '#67c23a';
  if (rate >= 70) return '#e6a23c';
  return '#f56c6c';
};

// 加载统计数据
const loadStats = async () => {
  try {
    const res: any = await getTrainingStats();
    if (res.code === 200) {
      Object.assign(stats, res.data);
    }
  } catch (error) {
    console.error('加载统计数据失败:', error);
  }
};

// 加载合规率
const loadCompliance = async () => {
  try {
    const res: any = await getTrainingCompliance();
    if (res.code === 200) {
      Object.assign(complianceSummary, res.data.summary);
    }
  } catch (error) {
    console.error('加载合规率失败:', error);
  }
};

// 加载待办任务
const loadTasks = async () => {
  try {
    const res: any = await getTrainingTasks();
    if (res.code === 200) {
      pendingTraining.value = res.data.pendingTraining || [];
      expiringCerts.value = res.data.expiringCerts || [];
      failedExams.value = res.data.failedExams || [];
      expiringCertCount.value = res.data.expiringCerts?.length || 0;
    }
  } catch (error) {
    console.error('加载待办任务失败:', error);
  }
};

// 加载部门统计
const loadDeptStats = async () => {
  try {
    const res: any = await getDeptTrainingStats();
    if (res.code === 200) {
      deptStats.value = res.data;
    }
  } catch (error) {
    console.error('加载部门统计失败:', error);
  }
};

// 加载完成率趋势
const loadCompletionTrend = async () => {
  try {
    const res: any = await getCompletionTrend({ months: 6 });
    if (res.code === 200) {
      completionTrend.value = res.data;
      nextTick(() => renderCompletionChart());
    }
  } catch (error) {
    console.error('加载完成率趋势失败:', error);
  }
};

// 加载排行榜
const loadLeaderboard = async () => {
  try {
    const res: any = await getTrainingLeaderboard({ type: 'completion', limit: 10 });
    if (res.code === 200) {
      leaderboard.value = res.data;
    }
  } catch (error) {
    console.error('加载排行榜失败:', error);
  }
};

// 渲染类型分布图
const renderTypeChart = () => {
  if (!typeChartRef.value) return;

  if (typeChart) typeChart.dispose();
  typeChart = echarts.init(typeChartRef.value);

  const data = stats.typeDistribution.map((d: any) => ({
    value: d.count,
    name: d.type
  }));

  typeChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', right: '5%', top: 'center' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['35%', '50%'],
      itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}: {d}%' },
      data
    }]
  });
};

// 渲染月度趋势图
const renderTrendChart = () => {
  if (!trendChartRef.value) return;

  if (trendChart) trendChart.dispose();
  trendChart = echarts.init(trendChartRef.value);

  const months = stats.monthlyTrend.map((d: any) => d.month);
  const totals = stats.monthlyTrend.map((d: any) => d.count);
  const completed = stats.monthlyTrend.map((d: any) => d.completed);

  trendChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['总数', '已完成'], bottom: '0%' },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: { type: 'value' },
    series: [
      { name: '总数', type: 'bar', data: totals, itemStyle: { color: '#409eff' } },
      { name: '已完成', type: 'bar', data: completed, itemStyle: { color: '#67c23a' } }
    ]
  });
};

// 渲染完成率趋势图
const renderCompletionChart = () => {
  if (!completionChartRef.value) return;

  if (completionChart) completionChart.dispose();
  completionChart = echarts.init(completionChartRef.value);

  const months = completionTrend.value.map((d: any) => d.month);
  const rates = completionTrend.value.map((d: any) => d.completion_rate);

  completionChart.setOption({
    tooltip: { trigger: 'axis', formatter: '{b}: {c}%' },
    grid: { left: '3%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: months },
    yAxis: {
      type: 'value',
      max: 100,
      axisLabel: { formatter: '{value}%' }
    },
    series: [{
      type: 'line',
      data: rates,
      smooth: true,
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(103, 194, 58, 0.4)' },
          { offset: 1, color: 'rgba(103, 194, 58, 0.05)' }
        ])
      },
      lineStyle: { color: '#67c23a', width: 3 },
      itemStyle: { color: '#67c23a' }
    }]
  });
};

// 渲染部门排行图
const renderDeptRankChart = () => {
  if (!deptRankChartRef.value) return;

  if (deptRankChart) deptRankChart.dispose();
  deptRankChart = echarts.init(deptRankChartRef.value);

  const sortedDepts = [...deptStats.value]
    .sort((a, b) => (b.completion_rate || 0) - (a.completion_rate || 0))
    .slice(0, 6);

  deptRankChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '10%', top: '10%', containLabel: true },
    xAxis: {
      type: 'value',
      max: 100,
      axisLabel: { formatter: '{value}%' }
    },
    yAxis: {
      type: 'category',
      data: sortedDepts.map(d => d.dept_name).reverse()
    },
    series: [{
      type: 'bar',
      data: sortedDepts.map(d => ({
        value: Math.round(d.completion_rate || 0),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#67c23a' },
            { offset: 1, color: '#95d475' }
          ])
        }
      })).reverse(),
      label: { show: true, position: 'right', formatter: '{c}%' }
    }]
  });
};

// 加载所有数据
const loadData = async () => {
  await Promise.all([
    loadStats(),
    loadCompliance(),
    loadTasks(),
    loadDeptStats(),
    loadCompletionTrend(),
    loadLeaderboard()
  ]);

  nextTick(() => {
    renderTypeChart();
    renderTrendChart();
    renderDeptRankChart();
  });
};

// 窗口调整
const handleResize = () => {
  typeChart?.resize();
  trendChart?.resize();
  completionChart?.resize();
  deptRankChart?.resize();
};

onMounted(() => {
  loadData();
  window.addEventListener('resize', handleResize);
});
</script>

<style scoped>
.training-stats-dashboard {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.page-title .el-icon {
  color: #9c27b0;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  font-size: 40px;
  margin-right: 16px;
  opacity: 0.8;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.stat-sub {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  font-size: 12px;
}

.stat-sub .success { color: #67c23a; }
.stat-sub .warning { color: #e6a23c; }
.stat-sub .primary { color: #409eff; }
.stat-sub .info { color: #909399; }

.charts-row {
  margin-bottom: 20px;
}

.chart-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  height: 320px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #9c27b0;
}

.chart-container {
  height: calc(100% - 40px);
  min-height: 250px;
}

.compliance-overview {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.compliance-rate {
  margin-bottom: 20px;
}

.rate-content {
  text-align: center;
}

.rate-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.rate-label {
  font-size: 14px;
  color: #909399;
}

.compliance-stats {
  display: flex;
  gap: 20px;
  width: 100%;
  justify-content: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-item .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.stat-item.success .dot { background: #67c23a; }
.stat-item.warning .dot { background: #e6a23c; }
.stat-item.danger .dot { background: #f56c6c; }

.stat-item .label {
  font-size: 12px;
  color: #909399;
}

.stat-item .value {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.leaderboard {
  height: calc(100% - 40px);
  overflow-y: auto;
}

.leader-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.leader-item:last-child {
  border-bottom: none;
}

.rank {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
  margin-right: 12px;
  background: #e0e0e0;
  color: #666;
}

.rank.gold { background: linear-gradient(135deg, #ffd700, #ffa500); color: #fff; }
.rank.silver { background: linear-gradient(135deg, #c0c0c0, #a0a0a0); color: #fff; }
.rank.bronze { background: linear-gradient(135deg, #cd7f32, #a0522d); color: #fff; }

.user-info {
  flex: 1;
}

.user-name {
  font-weight: bold;
  color: #303133;
  font-size: 14px;
}

.dept-name {
  font-size: 12px;
  color: #909399;
}

.user-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #666;
}

.user-stats .stat {
  display: flex;
  align-items: center;
  gap: 2px;
}

.task-list {
  height: calc(100% - 40px);
}

.list-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.section-header {
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}
</style>
