<template>
  <div class="hazard-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">
          <el-icon><Warning /></el-icon>
          隐患排查治理闭环管理
        </h2>
        <div class="status-flow">
          <el-steps :active="currentStep" finish-status="success" simple>
            <el-step title="待整改" :type="stats.pending > 0 ? 'warning' : ''" />
            <el-step title="整改中" />
            <el-step title="待验收" />
            <el-step title="已完成" />
          </el-steps>
        </div>
      </div>
      <div class="header-right">
        <el-button type="danger" @click="handleCreate">
          <el-icon><Plus /></el-icon>
          新增隐患
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card stat-total">
            <div class="stat-icon"><Warning /></div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.total }}</div>
              <div class="stat-label">隐患总数</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card stat-pending">
            <div class="stat-icon"><Clock /></div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.pending }}</div>
              <div class="stat-label">待整改</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card stat-overdue" @click="showOverdue = true">
            <div class="stat-icon"><Timer /></div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.overdue }}</div>
              <div class="stat-label">逾期未整改</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card stat-completed">
            <div class="stat-icon"><CircleCheck /></div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.completed }}</div>
              <div class="stat-label">已完成</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="隐患等级">
          <el-select v-model="queryParams.level" placeholder="全部等级" clearable style="width: 150px">
            <el-option
              v-for="item in HAZARD_LEVEL_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span :style="{ color: item.color }">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select v-model="queryParams.status" placeholder="全部状态" clearable style="width: 150px">
            <el-option
              v-for="(label, key) in HAZARD_STATUS_TEXT"
              :key="key"
              :label="label"
              :value="Number(key)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="queryParams.keyword" placeholder="隐患描述/位置" clearable />
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 隐患列表 -->
    <div class="table-section">
      <el-table
        v-loading="loading"
        :data="hazardList"
        border
        stripe
        :row-class-name="tableRowClassName"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="inspection_no" label="隐患编号" width="150" />
        <el-table-column prop="hazard_description" label="隐患描述" min-width="200" show-overflow-tooltip />
        <el-table-column label="隐患等级" width="100" align="center">
          <template #default="{ row }">
            <el-tag
              :type="getLevelTagType(row.hazard_level)"
              size="small"
            >
              {{ getLevelText(row.hazard_level) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="处理状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag
              :type="HAZARD_STATUS_COLOR[row.status]"
              size="small"
            >
              {{ HAZARD_STATUS_TEXT[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="发现位置" width="150" show-overflow-tooltip />
        <el-table-column prop="department_name" label="责任部门" width="120" />
        <el-table-column prop="rectification_deadline" label="整改期限" width="120" />
        <el-table-column label="逾期" width="80" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.is_overdue" type="danger" size="small">
              {{ row.overdue_days }}天
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button
              link
              type="success"
              @click="handleNextAction(row)"
            >
              {{ getNextActionText(row.status) }}
            </el-button>
            <el-dropdown trigger="click">
              <el-button link type="info">更多</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleEdit(row)">编辑</el-dropdown-item>
                  <el-dropdown-item
                    v-if="row.status === 1"
                    @click="handleClose(row)"
                  >
                    关闭
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="row.status === 1"
                    divided
                    @click="handleDelete(row)"
                  >
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 隐患详情抽屉 -->
    <el-drawer
      v-model="detailVisible"
      title="隐患详情"
      size="800px"
      :before-close="handleDetailClose"
    >
      <div v-if="currentHazard" class="hazard-detail">
        <!-- 基本信息 -->
        <div class="detail-section">
          <h4 class="section-title">基本信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="隐患编号">{{ currentHazard.inspection_no }}</el-descriptions-item>
            <el-descriptions-item label="隐患等级">
              <el-tag :type="getLevelTagType(currentHazard.hazard_level)" size="small">
                {{ getLevelText(currentHazard.hazard_level) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="处理状态">
              <el-tag :type="HAZARD_STATUS_COLOR[currentHazard.status]" size="small">
                {{ HAZARD_STATUS_TEXT[currentHazard.status] }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="发现人">{{ currentHazard.discoverer_name }}</el-descriptions-item>
            <el-descriptions-item label="发现时间" :span="2">{{ currentHazard.discovery_time || currentHazard.created_at }}</el-descriptions-item>
            <el-descriptions-item label="隐患位置" :span="2">{{ currentHazard.location }}</el-descriptions-item>
            <el-descriptions-item label="责任部门">{{ currentHazard.department_name || currentHazard.department }}</el-descriptions-item>
            <el-descriptions-item label="整改期限">{{ currentHazard.rectification_deadline }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 隐患描述 -->
        <div class="detail-section">
          <h4 class="section-title">隐患描述</h4>
          <div class="description-content">{{ currentHazard.hazard_description }}</div>
        </div>

        <!-- 整改信息 -->
        <div class="detail-section">
          <h4 class="section-title">整改信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="整改负责人">{{ currentHazard.rectification_responsible }}</el-descriptions-item>
            <el-descriptions-item label="整改措施">{{ currentHazard.rectification_measure }}</el-descriptions-item>
            <el-descriptions-item label="整改结果" :span="2">{{ currentHazard.rectification_result }}</el-descriptions-item>
            <el-descriptions-item label="验收人">{{ currentHazard.verifier_name }}</el-descriptions-item>
            <el-descriptions-item label="验收意见">{{ currentHazard.verifier_comments }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- 闭环记录 -->
        <div class="detail-section">
          <h4 class="section-title">闭环时间线</h4>
          <el-timeline>
            <el-timeline-item
              v-if="currentHazard.created_at"
              :timestamp="currentHazard.created_at"
              type="primary"
            >
              隐患登记
            </el-timeline-item>
            <el-timeline-item
              v-if="currentHazard.rectification_time"
              :timestamp="currentHazard.rectification_time"
              type="warning"
            >
              提交整改方案
            </el-timeline-item>
            <el-timeline-item
              v-if="currentHazard.updated_at && currentHazard.status >= 3"
              :timestamp="currentHazard.updated_at"
              type="info"
            >
              整改完成，等待验收
            </el-timeline-item>
            <el-timeline-item
              v-if="currentHazard.verification_time"
              :timestamp="currentHazard.verification_time"
              type="success"
            >
              验收通过，隐患消除
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-drawer>

    <!-- 新增/编辑隐患对话框 -->
    <el-dialog
      v-model="formVisible"
      :title="isEdit ? '编辑隐患' : '新增隐患'"
      width="700px"
      :before-close="handleFormClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="隐患描述" prop="hazard_description">
          <el-input
            v-model="formData.hazard_description"
            type="textarea"
            :rows="3"
            placeholder="请描述发现的隐患内容"
          />
        </el-form-item>
        <el-form-item label="隐患等级" prop="hazard_level">
          <el-select v-model="formData.hazard_level" placeholder="请选择隐患等级">
            <el-option
              v-for="item in HAZARD_LEVEL_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span :style="{ color: item.color }">{{ item.label }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发现位置" prop="location">
          <el-input v-model="formData.location" placeholder="请输入隐患发现位置" />
        </el-form-item>
        <el-form-item label="责任部门" prop="department">
          <el-input v-model="formData.department" placeholder="请输入责任部门" />
        </el-form-item>
        <el-form-item label="整改期限" prop="rectification_deadline">
          <el-date-picker
            v-model="formData.rectification_deadline"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="选择整改期限"
          />
        </el-form-item>
        <el-form-item label="整改负责人">
          <el-input v-model="formData.rectification_responsible" placeholder="请输入整改负责人" />
        </el-form-item>
        <!-- Phase 3.1: 隐患排查模块增强 - 图片上传（5MB限制 + 水印） -->
        <el-form-item label="隐患图片">
          <el-upload
            v-model:file-list="beforeImages"
            action="/api/hazard-v2/upload-images"
            list-type="picture-card"
            :limit="5"
            :on-exceed="handleExceed"
            :before-upload="beforeImageUpload"
            :on-success="handleBeforeUploadSuccess"
            :on-remove="handleBeforeRemove"
          >
            <el-icon><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">
                只能上传图片文件，且不超过 5MB，最多 5 张（已添加水印，GB 30871-2022 合规）
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 整改对话框 -->
    <el-dialog
      v-model="rectifyVisible"
      :title="rectifyTitle"
      width="600px"
    >
      <el-form ref="rectifyFormRef" :model="rectifyData" label-width="100px">
        <el-form-item label="整改措施" v-if="rectifyType === 'submit'">
          <el-input
            v-model="rectifyData.rectification_measure"
            type="textarea"
            :rows="3"
            placeholder="请描述整改措施"
          />
        </el-form-item>
        <el-form-item label="整改期限" v-if="rectifyType === 'submit'">
          <el-date-picker
            v-model="rectifyData.rectification_deadline"
            type="date"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="整改负责人" v-if="rectifyType === 'submit'">
          <el-input v-model="rectifyData.rectification_responsible" placeholder="请输入整改负责人" />
        </el-form-item>
        <el-form-item label="整改结果" v-if="rectifyType === 'complete'">
          <el-input
            v-model="rectifyData.rectification_result"
            type="textarea"
            :rows="3"
            placeholder="请描述整改结果"
          />
        </el-form-item>
        <!-- Phase 3.1: 隐患排查模块增强 - 整改后图片上传（5MB限制 + 水印） -->
        <el-form-item label="整改后图片" v-if="rectifyType === 'complete'">
          <el-upload
            v-model:file-list="afterImages"
            action="/api/hazard-v2/upload-images"
            list-type="picture-card"
            :limit="5"
            :on-exceed="handleExceed"
            :before-upload="beforeImageUpload"
            :on-success="handleAfterUploadSuccess"
            :on-remove="handleAfterRemove"
          >
            <el-icon><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">
                只能上传图片文件，且不超过 5MB，最多 5 张（已添加水印，GB 30871-2022 合规）
              </div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="验收结论" v-if="rectifyType === 'accept'">
          <el-radio-group v-model="rectifyData.verification_result">
            <el-radio :label="1">合格</el-radio>
            <el-radio :label="2">不合格，需继续整改</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="验收意见" v-if="rectifyType === 'accept'">
          <el-input
            v-model="rectifyData.verifier_comments"
            type="textarea"
            :rows="2"
            placeholder="请输入验收意见"
          />
        </el-form-item>
        <el-form-item label="复查结论" v-if="rectifyType === 'recheck'">
          <el-radio-group v-model="rectifyData.recheck_result">
            <el-radio :label="1">合格</el-radio>
            <el-radio :label="2">不合格，需继续整改</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="复查意见" v-if="rectifyType === 'recheck'">
          <el-input
            v-model="rectifyData.recheck_comments"
            type="textarea"
            :rows="2"
            placeholder="请输入复查意见"
          />
        </el-form-item>
        <el-form-item label="关闭原因" v-if="rectifyType === 'close'">
          <el-input
            v-model="rectifyData.closure_reason"
            type="textarea"
            :rows="3"
            placeholder="请说明关闭原因（如：无需整改、已消除等）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rectifyVisible = false">取消</el-button>
        <el-button type="primary" @click="handleRectifySubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 逾期隐患列表 -->
    <el-dialog v-model="showOverdue" title="逾期隐患列表" width="900px">
      <el-table :data="overdueList" border stripe>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="inspection_no" label="隐患编号" width="150" />
        <el-table-column prop="hazard_description" label="隐患描述" min-width="200" show-overflow-tooltip />
        <el-table-column label="等级" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getLevelTagType(row.hazard_level)" size="small">
              {{ getLevelText(row.hazard_level) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="rectification_deadline" label="整改期限" width="120" />
        <el-table-column label="逾期天数" width="100" align="center">
          <template #default="{ row }">
            <el-tag type="danger">{{ row.overdue_days }}天</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row); showOverdue = false">处理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  Warning, Plus, Clock, Timer, CircleCheck
} from '@element-plus/icons-vue';
import {
  getHazardList,
  getHazardById,
  createHazard,
  updateHazard,
  deleteHazard,
  submitRectification,
  completeRectification,
  acceptHazard,
  recheckHazard,
  closeHazard,
  getHazardStats,
  getOverdueHazards,
  HAZARD_STATUS_TEXT,
  HAZARD_STATUS_COLOR,
  HAZARD_LEVEL_OPTIONS
} from '@/api/hazardV2';

const loading = ref(false);
const hazardList = ref<any[]>([]);
const total = ref(0);
const stats = reactive({
  total: 0,
  pending: 0,
  rectifying: 0,
  pending_verify: 0,
  completed: 0,
  closed: 0,
  overdue: 0,
  major_pending: 0
});

// 查询参数
const queryParams = reactive({
  page: 1,
  pageSize: 20,
  level: '',
  status: null as number | null,
  keyword: '',
  startDate: '',
  endDate: ''
});

const dateRange = ref<[string, string] | null>(null);

// 详情相关
const detailVisible = ref(false);
const currentHazard = ref<any>(null);

// 表单相关
const formVisible = ref(false);
const formRef = ref();
const isEdit = ref(false);
const formData = reactive({
  id: null as number | null,
  hazard_description: '',
  hazard_level: 'general',
  location: '',
  department: '',
  rectification_deadline: '',
  rectification_responsible: ''
});

const formRules = {
  hazard_description: [{ required: true, message: '请输入隐患描述', trigger: 'blur' }]
};

// 整改相关
const rectifyVisible = ref(false);
const rectifyFormRef = ref();
const rectifyType = ref<'submit' | 'complete' | 'accept' | 'recheck' | 'close'>('submit');
const rectifyTitle = ref('');
const rectifyData = reactive({
  rectification_measure: '',
  rectification_deadline: '',
  rectification_responsible: '',
  rectification_result: '',
  verification_result: 1,
  verifier_comments: '',
  recheck_result: 1,
  recheck_comments: '',
  closure_reason: ''
});

// 逾期列表
const showOverdue = ref(false);
const overdueList = ref<any[]>([]);

// 当前步骤（用于状态流程图）
const currentStep = computed(() => {
  if (stats.pending > 0) return 0;
  if (stats.rectifying > 0) return 1;
  if (stats.pending_verify > 0) return 2;
  return 3;
});

// 获取隐患等级文本
const getLevelText = (level: string) => {
  const item = HAZARD_LEVEL_OPTIONS.find(o => o.value === level);
  return item ? item.label : level;
};

// 获取隐患等级标签类型
const getLevelTagType = (level: string) => {
  const typeMap: Record<string, string> = {
    major: 'danger',
    serious: 'warning',
    general: 'warning',
    low: 'info'
  };
  return typeMap[level] || 'info';
};

// 获取下一步操作文本
const getNextActionText = (status: number) => {
  const actionMap: Record<number, string> = {
    1: '提交整改',
    2: '完成整改',
    3: '验收',
    4: '复查',
    5: '查看'
  };
  return actionMap[status] || '查看';
};

// 表格行样式
const tableRowClassName = ({ row }: any) => {
  if (row.is_overdue) return 'overdue-row';
  if (row.hazard_level === 'major') return 'major-row';
  return '';
};

// 加载隐患列表
const loadHazardList = async () => {
  loading.value = true;
  try {
    const params: any = { ...queryParams };
    if (dateRange.value) {
      params.startDate = dateRange.value[0];
      params.endDate = dateRange.value[1];
    }
    const res: any = await getHazardList(params);
    if (res.code === 200) {
      hazardList.value = res.data;
      total.value = res.total;
    }
  } catch (error) {
    console.error('加载隐患列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 加载统计数据
const loadStats = async () => {
  try {
    const res: any = await getHazardStats();
    if (res.code === 200) {
      Object.assign(stats, res.data);
    }
  } catch (error) {
    console.error('加载统计数据失败:', error);
  }
};

// 加载逾期列表
const loadOverdueList = async () => {
  try {
    const res: any = await getOverdueHazards();
    if (res.code === 200) {
      overdueList.value = res.data;
    }
  } catch (error) {
    console.error('加载逾期列表失败:', error);
  }
};

// 查询
const handleQuery = () => {
  queryParams.page = 1;
  loadHazardList();
};

// 重置
const handleReset = () => {
  queryParams.level = '';
  queryParams.status = null;
  queryParams.keyword = '';
  queryParams.startDate = '';
  queryParams.endDate = '';
  dateRange.value = null;
  queryParams.page = 1;
  loadHazardList();
};

// 分页
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  loadHazardList();
};

const handleCurrentChange = (val: number) => {
  queryParams.page = val;
  loadHazardList();
};

// 新增
const handleCreate = () => {
  isEdit.value = false;
  Object.assign(formData, {
    id: null,
    hazard_description: '',
    hazard_level: 'general',
    location: '',
    department: '',
    rectification_deadline: '',
    rectification_responsible: ''
  });
  formVisible.value = true;
};

// 编辑
const handleEdit = async (row: any) => {
  isEdit.value = true;
  try {
    const res: any = await getHazardById(row.id);
    if (res.code === 200) {
      Object.assign(formData, res.data);
      formVisible.value = true;
    }
  } catch (error) {
    console.error('获取隐患详情失败:', error);
  }
};

// 查看
const handleView = async (row: any) => {
  try {
    const res: any = await getHazardById(row.id);
    if (res.code === 200) {
      currentHazard.value = res.data;
      detailVisible.value = true;
    }
  } catch (error) {
    console.error('获取隐患详情失败:', error);
  }
};

// 关闭详情
const handleDetailClose = () => {
  detailVisible.value = false;
  currentHazard.value = null;
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res: any = isEdit.value
          ? await updateHazard(formData.id!, formData)
          : await createHazard(formData);
        if (res.code === 200) {
          ElMessage.success(isEdit.value ? '更新成功' : '新增成功');
          formVisible.value = false;
          loadHazardList();
          loadStats();
        }
      } catch (error) {
        console.error('保存隐患失败:', error);
      }
    }
  });
};

// 关闭表单
const handleFormClose = () => {
  formRef.value?.resetFields();
  formVisible.value = false;
};

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认删除该隐患记录吗？', '提示', {
      type: 'warning'
    });
    const res: any = await deleteHazard(row.id);
    if (res.code === 200) {
      ElMessage.success('删除成功');
      loadHazardList();
      loadStats();
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error);
    }
  }
};

// ============ Phase 3.1: 隐患排查模块增强 - 图片上传功能 ============

// 图片上传相关
const beforeImages = ref<any[]>([]);
const afterImages = ref<any[]>([]);

// 上传前的校验（5MB 限制）
const beforeImageUpload = (file: any) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    ElMessage.error('只能上传图片文件！');
    return false;
  }
  
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    ElMessage.error('上传图片大小不能超过 5MB！');
    return false;
  }
  
  return true;
};

// 处理上传超出限制
const handleExceed = (files: any) => {
  ElMessage.warning(`最多上传 5 个文件，本次选择了 ${files.length} 个文件`);
};

// 整改前图片上传成功
const handleBeforeUploadSuccess = (response: any, file: any) => {
  if (response.code === 200) {
    beforeImages.value.push(...response.data.files);
    ElMessage.success('整改前图片上传成功（已添加水印，GB 30871-2022 合规）');
  } else {
    ElMessage.error(response.msg || '上传失败');
  }
};

// 整改后图片上传成功
const handleAfterUploadSuccess = (response: any, file: any) => {
  if (response.code === 200) {
    afterImages.value.push(...response.data.files);
    ElMessage.success('整改后图片上传成功（已添加水印，GB 30871-2022 合规）');
  } else {
    ElMessage.error(response.msg || '上传失败');
  }
};

// 移除整改前图片
const handleBeforeRemove = (file: any) => {
  const index = beforeImages.value.indexOf(file.response?.data?.files?.[0] || file.url);
  if (index > -1) {
    beforeImages.value.splice(index, 1);
  }
};

// 移除整改后图片
const handleAfterRemove = (file: any) => {
  const index = afterImages.value.indexOf(file.response?.data?.files?.[0] || file.url);
  if (index > -1) {
    afterImages.value.splice(index, 1);
  }
};

// 提交表单时，将图片路径保存到 formData
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate(async (valid: boolean) => {
      if (valid) {
        // 将图片路径保存到 formData
        formData.photos_before = JSON.stringify(beforeImages.value);
        formData.photos_after = JSON.stringify(afterImages.value);
        
        const res: any = isEdit.value
          ? await updateHazard(formData.id!, formData)
          : await createHazard(formData);
          
        if (res.code === 200) {
          ElMessage.success(isEdit.value ? '更新成功' : '新增成功');
          formVisible.value = false;
          loadHazardList();
          loadStats();
        }
      }
    });
  } catch (error) {
    console.error('保存隐患失败:', error);
  }
};

// 下一步操作
const handleNextAction = (row: any) => {
  rectifyType.value = '';
  Object.assign(rectifyData, {
    rectification_measure: '',
    rectification_deadline: row.rectification_deadline || '',
    rectification_responsible: row.rectification_responsible || '',
    rectification_result: '',
    verification_result: 1,
    verifier_comments: '',
    recheck_result: 1,
    recheck_comments: '',
    closure_reason: ''
  });

  switch (row.status) {
    case 1:
      rectifyType.value = 'submit';
      rectifyTitle.value = '提交整改方案';
      break;
    case 2:
      rectifyType.value = 'complete';
      rectifyTitle.value = '完成整改';
      break;
    case 3:
      rectifyType.value = 'accept';
      rectifyTitle.value = '验收隐患';
      break;
    case 4:
      rectifyType.value = 'recheck';
      rectifyTitle.value = '复查隐患';
      break;
    default:
      handleView(row);
      return;
  }
  rectifyVisible.value = true;
};

// 提交整改操作
const handleRectifySubmit = async () => {
  try {
    let res: any;
    const id = currentHazard.value?.id;

    switch (rectifyType.value) {
      case 'submit':
        res = await submitRectification(id, {
          rectification_measure: rectifyData.rectification_measure,
          rectification_deadline: rectifyData.rectification_deadline,
          rectification_responsible: rectifyData.rectification_responsible
        });
        break;
      case 'complete':
        res = await completeRectification(id, {
          rectification_result: rectifyData.rectification_result
        });
        break;
      case 'accept':
        res = await acceptHazard(id, {
          verification_result: rectifyData.verification_result,
          verifier_comments: rectifyData.verifier_comments
        });
        break;
      case 'recheck':
        res = await recheckHazard(id, {
          recheck_result: rectifyData.recheck_result,
          recheck_comments: rectifyData.recheck_comments
        });
        break;
      case 'close':
        res = await closeHazard(id, {
          closure_reason: rectifyData.closure_reason
        });
        break;
    }

    if (res.code === 200) {
      ElMessage.success(res.msg || '操作成功');
      rectifyVisible.value = false;
      loadHazardList();
      loadStats();
    }
  } catch (error) {
    console.error('操作失败:', error);
  }
};

// 关闭隐患
const handleClose = (row: any) => {
  currentHazard.value = row;
  rectifyType.value = 'close';
  rectifyTitle.value = '关闭隐患';
  rectifyData.closure_reason = '';
  rectifyVisible.value = true;
};

onMounted(() => {
  loadHazardList();
  loadStats();
  loadOverdueList();
});
</script>

<style scoped>
.hazard-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 12px;
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

.status-flow {
  max-width: 500px;
}

.stats-cards {
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  margin-right: 16px;
  font-size: 24px;
}

.stat-total .stat-icon {
  background: #fef0f0;
  color: #f56c6c;
}

.stat-pending .stat-icon {
  background: #fdf6ec;
  color: #e6a23c;
}

.stat-overdue .stat-icon {
  background: #fdf4f4;
  color: #f56c6c;
}

.stat-completed .stat-icon {
  background: #f0f9eb;
  color: #67c23a;
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

.hazard-detail {
  padding: 0 10px;
}

.detail-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #409eff;
}

.description-content {
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  line-height: 1.6;
}

:deep(.overdue-row) {
  background-color: #fef0f0 !important;
}

:deep(.major-row) {
  background-color: #fee !important;
}

:deep(.el-step__title) {
  font-size: 12px;
}
</style>
