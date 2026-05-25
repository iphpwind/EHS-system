<template>
  <div class="app-container">
    <el-card>
      <div class="flex justify-between mb-4">
        <el-input v-model="query.keyword" placeholder="课程名称" style="width: 240px" />
        <el-button type="primary" @click="handleAdd">新增课程</el-button>
      </div>

      <el-table :data="tableData" v-loading="loading">
        <el-table-column prop="title" label="课程名称" />
        <el-table-column prop="duration" label="时长(分钟)" width="120" />
        <el-table-column prop="categoryName" label="分类" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{row}">
            <el-tag :type="row.status === 'published' ? 'success' : 'info'">
              {{ row.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{row}">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="success" link @click="handlePreview(row)">预览</el-button>
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

    <!-- 课程管理对话框（集成视频上传功能） -->
    <course-dialog
      v-model:visible="dialogVisible"
      :course="currentCourse"
      @success="onDialogSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCourses, deleteCourse } from '@/api/training'
import type { QueryParams, Course } from './types'
import CourseDialog from './CourseDialog.vue'

const tableData = ref([])
const loading = ref(false)
const total = ref(0)
const query = ref<QueryParams>({ page: 1, limit: 10, keyword: '' })

// 控制对话框
const dialogVisible = ref(false)
const currentCourse = ref<Course>({})

const getList = async () => {
  loading.value = true
  try {
    const res = await getCourses(query.value)
    tableData.value = res.data || []
    total.value = res.total || 0
  } catch (error) {
    console.error('获取课程列表失败:', error)
    ElMessage.error('获取课程列表失败')
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  currentCourse.value = {}
  dialogVisible.value = true
}

const handleEdit = (row: Course) => {
  currentCourse.value = { ...row }
  dialogVisible.value = true
}

const handlePreview = (row: Course) => {
  // 跳转到课程学习页面
  window.open(`/training/study?courseId=${row.id}`, '_blank')
}

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定删除此课程吗？', '提示', { type: 'warning' })
    await deleteCourse(id)
    ElMessage.success('删除成功')
    getList()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error(error.message || '删除失败')
    }
  }
}

const onDialogSuccess = () => {
  dialogVisible.value = false
  getList()
}

onMounted(getList)
</script>
