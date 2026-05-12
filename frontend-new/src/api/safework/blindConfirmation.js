import request from '@/utils/request'

// 查询盲板抽堵现场确认内容列表
export function listBlindConfirmation(query) {
  return request({
    url: '/safework/blindConfirmation/list',
    method: 'get',
    params: query
  })
}

// 查询盲板抽堵现场确认内容详细
export function getBlindConfirmation(id) {
  return request({
    url: '/safework/blindConfirmation/' + id,
    method: 'get'
  })
}

// 新增盲板抽堵现场确认内容
export function addBlindConfirmation(data) {
  return request({
    url: '/safework/blindConfirmation',
    method: 'post',
    data: data
  })
}

// 修改盲板抽堵现场确认内容
export function updateBlindConfirmation(data) {
  return request({
    url: '/safework/blindConfirmation',
    method: 'put',
    data: data
  })
}

// 删除盲板抽堵现场确认内容
export function delBlindConfirmation(id) {
  return request({
    url: '/safework/blindConfirmation/' + id,
    method: 'delete'
  })
}
