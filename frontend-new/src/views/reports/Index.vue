<template>
  <div class="app-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>报表统计与导出</span>
        </div>
      </template>

      <!-- 隐患统计报表 -->
      <el-card class="report-card" style="margin-bottom: 20px;">
        <template #header>
          <div class="card-header">
            <span>📊 隐患排查统计报表</span>
          </div>
        </template>
        <el-form :model="hazardQuery" inline>
          <el-form-item label="开始日期">
            <el-date-picker
              v-model="hazardQuery.startDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="选择开始日期"
            />
          </el-form-item>
          <el-form-item label="结束日期">
            <el-date-picker
              v-model="hazardQuery.endDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="选择结束日期"
            />
          </el-form-item>
          <el-form-item label="部门">
            <el-input v-model="hazardQuery.department" placeholder="输入部门名称" />
          </el-form-item>
          <el-form-item label="隐患级别">
            <el-select v-model="hazardQuery.level" placeholder="选择级别" clearable>
              <el-option label="重大隐患" :value="1" />
              <el-option label="较大隐患" :value="2" />
              <el-option label="一般隐患" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="exportHazardReport">
              <el-icon><Download /></el-icon>
              导出Excel
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 作业票统计报表 -->
      <el-card class="report-card" style="margin-bottom: 20px;">
        <template #header>
          <div class="card-header">
            <span>📋 作业票统计报表</span>
          </div>
        </template>
        <el-form :model="ticketQuery" inline>
          <el-form-item label="开始日期">
            <el-date-picker
              v-model="ticketQuery.startDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="选择开始日期"
            />
          </el-form-item>
          <el-form-item label="结束日期">
            <el-date-picker
              v-model="ticketQuery.endDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="选择结束日期"
            />
          </el-form-item>
          <el-form-item label="作业票类型">
            <el-input v-model="ticketQuery.ticketType" placeholder="输入作业票类型" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="ticketQuery.status" placeholder="选择状态" clearable>
              <el-option label="待审批" value="pending" />
              <el-option label="已批准" value="approved" />
              <el-option label="已拒绝" value="rejected" />
              <el-option label="执行中" value="executing" />
              <el-option label="已完成" value="completed" />
              <el-option label="已关闭" value="closed" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="exportWorkPermitReport">
              <el-icon><Download /></el-icon>
              导出Excel
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 培训统计报表 -->
      <el-card class="report-card">
        <template #header>
          <div class="card-header">
            <span>🎓 培训教育统计报表</span>
          </div>
        </template>
        <el-form :model="trainingQuery" inline>
          <el-form-item label="开始日期">
            <el-date-picker
              v-model="trainingQuery.startDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="选择开始日期"
            />
          </el-form-item>
          <el-form-item label="结束日期">
            <el-date-picker
              v-model="trainingQuery.endDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="选择结束日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="exportTrainingReport">
              <el-icon><Download /></el-icon>
              导出Excel
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { Download } from '@element-plus/icons-vue';
import request from '@/utils/request';

const hazardQuery = reactive({
  startDate: '',
  endDate: '',
  department: '',
  level: ''
});

const ticketQuery = reactive({
  startDate: '',
  endDate: '',
  ticketType: '',
  status: ''
});

const trainingQuery = reactive({
  startDate: '',
  endDate: ''
});

const exportHazardReport = () => {
  ElMessage.info('正在导出隐患统计报表...');
  const params = new URLSearchParams();
  if (hazardQuery.startDate) params.append('startDate', hazardQuery.startDate);
  if (hazardQuery.endDate) params.append('endDate', hazardQuery.endDate);
  if (hazardQuery.department) params.append('department', hazardQuery.department);
  if (hazardQuery.level) params.append('level', hazardQuery.level.toString());

  const url = `/api/reports/hazard/export?${params.toString()}`;
  window.open(url, '_blank');
};

const exportWorkPermitReport = () => {
  ElMessage.info('正在导出作业票统计报表...');
  const params = new URLSearchParams();
  if (ticketQuery.startDate) params.append('startDate', ticketQuery.startDate);
  if (ticketQuery.endDate) params.append('endDate', ticketQuery.endDate);
  if (ticketQuery.ticketType) params.append('ticketType', ticketQuery.ticketType);
  if (ticketQuery.status) params.append('status', ticketQuery.status);

  const url = `/api/reports/work-permits/export?${params.toString()}`;
  window.open(url, '_blank');
};

const exportTrainingReport = () => {
  ElMessage.info('正在导出培训统计报表...');
  const params = new URLSearchParams();
  if (trainingQuery.startDate) params.append('startDate', trainingQuery.startDate);
  if (trainingQuery.endDate) params.append('endDate', trainingQuery.endDate);

  const url = `/api/reports/training/export?${params.toString()}`;
  window.open(url, '_blank');
};
</script>

<style scoped>
.report-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
}
</style>
