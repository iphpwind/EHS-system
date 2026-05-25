<template>
  <div class="video-upload-container">
    <el-upload
      ref="uploadRef"
      class="video-uploader"
      accept="video/*"
      :limit="limit"
      :on-exceed="handleExceed"
      :before-upload="beforeVideoUpload"
      :http-request="uploadToCOS"
      :on-remove="handleRemove"
      :on-preview="handlePreview"
      list-type="picture-card"
      :file-list="fileList"
    >
      <el-icon><Plus /></el-icon>
      <template #tip>
        <div class="el-upload__tip">
          只能上传视频文件，且不超过 500MB，最多 {{ limit }} 个文件<br>
          已集成腾讯云 COS 存储，支持断点续传
        </div>
      </template>
    </el-upload>

    <!-- 上传进度对话框 -->
    <el-dialog v-model="uploadDialogVisible" title="上传进度" width="500px" :closable="false" :mask-closable="false">
      <div v-for="(item, index) in uploadProgress" :key="index" class="mb-3">
        <div class="flex justify-between mb-1">
          <span>{{ item.fileName }}</span>
          <span>{{ item.percent }}%</span>
        </div>
        <el-progress :percentage="item.percent" :status="item.status" />
        <div v-if="item.speed" class="text-xs text-gray-400 mt-1">
          速度: {{ item.speed }} | 剩余: {{ item.remaining }}
        </div>
      </div>
    </el-dialog>

    <!-- 视频预览对话框 -->
    <el-dialog v-model="previewVisible" title="视频预览" width="800px">
      <video :src="previewUrl" controls style="width: 100%;" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import COS from 'cos-js-sdk-v5'

const props = defineProps({
  modelValue: {
    type: Array as () => string[],
    default: () => []
  },
  limit: {
    type: Number,
    default: 5
  },
  sectionId: {
    type: Number,
    default: null
  },
  courseId: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'upload-success', 'upload-error'])

const uploadRef = ref()
const fileList = ref<any[]>([])
const uploadDialogVisible = ref(false)
const previewVisible = ref(false)
const previewUrl = ref('')
const uploadProgress = ref<any[]>([])

// COS 客户端
let cosClient: any = null

// ============ 初始化 COS 客户端 ============
const initCOSClient = async () => {
  if (cosClient) return cosClient

  try {
    // 从后端获取临时密钥（推荐使用临时密钥，更安全）
    const res = await fetch('/api/training-video/cos/credentials', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(r => r.json())

    if (res.code !== 200) {
      throw new Error(res.message || '获取COS凭证失败')
    }

    cosClient = new COS.COS({
      getAuthorization: (options, callback) => {
        callback({
          TmpSecretId: res.data.tmpSecretId,
          TmpSecretKey: res.data.tmpSecretKey,
          XCosSecurityToken: res.data.sessionToken,
          ExpiredTime: res.data.expiredTime
        })
      }
    })

    return cosClient
  } catch (error) {
    console.error('初始化COS客户端失败:', error)
    ElMessage.error('初始化上传客户端失败')
    return null
  }
}

// ============ 上传前校验 ============
const beforeVideoUpload = (file: File) => {
  const isVideo = file.type.startsWith('video/')
  if (!isVideo) {
    ElMessage.error('只能上传视频文件！')
    return false
  }

  const isLt500M = file.size / 1024 / 1024 < 500
  if (!isLt500M) {
    ElMessage.error('上传视频大小不能超过 500MB！')
    return false
  }

  return true
}

// ============ 自定义上传：直传 COS ============
const uploadToCOS = async (options: any) => {
  const { file, onProgress, onSuccess, onError } = options

  try {
    const client = await initCOSClient()
    if (!client) {
      onError(new Error('上传客户端初始化失败'))
      return
    }

    // 生成唯一文件名
    const ext = file.name.split('.').pop()
    const key = `training/videos/${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${ext}`

    // 添加到上传进度列表
    const progressIndex = uploadProgress.value.length
    uploadProgress.value.push({
      fileName: file.name,
      percent: 0,
      status: 'active',
      speed: '',
      remaining: ''
    })
    uploadDialogVisible.value = true

    // 上传到 COS
    client.putObject({
      Bucket: import.meta.env.VITE_COS_BUCKET || 'your-bucket',
      Region: import.meta.env.VITE_COS_REGION || 'ap-guangzhou',
      Key: key,
      Body: file,
      onTaskReady: (taskId) => {
        // 任务创建成功，可以在这里暂停/恢复上传
      },
      onProgress: (progressData) => {
        const percent = Math.round(progressData.percent * 100)
        uploadProgress.value[progressIndex].percent = percent
        onProgress({ percent })
      }
    }, async (err, data) => {
      if (err) {
        console.error('上传到COS失败:', err)
        uploadProgress.value[progressIndex].status = 'exception'
        onError(err)
        ElMessage.error('上传失败')
      } else {
        // 上传成功
        const videoUrl = `https://${data.Bucket}.cos.${data.Region}.myqcloud.com/${data.Key}`
        
        // 通知后端记录
        await fetch('/api/training-video/upload-success', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            videoUrl,
            fileName: file.name,
            fileSize: file.size,
            sectionId: props.sectionId,
            courseId: props.courseId
          })
        })

        // 更新文件列表
        fileList.value.push({
          name: file.name,
          url: videoUrl
        })

        // 更新 v-model
        const urls = fileList.value.map(f => f.url)
        emit('update:modelValue', urls)
        emit('upload-success', { url: videoUrl, file })

        uploadProgress.value[progressIndex].percent = 100
        uploadProgress.value[progressIndex].status = 'success'
        
        // 如果所有上传都完成，关闭对话框
        if (uploadProgress.value.every(p => p.status === 'success' || p.status === 'exception')) {
          setTimeout(() => {
            uploadDialogVisible.value = false
            uploadProgress.value = []
          }, 1500)
        }

        onSuccess({ url: videoUrl })
      }
    })
  } catch (error) {
    console.error('上传失败:', error)
    onError(error)
    ElMessage.error('上传失败')
  }
}

// ============ 文件超出限制 ============
const handleExceed = (files: File[]) => {
  ElMessage.warning(`最多上传 ${props.limit} 个文件，本次选择了 ${files.length} 个文件`)
}

// ============ 移除文件 ============
const handleRemove = (file: any) => {
  const index = fileList.value.findIndex(f => f.url === file.url)
  if (index > -1) {
    fileList.value.splice(index, 1)
    const urls = fileList.value.map(f => f.url)
    emit('update:modelValue', urls)
  }
}

// ============ 预览文件 ============
const handlePreview = (file: any) => {
  previewUrl.value = file.url
  previewVisible.value = true
}

// ============ 监听 v-model 变化 ============
watch(() => props.modelValue, (newVal) => {
  if (newVal && newVal.length > 0) {
    fileList.value = newVal.map((url, index) => ({
      name: `视频 ${index + 1}`,
      url
    }))
  } else {
    fileList.value = []
  }
}, { immediate: true })
</script>

<style scoped>
.video-upload-container {
  width: 100%;
}

.video-uploader {
  width: 100%;
}

:deep(.el-upload--picture-card) {
  width: 150px;
  height: 150px;
  line-height: 150px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 150px;
  height: 150px;
}

.mb-3 {
  margin-bottom: 12px;
}

.mt-1 {
  margin-top: 4px;
}
</style>
