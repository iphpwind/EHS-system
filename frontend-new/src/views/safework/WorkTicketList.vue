<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="票号" prop="keyword">
        <el-input v-model="queryParams.keyword" placeholder="票号/区域" clearable @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="全部状态" clearable>
          <el-option label="草稿" value="1" />
          <el-option label="已提交" value="2" />
          <el-option label="部门审批通过" value="3" />
          <el-option label="安全审批通过" value="4" />
          <el-option label="已批准" value="5" />
          <el-option label="作业中" value="6" />
          <el-option label="待验收" value="7" />
          <el-option label="已关闭" value="8" />
        </el-select>
      </el-form-item>
      <!-- 动火特有 -->
      <el-form-item v-if="ticketType === 'firework'" label="动火等级" prop="fireLevel">
        <el-select v-model="queryParams.fireLevel" placeholder="等级" clearable>
          <el-option label="特级" :value="1" />
          <el-option label="一级" :value="2" />
          <el-option label="二级" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="日期" prop="dateRange">
        <el-date-picker
          v-model="queryParams.dateRange"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          style="width:240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        <el-button type="success" icon="Plus" @click="handleAdd">新增</el-button>
        <el-button :icon="showSearch ? 'ArrowUp' : 'ArrowDown'" @click="showSearch = !showSearch">
          {{ showSearch ? '收起' : '展开' }}
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 统计卡片 -->
    <el-row :gutter="16" class="mb-4" v-if="stats">
      <el-col :span="3" v-for="s in statCards" :key="s.label">
        <div class="stat-card" :class="s.color">
          <div class="stat-num">{{ s.value }}</div>
          <div class="stat-label">{{ s.label }}</div>
        </div>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange" border stripe>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="票号" align="center" prop="ticket_no" width="180" fixed="left" />
      <el-table-column label="申请人" align="center" prop="applicant_name" width="100" />
      <el-table-column label="部门" align="center" prop="dept_name" width="120" />
      <!-- 动火等级列 -->
      <el-table-column v-if="ticketType === 'firework'" label="动火等级" align="center" width="90">
        <template #default="{ row }">
          <el-tag :type="row.fire_level===1?'danger':row.fire_level===2?'warning':'success'" size="small">
            {{ row.fireLevelText }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="作业地点" align="center" prop="work_location" show-overflow-tooltip />
      <el-table-column label="计划时间" align="center" width="220">
        <template #default="{ row }">
          {{ parseTime(row.start_time, '{y}-{m}-{d}') }} ~ {{ parseTime(row.end_time, '{y}-{m}-{d}') }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="110">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.main_status || row.status)" size="small">
            {{ row.statusText || statusText(row.main_status || row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="160">
        <template #default="{ row }">{{ parseTime(row.created_at || row.createTime) }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="360" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" icon="View" @click="handleDetail(row)">详情</el-button>
          <el-button link type="success" icon="Check" v-if="canApprove(row)" @click="handleApprove(row)">审批</el-button>
          <el-button link type="warning" icon="Edit" v-if="canEdit(row)" @click="handleUpdate(row)">编辑</el-button>
          <el-button link type="danger" icon="Delete" v-if="canDelete(row)" @click="handleDelete(row)">删除</el-button>
          <el-button link type="info" icon="Download" @click="handleExport(row)">PDF</el-button>
          <el-dropdown @command="(cmd: string) => handleMore(cmd, row)" class="ml-2">
            <el-button link type="primary" icon="MoreFilled" />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="submit" v-if="canSubmit(row)">提交审批</el-dropdown-item>
                <el-dropdown-item command="start" v-if="canStart(row)">开始作业</el-dropdown-item>
                <el-dropdown-item command="finish" v-if="canFinish(row)">完成作业</el-dropdown-item>
                <el-dropdown-item command="close" v-if="canClose(row)">验收关闭</el-dropdown-item>
                <el-dropdown-item command="cancel" v-if="canCancel(row)" divided>作废</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 审批弹窗 -->
    <el-dialog title="审批操作" v-model="approveOpen" width="500px" append-to-body>
      <el-form :model="approveForm" label-width="80px">
        <el-form-item label="操作">
          <el-radio-group v-model="approveForm.action">
            <el-radio-button value="dept">部门审批</el-radio-button>
            <el-radio-button value="safety">安全审批</el-radio-button>
            <el-radio-button value="final">最终批准</el-radio-button>
            <el-radio-button value="reject">驳回</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="意见">
          <el-input v-model="approveForm.comment" type="textarea" :rows="3" placeholder="请输入审批意见" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitApprove">确 定</el-button>
        <el-button @click="approveOpen = false">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { parseTime } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()

// 从路由获取作业类型
const ticketType = computed(() => route.path.includes('firework') ? 'firework'
  : route.path.includes('restricted') ? 'restricted'
  : route.path.includes('highwork') ? 'highwork'
  : route.path.includes('hoisting') ? 'hoistingwork'
  : route.path.includes('earth') ? 'earth'
  : route.path.includes('broken') ? 'broken'
  : route.path.includes('blind') ? 'blind'
  : route.path.includes('electricwork') ? 'electricwork'
  : 'firework')

const ticketTypeLabel = computed(() => {
  const map: Record<string, string> = { firework: '动火', restricted: '受限空间', highwork: '高处', hoistingwork: '吊装', earth: '动土', broken: '断路', blind: '盲板抽堵', electricwork: '临时用电' }
  return map[ticketType.value] || ticketType.value
})

// ============ 状态 ============
const loading = ref(false)
const showSearch = ref(true)
const list = ref<any[]>([])
const total = ref(0)
const approveOpen = ref(false)
const approveRow = ref<any>(null)

const queryParams = reactive<any>({
  pageNum: 1,
  pageSize: 10,
  keyword: '',
  status: undefined,
  fireLevel: undefined,
  dateRange: []
})

const approveForm = reactive({ action: 'dept', comment: '' })

const stats = ref<any>(null)

const statCards = computed(() => [
  { label: '草稿', value: stats.value?.draft || 0, color: 'color-info' },
  { label: '审批中', value: stats.value?.approving || 0, color: 'color-warning' },
  { label: '作业中', value: stats.value?.executing || 0, color: 'color-primary' },
  { label: '待验收', value: stats.value?.pendingAccept || 0, color: 'color-warning' },
  { label: '已关闭', value: stats.value?.closed || 0, color: 'color-success' },
  { label: '本月', value: stats.value?.thisMonth || 0, color: 'color-primary' },
  { label: '本月关闭', value: stats.value?.thisMonthClosed || 0, color: 'color-success' },
  { label: '总数', value: stats.value?.total || 0, color: 'color-danger' }
])

// ============ 工具方法 ============
const statusTagType = (s: any) => {
  const map: Record<string, string> = { '1': 'info', '2': '', '3': 'primary', '4': 'primary', '5': 'success', '6': 'warning', '7': 'warning', '8': 'danger' }
  return map[String(s)] || 'info'
}

const statusText = (s: any) => {
  const map: Record<string, string> = { '1': '草稿', '2': '已提交', '3': '部门审批通过', '4': '安全审批通过', '5': '已批准', '6': '作业中', '7': '待验收', '8': '已关闭' }
  return map[String(s)] || String(s)
}

const canEdit = (row: any) => {
  const s = String(row.main_status || row.status)
  return s === '1' || s === 'draft'
}

const canDelete = (row: any) => {
  const s = String(row.main_status || row.status)
  return s === '1' || s === 'draft'
}

const canApprove = (row: any) => {
  const s = String(row.main_status || row.status)
  return ['2', '3', '4', '5'].includes(s)
}

const canSubmit = (row: any) => {
  const s = String(row.main_status || row.status)
  return s === '1' || s === 'draft'
}

const canStart = (row: any) => {
  const s = String(row.main_status || row.status)
  return s === '5' || s === 'approved'
}

const canFinish = (row: any) => {
  const s = String(row.main_status || row.status)
  return s === '6' || s === 'executing'
}

const canClose = (row: any) => {
  const s = String(row.main_status || row.status)
  return s === '7' || s === 'completed'
}

const canCancel = (row: any) => {
  const s = String(row.main_status || row.status)
  return !['7', '8', 'completed', 'closed'].includes(s)
}

// ============ API 加载器 ============
const loadApi = async () => {
  try {
    const type = ticketType.value
    // 根据类型加载对应API
    if (type === 'firework') return await import('@/api/hotWork')
    if (type === 'restricted') return await import('@/api/safework/restrictedwork')
    if (type === 'highwork') return await import('@/api/safework/highwork')
    if (type === 'hoistingwork') return await import('@/api/safework/hoistingwork')
    if (type === 'earth') return await import('@/api/safework/earth')
    // 默认使用hotWork
    return await import('@/api/hotWork')
  } catch (e) {
    console.error('加载API失败:', e)
    return await import('@/api/hotWork')
  }
}

// ============ 数据加载 ============
const getList = async () => {
  loading.value = true
  try {
    const api = await loadApi()
    const params: any = { ...queryParams }
    if (params.dateRange && params.dateRange.length === 2) {
      params.startDate = params.dateRange[0]
      params.endDate = params.dateRange[1]
    }
    delete params.dateRange

    const listMethod = api.listHotWork || api.listRestrictedwork || api.listHighwork || api.default?.listHotWork
    if (listMethod) {
      const res = await listMethod(params)
      list.value = res.data || res.rows || []
      total.value = res.total || 0
      stats.value = res.stats || null
    }
  } catch (e) {
    console.error('加载列表失败', e)
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.pageNum = 1
  getList()
}

const resetQuery = () => {
  proxy?.resetForm?.('queryRef')
  handleQuery()
}

const handleSelectionChange = () => {}

// ============ 操作 ============
const handleAdd = () => {
  router.push({
    path: '/safework/apply',
    query: { ticketType: ticketType.value }
  })
}

const handleDetail = (row: any) => {
  router.push({
    path: '/safework/detail',
    query: { id: row.id, ticketType: ticketType.value }
  })
}

const handleUpdate = (row: any) => {
  router.push({
    path: '/safework/apply',
    query: { id: row.id, ticketType: ticketType.value }
  })
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除该作业票？', '提示', { type: 'warning' }).then(async () => {
    const api = await loadApi()
    const delMethod = api.delFirework || api.delRestrictedwork || api.delHighwork
    if (delMethod) {
      await delMethod(row.id)
      proxy?.$modal?.msgSuccess('删除成功')
      getList()
    }
  }).catch(() => {})
}

const handleApprove = (row: any) => {
  approveRow.value = row
  approveForm.action = 'dept'
  approveForm.comment = ''
  approveOpen.value = true
}

const submitApprove = async () => {
  try {
    const api = await loadApi()
    const approveMethod = api.approveHotWork || api.approveRestrictedwork || api.approveHighwork
    if (approveMethod && approveRow.value) {
      await approveMethod(approveRow.value.id, {
        action: approveForm.action,
        comment: approveForm.comment
      })
      proxy?.$modal?.msgSuccess('审批操作成功')
      approveOpen.value = false
      getList()
    }
  } catch (e) {
    console.error('审批失败', e)
  }
}

const handleExport = async (row: any) => {
  try {
    const api = await loadApi()
    const exportMethod = api.exportHotWorkPDF || api.exportRestrictedworkPDF
    if (exportMethod) {
      const res = await exportMethod(row.id)
      const blob = new Blob([res], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${ticketType.value}_${row.ticket_no}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    }
  } catch (e) {
    console.error('导出PDF失败', e)
    ElMessage.error('导出PDF失败')
  }
}

const handleMore = async (command: string, row: any) => {
  const api = await loadApi()
  try {
    switch (command) {
      case 'submit': {
        await ElMessageBox.confirm('确认提交审批？', '提示', { type: 'warning' })
        const submitMethod = api.submitHotWork || api.submitRestrictedwork
        if (submitMethod) await submitMethod(row.id)
        break
      }
      case 'start': {
        await ElMessageBox.confirm('确认开始作业？', '提示', { type: 'warning' })
        const startMethod = api.startHotWork || api.startRestrictedwork
        if (startMethod) await startMethod(row.id)
        break
      }
      case 'finish': {
        await ElMessageBox.confirm('确认完成作业？', '提示', { type: 'warning' })
        const finishMethod = api.finishHotWork || api.finishRestrictedwork
        if (finishMethod) await finishMethod(row.id)
        break
      }
      case 'close': {
        await ElMessageBox.confirm('确认验收关闭？', '提示', { type: 'warning' })
        const closeMethod = api.closeHotWork || api.closeRestrictedwork
        if (closeMethod) await closeMethod(row.id)
        break
      }
      case 'cancel': {
        await ElMessageBox.confirm('确认作废该作业票？', '提示', { type: 'warning' })
        const cancelMethod = api.cancelHotWork || api.cancelRestrictedwork
        if (cancelMethod) await cancelMethod(row.id)
        break
      }
    }
    proxy?.$modal?.msgSuccess('操作成功')
    getList()
  } catch (e: any) {
    if (e !== 'cancel' && e?.message !== 'cancel') {
      console.error('操作失败', e)
    }
  }
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
.mb-4 { margin-bottom: 16px; }
.ml-2 { margin-left: 8px; }

.stat-card {
  padding: 16px 12px;
  border-radius: 8px;
  text-align: center;
  color: #fff;
  cursor: pointer;
}

.stat-card.color-info { background: #909399; }
.stat-card.color-primary { background: #409EFF; }
.stat-card.color-success { background: #67C23A; }
.stat-card.color-warning { background: #E6A23C; }
.stat-card.color-danger { background: #F56C6C; }

.stat-num {
  font-size: 24px;
  font-weight: 700;
}

.stat-label {
  font-size: 12px;
  margin-top: 4px;
  opacity: 0.9;
}
</style>
