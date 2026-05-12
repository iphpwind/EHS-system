import request from '@/utils/request'

// 查询JHA安全交底单列表
export function listDisclosure(query) {
  return request({
    url: '/safework/disclosure/list',
    method: 'get',
    params: query
  })
}

// 查询JHA安全交底单详细
export function getDisclosure(id) {
  return request({
    url: '/safework/disclosure/' + id,
    method: 'get'
  })
}

// 新增JHA安全交底单
export function addDisclosure(data) {
  return request({
    url: '/safework/disclosure',
    method: 'post',
    data: data
  })
}

// 修改JHA安全交底单
export function updateDisclosure(data) {
  return request({
    url: '/safework/disclosure',
    method: 'put',
    data: data
  })
}

// 删除JHA安全交底单
export function delDisclosure(id) {
  return request({
    url: '/safework/disclosure/' + id,
    method: 'delete'
  })
}
