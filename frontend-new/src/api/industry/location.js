import request from '@/utils/request'

// 查询车辆位置信息列表
export function listLocation(query) {
  return request({
    url: '/industry/location/list',
    method: 'get',
    params: query
  })
}