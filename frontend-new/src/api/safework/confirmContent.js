import request from '@/utils/request'

// 查询盲板抽堵作业确认内容列表
export function listConfirmContent(query) {
  return request({
    url: '/safework/confirmContent/list',
    method: 'get',
    params: query
  })
}

// 查询盲板抽堵作业确认内容详细
export function getConfirmContent(id) {
  return request({
    url: '/safework/confirmContent/' + id,
    method: 'get'
  })
}

// 新增盲板抽堵作业确认内容
export function addConfirmContent(data) {
  return request({
    url: '/safework/confirmContent',
    method: 'post',
    data: data
  })
}

// 修改盲板抽堵作业确认内容
export function updateConfirmContent(data) {
  return request({
    url: '/safework/confirmContent',
    method: 'put',
    data: data
  })
}

// 删除盲板抽堵作业确认内容
export function delConfirmContent(id) {
  return request({
    url: '/safework/confirmContent/' + id,
    method: 'delete'
  })
}
