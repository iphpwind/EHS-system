import request from '@/utils/request'

// 查询断路作业现场确认内容字典列表
export function listBrokenSceneConfirmation(query) {
  return request({
    url: '/safework/brokenSceneConfirmation/list',
    method: 'get',
    params: query
  })
}

// 查询断路作业现场确认内容字典详细
export function getBrokenSceneConfirmation(id) {
  return request({
    url: '/safework/brokenSceneConfirmation/' + id,
    method: 'get'
  })
}

// 新增断路作业现场确认内容字典
export function addBrokenSceneConfirmation(data) {
  return request({
    url: '/safework/brokenSceneConfirmation',
    method: 'post',
    data: data
  })
}

// 修改断路作业现场确认内容字典
export function updateBrokenSceneConfirmation(data) {
  return request({
    url: '/safework/brokenSceneConfirmation',
    method: 'put',
    data: data
  })
}

// 删除断路作业现场确认内容字典
export function delBrokenSceneConfirmation(id) {
  return request({
    url: '/safework/brokenSceneConfirmation/' + id,
    method: 'delete'
  })
}
