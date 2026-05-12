import request from '@/utils/request'

// 查询动火作业现场确认内容列表
export function listFireworkSceneConfirmation(query) {
  return request({
    url: '/safework/fireworkSceneConfirmation/list',
    method: 'get',
    params: query
  })
}

// 查询动火作业现场确认内容详细
export function getFireworkSceneConfirmation(id) {
  return request({
    url: '/safework/fireworkSceneConfirmation/' + id,
    method: 'get'
  })
}

// 新增动火作业现场确认内容
export function addFireworkSceneConfirmation(data) {
  return request({
    url: '/safework/fireworkSceneConfirmation',
    method: 'post',
    data: data
  })
}

// 修改动火作业现场确认内容
export function updateFireworkSceneConfirmation(data) {
  return request({
    url: '/safework/fireworkSceneConfirmation',
    method: 'put',
    data: data
  })
}

// 删除动火作业现场确认内容
export function delFireworkSceneConfirmation(id) {
  return request({
    url: '/safework/fireworkSceneConfirmation/' + id,
    method: 'delete'
  })
}
