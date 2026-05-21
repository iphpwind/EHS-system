<template>
  <div class="inspection-plan-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>排查计划管理</span>
          <el-button type="primary" @click="handleCreate">新增计划</el-button>
        </div>
      </template>
      
      <!-- 搜索表单 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="计划名称">
          <el-input v-model="searchForm.plan_name" placeholder="请输入计划名称" clearable />
        </el-form-item>
        <el-form-item label="计划类型">
          <el-select v-model="searchForm.plan_type" placeholder="请选择类型" clearable>
            <el-option label="日常排查" value="daily" />
            <el-option label="定期排查" value="periodic" />
            <el-option label="专项排查" value="special" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="启用" value="active" />
            <el-option label="停用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      
      <!-- 表格 -->
      <el-table :data="tableData" border style="width: 100%">
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
        <el-table-column prop="start_date" label="开始日期" />
        <el-table-column prop="end_date" label="结束日期" />
        <el-table-column prop="dept_name" label="责任部门" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">
              {{ scope.row.status === 'active' ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="creator_name" label="创建人" />
        <el-table-column prop="created_at" label="创建时间" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
    
    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="计划名称" prop="plan_name">
          <el-input v-model="form.plan_name" placeholder="请输入计划名称" />
        </el-form-item>
        <el-form-item label="计划类型" prop="plan_type">
          <el-select v-model="form.plan_type" placeholder="请选择类型">
            <el-option label="日常排查" value="daily" />
            <el-option label="定期排查" value="periodic" />
            <el-option label="专项排查" value="special" />
          </el-select>
        </el-form-item>
        <el-form-item label="排查频率" prop="frequency">
          <el-select v-model="form.frequency" placeholder="请选择频率">
            <el-option label="每天" value="daily" />
            <el-option label="每周" value="weekly" />
            <el-option label="每月" value="monthly" />
            <el-option label="每季度" value="quarterly" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期" prop="start_date">
          <el-date-picker v-model="form.start_date" type="date" placeholder="请选择开始日期" />
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker v-model="form.end_date" type="date" placeholder="请选择结束日期" />
        </el-form-item>
        <el-form-item label="风险等级">
          <el-select v-model="form.risk_level" placeholder="请选择风险等级">
            <el-option label="高" value="high" />
            <el-option label="中" value="medium" />
            <el-option label="低" value="low" />
          </el-select>
        </el-form-item>
        <el-form-item label="隐患类型">
          <el-input v-model="form.hazard_type" placeholder="请输入隐患类型" />
        </el-form-item>
        <el-form-item label="排查地点">
          <el-input v-model="form.location" placeholder="请输入排查地点" />
        </el-form-item>
        <el-form-item label="责任部门" prop="department_id">
          <el-select v-model="form.department_id" placeholder="请选择部门">
            <el-option v-for="dept in departments" :key="dept.id" :label="dept.dept_name" :value="dept.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="排查人员">
          <el-select v-model="form.inspector_ids" multiple placeholder="请选择排查人员">
            <el-option v-for="user in users" :key="user.id" :label="user.username" :value="user.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">停用</el-radio>
          </el-radio-group>
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
  getInspectionPlans,
  getInspectionPlanDetail,
  createInspectionPlan,
  updateInspectionPlan,
  deleteInspectionPlan
} from '@/api/inspectionPlan';
import { listDept as getDepartments } from '@/api/system/dept';
import { listUser as getUsers } from '@/api/system/user';

const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);
const dialogVisible = ref(false);
const dialogTitle = ref('新增计划');
const formRef = ref();
const departments = ref([]);
const users = ref([]);

const searchForm = reactive({
  plan_name: '',
  plan_type: '',
  status: ''
});

const form = reactive({
  id: null,
  plan_name: '',
  plan_type: '',
  frequency: '',
  start_date: '',
  end_date: '',
  risk_level: '',
  hazard_type: '',
  location: '',
  department_id: null,
  inspector_ids: [],
  status: 'active'
});

const rules = {
  plan_name: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
  plan_type: [{ required: true, message: '请选择计划类型', trigger: 'change' }],
  frequency: [{ required: true, message: '请选择排查频率', trigger: 'change' }],
  start_date: [{ required: true, message: '请选择开始日期', trigger: 'change' }]
};

// 获取排查计划列表
const fetchData = async () => {
  try {
    const res = await getInspectionPlans({
      ...searchForm,
      page: currentPage.value,
      limit: pageSize.value
    });
    tableData.value = res.data.data;
    total.value = res.data.total;
  } catch (error) {
    ElMessage.error('获取排查计划列表失败');
  }
};

// 获取部门列表
const fetchDepartments = async () => {
  try {
    const res = await getDepartments();
    departments.value = res.data.data || res.data;
  } catch (error) {
    console.error('获取部门列表失败', error);
  }
};

// 获取用户列表
const fetchUsers = async () => {
  try {
    const res = await getUsers();
    users.value = res.data.data || res.data;
  } catch (error) {
    console.error('获取用户列表失败', error);
  }
};

// 搜索
const handleSearch = () => {
  currentPage.value = 1;
  fetchData();
};

// 重置搜索
const resetSearch = () => {
  searchForm.plan_name = '';
  searchForm.plan_type = '';
  searchForm.status = '';
  currentPage.value = 1;
  fetchData();
};

// 新增
const handleCreate = () => {
  dialogTitle.value = '新增计划';
  resetForm();
  dialogVisible.value = true;
};

// 查看
const handleView = async (row: any) => {
  try {
    const res = await getInspectionPlanDetail(row.id);
    Object.assign(form, res.data.data);
    form.inspector_ids = form.inspector_ids ? form.inspector_ids.split(',').map(Number) : [];
    dialogTitle.value = '查看计划';
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error('获取计划详情失败');
  }
};

// 编辑
const handleEdit = async (row: any) => {
  try {
    const res = await getInspectionPlanDetail(row.id);
    Object.assign(form, res.data.data);
    form.inspector_ids = form.inspector_ids ? form.inspector_ids.split(',').map(Number) : [];
    dialogTitle.value = '编辑计划';
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error('获取计划详情失败');
  }
};

// 删除
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确定删除该计划吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteInspectionPlan(row.id);
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
        const formData = { ...form };
        formData.inspector_ids = form.inspector_ids.join(',');
        
        if (form.id) {
          await updateInspectionPlan(form.id, formData);
          ElMessage.success('更新成功');
        } else {
          await createInspectionPlan(formData);
          ElMessage.success('创建成功');
        }
        dialogVisible.value = false;
        fetchData();
      } catch (error) {
        ElMessage.error('操作失败');
      }
    }
  });
};

// 重置表单
const resetForm = () => {
  form.id = null;
  form.plan_name = '';
  form.plan_type = '';
  form.frequency = '';
  form.start_date = '';
  form.end_date = '';
  form.risk_level = '';
  form.hazard_type = '';
  form.location = '';
  form.department_id = null;
  form.inspector_ids = [];
  form.status = 'active';
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

onMounted(() => {
  fetchData();
  fetchDepartments();
  fetchUsers();
});
</script>

<style scoped>
.inspection-plan-container {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search-form {
  margin-bottom: 20px;
}
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>