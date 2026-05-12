import request from '@/utils/request'

// 查询动火作业级别列表
export function listFireworkLevel(query) {
  return request({
    url: '/safework/fireworkLevel/list',
    method: 'get',
    params: query
  })
}

// 查询动火作业级别详细
export function getFireworkLevel(id) {
  return request({
    url: '/safework/fireworkLevel/' + id,
    method: 'get'
  })
}

// 新增动火作业级别
export function addFireworkLevel(data) {
  return request({
    url: '/safework/fireworkLevel',
    method: 'post',
    data: data
  })
}

// 修改动火作业级别
export function updateFireworkLevel(data) {
  return request({
    url: '/safework/fireworkLevel',
    method: 'put',
    data: data
  })
}

// 删除动火作业级别
export function delFireworkLevel(id) {
  return request({
    url: '/safework/fireworkLevel/' + id,
    method: 'delete'
  })
}
