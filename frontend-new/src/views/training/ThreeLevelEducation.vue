<template>
  <div class="three-level-education">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="title">三级安全教育档案</span>
          <el-button type="primary" @click="handleAdd" v-hasPermi="['training:threeLevel:add']">
            <el-icon><Plus /></el-icon> 新建档案
          </el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
        <el-form-item label="员工姓名" prop="employeeName">
          <el-input v-model="queryParams.employeeName" placeholder="请输入员工姓名" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="所属部门" prop="deptId">
          <tree-select
            v-model:value="queryParams.deptId"
            :options="deptOptions"
            placeholder="请选择部门"
            :objMap="{ value: 'id', label: 'label', children: 'children' }"
          />
        </el-form-item>
        <el-form-item label="教育状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="未完成" value="in_progress" />
            <el-option label="已完成" value="completed" />
            <el-option label="已过期" value="expired" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 标签页切换三级 -->
      <el-tabs v-model="activeLevel" @tab-change="handleLevelChange">
        <el-tab-pane label="公司级安全教育" name="company" />
        <el-tab-pane label="部门级安全教育" name="department" />
        <el-tab-pane label="班组级安全教育" name="team" />
      </el-tabs>

      <!-- 数据表格 -->
      <el-table :data="tableData" v-loading="loading" border style="width: 100%">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="员工姓名" prop="employeeName" width="120" align="center" />
        <el-table-column label="所属部门" prop="deptName" width="150" align="center" />
        <el-table-column label="岗位" prop="position" width="120" align="center" />
        <el-table-column :label="levelLabel + '教育内容'" prop="courseName" min-width="200" />
        <el-table-column label="教育日期" prop="educationDate" width="120" align="center" />
        <el-table-column label="教育时长(小时)" prop="duration" width="110" align="center" />
        <el-table-column label="考核成绩" prop="score" width="100" align="center">
          <template #default="{row}">
            <el-tag :type="row.score >= 80 ? 'success' : row.score >= 60 ? 'warning' : 'danger'">
              {{ row.score || '--' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="教育人" prop="educatorName" width="100" align="center" />
        <el-table-column label="状态" prop="status" width="100" align="center">
          <template #default="{row}">
            <el-tag :type="statusType(row.status)">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{row}">
            <el-button type="primary" link @click="handleView(row)">查看</el-button>
            <el-button type="success" link @click="handleEdit(row)" v-if="row.status !== 'completed'">编辑</el-button>
            <el-button type="warning" link @click="handleAssess(row)" v-if="row.status === 'in_progress'">考核</el-button>
            <el-button type="info" link @click="handleCertificate(row)" v-if="row.status === 'completed'">证书</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog :title="title" v-model="open" width="800px" append-to-body>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="员工" prop="employeeId">
              <el-select v-model="form.employeeId" placeholder="请选择员工" filterable :disabled="form.id != null">
                <el-option v-for="item in employeeOptions" :key="item.id" :label="item.real_name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属部门" prop="deptId">
              <tree-select
                v-model:value="form.deptId"
                :options="deptOptions"
                placeholder="请选择部门"
                :objMap="{ value: 'id', label: 'label', children: 'children' }"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="教育级别" prop="educationLevel">
              <el-select v-model="form.educationLevel" placeholder="请选择" :disabled="form.id != null">
                <el-option label="公司级" value="company" />
                <el-option label="部门级" value="department" />
                <el-option label="班组级" value="team" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教育课程" prop="courseId">
              <el-select v-model="form.courseId" placeholder="请选择课程" filterable>
                <el-option v-for="item in courseOptions" :key="item.id" :label="item.title" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="教育日期" prop="educationDate">
              <el-date-picker v-model="form.educationDate" type="date" value-format="YYYY-MM-DD" placeholder="请选择日期" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教育时长(小时)" prop="duration">
              <el-input-number v-model="form.duration" :min="0.5" :max="100" :step="0.5" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="教育人" prop="educatorId">
              <el-select v-model="form.educatorId" placeholder="请选择教育人" filterable>
                <el-option v-for="item in educatorOptions" :key="item.id" :label="item.real_name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="考核成绩" prop="score" v-if="form.status === 'completed'">
              <el-input-number v-model="form.score" :min="0" :max="100" :step="1" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="教育内容摘要" prop="contentSummary">
          <el-input v-model="form.contentSummary" type="textarea" :rows="3" placeholder="请输入教育内容摘要" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="open = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </template>
    </el-dialog>

    <!-- 考核对话框 -->
    <el-dialog title="三级教育考核" v-model="assessOpen" width="600px" append-to-body>
      <el-form ref="assessRef" :model="assessForm" :rules="assessRules" label-width="100px">
        <el-form-item label="员工姓名">
          <span>{{ assessForm.employeeName }}</span>
        </el-form-item>
        <el-form-item label="教育级别">
          <el-tag>{{ levelLabel }}</el-tag>
        </el-form-item>
        <el-form-item label="考核成绩" prop="score">
          <el-input-number v-model="assessForm.score" :min="0" :max="100" :step="1" />
          <span style="margin-left:8px">分（满分100）</span>
        </el-form-item>
        <el-form-item label="考核结果" prop="assessResult">
          <el-radio-group v-model="assessForm.assessResult">
            <el-radio label="pass">合格</el-radio>
            <el-radio label="fail">不合格</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="考核意见" prop="assessComment">
          <el-input v-model="assessForm.assessComment" type="textarea" :rows="3" placeholder="请输入考核意见" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assessOpen = false">取 消</el-button>
        <el-button type="primary" @click="handleAssessSubmit">提交考核</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { listThreeLevel, addThreeLevel, updateThreeLevel, assessThreeLevel, getThreeLevelDetail } from '@/api/trainingCompliance'
import { listUsers } from '@/api/system/user'
import { getCourses as listCourses } from '@/api/training'
import { getDeptTree } from '@/api/system/dept'

const { proxy } = getCurrentInstance() as any

const activeLevel = ref('company')
const loading = ref(false)
const showSearch = ref(true)
const open = ref(false)
const assessOpen = ref(false)
const title = ref('')
const tableData = ref([])
const total = ref(0)
const deptOptions = ref([])
const employeeOptions = ref([])
const educatorOptions = ref([])
const courseOptions = ref([])

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  employeeName: '',
  deptId: null,
  status: '',
  educationLevel: 'company'
})

const formRef = ref()
const assessRef = ref()
const form = reactive({
  id: null as number | null,
  employeeId: null as number | null,
  deptId: null as number | null,
  educationLevel: 'company',
  courseId: null as number | null,
  educatorId: null as number | null,
  educationDate: '',
  duration: 2,
  score: null as number | null,
  status: 'in_progress',
  contentSummary: '',
  remark: ''
})

const assessForm = reactive({
  id: null as number | null,
  employeeName: '',
  score: 0,
  assessResult: 'pass',
  assessComment: ''
})

const levelLabel = computed(() => {
  const map: Record<string, string> = { company: '公司级', department: '部门级', team: '班组级' }
  return map[activeLevel.value] || ''
})

const rules = {
  employeeId: [{ required: true, message: '请选择员工', trigger: 'change' }],
  educationLevel: [{ required: true, message: '请选择教育级别', trigger: 'change' }],
  courseId: [{ required: true, message: '请选择课程', trigger: 'change' }],
  educatorId: [{ required: true, message: '请选择教育人', trigger: 'change' }],
  educationDate: [{ required: true, message: '请选择教育日期', trigger: 'change' }]
}

const assessRules = {
  score: [{ required: true, message: '请输入考核成绩', trigger: 'blur' }],
  assessResult: [{ required: true, message: '请选择考核结果', trigger: 'change' }]
}

function statusType(status: string) {
  const map: Record<string, string> = { in_progress: 'warning', completed: 'success', expired: 'danger' }
  return map[status] || 'info'
}

function statusText(status: string) {
  const map: Record<string, string> = { in_progress: '进行中', completed: '已完成', expired: '已过期' }
  return map[status] || status
}

async function getList() {
  loading.value = true
  try {
    queryParams.educationLevel = activeLevel.value
    const res = await listThreeLevel(queryParams)
    tableData.value = res.data?.rows || []
    total.value = res.data?.total || 0
  } finally {
    loading.value = false
  }
}

function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

function resetQuery() {
  proxy.$refs.queryRef.resetFields()
  handleQuery()
}

function handleLevelChange() {
  queryParams.pageNum = 1
  getList()
}

function handleAdd() {
  resetForm()
  title.value = '新增' + levelLabel.value + '安全教育'
  open.value = true
}

function handleEdit(row: any) {
  resetForm()
  getThreeLevelDetail(row.id).then(res => {
    Object.assign(form, res.data)
    title.value = '编辑' + levelLabel.value + '安全教育'
    open.value = true
  })
}

function handleView(row: any) {
  getThreeLevelDetail(row.id).then(res => {
    Object.assign(form, res.data)
    title.value = '查看' + levelLabel.value + '安全教育'
    open.value = true
  })
}

function handleAssess(row: any) {
  assessForm.id = row.id
  assessForm.employeeName = row.employeeName
  assessForm.score = row.score || 0
  assessForm.assessResult = row.score >= 60 ? 'pass' : 'fail'
  assessForm.assessComment = ''
  assessOpen.value = true
}

async function handleCertificate(row: any) {
  ElMessage.info('证书下载功能开发中...')
}

async function handleSubmit() {
  await formRef.value?.validate()
  if (form.id) {
    await updateThreeLevel(form)
    ElMessage.success('修改成功')
  } else {
    await addThreeLevel(form)
    ElMessage.success('新增成功')
  }
  open.value = false
  getList()
}

async function handleAssessSubmit() {
  await assessRef.value?.validate()
  await assessThreeLevel(assessForm)
  ElMessage.success('考核完成')
  assessOpen.value = false
  getList()
}

function resetForm() {
  form.id = null
  form.employeeId = null
  form.deptId = null
  form.educationLevel = activeLevel.value
  form.courseId = null
  form.educatorId = null
  form.educationDate = ''
  form.duration = 2
  form.score = null
  form.status = 'in_progress'
  form.contentSummary = ''
  form.remark = ''
}

async function loadOptions() {
  const [deptRes, userRes, courseRes] = await Promise.all([
    getDeptTree(),
    listUsers({ pageSize: 9999 }),
    listCourses({ pageSize: 9999, status: 'published' })
  ])
  deptOptions.value = deptRes.data || []
  employeeOptions.value = userRes.data?.rows || []
  educatorOptions.value = userRes.data?.rows || []
  courseOptions.value = courseRes.data?.rows || []
}

onMounted(() => {
  loadOptions()
  getList()
})
</script>

<style scoped>
.three-level-education { padding: 20px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.title { font-size: 18px; font-weight: bold; }
</style>
