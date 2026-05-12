<template>
  <div class="learn-page">
    <van-nav-bar :title="courseInfo.title || '课程学习'" left-arrow @click-left="$router.back()" />

    <!-- 视频播放区 -->
    <div class="video-container">
      <video
        ref="videoRef"
        class="video-player"
        :src="videoUrl"
        controls
        controlslist="nodownload"
        @timeupdate="onTimeUpdate"
        @play="onPlay"
        @pause="onPause"
        @ended="onEnded"
        @loadedmetadata="onVideoLoaded"
      ></video>
    </div>

    <van-tabs v-model:active="activeTab" class="content-tabs">
      <van-tab title="课程信息">
        <van-cell-group inset>
          <van-cell title="讲师" :value="courseInfo.instructor || '-'" />
          <van-cell title="时长" :value="formattedDuration" />
          <van-cell title="介绍" :label="courseInfo.description || '暂无介绍'" />
        </van-cell-group>
      </van-tab>
      <van-tab title="章节列表">
        <div class="chapter-wrap">
          <van-sidebar v-model="activeChapter" class="chapter-sidebar">
            <van-sidebar-item
              v-for="(s, i) in sections" :key="s.id || i"
              :title="'第'+(i+1)+'章'"
              @click="switchSection(s)"
            />
          </van-sidebar>
          <div class="chapter-detail">
            <p class="chapter-name">{{ currentSection.title || '请选择章节' }}</p>
            <van-tag :type="currentSection.completed ? 'success' : 'default'">
              {{ currentSection.completed ? '已完成' : '未完成' }}
            </van-tag>
            <p class="chapter-desc" v-if="currentSection.description">{{ currentSection.description }}</p>
            <p class="chapter-dur" v-if="currentSection.duration">时长：{{ fmtSeconds(currentSection.duration) }}</p>
          </div>
        </div>
      </van-tab>
    </van-tabs>

    <!-- 底部 -->
    <div class="bottom-bar">
      <van-button v-if="!completed" type="primary" block @click="toggleDone" :loading="saving">继续学习</van-button>
      <van-button v-else type="success" block :loading="saving">✅ 已完成</van-button>
    </div>

    <!-- 切屏警告 -->
    <van-dialog v-model:show="showLeaveWarn" title="提示"
      message="检测到您离开了学习页面，请保持专注。" confirm-button-text="知道了" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'
import request from '../../api/request'

const route = useRoute()
const courseId = route.params.id

const videoRef = ref(null)
const courseInfo = reactive({ title: '', instructor: '', description: '', duration: 0, video_url: '' })
const videoUrl = ref('')
const sections = ref([])
const activeTab = ref(0)
const activeChapter = ref(0)
const currentSection = reactive({ id: null, title: '', description: '', duration: 0, completed: false })
const completed = ref(false)
const saving = ref(false)
const showLeaveWarn = ref(false)
const leaveCount = ref(0)
let heartbeatTimer = null
let lastReportedTime = 0

const formattedDuration = computed(() => fmtSeconds(courseInfo.duration))

function fmtSeconds(s) { if (!s) return '0分钟'; const m = Math.floor(s / 60); return m >= 60 ? `${Math.floor(m/60)}小时${m%60}分钟` : `${m}分钟` }

async function loadCourse() {
  try {
    const res = await request.get(`/training-v2/courses/${courseId}`)
    const data = res.data || {}
    Object.assign(courseInfo, {
      id: data.id, title: data.title, instructor: data.instructor,
      description: data.description, duration: data.duration, video_url: data.video_url
    })
    videoUrl.value = data.video_url || ''
    sections.value = data.sections || []
    if (sections.value.length > 0) switchSection(sections.value[0])
    // 加载进度
    const progRes = await request.get('/training/progress', { params: { planId: courseId } })
    if (progRes.data) {
      completed.value = progRes.data.completed || false
      lastReportedTime = progRes.data.lastPosition || 0
    }
  } catch { showToast('加载课程失败') }
}

function switchSection(section) {
  Object.assign(currentSection, {
    id: section.id, title: section.title,
    description: section.description, duration: section.duration,
    completed: section.is_completed || section.completed || false
  })
}

function onVideoLoaded() {
  if (lastReportedTime > 0 && videoRef.value) {
    videoRef.value.currentTime = lastReportedTime
  }
}

function onTimeUpdate() {
  if (!videoRef.value) return
  const ct = videoRef.value.currentTime

  // 防止快进：如果时间跳跃超过 3 秒则回退
  if (ct > lastReportedTime + 3 && lastReportedTime > 0) {
    videoRef.value.currentTime = lastReportedTime
    showToast('课程不允许快进')
    return
  }
  lastReportedTime = ct
}

function onPlay() { startHeartbeat() }
function onPause() { stopHeartbeat(); saveProgress() }
function onEnded() {
  stopHeartbeat()
  completed.value = true
  saveProgress()
}

// 心跳：每30秒上报
function startHeartbeat() {
  stopHeartbeat()
  heartbeatTimer = setInterval(() => {
    request.post('/training/heartbeat', {
      courseId: courseId,
      sectionId: currentSection.id,
      currentTime: lastReportedTime
    }).catch(() => {})
  }, 30000)
}
function stopHeartbeat() {
  if (heartbeatTimer) { clearInterval(heartbeatTimer); heartbeatTimer = null }
}

async function saveProgress() {
  await request.post('/training/progress', {
    planId: courseId,
    watchedTime: Math.floor(lastReportedTime),
    lastPosition: lastReportedTime,
    completed: completed.value ? 1 : 0
  }).catch(() => {})
}

function toggleDone() { completed.value = !completed.value; saveProgress() }

// 切屏监控
function onVisibilityChange() {
  if (document.hidden) {
    leaveCount.value++
    if (leaveCount.value >= 3) {
      showLeaveWarn.value = true
    }
    if (leaveCount.value >= 5) {
      stopHeartbeat()
      completed.value = true
      saveProgress()
      showToast('多次离开页面，已自动标记完成')
    }
  }
}

onMounted(() => {
  loadCourse()
  document.addEventListener('visibilitychange', onVisibilityChange)
  window.addEventListener('beforeunload', saveProgress)
})
onBeforeUnmount(() => {
  stopHeartbeat()
  saveProgress()
  document.removeEventListener('visibilitychange', onVisibilityChange)
  window.removeEventListener('beforeunload', saveProgress)
})
</script>

<style scoped>
.video-container { background: #000; width: 100%; }
.video-player { width: 100%; display: block; }
.content-tabs { margin-top: 0; }
.chapter-wrap { display: flex; min-height: 150px; }
.chapter-sidebar { flex-shrink: 0; background: #f7f8fa; }
.chapter-detail { flex: 1; padding: 12px; }
.chapter-name { font-size: 15px; font-weight: 600; margin-bottom: 6px; }
.chapter-desc { color: #666; font-size: 13px; margin: 8px 0; }
.chapter-dur { color: #999; font-size: 12px; }
.bottom-bar { padding: 12px; }
</style>
