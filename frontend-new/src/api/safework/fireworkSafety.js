import request from '@/utils/request'

// 查询动火作业票安全交底列表
export function listFireworkSafety(query) {
  return request({
    url: '/safework/fireworkSafety/list',
    method: 'get',
    params: query
  })
}

// 查询动火作业票安全交底详细
export function getFireworkSafety(id) {
  return request({
    url: '/safework/fireworkSafety/' + id,
    method: 'get'
  })
}

// 新增动火作业票安全交底
export function addFireworkSafety(data) {
  return request({
    url: '/safework/fireworkSafety',
    method: 'post',
    data: data
  })
}

// 修改动火作业票安全交底
export function updateFireworkSafety(data) {
  return request({
    url: '/safework/fireworkSafety',
    method: 'put',
    data: data
  })
}

// 删除动火作业票安全交底
export function delFireworkSafety(id) {
  return request({
    url: '/safework/fireworkSafety/' + id,
    method: 'delete'
  })
}
