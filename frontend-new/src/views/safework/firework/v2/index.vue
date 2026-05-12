<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="票号" prop="keyword">
        <el-input v-model="queryParams.keyword" placeholder="票号/区域" clearable />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="状态" clearable>
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
      <el-form-item label="动火等级" prop="fireLevel">
        <el-select v-model="queryParams.fireLevel" placeholder="等级" clearable>
          <el-option label="特级" :value="1" />
          <el-option label="一级" :value="2" />
          <el-option label="二级" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        <el-button type="success" icon="Plus" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="票号" align="center" prop="ticket_no" width="180" />
      <el-table-column label="申请人" align="center" prop="applicant_name" width="100" />
      <el-table-column label="部门" align="center" prop="dept_name" width="120" />
      <el-table-column label="动火等级" align="center" width="90">
        <template #default="{ row }">
          <el-tag :type="row.fire_level===1?'danger':row.fire_level===2?'warning':'success'">{{ row.fireLevelText }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="动火区域" align="center" prop="fire_area" show-overflow-tooltip />
      <el-table-column label="作业地点" align="center" prop="work_location" show-overflow-tooltip />
      <el-table-column label="状态" align="center" width="120">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.main_status)">{{ row.statusText }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="created_at" width="160">
        <template #default="{ row }">{{ parseTime(row.created_at) }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="320" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" icon="View" @click="handleDetail(row)">详情</el-button>
          <el-button link type="success" icon="Check" v-if="canApprove(row)" @click="handleApprove(row)">审批</el-button>
          <el-button link type="warning" icon="Edit" v-if="canEdit(row)" @click="handleUpdate(row)">编辑</el-button>
          <el-button link type="danger" icon="Delete" v-if="canDelete(row)" @click="handleDelete(row)">删除</el-button>
          <el-button link type="info" icon="Download" @click="handleExport(row)">PDF</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 新增/编辑 -->
    <el-dialog :title="title" v-model="open" width="700px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="form.projectName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="动火等级" prop="fireLevel">
              <el-select v-model="form.fireLevel" style="width:100%">
                <el-option label="特级" :value="1" />
                <el-option label="一级" :value="2" />
                <el-option label="二级" :value="3" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="作业地点" prop="workLocation">
          <el-input v-model="form.workLocation" />
        </el-form-item>
        <el-form-item label="动火区域" prop="fireArea">
          <el-input v-model="form.fireArea" />
        </el-form-item>
        <el-form-item label="动火方式" prop="fireType">
          <el-input v-model="form.fireType" placeholder="如：气焊、电焊、切割等" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="计划开始" prop="startTime">
              <el-date-picker v-model="form.startTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划结束" prop="endTime">
              <el-date-picker v-model="form.endTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="作业内容" prop="workContent">
          <el-input v-model="form.workContent" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="风险分析" prop="riskAnalysis">
          <el-input v-model="form.riskAnalysis" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="安全措施" prop="safetyMeasures">
          <el-input v-model="form.safetyMeasures" type="textarea" :rows="2" placeholder="JSON格式或文本描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="open=false">取 消</el-button>
      </template>
    </el-dialog>

    <!-- 审批弹窗 -->
    <el-dialog title="审批操作" v-model="approveOpen" width="500px" append-to-body>
      <el-form :model="approveForm" label-width="80px">
        <el-form-item label="操作">
          <el-radio-group v-model="approveForm.action">
            <el-radio-button label="dept">部门审批</el-radio-button>
            <el-radio-button label="safety">安全审批</el-radio-button>
            <el-radio-button label="final">最终批准</el-radio-button>
            <el-radio-button label="reject">驳回</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="意见">
          <el-input v-model="approveForm.comment" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submitApprove">确 定</el-button>
        <el-button @click="approveOpen=false">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="HotWorkV2">
import { ref, reactive, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { listHotWork, addHotWork, updateHotWork, delFirework, submitHotWork, approveHotWork, exportHotWorkPDF } from '@/api/hotWork'
import { parseTime } from '@/utils/ruoyi'

const { proxy } = getCurrentInstance()
const router = useRouter()

const loading = ref(false)
const showSearch = ref(true)
const list = ref([])
const total = ref(0)
const open = ref(false)
const title = ref('')
const approveOpen = ref(false)
const approveRow = ref(null)

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  keyword: '',
  status: undefined,
  fireLevel: undefined
})

const form = reactive({})
const rules = {
  projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  workLocation: [{ required: true, message: '请输入作业地点', trigger: 'blur' }],
  fireLevel: [{ required: true, message: '请选择动火等级', trigger: 'change' }],
  fireArea: [{ required: true, message: '请输入动火区域', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
}

const approveForm = reactive({ action: 'dept', comment: '' })

function statusTagType(status) {
  const map = { 1: 'info', 2: '', 3: 'primary', 4: 'primary', 5: 'success', 6: 'warning', 7: 'warning', 8: 'danger' }
  return map[status] || ''
}

function canEdit(row) {
  return row.main_status === '1' || row.main_status === 'draft'
}
function canDelete(row) {
  return row.main_status === '1' || row.main_status === 'draft'
}
function canApprove(row) {
  return ['2','3','4','5'].includes(String(row.main_status))
}

function getList() {
  loading.value = true
  listHotWork(queryParams).then(res => {
    list.value = res.data || []
    total.value = res.total || 0
    loading.value = false
  }).catch(() => { loading.value = false })
}

function handleQuery() {
  queryParams.pageNum = 1
  getList()
}
function resetQuery() {
  proxy.resetForm('queryRef')
  handleQuery()
}
function handleSelectionChange() {}

function reset() {
  Object.assign(form, {
    id: null, projectName: '', workLocation: '', workContent: '',
    startTime: '', endTime: '', fireLevel: 2, fireArea: '', fireType: '',
    riskAnalysis: '', safetyMeasures: ''
  })
}
function handleAdd() {
  reset()
  open.value = true
  title.value = '新增动火作业'
}
function handleUpdate(row) {
  reset()
  form.id = row.id
  form.projectName = row.project_name
  form.workLocation = row.work_location
  form.workContent = row.work_content
  form.fireLevel = row.fire_level
  form.fireArea = row.fire_area
  form.fireType = row.fire_type
  form.riskAnalysis = row.risk_analysis
  form.startTime = row.start_time
  form.endTime = row.end_time
  open.value = true
  title.value = '修改动火作业'
}
function submitForm() {
  proxy.$refs.formRef.validate(valid => {
    if (!valid) return
    if (form.id) {
      updateHotWork(form.id, form).then(() => {
        proxy.$modal.msgSuccess('修改成功')
        open.value = false
        getList()
      })
    } else {
      addHotWork(form).then(() => {
        proxy.$modal.msgSuccess('新增成功')
        open.value = false
        getList()
      })
    }
  })
}
function handleDelete(row) {
  proxy.$modal.confirm('确认删除该动火作业？').then(() => {
    return delFirework(row.id)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess('删除成功')
  }).catch(() => {})
}

function handleDetail(row) {
  router.push({ path: '/safework/firework/v2/detail', query: { id: row.id } })
}

function handleApprove(row) {
  approveRow.value = row
  approveForm.action = 'dept'
  approveForm.comment = ''
  approveOpen.value = true
}
function submitApprove() {
  approveHotWork(approveRow.value.id, { action: approveForm.action, comment: approveForm.comment }).then(() => {
    proxy.$modal.msgSuccess('审批操作成功')
    approveOpen.value = false
    getList()
  })
}

function handleExport(row) {
  exportHotWorkPDF(row.id).then(res => {
    const blob = new Blob([res], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hot_work_${row.ticket_no}.pdf`
    a.click()
    window.URL.revokeObjectURL(url)
  })
}

getList()
</script>
