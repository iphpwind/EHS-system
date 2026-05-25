<template>
  <el-dialog :title="title" v-model="visible" width="600px" append-to-body>
    <el-form :model="form" label-width="80px">
      <el-form-item label="课程名称">
        <el-input v-model="form.title" placeholder="请输入课程名称" />
      </el-form-item>
      <el-form-item label="课程分类">
        <el-select v-model="form.categoryId" placeholder="请选择分类">
          <el-option v-for="item in categoryOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="课程简介">
        <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入课程简介" />
      </el-form-item>
      <el-form-item label="课程时长">
        <el-input-number v-model="form.duration" :min="1" :max="180" /> 分钟
      </el-form-item>
      <el-form-item label="课程视频">
        <!-- 集成 VideoUpload 组件（支持腾讯云 COS 直传） -->
        <video-upload
          v-model="form.videoList"
          :limit="5"
          :course-id="form.id"
          @upload-success="handleVideoUploadSuccess"
        />
        <div class="el-upload__tip">
          支持上传视频文件，单个不超过 500MB，最多 5 个文件<br>
          已集成腾讯云 COS 存储，支持断点续传
        </div>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio label="draft">草稿</el-radio>
          <el-radio label="published">发布</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import VideoUpload from '@/components/VideoUpload.vue'
import { getCategories } from '@/api/training'
import type { Course } from './types'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  course: {
    type: Object as () => Course,
    default: () => ({})
  }
})

const emit = defineEmits(['update:visible', 'success'])

const title = ref('新增课程')
const form = reactive({
  id: undefined as number | undefined,
  title: '',
  categoryId: undefined as number | undefined,
  description: '',
  duration: 30,
  videoList: [] as string[],
  status: 'draft'
})

const categoryOptions = ref<any[]>([])

// 获取课程分类
const loadCategories = async () => {
  try {
    const res = await getCategories()
    categoryOptions.value = res.data || []
  } catch (error) {
    console.error('获取课程分类失败:', error)
  }
}

// 监听 course 变化（编辑模式）
watch(() => props.course, (newVal) => {
  if (newVal && newVal.id) {
    title.value = '编辑课程'
    Object.assign(form, {
      id: newVal.id,
      title: newVal.title || '',
      categoryId: newVal.categoryId,
      description: newVal.description || '',
      duration: newVal.duration || 30,
      videoList: newVal.videoList || [],
      status: newVal.status || 'draft'
    })
  } else {
    title.value = '新增课程'
    resetForm()
  }
}, { immediate: true })

// 监听 visible 变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    loadCategories()
  }
})

const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    title: '',
    categoryId: undefined,
    description: '',
    duration: 30,
    videoList: [],
    status: 'draft'
  })
}

const handleVideoUploadSuccess = (data: any) => {
  ElMessage.success('视频上传成功')
  // 将上传成功的视频地址添加到 form.videoList
  if (data.url) {
    form.videoList.push(data.url)
  }
}

const submitForm = async () => {
  try {
    // 验证表单
    if (!form.title) {
      ElMessage.warning('请输入课程名称')
      return
    }

    // 提交表单（新增或编辑）
    const api = form.id ? 'updateCourse' : 'createCourse'
    const res = await import('@/api/training').then(m => m[api](form))
    
    if (res.code === 200) {
      ElMessage.success(form.id ? '编辑成功' : '新增成功')
      emit('success')
      emit('update:visible', false)
    }
  } catch (error: any) {
    console.error('提交失败:', error)
    ElMessage.error(error.message || '提交失败')
  }
}
</script>

<style scoped>
.el-form-item {
  margin-bottom: 18px;
}
</style>
