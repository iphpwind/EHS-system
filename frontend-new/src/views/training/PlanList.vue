<template>
  <div class="app-container">
    <el-card>
      <div class="flex justify-between mb-4">
        <el-input v-model="query.name" placeholder="计划名称" style="width: 240px" />
        <el-button type="primary" @click="handleAdd">新增计划</el-button>
      </div>

      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="name" label="计划名称" />
        <el-table-column prop="courseCount" label="课程数" width="100" />
        <el-table-column prop="startDate" label="开始日期" width="120" />
        <el-table-column prop="endDate" label="结束日期" width="120" />
        <el-table-column label="完成进度" width="200">
          <template #default="{row}">
            <el-progress :percentage="row.progress || 0" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="{row}">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="success" link @click="startTraining(row)">开始培训</el-button>
            <el-popconfirm title="确定删除？" @confirm="handleDelete(row.id)">
              <template #reference>
                <el-button type="danger" link>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="query.page" @pagination="getList" />
    </el-card>

    <!-- 新增/编辑培训计划对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="560px" destroy-on-close>
      <el-form ref="formRef" :model="formData" label-width="100px" @submit.prevent>
        <el-form-item label="计划名称" prop="name" :rules="[{ required: true, message: '请输入计划名称', trigger: 'blur' }]">
          <el-input v-model="formData.name" placeholder="请输入培训计划名称" maxlength="100" />
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker v-model="formData.startDate" type="date" value-format="YYYY-MM-DD" placeholder="选择开始日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker v-model="formData.endDate" type="date" value-format="YYYY-MM-DD" placeholder="选择结束日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="计划描述" prop="description">
          <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入计划描述" maxlength="500" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="dialogLoading" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTrainingPlans, deleteTrainingPlan, createTrainingPlan, updateTrainingPlan } from '@/api/training'
import type { QueryParams } from './types'

const router = useRouter()
const tableData = ref([])
const loading = ref(false)
const total = ref(0)
const query = ref<QueryParams>({ page: 1, limit: 10, keyword: '' })
const formRef = ref()   // 表单引用，用于校验

// 新增/编辑对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增培训计划')
const dialogLoading = ref(false)
const formData = ref({
  id: null as number | null,
  name: '',
  startDate: '',
  endDate: '',
  description: ''
})

const getList = async () => {
  loading.value = true
  try {
    const res = await getTrainingPlans(query.value)
    tableData.value = res.data || []
    total.value = res.total || 0
  } catch (error) {
    console.error('获取培训计划列表失败:', error)
    ElMessage.error('获取培训计划列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 新增培训计划：打开对话框
 */
const handleAdd = () => {
  dialogTitle.value = '新增培训计划'
  formData.value = { id: null, name: '', startDate: '', endDate: '', description: '' }
  dialogVisible.value = true
}

/**
 * 编辑培训计划：打开对话框并填充数据
 */
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑培训计划'
  formData.value = { ...row }
  dialogVisible.value = true
}

/**
 * 提交表单：校验后调用新增或编辑 API
 */
const submitForm = async () => {
  // 表单校验
  try {
    await formRef.value.validate()
  } catch {
    return  // 校验失败，不提交
  }

  dialogLoading.value = true
  try {
    const payload = {
      name: formData.value.name,
      startDate: formData.value.startDate,
      endDate: formData.value.endDate,
      description: formData.value.description
    }
    if (formData.value.id) {
      await updateTrainingPlan(formData.value.id, payload)
      ElMessage.success('编辑成功')
    } else {
      await createTrainingPlan(payload)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    getList()   // 刷新列表
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  } finally {
    dialogLoading.value = false
  }
}

/**
 * 重置表单
 */
const resetForm = () => {
  formRef.value?.resetFields()
  formData.value = { id: null, name: '', startDate: '', endDate: '', description: '' }
}

/**
 * 跳转到培训详情页
 */
const startTraining = (row: any) => {
  router.push({
    path: '/training/plan/detail',
    query: { id: row.id }
  })
}

const handleDelete = async (id: number) => {
  try {
    await deleteTrainingPlan(id)
    ElMessage.success('删除成功')
    getList()
  } catch (error) {
    console.error('删除失败:', error)
    ElMessage.error('删除失败')
  }
}

onMounted(getList)
</script>
