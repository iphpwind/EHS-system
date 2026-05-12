<template>
  <div class="app-container">
    <el-page-header @back="goBack" title="动火作业">
      <template #content><span class="text-lg font-bold">{{ isEdit ? '编辑' : '新建' }}动火作业票</span></template>
    </el-page-header>

    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="mt-4">
      <!-- 基础信息 -->
      <el-card shadow="never" class="mb-4">
        <template #header><span class="font-bold">基础信息</span></template>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="动火等级" prop="fireLevel">
              <el-select v-model="form.fireLevel" style="width:100%" :disabled="readonly">
                <el-option label="特级动火" :value="1" />
                <el-option label="一级动火" :value="2" />
                <el-option label="二级动火" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="动火方式" prop="fireType">
              <el-select v-model="form.fireType" style="width:100%" filterable allow-create :disabled="readonly" placeholder="选择或输入">
                <el-option label="气焊" value="气焊" />
                <el-option label="电焊" value="电焊" />
                <el-option label="氩弧焊" value="氩弧焊" />
                <el-option label="等离子切割" value="等离子切割" />
                <el-option label="氧气切割" value="氧气切割" />
                <el-option label="打磨" value="打磨" />
                <el-option label="钻孔" value="钻孔" />
                <el-option label="明火加热" value="明火加热" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="form.projectName" placeholder="请输入项目名称" :disabled="readonly" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="动火区域" prop="fireArea">
              <el-input v-model="form.fireArea" placeholder="如：生产装置区、储罐区" :disabled="readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计划开始" prop="startTime">
              <el-date-picker v-model="form.startTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
                style="width:100%" :disabled="readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计划结束" prop="endTime">
              <el-date-picker v-model="form.endTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
                style="width:100%" :disabled="readonly" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="作业地点" prop="workLocation">
          <el-input v-model="form.workLocation" placeholder="详细作业地点" :disabled="readonly" />
        </el-form-item>

        <el-form-item label="作业内容" prop="workContent">
          <el-input v-model="form.workContent" type="textarea" :rows="3" :disabled="readonly" placeholder="详细描述动火作业内容" />
        </el-form-item>
      </el-card>

      <!-- 动火专项信息 -->
      <el-card shadow="never" class="mb-4">
        <template #header><span class="font-bold">动火专项安全措施</span></template>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="周围可燃物清理">
              <el-radio-group v-model="form.combustibleCleared" :disabled="readonly">
                <el-radio :label="1">已清理</el-radio>
                <el-radio :label="0">无需清理</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="灭火器材配备">
              <el-radio-group v-model="form.fireExtinguisher" :disabled="readonly">
                <el-radio :label="1">已配备</el-radio>
                <el-radio :label="0">不适用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" v-if="form.fireExtinguisher === 1">
          <el-col :span="24">
            <el-form-item label="灭火器材类型">
              <el-checkbox-group v-model="form.fireExtinguisherType" :disabled="readonly">
                <el-checkbox label="灭火器">灭火器</el-checkbox>
                <el-checkbox label="消防水带">消防水带</el-checkbox>
                <el-checkbox label="灭火毯">灭火毯</el-checkbox>
                <el-checkbox label="消防砂">消防砂</el-checkbox>
                <el-checkbox label="消防栓">消防栓</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="动火分析合格">
              <el-radio-group v-model="form.analysisQualified" :disabled="readonly">
                <el-radio :label="1">合格</el-radio>
                <el-radio :label="0">待分析</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="高处动火">
              <el-radio-group v-model="form.isHighPlace" :disabled="readonly">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有无监护人">
              <el-radio-group v-model="form.hasGuardian" :disabled="readonly">
                <el-radio :label="1">有</el-radio>
                <el-radio :label="0">无</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="安全措施清单">
          <el-checkbox-group v-model="form.safetyMeasures" :disabled="readonly">
            <el-checkbox label="clear_combustible">清除动火点周围可燃物</el-checkbox>
            <el-checkbox label="cover_drain">覆盖地沟、下水井</el-checkbox>
            <el-checkbox label="gas_detection">动火前30分钟内进行可燃气体检测</el-checkbox>
            <el-checkbox label="watch_fire">动火期间安排专人监护</el-checkbox>
            <el-checkbox label="remove_after">动火后清理现场，确认无残留火种</el-checkbox>
            <el-checkbox label="isolation">与生产系统可靠隔绝</el-checkbox>
            <el-checkbox label="ventilation">通风置换合格</el-checkbox>
            <el-checkbox label="emergency_plan">制定应急预案</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-card>

      <!-- 气体检测初始值 -->
      <el-card shadow="never" class="mb-4">
        <template #header><span class="font-bold">作业前气体检测数据</span></template>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="可燃气体(%LEL)">
              <el-input-number v-model="form.preFlammable" :precision="4" :min="0" :disabled="readonly" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="有毒气体(ppm)">
              <el-input-number v-model="form.preToxic" :precision="2" :min="0" :disabled="readonly" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="有毒气体种类">
              <el-input v-model="form.preToxicType" placeholder="如：H2S" :disabled="readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="检测时间">
              <el-date-picker v-model="form.preCheckTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"
                style="width:100%" :disabled="readonly" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 风险辨识 -->
      <el-card shadow="never" class="mb-4">
        <template #header><span class="font-bold">风险辨识与管控措施 (GB 30871-2022)</span></template>
        <RiskMeasureTable
          v-model="form.riskMeasures"
          :readonly="readonly"
          :user-options="userList"
          :show-signature="!readonly"
          :show-approval="!readonly"
          @need-sign="onNeedSign"
        />
      </el-card>

      <!-- 作业人员 -->
      <el-card shadow="never" class="mb-4">
        <template #header><span class="font-bold">作业人员配置</span></template>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="作业负责人">
              <el-select v-model="form.responsibleUserId" filterable style="width:100%" :disabled="readonly">
                <el-option v-for="u in userList" :key="u.userId" :label="u.nickName || u.userName" :value="u.userId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="监护人">
              <el-select v-model="form.guardianUserId" filterable style="width:100%" :disabled="readonly">
                <el-option v-for="u in userList" :key="u.userId" :label="u.nickName || u.userName" :value="u.userId" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="动火人">
              <el-select v-model="form.workerUserId" filterable style="width:100%" :disabled="readonly">
                <el-option v-for="u in userList" :key="u.userId" :label="u.nickName || u.userName" :value="u.userId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分析人">
              <el-select v-model="form.analysisUserId" filterable style="width:100%" :disabled="readonly">
                <el-option v-for="u in userList" :key="u.userId" :label="u.nickName || u.userName" :value="u.userId" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <el-card v-if="!readonly" shadow="never" class="mb-4">
        <template #header><span class="font-bold">备注</span></template>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-card>
    </el-form>

    <div class="sticky-footer" v-if="!readonly">
      <el-button @click="saveDraft" :loading="saving">保存草稿</el-button>
      <el-button type="primary" @click="submitForm" :loading="submitting">提交审批</el-button>
      <el-button @click="goBack">取消</el-button>
    </div>
    <div class="sticky-footer" v-else>
      <el-button @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { listUser } from '@/api/system/user'
import { addHotWork, updateHotWork, getHotWork, submitHotWork } from '@/api/hotWork'
import RiskMeasureTable from '../components/RiskMeasureTable.vue'

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()

const ticketId = computed(() => route.query.id)
const isEdit = computed(() => !!ticketId.value)
const readonly = computed(() => route.query.readonly === '1')

const saving = ref(false)
const submitting = ref(false)
const userList = ref<any[]>([])
const formRef = ref()

const form = reactive<any>({
  fireLevel: 2, fireType: '电焊', projectName: '', fireArea: '',
  workLocation: '', workContent: '', startTime: '', endTime: '',
  combustibleCleared: 1, fireExtinguisher: 1,
  fireExtinguisherType: ['灭火器', '消防水带'],
  analysisQualified: 1, isHighPlace: 0, hasGuardian: 1,
  safetyMeasures: ['gas_detection', 'watch_fire', 'remove_after', 'clear_combustible'],
  preFlammable: 0, preToxic: 0, preToxicType: '', preCheckTime: '',
  responsibleUserId: null, guardianUserId: null,
  workerUserId: null, analysisUserId: null,
  riskMeasures: [], remark: ''
})

const rules = {
  projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  fireLevel: [{ required: true, message: '请选择动火等级', trigger: 'change' }],
  fireType: [{ required: true, message: '请输入动火方式', trigger: 'blur' }],
  fireArea: [{ required: true, message: '请输入动火区域', trigger: 'blur' }],
  workLocation: [{ required: true, message: '请输入作业地点', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
}

const goBack = () => router.back()
const onNeedSign = (signType: string) => {
  ElMessage.info(`请在作业票详情页使用电子签字功能完成${signType}签字`)
}

const loadUsers = async () => {
  try {
    const res = await listUser({ pageNum: 1, pageSize: 9999 })
    userList.value = res.rows || res.data || []
  } catch (e) { console.error('加载用户失败', e) }
}

const loadDetail = async () => {
  if (!ticketId.value) return
  try {
    const res = await getHotWork(ticketId.value)
    const d = res.data || {}
    Object.assign(form, {
      fireLevel: d.fire_level || 2, fireType: d.fire_type || '',
      projectName: d.project_name || '', fireArea: d.fire_area || '',
      workLocation: d.work_location || '', workContent: d.work_content || '',
      startTime: d.start_time || '', endTime: d.end_time || '',
      responsibleUserId: d.responsibleUserId || null,
      guardianUserId: d.guardianUserId || null,
      workerUserId: d.workerUserId || null,
      analysisUserId: d.analysisUserId || null,
      riskMeasures: d.riskMeasures || d.risk_measures || [],
      remark: d.remark || ''
    })
  } catch (e) { console.error('加载详情失败', e) }
}

const saveDraft = async () => {
  saving.value = true
  try {
    if (isEdit.value) {
      await updateHotWork(ticketId.value, form)
    } else {
      await addHotWork(form)
    }
    proxy.$modal.msgSuccess('草稿保存成功')
  } catch (e) {
    proxy.$modal.msgError('保存失败')
  } finally { saving.value = false }
}

const submitForm = async () => {
  if (!formRef.value) return
  try { await formRef.value.validate() } catch { return }
  submitting.value = true
  try {
    let id = ticketId.value as string | number
    if (isEdit.value) {
      await updateHotWork(id, form)
    } else {
      const res = await addHotWork(form)
      id = res.data?.id || res.id
    }
    await submitHotWork(id)
    proxy.$modal.msgSuccess('提交成功')
    router.push({
      path: '/safework/detail',
      query: { id, ticketType: 'firework' }
    })
  } catch (e) {
    proxy.$modal.msgError('提交失败')
  } finally { submitting.value = false }
}

onMounted(async () => {
  await loadUsers()
  if (ticketId.value) await loadDetail()
})
</script>

<style scoped>
.mt-4 { margin-top: 16px; }
.mb-4 { margin-bottom: 16px; }
.sticky-footer {
  position: sticky; bottom: 0; background: #fff; padding: 16px 0;
  border-top: 1px solid #f0f0f0; display: flex; gap: 12px;
  justify-content: center; z-index: 10;
}
</style>
