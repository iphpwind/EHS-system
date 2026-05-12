<template>
  <div class="monitor-container">
    <h2>系统健康监控</h2>

    <div class="status-cards">
      <div class="card" :class="data.dbStatus === 'normal' ? 'ok' : 'warn'">
        <div class="label">数据库状态</div>
        <div class="value">{{ data.dbStatus === 'normal' ? '正常' : '延迟偏高' }}</div>
        <div class="sub">延迟: {{ data.dbLatency }}</div>
      </div>

      <div class="card ok">
        <div class="label">运行时长</div>
        <div class="value">{{ uptimeDisplay }}</div>
      </div>

      <div class="card" :class="data.activeUsers > 0 ? 'ok' : 'info'">
        <div class="label">活跃用户</div>
        <div class="value">{{ data.activeUsers || 0 }}</div>
      </div>

      <div class="card ok">
        <div class="label">内存占用</div>
        <div class="value">{{ data.memoryUsage }}</div>
      </div>
    </div>

    <div class="status-cards">
      <div class="card info">
        <div class="label">作业票总数</div>
        <div class="value">{{ data.workPermits?.total || 0 }}</div>
        <div class="sub">进行中: {{ data.workPermits?.working || 0 }} | 待审批: {{ (data.workPermits?.pending || 0) + (data.workPermits?.deptApprove || 0) + (data.workPermits?.safetyApprove || 0) }}</div>
      </div>

      <div class="card" :class="(data.hazards?.overdue || 0) > 0 ? 'danger' : 'ok'">
        <div class="label">隐患统计</div>
        <div class="value">未闭环: {{ data.hazards?.open || 0 }}</div>
        <div class="sub">超期: <span style="color:red">{{ data.hazards?.overdue || 0 }}</span></div>
      </div>

      <div class="card info">
        <div class="label">培训记录</div>
        <div class="value">{{ data.trainingTotal || 0 }}</div>
      </div>

      <div class="card" :class="data.last24hErrors > 0 ? 'warn' : 'ok'">
        <div class="label">24h 错误</div>
        <div class="value">{{ data.last24hErrors || 0 }}</div>
      </div>
    </div>

    <div class="info-bar">
      <span>Node {{ data.nodeVersion }}</span>
      <span>|</span>
      <span>环境: {{ data.env }}</span>
      <span>|</span>
      <el-button size="small" @click="refresh" :loading="loading">刷新</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import request from '@/utils/request'

const data = ref({
  dbStatus: 'normal', dbLatency: '0ms', memoryUsage: '0 MB',
  workPermits: {}, hazards: {}, trainingTotal: 0,
  activeUsers: 0, last24hErrors: 0, nodeVersion: '', env: ''
})
const loading = ref(false)
let timer = null

const uptimeDisplay = computed(() => {
  const u = data.value.uptime || 0
  const h = Math.floor(u / 3600)
  const m = Math.floor((u % 3600) / 60)
  return `${h}h ${m}m`
})

async function refresh() {
  loading.value = true
  try {
    const res = await request.get('/system-monitor/health')
    if (res.data) data.value = res.data
  } catch (e) {
    console.error('监控数据获取失败', e)
  }
  loading.value = false
}

onMounted(() => {
  refresh()
  timer = setInterval(refresh, 10000) // 每10秒刷新
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.monitor-container { padding: 20px; }
.status-cards { display: flex; gap: 16px; margin-bottom: 16px; flex-wrap: wrap; }
.card { flex: 1; min-width: 180px; padding: 16px; border-radius: 8px; background: #fff; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
.card.ok { border-left: 4px solid #67c23a; }
.card.warn { border-left: 4px solid #e6a23c; }
.card.danger { border-left: 4px solid #f56c6c; }
.card.info { border-left: 4px solid #409eff; }
.label { font-size: 13px; color: #909399; margin-bottom: 8px; }
.value { font-size: 24px; font-weight: bold; color: #303133; }
.sub { font-size: 12px; color: #909399; margin-top: 4px; }
.info-bar { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: #f5f7fa; border-radius: 8px; font-size: 13px; color: #606266; }
</style>
