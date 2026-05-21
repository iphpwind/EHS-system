<template>
  <div class="patrol-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><Location /></el-icon>
        电子巡检管理
      </h2>
      <div class="header-actions">
        <el-button type="primary" @click="showAddDialog = true">
          <el-icon><Plus /></el-icon>
          新建巡检计划
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon">📋</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-label">巡检计划总数</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-active">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.active }}</div>
            <div class="stat-label">进行中</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-paused">
          <div class="stat-icon">⏸️</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.paused }}</div>
            <div class="stat-label">已暂停</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-finished">
          <div class="stat-icon">🏁</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.finished }}</div>
            <div class="stat-label">已完成</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="巡检类型">
          <el-select v-model="queryParams.type" placeholder="全部类型" clearable style="width: 150px">
            <el-option
              v-for="(label, key) in PATROL_TYPE_TEXT"
              :key="key"
              :label="label"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="全部状态" clearable style="width: 120px">
            <el-option
              v-for="(label, key) in PATROL_STATUS_TEXT"
              :key="key"
              :label="label"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="queryParams.keyword" placeholder="计划名称/编号" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 巡检计划列表 -->
    <div class="table-section">
      <el-table :data="planList" border stripe v-loading="loading">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="plan_no" label="计划编号" width="150" />
        <el-table-column prop="name" label="计划名称" min-width="150" show-overflow-tooltip />
        <el-table-column label="巡检类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)">
              {{ PATROL_TYPE_TEXT[row.type] || row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="frequency" label="巡检频率" width="100" align="center" />
        <el-table-column prop="executor" label="执行人" width="120" show-overflow-tooltip />
        <el-table-column prop="points" label="巡检点" min-width="150" show-overflow-tooltip />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)">
              {{ PATROL_STATUS_TEXT[row.status] || row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="160" />
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">详情</el-button>
            <el-button type="warning" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="isEdit ? '编辑巡检计划' : '新建巡检计划'"
      width="600px"
      :before-close="handleDialogClose"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="计划名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入计划名称" />
        </el-form-item>
        <el-form-item label="巡检类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择巡检类型" style="width: 100%">
            <el-option
              v-for="(label, key) in PATROL_TYPE_TEXT"
              :key="key"
              :label="label"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="巡检频率" prop="frequency">
          <el-input v-model="formData.frequency" placeholder="如：每日一次、周一至周五" />
        </el-form-item>
        <el-form-item label="执行人">
          <el-input v-model="formData.executor" placeholder="请输入执行人" />
        </el-form-item>
        <el-form-item label="巡检点">
          <el-input v-model="formData.points" type="textarea" :rows="2" placeholder="请输入巡检点，多个用逗号分隔" />
        </el-form-item>
        <el-form-item label="巡检内容">
          <el-input v-model="formData.content" type="textarea" :rows="3" placeholder="请输入巡检内容和要求" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio label="active">进行中</el-radio>
            <el-radio label="paused">已暂停</el-radio>
            <el-radio label="finished">已完成</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情抽屉 -->
    <el-drawer v-model="showDetail" title="巡检计划详情" size="500px">
      <div v-if="currentPlan" class="plan-detail">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="计划编号">{{ currentPlan.plan_no }}</el-descriptions-item>
          <el-descriptions-item label="计划名称">{{ currentPlan.name }}</el-descriptions-item>
          <el-descriptions-item label="巡检类型">
            <el-tag :type="getTypeTag(currentPlan.type)">
              {{ PATROL_TYPE_TEXT[currentPlan.type] || currentPlan.type }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="巡检频率">{{ currentPlan.frequency }}</el-descriptions-item>
          <el-descriptions-item label="执行人">{{ currentPlan.executor }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTag(currentPlan.status)">
              {{ PATROL_STATUS_TEXT[currentPlan.status] || currentPlan.status }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentPlan.created_at }}</el-descriptions-item>
        </el-descriptions>

        <div class="detail-section">
          <h4>巡检点</h4>
          <div class="content-box">{{ currentPlan.points || '暂无' }}</div>
        </div>

        <div class="detail-section">
          <h4>巡检内容</h4>
          <div class="content-box">{{ currentPlan.content || '暂无' }}</div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Location, Plus } from '@element-plus/icons-vue';
import {
  getPatrolPlans,
  createPatrolPlan,
  updatePatrolPlan,
  deletePatrolPlan,
  PATROL_TYPE_TEXT,
  PATROL_STATUS_TEXT
} from '@/api/patrol';

const loading = ref(false);
const planList = ref<any[]>([]);
const total = ref(0);

const stats = reactive({
  total: 0,
  active: 0,
  paused: 0,
  finished: 0
});

const queryParams = reactive({
  page: 1,
  pageSize: 20,
  keyword: '',
  type: '',
  status: ''
});

// 对话框相关
const showAddDialog = ref(false);
const isEdit = ref(false);
const formRef = ref();
const formData = reactive({
  id: null as number | null,
  name: '',
  type: 'daily',
  frequency: '',
  executor: '',
  points: '',
  content: '',
  status: 'active'
});

const formRules = {
  name: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择巡检类型', trigger: 'change' }],
  frequency: [{ required: true, message: '请输入巡检频率', trigger: 'blur' }]
};

// 详情相关
const showDetail = ref(false);
const currentPlan = ref<any>(null);

// 获取类型标签样式
const getTypeTag = (type: string) => {
  const typeMap: Record<string, string> = {
    daily: 'primary',
    weekly: 'success',
    monthly: 'warning',
    special: 'danger'
  };
  return typeMap[type] || 'info';
};

// 获取状态标签样式
const getStatusTag = (status: string) => {
  const statusMap: Record<string, string> = {
    active: 'success',
    paused: 'warning',
    finished: 'info'
  };
  return statusMap[status] || 'info';
};

// 加载巡检计划列表
const loadPlans = async () => {
  loading.value = true;
  try {
    const res: any = await getPatrolPlans(queryParams);
    if (res.success) {
      planList.value = res.data;
      total.value = res.data.length;
      updateStats();
    }
  } catch (error) {
    console.error('加载巡检计划失败:', error);
  } finally {
    loading.value = false;
  }
};

// 更新统计数据
const updateStats = () => {
  stats.total = planList.value.length;
  stats.active = planList.value.filter(p => p.status === 'active').length;
  stats.paused = planList.value.filter(p => p.status === 'paused').length;
  stats.finished = planList.value.filter(p => p.status === 'finished').length;
};

// 查询
const handleQuery = () => {
  queryParams.page = 1;
  loadPlans();
};

// 重置
const handleReset = () => {
  queryParams.keyword = '';
  queryParams.type = '';
  queryParams.status = '';
  queryParams.page = 1;
  loadPlans();
};

// 分页
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  loadPlans();
};

const handleCurrentChange = (val: number) => {
  queryParams.page = val;
  loadPlans();
};

// 编辑
const handleEdit = (row: any) => {
  isEdit.value = true;
  Object.assign(formData, row);
  showAddDialog.value = true;
};

// 查看
const handleView = (row: any) => {
  currentPlan.value = row;
  showDetail.value = true;
};

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认删除该巡检计划吗？', '提示', { type: 'warning' });
    await deletePatrolPlan(row.id);
    ElMessage.success('删除成功');
    loadPlans();
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error);
    }
  }
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isEdit.value) {
          await updatePatrolPlan(formData.id!, formData);
          ElMessage.success('更新成功');
        } else {
          await createPatrolPlan(formData);
          ElMessage.success('创建成功');
        }
        showAddDialog.value = false;
        loadPlans();
      } catch (error) {
        console.error('保存失败:', error);
      }
    }
  });
};

// 关闭对话框
const handleDialogClose = () => {
  formRef.value?.resetFields();
  showAddDialog.value = false;
};

onMounted(() => {
  loadPlans();
});
</script>

<style scoped>
.patrol-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.page-title .el-icon {
  color: #409eff;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  font-size: 40px;
  margin-right: 16px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.filter-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.table-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.plan-detail {
  padding: 0 10px;
}

.detail-section {
  margin-top: 20px;
}

.detail-section h4 {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 8px;
}

.content-box {
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  line-height: 1.6;
  min-height: 60px;
  white-space: pre-wrap;
}
</style>
