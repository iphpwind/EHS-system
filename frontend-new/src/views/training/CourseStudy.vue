<template>
  <div class="course-study-container">
    <!-- 顶部导航栏 -->
    <div class="study-header">
      <div class="header-left">
        <el-button text @click="goBack">
          <el-icon><ArrowLeft /></el-icon> 返回
        </el-button>
        <span class="course-title">{{ courseData.title || '课程学习' }}</span>
      </div>
      <div class="header-right">
        <el-tag :type="isCompleted ? 'success' : 'warning'" size="large">
          {{ isCompleted ? '已完成' : '进行中' }}
        </el-tag>
        <el-button v-if="!isCompleted" type="primary" @click="markComplete">
          标记完成
        </el-button>
      </div>
    </div>

    <div class="study-body">
      <!-- 左侧：视频/内容区 -->
      <div class="content-area">
        <!-- 视频播放器 -->
        <div v-if="currentSection?.video_url" class="video-wrapper">
          <video
            ref="videoRef"
            :src="currentSection.video_url"
            controls
            controlsList="nodownload"
            @timeupdate="onTimeUpdate"
            @ended="onSectionEnded"
            @loadedmetadata="onMetaLoaded"
          >
            您的浏览器不支持视频播放
          </video>
        </div>

        <!-- 无视频时显示文本内容 -->
        <div v-else-if="currentSection?.content_text" class="text-content">
          <h2>{{ currentSection.title }}</h2>
          <div class="content-body" v-html="currentSection.content_text" />
        </div>

        <!-- 封面图 -->
        <div v-else class="cover-placeholder">
          <el-icon size="64" color="#ccc"><VideoPlay /></el-icon>
          <p>暂无视频内容</p>
          <p class="tip">请在课程管理中添加视频资源</p>
        </div>

        <!-- 章节切换 -->
        <div class="section-nav">
          <div class="section-info">
            <span class="section-label">
              第 {{ currentSectionIndex + 1 }} / {{ sections.length }} 章节
            </span>
            <span class="section-title">{{ currentSection?.title }}</span>
          </div>
          <div class="section-buttons">
            <el-button
              :disabled="currentSectionIndex === 0"
              @click="switchSection(currentSectionIndex - 1)"
            >
              上一节
            </el-button>
            <el-button
              :disabled="currentSectionIndex === sections.length - 1"
              type="primary"
              @click="switchSection(currentSectionIndex + 1)"
            >
              下一节
            </el-button>
          </div>
        </div>
      </div>

      <!-- 右侧：章节列表 -->
      <div class="sidebar">
        <div class="sidebar-header">
          <span>课程目录</span>
          <span class="progress-text">
            {{ completedSections }} / {{ sections.length }} 已完成
          </span>
        </div>

        <div class="progress-bar-wrapper">
          <el-progress
            :percentage="overallProgress"
            :stroke-width="8"
            :color="progressColor"
            :show-text="true"
          />
        </div>

        <div class="section-list">
          <div
            v-for="(section, idx) in sections"
            :key="section.id"
            class="section-item"
            :class="{
              active: idx === currentSectionIndex,
              completed: completedSectionIds.has(section.id)
            }"
            @click="switchSection(idx)"
          >
            <div class="section-icon">
              <el-icon v-if="completedSectionIds.has(section.id)" color="#67c23a">
                <CircleCheck />
              </el-icon>
              <el-icon v-else color="#909399">
                <VideoPlay />
              </el-icon>
            </div>
            <div class="section-info-text">
              <div class="section-name">{{ section.title }}</div>
              <div class="section-duration">{{ section.duration || 0 }} 分钟</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习时长统计 -->
    <div class="study-stats">
      <el-statistic title="本次学习时长" :value="sessionWatchTime" suffix="分钟" />
      <el-statistic title="累计学习时长" :value="totalWatchTime" suffix="分钟" />
      <el-statistic title="课程总时长" :value="courseData.duration || 0" suffix="分钟" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, VideoPlay, CircleCheck } from '@element-plus/icons-vue'
import { getCourseDetail, saveTrainingProgress } from '@/api/training'
import request from '@/utils/request'

// 单独定义：GET /api/training/progress?planId=xxx（后端用 query，非路径）
const getTrainingProgress = (recordId: number) =>
  request.get('/api/training/progress', { params: { planId: recordId } })

const route = useRoute()
const router = useRouter()

// 课程数据
const courseData = ref<any>({})
const sections = ref<any[]>([])
const currentSectionIndex = ref(0)
const completedSectionIds = ref(new Set<number>())

// 视频引用
const videoRef = ref<HTMLVideoElement>()

// 进度
const isCompleted = ref(false)
const currentPosition = ref(0)     // 当前播放位置（秒）
const sessionWatchTime = ref(0)    // 本次学习分钟
const totalWatchTime = ref(0)      // 累计学习分钟

// recordId / courseId / planId 来自路由参数
const recordId = computed(() => route.query.recordId as string)
const courseId = computed(() => route.query.courseId as string)
const planId = computed(() => route.query.planId as string)

const currentSection = computed(() => sections.value[currentSectionIndex.value] || null)

const completedSections = computed(() => completedSectionIds.value.size)

const overallProgress = computed(() => {
  if (!sections.value.length) return 0
  return Math.round((completedSectionIds.value.size / sections.value.length) * 100)
})

const progressColor = computed(() => {
  const p = overallProgress.value
  if (p >= 100) return '#67c23a'
  if (p >= 60) return '#409eff'
  return '#e6a23c'
})

// 加载课程数据
const loadCourse = async () => {
  const cid = courseId.value
  if (!cid) {
    ElMessage.warning('缺少课程ID参数')
    return
  }

  try {
    // 加载课程详情（含章节列表）
    const res = await getCourseDetail(Number(cid))
    courseData.value = res.data || {}

    // 章节列表（兼容两种结构）
    sections.value = res.data?.sections || []

    // 加载用户学习进度
    await loadProgress()
  } catch (e) {
    console.error('加载课程失败:', e)
    ElMessage.error('加载课程失败')
  }
}

// 加载学习进度
const loadProgress = async () => {
  if (!recordId.value) return
  try {
    // 后端 GET /api/training/progress?planId=xxx
    const res = await getTrainingProgress(Number(recordId.value))
    const data = res.data || {}
    totalWatchTime.value = Math.round((data.watchedTime || 0) / 60)
    sessionWatchTime.value = 0

    // 标记已完成章节（根据 is_completed 状态）
    // 这里用 watchSeconds 粗略判断：如果有记录即视为已开始
    if (data.completed) {
      isCompleted.value = true
      // 如果已完成，全部章节标记完成
      sections.value.forEach(s => completedSectionIds.value.add(s.id))
    }

    // 从断点恢复视频播放位置
    if (data.lastPosition && videoRef.value) {
      videoRef.value.currentTime = data.lastPosition
    }
  } catch (e) {
    console.error('加载进度失败（忽略）', e)
  }
}

// 心跳定时器：每30秒保存一次进度
let heartbeatTimer: ReturnType<typeof setInterval> | null = null
let sessionSeconds = 0

const startHeartbeat = () => {
  heartbeatTimer = setInterval(() => {
    if (!courseId.value) return
    sessionSeconds += 30
    sessionWatchTime.value = Math.round(sessionSeconds / 60)

    saveTrainingProgress({
      recordId: Number(recordId.value) || undefined,
      planId: Number(planId.value) || undefined,
      watchedTime: Math.round((totalWatchTime.value * 60 + sessionSeconds)),
      lastPosition: Math.round(currentPosition.value),
      completed: isCompleted.value
    }).catch(e => console.warn('心跳保存失败（忽略）:', e))
  }, 30000)
}

// 视频事件
const onTimeUpdate = () => {
  if (videoRef.value) {
    currentPosition.value = videoRef.value.currentTime
  }
}

const onMetaLoaded = () => {
  // 视频元数据加载完成后，可从断点恢复
  if (videoRef.value && currentPosition.value > 0) {
    videoRef.value.currentTime = currentPosition.value
  }
}

const onSectionEnded = () => {
  // 章节播放完毕，自动标记完成
  if (currentSection.value) {
    completedSectionIds.value.add(currentSection.value.id)
    // 如果是最后一个章节，标记全部完成
    if (currentSectionIndex.value === sections.value.length - 1) {
      isCompleted.value = true
    }
  }
  // 自动跳转下一节
  if (currentSectionIndex.value < sections.value.length - 1) {
    setTimeout(() => switchSection(currentSectionIndex.value + 1), 1500)
  }
}

// 切换章节
const switchSection = (idx: number) => {
  if (idx < 0 || idx >= sections.value.length) return
  currentSectionIndex.value = idx
  currentPosition.value = 0
  // 视频将自动加载（v-if 会重新挂载 video）
}

// 标记完成
const markComplete = async () => {
  try {
    // 标记所有章节为已完成
    sections.value.forEach(s => completedSectionIds.value.add(s.id))
    isCompleted.value = true
    await saveTrainingProgress({
      recordId: Number(recordId.value) || undefined,
      planId: Number(planId.value) || undefined,
      watchedTime: (totalWatchTime.value + sessionWatchTime.value) * 60,
      lastPosition: 0,
      completed: true
    })
    ElMessage.success('课程已标记为完成')
  } catch (e) {
    console.error('标记完成失败:', e)
    ElMessage.error('标记完成失败')
  }
}

// 返回上一页
const goBack = () => {
  router.push({ path: '/training/my' })
}

onMounted(() => {
  loadCourse()
  startHeartbeat()
})

onBeforeUnmount(() => {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer)
    // 离开前最后保存一次
    saveTrainingProgress({
      recordId: Number(recordId.value) || undefined,
      planId: Number(planId.value) || undefined,
      watchedTime: (totalWatchTime.value + sessionWatchTime.value) * 60,
      lastPosition: Math.round(currentPosition.value),
      completed: isCompleted.value
    }).catch(() => {})
  }
})
</script>

<style scoped>
.course-study-container {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
}

/* 顶部导航 */
.study-header {
  background: #fff;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0,0,0,.08);
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.course-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 主体布局 */
.study-body {
  display: flex;
  flex: 1;
  gap: 0;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}

/* 视频/内容区 */
.content-area {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.video-wrapper {
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.video-wrapper video {
  width: 100%;
  max-height: 520px;
  display: block;
}

.text-content {
  background: #fff;
  border-radius: 8px;
  padding: 32px;
}

.text-content h2 {
  margin-bottom: 16px;
  color: #303133;
}

.content-body {
  line-height: 1.8;
  color: #606266;
  font-size: 15px;
}

.cover-placeholder {
  background: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 360px;
  color: #909399;
  gap: 12px;
}

.cover-placeholder .tip {
  font-size: 13px;
  color: #c0c4cc;
}

/* 章节导航 */
.section-nav {
  background: #fff;
  border-radius: 8px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.section-label {
  font-size: 12px;
  color: #909399;
}

.section-title {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
}

.section-buttons {
  display: flex;
  gap: 8px;
}

/* 右侧边栏 */
.sidebar {
  width: 280px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 8px;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  padding: 16px 20px 8px;
  font-weight: 600;
  color: #303133;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.progress-text {
  font-size: 12px;
  font-weight: normal;
  color: #909399;
}

.progress-bar-wrapper {
  padding: 12px 20px;
}

.section-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.section-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background 0.2s;
  border-left: 3px solid transparent;
}

.section-item:hover {
  background: #f5f7fa;
}

.section-item.active {
  background: #ecf5ff;
  border-left-color: #409eff;
}

.section-item.completed .section-name {
  color: #67c23a;
}

.section-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-info-text {
  flex: 1;
  min-width: 0;
}

.section-name {
  font-size: 13px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.section-duration {
  font-size: 11px;
  color: #c0c4cc;
  margin-top: 2px;
}

/* 学习统计 */
.study-stats {
  background: #fff;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: center;
  gap: 80px;
  padding: 20px;
}
</style>
