<template>
  <div class="app-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="16" class="mb-4">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon培训"><el-icon :size="32"><Reading /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.training?.total || 0 }}</div>
            <div class="stat-label">培训总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon完成"><el-icon :size="32"><CircleCheck /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.training?.completed || 0 }}</div>
            <div class="stat-label">已完成</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon课程"><el-icon :size="32"><Collection /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.course?.total || 0 }}</div>
            <div class="stat-label">课程总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-icon合规"><el-icon :size="32"><TrendCharts /></el-icon></div>
          <div class="stat-info">
            <div class="stat-value">{{ complianceRate }}%</div>
            <div class="stat-label">合规率</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="16" class="mb-4">
      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <span class="font-bold">培训完成率</span>
          </template>
          <div ref="chart1" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <span class="font-bold">部门培训完成率排名</span>
          </template>
          <div ref="chart2" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="mb-4">
      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <span class="font-bold">培训完成率趋势（近6月）</span>
          </template>
          <div ref="chart3" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <span class="font-bold">培训类型分布</span>
          </template>
          <div ref="chart4" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 待办任务 -->
    <el-row :gutter="16" class="mb-4">
      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <span class="font-bold">待完成培训 <el-tag type="warning" size="small">{{ tasks.pendingTraining?.length || 0 }}</el-tag></span>
          </template>
          <el-table :data="tasks.pendingTraining || []" max-height="250" stripe size="small">
            <el-table-column prop="real_name" label="人员" width="90" />
            <el-table-column prop="course_name" label="课程" min-width="120" show-overflow-tooltip />
            <el-table-column prop="days_remaining" label="剩余天数" width="90" align="center">
              <template #default="{ row }">
                <el-tag :type="row.days_remaining <= 3 ? 'danger' : row.days_remaining <= 7 ? 'warning' : 'success'" size="small">
                  {{ row.days_remaining }}天
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <span class="font-bold">即将到期证书 <el-tag type="danger" size="small">{{ tasks.expiringCerts?.length || 0 }}</el-tag></span>
          </template>
          <el-table :data="tasks.expiringCerts || []" max-height="250" stripe size="small">
            <el-table-column prop="real_name" label="人员" width="90" />
            <el-table-column prop="certificate_name" label="证书" min-width="120" show-overflow-tooltip />
            <el-table-column prop="days_remaining" label="剩余天数" width="90" align="center">
              <template #default="{ row }">
                <el-tag type="danger" size="small">{{ row.days_remaining }}天</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import * as echarts from 'echarts'
import { Reading, CircleCheck, Collection, TrendCharts } from '@element-plus/icons-vue'
import { getTrainingStats, getDeptTrainingStats, getTrainingCompliance, getCompletionTrend, getTrainingTypeDistribution, getTrainingTasks } from '@/api/trainingStats'

// 统计数据
const stats = ref<any>({})
const compliance = ref<any>({})
const trendData = ref<any[]>([])
const typeData = ref<any>({})
const deptStats = ref<any[]>([])
const tasks = ref<any>({})

const complianceRate = computed(() => {
  return compliance.value?.summary?.overall_compliance_rate ?? 0
})

// 图表引用
const chart1 = ref<HTMLElement>()
const chart2 = ref<HTMLElement>()
const chart3 = ref<HTMLElement>()
const chart4 = ref<HTMLElement>()

let chartInstance1: echarts.ECharts | null = null
let chartInstance2: echarts.ECharts | null = null
let chartInstance3: echarts.ECharts | null = null
let chartInstance4: echarts.ECharts | null = null

// 初始化图表
const initCharts = () => {
  if (chart1.value) {
    chartInstance1 = echarts.init(chart1.value)
  }
  if (chart2.value) {
    chartInstance2 = echarts.init(chart2.value)
  }
  if (chart3.value) {
    chartInstance3 = echarts.init(chart3.value)
  }
  if (chart4.value) {
    chartInstance4 = echarts.init(chart4.value)
  }
}

// 更新完成率饼图
const updateChart1 = () => {
  if (!chartInstance1) return
  const t = stats.value.training || {}
  const completed = t.completed || 0
  const inProgress = t.in_progress || 0
  const pending = t.pending || 0
  const expired = t.expired || 0
  chartInstance1.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
      data: [
        { value: completed, name: '已完成', itemStyle: { color: '#67C23A' } },
        { value: inProgress, name: '进行中', itemStyle: { color: '#409EFF' } },
        { value: pending, name: '待完成', itemStyle: { color: '#E6A23C' } },
        { value: expired, name: '已过期', itemStyle: { color: '#909399' } }
      ]
    }]
  })
}

// 更新部门排名柱状图
const updateChart2 = () => {
  if (!chartInstance2) return
  const data = (deptStats.value || []).slice(0, 10).map((d: any) => ({
    name: d.dept_name || '未知',
    value: Math.round(d.completion_rate || 0)
  }))
  chartInstance2.setOption({
    tooltip: { trigger: 'axis', formatter: '{b}: {c}%' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
    yAxis: { type: 'category', data: data.map((d: any) => d.name).reverse(), axisLabel: { fontSize: 11 } },
    series: [{
      type: 'bar',
      data: data.map((d: any) => ({
        value: d.value,
        itemStyle: {
          color: d.value >= 80 ? '#67C23A' : d.value >= 60 ? '#E6A23C' : '#F56C6C',
          borderRadius: [0, 4, 4, 0]
        }
      })).reverse(),
      barMaxWidth: 30
    }]
  })
}

// 更新趋势折线图
const updateChart3 = () => {
  if (!chartInstance3) return
  const data = trendData.value || []
  chartInstance3.setOption({
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: '3%', right: '4%', top: '10%', bottom: '15%', containLabel: true },
    xAxis: { type: 'category', data: data.map((d: any) => d.month) },
    yAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
    series: [
      {
        name: '完成率',
        type: 'line',
        smooth: true,
        data: data.map((d: any) => d.completion_rate || 0),
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(64,158,255,0.3)' },
          { offset: 1, color: 'rgba(64,158,255,0.05)' }
        ]) },
        lineStyle: { color: '#409EFF', width: 2 },
        itemStyle: { color: '#409EFF' }
      },
      {
        name: '总数',
        type: 'line',
        smooth: true,
        yAxisIndex: 0,
        data: data.map((d: any) => d.total || 0),
        lineStyle: { color: '#67C23A', width: 2 },
        itemStyle: { color: '#67C23A' }
      }
    ]
  })
}

// 更新类型分布图
const updateChart4 = () => {
  if (!chartInstance4) return
  const summary = typeData.value?.summary || []
  chartInstance4.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie',
      radius: ['35%', '65%'],
      center: ['50%', '45%'],
      roseType: 'radius',
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}\n{d}%', fontSize: 11 },
      data: summary.map((s: any, i: number) => ({
        name: s.type === 'video' ? '视频课程' : s.type === 'document' ? '文档课程' : s.type === 'offline' ? '线下培训' : s.type,
        value: s.count || 0,
        itemStyle: { color: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399'][i % 5] }
      }))
    }]
  })
}

// 加载所有数据
const loadData = async () => {
  try {
    const [statsRes, deptRes, complianceRes, trendRes, typeRes, tasksRes] = await Promise.allSettled([
      getTrainingStats(),
      getDeptTrainingStats(),
      getTrainingCompliance(),
      getCompletionTrend({ months: 6 }),
      getTrainingTypeDistribution(),
      getTrainingTasks()
    ])

    if (statsRes.status === 'fulfilled') {
      stats.value = statsRes.value.data || {}
    }
    if (deptRes.status === 'fulfilled') {
      deptStats.value = deptRes.value.data || []
    }
    if (complianceRes.status === 'fulfilled') {
      compliance.value = complianceRes.value.data || {}
    }
    if (trendRes.status === 'fulfilled') {
      trendData.value = trendRes.value.data || []
    }
    if (typeRes.status === 'fulfilled') {
      typeData.value = typeRes.value.data || {}
    }
    if (tasksRes.status === 'fulfilled') {
      tasks.value = tasksRes.value.data || {}
    }
  } catch (e) {
    console.error('加载培训统计数据失败', e)
  }
}

// 窗口变化时重绘图表
const handleResize = () => {
  chartInstance1?.resize()
  chartInstance2?.resize()
  chartInstance3?.resize()
  chartInstance4?.resize()
}

onMounted(async () => {
  await loadData()
  initCharts()
  updateChart1()
  updateChart2()
  updateChart3()
  updateChart4()
  window.addEventListener('resize', handleResize)
})
</script>

<script lang="ts">
import { ElMessage } from 'element-plus'
export default { name: 'TrainingStatistics' }
</script>

<style scoped>
.mb-4 { margin-bottom: 16px; }

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 0;
}
.stat-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}
.stat-icon培训 { color: #409EFF; flex-shrink: 0; }
.stat-icon完成 { color: #67C23A; flex-shrink: 0; }
.stat-icon课程 { color: #E6A23C; flex-shrink: 0; }
.stat-icon合规 { color: #F56C6C; flex-shrink: 0; }
.stat-info { flex: 1; }
.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
}
.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}
</style>
