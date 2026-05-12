import request from '@/utils/request'

// 查询设备点检日记录列表
export function listSpotCheckDay(query) {
  return request({
    url: '/equipment/spotCheckDay/list',
    method: 'get',
    params: query
  })
}

// 查询设备点检日记录详细
export function getSpotCheckDay(id) {
  return request({
    url: '/equipment/spotCheckDay/' + id,
    method: 'get'
  })
}

// 新增设备点检日记录
export function addSpotCheckDay(data) {
  return request({
    url: '/equipment/spotCheckDay',
    method: 'post',
    data: data
  })
}

// 修改设备点检日记录
export function updateSpotCheckDay(data) {
  return request({
    url: '/equipment/spotCheckDay',
    method: 'put',
    data: data
  })
}

// 删除设备点检日记录
export function delSpotCheckDay(id) {
  return request({
    url: '/equipment/spotCheckDay/' + id,
    method: 'delete'
  })
}
