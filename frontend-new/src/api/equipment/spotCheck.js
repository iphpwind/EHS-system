import request from '@/utils/request'

// 查询设备点检记录列表
export function listSpotCheck(query) {
  return request({
    url: '/equipment/spotCheck/list',
    method: 'get',
    params: query
  })
}
// 查询设备点检记录列表
export function listSpotCheckCount(query) {
  return request({
    url: '/equipment/spotCheck/listSpotCheckCount',
    method: 'get',
    params: query
  })
}

// 查询设备点检记录详细
export function getSpotCheck(id) {
  return request({
    url: '/equipment/spotCheck/' + id,
    method: 'get'
  })
}

// 查询设备点检记录详细
export function getSpotCheckCount(id) {
  return request({
    url: '/equipment/spotCheck/getSpotCheckCount/' + id,
    method: 'get'
  })
}

// 新增设备点检记录
export function addSpotCheck(data) {
  return request({
    url: '/equipment/spotCheck',
    method: 'post',
    data: data
  })
}

// 修改设备点检记录
export function updateSpotCheck(data) {
  return request({
    url: '/equipment/spotCheck',
    method: 'put',
    data: data
  })
}

// 删除设备点检记录
export function delSpotCheck(id) {
  return request({
    url: '/equipment/spotCheck/' + id,
    method: 'delete'
  })
}
