import request from '@/utils/request'

// 查询设备点检月记录列表
export function listSpotCheckMonth(query) {
  return request({
    url: '/equipment/spotCheckMonth/list',
    method: 'get',
    params: query
  })
}

// 查询设备点检月记录详细
export function getSpotCheckMonth(id) {
  return request({
    url: '/equipment/spotCheckMonth/' + id,
    method: 'get'
  })
}

// 新增设备点检月记录
export function addSpotCheckMonth(data) {
  return request({
    url: '/equipment/spotCheckMonth',
    method: 'post',
    data: data
  })
}

// 修改设备点检月记录
export function updateSpotCheckMonth(data) {
  return request({
    url: '/equipment/spotCheckMonth',
    method: 'put',
    data: data
  })
}

// 删除设备点检月记录
export function delSpotCheckMonth(id) {
  return request({
    url: '/equipment/spotCheckMonth/' + id,
    method: 'delete'
  })
}
