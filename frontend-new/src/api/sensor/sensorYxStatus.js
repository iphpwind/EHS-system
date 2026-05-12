import request from '@/utils/request'

// 查询设备运行状态列表
export function listSensorYxStatus(query) {
  return request({
    url: '/sensor/SensorYxStatus/list',
    method: 'get',
    params: query
  })
}

// 查询设备运行状态详细
export function getSensorYxStatus(yxstatusNo) {
  return request({
    url: '/sensor/SensorYxStatus/' + yxstatusNo,
    method: 'get'
  })
}

// 新增设备运行状态
export function addSensorYxStatus(data) {
  return request({
    url: '/sensor/SensorYxStatus',
    method: 'post',
    data: data
  })
}

// 修改设备运行状态
export function updateSensorYxStatus(data) {
  return request({
    url: '/sensor/SensorYxStatus',
    method: 'put',
    data: data
  })
}

// 删除设备运行状态
export function delSensorYxStatus(yxstatusNo) {
  return request({
    url: '/sensor/SensorYxStatus/' + yxstatusNo,
    method: 'delete'
  })
}
