import request from '@/utils/request'

// 查询施工计划列表
export function listOperationPlan(query) {
  return request({
    url: '/safework/operationPlan/list',
    method: 'get',
    params: query
  })
}

// 查询施工计划详细
export function getOperationPlan(id) {
  return request({
    url: '/safework/operationPlan/' + id,
    method: 'get'
  })
}

// 新增施工计划
export function addOperationPlan(data) {
  return request({
    url: '/safework/operationPlan',
    method: 'post',
    data: data
  })
}

// 修改施工计划
export function updateOperationPlan(data) {
  return request({
    url: '/safework/operationPlan',
    method: 'put',
    data: data
  })
}

// 删除施工计划
export function delOperationPlan(id) {
  return request({
    url: '/safework/operationPlan/' + id,
    method: 'delete'
  })
}
