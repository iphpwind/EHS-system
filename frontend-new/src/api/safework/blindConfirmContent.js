import request from '@/utils/request'

// 查询现场确认内容列表
export function listBlindConfirmContent(query) {
  return request({
    url: '/safework/blindConfirmContent/list',
    method: 'get',
    params: query
  })
}

// 查询现场确认内容详细
export function getBlindConfirmContent(id) {
  return request({
    url: '/safework/blindConfirmContent/' + id,
    method: 'get'
  })
}

// 新增现场确认内容
export function addBlindConfirmContent(data) {
  return request({
    url: '/safework/blindConfirmContent',
    method: 'post',
    data: data
  })
}

// 修改现场确认内容
export function updateBlindConfirmContent(data) {
  return request({
    url: '/safework/blindConfirmContent',
    method: 'put',
    data: data
  })
}

// 删除现场确认内容
export function delBlindConfirmContent(id) {
  return request({
    url: '/safework/blindConfirmContent/' + id,
    method: 'delete'
  })
}
