<template>
  <div class="gas-monitor-container">
    <!-- 实时监测卡片 -->
    <el-row :gutter="20" class="mb-20">
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>实时气体监测</span>
              <el-button type="primary" @click="showManualEntry = true">
                <el-icon><Plus /></el-icon> 手动录入
              </el-button>
            </div>
          </template>
          <el-row :gutter="16">
            <el-col
              v-for="item in latestData"
              :key="item.id"
              :span="6"
            >
              <div
                class="monitor-card"
                :class="{
                  'is-danger': item.check_result === 0,
                  'is-warning': item.is_lel_warning || item.is_toxic_warning
                }"
              >
                <div class="monitor-header">
                  <span class="area-name">{{ item.area_name || '未知区域' }}</span>
                  <el-tag :type="item.check_result === 1 ? 'success' : 'danger'" size="small">
                    {{ item.check_result === 1 ? '合格' : '不合格' }}
                  </el-tag>
                </div>
                <div class="monitor-body">
                  <div class="monitor-item">
                    <span class="label">氧气</span>
                    <span class="value" :class="{ 'is-danger': item.oxygen_percent < 18 || item.oxygen_percent > 23 }">
                      {{ item.oxygen_percent }}%
                    </span>
                  </div>
                  <div class="monitor-item">
                    <span class="label">LEL</span>
                    <span class="value" :class="{ 'is-danger': item.is_lel_danger, 'is-warning': item.is_lel_warning }">
                      {{ item.flammable_percent }}%
                    </span>
                  </div>
                  <div class="monitor-item">
                    <span class="label">有毒气体</span>
                    <span class="value" :class="{ 'is-danger': item.is_toxic_danger, 'is-warning': item.is_toxic_warning }">
                      {{ item.toxic_ppm }} ppm
                    </span>
                  </div>
                </div>
                <div class="monitor-footer">
                  <span class="time">{{ formatTime(item.check_time) }}</span>
                  <span class="source">{{ item.data_source === 'iot' ? 'IoT' : '手动' }}</span>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-empty v-if="latestData.length === 0" description="暂无监测数据" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 统计和趋势 -->
    <el-row :gutter="20" class="mb-20">
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>监测统计</template>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">总检测次数</span>
              <span class="stat-value">{{ stats.total_count || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">合格次数</span>
              <span class="stat-value success">{{ stats.pass_count || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">不合格次数</span>
              <span class="stat-value danger">{{ stats.fail_count || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">合格率</span>
              <span class="stat-value">{{ passRate }}%</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>历史趋势</template>
          <div ref="trendChartRef" style="height: 200px"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 历史记录列表 -->
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>检测记录</span>
          <div>
            <el-select v-model="queryParams.source" placeholder="数据来源" clearable style="width: 120px; margin-right: 10px">
              <el-option label="全部" value="" />
              <el-option label="IoT自动" value="iot" />
              <el-option label="手动录入" value="manual" />
            </el-select>
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px; margin-right: 10px"
              @change="handleDateChange"
            />
            <el-button type="primary" @click="handleQuery">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </div>
        </div>
      </template>

      <el-table :data="tableData" border stripe v-loading="loading">
        <el-table-column label="检测时间" prop="check_time" width="160">
          <template #default="{ row }">
            {{ formatTime(row.check_time) }}
          </template>
        </el-table-column>
        <el-table-column label="区域" prop="area_name" min-width="120" />
        <el-table-column label="来源" prop="data_source" width="80">
          <template #default="{ row }">
            <el-tag :type="row.data_source === 'iot' ? 'primary' : 'default'" size="small">
              {{ row.data_source === 'iot' ? 'IoT' : '手动' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="氧气浓度" prop="oxygen_percent" width="100">
          <template #default="{ row }">
            <span :class="{ 'is-danger': row.oxygen_percent < 18 || row.oxygen_percent > 23 }">
              {{ row.oxygen_percent }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column label="LEL" prop="flammable_percent" width="100">
          <template #default="{ row }">
            <span :class="{ 'is-danger': row.flammable_percent >= 50, 'is-warning': row.flammable_percent >= 25 }">
              {{ row.flammable_percent }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column label="有毒气体" prop="toxic_ppm" width="120">
          <template #default="{ row }">
            <span>{{ row.toxic_ppm }} ppm</span>
            <span v-if="row.toxic_type" class="text-muted">({{ row.toxic_type }})</span>
          </template>
        </el-table-column>
        <el-table-column label="检测结果" prop="check_result" width="80">
          <template #default="{ row }">
            <el-tag :type="row.check_result === 1 ? 'success' : 'danger'">
              {{ row.check_result === 1 ? '合格' : '不合格' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="检测人" prop="checker_name" width="100" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">详情</el-button>
            <el-button link type="primary" @click="handleLinkTicket(row)">关联作业票</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-model:page="queryParams.page"
        v-model:limit="queryParams.pageSize"
        :total="total"
        @pagination="loadData"
      />
    </el-card>

    <!-- 手动录入对话框 -->
    <el-dialog v-model="showManualEntry" title="手动录入气体检测" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="检测区域" prop="locationId">
          <el-select v-model="form.locationId" placeholder="请选择区域" style="width: 100%">
            <el-option
              v-for="area in areas"
              :key="area.id"
              :label="area.area_name"
              :value="area.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关联作业票" prop="ticketId">
          <el-input v-model.number="form.ticketId" placeholder="请输入作业票ID（可选）" />
        </el-form-item>
        <el-form-item label="检测时机" prop="checkType">
          <el-select v-model="form.checkType" style="width: 100%">
            <el-option label="作业前" value="before" />
            <el-option label="作业中" value="during" />
            <el-option label="作业后" value="after" />
          </el-select>
        </el-form-item>
        <el-form-item label="氧气浓度%" prop="oxygenPercent">
          <el-input-number v-model="form.oxygenPercent" :min="0" :max="100" :step="0.1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="LEL%" prop="flammablePercent">
          <el-input-number v-model="form.flammablePercent" :min="0" :max="100" :step="0.01" style="width: 100%" />
        </el-form-item>
        <el-form-item label="有毒气体ppm" prop="toxicPpm">
          <el-input-number v-model="form.toxicPpm" :min="0" :max="1000" :step="0.1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="有毒气体类型" prop="toxicType">
          <el-input v-model="form.toxicType" placeholder="如：CO、H2S等" />
        </el-form-item>
        <el-form-item label="检测地点" prop="checkLocation">
          <el-input v-model="form.checkLocation" placeholder="请输入检测地点" />
        </el-form-item>
        <el-form-item label="检测人" prop="checkerName">
          <el-input v-model="form.checkerName" placeholder="请输入检测人姓名" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showManualEntry = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog v-model="showDetail" title="检测详情" width="500px">
      <el-descriptions :column="2" border v-if="currentRow">
        <el-descriptions-item label="检测时间">{{ formatTime(currentRow.check_time) }}</el-descriptions-item>
        <el-descriptions-item label="检测结果">
          <el-tag :type="currentRow.check_result === 1 ? 'success' : 'danger'">
            {{ currentRow.check_result === 1 ? '合格' : '不合格' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="氧气浓度">{{ currentRow.oxygen_percent }}%</el-descriptions-item>
        <el-descriptions-item label="LEL">{{ currentRow.flammable_percent }}%</el-descriptions-item>
        <el-descriptions-item label="有毒气体">{{ currentRow.toxic_ppm }} ppm</el-descriptions-item>
        <el-descriptions-item label="有毒气体类型">{{ currentRow.toxic_type || '-' }}</el-descriptions-item>
        <el-descriptions-item label="温度">{{ currentRow.temperature || '-' }}℃</el-descriptions-item>
        <el-descriptions-item label="湿度">{{ currentRow.humidity || '-' }}%</el-descriptions-item>
        <el-descriptions-item label="气压">{{ currentRow.pressure || '-' }}kPa</el-descriptions-item>
        <el-descriptions-item label="数据来源">
          <el-tag :type="currentRow.data_source === 'iot' ? 'primary' : 'default'">
            {{ currentRow.data_source === 'iot' ? 'IoT自动上报' : '手动录入' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="检测地点">{{ currentRow.check_location || '-' }}</el-descriptions-item>
        <el-descriptions-item label="检测人">{{ currentRow.checker_name || '-' }}</el-descriptions-item>
        <el-descriptions-item label="设备ID" :span="2">{{ currentRow.device_id || '-' }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentRow.remark || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 关联作业票对话框 -->
    <el-dialog v-model="showLinkTicket" title="关联作业票" width="400px">
      <el-form>
        <el-form-item label="作业票ID">
          <el-input v-model.number="linkTicketId" placeholder="请输入作业票ID" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showLinkTicket = false">取消</el-button>
        <el-button type="primary" @click="handleDoLinkTicket">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import * as echarts from 'echarts'
import {
  getLatestGasData,
  getGasMonitorList,
  getGasStats,
  getGasTrend,
  manualEntryGas,
  linkTicket
} from '@/api/gasMonitor'

const trendChartRef = ref<HTMLDivElement>()
let trendChart: echarts.ECharts | null = null
let refreshTimer: ReturnType<typeof setInterval> | null = null

const loading = ref(false)
const showManualEntry = ref(false)
const showDetail = ref(false)
const showLinkTicket = ref(false)
const currentRow = ref<any>(null)
const linkTicketId = ref<number>()

const latestData = ref<any[]>([])
const tableData = ref<any[]>([])
const stats = ref<any>({})
const areas = ref<any[]>([])
const total = ref(0)
const dateRange = ref<[Date, Date] | null>(null)

const queryParams = reactive({
  page: 1,
  pageSize: 20,
  source: ''
})

const formRef = ref<FormInstance>()

const form = reactive({
  locationId: undefined as number | undefined,
  ticketId: undefined as number | undefined,
  checkType: 'before',
  oxygenPercent: 21,
  flammablePercent: 0,
  toxicPpm: 0,
  toxicType: '',
  checkLocation: '',
  checkerName: '',
  remark: ''
})

const rules: FormRules = {
  oxygenPercent: [{ required: true, message: '请输入氧气浓度', trigger: 'blur' }],
  flammablePercent: [{ required: true, message: '请输入LEL', trigger: 'blur' }],
  toxicPpm: [{ required: true, message: '请输入有毒气体浓度', trigger: 'blur' }]
}

const passRate = computed(() => {
  if (!stats.value.total_count) return 0
  return ((stats.value.pass_count / stats.value.total_count) * 100).toFixed(1)
})

const formatTime = (time: string) => {
  if (!time) return '-'
  return new Date(time).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadLatestData = async () => {
  try {
    const res = await getLatestGasData()
    latestData.value = res.data || []
  } catch (error) {
    console.error('加载实时数据失败', error)
  }
}

const loadStats = async () => {
  try {
    const res = await getGasStats({})
    stats.value = res.data || {}
  } catch (error) {
    console.error('加载统计数据失败', error)
  }
}

const loadData = async () => {
  loading.value = true
  try {
    const params: any = {
      page: queryParams.page,
      pageSize: queryParams.pageSize,
      source: queryParams.source || undefined
    }
    if (dateRange.value) {
      params.startTime = dateRange.value[0].toISOString()
      params.endTime = dateRange.value[1].toISOString()
    }
    const res = await getGasMonitorList(params)
    tableData.value = res.data || []
    total.value = res.total || 0
  } catch (error) {
    console.error('加载数据失败', error)
  } finally {
    loading.value = false
  }
}

const loadTrend = async () => {
  if (!trendChartRef.value) return
  try {
    const res = await getGasTrend({
      locationId: '',
      startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date().toISOString()
    })
    const data = res.data || []

    if (!trendChart) {
      trendChart = echarts.init(trendChartRef.value)
    }

    const times = data.map((d: any) => formatTime(d.check_time))
    const oxygenData = data.map((d: any) => d.oxygen_percent)
    const lelData = data.map((d: any) => d.flammable_percent)
    const toxicData = data.map((d: any) => d.toxic_ppm)

    trendChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['氧气%', 'LEL%', '有毒气体ppm'] },
      xAxis: { type: 'category', data: times, boundaryGap: false },
      yAxis: [
        { type: 'value', name: '%', max: 100 },
        { type: 'value', name: 'ppm', max: 100 }
      ],
      series: [
        { name: '氧气%', type: 'line', data: oxygenData, smooth: true },
        { name: 'LEL%', type: 'line', data: lelData, smooth: true },
        { name: '有毒气体ppm', type: 'line', yAxisIndex: 1, data: toxicData, smooth: true }
      ]
    })
  } catch (error) {
    console.error('加载趋势数据失败', error)
  }
}

const handleQuery = () => {
  queryParams.page = 1
  loadData()
}

const handleReset = () => {
  queryParams.source = ''
  dateRange.value = null
  handleQuery()
}

const handleDateChange = () => {
  handleQuery()
}

const handleView = (row: any) => {
  currentRow.value = row
  showDetail.value = true
}

const handleLinkTicket = (row: any) => {
  currentRow.value = row
  linkTicketId.value = undefined
  showLinkTicket.value = true
}

const handleDoLinkTicket = async () => {
  if (!currentRow.value || !linkTicketId.value) {
    ElMessage.warning('请输入作业票ID')
    return
  }
  try {
    await linkTicket(currentRow.value.id, linkTicketId.value)
    ElMessage.success('关联成功')
    showLinkTicket.value = false
    loadData()
  } catch (error) {
    ElMessage.error('关联失败')
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await manualEntryGas(form)
        ElMessage.success('录入成功')
        showManualEntry.value = false
        formRef.value?.resetFields()
        loadData()
        loadStats()
        loadLatestData()
      } catch (error) {
        ElMessage.error('录入失败')
      }
    }
  })
}

onMounted(() => {
  loadLatestData()
  loadStats()
  loadData()
  loadTrend()

  // 每30秒刷新实时数据
  refreshTimer = setInterval(() => {
    loadLatestData()
  }, 30000)
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
  if (trendChart) {
    trendChart.dispose()
  }
})
</script>

<style scoped>
.gas-monitor-container {
  padding: 20px;
}

.mb-20 {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.monitor-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 16px;
  color: #fff;
  margin-bottom: 12px;
}

.monitor-card.is-warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.monitor-card.is-danger {
  background: linear-gradient(135deg, #ff0844 0%, #ffb199 100%);
}

.monitor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.area-name {
  font-weight: bold;
  font-size: 14px;
}

.monitor-body {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.monitor-item {
  text-align: center;
}

.monitor-item .label {
  display: block;
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 4px;
}

.monitor-item .value {
  font-size: 18px;
  font-weight: bold;
}

.monitor-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  opacity: 0.8;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stat-value.success {
  color: #67c23a;
}

.stat-value.danger {
  color: #f56c6c;
}

.is-danger {
  color: #f56c6c !important;
}

.is-warning {
  color: #e6a23c !important;
}

.text-muted {
  color: #909399;
  font-size: 12px;
}
</style>
