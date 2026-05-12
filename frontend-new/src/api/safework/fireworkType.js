import request from '@/utils/request'

// 查询动火方式列表
export function listFireworkType(query) {
  return request({
    url: '/safework/fireworkType/list',
    method: 'get',
    params: query
  })
}

// 查询动火方式详细
export function getFireworkType(id) {
  return request({
    url: '/safework/fireworkType/' + id,
    method: 'get'
  })
}

// 新增动火方式
export function addFireworkType(data) {
  return request({
    url: '/safework/fireworkType',
    method: 'post',
    data: data
  })
}

// 修改动火方式
export function updateFireworkType(data) {
  return request({
    url: '/safework/fireworkType',
    method: 'put',
    data: data
  })
}

// 删除动火方式
export function delFireworkType(id) {
  return request({
    url: '/safework/fireworkType/' + id,
    method: 'delete'
  })
}
