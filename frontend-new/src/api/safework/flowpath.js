import request from '@/utils/request'

// 查询隐患流程列表
export function listFlowpath(query) {
  return request({
    url: '/safework/flowpath/list',
    method: 'get',
    params: query
  })
}

// 查询隐患流程详细
export function getFlowpath(id) {
  return request({
    url: '/safework/flowpath/' + id,
    method: 'get'
  })
}

// 新增隐患流程
export function addFlowpath(data) {
  return request({
    url: '/safework/flowpath',
    method: 'post',
    data: data
  })
}

// 修改隐患流程
export function updateFlowpath(data) {
  return request({
    url: '/safework/flowpath',
    method: 'put',
    data: data
  })
}

// 删除隐患流程
export function delFlowpath(id) {
  return request({
    url: '/safework/flowpath/' + id,
    method: 'delete'
  })
}
