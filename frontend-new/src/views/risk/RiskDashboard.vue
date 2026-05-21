<template>
  <div class="risk-dashboard">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">
        <el-icon><DataAnalysis /></el-icon>
        风险分级管控可视化
      </h2>
      <div class="header-actions">
        <el-button type="primary" @click="showAddDialog = true">
          <el-icon><Plus /></el-icon>
          添加风险点
        </el-button>
        <el-button @click="loadData">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 统计概览 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <div class="stat-card stat-total">
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">风险点总数</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-major">
          <div class="stat-value">{{ stats.major }}</div>
          <div class="stat-label">重大风险</div>
          <div class="stat-icon">🔥</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-serious">
          <div class="stat-value">{{ stats.serious }}</div>
          <div class="stat-label">较大风险</div>
          <div class="stat-icon">⚠️</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card stat-low">
          <div class="stat-value">{{ stats.general + stats.low }}</div>
          <div class="stat-label">一般/低风险</div>
          <div class="stat-icon">📉</div>
        </div>
      </el-col>
    </el-row>

    <!-- 可视化区域 -->
    <el-row :gutter="20" class="charts-row">
      <!-- 风险等级分布饼图 -->
      <el-col :span="8">
        <div class="chart-card">
          <div class="card-title">风险等级分布</div>
          <div ref="pieChartRef" class="chart-container"></div>
        </div>
      </el-col>
      <!-- 风险矩阵热力图 -->
      <el-col :span="8">
        <div class="chart-card">
          <div class="card-title">LEC风险矩阵 (D = L × E × C)</div>
          <div ref="matrixChartRef" class="chart-container"></div>
        </div>
      </el-col>
      <!-- 部门风险分布 -->
      <el-col :span="8">
        <div class="chart-card">
          <div class="card-title">部门风险分布</div>
          <div ref="deptChartRef" class="chart-container"></div>
        </div>
      </el-col>
    </el-row>

    <!-- 风险趋势和重大风险清单 -->
    <el-row :gutter="20" class="charts-row">
      <!-- 风险趋势 -->
      <el-col :span="12">
        <div class="chart-card">
          <div class="card-title">近6个月风险趋势</div>
          <div ref="trendChartRef" class="chart-container"></div>
        </div>
      </el-col>
      <!-- 重大风险清单 -->
      <el-col :span="12">
        <div class="chart-card">
          <div class="card-title">重大风险管控清单</div>
          <div class="major-risk-list">
            <el-table :data="majorRisks" border stripe max-height="300" size="small">
              <el-table-column prop="code" label="编号" width="100" />
              <el-table-column prop="name" label="风险点" min-width="150" show-overflow-tooltip />
              <el-table-column label="风险值D" width="80" align="center">
                <template #default="{ row }">
                  <span :style="{ color: RISK_LEVEL_COLOR[row.risk_level] }">
                    {{ row.d_value }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="dept_name" label="责任部门" width="100" />
              <el-table-column label="操作" width="80" align="center">
                <template #default="{ row }">
                  <el-button type="primary" link size="small" @click="viewRiskDetail(row)">
                    详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 风险点列表 -->
    <div class="list-section">
      <div class="section-header">
        <span class="section-title">风险点列表</span>
        <el-form :inline="true" :model="queryParams">
          <el-form-item label="风险等级">
            <el-select v-model="queryParams.level" placeholder="全部" clearable style="width: 120px">
              <el-option
                v-for="(label, key) in RISK_LEVEL_TEXT"
                :key="key"
                :label="label"
                :value="Number(key)"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="关键词">
            <el-input v-model="queryParams.keyword" placeholder="名称/编号/位置" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="riskList" border stripe v-loading="loading">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="code" label="编号" width="120" />
        <el-table-column prop="name" label="风险点名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="location" label="位置" width="150" show-overflow-tooltip />
        <el-table-column prop="dept_name" label="责任部门" width="120" />
        <el-table-column label="LEC评估" width="200">
          <template #default="{ row }">
            <span class="lec-values">
              L={{ row.l_value }} × E={{ row.e_value }} × C={{ row.c_value }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="风险值D" width="100" align="center">
          <template #default="{ row }">
            <span :style="{ color: RISK_LEVEL_COLOR[row.risk_level], fontWeight: 'bold' }">
              {{ row.d_value }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="风险等级" width="100" align="center">
          <template #default="{ row }">
            <el-tag :color="RISK_LEVEL_COLOR[row.risk_level]" style="color: #fff; border: none;">
              {{ RISK_LEVEL_TEXT[row.risk_level] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="管控措施" width="150">
          <template #default="{ row }">
            <el-button
              v-if="row.control_measures"
              type="primary"
              link
              size="small"
              @click="showControlMeasures(row)"
            >
              查看措施
            </el-button>
            <span v-else style="color: #c0c4cc;">暂无</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="viewRiskDetail(row)">查看</el-button>
            <el-button type="warning" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 新增/编辑风险点对话框 -->
    <el-dialog
      v-model="showAddDialog"
      :title="isEdit ? '编辑风险点' : '新增风险点'"
      width="700px"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="风险点编号" prop="code">
          <el-input v-model="formData.code" placeholder="如：RP-001" />
        </el-form-item>
        <el-form-item label="风险点名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入风险点名称" />
        </el-form-item>
        <el-form-item label="所在位置" prop="location">
          <el-input v-model="formData.location" placeholder="请输入位置" />
        </el-form-item>
        <el-form-item label="责任部门">
          <el-select v-model="formData.department_id" placeholder="请选择" clearable style="width: 100%">
            <el-option
              v-for="dept in departments"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="风险类型">
          <el-select v-model="formData.type" placeholder="请选择" clearable style="width: 100%">
            <el-option
              v-for="item in RISK_TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-divider content-position="left">LEC评估</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="L值(可能性)">
              <el-select v-model="formData.l_value" style="width: 100%">
                <el-option
                  v-for="item in LEC_OPTIONS.L"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="E值(暴露)">
              <el-select v-model="formData.e_value" style="width: 100%">
                <el-option
                  v-for="item in LEC_OPTIONS.E"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="C值(后果)">
              <el-select v-model="formData.c_value" style="width: 100%">
                <el-option
                  v-for="item in LEC_OPTIONS.C"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="风险值D">
          <el-input :value="calculatedD" disabled>
            <template #append>
              <span :style="{ color: calculatedRiskColor }">{{ calculatedRiskLabel }}</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="危险描述">
          <el-input v-model="formData.hazard_desc" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="可能事故">
          <el-input v-model="formData.possible_accident" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="管控措施">
          <el-input v-model="formData.control_measures" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="应急措施">
          <el-input v-model="formData.emergency_measures" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 风险详情抽屉 -->
    <el-drawer v-model="showDetail" title="风险点详情" size="600px">
      <div v-if="currentRisk" class="risk-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="编号">{{ currentRisk.code }}</el-descriptions-item>
          <el-descriptions-item label="名称">{{ currentRisk.name }}</el-descriptions-item>
          <el-descriptions-item label="位置">{{ currentRisk.location }}</el-descriptions-item>
          <el-descriptions-item label="责任部门">{{ currentRisk.dept_name }}</el-descriptions-item>
          <el-descriptions-item label="风险类型">{{ currentRisk.type }}</el-descriptions-item>
          <el-descriptions-item label="LEC评估">
            L={{ currentRisk.l_value }} × E={{ currentRisk.e_value }} × C={{ currentRisk.c_value }}
          </el-descriptions-item>
          <el-descriptions-item label="风险值D" :span="2">
            <span :style="{ color: RISK_LEVEL_COLOR[currentRisk.risk_level], fontWeight: 'bold', fontSize: '18px' }">
              {{ currentRisk.d_value }}
            </span>
          </el-descriptions-item>
        </el-descriptions>

        <div class="detail-section">
          <h4>危险描述</h4>
          <div class="content-box">{{ currentRisk.hazard_desc || '暂无' }}</div>
        </div>

        <div class="detail-section">
          <h4>可能事故</h4>
          <div class="content-box">{{ currentRisk.possible_accident || '暂无' }}</div>
        </div>

        <div class="detail-section">
          <h4>管控措施</h4>
          <div class="content-box control-box">{{ currentRisk.control_measures || '暂无' }}</div>
        </div>

        <div class="detail-section">
          <h4>应急措施</h4>
          <div class="content-box">{{ currentRisk.emergency_measures || '暂无' }}</div>
        </div>
      </div>
    </el-drawer>

    <!-- 管控措施查看 -->
    <el-dialog v-model="showMeasures" title="管控措施" width="600px">
      <div class="measures-content">{{ currentMeasures || '暂无管控措施' }}</div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { DataAnalysis, Plus, Refresh } from '@element-plus/icons-vue';
import * as echarts from 'echarts';
import {
  getRiskPoints,
  getRiskPointById,
  createRiskPoint,
  updateRiskPoint,
  deleteRiskPoint,
  getRiskStats,
  getRiskMatrix,
  getMajorRisks,
  getRiskDistribution,
  RISK_LEVEL_TEXT,
  RISK_LEVEL_COLOR,
  RISK_TYPE_OPTIONS,
  LEC_OPTIONS,
  calculateRiskD,
  getRiskLevelFromD
} from '@/api/riskV2';

const loading = ref(false);
const pieChartRef = ref<HTMLDivElement>();
const matrixChartRef = ref<HTMLDivElement>();
const deptChartRef = ref<HTMLDivElement>();
const trendChartRef = ref<HTMLDivElement>();

let pieChart: echarts.ECharts | null = null;
let matrixChart: echarts.ECharts | null = null;
let deptChart: echarts.ECharts | null = null;
let trendChart: echarts.ECharts | null = null;

const stats = reactive({
  total: 0,
  major: 0,
  serious: 0,
  general: 0,
  low: 0
});

const levelStats = ref<any[]>([]);
const matrixData = ref<any[]>([]);
const majorRisks = ref<any[]>([]);
const deptStats = ref<any[]>([]);
const trendData = ref<any[]>([]);

const queryParams = reactive({
  page: 1,
  pageSize: 20,
  level: null as number | null,
  keyword: ''
});

const total = ref(0);
const riskList = ref<any[]>([]);
const departments = ref<any[]>([]);

// 表单相关
const showAddDialog = ref(false);
const isEdit = ref(false);
const formRef = ref();
const formData = reactive({
  id: null as number | null,
  code: '',
  name: '',
  location: '',
  department_id: null as number | null,
  type: '',
  l_value: 1,
  e_value: 1,
  c_value: 1,
  hazard_desc: '',
  possible_accident: '',
  control_measures: '',
  emergency_measures: ''
});

const formRules = {
  code: [{ required: true, message: '请输入编号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
};

// 详情相关
const showDetail = ref(false);
const currentRisk = ref<any>(null);

// 管控措施
const showMeasures = ref(false);
const currentMeasures = ref('');

// 计算风险值
const calculatedD = computed(() => {
  return calculateRiskD(formData.l_value, formData.e_value, formData.c_value);
});

const calculatedRiskColor = computed(() => {
  return getRiskLevelFromD(calculatedD.value).color;
});

const calculatedRiskLabel = computed(() => {
  return getRiskLevelFromD(calculatedD.value).label;
});

// 加载统计数据
const loadStats = async () => {
  try {
    const res: any = await getRiskStats();
    if (res.code === 200) {
      stats.total = res.data.total.total;
      stats.major = res.data.total.major;
      stats.serious = res.data.total.serious;
      stats.general = res.data.total.general;
      stats.low = res.data.total.low;
      levelStats.value = res.data.levelStats;
      trendData.value = res.data.trendData;

      // 部门分布
      deptStats.value = res.data.deptStats;
    }
  } catch (error) {
    console.error('加载统计数据失败:', error);
  }
};

// 加载风险矩阵
const loadMatrix = async () => {
  try {
    const res: any = await getRiskMatrix();
    if (res.code === 200) {
      matrixData.value = res.data.matrix;
      nextTick(() => renderMatrixChart());
    }
  } catch (error) {
    console.error('加载风险矩阵失败:', error);
  }
};

// 加载重大风险
const loadMajorRisks = async () => {
  try {
    const res: any = await getMajorRisks();
    if (res.code === 200) {
      majorRisks.value = res.data.list;
    }
  } catch (error) {
    console.error('加载重大风险失败:', error);
  }
};

// 加载风险点列表
const loadRiskList = async () => {
  loading.value = true;
  try {
    const res: any = await getRiskPoints(queryParams);
    if (res.code === 200) {
      riskList.value = res.data;
      total.value = res.total;
    }
  } catch (error) {
    console.error('加载风险点列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 加载部门列表
const loadDepartments = async () => {
  // 简化：从本地数据获取
  departments.value = [
    { id: 1, name: '生产部' },
    { id: 2, name: '安全部' },
    { id: 3, name: '设备部' },
    { id: 4, name: '技术部' }
  ];
};

// 渲染饼图
const renderPieChart = () => {
  if (!pieChartRef.value) return;

  if (pieChart) {
    pieChart.dispose();
  }

  pieChart = echarts.init(pieChartRef.value);

  const data = [
    { value: stats.major, name: '重大风险', itemStyle: { color: RISK_LEVEL_COLOR[1] } },
    { value: stats.serious, name: '较大风险', itemStyle: { color: RISK_LEVEL_COLOR[2] } },
    { value: stats.general, name: '一般风险', itemStyle: { color: RISK_LEVEL_COLOR[3] } },
    { value: stats.low, name: '低风险', itemStyle: { color: RISK_LEVEL_COLOR[4] } }
  ];

  pieChart.setOption({
    tooltip: { trigger: 'item' },
    legend: { bottom: '5%', left: 'center' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}: {c} ({d}%)' },
      data
    }]
  });
};

// 渲染矩阵图
const renderMatrixChart = () => {
  if (!matrixChartRef.value) return;

  if (matrixChart) {
    matrixChart.dispose();
  }

  matrixChart = echarts.init(matrixChartRef.value);

  // 生成 L-E 矩阵（固定 C=5）
  const matrix = [];
  const c = 5;
  for (let l = 1; l <= 5; l++) {
    for (let e = 1; e <= 5; e++) {
      const d = l * e * c;
      const risk = getRiskLevelFromD(d);
      matrix.push([e - 1, 5 - l, d, risk.label]);
    }
  }

  matrixChart.setOption({
    tooltip: {
      formatter: (params: any) => {
        return `L=${5 - params.data[1]} × E=${params.data[0] + 1} × C=5 = D=${params.data[2]}<br/>${params.data[3]}`;
      }
    },
    xAxis: {
      type: 'category',
      data: ['E=1', 'E=2', 'E=3', 'E=4', 'E=5'],
      name: '暴露频率',
      nameLocation: 'middle',
      nameGap: 25
    },
    yAxis: {
      type: 'category',
      data: ['L=5', 'L=4', 'L=3', 'L=2', 'L=1'],
      name: '可能性',
      nameLocation: 'middle',
      nameGap: 30
    },
    visualMap: {
      min: 0,
      max: 500,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '0%',
      inRange: {
        color: ['#3b82f6', '#eab308', '#f97316', '#ef4444']
      }
    },
    series: [{
      type: 'heatmap',
      data: matrix,
      label: { show: true, formatter: (p: any) => p.data[2] },
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' }
      }
    }]
  });
};

// 渲染部门图表
const renderDeptChart = () => {
  if (!deptChartRef.value) return;

  if (deptChart) {
    deptChart.dispose();
  }

  deptChart = echarts.init(deptChartRef.value);

  const data = deptStats.value.slice(0, 6).map((d: any) => ({
    value: d.total,
    name: d.department || '未分类',
    major: d.major,
    serious: d.serious
  }));

  deptChart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const d = params.data;
        return `${d.name}<br/>总计: ${d.value}<br/>重大: ${d.major}<br/>较大: ${d.serious}`;
      }
    },
    legend: { bottom: '5%', left: 'center' },
    series: [{
      type: 'pie',
      radius: '60%',
      data,
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' }
      }
    }]
  });
};

// 渲染趋势图
const renderTrendChart = () => {
  if (!trendChartRef.value) return;

  if (trendChart) {
    trendChart.dispose();
  }

  trendChart = echarts.init(trendChartRef.value);

  trendChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['总数', '重大风险', '较大风险'], bottom: '0%' },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: trendData.value.map((d: any) => d.month)
    },
    yAxis: { type: 'value' },
    series: [
      { name: '总数', type: 'line', data: trendData.value.map((d: any) => d.total), smooth: true },
      { name: '重大风险', type: 'line', data: trendData.value.map((d: any) => d.major), lineStyle: { color: '#ef4444' } },
      { name: '较大风险', type: 'line', data: trendData.value.map((d: any) => d.serious), lineStyle: { color: '#f97316' } }
    ]
  });
};

// 查询
const handleQuery = () => {
  queryParams.page = 1;
  loadRiskList();
};

// 重置
const handleReset = () => {
  queryParams.level = null;
  queryParams.keyword = '';
  queryParams.page = 1;
  loadRiskList();
};

// 分页
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  loadRiskList();
};

const handleCurrentChange = (val: number) => {
  queryParams.page = val;
  loadRiskList();
};

// 查看详情
const viewRiskDetail = async (row: any) => {
  try {
    const res: any = await getRiskPointById(row.id);
    if (res.code === 200) {
      currentRisk.value = res.data;
      showDetail.value = true;
    }
  } catch (error) {
    console.error('获取详情失败:', error);
  }
};

// 编辑
const handleEdit = async (row: any) => {
  try {
    const res: any = await getRiskPointById(row.id);
    if (res.code === 200) {
      Object.assign(formData, res.data);
      isEdit.value = true;
      showAddDialog.value = true;
    }
  } catch (error) {
    console.error('获取详情失败:', error);
  }
};

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确认删除该风险点吗？', '提示', { type: 'warning' });
    const res: any = await deleteRiskPoint(row.id);
    if (res.code === 200) {
      ElMessage.success('删除成功');
      loadRiskList();
      loadStats();
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error);
    }
  }
};

// 提交表单
const handleSubmit = async () => {
  try {
    const data = { ...formData };
    if (isEdit.value) {
      await updateRiskPoint(data.id!, data);
      ElMessage.success('更新成功');
    } else {
      await createRiskPoint(data);
      ElMessage.success('创建成功');
    }
    showAddDialog.value = false;
    loadRiskList();
    loadStats();
    loadMajorRisks();
  } catch (error) {
    console.error('保存失败:', error);
  }
};

// 显示管控措施
const showControlMeasures = (row: any) => {
  currentMeasures.value = row.control_measures;
  showMeasures.value = true;
};

// 加载所有数据
const loadData = async () => {
  await Promise.all([
    loadStats(),
    loadMatrix(),
    loadMajorRisks(),
    loadRiskList()
  ]);

  nextTick(() => {
    renderPieChart();
    renderDeptChart();
    renderTrendChart();
  });
};

// 窗口调整
const handleResize = () => {
  pieChart?.resize();
  matrixChart?.resize();
  deptChart?.resize();
  trendChart?.resize();
};

onMounted(() => {
  loadDepartments();
  loadData();
  window.addEventListener('resize', handleResize);
});
</script>

<style scoped>
.risk-dashboard {
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

.header-actions {
  display: flex;
  gap: 10px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.stat-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 40px;
  opacity: 0.2;
}

.stat-major { background: linear-gradient(135deg, #fef0f0, #fee); border-left: 4px solid #ef4444; }
.stat-serious { background: linear-gradient(135deg, #fdf6ec, #fef9f3); border-left: 4px solid #f97316; }
.stat-total { background: linear-gradient(135deg, #f0f9eb, #f7fbf3); border-left: 4px solid #67c23a; }
.stat-low { background: linear-gradient(135deg, #ecf5ff, #f5f9ff); border-left: 4px solid #3b82f6; }

.charts-row {
  margin-bottom: 20px;
}

.chart-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  height: 350px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #409eff;
}

.chart-container {
  height: calc(100% - 40px);
  min-height: 280px;
}

.major-risk-list {
  height: calc(100% - 40px);
}

.list-section {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.lec-values {
  font-family: monospace;
  background: #f5f7fa;
  padding: 2px 6px;
  border-radius: 4px;
}

.risk-detail {
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
}

.control-box {
  white-space: pre-wrap;
}

.measures-content {
  white-space: pre-wrap;
  line-height: 1.8;
}
</style>
