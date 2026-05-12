import request from '@/utils/request'

// 查询变更时限字典列表
export function listTimeLimit(query) {
  return request({
    url: '/safework/timeLimit/list',
    method: 'get',
    params: query
  })
}

// 查询变更时限字典详细
export function getTimeLimit(id) {
  return request({
    url: '/safework/timeLimit/' + id,
    method: 'get'
  })
}

// 新增变更时限字典
export function addTimeLimit(data) {
  return request({
    url: '/safework/timeLimit',
    method: 'post',
    data: data
  })
}

// 修改变更时限字典
export function updateTimeLimit(data) {
  return request({
    url: '/safework/timeLimit',
    method: 'put',
    data: data
  })
}

// 删除变更时限字典
export function delTimeLimit(id) {
  return request({
    url: '/safework/timeLimit/' + id,
    method: 'delete'
  })
}
