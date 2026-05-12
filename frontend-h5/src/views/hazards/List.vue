<template>
  <div class="page">
    <van-nav-bar title="隐患管理" left-arrow @click-left="$router.back()" fixed />
    <div class="content">
      <!-- 搜索栏 -->
      <van-search v-model="keyword" placeholder="搜索隐患描述" @search="onSearch" />

      <!-- 筛选 -->
      <div class="filter-row">
        <van-dropdown-menu>
          <van-dropdown-item v-model="filterLevel" :options="levelOptions" @change="onFilterChange" />
          <van-dropdown-item v-model="filterStatus" :options="statusOptions" @change="onFilterChange" />
        </van-dropdown-menu>
        <van-button type="primary" size="small" icon="plus" @click="$router.push('/hazard/report')">上报</van-button>
      </div>

      <!-- 列表 -->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list v-model:loading="loading" :finished="finished" @load="onLoad">
          <van-swipe-cell v-for="item in list" :key="item.id">
            <van-cell :title="item.hazard_description" :label="`位置: ${item.location || '-'} | ${item.created_at || ''}`" is-link @click="$router.push('/hazard/detail/' + item.id)">
              <template #right-icon>
                <van-tag :type="getLevelType(item.hazard_level)">{{ getLevelText(item.hazard_level) }}</van-tag>
              </template>
            </van-cell>
            <template #right>
              <van-button square type="danger" text="删除" @click="doDelete(item.id)" />
            </template>
          </van-swipe-cell>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 删除确认 -->
    <van-dialog v-model:show="showDelete" title="确认删除" :message="'确定删除隐患 ' + deleteId + ' 吗？'" show-cancel-button @confirm="confirmDelete" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getHazardList, deleteHazard } from '../../api/hazards'

const router = useRouter()
const list = ref([])
const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const page = ref(1)
const keyword = ref('')
const filterLevel = ref('')
const filterStatus = ref('')
const showDelete = ref(false)
const deleteId = ref(null)

const levelOptions = [
  { text: '全部等级', value: '' },
  { text: '重大隐患', value: 'major' },
  { text: '较大隐患', value: 'major' },
  { text: '一般隐患', value: 'general' },
  { text: '低风险', value: 'low' }
]

const statusOptions = [
  { text: '全部状态', value: '' },
  { text: '待整改', value: 1 },
  { text: '已整改待验收', value: 2 },
  { text: '已验收', value: 3 }
]

function getLevelType(level) {
  if (level === 'major') return 'danger'
  if (level === 'general') return 'warning'
  return 'primary'
}

function getLevelText(level) {
  if (level === 'major') return '重大'
  if (level === 'general') return '一般'
  return '低风险'
}

function onLoad() {
  const params = { page: page.value, pageSize: 15 }
  if (keyword.value) params.keyword = keyword.value
  if (filterLevel.value) params.level = filterLevel.value
  if (filterStatus.value !== '') params.status = filterStatus.value

  getHazardList(params).then(res => {
    const data = res.data
    const rows = data.list || data || []
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
  finished.value = false
  page.value = 1
  onLoad()
}

function onSearch() {
  page.value = 1
  list.value = []
  finished.value = false
  onLoad()
}

function onFilterChange() {
  page.value = 1
  list.value = []
  finished.value = false
  onLoad()
}

function doDelete(id) {
  deleteId.value = id
  showDelete.value = true
}

function confirmDelete() {
  deleteHazard(deleteId.value).then(() => {
    showToast('删除成功')
    list.value = list.value.filter(i => i.id !== deleteId.value)
  }).catch(err => {
    showToast(err.message || '删除失败')
  })
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
.filter-row { display: flex; align-items: center; background: #fff; padding-right: 10px; }
.filter-row .van-dropdown-menu { flex: 1; }
</style>
