import request from './request'

/** 获取KPI指标 */
export function getKPI() {
  return request.get('/dashboard/kpi')
}

/** 获取隐患趋势 */
export function getTrend(params) {
  return request.get('/dashboard/trend', { params })
}

/** 获取待办事项 */
export function getPendingTasks() {
  return request.get('/dashboard/pending-tasks')
}

/** 获取培训完成率 */
export function getTrainingRate() {
  return request.get('/dashboard/training-rate')
}

/** 获取区域风险分布 */
export function getAreaRisk() {
  return request.get('/dashboard/area-risk')
}
