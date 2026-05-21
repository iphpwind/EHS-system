<template>
  <div class="app-container">
    <el-card>
      <h2 class="mb-4">我的培训</h2>

      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="进行中" name="ongoing" />
        <el-tab-pane label="已完成" name="completed" />
        <el-tab-pane label="未开始" name="not_started" />
      </el-tabs>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <el-card v-for="item in trainingList" :key="item.id" class="training-card">
          <h3>{{ item.planName }}</h3>
          <p class="text-gray-500 text-sm mt-2">{{ item.courseName }}</p>
          <el-progress 
            :percentage="item.progress || 0" 
            class="mt-2"
          />
          <div class="flex justify-between mt-4">
            <el-tag :type="item.status === 'completed' ? 'success' : 'primary'">
              {{ statusMap[item.status] }}
            </el-tag>
            <el-button 
              v-if="item.status !== 'completed'" 
              type="primary" 
              size="small"
              @click="continueLearning(item)"
            >
              继续学习
            </el-button>
            <el-button 
              v-else 
              type="success" 
              size="small"
              @click="downloadCertificate(item)"
            >
              下载证书
            </el-button>
          </div>
        </el-card>
      </div>

      <el-empty v-if="trainingList.length === 0" description="暂无培训记录" />

      <pagination 
        v-show="total > 0" 
        :total="total" 
        v-model:page="query.page" 
        @pagination="getList" 
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getTrainingRecords } from '@/api/training'
import type { QueryParams } from './types'

const router = useRouter()
const activeTab = ref('ongoing')
const trainingList = ref([])
const total = ref(0)
const query = ref<QueryParams>({ page: 1, limit: 10 })

const statusMap: Record<string, string> = {
  'not_started': '未开始',
  'in_progress': '进行中',
  'completed': '已完成'
}

const getList = async () => {
  try {
    const res = await getTrainingRecords({
      ...query.value,
      status: activeTab.value === 'ongoing' ? 'in_progress' : 
               activeTab.value === 'completed' ? 'completed' : 'not_started'
    })
    trainingList.value = res.data || []
    total.value = res.total || 0
  } catch (error) {
    console.error('获取培训记录失败:', error)
    ElMessage.error('获取培训记录失败')
  }
}

const handleTabChange = () => {
  query.value.page = 1
  getList()
}

/**
 * 继续学习：跳转到课程学习页
 * @param item 培训记录项
 */
const continueLearning = (item: any) => {
  // 跳转到课程学习页面，携带培训记录ID和课程ID
  router.push({
    path: '/training/course/study',
    query: {
      recordId: item.id,
      courseId: item.courseId,
      planId: item.planId
    }
  })
}

/**
 * 下载证书：根据培训记录ID请求后端生成并下载PDF证书
 * @param item 培训记录项
 */
const downloadCertificate = async (item: any) => {
  if (!item.id) {
    ElMessage.warning('培训记录ID不存在，无法下载证书')
    return
  }
  try {
    // 调用后端证书下载接口（需后端实现 /api/training/certificate/download）
    const link = document.createElement('a')
    link.href = `/api/training/certificate/download?id=${item.id}`
    link.download = `培训证书_${item.planName || item.courseName || item.id}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    ElMessage.success('证书下载已触发')
  } catch (error) {
    console.error('下载证书失败:', error)
    ElMessage.error('下载证书失败，请稍后重试')
  }
}

onMounted(getList)
</script>
