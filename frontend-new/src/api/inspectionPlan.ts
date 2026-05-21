import request from '@/utils/request';

// 获取排查计划列表
export function getInspectionPlans(params: any) {
  return request({
    url: '/api/inspection/plans',
    method: 'get',
    params
  });
}

// 获取排查计划详情
export function getInspectionPlanDetail(id: number) {
  return request({
    url: `/api/inspection/plans/${id}`,
    method: 'get'
  });
}

// 创建排查计划
export function createInspectionPlan(data: any) {
  return request({
    url: '/api/inspection/plans',
    method: 'post',
    data
  });
}

// 更新排查计划
export function updateInspectionPlan(id: number, data: any) {
  return request({
    url: `/api/inspection/plans/${id}`,
    method: 'put',
    data
  });
}

// 删除排查计划
export function deleteInspectionPlan(id: number) {
  return request({
    url: `/api/inspection/plans/${id}`,
    method: 'delete'
  });
}

// 获取排查记录列表
export function getInspectionRecords(params: any) {
  return request({
    url: '/api/inspection/records',
    method: 'get',
    params
  });
}

// 创建排查记录
export function createInspectionRecord(data: any) {
  return request({
    url: '/api/inspection/records',
    method: 'post',
    data
  });
}

// 更新排查记录
export function updateInspectionRecord(id: number, data: any) {
  return request({
    url: `/api/inspection/records/${id}`,
    method: 'put',
    data
  });
}

// 删除排查记录
export function deleteInspectionRecord(id: number) {
  return request({
    url: `/api/inspection/records/${id}`,
    method: 'delete'
  });
}

// 获取今日待排查任务
export function getTodayInspections() {
  return request({
    url: '/api/inspection/today',
    method: 'get'
  });
}