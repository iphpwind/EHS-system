import request from '@/utils/request';

// 风险分级管控可视化 API (P2-2)
// 基于 LEC 法（L-发生可能性, E-暴露频率, C-后果严重性）
// 风险值 D = L × E × C
// D ≥ 400: 重大风险（红）
// 200 ≤ D < 400: 较大风险（橙）
// 70 ≤ D < 200: 一般风险（黄）
// D < 70: 低风险（蓝）

/**
 * 获取风险点列表
 */
export function getRiskPoints(params: {
  page?: number;
  pageSize?: number;
  level?: number;
  keyword?: string;
  department_id?: number;
  type?: string;
}) {
  return request({
    url: '/api/risk-v2',
    method: 'get',
    params
  });
}

/**
 * 获取风险点详情
 */
export function getRiskPointById(id: number) {
  return request({
    url: `/api/risk-v2/${id}`,
    method: 'get'
  });
}

/**
 * 创建风险点
 */
export function createRiskPoint(data: {
  code: string;
  name: string;
  location?: string;
  department_id?: number;
  type?: string;
  activity?: string;
  hazard_desc?: string;
  possible_accident?: string;
  l_value?: number;
  e_value?: number;
  c_value?: number;
  risk_level?: number;
  d_value?: number;
  control_measures?: string;
  responsible_person?: number;
  emergency_measures?: string;
}) {
  return request({
    url: '/api/risk-v2',
    method: 'post',
    data
  });
}

/**
 * 更新风险点
 */
export function updateRiskPoint(id: number, data: any) {
  return request({
    url: `/api/risk-v2/${id}`,
    method: 'put',
    data
  });
}

/**
 * 删除风险点
 */
export function deleteRiskPoint(id: number) {
  return request({
    url: `/api/risk-v2/${id}`,
    method: 'delete'
  });
}

/**
 * 获取风险统计概览
 */
export function getRiskStats() {
  return request({
    url: '/api/risk-v2/stats/overview',
    method: 'get'
  });
}

/**
 * 获取风险分布
 */
export function getRiskDistribution(params?: { group_by?: 'department' | 'type' | 'location' }) {
  return request({
    url: '/api/risk-v2/stats/distribution',
    method: 'get',
    params
  });
}

/**
 * 获取风险矩阵（LEC法可视化）
 */
export function getRiskMatrix() {
  return request({
    url: '/api/risk-v2/stats/matrix',
    method: 'get'
  });
}

/**
 * 获取重大风险清单
 */
export function getMajorRisks() {
  return request({
    url: '/api/risk-v2/stats/major',
    method: 'get'
  });
}

// 风险等级常量
export const RISK_LEVEL = {
  MAJOR: 1,     // 重大风险
  SERIOUS: 2,   // 较大风险
  GENERAL: 3,   // 一般风险
  LOW: 4        // 低风险
};

export const RISK_LEVEL_TEXT: Record<number, string> = {
  1: '重大风险',
  2: '较大风险',
  3: '一般风险',
  4: '低风险'
};

export const RISK_LEVEL_COLOR: Record<number, string> = {
  1: '#ef4444',  // 红
  2: '#f97316',  // 橙
  3: '#eab308',  // 黄
  4: '#3b82f6'   // 蓝
};

// LEC 参数选项
export const LEC_OPTIONS = {
  L: [ // 发生可能性
    { value: 1, label: '1 - 完全不可能' },
    { value: 2, label: '2 - 相当不可能' },
    { value: 3, label: '3 - 可能性小' },
    { value: 4, label: '4 - 可能但不普通' },
    { value: 5, label: '5 - 非常可能' },
    { value: 6, label: '6 - 能预料会发生' },
    { value: 7, label: '7 - 非常可能发生' },
    { value: 10, label: '10 - 肯定会发生' }
  ],
  E: [ // 暴露频率
    { value: 0.5, label: '0.5 - 极罕见' },
    { value: 1, label: '1 - 罕见' },
    { value: 2, label: '2 - 偶尔' },
    { value: 3, label: '3 - 经常' },
    { value: 4, label: '4 - 非常频繁' },
    { value: 5, label: '5 - 持续暴露' },
    { value: 6, label: '6 - 每天暴露' },
    { value: 10, label: '10 - 持续暴露' }
  ],
  C: [ // 后果严重性
    { value: 1, label: '1 - 无关紧要' },
    { value: 2, label: '2 - 轻微' },
    { value: 3, label: '3 - 显著' },
    { value: 4, label: '4 - 严重' },
    { value: 5, label: '5 - 非常严重' },
    { value: 6, label: '6 - 可怕' },
    { value: 7, label: '7 - 灾难性' },
    { value: 15, label: '15 - 多人死亡' },
    { value: 40, label: '40 - 重大灾难' },
    { value: 100, label: '100 - 大灾难' }
  ]
};

// 计算风险值 D = L × E × C
export function calculateRiskD(L: number, E: number, C: number): number {
  return L * E * C;
}

// 根据 D 值获取风险等级
export function getRiskLevelFromD(D: number): { level: number; label: string; color: string } {
  if (D >= 400) {
    return { level: 1, label: '重大风险', color: '#ef4444' };
  } else if (D >= 200) {
    return { level: 2, label: '较大风险', color: '#f97316' };
  } else if (D >= 70) {
    return { level: 3, label: '一般风险', color: '#eab308' };
  } else {
    return { level: 4, label: '低风险', color: '#3b82f6' };
  }
}

// 风险类型选项
export const RISK_TYPE_OPTIONS = [
  { value: '物的不安全状态', label: '物的不安全状态' },
  { value: '人的不安全行为', label: '人的不安全行为' },
  { value: '环境因素', label: '环境因素' },
  { value: '管理缺陷', label: '管理缺陷' }
];
