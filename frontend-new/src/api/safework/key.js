import request from '@/utils/request'

// 查询七云牛key信息列表
export function listKey(query) {
  return request({
    url: '/safework/key/list',
    method: 'get',
    params: query
  })
}

// 查询七云牛key信息详细
export function getKey(id) {
  return request({
    url: '/safework/key/' + id,
    method: 'get'
  })
}

// 新增七云牛key信息
export function addKey(data) {
  return request({
    url: '/safework/key',
    method: 'post',
    data: data
  })
}

// 修改七云牛key信息
export function updateKey(data) {
  return request({
    url: '/safework/key',
    method: 'put',
    data: data
  })
}

// 删除七云牛key信息
export function delKey(id) {
  return request({
    url: '/safework/key/' + id,
    method: 'delete'
  })
}
