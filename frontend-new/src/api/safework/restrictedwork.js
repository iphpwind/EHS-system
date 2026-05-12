import request from '@/utils/request'

// 查询受限空间列表
export function listRestrictedwork(query) {
  return request({
    url: '/safework/restrictedwork/list',
    method: 'get',
    params: query
  })
}

// 查询受限空间列表
export function listRestrictedwork2(query) {
  return request({
    url: '/safework/restrictedwork/list2',
    method: 'get',
    params: query
  })
}

// 查询受限空间详细
export function getRestrictedwork(id) {
  return request({
    url: '/safework/restrictedwork/' + id,
    method: 'get'
  })
}

// 新增受限空间
export function addRestrictedwork(data) {
  return request({
    url: '/safework/restrictedwork',
    method: 'post',
    data: data
  })
}

// 修改受限空间
export function updateRestrictedwork(data) {
  return request({
    url: '/safework/restrictedwork',
    method: 'put',
    data: data
  })
}

// 作废受限空间
export function updateStatus(data) {
  return request({
    url: '/safework/restrictedwork/updateStatus',
    method: 'put',
    data: data
  })
}

// 删除受限空间
export function delRestrictedwork(id) {
  return request({
    url: '/safework/restrictedwork/' + id,
    method: 'delete'
  })
}
