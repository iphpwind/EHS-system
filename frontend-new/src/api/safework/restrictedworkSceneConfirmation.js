import request from '@/utils/request'

// 查询受限空间现场确认内容列表
export function listRestrictedworkSceneConfirmation(query) {
  return request({
    url: '/safework/restrictedworkSceneConfirmation/list',
    method: 'get',
    params: query
  })
}

// 查询受限空间现场确认内容详细
export function getRestrictedworkSceneConfirmation(id) {
  return request({
    url: '/safework/restrictedworkSceneConfirmation/' + id,
    method: 'get'
  })
}

// 新增受限空间现场确认内容
export function addRestrictedworkSceneConfirmation(data) {
  return request({
    url: '/safework/restrictedworkSceneConfirmation',
    method: 'post',
    data: data
  })
}

// 修改受限空间现场确认内容
export function updateRestrictedworkSceneConfirmation(data) {
  return request({
    url: '/safework/restrictedworkSceneConfirmation',
    method: 'put',
    data: data
  })
}

// 删除受限空间现场确认内容
export function delRestrictedworkSceneConfirmation(id) {
  return request({
    url: '/safework/restrictedworkSceneConfirmation/' + id,
    method: 'delete'
  })
}
