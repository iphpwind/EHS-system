<template>
  <div class="home">
    <van-nav-bar title="安全生产移动作业" fixed>
      <template #right>
        <van-icon name="setting-o" size="20" @click="doLogout" />
      </template>
    </van-nav-bar>

    <div class="content">
      <!-- KPI 卡片 -->
      <div class="kpi-row">
        <div class="kpi-item blue">
          <div class="kpi-num">{{ kpi.todayTickets }}</div>
          <div class="kpi-label">今日作业票</div>
        </div>
        <div class="kpi-item orange">
          <div class="kpi-num">{{ kpi.pendingApprovals }}</div>
          <div class="kpi-label">待审批</div>
        </div>
        <div class="kpi-item red">
          <div class="kpi-num">{{ kpi.pendingHazards }}</div>
          <div class="kpi-label">待整改隐患</div>
        </div>
        <div class="kpi-item green">
          <div class="kpi-num">{{ kpi.trainingRate }}</div>
          <div class="kpi-label">培训完成率</div>
        </div>
      </div>

      <!-- 快捷入口 -->
      <van-grid :column-num="4" :gutter="8">
        <van-grid-item icon="fire-o" text="动火作业" @click="$router.push('/workticket/list?tab=hot')" />
        <van-grid-item icon="enlarge-o" text="受限空间" @click="$router.push('/workticket/list?tab=confined')" />
        <van-grid-item icon="upgrade-o" text="高处作业" @click="$router.push('/workticket/list?tab=high')" />
        <van-grid-item icon="gem-o" text="吊装作业" @click="$router.push('/workticket/list?tab=hoisting')" />
        <van-grid-item icon="flag-o" text="动土作业" @click="$router.push('/workticket/list?tab=earth')" />
        <van-grid-item icon="warning-o" text="断路作业" @click="$router.push('/workticket/list?tab=road')" />
        <van-grid-item icon="shield-o" text="盲板抽堵" @click="$router.push('/workticket/list?tab=blind')" />
        <van-grid-item icon="description-o" text="作业申请" @click="$router.push('/workticket/apply')" />
      </van-grid>

      <van-divider>安全管理</van-divider>
      <van-grid :column-num="4" :gutter="8">
        <van-grid-item icon="alarm-o" text="隐患列表" @click="$router.push('/hazards/list')" />
        <van-grid-item icon="add-o" text="隐患上报" @click="$router.push('/hazard/report')" />
        <van-grid-item icon="balance-o" text="应急管理" @click="$router.push('/emergency')" />
        <van-grid-item icon="records-o" text="全部作业票" @click="$router.push('/workticket/list?tab=hot')" />
      </van-grid>

      <van-divider>培训中心</van-divider>
      <van-grid :column-num="3" :gutter="8">
        <van-grid-item icon="video-o" text="在线学习" @click="$router.push('/training/certificates')" />
        <van-grid-item icon="question-o" text="在线考试" @click="$router.push('/training/certificates')" />
        <van-grid-item icon="award-o" text="我的证书" @click="$router.push('/training/certificates')" />
      </van-grid>

      <!-- 流程待办 -->
      <van-divider>流程待办</van-divider>
      <van-cell v-if="pendingTasks.length === 0" title="暂无待办任务" />
      <van-cell v-for="(task, i) in pendingTasks" :key="i" :title="task.title" :label="task.time" is-link :to="task.link">
        <template #icon>
          <van-icon :name="task.icon || 'points-o'" size="18" style="margin-right:8px" />
        </template>
      </van-cell>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { logout } from '../api/auth'
import { getKPI, getPendingTasks } from '../api/dashboard'

const router = useRouter()
const kpi = ref({
  todayTickets: 0,
  pendingApprovals: 0,
  pendingHazards: 0,
  trainingRate: '0%'
})
const pendingTasks = ref([])

// 加载 KPI 数据
async function loadKPI() {
  try {
    const res = await getKPI()
    const data = res.data || res || {}
    kpi.value = {
      todayTickets: data.todayTickets || data.today_tickets || 0,
      pendingApprovals: data.pendingApprovals || data.pending_approvals || 0,
      pendingHazards: data.pendingHazards || data.pending_hazards || 0,
      trainingRate: data.trainingRate || data.training_rate || '0%'
    }
  } catch (e) {
    console.log('KPI 加载失败', e)
    // 401 等认证失败，清除 token 并跳转登录
    if (e && (e.response?.status === 401 || e.message?.includes('401') || e.message?.includes('登录已过期'))) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      router.push('/login')
      return
    }
  }
}

// 加载待办任务
async function loadPendingTasks() {
  try {
    const res = await getPendingTasks()
    const data = res.data || res || {}
    const tasks = []
    // 待审批作业票
    if (data.pendingTickets) {
      data.pendingTickets.forEach(t => {
        tasks.push({ title: '作业审批: ' + t.no, time: t.time || '', icon: 'fire-o', link: '/workticket/detail/' + t.id })
      })
    }
    // 待整改隐患
    if (data.pendingHazards) {
      data.pendingHazards.forEach(h => {
        tasks.push({ title: '隐患整改: ' + h.description, time: h.deadline || '', icon: 'alarm-o', link: '/hazard/detail/' + h.id })
      })
    }
    // 即将到期
    if (data.upcomingTickets) {
      data.upcomingTickets.forEach(u => {
        tasks.push({ title: '即将到期: ' + u.no, time: u.deadline || '', icon: 'clock-o', link: '/workticket/detail/' + u.id })
      })
    }
    pendingTasks.value = tasks.slice(0, 10)
  } catch (e) {
    console.log('待办加载失败', e)
    // 401 等认证失败，清除 token 并跳转登录
    if (e && (e.response?.status === 401 || e.message?.includes('401') || e.message?.includes('登录已过期'))) {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      router.push('/login')
    }
  }
}

function doLogout() {
  showDialog({ title: '退出登录', message: '确认退出当前账号？' }).then(() => {
    logout().then(() => {
      router.push('/login')
    })
  })
}

onMounted(() => {
  if (!localStorage.getItem('token')) {
    router.push('/login')
  } else {
    loadKPI()
    loadPendingTasks()
  }
})
</script>

<style scoped>
.content { padding: 56px 0 20px; }

.kpi-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 12px 10px;
}
.kpi-item {
  border-radius: 10px;
  padding: 14px 10px;
  text-align: center;
  color: #fff;
}
.kpi-item.blue { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.kpi-item.orange { background: linear-gradient(135deg, #f97316, #ea580c); }
.kpi-item.red { background: linear-gradient(135deg, #ef4444, #dc2626); }
.kpi-item.green { background: linear-gradient(135deg, #22c55e, #16a34a); }
.kpi-num { font-size: 24px; font-weight: bold; line-height: 1.4; }
.kpi-label { font-size: 12px; opacity: 0.85; }
</style>
