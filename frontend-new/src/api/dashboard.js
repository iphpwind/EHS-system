import request from '@/utils/request'

// 获取驾驶舱KPI总览
export function getKPI() {
  return request({
    url: '/dashboard/kpi',
    method: 'get'
  })
}

// 获取风险趋势（支持 period=week/month/year）
export function getTrend(period) {
  return request({
    url: '/dashboard/trend',
    method: 'get',
    params: { period }
  })
}

// 获取隐患等级分布
export function getLevelDistribution() {
  return request({
    url: '/dashboard/level-distribution',
    method: 'get'
  })
}

// 获取部门隐患排行
export function getDepartmentRanking() {
  return request({
    url: '/dashboard/department-ranking',
    method: 'get'
  })
}

// 获取实时待办任务
export function getPendingTasks() {
  return request({
    url: '/dashboard/pending-tasks',
    method: 'get'
  })
}

// 获取培训完成率统计
export function getTrainingRate() {
  return request({
    url: '/dashboard/training-rate',
    method: 'get'
  })
}

// 获取区域风险分布
export function getAreaRisk() {
  return request({
    url: '/dashboard/area-risk',
    method: 'get'
  })
}
