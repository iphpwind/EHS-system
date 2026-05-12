import request from '@/utils/request'

// 查询保养部位字典列表
export function listMaintenanceparts(query) {
  return request({
    url: '/unitManage/maintenanceparts/list',
    method: 'get',
    params: query
  })
}

// 查询保养部位字典详细
export function getMaintenanceparts(maintenancePartsId) {
  return request({
    url: '/unitManage/maintenanceparts/' + maintenancePartsId,
    method: 'get'
  })
}

// 新增保养部位字典
export function addMaintenanceparts(data) {
  return request({
    url: '/unitManage/maintenanceparts',
    method: 'post',
    data: data
  })
}

// 修改保养部位字典
export function updateMaintenanceparts(data) {
  return request({
    url: '/unitManage/maintenanceparts',
    method: 'put',
    data: data
  })
}

// 删除保养部位字典
export function delMaintenanceparts(maintenancePartsId) {
  return request({
    url: '/unitManage/maintenanceparts/' + maintenancePartsId,
    method: 'delete'
  })
}
