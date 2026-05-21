<template>
  <div class="inspection-execution-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>排查执行追踪</span>
          <el-button type="primary" @click="handleCreateRecord">新增排查记录</el-button>
        </div>
      </template>
      
      <!-- 今日待排查任务 -->
      <el-card class="today-tasks-card">
        <template #header>
          <span>今日待排查任务</span>
        </template>
        <el-table :data="todayTasks" border style="width: 100%">
          <el-table-column prop="plan_name" label="计划名称" />
          <el-table-column prop="plan_type" label="计划类型">
            <template #default="scope">
              {{ formatPlanType(scope.row.plan_type) }}
            </template>
          </el-table-column>
          <el-table-column prop="frequency" label="排查频率">
            <template #default="scope">
              {{ formatFrequency(scope.row.frequency) }}
            </template>
          </el-table-column>
          <el-table-column prop="location" label="排查地点" />
          <el-table-column label="状态">
            <template #default="scope">
              <el-tag :type="scope.row.has_inspected ? 'success' : 'warning'">
                {{ scope.row.has_inspected ? '已排查' : '待排查' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button 
                v-if="!scope.row.has_inspected" 
                size="small" 
                type="primary"
                @click="handleExecuteInspection(scope.row)"
              >
                执行排查
              </el-button>
              <el-button 
                v-else 
                size="small"
                @click="handleViewRecord(scope.row)"
              >
                查看记录
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      
      <!-- 排查记录列表 -->
      <el-card class="records-card" style="margin-top: 20px;">
        <template #header>
          <span>排查记录列表</span>
        </template>
        
        <!-- 搜索表单 -->
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="计划名称">
            <el-select v-model="searchForm.plan_id" placeholder="请选择计划" clearable>
              <el-option v-for="plan in plans" :key="plan.id" :label="plan.plan_name" :value="plan.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="排查日期">
            <el-date-picker v-model="searchForm.inspection_date" type="date" placeholder="请选择日期" clearable />
          </el-form-item>
          <el-form-item label="是否发现隐患">
            <el-select v-model="searchForm.hazard_found" placeholder="请选择" clearable>
              <el-option label="是" :value="1" />
              <el-option label="否" :value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
        
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="plan_name" label="计划名称" />
          <el-table-column prop="inspection_date" label="排查日期" />
          <el-table-column prop="inspector_name" label="排查人员" />
          <el-table-column prop="location" label="排查地点" />
          <el-table-column label="是否发现隐患">
            <template #default="scope">
              <el-tag :type="scope.row.hazard_found ? 'danger' : 'success'">
                {{ scope.row.hazard_found ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="hazard_description" label="隐患描述" />
          <el-table-column label="状态">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ getStatusText(scope.row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button size="small" @click="handleViewRecordDetail(scope.row)">查看</el-button>
              <el-button size="small" type="primary" @click="handleEditRecord(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDeleteRecord(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </el-card>
    
    <!-- 新增/编辑排查记录对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="排查计划" prop="plan_id">
          <el-select v-model="form.plan_id" placeholder="请选择排查计划" @change="handlePlanChange">
            <el-option v-for="plan in plans" :key="plan.id" :label="plan.plan_name" :value="plan.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="排查日期" prop="inspection_date">
          <el-date-picker v-model="form.inspection_date" type="date" placeholder="请选择排查日期" />
        </el-form-item>
        <el-form-item label="排查地点">
          <el-input v-model="form.location" placeholder="请输入排查地点" />
        </el-form-item>
        <el-form-item label="是否发现隐患" prop="hazard_found">
          <el-radio-group v-model="form.hazard_found" @change="handleHazardChange">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.hazard_found" label="关联隐患">
          <el-select v-model="form.hazard_id" placeholder="请选择隐患" clearable>
            <el-option v-for="hazard in hazards" :key="hazard.id" :label="hazard.hazard_description" :value="hazard.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="排查描述">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入排查描述" />
        </el-form-item>
        <el-form-item label="上传照片">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="handlePhotoChange"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="已完成" value="completed" />
            <el-option label="待处理" value="pending" />
            <el-option label="发现问题" value="issue_found" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  getInspectionRecords,
  createInspectionRecord,
  updateInspectionRecord,
  deleteInspectionRecord,
  getTodayInspections
} from '@/api/inspectionPlan';
import { getInspectionPlans } from '@/api/inspectionPlan';
import { getHazardList as getHazards } from '@/api/hazardV2';

const tableData = ref([]);
const todayTasks = ref([]);
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);
const dialogVisible = ref(false);
const dialogTitle = ref('新增排查记录');
const formRef = ref();
const plans = ref([]);
const hazards = ref([]);

const searchForm = reactive({
  plan_id: null,
  inspection_date: '',
  hazard_found: null
});

const form = reactive({
  id: null,
  plan_id: null,
  inspection_date: '',
  location: '',
  hazard_found: 0,
  hazard_id: null,
  description: '',
  photos: '',
  status: 'completed'
});

const rules = {
  plan_id: [{ required: true, message: '请选择排查计划', trigger: 'change' }],
  inspection_date: [{ required: true, message: '请选择排查日期', trigger: 'change' }]
};

// 获取今日待排查任务
const fetchTodayTasks = async () => {
  try {
    const res = await getTodayInspections();
    todayTasks.value = res.data.data || [];
  } catch (error) {
    console.error('获取今日待排查任务失败', error);
  }
};

// 获取排查记录列表
const fetchData = async () => {
  try {
    const res = await getInspectionRecords({
      ...searchForm,
      page: currentPage.value,
      limit: pageSize.value
    });
    tableData.value = res.data.data;
    total.value = res.data.total;
  } catch (error) {
    ElMessage.error('获取排查记录列表失败');
  }
};

// 获取排查计划列表
const fetchPlans = async () => {
  try {
    const res = await getInspectionPlans({ page: 1, limit: 1000 });
    plans.value = res.data.data || [];
  } catch (error) {
    console.error('获取排查计划列表失败', error);
  }
};

// 获取隐患列表
const fetchHazards = async () => {
  try {
    const res = await getHazards({ page: 1, limit: 1000 });
    hazards.value = res.data.data || [];
  } catch (error) {
    console.error('获取隐患列表失败', error);
  }
};

// 搜索
const handleSearch = () => {
  currentPage.value = 1;
  fetchData();
};

// 重置搜索
const resetSearch = () => {
  searchForm.plan_id = null;
  searchForm.inspection_date = '';
  searchForm.hazard_found = null;
  currentPage.value = 1;
  fetchData();
};

// 新增排查记录
const handleCreateRecord = () => {
  dialogTitle.value = '新增排查记录';
  resetForm();
  dialogVisible.value = true;
};

// 执行排查
const handleExecuteInspection = (task: any) => {
  dialogTitle.value = '执行排查';
  resetForm();
  form.plan_id = task.plan_id;
  form.location = task.location || '';
  dialogVisible.value = true;
};

// 查看记录
const handleViewRecord = (task: any) => {
  // 跳转到记录详情
  console.log('查看记录', task);
};

// 查看记录详情
const handleViewRecordDetail = (row: any) => {
  // 查看记录详情
  console.log('查看记录详情', row);
};

// 编辑记录
const handleEditRecord = (row: any) => {
  dialogTitle.value = '编辑排查记录';
  Object.assign(form, row);
  dialogVisible.value = true;
};

// 删除记录
const handleDeleteRecord = (row: any) => {
  ElMessageBox.confirm('确定删除该排查记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteInspectionRecord(row.id);
      ElMessage.success('删除成功');
      fetchData();
    } catch (error) {
      ElMessage.error('删除失败');
    }
  });
};

// 提交表单
const handleSubmit = () => {
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        if (form.id) {
          await updateInspectionRecord(form.id, form);
          ElMessage.success('更新成功');
        } else {
          await createInspectionRecord(form);
          ElMessage.success('创建成功');
        }
        dialogVisible.value = false;
        fetchData();
        fetchTodayTasks();
      } catch (error) {
        ElMessage.error('操作失败');
      }
    }
  });
};

// 重置表单
const resetForm = () => {
  form.id = null;
  form.plan_id = null;
  form.inspection_date = '';
  form.location = '';
  form.hazard_found = 0;
  form.hazard_id = null;
  form.description = '';
  form.photos = '';
  form.status = 'completed';
};

// 计划变更
const handlePlanChange = (planId: number) => {
  const plan = plans.value.find((p: any) => p.id === planId);
  if (plan) {
    form.location = plan.location || '';
  }
};

// 是否发现隐患变更
const handleHazardChange = (value: number) => {
  if (value === 0) {
    form.hazard_id = null;
  }
};

// 照片变更
const handlePhotoChange = (file: any) => {
  // 处理照片上传
  console.log('照片变更', file);
};

// 分页
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  fetchData();
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  fetchData();
};

// 格式化计划类型
const formatPlanType = (type: string) => {
  const map: any = {
    'daily': '日常排查',
    'periodic': '定期排查',
    'special': '专项排查'
  };
  return map[type] || type;
};

// 格式化频率
const formatFrequency = (frequency: string) => {
  const map: any = {
    'daily': '每天',
    'weekly': '每周',
    'monthly': '每月',
    'quarterly': '每季度'
  };
  return map[frequency] || frequency;
};

// 获取状态类型
const getStatusType = (status: string) => {
  const map: any = {
    'completed': 'success',
    'pending': 'warning',
    'issue_found': 'danger'
  };
  return map[status] || 'info';
};

// 获取状态文本
const getStatusText = (status: string) => {
  const map: any = {
    'completed': '已完成',
    'pending': '待处理',
    'issue_found': '发现问题'
  };
  return map[status] || status;
};

onMounted(() => {
  fetchTodayTasks();
  fetchData();
  fetchPlans();
  fetchHazards();
});
</script>

<style scoped>
.inspection-execution-container {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.today-tasks-card {
  margin-bottom: 20px;
}
.search-form {
  margin-bottom: 20px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>