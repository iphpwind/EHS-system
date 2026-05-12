import request from '@/utils/request'

// 查询运行状态模型列表
export function listSensorModalYxStatus(query) {
  return request({
    url: '/sensor/SensorModalYxStatus/list',
    method: 'get',
    params: query
  })
}

// 查询运行状态模型详细
export function getSensorModalYxStatus(yxstatusNo) {
  return request({
    url: '/sensor/SensorModalYxStatus/' + yxstatusNo,
    method: 'get'
  })
}

// 新增运行状态模型
export function addSensorModalYxStatus(data) {
  return request({
    url: '/sensor/SensorModalYxStatus',
    method: 'post',
    data: data
  })
}

// 修改运行状态模型
export function updateSensorModalYxStatus(data) {
  return request({
    url: '/sensor/SensorModalYxStatus',
    method: 'put',
    data: data
  })
}

// 删除运行状态模型
export function delSensorModalYxStatus(yxstatusNo) {
  return request({
    url: '/sensor/SensorModalYxStatus/' + yxstatusNo,
    method: 'delete'
  })
}
