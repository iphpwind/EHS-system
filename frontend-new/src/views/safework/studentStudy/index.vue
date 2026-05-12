<template>
  <div class="app-container study-center">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="course in courseList" :key="course.id">
        <el-card class="course-card" shadow="hover" @click="openCourse(course)">
          <img :src="course.cover || defaultCover" class="course-cover" />
          <div class="course-info">
            <h4 class="course-title">{{ course.courseName }}</h4>
            <p class="course-desc">{{ course.courseSummary }}</p>
            <div class="course-meta">
              <el-tag size="small" :type="course.level == 1 ? 'danger' : course.level == 2 ? 'warning' : 'success'">
                {{ levelText(course.level) }}
              </el-tag>
              <span class="course-duration">
                <el-icon><Timer /></el-icon> {{ totalDuration(course) }}分钟
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    <!-- 课程学习弹窗 -->
    <el-dialog v-model="studyVisible" :title="currentCourse.courseName" width="900px" destroy-on-close>
      <div class="study-player">
        <div class="player-main">
          <video v-if="currentFile && currentFile.type == 1" :src="currentFile.url" controls class="video-player" @timeupdate="onTimeUpdate" @ended="onVideoEnd"></video>
          <audio v-else-if="currentFile && currentFile.type == 2" :src="currentFile.url" controls class="audio-player" @timeupdate="onTimeUpdate" @ended="onVideoEnd"></audio>
          <iframe v-else-if="currentFile && currentFile.type == 3" :src="currentFile.url" class="doc-player"></iframe>
          <div v-else class="player-placeholder">
            <el-empty description="请选择学习素材" />
          </div>
        </div>
        <div class="player-playlist">
          <h5>课程目录</h5>
          <el-menu :default-active="activeFileIndex + ''" class="file-menu">
            <el-menu-item v-for="(file, idx) in fileList" :key="idx" :index="idx + ''" @click="switchFile(file, idx)">
              <el-icon><VideoPlay v-if="file.type == 1" /><Headset v-if="file.type == 2" /><Document v-if="file.type == 3" /></el-icon>
              <span>{{ file.url ? file.url.substring(file.url.lastIndexOf('/') + 1) : '素材' + (idx + 1) }}</span>
            </el-menu-item>
          </el-menu>
        </div>
      </div>
      <div class="study-footer">
        <el-progress :percentage="studyProgress" :status="studyProgress >= 100 ? 'success' : ''" />
        <p>本次学习时长：{{ formatTime(currentStudyTime) }} | 累计学习时长：{{ formatTime(totalStudyTime) }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup name="StudentStudy">
import { listOnlineCourse } from "@/api/safework/onlineCourse";
import { listCourseFiles } from "@/api/safework/courseFiles";
import { VideoPlay, Headset, Document, Timer } from '@element-plus/icons-vue';

const { proxy } = getCurrentInstance();
const courseList = ref([]);
const total = ref(0);
const loading = ref(true);
const queryParams = reactive({ pageNum: 1, pageSize: 12 });

const studyVisible = ref(false);
const currentCourse = ref({});
const fileList = ref([]);
const currentFile = ref(null);
const activeFileIndex = ref(0);
const currentStudyTime = ref(0);
const totalStudyTime = ref(0);
const studyProgress = ref(0);
const studyTimer = ref(null);
const defaultCover = 'https://via.placeholder.com/300x180?text=课程封面';

function getList() {
  loading.value = true;
  listOnlineCourse(queryParams).then(res => {
    courseList.value = res.rows || [];
    total.value = res.total || 0;
    loading.value = false;
  });
}

function levelText(level) {
  const map = { 1: '高级', 2: '中级', 3: '初级' };
  return map[level] || '初级';
}

function totalDuration(course) {
  return course.materials || 0;
}

function openCourse(course) {
  currentCourse.value = course;
  studyVisible.value = true;
  activeFileIndex.value = 0;
  currentStudyTime.value = 0;
  fileList.value = [];
  listCourseFiles({ courseId: course.id }).then(res => {
    fileList.value = res.rows || [];
    if (fileList.value.length > 0) {
      switchFile(fileList.value[0], 0);
    }
  });
  loadStudyRecord(course.id);
  startStudyTimer();
}

function switchFile(file, idx) {
  currentFile.value = file;
  activeFileIndex.value = idx;
}

function startStudyTimer() {
  stopStudyTimer();
  studyTimer.value = setInterval(() => {
    currentStudyTime.value++;
    totalStudyTime.value++;
    saveStudyRecord();
  }, 1000);
}

function stopStudyTimer() {
  if (studyTimer.value) {
    clearInterval(studyTimer.value);
    studyTimer.value = null;
  }
}

function saveStudyRecord() {
  const key = `study_record_${currentCourse.value.id}`;
  const record = {
    courseId: currentCourse.value.id,
    courseName: currentCourse.value.courseName,
    totalTime: totalStudyTime.value,
    lastStudy: new Date().toISOString()
  };
  localStorage.setItem(key, JSON.stringify(record));
}

function loadStudyRecord(courseId) {
  const key = `study_record_${courseId}`;
  const record = localStorage.getItem(key);
  if (record) {
    const data = JSON.parse(record);
    totalStudyTime.value = data.totalTime || 0;
  } else {
    totalStudyTime.value = 0;
  }
}

function onTimeUpdate(e) {
  if (e.target.duration) {
    studyProgress.value = Math.floor((e.target.currentTime / e.target.duration) * 100);
  }
}

function onVideoEnd() {
  studyProgress.value = 100;
  proxy.$modal.msgSuccess('本节学习完成');
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

onBeforeUnmount(() => {
  stopStudyTimer();
});

getList();
</script>

<style scoped lang="scss">
.study-center {
  padding: 16px;
}
.course-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}
.course-card:hover {
  transform: translateY(-4px);
}
.course-cover {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 4px;
}
.course-info {
  padding: 12px 0 0;
}
.course-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.course-desc {
  font-size: 13px;
  color: #666;
  margin: 0 0 10px;
  height: 36px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.course-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #888;
}
.study-player {
  display: flex;
  gap: 16px;
  min-height: 400px;
}
.player-main {
  flex: 1;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.video-player, .audio-player {
  width: 100%;
  height: 100%;
  max-height: 450px;
}
.doc-player {
  width: 100%;
  height: 450px;
  border: none;
}
.player-placeholder {
  color: #fff;
  padding: 40px;
}
.player-playlist {
  width: 220px;
  flex-shrink: 0;
}
.player-playlist h5 {
  margin: 0 0 10px;
  font-size: 14px;
}
.file-menu {
  border-right: none;
}
.study-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}
@media (max-width: 768px) {
  .study-player {
    flex-direction: column;
  }
  .player-playlist {
    width: 100%;
  }
  .video-player, .audio-player, .doc-player {
    max-height: 220px;
  }
}
</style>
