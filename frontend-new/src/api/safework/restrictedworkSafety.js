import request from '@/utils/request'

// 查询受限空间票安全交底列表
export function listRestrictedworkSafety(query) {
  return request({
    url: '/safework/restrictedworkSafety/list',
    method: 'get',
    params: query
  })
}

// 查询受限空间票安全交底详细
export function getRestrictedworkSafety(id) {
  return request({
    url: '/safework/restrictedworkSafety/' + id,
    method: 'get'
  })
}

// 新增受限空间票安全交底
export function addRestrictedworkSafety(data) {
  return request({
    url: '/safework/restrictedworkSafety',
    method: 'post',
    data: data
  })
}

// 修改受限空间票安全交底
export function updateRestrictedworkSafety(data) {
  return request({
    url: '/safework/restrictedworkSafety',
    method: 'put',
    data: data
  })
}

// 删除受限空间票安全交底
export function delRestrictedworkSafety(id) {
  return request({
    url: '/safework/restrictedworkSafety/' + id,
    method: 'delete'
  })
}
