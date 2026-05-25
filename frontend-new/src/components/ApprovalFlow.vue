<template>
  <div class="approval-flow">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>📋 审批流程</span>
          <el-button type="text" @click="refreshFlow">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </div>
      </template>

      <!-- 审批流程可视化 -->
      <div class="flow-container">
        <el-steps :active="currentStep" finish-status="success" align-center>
          <el-step
            v-for="(node, index) in approvalNodes"
            :key="index"
            :title="node.title"
            :description="node.description"
          >
            <template #icon>
              <div class="step-icon" :class="getStepClass(index)">
                <el-icon v-if="node.status === 'completed'"><Check /></el-icon>
                <el-icon v-else-if="node.status === 'current'"><Clock /></el-icon>
                <el-icon v-else><CircleCheck /></el-icon>
              </div>
            </template>
          </el-step>
        </el-steps>
      </div>

      <!-- 审批历史 -->
      <div class="approval-history" v-if="approvalHistory.length > 0">
        <el-divider />
        <h4>审批历史</h4>
        <el-timeline>
          <el-timeline-item
            v-for="(record, index) in approvalHistory"
            :key="index"
            :timestamp="record.approvalTime"
            placement="top"
          >
            <el-card>
              <h4>{{ record.approverName }}</h4>
              <p>操作：{{ getActionText(record.action) }}</p>
              <p>意见：{{ record.comment || '无' }}</p>
              <el-tag :type="getStatusType(record.status)">
                {{ getStatusText(record.status) }}
              </el-tag>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>

      <!-- 审批操作 -->
      <div class="approval-actions" v-if="canApprove">
        <el-divider />
        <h4>审批操作</h4>
        <el-form :model="approvalForm" label-width="100px">
          <el-form-item label="审批意见">
            <el-input
              v-model="approvalForm.comment"
              type="textarea"
              :rows="3"
              placeholder="请输入审批意见"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="handleApprove">
              <el-icon><Check /></el-icon>
              通过
            </el-button>
            <el-button type="danger" @click="handleReject">
              <el-icon><Close /></el-icon>
              驳回
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Check, Clock, CircleCheck, Close, Refresh } from '@element-plus/icons-vue';
import request from '@/utils/request';

interface ApprovalNode {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'current' | 'completed';
  approver?: string;
  approveTime?: string;
}

interface ApprovalRecord {
  id: number;
  approverName: string;
  action: string;
  comment?: string;
  status: string;
  approvalTime: string;
}

const props = defineProps<{
  ticketId: number;
  currentStatus: string;
}>();

const emit = defineEmits<{
  (e: 'approval-completed'): void;
}>();

const loading = ref(false);
const currentStep = ref(0);
const approvalNodes = ref<ApprovalNode[]>([]);
const approvalHistory = ref<ApprovalRecord[]>([]);
const canApprove = ref(false);

const approvalForm = reactive({
  comment: ''
});

const fetchApprovalFlow = async () => {
  loading.value = true;
  try {
    // 获取审批流程配置
    const configRes: any = await request.get(`/api/work-permits/${props.ticketId}/approval-flow`);
    if (configRes.success) {
      approvalNodes.value = configRes.data.nodes || getDefaultNodes();
    }

    // 获取审批历史
    const historyRes: any = await request.get(`/api/work-permits/${props.ticketId}/approval-history`);
    if (historyRes.success) {
      approvalHistory.value = historyRes.data || [];
    }

    // 计算当前步骤
    calculateCurrentStep();
    
    // 检查当前用户是否可以审批
    checkCanApprove();
  } catch (error) {
    console.error('获取审批流程错误:', error);
    // 使用默认节点
    approvalNodes.value = getDefaultNodes();
  } finally {
    loading.value = false;
  }
};

const getDefaultNodes = (): ApprovalNode[] => {
  return [
    { id: 1, title: '车间审批', description: '车间负责人审批', status: 'pending' },
    { id: 2, title: '部门审批', description: '部门负责人审批', status: 'pending' },
    { id: 3, title: '安全部审批', description: '安全部审核', status: 'pending' },
    { id: 4, title: '完成', description: '审批完成', status: 'pending' }
  ];
};

const calculateCurrentStep = () => {
  const statusMap: Record<string, number> = {
    'pending': 0,
    'workshop_approved': 1,
    'department_approved': 2,
    'safety_approved': 3,
    'approved': 4,
    'rejected': 0
  };
  
  currentStep.value = statusMap[props.currentStatus] || 0;
  
  // 更新节点状态
  approvalNodes.value.forEach((node, index) => {
    if (index < currentStep.value) {
      node.status = 'completed';
    } else if (index === currentStep.value) {
      node.status = 'current';
    } else {
      node.status = 'pending';
    }
  });
};

const checkCanApprove = async () => {
  try {
    const res: any = await request.get(`/api/work-permits/${props.ticketId}/can-approve`);
    canApprove.value = res.data?.canApprove || false;
  } catch (error) {
    canApprove.value = false;
  }
};

const handleApprove = async () => {
  try {
    await ElMessageBox.confirm('确认通过此审批？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    const res: any = await request.post(`/api/work-permits/${props.ticketId}/approve`, {
      comment: approvalForm.comment
    });
    
    if (res.success) {
      ElMessage.success('审批通过成功');
      approvalForm.comment = '';
      fetchApprovalFlow();
      emit('approval-completed');
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('审批错误:', error);
      ElMessage.error('审批失败');
    }
  }
};

const handleReject = async () => {
  if (!approvalForm.comment) {
    ElMessage.warning('请输入驳回意见');
    return;
  }
  
  try {
    await ElMessageBox.confirm('确认驳回此审批？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    const res: any = await request.post(`/api/work-permits/${props.ticketId}/reject`, {
      comment: approvalForm.comment
    });
    
    if (res.success) {
      ElMessage.success('审批驳回成功');
      approvalForm.comment = '';
      fetchApprovalFlow();
      emit('approval-completed');
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('驳回错误:', error);
      ElMessage.error('驳回失败');
    }
  }
};

const refreshFlow = () => {
  fetchApprovalFlow();
};

const getStepClass = (index: number) => {
  const node = approvalNodes.value[index];
  if (!node) return '';
  
  if (node.status === 'completed') return 'step-completed';
  if (node.status === 'current') return 'step-current';
  return 'step-pending';
};

const getActionText = (action: string) => {
  const actionMap: Record<string, string> = {
    'approve': '通过',
    'reject': '驳回',
    'transfer': '转审'
  };
  return actionMap[action] || action;
};

const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    'approved': 'success',
    'rejected': 'danger',
    'pending': 'info'
  };
  return typeMap[status] || 'info';
};

const getStatusText = (status: string) => {
  const textMap: Record<string, string> = {
    'approved': '已通过',
    'rejected': '已驳回',
    'pending': '待审批'
  };
  return textMap[status] || status;
};

onMounted(() => {
  fetchApprovalFlow();
});
</script>

<style scoped>
.approval-flow {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.flow-container {
  padding: 20px 0;
}

.step-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.step-completed {
  background-color: #67c23a;
  color: white;
}

.step-current {
  background-color: #409eff;
  color: white;
}

.step-pending {
  background-color: #dcdfe6;
  color: #909399;
}

.approval-history {
  margin-top: 20px;
}

.approval-history h4 {
  margin-bottom: 15px;
  color: #333;
}

.approval-actions {
  margin-top: 20px;
}

.approval-actions h4 {
  margin-bottom: 15px;
  color: #333;
}

.el-timeline {
  margin-top: 15px;
}
</style>
