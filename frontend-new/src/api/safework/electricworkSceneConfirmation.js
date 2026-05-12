import request from '@/utils/request'

// 查询临时用电现场确认内容列表
export function listElectricworkSceneConfirmation(query) {
  return request({
    url: '/safework/electricworkSceneConfirmation/list',
    method: 'get',
    params: query
  })
}

// 查询临时用电现场确认内容详细
export function getElectricworkSceneConfirmation(id) {
  return request({
    url: '/safework/electricworkSceneConfirmation/' + id,
    method: 'get'
  })
}

// 新增临时用电现场确认内容
export function addElectricworkSceneConfirmation(data) {
  return request({
    url: '/safework/electricworkSceneConfirmation',
    method: 'post',
    data: data
  })
}

// 修改临时用电现场确认内容
export function updateElectricworkSceneConfirmation(data) {
  return request({
    url: '/safework/electricworkSceneConfirmation',
    method: 'put',
    data: data
  })
}

// 删除临时用电现场确认内容
export function delElectricworkSceneConfirmation(id) {
  return request({
    url: '/safework/electricworkSceneConfirmation/' + id,
    method: 'delete'
  })
}
