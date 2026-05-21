<template>
  <div class="emergency-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><FirstAidKit /></el-icon>
        应急物资管理
      </h2>
      <div class="header-actions">
        <el-button type="primary" @click="showAddDialog = true">
          <el-icon><Plus /></el-icon>
          添加物资
        </el-button>
        <el-button type="info" @click="showContactDialog = true">
          <el-icon><Phone /></el-icon>
          应急通讯录
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon">📦</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-label">物资总数</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-normal">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.normal }}</div>
            <div class="stat-label">库存正常</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-low">
          <div class="stat-icon">⚠️</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.low }}</div>
            <div class="stat-label">库存不足</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-expired">
          <div class="stat-icon">⏰</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.expired }}</div>
            <div class="stat-label">即将过期</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="物资类型">
          <el-select v-model="queryParams.type" placeholder="全部类型" clearable style="width: 150px">
            <el-option
              v-for="(label, key) in SUPPLY_TYPE_TEXT"
              :key="key"
              :label="label"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="queryParams.keyword" placeholder="名称/编号" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 物资列表 -->
    <div class="table-section">
      <el-table :data="supplyList" border stripe v-loading="loading">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="supply_no" label="物资编号" width="150" />
        <el-table-column prop="name" label="物资名称" min-width="150" />
        <el-table-column label="类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag size="small">{{ SUPPLY_TYPE_TEXT[row.supply_type] || row.supply_type || '-' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="specification" label="规格型号" width="120" show-overflow-tooltip />
        <el-table-column label="库存数量" width="120" align="center">
          <template #default="{ row }">
            <span
              :style="{
                color: row.quantity <= row.min_alert_quantity ? '#f56c6c' : '#67c23a',
                fontWeight: 'bold'
              }"
            >
              {{ row.quantity }} {{ row.unit }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="存放位置" width="120" show-overflow-tooltip />
        <el-table-column prop="responsible_person" label="负责人" width="100" />
        <el-table-column prop="expire_date" label="有效期至" width="120" />
        <el-table-column label="库存状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag
              v-if="row.quantity <= row.min_alert_quantity"
              type="danger"
              size="small"
            >
              不足
            </el-tag>
            <el-tag v-else type="success" size="small">
              正常
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right" align="center">
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
      :title="isEdit ? '编辑物资' : '添加物资'"
      width="600px"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110px">
        <el-form-item label="物资名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入物资名称" />
        </el-form-item>
        <el-form-item label="物资类型" prop="supplyType">
          <el-select v-model="formData.supplyType" placeholder="请选择" style="width: 100%">
            <el-option
              v-for="(label, key) in SUPPLY_TYPE_TEXT"
              :key="key"
              :label="label"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="规格型号">
          <el-input v-model="formData.specification" placeholder="请输入规格型号" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="库存数量" prop="quantity">
              <el-input-number v-model="formData.quantity" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位">
              <el-input v-model="formData.unit" placeholder="如：个、箱、套" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="存放位置">
          <el-input v-model="formData.location" placeholder="请输入存放位置" />
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="formData.responsiblePerson" placeholder="请输入负责人" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="formData.contactPhone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="有效期至">
              <el-date-picker
                v-model="formData.expireDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="选择日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最低库存预警">
              <el-input-number v-model="formData.minAlertQuantity" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="供应商">
          <el-input v-model="formData.supplier" placeholder="请输入供应商" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情抽屉 -->
    <el-drawer v-model="showDetail" title="物资详情" size="500px">
      <div v-if="currentSupply" class="supply-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="物资编号" :span="2">{{ currentSupply.supply_no }}</el-descriptions-item>
          <el-descriptions-item label="物资名称">{{ currentSupply.name }}</el-descriptions-item>
          <el-descriptions-item label="类型">{{ SUPPLY_TYPE_TEXT[currentSupply.supply_type] || '-' }}</el-descriptions-item>
          <el-descriptions-item label="规格型号">{{ currentSupply.specification || '-' }}</el-descriptions-item>
          <el-descriptions-item label="单位">{{ currentSupply.unit || '-' }}</el-descriptions-item>
          <el-descriptions-item label="库存数量" :span="2">
            <span :style="{ color: currentSupply.quantity <= currentSupply.min_alert_quantity ? '#f56c6c' : '#67c23a', fontWeight: 'bold' }">
              {{ currentSupply.quantity }} {{ currentSupply.unit }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="存放位置">{{ currentSupply.location || '-' }}</el-descriptions-item>
          <el-descriptions-item label="负责人">{{ currentSupply.responsible_person || '-' }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ currentSupply.contact_phone || '-' }}</el-descriptions-item>
          <el-descriptions-item label="有效期至">{{ currentSupply.expire_date || '-' }}</el-descriptions-item>
          <el-descriptions-item label="最低库存">{{ currentSupply.min_alert_quantity }}</el-descriptions-item>
          <el-descriptions-item label="供应商" :span="2">{{ currentSupply.supplier || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-drawer>

    <!-- 应急通讯录对话框 -->
    <el-dialog v-model="showContactDialog" title="应急通讯录" width="700px">
      <div class="contact-section">
        <div class="contact-type">
          <h4>内部联系人</h4>
          <el-table :data="internalContacts" border size="small">
            <el-table-column prop="name" label="姓名" width="100" />
            <el-table-column prop="department" label="部门" width="120" />
            <el-table-column prop="position" label="职位" width="100" />
            <el-table-column prop="phone" label="电话" width="130" />
            <el-table-column prop="priority" label="优先级" width="80" align="center" />
          </el-table>
        </div>
        <div class="contact-type">
          <h4>外部机构</h4>
          <el-table :data="externalContacts" border size="small">
            <el-table-column prop="name" label="机构名称" width="150" />
            <el-table-column prop="position" label="联系人" width="100" />
            <el-table-column prop="phone" label="电话" width="130" />
            <el-table-column prop="priority" label="优先级" width="80" align="center" />
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { FirstAidKit, Plus, Phone } from '@element-plus/icons-vue';
import {
  getSuppliesList,
  createSupply,
  updateSupply,
  deleteSupply,
  getContactsList,
  SUPPLY_TYPE_TEXT
} from '@/api/emergency';

const loading = ref(false);
const supplyList = ref<any[]>([]);
const total = ref(0);

const stats = reactive({
  total: 0,
  normal: 0,
  low: 0,
  expired: 0
});

const queryParams = reactive({
  page: 1,
  pageSize: 20,
  keyword: '',
  type: ''
});

// 对话框相关
const showAddDialog = ref(false);
const isEdit = ref(false);
const formRef = ref();
const formData = reactive({
  id: null as number | null,
  name: '',
  supplyType: '',
  specification: '',
  quantity: 0,
  unit: '',
  location: '',
  responsiblePerson: '',
  contactPhone: '',
  expireDate: '',
  supplier: '',
  minAlertQuantity: 1
});

const formRules = {
  name: [{ required: true, message: '请输入物资名称', trigger: 'blur' }],
  supplyType: [{ required: true, message: '请选择物资类型', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入库存数量', trigger: 'blur' }]
};

// 详情相关
const showDetail = ref(false);
const currentSupply = ref<any>(null);

// 通讯录相关
const showContactDialog = ref(false);
const internalContacts = ref<any[]>([]);
const externalContacts = ref<any[]>([]);

// 加载物资列表
const loadSupplies = async () => {
  loading.value = true;
  try {
    const res: any = await getSuppliesList(queryParams);
    if (res.success) {
      supplyList.value = res.data.list;
      total.value = res.data.pagination.total;
      updateStats();
    }
  } catch (error) {
    console.error('加载物资列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 更新统计数据
const updateStats = () => {
  stats.total = supplyList.value.length;
  stats.normal = supplyList.value.filter(s => s.quantity > s.min_alert_quantity).length;
  stats.low = supplyList.value.filter(s => s.quantity <= s.min_alert_quantity).length;
  stats.expired = supplyList.value.filter(s => {
    if (!s.expire_date) return false;
    const daysUntilExpire = Math.floor(
      (new Date(s.expire_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpire <= 30 && daysUntilExpire > 0;
  }).length;
};

// 加载通讯录
const loadContacts = async () => {
  try {
    const res: any = await getContactsList();
    if (res.success) {
      internalContacts.value = res.data.filter((c: any) => c.contact_type === 'internal');
      externalContacts.value = res.data.filter((c: any) => c.contact_type !== 'internal');
    }
  } catch (error) {
    console.error('加载通讯录失败:', error);
  }
};

// 查询
const handleQuery = () => {
  queryParams.page = 1;
  loadSupplies();
};

// 重置
const handleReset = () => {
  queryParams.keyword = '';
  queryParams.type = '';
  queryParams.page = 1;
  loadSupplies();
};

// 分页
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  loadSupplies();
};

const handleCurrentChange = (val: number) => {
  queryParams.page = val;
  loadSupplies();
};

// 编辑
const handleEdit = (row: any) => {
  isEdit.value = true;
  Object.assign(formData, {
    id: row.id,
    name: row.name,
    supplyType: row.supply_type,
    specification: row.specification,
    quantity: row.quantity,
    unit: row.unit,
    location: row.location,
    responsiblePerson: row.responsible_person,
    contactPhone: row.contact_phone,
    expireDate: row.expire_date,
    supplier: row.supplier,
    minAlertQuantity: row.min_alert_quantity
  });
  showAddDialog.value = true;
};

// 查看
const handleView = (row: any) => {
  currentSupply.value = row;
  showDetail.value = true;
};

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认删除该物资吗？', '提示', { type: 'warning' });
    await deleteSupply(row.id);
    ElMessage.success('删除成功');
    loadSupplies();
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
          await updateSupply(formData.id!, formData);
          ElMessage.success('更新成功');
        } else {
          await createSupply(formData);
          ElMessage.success('添加成功');
        }
        showAddDialog.value = false;
        loadSupplies();
      } catch (error) {
        console.error('保存失败:', error);
      }
    }
  });
};

onMounted(() => {
  loadSupplies();
  loadContacts();
});
</script>

<style scoped>
.emergency-management {
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
  color: #f56c6c;
}

.header-actions {
  display: flex;
  gap: 10px;
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

.stat-normal .stat-icon { opacity: 0.8; }
.stat-low .stat-icon { opacity: 0.8; }
.stat-expired .stat-icon { opacity: 0.8; }

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

.supply-detail {
  padding: 0 10px;
}

.contact-section {
  max-height: 500px;
  overflow-y: auto;
}

.contact-type {
  margin-bottom: 20px;
}

.contact-type h4 {
  margin-bottom: 10px;
  font-size: 14px;
  color: #303133;
}
</style>
