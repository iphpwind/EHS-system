import request from '@/utils/request'

// 查询线下培训计划列表
export function listPlan(query) {
  return request({
    url: '/safework/plan/list',
    method: 'get',
    params: query
  })
}

// 查询线下培训计划详细
export function getPlan(id) {
  return request({
    url: '/safework/plan/' + id,
    method: 'get'
  })
}

// 新增线下培训计划
export function addPlan(data) {
  return request({
    url: '/safework/plan',
    method: 'post',
    data: data
  })
}

// 修改线下培训计划
export function updatePlan(data) {
  return request({
    url: '/safework/plan',
    method: 'put',
    data: data
  })
}

// 删除线下培训计划
export function delPlan(id) {
  return request({
    url: '/safework/plan/' + id,
    method: 'delete'
  })
}
