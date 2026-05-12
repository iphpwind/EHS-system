import request from '@/utils/request'

// 查询保养工单列表
export function listWorkorder(query) {
  return request({
    url: '/unitManage/workorders/list',
    method: 'get',
    params: query
  })
}

// 查询保养工单超期列表
export function exceedlist(query) {
  return request({
    url: '/unitManage/workorders/exceedlist',
    method: 'get',
    params: query
  })
}

// 查询保养工单详细
export function getWorkorder(maintenanceWorkorderId) {
  return request({
    url: '/unitManage/workorders/' + maintenanceWorkorderId,
    method: 'get'
  })
}


// 查询保养工单的汇总数据
export function getCountWorkorder() {
  return request({
    url: '/unitManage/workorders/getCountWorkorder',
    method: 'get'
  })
}

// 新增保养工单
export function addWorkorder(data) {
  return request({
    url: '/unitManage/workorders',
    method: 'post',
    data: data
  })
}

// 修改保养工单
export function updateWorkorder(data) {
  return request({
    url: '/unitManage/workorders',
    method: 'put',
    data: data
  })
}

// 修改保养工单
export function editStaWorkorder(maintenanceId) {
  return request({
    url: '/unitManage/workorders/'+ maintenanceId,
    method: 'put'
  })
}
// 删除保养工单
export function delWorkorder(maintenanceWorkorderId) {
  return request({
    url: '/unitManage/workorders/' + maintenanceWorkorderId,
    method: 'delete'
  })
}
