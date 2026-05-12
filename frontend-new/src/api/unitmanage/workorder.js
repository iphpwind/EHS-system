import request from '@/utils/request'

// 查询维修工单列表
export function listWorkorder(query) {
  return request({
    url: '/unitManage/workorder/list',
    method: 'get',
    params: query
  })
}

export function allWorkorder(query) {
  return request({
    url: '/unitManage/workorder/getall',
    method: 'get',
    params: query
  })
}

// 查询维修工单详细
export function getWorkorder(id) {
  return request({
    url: '/unitManage/workorder/' + id,
    method: 'get'
  })
}

// 新增维修工单
export function addWorkorder(data) {
  return request({
    url: '/unitManage/workorder',
    method: 'post',
    data: data
  })
}

// 修改维修工单
export function updateWorkorder(data) {
  return request({
    url: '/unitManage/workorder',
    method: 'put',
    data: data
  })
}

// 删除维修工单
export function delWorkorder(id) {
  return request({
    url: '/unitManage/workorder/' + id,
    method: 'delete'
  })
}
