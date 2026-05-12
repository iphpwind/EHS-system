import request from '@/utils/request'

// 查询设备遥信点列表
export function listSensorYx(query) {
  return request({
    url: '/sensor/sensorYx/list',
    method: 'get',
    params: query
  })
}

// 查询设备遥信点详细
export function getSensorYx(yxNo) {
  return request({
    url: '/sensor/sensorYx/' + yxNo,
    method: 'get'
  })
}

// 新增设备遥信点
export function addSensorYx(data) {
  return request({
    url: '/sensor/sensorYx',
    method: 'post',
    data: data
  })
}

// 修改设备遥信点
export function updateSensorYx(data) {
  return request({
    url: '/sensor/sensorYx',
    method: 'put',
    data: data
  })
}

// 删除设备遥信点
export function delSensorYx(yxNo) {
  return request({
    url: '/sensor/sensorYx/' + yxNo,
    method: 'delete'
  })
}
