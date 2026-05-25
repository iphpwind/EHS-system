<template>
  <div class="approval-flow-viewer">
    <div class="flow-header">
      <h4>{{ title }}</h4>
      <div class="flow-legend">
        <span class="legend-item"><span class="legend-dot pending"></span>待处理</span>
        <span class="legend-item"><span class="legend-dot active"></span>当前节点</span>
        <span class="legend-item"><span class="legend-dot completed"></span>已完成</span>
        <span class="legend-item"><span class="legend-dot rejected"></span>已驳回</span>
      </div>
    </div>
    
    <div class="flow-container" ref="flowContainer">
      <div class="flow-track"></div>
      
      <div 
        v-for="(node, index) in nodes" 
        :key="node.id"
        class="flow-node"
        :class="getNodeClass(node, index)"
        :style="{ left: getNodePosition(index) + 'px' }"
      >
        <div class="node-icon">
          <el-icon v-if="node.status === 'completed'"><CircleCheck /></el-icon>
          <el-icon v-else-if="node.status === 'rejected'"><CircleClose /></el-icon>
          <el-icon v-else-if="node.status === 'active'"><Loading /></el-icon>
          <el-icon v-else><Clock /></el-icon>
        </div>
        <div class="node-label">{{ node.label }}</div>
        <div class="node-time" v-if="node.time">{{ node.time }}</div>
        <div class="node-operator" v-if="node.operator">{{ node.operator }}</div>
        
        <!-- 节点详情弹窗 -->
        <el-popover
          v-if="node.detail"
          placement="top"
          :width="200"
          trigger="hover"
        >
          <template #reference>
            <div class="node-detail-trigger"></div>
          </template>
          <div class="node-detail">
            <p><strong>操作人：</strong>{{ node.operator || '暂无' }}</p>
            <p><strong>操作时间：</strong>{{ node.time || '暂无' }}</p>
            <p><strong>操作意见：</strong>{{ node.detail || '暂无' }}</p>
          </div>
        </el-popover>
      </div>
      
      <!-- 连接线 -->
      <div 
        v-if="index < nodes.length - 1"
        class="flow-connector"
        :class="getConnectorClass(node, nodes[index + 1])"
        :style="{ left: (getNodePosition(index) + 60) + 'px' }"
      >
        <div class="connector-line"></div>
        <div class="connector-arrow"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { CircleCheck, CircleClose, Clock, Loading } from '@element-plus/icons-vue';

const props = defineProps({
  title: {
    type: String,
    default: '审批流程'
  },
  nodes: {
    type: Array,
    required: true,
    default: () => []
  },
  currentStep: {
    type: Number,
    default: 0
  }
});

const flowContainer = ref<HTMLElement | null>(null);

// 获取节点样式类
const getNodeClass = (node: any, index: number) => {
  return {
    'node-pending': node.status === 'pending',
    'node-active': node.status === 'active',
    'node-completed': node.status === 'completed',
    'node-rejected': node.status === 'rejected'
  };
};

// 获取连接线样式类
const getConnectorClass = (node1: any, node2: any) => {
  if (node1.status === 'completed' && node2.status === 'completed') {
    return 'connector-completed';
  } else if (node1.status === 'completed' && node2.status === 'active') {
    return 'connector-active';
  } else if (node1.status === 'rejected' || node2.status === 'rejected') {
    return 'connector-rejected';
  } else {
    return 'connector-pending';
  }
};

// 计算节点位置（水平分布）
const getNodePosition = (index: number) => {
  if (!flowContainer.value) return index * 150 + 20;
  
  const containerWidth = flowContainer.value.offsetWidth;
  const nodeWidth = 80;
  const gap = (containerWidth - (props.nodes.length * nodeWidth)) / (props.nodes.length + 1);
  return gap + index * (nodeWidth + gap);
};

// 默认节点数据（示例）
const defaultNodes = computed(() => {
  if (props.nodes && props.nodes.length > 0) {
    return props.nodes;
  }
  
  // 默认作业票审批流程
  return [
    { id: 1, label: '草稿', status: 'completed', time: '2026-05-20 10:00', operator: '张三', detail: '创建作业票' },
    { id: 2, label: '部门审批', status: 'completed', time: '2026-05-20 11:30', operator: '李四', detail: '同意' },
    { id: 3, label: '安全审批', status: 'active', time: '', operator: '王五', detail: '审批中' },
    { id: 4, label: '最终批准', status: 'pending', time: '', operator: '', detail: '' },
    { id: 5, label: '已批准', status: 'pending', time: '', operator: '', detail: '' },
    { id: 6, label: '作业中', status: 'pending', time: '', operator: '', detail: '' },
    { id: 7, label: '待验收', status: 'pending', time: '', operator: '', detail: '' },
    { id: 8, label: '已关闭', status: 'pending', time: '', operator: '', detail: '' }
  ];
});

onMounted(() => {
  // 可以在这里添加窗口 resize 监听，重新计算位置
  window.addEventListener('resize', () => {
    // 触发重新渲染
    if (flowContainer.value) {
      flowContainer.value.style.display = 'none';
      flowContainer.value.offsetHeight; // 触发重排
      flowContainer.value.style.display = 'block';
    }
  });
});
</script>

<style scoped>
.approval-flow-viewer {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}

.flow-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.flow-header h4 {
  margin: 0;
  font-size: 16px;
  color: #303133;
}

.flow-legend {
  display: flex;
  gap: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #606266;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-dot.pending { background: #e4e7ed; }
.legend-dot.active { background: #409eff; }
.legend-dot.completed { background: #67c23a; }
.legend-dot.rejected { background: #f56c6c; }

.flow-container {
  position: relative;
  height: 120px;
  display: flex;
  align-items: center;
  overflow-x: auto;
  padding: 20px 0;
}

.flow-track {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: #e4e7ed;
  z-index: 1;
}

.flow-node {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  cursor: pointer;
}

.node-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-size: 18px;
  transition: all 0.3s;
}

.node-pending .node-icon {
  background: #f5f7fa;
  border: 2px solid #e4e7ed;
  color: #c0c4cc;
}

.node-active .node-icon {
  background: #ecf5ff;
  border: 2px solid #409eff;
  color: #409eff;
  animation: pulse 2s infinite;
}

.node-completed .node-icon {
  background: #f0f9eb;
  border: 2px solid #67c23a;
  color: #67c23a;
}

.node-rejected .node-icon {
  background: #fef0f0;
  border: 2px solid #f56c6c;
  color: #f56c6c;
}

.node-label {
  font-size: 12px;
  color: #606266;
  text-align: center;
  margin-bottom: 4px;
}

.node-time {
  font-size: 10px;
  color: #909399;
  text-align: center;
}

.node-operator {
  font-size: 10px;
  color: #909399;
  text-align: center;
}

.node-detail-trigger {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  cursor: pointer;
}

.flow-connector {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 2px;
  z-index: 1;
}

.connector-line {
  width: 100%;
  height: 2px;
}

.connector-pending .connector-line {
  background: #e4e7ed;
}

.connector-active .connector-line {
  background: #409eff;
}

.connector-completed .connector-line {
  background: #67c23a;
}

.connector-rejected .connector-line {
  background: #f56c6c;
}

.connector-arrow {
  position: absolute;
  right: -4px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
}

.connector-pending .connector-arrow {
  border-left: 6px solid #e4e7ed;
}

.connector-active .connector-arrow {
  border-left: 6px solid #409eff;
}

.connector-completed .connector-arrow {
  border-left: 6px solid #67c23a;
}

.connector-rejected .connector-arrow {
  border-left: 6px solid #f56c6c;
}

.node-detail {
  font-size: 12px;
  line-height: 1.6;
}

.node-detail p {
  margin: 5px 0;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(64, 158, 255, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(64, 158, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(64, 158, 255, 0); }
}
</style>
