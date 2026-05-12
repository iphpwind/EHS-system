import request from '@/utils/request'

// 查询维修流程列表
export function listFlowpath(query) {
  return request({
    url: '/unitManage/flowpath/list',
    method: 'get',
    params: query
  })
}

// 查询维修流程详细
export function getFlowpath(id) {
  return request({
    url: '/unitManage/flowpath/' + id,
    method: 'get'
  })
}

// 新增维修流程
export function addFlowpath(data) {
  return request({
    url: '/unitManage/flowpath',
    method: 'post',
    data: data
  })
}

// 修改维修流程
export function updateFlowpath(data) {
  return request({
    url: '/unitManage/flowpath',
    method: 'put',
    data: data
  })
}

// 删除维修流程
export function delFlowpath(id) {
  return request({
    url: '/unitManage/flowpath/' + id,
    method: 'delete'
  })
}
