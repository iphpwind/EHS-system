import request from '@/utils/request'

// 查询断路作业现场确认内容列表
export function listBrokenConfirmContent(query) {
  return request({
    url: '/safework/brokenConfirmContent/list',
    method: 'get',
    params: query
  })
}

// 查询断路作业现场确认内容详细
export function getBrokenConfirmContent(id) {
  return request({
    url: '/safework/brokenConfirmContent/' + id,
    method: 'get'
  })
}

// 新增断路作业现场确认内容
export function addBrokenConfirmContent(data) {
  return request({
    url: '/safework/brokenConfirmContent',
    method: 'post',
    data: data
  })
}

// 修改断路作业现场确认内容
export function updateBrokenConfirmContent(data) {
  return request({
    url: '/safework/brokenConfirmContent',
    method: 'put',
    data: data
  })
}

// 删除断路作业现场确认内容
export function delBrokenConfirmContent(id) {
  return request({
    url: '/safework/brokenConfirmContent/' + id,
    method: 'delete'
  })
}
