<template>
  <div class="risk-measure-table">
    <div class="flex justify-between items-center mb-3">
      <h4>{{ title }}</h4>
      <el-button type="primary" size="small" @click="addRow" v-if="!readonly">
        <el-icon><Plus /></el-icon> 添加措施
      </el-button>
    </div>

    <el-table :data="localRows" border size="small" :empty-text="readonly ? '暂无风险辨识记录' : '请添加风险辨识与管控措施'">
      <!-- 风险项 -->
      <el-table-column label="风险项" min-width="150">
        <template #default="{ row, $index }">
          <template v-if="readonly">{{ row.riskItem }}</template>
          <el-input v-else v-model="row.riskItem" placeholder="如：火灾爆炸" size="small" />
        </template>
      </el-table-column>

      <!-- 风险等级 -->
      <el-table-column label="风险等级" width="110" align="center">
        <template #default="{ row, $index }">
          <template v-if="readonly">
            <el-tag :type="riskLevelTag(row.riskLevel)">{{ riskLevelText(row.riskLevel) }}</el-tag>
          </template>
          <el-select v-else v-model="row.riskLevel" size="small" placeholder="选择" style="width:100%">
            <el-option label="低" value="low" />
            <el-option label="中" value="medium" />
            <el-option label="高" value="high" />
            <el-option label="重大" value="critical" />
          </el-select>
        </template>
      </el-table-column>

      <!-- 可能导致 -->
      <el-table-column label="可能导致" min-width="160">
        <template #default="{ row, $index }">
          <template v-if="readonly">{{ row.consequence }}</template>
          <el-input v-else v-model="row.consequence" placeholder="如：人员伤亡、设备损坏" size="small" />
        </template>
      </el-table-column>

      <!-- 安全管控措施 -->
      <el-table-column label="安全管控措施" min-width="200">
        <template #default="{ row, $index }">
          <template v-if="readonly">{{ row.measure }}</template>
          <el-input v-else v-model="row.measure" type="textarea" :rows="2" placeholder="描述具体的安全措施..." size="small" />
        </template>
      </el-table-column>

      <!-- 管控后风险等级 -->
      <el-table-column label="管控后等级" width="110" align="center">
        <template #default="{ row, $index }">
          <template v-if="readonly">
            <el-tag :type="riskLevelTag(row.afterLevel)">{{ riskLevelText(row.afterLevel) }}</el-tag>
          </template>
          <el-select v-else v-model="row.afterLevel" size="small" placeholder="选择" style="width:100%">
            <el-option label="低" value="low" />
            <el-option label="中" value="medium" />
            <el-option label="高" value="high" />
            <el-option label="重大" value="critical" />
          </el-select>
        </template>
      </el-table-column>

      <!-- 责任人 -->
      <el-table-column label="责任人" width="120">
        <template #default="{ row, $index }">
          <template v-if="readonly">{{ row.responsibleName || row.responsibleId }}</template>
          <el-select v-else v-model="row.responsibleId" size="small" filterable placeholder="选择责任人" style="width:100%"
            @change="(val) => onResponsibleChange($index, val)">
            <el-option v-for="u in userOptions" :key="u.userId" :label="u.nickName || u.userName" :value="u.userId" />
          </el-select>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column v-if="!readonly" label="操作" width="70" align="center">
        <template #default="{ row, $index }">
          <el-button link type="danger" size="small" @click="removeRow($index)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 风险辨识人签字 -->
    <div v-if="showSignature" class="mt-4 p-3 bg-gray-50 rounded flex flex-wrap gap-4">
      <div class="sign-box">
        <div class="sign-label">风险辨识人</div>
        <div v-if="riskAnalyzerSign" class="sign-done">
          <img :src="riskAnalyzerSign" class="sign-preview" />
          <div class="sign-info">{{ riskAnalyzerName }}</div>
        </div>
        <el-button v-else-if="!readonly" size="small" type="primary" @click="$emit('need-sign', 'risk_analysis')">
          开始签字
        </el-button>
        <span v-else class="text-gray-400 text-sm">未签字</span>
      </div>

      <div v-if="showApproval" class="sign-box">
        <div class="sign-label">审批人</div>
        <div v-if="riskApprovalSign" class="sign-done">
          <img :src="riskApprovalSign" class="sign-preview" />
          <div class="sign-info">{{ riskApprovalName }}</div>
        </div>
        <el-button v-else-if="!readonly" size="small" type="primary" @click="$emit('need-sign', 'risk_approval')">
          开始签字
        </el-button>
        <span v-else class="text-gray-400 text-sm">未签字</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import { listUser } from '@/api/system/user'

interface RiskRow {
  riskItem: string
  riskLevel: string
  consequence: string
  measure: string
  afterLevel: string
  responsibleId: number | null
  responsibleName?: string
}

const props = withDefaults(defineProps<{
  modelValue?: RiskRow[]
  title?: string
  readonly?: boolean
  showSignature?: boolean
  showApproval?: boolean
  riskAnalyzerSign?: string
  riskAnalyzerName?: string
  riskApprovalSign?: string
  riskApprovalName?: string
  userOptions?: any[]
}>(), {
  modelValue: () => [],
  title: '风险辨识与管控措施 (GB 30871-2022)',
  readonly: false,
  showSignature: false,
  showApproval: false,
  riskAnalyzerSign: '',
  riskAnalyzerName: '',
  riskApprovalSign: '',
  riskApprovalName: '',
  userOptions: () => []
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: RiskRow[]): void
  (e: 'need-sign', type: string): void
}>()

const localRows = ref<RiskRow[]>([])

// 同步外部数据
watch(() => props.modelValue, (val) => {
  if (val && val.length > 0) {
    localRows.value = JSON.parse(JSON.stringify(val))
  }
}, { immediate: true, deep: true })

watch(localRows, (val) => {
  emit('update:modelValue', JSON.parse(JSON.stringify(val)))
}, { deep: true })

const riskLevelTag = (level: string) => {
  const map: Record<string, string> = { low: 'success', medium: 'warning', high: 'danger', critical: 'danger' }
  return map[level] || 'info'
}

const riskLevelText = (level: string) => {
  const map: Record<string, string> = { low: '低', medium: '中', high: '高', critical: '重大' }
  return map[level] || level
}

const addRow = () => {
  localRows.value.push({
    riskItem: '',
    riskLevel: 'low',
    consequence: '',
    measure: '',
    afterLevel: 'low',
    responsibleId: null
  })
}

const removeRow = (index: number) => {
  localRows.value.splice(index, 1)
}

const onResponsibleChange = (index: number, userId: number) => {
  const user = props.userOptions.find((u: any) => u.userId === userId)
  if (user) {
    localRows.value[index].responsibleName = user.nickName || user.userName
  }
}

// 初始化默认数据
onMounted(() => {
  if (localRows.value.length === 0 && !props.readonly) {
    addRow()
  }
})
</script>

<style scoped>
.risk-measure-table {
  width: 100%;
}

.sign-box {
  width: 160px;
  text-align: center;
  border: 1px solid #e5e7eb;
  padding: 12px;
  border-radius: 6px;
  background: #fff;
}

.sign-label {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.sign-preview {
  max-width: 130px;
  max-height: 60px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.sign-info {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}

.sign-done {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
