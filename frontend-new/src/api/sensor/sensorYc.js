import request from '@/utils/request'

// 查询传感器遥测点列表
export function listSensorYc(query) {
  return request({
    url: '/sensor/sensorYc/list',
    method: 'get',
    params: query
  })
}

// 查询传感器遥测点详细
export function getSensorYc(ycNo) {
  return request({
    url: '/sensor/sensorYc/' + ycNo,
    method: 'get'
  })
}

// 新增传感器遥测点
export function addSensorYc(data) {
  return request({
    url: '/sensor/sensorYc',
    method: 'post',
    data: data
  })
}

// 修改传感器遥测点
export function updateSensorYc(data) {
  return request({
    url: '/sensor/sensorYc',
    method: 'put',
    data: data
  })
}

// 删除传感器遥测点
export function delSensorYc(ycNo) {
  return request({
    url: '/sensor/sensorYc/' + ycNo,
    method: 'delete'
  })
}
