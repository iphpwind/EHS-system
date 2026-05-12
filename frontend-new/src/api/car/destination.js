import request from '@/utils/request'

// 查询目的地信息列表
export function listDestination(query) {
  return request({
    url: '/car/destination/list',
    method: 'get',
    params: query
  })
}

// 查询目的地信息详细
export function getDestination(id) {
  return request({
    url: '/car/destination/' + id,
    method: 'get'
  })
}

// 新增目的地信息
export function addDestination(data) {
  return request({
    url: '/car/destination',
    method: 'post',
    data: data
  })
}

// 修改目的地信息
export function updateDestination(data) {
  return request({
    url: '/car/destination',
    method: 'put',
    data: data
  })
}

// 删除目的地信息
export function delDestination(id) {
  return request({
    url: '/car/destination/' + id,
    method: 'delete'
  })
}
