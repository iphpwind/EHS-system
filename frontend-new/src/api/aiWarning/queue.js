import request from '@/utils/request'

// 查询请求重试队列列表
export function listQueue(query) {
  return request({
    url: '/aiWarning/queue/list',
    method: 'get',
    params: query
  })
}

// 查询请求重试队列详细
export function getQueue(id) {
  return request({
    url: '/aiWarning/queue/' + id,
    method: 'get'
  })
}

// 新增请求重试队列
export function addQueue(data) {
  return request({
    url: '/aiWarning/queue',
    method: 'post',
    data: data
  })
}

// 修改请求重试队列
export function updateQueue(data) {
  return request({
    url: '/aiWarning/queue',
    method: 'put',
    data: data
  })
}

// 删除请求重试队列
export function delQueue(id) {
  return request({
    url: '/aiWarning/queue/' + id,
    method: 'delete'
  })
}
