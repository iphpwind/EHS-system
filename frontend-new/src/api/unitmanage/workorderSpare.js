import request from '@/utils/request'

// 查询保养工单使用备件关联列表
export function listWorkorderSpare(query) {
  return request({
    url: '/unitManage/workorderSpare/list',
    method: 'get',
    params: query
  })
}

// 查询保养工单使用备件关联详细
export function getWorkorderSpare(id) {
  return request({
    url: '/unitManage/workorderSpare/' + id,
    method: 'get'
  })
}

// 新增保养工单使用备件关联
export function addWorkorderSpare(data) {
  return request({
    url: '/unitManage/workorderSpare',
    method: 'post',
    data: data
  })
}

// 修改保养工单使用备件关联
export function updateWorkorderSpare(data) {
  return request({
    url: '/unitManage/workorderSpare',
    method: 'put',
    data: data
  })
}

// 删除保养工单使用备件关联
export function delWorkorderSpare(id) {
  return request({
    url: '/unitManage/workorderSpare/' + id,
    method: 'delete'
  })
}
