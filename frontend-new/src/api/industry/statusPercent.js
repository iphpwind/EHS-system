import request from '@/utils/request'

// 查询运行状态占比列表
export function listStatusPercent(query) {
  return request({
    url: '/industry/statusPercent/list',
    method: 'get',
    params: query
  })
}

// 查询近7天运行状态占比列表
export function getStatusPercentList(query) {
  return request({
    url: '/industry/statusPercent/getStatusPercentList',
    method: 'get',
    params: query
  })
}

// 查询细部稼动率列表
export function getDetailPercentList(query) {
  return request({
    url: '/industry/statusPercent/getDetailPercentList',
    method: 'get',
    params: query
  })
}

// 查询细部稼动率列表根据设备id和时间
export function getDetailPercentListByeqid(query) {
  return request({
    url: '/industry/statusPercent/getDetailPercentListByeqid',
    method: 'get',
    params: query
  })
}

// 查询设备各状态数据列表
export function listEqstatusPersent(query) {
  return request({
    url: '/industry/statusPercent/listEqstatusPersent',
    method: 'get',
    params: query
  })
}

// 查询运行状态占比详细
export function getStatusPercent(id) {
  return request({
    url: '/industry/statusPercent/' + id,
    method: 'get'
  })
}

// 查询各个阶段运行状态占比
export function getAllStatusPercent(query) {
  return request({
    url: '/industry/statusPercent/getAllStatusPercent',
    method: 'get',
    params: query
  })
}

// 新增运行状态占比
export function addStatusPercent(data) {
  return request({
    url: '/industry/statusPercent',
    method: 'post',
    data: data
  })
}

// 修改运行状态占比
export function updateStatusPercent(data) {
  return request({
    url: '/industry/statusPercent',
    method: 'put',
    data: data
  })
}

// 删除运行状态占比
export function delStatusPercent(id) {
  return request({
    url: '/industry/statusPercent/' + id,
    method: 'delete'
  })
}
