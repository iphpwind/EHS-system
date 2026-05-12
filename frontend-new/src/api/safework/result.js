import request from '@/utils/request'

// 查询线下培训结果列表
export function listResult(query) {
  return request({
    url: '/safework/result/list',
    method: 'get',
    params: query
  })
}

// 查询线下培训结果详细
export function getResult(id) {
  return request({
    url: '/safework/result/' + id,
    method: 'get'
  })
}

// 新增线下培训结果
export function addResult(data) {
  return request({
    url: '/safework/result',
    method: 'post',
    data: data
  })
}

// 修改线下培训结果
export function updateResult(data) {
  return request({
    url: '/safework/result',
    method: 'put',
    data: data
  })
}

// 删除线下培训结果
export function delResult(id) {
  return request({
    url: '/safework/result/' + id,
    method: 'delete'
  })
}
// 本年度按月完成情况
export function getPlanCountByStatusAndMonth(query) {
  return request({
    url: '/safework/result/getPlanCountByStatusAndMonth',
    method: 'get',
    params: query
  })
}
// 计划完成情况
export function getPlanCountByStatus(query) {
  return request({
    url: '/safework/result/getPlanCountByStatus',
    method: 'get',
    params: query
  })
}