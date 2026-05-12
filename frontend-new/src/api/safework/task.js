import request from '@/utils/request'

// 查询隐患排查任务列表
export function listTask(query) {
  return request({
    url: '/safework/task/list',
    method: 'get',
    params: query
  })
}
export function lvlist(query) {
  return request({
    url: '/safework/task/lvlist',
    method: 'get',
    params: query
  })
}

export function listComTask(query) {
  return request({
    url: '/safework/task/comList',
    method: 'get',
    params: query
  })
}

export function listByObject(query) {
  return request({
    url: '/safework/task/listByObject',
    method: 'get',
    params: query
  })
}

// 查询隐患排查任务详细
export function getTask(id) {
  return request({
    url: '/safework/task/' + id,
    method: 'get'
  })
}

// 新增隐患排查任务
export function addTask(data) {
  return request({
    url: '/safework/task',
    method: 'post',
    data: data
  })
}

// 修改隐患排查任务
export function updateTask(data) {
  return request({
    url: '/safework/task',
    method: 'put',
    data: data
  })
}

// 删除隐患排查任务
export function delTask(id) {
  return request({
    url: '/safework/task/' + id,
    method: 'delete'
  })
}
