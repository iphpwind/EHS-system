import request from '@/utils/request'

// 查询电表数据详细
export function getSensorData(id) {
  return request({
    url: '/energy/sensorData/' + id,
    method: 'get'
  })
}
