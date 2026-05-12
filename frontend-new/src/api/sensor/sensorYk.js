import request from '@/utils/request'

// 查询设备遥控点列表
export function listSensorYk(query) {
  return request({
    url: '/sensor/sensorYk/list',
    method: 'get',
    params: query
  })
}

// 查询设备遥控点详细
export function getSensorYk(ykNo) {
  return request({
    url: '/sensor/sensorYk/' + ykNo,
    method: 'get'
  })
}

// 新增设备遥控点
export function addSensorYk(data) {
  return request({
    url: '/sensor/sensorYk',
    method: 'post',
    data: data
  })
}

// 修改设备遥控点
export function updateSensorYk(data) {
  return request({
    url: '/sensor/sensorYk',
    method: 'put',
    data: data
  })
}

// 删除设备遥控点
export function delSensorYk(ykNo) {
  return request({
    url: '/sensor/sensorYk/' + ykNo,
    method: 'delete'
  })
}
