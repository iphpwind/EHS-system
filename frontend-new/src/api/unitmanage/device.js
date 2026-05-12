import request from '@/utils/request'

// 查询单元设备列表
export function listDevice(query) {
  return request({
    url: '/unitManage/device/list',
    method: 'get',
    params: query
  })
}
// 查询设备列表
export function listEq(query) {
  return request({
    url: '/unitManage/device/eqlist',
    method: 'get',
    params: query
  })
}
// 查询设备相关信息列表
export function listAllInfo(query) {
  return request({
    url: '/unitManage/device/listAllInfo',
    method: 'get',
    params: query
  })
}

// 查询单元设备详细
export function getDevice(deviceId) {
  return request({
    url: '/unitManage/device/' + deviceId,
    method: 'get'
  })
}

// 新增单元设备
export function addDevice(data) {
  return request({
    url: '/unitManage/device',
    method: 'post',
    data: data
  })
}

// 修改单元设备
export function updateDevice(data) {
  return request({
    url: '/unitManage/device',
    method: 'put',
    data: data
  })
}

// 删除单元设备
export function delDevice(deviceId) {
  return request({
    url: '/unitManage/device/' + deviceId,
    method: 'delete'
  })
}
