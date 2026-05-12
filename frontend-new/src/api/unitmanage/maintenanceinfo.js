import request from '@/utils/request'

// 查询保养计划列表
export function listMaintenanceinfo(query) {
  return request({
    url: '/unitManage/maintenanceinfo/list',
    method: 'get',
    params: query
  })
}

// 查询保养计划详细
export function getMaintenanceinfo(maintenanceId) {
  return request({
    url: '/unitManage/maintenanceinfo/' + maintenanceId,
    method: 'get'
  })
}

// 新增保养计划
export function addMaintenanceinfo(data) {
  return request({
    url: '/unitManage/maintenanceinfo',
    method: 'post',
    data: data
  })
}

// 修改保养计划
export function updateMaintenanceinfo(data) {
  return request({
    url: '/unitManage/maintenanceinfo',
    method: 'put',
    data: data
  })
}

// 修改保养计划和工单状态
export function editSta(maintenanceId) {
  return request({
    url: '/unitManage/maintenanceinfo/'+ maintenanceId,
    method: 'put'
  })
}


// 删除保养计划
export function delMaintenanceinfo(maintenanceId) {
  return request({
    url: '/unitManage/maintenanceinfo/' + maintenanceId,
    method: 'delete'
  })
}
