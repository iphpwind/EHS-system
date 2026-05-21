<template>
  <div class="approval-page">
    <el-page-header title="作业票审批" @back="go-home" />

    <el-card class="mt-4">
      <!-- 审批进度条 -->
      <el-steps :active="currentApprovalLevel - 1" align-center class="mb-6">
        <el-step 
          v-for="level in totalApprovalLevels" 
          :key="level"
          :title="`第${level}级审批`"
          :description="getApproverRole(level)"
        />
      </el-steps>

      <!-- 作业票详情 -->
      <el-descriptions :column="2" border>
        <el-descriptions-item label="票号">{{ ticket.ticket_no || ticket.id }}</el-descriptions-item>
        <el-descriptions-item label="风险等级">
          <el-tag :type="ticket.risk_level === 'special' ? 'danger' : 'warning'">
            {{ getRiskLevelLabel(ticket.risk_level) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="当前审批层级">
          第 {{ ticket.current_approval_level }} 级 / 共 {{ totalApprovalLevels }} 级
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="statusType">{{ statusLabel }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 安全交底记录 -->
      <el-divider content-position="left">安全交底记录</el-divider>
      <el-card shadow="never" class="bg-gray-50">
        <pre class="whitespace-pre-wrap">{{ ticket.safety_disclosure_text || '暂无交底记录' }}</pre>
        <p class="text-gray-500 mt-2">交底时间：{{ ticket.disclosure_time || '未记录' }}</p>
      </el-card>

      <!-- 审批历史 -->
      <el-divider content-position="left">审批历史</el-divider>
      <el-timeline v-if="approvalLogs.length > 0">
        <el-timeline-item
          v-for="(log, index) in approvalLogs"
          :key="index"
          :timestamp="log.create_time"
          :color="log.action === 'approved' ? '#67C23A' : '#F56C6C'"
        >
          <strong>{{ log.approver_name }}</strong>
          <el-tag :type="log.action === 'approved' ? 'success' : 'danger'" size="small" class="ml-2">
            {{ log.action === 'approved' ? '通过' : '驳回' }}
          </el-tag>
          <p class="text-gray-600 mt-1">{{ log.remark || '无意见' }}</p>
        </el-timeline-item>
      </el-timeline>
      <el-empty v-else description="暂无审批记录" />

      <!-- 我的审批意见 -->
      <el-divider content-position="left">审批意见</el-divider>
      <el-input 
        v-model="remark" 
        type="textarea" 
        :rows="4" 
        placeholder="请输入审批意见（驳回时为必填）"
      />

      <div class="flex justify-end gap-4 mt-6">
        <el-button type="danger" @click="handleReject" :loading="submitting">
          驳回
        </el-button>
        <el-button type="primary" @click="handleApprove" :loading="submitting">
          {{ isLastLevel ? '审批通过' : '通过 → 下一级' }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';

const route = useRoute();
const router = useRouter();

const ticket = ref<any>({});
const approvalLogs = ref<any[]>([]);
const remark = ref('');
const submitting = ref(false);

// 风险等级工具函数
const RISK_LEVEL_LABEL: Record<string, string> = {
  'special': '特级',
  'level1': '一级',
  'level2': '二级'
};

const getApprovalLevels = (riskLevel: string): number => {
  if (riskLevel === 'special') return 3;
  if (riskLevel === 'level1') return 2;
  return 1;
};

const totalApprovalLevels = computed(() => {
  return getApprovalLevels(ticket.value.risk_level || 'level2');
});

const currentApprovalLevel = computed(() => {
  return ticket.value.current_approval_level || 1;
});

const isLastLevel = computed(() => {
  return currentApprovalLevel.value >= totalApprovalLevels.value;
});

const statusLabel = computed(() => {
  const map: Record<string, string> = {
    'draft': '草稿',
    'pending': '待审批',
    'approved': '已批准',
    'rejected': '已驳回',
    'in_progress': '执行中',
    'completed': '已完成'
  };
  return map[ticket.value.status] || ticket.value.status || '未知';
});

const statusType = computed(() => {
  const map: Record<string, string> = {
    'draft': 'info',
    'pending': 'warning',
    'approved': 'success',
    'rejected': 'danger',
    'in_progress': 'primary',
    'completed': 'success'
  };
  return map[ticket.value.status] || 'info';
});

onMounted(async () => {
  await loadTicketDetail();
  await loadApprovalLogs();
});

const loadTicketDetail = async () => {
  try {
    const { data } = await axios.get(`/api/tickets/${route.params.id}`);
    ticket.value = data.data || {};
  } catch (err: any) {
    ElMessage.error(err.response?.data?.message || '加载详情失败');
    router.push('/safework/todo');
  }
};

const loadApprovalLogs = async () => {
  try {
    const { data } = await axios.get(`/api/tickets/${route.params.id}/approval-logs`);
    approvalLogs.value = data.data || [];
  } catch (err: any) {
    console.warn('审批日志加载失败', err);
  }
};

const getApproverRole = (level: number): string => {
  const roles = ['', '部门负责人', '安全总监', '分管领导'];
  return roles[level] || `第${level}级审批人`;
};

const getRiskLevelLabel = (level: string): string => {
  return RISK_LEVEL_LABEL[level] || level || '未知';
};

const handleApprove = async () => {
  submitting.value = true;
  try {
    await axios.put(`/api/tickets/${route.params.id}/approve`, {
      status: 'approved',
      remark: remark.value
    });
    ElMessage.success('审批通过！');
    router.push('/safework/todo');
  } catch (err: any) {
    ElMessage.error(err.response?.data?.message || '审批失败');
  } finally {
    submitting.value = false;
  }
};

const handleReject = async () => {
  if (!remark.value.trim()) {
    ElMessage.warning('驳回时必须填写审批意见');
    return;
  }

  try {
    await ElMessageBox.confirm('确认驳回此作业票？', '确认驳回', {
      confirmButtonText: '确认驳回',
      cancelButtonText: '取消',
      type: 'warning'
    });

    submitting.value = true;
    await axios.put(`/api/tickets/${route.params.id}/approve`, {
      status: 'rejected',
      remark: remark.value
    });
    ElMessage.success('已驳回');
    router.push('/safework/todo');
  } catch (err: any) {
    if (err !== 'cancel') {
      ElMessage.error(err.response?.data?.message || '操作失败');
    }
  } finally {
    submitting.value = false;
  }
};

const goHome = () => {
  router.push('/safework/todo');
};
</script>

<style scoped>
.approval-page {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.mt-4 {
  margin-top: 16px;
}

.mb-6 {
  margin-bottom: 24px;
}

.mt-2 {
  margin-top: 8px;
}

.mt-6 {
  margin-top: 24px;
}

.ml-2 {
  margin-left: 8px;
}

.whitespace-pre-wrap {
  white-space: pre-wrap;
  word-break: break-word;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.text-gray-500 {
  color: #6b7280;
}

.text-gray-600 {
  color: #4b5563;
}

.flex {
  display: flex;
}

.justify-end {
  justify-content: flex-end;
}

.gap-4 {
  gap: 16px;
}
</style>
