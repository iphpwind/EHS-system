import request from '@/utils/request'

// 查询保养工单保养部位关联列表
export function listWorkorderparts(query) {
  return request({
    url: '/unitManage/workorderparts/list',
    method: 'get',
    params: query
  })
}

// 查询保养工单保养部位关联详细
export function getWorkorderparts(id) {
  return request({
    url: '/unitManage/workorderparts/' + id,
    method: 'get'
  })
}

// 新增保养工单保养部位关联
export function addWorkorderparts(data) {
  return request({
    url: '/unitManage/workorderparts',
    method: 'post',
    data: data
  })
}

// 修改保养工单保养部位关联
export function updateWorkorderparts(data) {
  return request({
    url: '/unitManage/workorderparts',
    method: 'put',
    data: data
  })
}

// 删除保养工单保养部位关联
export function delWorkorderparts(id) {
  return request({
    url: '/unitManage/workorderparts/' + id,
    method: 'delete'
  })
}
