<template>
  <div class="page">
    <van-nav-bar title="应急管理" left-arrow @click-left="$router.back()" fixed />
    <div class="content">
      <!-- 分类切换 -->
      <van-tabs v-model:active="activeTab" sticky>
        <van-tab title="应急物资" />
        <van-tab title="通讯录" />
        <van-tab title="法律法规" />
        <van-tab title="隐患举报" />
      </van-tabs>

      <!-- 应急物资 -->
      <template v-if="activeTab === 0">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list v-model:loading="loading" :finished="finished" @load="loadSupplies">
            <van-cell v-for="item in supplies" :key="item.id" :title="item.name" :label="'库存: ' + (item.quantity || item.stock || '-') + ' | ' + (item.location || '-')" />
          </van-list>
        </van-pull-refresh>
      </template>

      <!-- 通讯录 -->
      <template v-if="activeTab === 1">
        <van-pull-refresh v-model="refreshing2" @refresh="onRefresh2">
          <van-list v-model:loading="loading2" :finished="finished2" @load="loadContacts">
            <van-cell v-for="item in contacts" :key="item.id" :title="item.name" :label="item.phone || item.mobile || '-'">
              <template v-if="item.phone || item.mobile" #right-icon>
                <a :href="'tel:' + (item.phone || item.mobile)" style="color:#1989fa">拨打</a>
              </template>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </template>

      <!-- 法律法规 -->
      <template v-if="activeTab === 2">
        <van-pull-refresh v-model="refreshing3" @refresh="onRefresh3">
          <van-list v-model:loading="loading3" :finished="finished3" @load="loadLaws">
            <van-cell v-for="item in laws" :key="item.id" :title="item.title || item.name" :label="item.publish_date || '-'" is-link />
          </van-list>
        </van-pull-refresh>
      </template>

      <!-- 隐患举报 -->
      <template v-if="activeTab === 3">
        <van-pull-refresh v-model="refreshing4" @refresh="onRefresh4">
          <van-list v-model:loading="loading4" :finished="finished4" @load="loadReports">
            <van-cell v-for="item in reports" :key="item.id" :title="item.description || item.content || '-'" :label="item.created_at || '-'" />
          </van-list>
        </van-pull-refresh>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getSuppliesList, getContactsList, getLawList, getHazardReportList } from '../api/emergency'

const router = useRouter()
const activeTab = ref(0)
const supplies = ref([])
const contacts = ref([])
const laws = ref([])
const reports = ref([])

const loading = ref(false), finished = ref(false), refreshing = ref(false), page1 = ref(1)
const loading2 = ref(false), finished2 = ref(false), refreshing2 = ref(false), page2 = ref(1)
const loading3 = ref(false), finished3 = ref(false), refreshing3 = ref(false), page3 = ref(1)
const loading4 = ref(false), finished4 = ref(false), refreshing4 = ref(false), page4 = ref(1)

const pageSize = 20

function loadSupplies() {
  getSuppliesList({ page: page1.value, pageSize }).then(res => {
    const rows = res.data?.list || res.data || []
    if (refreshing.value) { supplies.value = rows; refreshing.value = false }
    else supplies.value.push(...rows)
    loading.value = false; page1.value++
    if (rows.length < pageSize) finished.value = true
  }).catch(() => { loading.value = false; finished.value = true })
}

function loadContacts() {
  getContactsList({ page: page2.value, pageSize }).then(res => {
    const rows = res.data?.list || res.data || []
    if (refreshing2.value) { contacts.value = rows; refreshing2.value = false }
    else contacts.value.push(...rows)
    loading2.value = false; page2.value++
    if (rows.length < pageSize) finished2.value = true
  }).catch(() => { loading2.value = false; finished2.value = true })
}

function loadLaws() {
  getLawList({ page: page3.value, pageSize }).then(res => {
    const rows = res.data?.list || res.data || []
    if (refreshing3.value) { laws.value = rows; refreshing3.value = false }
    else laws.value.push(...rows)
    loading3.value = false; page3.value++
    if (rows.length < pageSize) finished3.value = true
  }).catch(() => { loading3.value = false; finished3.value = true })
}

function loadReports() {
  getHazardReportList({ page: page4.value, pageSize }).then(res => {
    const rows = res.data?.list || res.data || []
    if (refreshing4.value) { reports.value = rows; refreshing4.value = false }
    else reports.value.push(...rows)
    loading4.value = false; page4.value++
    if (rows.length < pageSize) finished4.value = true
  }).catch(() => { loading4.value = false; finished4.value = true })
}

function onRefresh() { page1.value = 1; finished.value = false; loadSupplies() }
function onRefresh2() { page2.value = 1; finished2.value = false; loadContacts() }
function onRefresh3() { page3.value = 1; finished3.value = false; loadLaws() }
function onRefresh4() { page4.value = 1; finished4.value = false; loadReports() }

watch(activeTab, (tab) => {
  if (tab === 0 && supplies.value.length === 0) loadSupplies()
  if (tab === 1 && contacts.value.length === 0) loadContacts()
  if (tab === 2 && laws.value.length === 0) loadLaws()
  if (tab === 3 && reports.value.length === 0) loadReports()
})

onMounted(() => {
  if (!localStorage.getItem('token')) { router.push('/login') }
  else { loadSupplies() }
})
</script>

<style scoped>
.content { padding: 56px 0 20px; }
</style>
