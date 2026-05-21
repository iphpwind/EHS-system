import request from '@/utils/request';

// 电子巡检管理 API

/**
 * 获取巡检计划列表
 */
export function getPatrolPlans(params: {
  page?: number;
  pageSize?: number;
  keyword?: string;
  type?: string;
  status?: string;
}) {
  return request({
    url: '/api/patrol/plans',
    method: 'get',
    params
  });
}

/**
 * 创建巡检计划
 */
export function createPatrolPlan(data: {
  name: string;
  type?: string;
  frequency?: string;
  executor?: string;
  points?: string;
  content?: string;
  status?: string;
}) {
  return request({
    url: '/api/patrol/plans',
    method: 'post',
    data
  });
}

/**
 * 更新巡检计划
 */
export function updatePatrolPlan(id: number, data: any) {
  return request({
    url: `/api/patrol/plans/${id}`,
    method: 'put',
    data
  });
}

/**
 * 删除巡检计划
 */
export function deletePatrolPlan(id: number) {
  return request({
    url: `/api/patrol/plans/${id}`,
    method: 'delete'
  });
}

// 巡检类型
export const PATROL_TYPE = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  SPECIAL: 'special'
};

export const PATROL_TYPE_TEXT: Record<string, string> = {
  daily: '日常巡检',
  weekly: '周巡检',
  monthly: '月巡检',
  special: '专项巡检'
};

// 巡检状态
export const PATROL_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  FINISHED: 'finished'
};

export const PATROL_STATUS_TEXT: Record<string, string> = {
  active: '进行中',
  paused: '已暂停',
  finished: '已结束'
};
