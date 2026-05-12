<template>
  <div class="safework">
    <!-- ========== H5 移动端主页 ========== -->
    <div v-if="device==='mobile'" class="h5-homepage">
      <!-- 深色头部 -->
      <div class="h5-header">
        <div class="h5-header-top">
          <div>
            <div class="h5-platform-name">化工企业EHS平台</div>
            <div class="h5-header-title">{{ siteName }}</div>
          </div>
          <div class="h5-user-info">
            <div class="h5-user-name">{{ user.nickName }}</div>
            <div class="h5-user-role">安全管理员</div>
          </div>
        </div>
        <!-- 统计指标 -->
        <div class="h5-stats">
          <div class="h5-stat-item">
            <div class="h5-stat-value">{{ kpiStats.pendingApproval }}</div>
            <div class="h5-stat-label">待审批</div>
          </div>
          <div class="h5-stat-item">
            <div class="h5-stat-value red">{{ kpiStats.overdueHazard }}</div>
            <div class="h5-stat-label">超期隐患</div>
          </div>
          <div class="h5-stat-item">
            <div class="h5-stat-value green">{{ kpiStats.closureRate }}</div>
            <div class="h5-stat-label">闭环率</div>
          </div>
        </div>
      </div>

      <!-- 快捷功能 6 宫格 -->
      <div class="h5-section">
        <div class="h5-section-title">快捷功能</div>
        <div class="h5-menu-grid">
          <div v-for="m in quickMenus" :key="m.name" class="h5-menu-item" :class="m.color" @click="handleH5Nav(m.path)">
            <div class="h5-menu-icon">{{ m.icon }}</div>
            <div class="h5-menu-label">{{ m.name }}</div>
          </div>
        </div>
      </div>

      <!-- 我的作业票 -->
      <div class="h5-section">
        <div class="h5-section-header">
          <div class="h5-section-title">我的作业票</div>
          <div class="h5-section-more" @click="handleH5Nav('/SpecialOperation')">查看全部</div>
        </div>
        <div class="h5-card-list">
          <div v-for="w in h5WorkTickets" :key="w.title" class="h5-card-item">
            <div class="h5-card-top">
              <div>
                <div class="h5-card-name">{{ w.title }}</div>
                <div class="h5-card-sub">{{ w.level }}</div>
              </div>
              <div class="h5-card-tag orange">{{ w.status }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 隐患整改 -->
      <div class="h5-section">
        <div class="h5-section-header">
          <div class="h5-section-title">隐患整改</div>
          <div class="h5-section-more" @click="handleH5Nav('/safework')">查看全部</div>
        </div>
        <div class="h5-card-list">
          <div v-for="h in h5Hazards" :key="h.title" class="h5-card-item white">
            <div class="h5-card-name">{{ h.title }}</div>
            <div class="h5-card-meta">
              <div class="h5-card-level" :class="h.level==='重大隐患'?'red':'orange'">{{ h.level }}</div>
              <div class="h5-card-tag blue">{{ h.status }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部Tab -->
      <div class="h5-bottom-tab">
        <div class="h5-tab-item active">
          <div class="h5-tab-icon">🏠</div>
          <div class="h5-tab-label">首页</div>
        </div>
        <div class="h5-tab-item" @click="handleH5Nav('/SpecialOperation')">
          <div class="h5-tab-icon">📋</div>
          <div class="h5-tab-label">流程</div>
        </div>
        <div class="h5-tab-item">
          <div class="h5-tab-icon">🔔</div>
          <div class="h5-tab-label">通知</div>
        </div>
        <div class="h5-tab-item" @click="handleH5Nav('/user/profile')">
          <div class="h5-tab-icon">👤</div>
          <div class="h5-tab-label">我的</div>
        </div>
      </div>
    </div>

    <!-- ========== PC 端 EHS 工业驾驶舱 ========== -->
    <div v-else class="cockpit-dashboard">
      <!-- 顶部系统状态栏 -->
      <div class="cockpit-header">
        <div class="header-left">
          <div class="header-safety-days">
            <span class="safety-icon">🛡️</span>
            <span class="safety-label">已安全运行</span>
            <span class="safety-days">{{ cockpitData.safetyDays }}</span>
            <span class="safety-label">天</span>
          </div>
        </div>
        <div class="header-right">
          <div class="header-time">{{ currentTime }}</div>
          <div class="header-status">
            <span class="status-dot online"></span>
            系统运行正常
          </div>
        </div>
      </div>

      <!-- KPI 卡片行 -->
      <div class="kpi-row">
        <div class="kpi-card card-blue">
          <div class="kpi-icon-wrap">
            <span class="kpi-icon">📋</span>
          </div>
          <div class="kpi-info">
            <div class="kpi-value">{{ cockpitData.todayTickets }}</div>
            <div class="kpi-label">今日作业票</div>
            <div class="kpi-sub">特殊作业管理</div>
          </div>
        </div>
        <div class="kpi-card card-orange">
          <div class="kpi-icon-wrap">
            <span class="kpi-icon">⏳</span>
          </div>
          <div class="kpi-info">
            <div class="kpi-value">{{ cockpitData.pendingTickets }}</div>
            <div class="kpi-label">待审批流程</div>
            <div class="kpi-sub">作业票审批待办</div>
          </div>
        </div>
        <div class="kpi-card card-red">
          <div class="kpi-icon-wrap">
            <span class="kpi-icon">⚠️</span>
          </div>
          <div class="kpi-info">
            <div class="kpi-value">{{ cockpitData.hazardToday }}</div>
            <div class="kpi-label">待整改隐患</div>
            <div class="kpi-sub">隐患整改闭环</div>
          </div>
        </div>
        <div class="kpi-card card-green">
          <div class="kpi-icon-wrap">
            <span class="kpi-icon">📚</span>
          </div>
          <div class="kpi-info">
            <div class="kpi-value">{{ cockpitData.trainingRate }}</div>
            <div class="kpi-label">培训完成率</div>
            <div class="kpi-sub">在线教育培训</div>
          </div>
        </div>
        <div class="kpi-card card-purple">
          <div class="kpi-icon-wrap">
            <span class="kpi-icon">🔔</span>
          </div>
          <div class="kpi-info">
            <div class="kpi-value">{{ cockpitData.overdueCount }}</div>
            <div class="kpi-label">超期任务</div>
            <div class="kpi-sub">需紧急处理</div>
          </div>
        </div>
      </div>

      <!-- 中部双栏：风险趋势图 + 流程待办 -->
      <div class="middle-row">
        <!-- 左侧：风险趋势图 -->
        <div class="panel panel-chart">
          <div class="panel-header">
            <div class="panel-title">
              <span class="panel-icon">📈</span>
              风险趋势分析
            </div>
            <div class="period-switch">
              <button
                v-for="p in periods"
                :key="p.value"
                :class="['period-btn', { active: trendPeriod === p.value }]"
                @click="switchTrendPeriod(p.value)"
              >{{ p.label }}</button>
            </div>
          </div>
          <div class="chart-container" ref="trendChartRef"></div>
        </div>

        <!-- 右侧：实时流程待办 -->
        <div class="panel panel-todo">
          <div class="panel-header">
            <div class="panel-title">
              <span class="panel-icon">🔄</span>
              实时流程待办
            </div>
            <span class="panel-badge">{{ pendingTasksTotal }}</span>
          </div>
          <div class="todo-scroll">
            <!-- 待审批作业票 -->
            <div v-if="pendingTicketList.length > 0" class="todo-group">
              <div class="todo-group-title">待审批作业票</div>
              <div
                v-for="t in pendingTicketList"
                :key="'tk-'+t.id"
                class="todo-item"
                @click="handleSelect('/SpecialOperation')"
              >
                <div class="todo-dot ticket"></div>
                <div class="todo-content">
                  <div class="todo-title">{{ t.type || '作业票审批' }}</div>
                  <div class="todo-meta">{{ t.applicant || '未知申请人' }} · {{ t.no || '' }}</div>
                </div>
                <div class="todo-action">
                  <span class="action-tag pending">待审批</span>
                </div>
              </div>
            </div>

            <!-- 待整改隐患 -->
            <div v-if="pendingHazardList.length > 0" class="todo-group">
              <div class="todo-group-title">待整改隐患</div>
              <div
                v-for="h in pendingHazardList"
                :key="'hz-'+h.id"
                class="todo-item"
                @click="handleSelect('/safework')"
              >
                <div class="todo-dot hazard"></div>
                <div class="todo-content">
                  <div class="todo-title">{{ h.description || '隐患整改' }}</div>
                  <div class="todo-meta">截止: {{ h.deadline || '-' }}</div>
                </div>
                <div class="todo-action">
                  <span class="action-tag warning">{{ levelName(h.level) }}</span>
                </div>
              </div>
            </div>

            <!-- 即将到期的作业票 -->
            <div v-if="upcomingTicketList.length > 0" class="todo-group">
              <div class="todo-group-title">即将到期</div>
              <div
                v-for="u in upcomingTicketList"
                :key="'up-'+u.id"
                class="todo-item"
                @click="handleSelect('/SpecialOperation')"
              >
                <div class="todo-dot upcoming"></div>
                <div class="todo-content">
                  <div class="todo-title">{{ u.type || '作业票到期' }}</div>
                  <div class="todo-meta">{{ u.no || '' }} · {{ u.deadline || '-' }}</div>
                </div>
                <div class="todo-action">
                  <span class="action-tag danger">即将到期</span>
                </div>
              </div>
            </div>

            <!-- 空状态 -->
            <div v-if="pendingTasksTotal === 0" class="todo-empty">
              暂无待办任务 ✨
            </div>
          </div>
        </div>
      </div>

      <!-- 底部：区域风险分布 + 部门排行 -->
      <div class="bottom-row">
        <!-- 区域风险分布 -->
        <div class="panel panel-area">
          <div class="panel-header">
            <div class="panel-title">
              <span class="panel-icon">🏭</span>
              区域风险分布
            </div>
            <div class="area-summary">
              <span class="summary-tag danger">高风险 {{ areaSummary.dangerAreas }}</span>
              <span class="summary-tag warning">中风险 {{ areaSummary.warningAreas }}</span>
              <span class="summary-tag safe">正常 {{ areaSummary.normalAreas }}</span>
            </div>
          </div>
          <div class="area-grid">
            <div
              v-for="area in areaRiskList"
              :key="area.areaName"
              class="area-card"
              :class="'area-'+area.riskLevel"
            >
              <div class="area-header-row">
                <div class="area-name">{{ area.areaName }}</div>
                <div class="area-level-tag" :class="area.riskLevel">
                  {{ area.riskLevel === 'danger' ? '高风险' : area.riskLevel === 'warning' ? '中风险' : '正常' }}
                </div>
              </div>
              <div class="area-stats">
                <div class="area-stat">
                  <div class="area-stat-val danger-val">{{ area.highRisk }}</div>
                  <div class="area-stat-label">重大</div>
                </div>
                <div class="area-stat">
                  <div class="area-stat-val warning-val">{{ area.mediumRisk }}</div>
                  <div class="area-stat-label">较大</div>
                </div>
                <div class="area-stat">
                  <div class="area-stat-val safe-val">{{ area.lowRisk }}</div>
                  <div class="area-stat-label">一般</div>
                </div>
                <div class="area-stat">
                  <div class="area-stat-val">{{ area.resolved }}</div>
                  <div class="area-stat-label">已整改</div>
                </div>
              </div>
              <div class="area-bar-wrap">
                <div class="area-bar">
                  <div class="area-bar-fill danger" :style="{ width: areaPercent(area, 'highRisk') }"></div>
                  <div class="area-bar-fill warning" :style="{ width: areaPercent(area, 'mediumRisk') }"></div>
                  <div class="area-bar-fill safe" :style="{ width: areaPercent(area, 'lowRisk') }"></div>
                  <div class="area-bar-fill done" :style="{ width: areaPercent(area, 'resolved') }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 部门隐患排行 -->
        <div class="panel panel-ranking">
          <div class="panel-header">
            <div class="panel-title">
              <span class="panel-icon">🏆</span>
              部门隐患排行 TOP5
            </div>
          </div>
          <div class="ranking-list">
            <div
              v-for="(dept, idx) in departmentRanking"
              :key="'dept-'+idx"
              class="ranking-item"
            >
              <div class="rank-num" :class="'rank-'+Math.min(idx+1, 4)">{{ idx + 1 }}</div>
              <div class="rank-info">
                <div class="rank-name">{{ dept.name }}</div>
                <div class="rank-bar-wrap">
                  <div class="rank-bar" :style="{ width: deptPercent(dept) }"></div>
                </div>
              </div>
              <div class="rank-value">{{ dept.count }}</div>
            </div>
            <div v-if="departmentRanking.length === 0" class="todo-empty">
              暂无排行数据
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="safeworkindex">
import * as echarts from 'echarts'
import { getUserProfile } from "@/api/system/user"
import { listCard } from "@/api/system/positionCard"
import { constantRoutes } from "@/router"
import { isHttp } from '@/utils/validate'
import { listEnterpriseInformation } from "@/api/system/enterpriseInformation"
import { selectTicketList } from "@/api/safework/allticket"
import { listHazareport } from "@/api/safework/hazareport"
import { getKPI, getTrend, getPendingTasks, getTrainingRate, getAreaRisk, getDepartmentRanking } from "@/api/dashboard"

const store = useStore()
const router = useRouter()

// 设备类型
const device = computed(() => store.state.app.device)
// 站点名称
const siteName = computed(() => store.state.settings.siteName || '安全生产管理系统')
const routers = computed(() => store.state.permission.topbarRouters)

const data = reactive({
  user: { avatar: '', deptName: '', dept: {}, postGroup: null },
  pocard: { tagId: '' },
  queryParams: { pageNum: 1, pageSize: 10, name: null },
  enterpriseInfo: {},
})
const { user, pocard, queryParams, enterpriseInfo } = toRefs(data)

// ===== PC 驾驶舱数据 =====
const cockpitData = reactive({
  safetyDays: 8353,
  todayTickets: 0,
  pendingTickets: 0,
  hazardToday: 0,
  trainingRate: '0%',
  overdueCount: 0,
  completionRate: '0%',
})

const pendingTicketList = ref([])
const pendingHazardList = ref([])
const upcomingTicketList = ref([])
const areaRiskList = ref([])
const areaSummary = reactive({ dangerAreas: 0, warningAreas: 0, normalAreas: 0 })
const departmentRanking = ref([])

const pendingTasksTotal = computed(() =>
  pendingTicketList.value.length + pendingHazardList.value.length + upcomingTicketList.value.length
)

// 风险趋势
const trendPeriod = ref('year')
const periods = [
  { label: '近一周', value: 'week' },
  { label: '近一月', value: 'month' },
  { label: '全年', value: 'year' },
]
const trendChartRef = ref(null)
const trendChartInstance = shallowRef(null)

// Resize 处理器（具名函数，确保可移除）
let resizeHandler = null

// 当前时间
const currentTime = ref('')
let timeTimer = null

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  }) + ' ' + now.toLocaleTimeString('zh-CN', { hour12: false })
}

function levelName(level) {
  const map = { 1: '重大隐患', 2: '较大隐患', 3: '一般隐患' }
  return map[level] || '隐患'
}

function areaPercent(area, field) {
  const total = area.totalHazards || 1
  return ((area[field] || 0) / total * 100).toFixed(1) + '%'
}

function deptPercent(dept) {
  const max = departmentRanking.value[0]?.count || 1
  return ((dept.count / max) * 100).toFixed(1) + '%'
}

// ===== 驾驶舱数据拉取（并行优化）=====
async function fetchCockpitData() {
  try {
    const [kpiRes, trainingRes, pendingRes, areaRes, rankingRes] = await Promise.allSettled([
      getKPI(),
      getTrainingRate(),
      getPendingTasks(),
      getAreaRisk(),
      getDepartmentRanking(),
    ])

    if (kpiRes.status === 'fulfilled') {
      const d = kpiRes.value.data || {}
      cockpitData.safetyDays = d.safetyDays || 8353
      cockpitData.todayTickets = d.todayTickets || 0
      cockpitData.pendingTickets = d.pendingTickets || 0
      cockpitData.hazardToday = d.hazardToday || 0
    } else {
      console.error('[Dashboard] getKPI failed:', kpiRes.reason)
    }

    if (trainingRes.status === 'fulfilled') {
      const d = trainingRes.value.data || {}
      cockpitData.trainingRate = d.trainingRate || '0%'
    } else {
      console.error('[Dashboard] getTrainingRate failed:', trainingRes.reason)
    }

    if (pendingRes.status === 'fulfilled') {
      const d = pendingRes.value.data || {}
      pendingTicketList.value = d.pendingTickets || []
      pendingHazardList.value = d.pendingHazards || []
      upcomingTicketList.value = d.upcomingTickets || []
      cockpitData.overdueCount = upcomingTicketList.value.length
    } else {
      console.error('[Dashboard] getPendingTasks failed:', pendingRes.reason)
    }

    if (areaRes.status === 'fulfilled') {
      const d = areaRes.value.data || {}
      areaRiskList.value = d.areas || []
      const s = d.summary || {}
      areaSummary.dangerAreas = s.dangerAreas || 0
      areaSummary.warningAreas = s.warningAreas || 0
      areaSummary.normalAreas = s.normalAreas || 0
    } else {
      console.error('[Dashboard] getAreaRisk failed:', areaRes.reason)
    }

    if (rankingRes.status === 'fulfilled') {
      const d = rankingRes.value.data || {}
      const names = d.departments || []
      const counts = d.counts || []
      departmentRanking.value = names.slice(0, 5).map((n, i) => ({
        name: n, count: counts[i] || 0,
      }))
    } else {
      console.error('[Dashboard] getDepartmentRanking failed:', rankingRes.reason)
    }
  } catch (err) {
    console.error('[Dashboard] fetchCockpitData error:', err)
  }

  // 趋势图单独请求（依赖 period）
  fetchTrendChart()
}

function fetchTrendChart() {
  getTrend(trendPeriod.value).then(res => {
    const d = res.data || {}
    renderTrendChart(d)
  }).catch(err => {
    console.error('[Dashboard] fetchTrendChart failed:', err)
    // 默认空图
    renderTrendChart({ months: [], major: [], majorRisk: [], general: [] })
  })
}

function switchTrendPeriod(period) {
  trendPeriod.value = period
  fetchTrendChart()
}

function renderTrendChart(data) {
  if (!trendChartRef.value) return

  // 复用 ECharts 实例，避免重复 init/dispose
  if (!trendChartInstance.value) {
    trendChartInstance.value = echarts.init(trendChartRef.value)
  }

  // 移除旧的 resize 监听器（避免内存泄漏）
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }

  trendChartInstance.value.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15,23,42,0.92)',
      borderColor: '#334155',
      textStyle: { color: '#e2e8f0', fontSize: 13 },
    },
    legend: {
      data: ['重大隐患', '较大隐患', '一般隐患'],
      bottom: 0,
      textStyle: { color: '#94a3b8', fontSize: 12 },
    },
    grid: { top: 20, right: 30, bottom: 40, left: 45 },
    xAxis: {
      type: 'category',
      data: data.months || [],
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      axisLabel: { color: '#64748b', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' } },
      axisLabel: { color: '#64748b', fontSize: 11 },
    },
    series: [
      {
        name: '重大隐患',
        type: 'line',
        data: data.major || [],
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 3, color: '#ef4444' },
        itemStyle: { color: '#ef4444' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(239,68,68,0.25)' },
            { offset: 1, color: 'rgba(239,68,68,0.02)' },
          ]),
        },
      },
      {
        name: '较大隐患',
        type: 'line',
        data: data.majorRisk || [],
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 3, color: '#f59e0b' },
        itemStyle: { color: '#f59e0b' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(245,158,11,0.25)' },
            { offset: 1, color: 'rgba(245,158,11,0.02)' },
          ]),
        },
      },
      {
        name: '一般隐患',
        type: 'line',
        data: data.general || [],
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 3, color: '#22c55e' },
        itemStyle: { color: '#22c55e' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(34,197,94,0.25)' },
            { offset: 1, color: 'rgba(34,197,94,0.02)' },
          ]),
        },
      },
    ],
  })

  // 注册具名 resize 处理器（可移除，避免内存泄漏）
  resizeHandler = () => {
    trendChartInstance.value?.resize()
  }
  window.addEventListener('resize', resizeHandler)
}

// ===== KPI 统计 =====
const kpiStats = reactive({
  pendingApproval: 12,
  overdueHazard: 4,
  closureRate: '96%',
  trainingRate: '88%',
})

// ===== H5 快捷菜单 =====
const quickMenus = [
  { name: '作业票', icon: '📝', color: 'bg-orange', path: '/SpecialOperation' },
  { name: '隐患排查', icon: '⚠️', color: 'bg-red', path: '/safework' },
  { name: '教育培训', icon: '📚', color: 'bg-blue', path: '/safework/training' },
  { name: '在线考试', icon: '🧠', color: 'bg-purple', path: '/safework/exam' },
  { name: '电子签章', icon: '✍️', color: 'bg-green', path: '/safework/sign' },
  { name: '责任制', icon: '📄', color: 'bg-yellow', path: '/safework/duty' },
]

const h5WorkTickets = ref([
  { title: '1#罐区动火作业', status: '待安全审批', level: '一级动火' },
  { title: '循环水泵检修', status: '执行中', level: '受限空间' },
])
const h5Hazards = ref([
  { title: '乙烯管线法兰渗漏', level: '重大隐患', status: '整改中' },
  { title: '消防器材缺失', level: '一般隐患', status: '待验收' },
])

function handleH5Nav(path) {
  router.push({ path })
  store.dispatch('app/toggleSideBarHide', true)
}

// ===== 共用逻辑 =====
function getEnterpriseList() {
  listEnterpriseInformation(queryParams.value).then(response => {
    if (response.rows.length > 0) {
      enterpriseInfo.value = response.rows[0]
    }
  })
}

function getUser() {
  getUserProfile().then(response => {
    user.value = response.data
    if (response.postGroup != null && response.postGroup != '') {
      user.value.postGroup = response.postGroup
    }
    if (user.value.staffId != null && user.value.staffId != '') {
      listCard({ staffId: user.value.staffId }).then(res => {
        if (res.rows.length > 0) {
          pocard.value = res.rows[0]
        }
      })
    }
    // 用户加载后拉驾驶舱数据
    fetchCockpitData()
  })
}

// 作业票数据（同步 H5）
function fetchWorkTickets() {
  selectTicketList({ pageNum: 1, pageSize: 5 }).then(response => {
    const rows = response.rows || []
    if (rows.length > 0) {
      const mapped = rows.slice(0, 3).map(r => ({
        no: r.ticketNo || r.code || '-',
        name: r.projectName || r.workContent || r.name || '-',
        type: r.workType || r.type || '特殊作业',
        status: r.statusName || r.auditStatus || r.status || '待审批',
      }))
      h5WorkTickets.value = mapped.map(w => ({
        title: w.name, status: w.status, level: w.type,
      }))
      const pending = rows.filter(r => {
        const s = r.statusName || r.auditStatus || r.status || ''
        return s.includes('待') || s.includes('审批')
      })
      if (pending.length > 0) kpiStats.pendingApproval = pending.length
    }
  }).catch(err => {
    console.error('[Dashboard] fetchWorkTickets failed:', err)
  })
}

function fetchHazards() {
  listHazareport({ pageNum: 1, pageSize: 5 }).then(response => {
    const rows = response.rows || []
    if (rows.length > 0) {
      h5Hazards.value = rows.slice(0, 3).map(r => ({
        title: r.hazardName || r.description || r.title || '-',
        level: r.hazardLevel || r.level || '一般隐患',
        status: r.statusName || r.handleStatus || r.status || '待整改',
      }))
      const overdue = rows.filter(r => {
        const s = r.statusName || r.handleStatus || r.status || ''
        return s.includes('超期') || s.includes('逾期')
      })
      if (overdue.length > 0) kpiStats.overdueHazard = overdue.length
    }
  }).catch(err => {
    console.error('[Dashboard] fetchHazards failed:', err)
  })
}

const childrenMenus = computed(() => {
  const menus = []
  for (const router of routers.value) {
    if (!router.children) continue
    for (const child of router.children) {
      // 不再修改原对象，而是创建新对象（消除副作用）
      const parentPath = router.path === '/' ? '' : router.path
      const childPath = child.path?.startsWith('http')
        ? child.path
        : parentPath + '/' + child.path
      menus.push({
        ...child,
        path: childPath.replace(/\/+/g, '/'),
        parentPath: router.path,
      })
    }
  }
  return [...constantRoutes, ...menus]
})

function handleSelect(key) {
  const route = routers.value.find(item => item.path === key)
  if (isHttp(key)) {
    window.open(key, "_blank")
  } else if (!route || !route.children) {
    router.push({ path: key })
    store.dispatch('app/toggleSideBarHide', true)
  } else {
    activeRoutes(key)
    store.dispatch('app/toggleSideBarHide', false)
  }
}

function activeRoutes(key) {
  let routes = []
  if (childrenMenus.value && childrenMenus.value.length > 0) {
    // 使用 filter 替代 map（map 误用）
    routes = childrenMenus.value.filter(item => {
      return key == item.parentPath || (key == "index" && "" == item.path)
    })
  }
  if (routes.length > 0) {
    store.commit("SET_SIDEBAR_ROUTERS", routes)
  }
  return routes
}

// 生命周期
onMounted(() => {
  updateTime()
  timeTimer = setInterval(updateTime, 1000)

  // 统一在此处初始化数据（避免模块顶层执行导致的时机问题）
  getUser()
  getEnterpriseList()
  fetchWorkTickets()
  fetchHazards()
})

onUnmounted(() => {
  if (timeTimer) clearInterval(timeTimer)
  // 移除 resize 监听器，避免内存泄漏
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }
  if (trendChartInstance.value) {
    trendChartInstance.value.dispose()
    trendChartInstance.value = null
  }
})
</script>

<style scoped lang="scss">
/* ==================== PC 驾驶舱 ==================== */
.cockpit-dashboard {
  padding: 20px 24px;
  background: linear-gradient(180deg, #f0f4f8 0%, #e8edf3 100%);
  min-height: 100%;
  overflow-y: auto;

  // 顶部状态栏
  .cockpit-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .header-left {
      .header-safety-days {
        display: flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, #1e40af, #3b82f6);
        color: #fff;
        padding: 10px 22px;
        border-radius: 12px;
        font-size: 14px;
        box-shadow: 0 4px 14px rgba(30,64,175,0.3);
        .safety-icon { font-size: 22px; }
        .safety-label { opacity: 0.85; }
        .safety-days { font-size: 28px; font-weight: 800; margin: 0 2px; }
      }
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
      .header-time { font-size: 15px; font-weight: 600; color: #334155; }
      .header-status {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: #22c55e;
        .status-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #22c55e;
          animation: pulse 2s infinite;
          &.online { background: #22c55e; }
        }
      }
    }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  // KPI 卡片行
  .kpi-row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 16px;
    margin-bottom: 20px;
  }

  .kpi-card {
    position: relative;
    border-radius: 16px;
    padding: 20px 18px;
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: default;
    transition: all 0.3s ease;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.06);

    &::before {
      content: '';
      position: absolute;
      top: -30px;
      right: -30px;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: rgba(255,255,255,0.15);
    }

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.12);
    }

    .kpi-icon-wrap {
      width: 50px;
      height: 50px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.25);
      flex-shrink: 0;
      .kpi-icon { font-size: 26px; }
    }

    .kpi-info {
      position: relative;
      z-index: 1;
      .kpi-value {
        font-size: 34px;
        font-weight: 800;
        line-height: 1;
        color: #fff;
      }
      .kpi-label {
        font-size: 14px;
        font-weight: 600;
        color: rgba(255,255,255,0.9);
        margin-top: 4px;
      }
      .kpi-sub {
        font-size: 11px;
        color: rgba(255,255,255,0.65);
        margin-top: 2px;
      }
    }

    &.card-blue { background: linear-gradient(135deg, #2563eb, #3b82f6); }
    &.card-orange { background: linear-gradient(135deg, #ea580c, #f97316); }
    &.card-red { background: linear-gradient(135deg, #dc2626, #ef4444); }
    &.card-green { background: linear-gradient(135deg, #16a34a, #22c55e); }
    &.card-purple { background: linear-gradient(135deg, #7c3aed, #a855f7); }
  }

  // 中部双栏
  .middle-row {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }

  // 底部双栏
  .bottom-row {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 16px;
  }

  // 面板通用样式
  .panel {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
    overflow: hidden;

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 18px 20px;
      border-bottom: 1px solid #f1f5f9;

      .panel-title {
        font-size: 16px;
        font-weight: 700;
        color: #1e293b;
        display: flex;
        align-items: center;
        gap: 8px;
        .panel-icon { font-size: 20px; }
      }

      .panel-badge {
        background: #3b82f6;
        color: #fff;
        font-size: 12px;
        font-weight: 700;
        padding: 3px 12px;
        border-radius: 20px;
        min-width: 24px;
        text-align: center;
      }
    }
  }

  // 图表面板
  .panel-chart {
    .period-switch {
      display: flex;
      gap: 4px;
      background: #f1f5f9;
      border-radius: 10px;
      padding: 3px;

      .period-btn {
        border: none;
        background: transparent;
        color: #64748b;
        font-size: 12px;
        font-weight: 500;
        padding: 5px 14px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;

        &.active {
          background: #fff;
          color: #2563eb;
          font-weight: 700;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }
        &:hover:not(.active) { color: #334155; }
      }
    }

    .chart-container {
      height: 340px;
      padding: 12px 4px;
    }
  }

  // 待办面板
  .panel-todo {
    .todo-scroll {
      max-height: 380px;
      overflow-y: auto;
      padding: 12px 16px;

      &::-webkit-scrollbar { width: 4px; }
      &::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 2px;
      }
    }

    .todo-group {
      margin-bottom: 16px;
      &:last-child { margin-bottom: 0; }

      .todo-group-title {
        font-size: 12px;
        font-weight: 700;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 10px;
        padding-left: 2px;
      }
    }

    .todo-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 12px;
      margin-bottom: 6px;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid transparent;

      &:hover {
        background: #f8fafc;
        border-color: #e2e8f0;
      }

      .todo-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex-shrink: 0;
        &.ticket { background: #3b82f6; }
        &.hazard { background: #ef4444; }
        &.upcoming { background: #f59e0b; }
      }

      .todo-content {
        flex: 1;
        min-width: 0;
        .todo-title {
          font-size: 13px;
          font-weight: 600;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .todo-meta {
          font-size: 11px;
          color: #94a3b8;
          margin-top: 2px;
        }
      }

      .todo-action {
        flex-shrink: 0;
        .action-tag {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 20px;
          white-space: nowrap;
          &.pending { background: #dbeafe; color: #1d4ed8; }
          &.warning { background: #fef3c7; color: #d97706; }
          &.danger { background: #fee2e2; color: #dc2626; }
        }
      }
    }

    .todo-empty {
      text-align: center;
      color: #94a3b8;
      font-size: 13px;
      padding: 40px 0;
    }
  }

  // 区域风险面板
  .panel-area {
    .area-summary {
      display: flex;
      gap: 8px;
      .summary-tag {
        font-size: 11px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 8px;
        &.danger { background: #fee2e2; color: #dc2626; }
        &.warning { background: #fef3c7; color: #d97706; }
        &.safe { background: #dcfce7; color: #16a34a; }
      }
    }

    .area-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 12px;
      padding: 16px 20px 20px;
    }

    .area-card {
      border: 2px solid #e2e8f0;
      border-radius: 14px;
      padding: 16px;
      transition: all 0.25s;
      cursor: pointer;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 14px rgba(0,0,0,0.08);
      }

      &.area-danger { border-color: #fecaca; background: #fef2f2; }
      &.area-warning { border-color: #fde68a; background: #fffbeb; }
      &.area-normal { border-color: #bbf7d0; background: #f0fdf4; }

      .area-header-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 14px;
        .area-name {
          font-size: 14px;
          font-weight: 700;
          color: #1e293b;
        }
        .area-level-tag {
          font-size: 11px;
          font-weight: 700;
          padding: 2px 10px;
          border-radius: 6px;
          &.danger { background: #dc2626; color: #fff; }
          &.warning { background: #f59e0b; color: #fff; }
          &.normal { background: #22c55e; color: #fff; }
        }
      }

      .area-stats {
        display: flex;
        gap: 16px;
        margin-bottom: 12px;
        .area-stat {
          text-align: center;
          .area-stat-val {
            font-size: 18px;
            font-weight: 800;
            color: #334155;
            &.danger-val { color: #dc2626; }
            &.warning-val { color: #d97706; }
            &.safe-val { color: #16a34a; }
          }
          .area-stat-label {
            font-size: 10px;
            color: #94a3b8;
            margin-top: 2px;
          }
        }
      }

      .area-bar-wrap {
        .area-bar {
          display: flex;
          height: 6px;
          border-radius: 3px;
          overflow: hidden;
          background: #e2e8f0;
          .area-bar-fill {
            height: 100%;
            transition: width 0.4s ease;
            &.danger { background: #ef4444; }
            &.warning { background: #f59e0b; }
            &.safe { background: #22c55e; }
            &.done { background: #94a3b8; }
          }
        }
      }
    }
  }

  // 部门排行面板
  .panel-ranking {
    .ranking-list {
      padding: 12px 20px 20px;
    }

    .ranking-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 0;
      border-bottom: 1px solid #f1f5f9;
      &:last-child { border-bottom: none; }

      .rank-num {
        width: 28px;
        height: 28px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        font-weight: 800;
        color: #fff;
        flex-shrink: 0;
        &.rank-1 { background: linear-gradient(135deg, #f59e0b, #fbbf24); }
        &.rank-2 { background: linear-gradient(135deg, #94a3b8, #cbd5e1); color: #64748b; }
        &.rank-3 { background: linear-gradient(135deg, #d97706, #f59e0b); }
        &.rank-4 { background: #94a3b8; color: #fff; }
      }

      .rank-info {
        flex: 1;
        min-width: 0;
        .rank-name {
          font-size: 14px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 6px;
        }
        .rank-bar-wrap {
          height: 6px;
          background: #f1f5f9;
          border-radius: 3px;
          overflow: hidden;
          .rank-bar {
            height: 100%;
            border-radius: 3px;
            background: linear-gradient(90deg, #3b82f6, #60a5fa);
            transition: width 0.6s ease;
          }
        }
      }

      .rank-value {
        font-size: 18px;
        font-weight: 800;
        color: #1e293b;
        flex-shrink: 0;
      }
    }
  }
}

// 响应式
@media (max-width: 1400px) {
  .cockpit-dashboard {
    .kpi-row { grid-template-columns: repeat(3, 1fr); }
    .middle-row, .bottom-row { grid-template-columns: 1fr; }
  }
}

@media (max-width: 900px) {
  .cockpit-dashboard {
    .kpi-row { grid-template-columns: repeat(2, 1fr); }
  }
}

/* ==================== H5 移动端（保持不变） ==================== */
.h5-homepage {
  min-height: 100vh;
  min-height: 100dvh;
  background: #f1f5f9;
  padding-bottom: 80px;
}

.h5-header {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
  color: #fff;
  padding: 24px 20px 20px;
  border-radius: 0 0 24px 24px;
}

.h5-header-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.h5-platform-name { font-size: 12px; opacity: 0.7; }
.h5-header-title { font-size: 22px; font-weight: 700; margin-top: 4px; }

.h5-user-info {
  text-align: right;
  .h5-user-name { font-size: 15px; font-weight: 600; }
  .h5-user-role { font-size: 12px; opacity: 0.7; margin-top: 2px; }
}

.h5-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 20px;
}

.h5-stat-item {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(4px);
  border-radius: 16px;
  padding: 14px 12px;
  text-align: center;
}

.h5-stat-value {
  font-size: 24px;
  font-weight: 700;
  &.red { color: #ef4444; }
  &.green { color: #22c55e; }
}

.h5-stat-label { font-size: 11px; opacity: 0.7; margin-top: 4px; }

.h5-section { padding: 0 16px; margin-top: 20px; }

.h5-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.h5-section-title { font-size: 17px; font-weight: 700; color: #1e293b; }
.h5-section-more { font-size: 13px; color: #3b82f6; cursor: pointer; font-weight: 500; }

.h5-menu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.h5-menu-item {
  border-radius: 16px;
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  cursor: pointer;
  transition: transform 0.15s;
  &:active { transform: scale(0.96); }

  &.bg-orange { background: #fff7ed; }
  &.bg-red { background: #fef2f2; }
  &.bg-blue { background: #eff6ff; }
  &.bg-purple { background: #f3e8ff; }
  &.bg-green { background: #dcfce7; }
  &.bg-yellow { background: #fef9c3; }
}

.h5-menu-icon { font-size: 36px; }
.h5-menu-label { font-size: 13px; color: #475569; margin-top: 8px; font-weight: 500; }

.h5-card-list { display: flex; flex-direction: column; gap: 10px; }

.h5-card-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px;
  &.white { background: #fff; }
}

.h5-card-name { font-weight: 600; font-size: 14px; color: #1e293b; }
.h5-card-sub { font-size: 12px; color: #64748b; margin-top: 4px; }

.h5-card-top { display: flex; justify-content: space-between; align-items: flex-start; }
.h5-card-meta { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; }

.h5-card-level {
  font-size: 13px;
  font-weight: 600;
  &.red { color: #dc2626; }
  &.orange { color: #ea580c; }
}

.h5-card-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 12px;
  border-radius: 999px;
  white-space: nowrap;
  &.orange { background: #fff7ed; color: #ea580c; }
  &.blue { background: #dbeafe; color: #1d4ed8; }
}

.h5-bottom-tab {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-around;
  padding: 8px 0 env(safe-area-inset-bottom, 8px);
  z-index: 100;
}

.h5-tab-item {
  text-align: center;
  cursor: pointer;
  color: #94a3b8;
  transition: color 0.2s;
  &.active { color: #3b82f6; }
}

.h5-tab-icon { font-size: 22px; }
.h5-tab-label { font-size: 11px; margin-top: 2px; }
</style>
