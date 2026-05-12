<template>
  <div class="page">
    <van-nav-bar title="隐患详情" left-arrow @click-left="$router.back()" fixed />

    <div class="content">
      <!-- 隐患信息 -->
      <van-cell-group inset title="隐患信息">
        <van-cell title="隐患编号" :value="detail.inspection_no || '-'" />
        <van-cell title="隐患描述" :value="detail.hazard_description" />
        <van-cell title="风险等级">
          <template #value>
            <van-tag :type="getLevelTag(detail.hazard_level)">{{ getLevelText(detail.hazard_level) }}</van-tag>
          </template>
        </van-cell>
        <van-cell title="隐患位置" :value="detail.location || '-'" />
        <van-cell title="所属部门" :value="detail.department || '-'" />
        <van-cell title="发现人" :value="detail.discoverer_name || '-'" />
        <van-cell title="发现时间" :value="detail.discovery_time || detail.created_at || '-'" />
        <van-cell title="状态">
          <template #value>
            <van-tag :type="getStatusTag(detail.status)">{{ getStatusText(detail.status) }}</van-tag>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 整改信息 -->
      <van-cell-group v-if="detail.rectification_measure || detail.rectification_responsible" inset title="整改信息">
        <van-cell title="整改措施" :value="detail.rectification_measure || '-'" />
        <van-cell title="整改责任人" :value="detail.rectification_responsible || '-'" />
        <van-cell title="整改期限" :value="detail.rectification_deadline || '-'" />
        <van-cell v-if="detail.rectification_time" title="整改完成时间" :value="detail.rectification_time" />
      </van-cell-group>

      <!-- 验收信息 -->
      <van-cell-group v-if="detail.verification_result || detail.verifier_name" inset title="验收信息">
        <van-cell title="验收人" :value="detail.verifier_name || '-'" />
        <van-cell title="验收结果" :value="detail.verification_result || '-'" />
        <van-cell v-if="detail.verification_time" title="验收时间" :value="detail.verification_time" />
      </van-cell-group>

      <!-- 操作按钮 -->
      <div v-if="canRectify || canAccept" class="action-btns">
        <!-- 整改表单 -->
        <template v-if="canRectify && !showRectifyForm">
          <van-button type="warning" block round @click="showRectifyForm = true">整改</van-button>
        </template>
        <template v-if="canRectify && showRectifyForm">
          <van-form @submit="doRectify">
            <van-cell-group inset>
              <van-field v-model="rectifyForm.measure" label="整改措施" type="textarea" rows="3" placeholder="请填写整改措施" :rules="[{ required: true, message: '请填写整改措施' }]" />
              <van-field v-model="rectifyForm.responsible" label="责任人" placeholder="请输入责任人" />
              <van-field v-model="rectifyForm.deadline" label="整改期限" placeholder="选择日期" readonly is-link @click="showDeadDate = true" />
            </van-cell-group>
            <div style="margin: 16px;">
              <van-button block round type="warning" native-type="submit" :loading="loading">提交整改</van-button>
            </div>
          </van-form>
        </template>

        <!-- 验收表单 -->
        <template v-if="canAccept && !showAcceptForm">
          <van-button type="success" block round style="margin-top:10px" @click="showAcceptForm = true">验收</van-button>
        </template>
        <template v-if="canAccept && showAcceptForm">
          <van-form @submit="doAccept">
            <van-cell-group inset>
              <van-field v-model="acceptForm.result" name="result" label="验收结果" placeholder="请选择">
                <template #input>
                  <van-radio-group v-model="acceptForm.result" direction="horizontal">
                    <van-radio name="通过">通过</van-radio>
                    <van-radio name="不通过">不通过</van-radio>
                  </van-radio-group>
                </template>
              </van-field>
              <van-field v-model="acceptForm.comment" label="验收意见" type="textarea" rows="2" placeholder="请输入验收意见" />
            </van-cell-group>
            <div style="margin: 16px;">
              <van-button block round type="success" native-type="submit" :loading="loading">确认验收</van-button>
            </div>
          </van-form>
        </template>
      </div>
    </div>

    <van-calendar v-model:show="showDeadDate" @confirm="onDeadDate" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { getHazardDetail, rectifyHazard, acceptHazard } from '../../api/hazards'

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id)
const detail = ref({})
const loading = ref(false)
const showRectifyForm = ref(false)
const showAcceptForm = ref(false)
const showDeadDate = ref(false)

const rectifyForm = ref({ measure: '', responsible: '', deadline: '' })
const acceptForm = ref({ result: '通过', comment: '' })

const status = computed(() => detail.value.status)
const canRectify = computed(() => status.value === 1)
const canAccept = computed(() => status.value === 2)

function getLevelTag(l) { return l === 'major' ? 'danger' : l === 'general' ? 'warning' : 'primary' }
function getLevelText(l) { return l === 'major' ? '重大' : l === 'general' ? '一般' : '低风险' }
function getStatusTag(s) {
  if (s === 1) return 'warning'
  if (s === 2) return 'primary'
  if (s === 3) return 'success'
  return 'default'
}
function getStatusText(s) {
  if (s === 1) return '待整改'
  if (s === 2) return '已整改待验收'
  if (s === 3) return '已验收'
  return '未知'
}

function onDeadDate(date) {
  const d = new Date(date)
  rectifyForm.value.deadline = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
  showDeadDate.value = false
}

function doRectify() {
  loading.value = true
  rectifyHazard(id.value, {
    rectification_measure: rectifyForm.value.measure,
    rectification_responsible: rectifyForm.value.responsible,
    rectification_deadline: rectifyForm.value.deadline
  }).then(() => {
    showToast('整改已提交')
    loadDetail()
    showRectifyForm.value = false
  }).catch(err => showToast(err.message || '整改失败')).finally(() => { loading.value = false })
}

function doAccept() {
  loading.value = true
  acceptHazard(id.value, {
    verification_result: acceptForm.value.result,
    comment: acceptForm.value.comment
  }).then(() => {
    showToast('验收完成')
    loadDetail()
    showAcceptForm.value = false
  }).catch(err => showToast(err.message || '验收失败')).finally(() => { loading.value = false })
}

function loadDetail() {
  getHazardDetail(id.value).then(res => {
    detail.value = res.data || res || {}
  }).catch(() => {})
}

onMounted(() => {
  if (!localStorage.getItem('token')) {
    router.push('/login')
  } else {
    loadDetail()
  }
})
</script>

<style scoped>
.content { padding: 56px 0 20px; }
.action-btns { padding: 20px 16px; }
</style>
