import request from '@/utils/request'

// 查询设备数据
export function getSensorData(query) {
  return request({
    url: '/industry/industryScreen/getSensorData',
    method: 'get',
    params: query
  })
}