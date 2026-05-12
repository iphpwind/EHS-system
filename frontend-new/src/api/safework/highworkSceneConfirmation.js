import request from '@/utils/request'

// 查询高处作业现场确认内容列表
export function listHighworkSceneConfirmation(query) {
  return request({
    url: '/safework/highworkSceneConfirmation/list',
    method: 'get',
    params: query
  })
}

// 查询高处作业现场确认内容详细
export function getHighworkSceneConfirmation(id) {
  return request({
    url: '/safework/highworkSceneConfirmation/' + id,
    method: 'get'
  })
}

// 新增高处作业现场确认内容
export function addHighworkSceneConfirmation(data) {
  return request({
    url: '/safework/highworkSceneConfirmation',
    method: 'post',
    data: data
  })
}

// 修改高处作业现场确认内容
export function updateHighworkSceneConfirmation(data) {
  return request({
    url: '/safework/highworkSceneConfirmation',
    method: 'put',
    data: data
  })
}

// 删除高处作业现场确认内容
export function delHighworkSceneConfirmation(id) {
  return request({
    url: '/safework/highworkSceneConfirmation/' + id,
    method: 'delete'
  })
}
