import request from '@/utils/request';

// 培训统计分析 API (P2-3)

/**
 * 获取培训统计概览
 */
export function getTrainingStats() {
  return request({
    url: '/api/training-stats/stats',
    method: 'get'
  });
}

/**
 * 获取部门培训统计
 */
export function getDeptTrainingStats(params?: {
  dept_id?: number;
  start_date?: string;
  end_date?: string;
}) {
  return request({
    url: '/api/training-stats/stats/dept',
    method: 'get',
    params
  });
}

/**
 * 获取培训合规率
 */
export function getTrainingCompliance() {
  return request({
    url: '/api/training-stats/stats/compliance',
    method: 'get'
  });
}

/**
 * 获取培训待办任务
 */
export function getTrainingTasks() {
  return request({
    url: '/api/training-stats/stats/tasks',
    method: 'get'
  });
}

/**
 * 获取培训完成率趋势
 */
export function getCompletionTrend(params?: { months?: number }) {
  return request({
    url: '/api/training-stats/stats/trend',
    method: 'get',
    params
  });
}

/**
 * 获取培训类型分布
 */
export function getTrainingTypeDistribution() {
  return request({
    url: '/api/training-stats/stats/types',
    method: 'get'
  });
}

/**
 * 获取培训排行榜
 */
export function getTrainingLeaderboard(params?: {
  type?: 'completion' | 'hours' | 'score';
  limit?: number;
}) {
  return request({
    url: '/api/training-stats/stats/leaderboard',
    method: 'get',
    params
  });
}

// 培训状态常量
export const TRAINING_STATUS = {
  PENDING: 'pending',       // 待完成
  IN_PROGRESS: 'in_progress', // 进行中
  COMPLETED: 'completed',   // 已完成
  EXPIRED: 'expired'        // 已过期
};

export const TRAINING_STATUS_TEXT: Record<string, string> = {
  pending: '待完成',
  in_progress: '进行中',
  completed: '已完成',
  expired: '已过期'
};

export const TRAINING_STATUS_COLOR: Record<string, string> = {
  pending: 'warning',
  in_progress: 'primary',
  completed: 'success',
  expired: 'info'
};

// 课程类型
export const COURSE_TYPE = {
  VIDEO: 'video',
  DOCUMENT: 'document',
  OFFLINE: 'offline'
};

export const COURSE_TYPE_TEXT: Record<string, string> = {
  video: '视频课程',
  document: '文档课程',
  offline: '线下培训'
};

// 证书状态
export const CERT_STATUS = {
  VALID: 'valid',
  EXPIRED: 'expired',
  PENDING: 'pending'
};

export const CERT_STATUS_TEXT: Record<string, string> = {
  valid: '有效',
  expired: '已过期',
  pending: '待领取'
};
