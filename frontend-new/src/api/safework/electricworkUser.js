import request from '@/utils/request'

// 查询用电作业人列表
export function listElectricworkUser(query) {
  return request({
    url: '/safework/electricworkUser/list',
    method: 'get',
    params: query
  })
}

// 查询用电作业人详细
export function getElectricworkUser(id) {
  return request({
    url: '/safework/electricworkUser/' + id,
    method: 'get'
  })
}

// 新增用电作业人
export function addElectricworkUser(data) {
  return request({
    url: '/safework/electricworkUser',
    method: 'post',
    data: data
  })
}

// 修改用电作业人
export function updateElectricworkUser(data) {
  return request({
    url: '/safework/electricworkUser',
    method: 'put',
    data: data
  })
}

// 删除用电作业人
export function delElectricworkUser(id) {
  return request({
    url: '/safework/electricworkUser/' + id,
    method: 'delete'
  })
}
