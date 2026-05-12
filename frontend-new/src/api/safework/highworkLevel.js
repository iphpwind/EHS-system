import request from '@/utils/request'

// 查询高处作业级别列表
export function listHighworkLevel(query) {
  return request({
    url: '/safework/highworkLevel/list',
    method: 'get',
    params: query
  })
}

// 查询高处作业级别详细
export function getHighworkLevel(id) {
  return request({
    url: '/safework/highworkLevel/' + id,
    method: 'get'
  })
}

// 新增高处作业级别
export function addHighworkLevel(data) {
  return request({
    url: '/safework/highworkLevel',
    method: 'post',
    data: data
  })
}

// 修改高处作业级别
export function updateHighworkLevel(data) {
  return request({
    url: '/safework/highworkLevel',
    method: 'put',
    data: data
  })
}

// 删除高处作业级别
export function delHighworkLevel(id) {
  return request({
    url: '/safework/highworkLevel/' + id,
    method: 'delete'
  })
}
