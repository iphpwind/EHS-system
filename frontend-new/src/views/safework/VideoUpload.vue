<template>
  <div class="video-upload-container">
    <el-upload
      ref="uploadRef"
      :action="uploadUrl"
      :headers="headers"
      :data="{ ticketId: ticketId }"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-progress="handleProgress"
      :before-upload="beforeUpload"
      :show-file-list="false"
      :disabled="uploading"
      accept="video/*"
    >
      <el-button type="primary" :loading="uploading">
        <el-icon><Upload /></el-icon>
        {{ uploading ? '上传中...' + uploadProgress + '%' : '上传监控视频' }}
      </el-button>
    </el-upload>

    <!-- 视频预览 -->
    <div v-if="videoUrl" class="video-preview">
      <video
        :src="videoUrl"
        controls
        style="max-width: 100%; max-height: 300px"
      />
      <div class="video-actions">
        <el-button type="primary" link @click="handlePreview">
          <el-icon><VideoPlay /></el-icon>
          全屏预览
        </el-button>
        <el-button type="danger" link @click="handleDelete">
          <el-icon><Delete /></el-icon>
          删除视频
        </el-button>
      </div>
    </div>

    <!-- 上传提示 -->
    <div class="upload-tip">
      <el-alert
        title="仅支持MP4、MOV、AVI、MKV、WEBM格式，大小不超过500MB"
        type="info"
        :closable="false"
        show-icon
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload, Delete, VideoPlay } from '@element-plus/icons-vue'
import { getToken } from '@/utils/auth'

const props = defineProps({
  ticketId: {
    type: [String, Number],
    required: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'success'])

const uploadRef = ref(null)
const uploading = ref(false)
const uploadProgress = ref(0)

// 上传地址
const uploadUrl = computed(() => {
  const baseUrl = (import.meta as any).env?.VITE_APP_BASE_API || ''
  return `${baseUrl}/api/tickets/${props.ticketId}/upload-video`
})

// 上传请求头（携带Token）
const headers = computed(() => {
  return {
    Authorization: 'Bearer ' + getToken(),
  }
})

// 视频 URL
const videoUrl = computed(() => {
  if (!props.modelValue) return ''
  const baseUrl = (import.meta as any).env?.VITE_APP_BASE_API || ''
  return props.modelValue.startsWith('http') ? props.modelValue : baseUrl + props.modelValue
})

// 上传前校验
const beforeUpload = (file) => {
  const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm']
  if (!allowedTypes.includes(file.type)) {
    ElMessage.error('仅支持MP4、MOV、AVI、MKV、WEBM格式！')
    return false
  }
  
  const isLt500M = file.size / 1024 / 1024 < 500
  if (!isLt500M) {
    ElMessage.error('视频大小不能超过500MB！')
    return false
  }
  
  uploading.value = true
  uploadProgress.value = 0
  return true
}

// 上传成功
const handleSuccess = (response, file) => {
  uploading.value = false
  uploadProgress.value = 100
  
  if (response.success) {
    ElMessage.success('视频上传成功')
    emit('update:modelValue', response.data.fileUrl)
    emit('success', response.data)
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

// 上传失败
const handleError = (error, file) => {
  uploading.value = false
  console.error('视频上传失败:', error)
  ElMessage.error('视频上传失败，请重试')
}

// 上传进度
const handleProgress = (event, file) => {
  uploadProgress.value = Math.round(event.percent || 0)
}

// 全屏预览
const handlePreview = () => {
  if (!videoUrl.value) return
  window.open(videoUrl.value, '_blank')
}

// 删除视频
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定删除该监控视频吗？', '提示', {
      type: 'warning',
    })
    emit('update:modelValue', '')
    emit('success', { fileUrl: '' })
    ElMessage.success('视频已删除')
  } catch {
    // 取消删除
  }
}
</script>

<style scoped>
.video-upload-container {
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.video-preview {
  margin-top: 16px;
  text-align: center;
}

.video-actions {
  margin-top: 8px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

.upload-tip {
  margin-top: 12px;
}
</style>
