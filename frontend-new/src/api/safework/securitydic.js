import request from '@/utils/request'

// 查询安全制度分类字典列表
export function listSecuritydic(query) {
  return request({
    url: '/safework/securitydic/list',
    method: 'get',
    params: query
  })
}

// 查询安全制度分类字典详细
export function getSecuritydic(id) {
  return request({
    url: '/safework/securitydic/' + id,
    method: 'get'
  })
}

// 新增安全制度分类字典
export function addSecuritydic(data) {
  return request({
    url: '/safework/securitydic',
    method: 'post',
    data: data
  })
}

// 修改安全制度分类字典
export function updateSecuritydic(data) {
  return request({
    url: '/safework/securitydic',
    method: 'put',
    data: data
  })
}

// 删除安全制度分类字典
export function delSecuritydic(id) {
  return request({
    url: '/safework/securitydic/' + id,
    method: 'delete'
  })
}
