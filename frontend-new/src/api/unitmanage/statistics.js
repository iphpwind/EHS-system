import request from '@/utils/request'

// 查询单元巡检统计列表
export function listStatistics(query) {
  return request({
    url: '/unitManage/statistics/list',
    method: 'get',
    params: query
  })
}

// 查询单元巡检统计巡检点列表
export function listStatisticsSite(query) {
  return request({
    url: '/unitManage/statistics/siteList',
    method: 'get',
    params: query
  })
}

// 查询巡检漏检数据
export function listMissTask(query) {
  return request({
    url: '/unitManage/statistics/missTask',
    method: 'get',
    params: query
  })
}

// 查询巡检异常数据
export function listFaultTask(query) {
  return request({
    url: '/unitManage/statistics/faultTask',
    method: 'get',
    params: query
  })
}

// 查询巡检工作量统计
export function listStatisticsUser(query) {
  return request({
    url: '/unitManage/statistics/statisticsUser',
    method: 'get',
    params: query
  })
}