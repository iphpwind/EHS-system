import request from '@/utils/request'

// 查询高处作业票安全交底列表
export function listHighworkSafety(query) {
  return request({
    url: '/safework/highworkSafety/list',
    method: 'get',
    params: query
  })
}

// 查询高处作业票安全交底详细
export function getHighworkSafety(id) {
  return request({
    url: '/safework/highworkSafety/' + id,
    method: 'get'
  })
}

// 新增高处作业票安全交底
export function addHighworkSafety(data) {
  return request({
    url: '/safework/highworkSafety',
    method: 'post',
    data: data
  })
}

// 修改高处作业票安全交底
export function updateHighworkSafety(data) {
  return request({
    url: '/safework/highworkSafety',
    method: 'put',
    data: data
  })
}

// 删除高处作业票安全交底
export function delHighworkSafety(id) {
  return request({
    url: '/safework/highworkSafety/' + id,
    method: 'delete'
  })
}
