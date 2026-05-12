<template>
  <div class="app-container">
    <el-page-header @back="goBack" title="受限空间作业">
      <template #content><span class="text-lg font-bold">{{ isEdit ? '编辑' : '新建' }}受限空间作业票</span></template>
    </el-page-header>

    <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="mt-4">
      <!-- 基础信息 -->
      <el-card shadow="never" class="mb-4">
        <template #header><span class="font-bold">基础信息</span></template>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="form.projectName" placeholder="请输入项目名称" :disabled="readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="作业地点" prop="workLocation">
              <el-input v-model="form.workLocation" placeholder="请输入作业地点" :disabled="readonly" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="原有介质" prop="mediumName">
              <el-input v-model="form.mediumName" placeholder="如：硫化氢、一氧化碳、氮气" :disabled="readonly" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8" v-if="!readonly">
            <el-form-item label="所属对象">
              <el-cascader
                v-model="form.safeObject"
                :options="safeObjectOptions"
                :props="{ value: 'id', label: 'label', children: 'children', emitPath: false, checkStrictly: true }"
                placeholder="选择安全对象" style="width:100%" clearable
              />
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

        <el-form-item label="作业内容" prop="workContent">
          <el-input v-model="form.workContent" type="textarea" :rows="3" :disabled="readonly" placeholder="详细描述受限空间作业内容" />
        </el-form-item>
      </el-card>

      <!-- 受限空间专项信息 -->
      <el-card shadow="never" class="mb-4">
        <template #header><span class="font-bold">受限空间专项信息</span></template>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="空间类型">
              <el-select v-model="form.spaceType" style="width:100%" :disabled="readonly">
                <el-option label="储罐" value="tank" />
                <el-option label="反应釜" value="reactor" />
                <el-option label="管道井" value="pipe_well" />
                <el-option label="地坑" value="pit" />
                <el-option label="密闭房间" value="enclosed_room" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否隔离置换">
              <el-radio-group v-model="form.isolated" :disabled="readonly">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否通风">
              <el-radio-group v-model="form.ventilated" :disabled="readonly">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="通风方式" v-if="form.ventilated === 1">
              <el-select v-model="form.ventilationType" style="width:100%" :disabled="readonly" multiple placeholder="可选多种方式">
                <el-option label="自然通风" value="natural" />
                <el-option label="机械送风" value="mechanical_supply" />
                <el-option label="机械排风" value="mechanical_exhaust" />
                <el-option label="防爆风机" value="explosion_proof" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供气方式" v-if="form.isolated === 1">
              <el-select v-model="form.airSupplyType" style="width:100%" :disabled="readonly">
                <el-option label="长管呼吸器" value="long_tube" />
                <el-option label="正压式空气呼吸器" value="positive_pressure" />
                <el-option label="过滤式防毒面具" value="filter_mask" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="安全防护用品">
              <el-checkbox-group v-model="form.safetyEquipment" :disabled="readonly">
                <el-checkbox label="安全帽">安全帽</el-checkbox>
                <el-checkbox label="安全带">安全带</el-checkbox>
                <el-checkbox label="安全绳">安全绳</el-checkbox>
                <el-checkbox label="防毒面具">防毒面具</el-checkbox>
                <el-checkbox label="防护服">防护服</el-checkbox>
                <el-checkbox label="防爆手电">防爆手电</el-checkbox>
                <el-checkbox label="气体检测仪">气体检测仪</el-checkbox>
                <el-checkbox label="通讯设备">通讯设备</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应急救援措施" prop="emergencyMeasure">
              <el-input v-model="form.emergencyMeasure" type="textarea" :rows="3" :disabled="readonly"
                placeholder="如：配备三脚架救援系统、安排外监护人员不少于2人..." />
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
              <el-select v-model="form.responsibleUserId" filterable style="width:100%" :disabled="readonly" placeholder="选择">
                <el-option v-for="u in userList" :key="u.userId" :label="u.nickName || u.userName" :value="u.userId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="监护人">
              <el-select v-model="form.guardianUserId" filterable style="width:100%" :disabled="readonly" placeholder="选择(不少于2人)">
                <el-option v-for="u in userList" :key="u.userId" :label="u.nickName || u.userName" :value="u.userId" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="作业人1">
              <el-select v-model="form.workerUserId1" filterable style="width:100%" :disabled="readonly" placeholder="选择">
                <el-option v-for="u in userList" :key="u.userId" :label="u.nickName || u.userName" :value="u.userId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作业人2">
              <el-select v-model="form.workerUserId2" filterable style="width:100%" :disabled="readonly" placeholder="选择">
                <el-option v-for="u in userList" :key="u.userId" :label="u.nickName || u.userName" :value="u.userId" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="安全交底人">
              <el-select v-model="form.safetyDisclosureUserId" filterable style="width:100%" :disabled="readonly" placeholder="选择">
                <el-option v-for="u in userList" :key="u.userId" :label="u.nickName || u.userName" :value="u.userId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="气体检测人">
              <el-select v-model="form.gasCheckerUserId" filterable style="width:100%" :disabled="readonly" placeholder="选择">
                <el-option v-for="u in userList" :key="u.userId" :label="u.nickName || u.userName" :value="u.userId" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 气体检测初始值 -->
      <el-card shadow="never" class="mb-4">
        <template #header><span class="font-bold">初始气体检测数据 (作业前)</span></template>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="氧气浓度(%)">
              <el-input-number v-model="form.initialOxygen" :precision="2" :min="0" :max="100" :disabled="readonly" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="可燃气体(%LEL)">
              <el-input-number v-model="form.initialFlammable" :precision="4" :min="0" :disabled="readonly" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="有毒气体(ppm)">
              <el-input-number v-model="form.initialToxic" :precision="2" :min="0" :disabled="readonly" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="有毒气体种类">
              <el-input v-model="form.toxicGasType" placeholder="如：H2S" :disabled="readonly" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 备注 -->
      <el-card v-if="!readonly" shadow="never" class="mb-4">
        <template #header><span class="font-bold">备注</span></template>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="其他需要说明的事项" />
        </el-form-item>
      </el-card>
    </el-form>

    <!-- 底部按钮 -->
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
import { addRestrictedwork, updateRestrictedwork, getRestrictedwork, submitRestrictedwork } from '@/api/safework/restrictedwork'
import { treeselect } from '@/api/system/dept'
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
const safeObjectOptions = ref<any[]>([])
const formRef = ref()

const form = reactive<any>({
  projectName: '', workLocation: '', mediumName: '', workContent: '',
  startTime: '', endTime: '',
  spaceType: 'tank', isolated: 1, ventilated: 1,
  ventilationType: [], airSupplyType: 'long_tube',
  safetyEquipment: ['安全帽', '安全带', '气体检测仪', '通讯设备'],
  emergencyMeasure: '',
  responsibleUserId: null, guardianUserId: null,
  workerUserId1: null, workerUserId2: null,
  safetyDisclosureUserId: null, gasCheckerUserId: null,
  riskMeasures: [],
  initialOxygen: 20.9, initialFlammable: 0, initialToxic: 0, toxicGasType: 'H2S',
  safeObject: null, safeUnit: null,
  remark: ''
})

const rules = {
  projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  workLocation: [{ required: true, message: '请输入作业地点', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  workContent: [{ required: true, message: '请输入作业内容', trigger: 'blur' }]
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

const loadSafeObjects = async () => {
  try {
    const res = await treeselect()
    safeObjectOptions.value = res.data || []
  } catch (e) { console.error('加载安全对象失败', e) }
}

const loadDetail = async () => {
  if (!ticketId.value) return
  try {
    const res = await getRestrictedwork(ticketId.value)
    const d = res.data || {}
    Object.assign(form, {
      projectName: d.projectName || d.operationItem || '',
      workLocation: d.operationSite || d.workLocation || '',
      mediumName: d.mediumName || d.mediumName || '',
      workContent: d.operationContent || d.workContent || '',
      startTime: d.startTime || '',
      endTime: d.endTime || '',
      responsibleUserId: d.responsibleUserId || d.hazardProcessUserId || null,
      guardianUserId: d.guardianUserId || d.controlSignUserId || null,
      workerUserId1: d.workerUserId1 || null,
      safetyDisclosureUserId: d.safetyDisclosureUserId || null,
      gasCheckerUserId: d.analysisUserId || null,
      riskMeasures: d.riskMeasures || d.riskMeasures || [],
      remark: d.remark || ''
    })
  } catch (e) { console.error('加载详情失败', e) }
}

const saveDraft = async () => {
  saving.value = true
  try {
    const params = { ...form }
    if (isEdit.value) {
      params.id = ticketId.value
      await updateRestrictedwork(params)
    } else {
      await addRestrictedwork(params)
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
    const params = { ...form }
    let id = ticketId.value as string | number
    if (isEdit.value) {
      params.id = id
      await updateRestrictedwork(params)
    } else {
      const res = await addRestrictedwork(params)
      id = res.data?.id || res.id
    }
    await submitRestrictedwork(id)
    proxy.$modal.msgSuccess('提交成功')
    router.push({
      path: '/safework/detail',
      query: { id, ticketType: 'restricted' }
    })
  } catch (e) {
    proxy.$modal.msgError('提交失败')
  } finally { submitting.value = false }
}

onMounted(async () => {
  await Promise.all([loadUsers(), loadSafeObjects()])
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
