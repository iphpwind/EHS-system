import request from '@/utils/request';

// 隐患闭环管理 API (P2-1)
// 基于状态机: 待整改(1) -> 整改中(2) -> 待验收(3) -> 已完成(4) / 已关闭(5)

/**
 * 获取隐患列表
 */
export function getHazardList(params: {
  page?: number;
  pageSize?: number;
  level?: string;
  status?: number;
  department?: string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  isOverdue?: number;
}) {
  return request({
    url: '/api/hazards-v2',
    method: 'get',
    params
  });
}

/**
 * 获取隐患详情
 */
export function getHazardById(id: number) {
  return request({
    url: `/api/hazards-v2/${id}`,
    method: 'get'
  });
}

/**
 * 新增隐患
 */
export function createHazard(data: {
  hazard_description: string;
  hazard_level?: string;
  location?: string;
  department?: string;
  rectification_deadline?: string;
  rectification_responsible?: string;
  photos_before?: string[];
}) {
  return request({
    url: '/api/hazards-v2',
    method: 'post',
    data
  });
}

/**
 * 更新隐患
 */
export function updateHazard(id: number, data: any) {
  return request({
    url: `/api/hazards-v2/${id}`,
    method: 'put',
    data
  });
}

/**
 * 删除隐患
 */
export function deleteHazard(id: number) {
  return request({
    url: `/api/hazards-v2/${id}`,
    method: 'delete'
  });
}

/**
 * 提交整改（状态 1→2）
 */
export function submitRectification(id: number, data: {
  rectification_measure?: string;
  rectification_deadline?: string;
  rectification_responsible?: string;
}) {
  return request({
    url: `/api/hazards-v2/${id}/submit-rectification`,
    method: 'post',
    data
  });
}

/**
 * 完成整改（状态 2→3）
 */
export function completeRectification(id: number, data: {
  rectification_result?: string;
  photos_after?: string[];
}) {
  return request({
    url: `/api/hazards-v2/${id}/complete-rectification`,
    method: 'post',
    data
  });
}

/**
 * 验收隐患（状态 3→4 或 3→2）
 */
export function acceptHazard(id: number, data: {
  verification_result: 1 | 2;
  verifier_comments?: string;
}) {
  return request({
    url: `/api/hazards-v2/${id}/accept`,
    method: 'post',
    data
  });
}

/**
 * 复查隐患（状态 4→2）
 */
export function recheckHazard(id: number, data: {
  recheck_result: 1 | 2;
  recheck_comments?: string;
}) {
  return request({
    url: `/api/hazards-v2/${id}/recheck`,
    method: 'post',
    data
  });
}

/**
 * 关闭隐患（状态 1→5）
 */
export function closeHazard(id: number, data: {
  closure_reason?: string;
}) {
  return request({
    url: `/api/hazards-v2/${id}/close`,
    method: 'post',
    data
  });
}

/**
 * 获取隐患统计概览
 */
export function getHazardStats() {
  return request({
    url: '/api/hazards-v2/stats/overview',
    method: 'get'
  });
}

/**
 * 获取逾期隐患列表
 */
export function getOverdueHazards() {
  return request({
    url: '/api/hazards-v2/stats/overdue',
    method: 'get'
  });
}

// 状态机常量
export const HAZARD_STATUS = {
  PENDING: 1,        // 待整改
  RECTIFYING: 2,     // 整改中
  PENDING_VERIFY: 3, // 待验收
  COMPLETED: 4,       // 已完成
  CLOSED: 5          // 已关闭
};

export const HAZARD_STATUS_TEXT: Record<number, string> = {
  1: '待整改',
  2: '整改中',
  3: '待验收',
  4: '已完成',
  5: '已关闭'
};

export const HAZARD_STATUS_COLOR: Record<number, string> = {
  1: 'danger',     // 红 - 待整改
  2: 'warning',    // 橙 - 整改中
  3: 'info',       // 蓝 - 待验收
  4: 'success',   // 绿 - 已完成
  5: 'info'       // 灰 - 已关闭
};

export const HAZARD_LEVEL_OPTIONS = [
  { value: 'major', label: '重大隐患', color: '#ef4444' },
  { value: 'serious', label: '较大隐患', color: '#f97316' },
  { value: 'general', label: '一般隐患', color: '#eab308' },
  { value: 'low', label: '低微隐患', color: '#3b82f6' }
];
