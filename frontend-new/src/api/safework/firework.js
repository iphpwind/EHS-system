import request from '@/utils/request'

// 查询动火作业列表
export function listFirework(query) {
  return request({
    url: '/safework/firework/list',
    method: 'get',
    params: query
  })
}

// 查询动火作业列表
export function listFirework2(query) {
  return request({
    url: '/safework/firework/list2',
    method: 'get',
    params: query
  })
}

// 查询动火作业详细
export function getFirework(id) {
  return request({
    url: '/safework/firework/' + id,
    method: 'get'
  })
}

// 新增动火作业
export function addFirework(data) {
  return request({
    url: '/safework/firework',
    method: 'post',
    data: data
  })
}

// 修改动火作业
export function updateFirework(data) {
  return request({
    url: '/safework/firework',
    method: 'put',
    data: data
  })
}
// 作废动火作业
export function updateStatus(data) {
  return request({
    url: '/safework/firework/updateStatus',
    method: 'put',
    data: data
  })
}

// 删除动火作业
export function delFirework(id) {
  return request({
    url: '/safework/firework/' + id,
    method: 'delete'
  })
}
