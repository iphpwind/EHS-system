import request from '@/utils/request'

// 查询环保数据详细
export function getEnvironmentSensorData(id) {
  return request({
    url: '/environment/environmentSensorData/' + id,
    method: 'get'
  })
}

// 查询环保数据详细
export function getYcHis(data) {
  return request({
    url: '/environment/environmentSensorData/getYcHis',
    method: 'post',
    data: data
  })
}

// 查询环保数据详细
export function getYxHis(data) {
  return request({
    url: '/environment/environmentSensorData/getYxHis',
    method: 'post',
    data: data
  })
}
