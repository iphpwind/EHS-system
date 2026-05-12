<template>
  <div class="cert-page">
    <van-nav-bar title="我的证书" left-arrow @click-left="$router.back()" />

    <div class="cert-stats" v-if="stats">
      <div class="stat-item">
        <div class="stat-val green">{{ stats.valid }}</div>
        <div class="stat-label">有效证书</div>
      </div>
      <div class="stat-item">
        <div class="stat-val yellow">{{ stats.expiringSoon }}</div>
        <div class="stat-label">即将到期</div>
      </div>
      <div class="stat-item">
        <div class="stat-val red">{{ stats.expired }}</div>
        <div class="stat-label">已过期</div>
      </div>
    </div>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model:loading="loading" :finished="finished" @load="onLoad">
        <div class="cert-card" v-for="cert in list" :key="cert.id" @click="showDetail(cert)">
          <div class="cert-top">
            <div class="cert-name">{{ cert.cert_name || cert.cert_type_name || '证书' }}</div>
            <van-tag
              :type="getWarnLevel(cert) === 'urgent' ? 'danger' : getWarnLevel(cert) === 'warning' ? 'warning' : 'success'"
              size="medium"
            >
              {{ getWarnLabel(cert) }}
            </van-tag>
          </div>
          <div class="cert-meta">
            <span>编号：{{ cert.cert_no }}</span>
            <span>发证：{{ cert.issue_date }}</span>
            <span>到期：{{ cert.expire_date }}</span>
          </div>
          <div class="cert-progress" v-if="getWarnLevel(cert) !== 'success'">
            <van-progress
              :percentage="getExpiryPercent(cert)"
              :stroke-color="getWarnLevel(cert) === 'urgent' ? '#ee0a24' : '#ff976a'"
            />
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <!-- 证书详情弹窗 -->
    <van-popup v-model:show="showPopup" round position="bottom" :style="{ height: '50%' }">
      <div class="detail-pop" v-if="detailCert">
        <div class="detail-title">{{ detailCert.cert_name || '证书详情' }}</div>
        <van-cell-group inset>
          <van-cell title="证书编号" :value="detailCert.cert_no" />
          <van-cell title="证书类型" :value="detailCert.cert_type_name || '-'" />
          <van-cell title="发证日期" :value="detailCert.issue_date" />
          <van-cell title="到期日期" :value="detailCert.expire_date" />
          <van-cell title="发证机关" :value="detailCert.issue_authority || '-'" />
          <van-cell title="状态">
            <template #value>
              <van-tag :type="getWarnLevel(detailCert) === 'urgent' ? 'danger' : getWarnLevel(detailCert) === 'warning' ? 'warning' : 'success'">
                {{ getWarnLabel(detailCert) }}
              </van-tag>
            </template>
          </van-cell>
        </van-cell-group>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { showToast } from 'vant'
import request from '../../api/request'

const list = ref([])
const stats = ref(null)
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const page = ref(1)
const showPopup = ref(false)
const detailCert = ref(null)

function getWarnLevel(cert) {
  const days = cert.days_remaining
  if (days === undefined || days === null) {
    if (cert.status === 1 && cert.expire_date) {
      const diff = Math.floor((new Date(cert.expire_date) - new Date()) / 86400000)
      if (diff <= 0) return 'urgent'
      if (diff <= 30) return 'urgent'
      if (diff <= 60) return 'warning'
      if (diff <= 90) return 'notice'
      return 'success'
    }
    return 'success'
  }
  if (days <= 30) return 'urgent'
  if (days <= 60) return 'warning'
  if (days <= 90) return 'notice'
  return 'success'
}

function getWarnLabel(cert) {
  const level = getWarnLevel(cert)
  if (level === 'urgent') return '🔴 紧急续期'
  if (level === 'warning') return '🟡 即将到期'
  if (level === 'notice') return '🟢 正常'
  return '🟢 有效'
}

function getExpiryPercent(cert) {
  const days = cert.days_remaining || 90
  return Math.max(0, Math.min(100, (days / 90) * 100))
}

function onLoad() {
  request.get('/training-v2/certificates', { params: { page: page.value, pageSize: 20 } }).then(res => {
    const data = res.data || {}
    const rows = data.list || []
    if (refreshing.value) { list.value = rows; refreshing.value = false } else { list.value.push(...rows) }
    loading.value = false
    if (rows.length < 20) finished.value = true
    page.value++
  }).catch(() => { loading.value = false; finished.value = true })
}

function onRefresh() {
  finished.value = false
  page.value = 1
  onLoad()
  loadStats()
}

function showDetail(cert) {
  detailCert.value = cert
  showPopup.value = true
}

async function loadStats() {
  try {
    const res = await request.get('/training-v2/certificates/stats')
    stats.value = res.data || res
  } catch { /* ignore */ }
}

onMounted(() => {
  onLoad()
  loadStats()
})
</script>

<style scoped>
.cert-stats { display: flex; padding: 16px; gap: 10px; }
.stat-item { flex: 1; text-align: center; background: #fff; border-radius: 12px; padding: 14px 8px; }
.stat-val { font-size: 28px; font-weight: 700; }
.stat-val.green { color: #07c160; }
.stat-val.yellow { color: #ff976a; }
.stat-val.red { color: #ee0a24; }
.stat-label { font-size: 12px; color: #999; margin-top: 4px; }
.cert-card { background: #fff; border-radius: 12px; padding: 16px; margin: 0 12px 10px; }
.cert-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.cert-name { font-size: 16px; font-weight: 600; }
.cert-meta { display: flex; flex-wrap: wrap; gap: 10px; font-size: 13px; color: #666; margin-bottom: 8px; }
.cert-progress { margin-top: 10px; }
.detail-pop { padding: 20px 0; }
.detail-title { font-size: 18px; font-weight: 700; text-align: center; margin-bottom: 16px; }
</style>
