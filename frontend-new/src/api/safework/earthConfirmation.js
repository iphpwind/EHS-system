import request from '@/utils/request'

// 查询动土作业现场确认内容列表
export function listEarthConfirmation(query) {
  return request({
    url: '/safework/earthConfirmation/list',
    method: 'get',
    params: query
  })
}

// 查询动土作业现场确认内容详细
export function getEarthConfirmation(id) {
  return request({
    url: '/safework/earthConfirmation/' + id,
    method: 'get'
  })
}

// 新增动土作业现场确认内容
export function addEarthConfirmation(data) {
  return request({
    url: '/safework/earthConfirmation',
    method: 'post',
    data: data
  })
}

// 修改动土作业现场确认内容
export function updateEarthConfirmation(data) {
  return request({
    url: '/safework/earthConfirmation',
    method: 'put',
    data: data
  })
}

// 删除动土作业现场确认内容
export function delEarthConfirmation(id) {
  return request({
    url: '/safework/earthConfirmation/' + id,
    method: 'delete'
  })
}
