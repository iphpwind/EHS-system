<template>
  <div class="page">
    <van-nav-bar :title="ticketTypeNames[activeTab] + '列表'" left-arrow @click-left="$router.back()" fixed />

    <div class="content">
      <!-- 类型切换 -->
      <van-tabs v-model:active="activeTab" @change="onTabChange" sticky>
        <van-tab v-for="(name, key) in ticketTypeNames" :key="key" :title="name" />
      </van-tabs>

      <!-- 列表 -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model:loading="loading" :finished="finished" @load="onLoad">
          <van-cell v-for="item in list" :key="item.id" :title="item.ticket_no || item.project_name" :label="item.applicant_name + ' | ' + item.created_at" is-link @click="goDetail(item.id)">
            <template #right-icon>
              <van-tag :type="getTagType(item.status)">{{ getStatusText(item.status) }}</van-tag>
            </template>
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTicketList, ticketTypeNames } from '../api/workticket'

const route = useRoute()
const router = useRouter()
const activeTab = ref(route.query.tab || 'hot')
const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const page = ref(1)

function getStatusText(s) {
  const map = { '1': '草稿', '2': '待审批', '4': '已批准', '5': '作业中', '6': '已完成', '7': '已关闭' }
  return map[String(s)] || String(s)
}

function getTagType(s) {
  if (String(s) === '4' || String(s) === '6' || String(s) === '7') return 'success'
  if (String(s) === '1') return 'default'
  return 'warning'
}

function goDetail(id) {
  router.push('/workticket/detail/' + id + '?type=' + activeTab.value)
}

function onLoad() {
  getTicketList(activeTab.value, { pageNum: page.value, pageSize: 15 }).then(res => {
    const rows = res.data?.list || res.data || res.rows || []
    if (refreshing.value) {
      list.value = rows
      refreshing.value = false
    } else {
      list.value.push(...rows)
    }
    loading.value = false
    if (rows.length < 15) finished.value = true
    page.value++
  }).catch(() => { loading.value = false; finished.value = true })
}

function onRefresh() {
  page.value = 1
  finished.value = false
  onLoad()
}

function onTabChange() {
  page.value = 1
  list.value = []
  finished.value = false
  onLoad()
}

onMounted(() => {
  if (!localStorage.getItem('token')) {
    router.push('/login')
  } else {
    onLoad()
  }
})
</script>

<style scoped>
.content { padding: 56px 0 20px; }
</style>
