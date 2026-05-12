import request from '@/utils/request'

// 查询单元巡检点设备列表
export function listInspectionDevice(query) {
  return request({
    url: '/unitManage/inspectionDevice/list',
    method: 'get',
    params: query
  })
}

// 查询单元巡检点设备详细
export function getInspectionDevice(id) {
  return request({
    url: '/unitManage/inspectionDevice/' + id,
    method: 'get'
  })
}

// 新增单元巡检点设备
export function addInspectionDevice(data) {
  return request({
    url: '/unitManage/inspectionDevice',
    method: 'post',
    data: data
  })
}

// 修改单元巡检点设备
export function updateInspectionDevice(data) {
  return request({
    url: '/unitManage/inspectionDevice',
    method: 'put',
    data: data
  })
}

// 删除单元巡检点设备
export function delInspectionDevice(id) {
  return request({
    url: '/unitManage/inspectionDevice/' + id,
    method: 'delete'
  })
}

// 新增多条单元巡检点设备
export function addInspectionDevices(data) {
  return request({
    url: '/unitManage/inspectionDevice/addInspectionDevices',
    method: 'post',
    data: data
  })
}

