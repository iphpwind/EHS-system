import request from '@/utils/request'

// 查询sseApiInfo列表
export function listSseApiInfo(query) {
  return request({
    url: '/safework/sseApiInfo/list',
    method: 'get',
    params: query
  })
}

// 查询sseApiInfo详细
export function getSseApiInfo(id) {
  return request({
    url: '/safework/sseApiInfo/' + id,
    method: 'get'
  })
}

// 新增sseApiInfo
export function addSseApiInfo(data) {
  return request({
    url: '/safework/sseApiInfo',
    method: 'post',
    data: data
  })
}

// 修改sseApiInfo
export function updateSseApiInfo(data) {
  return request({
    url: '/safework/sseApiInfo',
    method: 'put',
    data: data
  })
}

// 删除sseApiInfo
export function delSseApiInfo(id) {
  return request({
    url: '/safework/sseApiInfo/' + id,
    method: 'delete'
  })
}
