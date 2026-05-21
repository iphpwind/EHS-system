<template>
  <div class="app-container">
    <el-page-header @back="goBack" :title="pageTitle">
      <template #content>
        <span class="text-lg font-bold">{{ isEdit ? '编辑' : '新建' }}{{ ticketTypeText }}作业票</span>
      </template>
    </el-page-header>

    <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" class="mt-4">
      <!-- 基础信息 -->
      <el-card shadow="never" class="mb-4">
        <template #header><span class="font-bold">基础信息</span></template>
        <el-row :gutter="20">
          <el-col :span="8" v-if="ticketType === 'firework'">
            <el-form-item label="动火等级" prop="fireLevel">
              <el-select v-model="form.fireLevel" style="width:100%">
                <el-option label="特级" :value="1" />
                <el-option label="一级" :value="2" />
                <el-option label="二级" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="ticketType === 'firework'">
            <el-form-item label="动火方式" prop="fireType">
              <el-input v-model="form.fireType" placeholder="如：气焊、电焊、切割等" />
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="ticketType === 'restricted'">
            <el-form-item label="原有介质" prop="mediumName">
              <el-input v-model="form.mediumName" placeholder="受限空间内原有介质" />
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="ticketType === 'highwork'">
            <el-form-item label="高处等级" prop="highLevel">
              <el-select v-model="form.highLevel" style="width:100%">
                <el-option label="一级(2-5m)" :value="1" />
                <el-option label="二级(5-15m)" :value="2" />
                <el-option label="三级(15-30m)" :value="3" />
                <el-option label="特级(>30m)" :value="4" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="form.projectName" placeholder="请输入项目名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="作业地点" prop="workLocation">
              <el-input v-model="form.workLocation" placeholder="请输入作业地点" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8" v-if="ticketType === 'firework'">
            <el-form-item label="动火区域" prop="fireArea">
              <el-input v-model="form.fireArea" placeholder="请输入动火区域" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计划开始" prop="startTime">
              <el-date-picker v-model="form.startTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计划结束" prop="endTime">
              <el-date-picker v-model="form.endTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="作业内容" prop="workContent">
          <el-input v-model="form.workContent" type="textarea" :rows="3" placeholder="详细描述作业内容" />
        </el-form-item>
      </el-card>

      <!-- 风险辨识与管控措施 (RiskMeasureTable) -->
      <el-card shadow="never" class="mb-4">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="font-bold">风险辨识与管控措施 (GB 30871-2022)</span>
          </div>
        </template>
        <RiskMeasureTable
          v-model="form.riskMeasures"
          :user-options="userList"
          :show-signature="!isReadonly"
          :show-approval="!isReadonly"
          @need-sign="onNeedSign"
        />
      </el-card>

      <!-- 申请人信息 -->
      <el-card shadow="never" class="mb-4">
        <template #header><span class="font-bold">作业人员</span></template>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="作业负责人">
              <el-select v-model="form.responsibleUserId" filterable style="width:100%" :disabled="isReadonly" placeholder="选择作业负责人">
                <el-option v-for="u in userList" :key="u.userId" :label="u.nickName || u.userName" :value="u.userId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="监护人">
              <el-select v-model="form.guardianUserId" filterable style="width:100%" :disabled="isReadonly" placeholder="选择监护人">
                <el-option v-for="u in userList" :key="u.userId" :label="u.nickName || u.userName" :value="u.userId" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="作业人">
              <el-select v-model="form.workerUserId" filterable style="width:100%" :disabled="isReadonly" placeholder="选择作业人">
                <el-option v-for="u in userList" :key="u.userId" :label="u.nickName || u.userName" :value="u.userId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安全交底人">
              <el-select v-model="form.safetyDisclosureUserId" filterable style="width:100%" :disabled="isReadonly" placeholder="选择安全交底人">
                <el-option v-for="u in userList" :key="u.userId" :label="u.nickName || u.userName" :value="u.userId" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>

      <!-- 备注 -->
      <el-card v-if="!isReadonly" shadow="never" class="mb-4">
        <template #header><span class="font-bold">备注</span></template>
        <el-form-item label="备注说明" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="其他需要说明的事项" />
        </el-form-item>
      </el-card>
    </el-form>

    <!-- 底部操作栏 -->
    <div class="sticky-footer" v-if="!isReadonly">
      <el-button @click="saveDraft" :loading="saving">保存草稿</el-button>
      <el-button type="primary" @click="submitForm" :loading="submitting">提交审批</el-button>
      <el-button @click="goBack">取消</el-button>
    </div>

    <!-- 查看模式底部 -->
    <div class="sticky-footer" v-if="isReadonly">
      <el-button @click="goBack">返回</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { listUser } from '@/api/system/user'
import RiskMeasureTable from '../components/RiskMeasureTable.vue'
import { loadWorkTicketApi, resolveAddFn, resolveUpdateFn, resolveGetFn, resolveSubmitFn } from '@/utils/apiHelper'

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()

const ticketType = computed(() => route.query.ticketType || 'firework')
const ticketId = computed(() => route.query.id)
const isEdit = computed(() => !!ticketId.value)
const isReadonly = computed(() => route.query.readonly === '1')

const ticketTypeText = computed(() => {
  const map: Record<string, string> = {
    firework: '动火',
    restricted: '受限空间',
    highwork: '高处',
    hoistingwork: '吊装',
    earth: '动土',
    broken: '断路',
    blind: '盲板抽堵',
    electricwork: '临时用电'
  }
  return map[ticketType.value] || ticketType.value
})

const pageTitle = computed(() => {
  return isReadonly.value ? `${ticketTypeText.value}作业票详情` : (isEdit.value ? `编辑${ticketTypeText.value}作业票` : `新建${ticketTypeText.value}作业票`)
})

const saving = ref(false)
const submitting = ref(false)
const userList = ref<any[]>([])
const formRef = ref()

const form = reactive<any>({
  projectName: '',
  workLocation: '',
  workContent: '',
  startTime: '',
  endTime: '',
  // 动火专用
  fireLevel: 2,
  fireArea: '',
  fireType: '',
  // 受限空间
  mediumName: '',
  // 高处
  highLevel: 1,
  // 人员
  responsibleUserId: null,
  guardianUserId: null,
  workerUserId: null,
  safetyDisclosureUserId: null,
  // 风险辨识
  riskMeasures: [],
  // 备注
  remark: ''
})

const rules = {
  projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  workLocation: [{ required: true, message: '请输入作业地点', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
}

const goBack = () => { router.back() }

const onNeedSign = (signType: string) => {
  ElMessage.info(`请使用详情页面的电子签字功能完成${signType}签字`)
}

const loadUsers = async () => {
  try {
    const res = await listUser({ pageNum: 1, pageSize: 9999 })
    userList.value = res.rows || res.data || []
  } catch (e) {
    console.error('加载用户列表失败', e)
  }
}

const loadDetail = async () => {
  if (!ticketId.value) return
  try {
    const apiMod = await loadWorkTicketApi(ticketType.value as string)
    const getFn = resolveGetFn(apiMod, ticketType.value as string)
    if (!getFn) return
    const res = await getFn(ticketId.value)
    const d = res.data || {}
    Object.assign(form, {
      projectName: d.project_name || d.projectName || '',
      workLocation: d.work_location || d.workLocation || '',
      workContent: d.work_content || d.workContent || '',
      startTime: d.start_time || d.startTime || '',
      endTime: d.end_time || d.endTime || '',
      fireLevel: d.fire_level || d.fireLevel || 2,
      fireArea: d.fire_area || d.fireArea || '',
      fireType: d.fire_type || d.fireType || '',
      mediumName: d.medium_name || d.mediumName || '',
      highLevel: d.high_level || d.highLevel || 1,
      responsibleUserId: d.responsible_user_id || d.responsibleUserId || null,
      guardianUserId: d.guardian_user_id || d.guardianUserId || null,
      workerUserId: d.worker_user_id || d.workerUserId || null,
      safetyDisclosureUserId: d.safety_disclosure_user_id || d.safetyDisclosureUserId || null,
      riskMeasures: d.risk_measures || d.riskMeasures || [],
      remark: d.remark || ''
    })
  } catch (e) {
    console.error('加载详情失败', e)
  }
}

const saveDraft = async () => {
  saving.value = true
  try {
    const apiMod = await loadWorkTicketApi(ticketType.value as string)
    const apiMethod = isEdit.value
      ? resolveUpdateFn(apiMod, ticketType.value as string)
      : resolveAddFn(apiMod, ticketType.value as string)
    const params = isEdit.value ? [ticketId.value, { ...form, status: '1' }] : [{ ...form, status: '1' }]
    await (apiMethod as Function)(...params)
    proxy.$modal.msgSuccess('草稿保存成功')
  } catch (e) {
    console.error('保存失败', e)
    proxy.$modal.msgError('保存失败')
  } finally {
    saving.value = false
  }
}

const submitForm = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch { return }

  submitting.value = true
  try {
    const apiMod = await loadWorkTicketApi(ticketType.value as string)
    const apiMethod = isEdit.value
      ? resolveUpdateFn(apiMod, ticketType.value as string)
      : resolveAddFn(apiMod, ticketType.value as string)
    const params = isEdit.value ? [ticketId.value, { ...form }] : [{ ...form }]

    const res = await (apiMethod as Function)(...params)
    const newId = res.data?.id || ticketId.value

    // 提交审批
    const submitFn = resolveSubmitFn(apiMod, ticketType.value as string)
    if (submitFn) await submitFn(newId)
    proxy.$modal.msgSuccess('提交成功')
    router.push({ path: '/safework/firework/v2/detail', query: { id: newId } })
  } catch (e) {
    console.error('提交失败', e)
    proxy.$modal.msgError('提交失败')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  await loadUsers()
  if (ticketId.value) {
    await loadDetail()
  }
})
</script>

<script lang="ts">
import { ElMessage } from 'element-plus'
export default { name: 'WorkTicketApply' }
</script>

<style scoped>
.mt-4 { margin-top: 16px; }
.mb-4 { margin-bottom: 16px; }

.sticky-footer {
  position: sticky;
  bottom: 0;
  background: #fff;
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 12px;
  justify-content: center;
  z-index: 10;
}
</style>
