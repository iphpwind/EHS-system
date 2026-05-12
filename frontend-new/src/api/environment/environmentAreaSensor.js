import request from '@/utils/request'

// 查询工业区域-传感器关联列表
export function listEnvironmentAreaSensor(query) {
  return request({
    url: '/environment/environmentAreaSensor/list',
    method: 'get',
    params: query
  })
}
// 实时数据
export function listRealEnvironmentAreaSensor(query) {
  return request({
    url: '/environment/environmentAreaSensor/realList',
    method: 'get',
    params: query
  })
}
// 查询设备列表
export function listEnvironmentSensor(query) {
  return request({
    url: '/environment/environmentAreaSensor/listEnvironmentSensor',
    method: 'get',
    params: query
  })
}

// 查询工业区域-传感器关联详细
export function getEnvironmentAreaSensor(id) {
  return request({
    url: '/environment/environmentAreaSensor/' + id,
    method: 'get'
  })
}

// 新增工业区域-传感器关联
export function addEnvironmentAreaSensor(data) {
  return request({
    url: '/environment/environmentAreaSensor',
    method: 'post',
    data: data
  })
}

// 新增多条电表
export function addEnvironmentAreaSensors(data) {
  return request({
    url: '/environment/environmentAreaSensor/addEnvironmentAreaSensors',
    method: 'post',
    data: data
  })
}

// 修改工业区域-传感器关联
export function updateEnvironmentAreaSensor(data) {
  return request({
    url: '/environment/environmentAreaSensor',
    method: 'put',
    data: data
  })
}

// 删除工业区域-传感器关联
export function delEnvironmentAreaSensor(id) {
  return request({
    url: '/environment/environmentAreaSensor/' + id,
    method: 'delete'
  })
}
