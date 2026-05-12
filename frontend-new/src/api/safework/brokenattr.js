import request from '@/utils/request'

// 查询断路作业确认、审核、验收属性信息列表
export function listBrokenattr(query) {
  return request({
    url: '/safework/brokenattr/list',
    method: 'get',
    params: query
  })
}

// 查询断路作业确认、审核、验收属性信息详细
export function getBrokenattr(id) {
  return request({
    url: '/safework/brokenattr/' + id,
    method: 'get'
  })
}

// 新增断路作业确认、审核、验收属性信息
export function addBrokenattr(data) {
  return request({
    url: '/safework/brokenattr',
    method: 'post',
    data: data
  })
}

// 修改断路作业确认、审核、验收属性信息
export function updateBrokenattr(data) {
  return request({
    url: '/safework/brokenattr',
    method: 'put',
    data: data
  })
}

// 删除断路作业确认、审核、验收属性信息
export function delBrokenattr(id) {
  return request({
    url: '/safework/brokenattr/' + id,
    method: 'delete'
  })
}
