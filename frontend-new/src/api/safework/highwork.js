import request from '@/utils/request'

// 查询高处作业列表
export function listHighwork(query) {
  return request({
    url: '/safework/highwork/list',
    method: 'get',
    params: query
  })
}

// 查询高处作业列表
export function listHighwork2(query) {
  return request({
    url: '/safework/highwork/list2',
    method: 'get',
    params: query
  })
}

// 查询高处作业详细
export function getHighwork(id) {
  return request({
    url: '/safework/highwork/' + id,
    method: 'get'
  })
}

// 新增高处作业
export function addHighwork(data) {
  return request({
    url: '/safework/highwork',
    method: 'post',
    data: data
  })
}

// 修改高处作业
export function updateHighwork(data) {
  return request({
    url: '/safework/highwork',
    method: 'put',
    data: data
  })
}

// 作废高处作业
export function updateStatus(data) {
  return request({
    url: '/safework/highwork/updateStatus',
    method: 'put',
    data: data
  })
}

// 删除高处作业
export function delHighwork(id) {
  return request({
    url: '/safework/highwork/' + id,
    method: 'delete'
  })
}
