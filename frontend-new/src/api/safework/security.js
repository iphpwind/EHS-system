import request from '@/utils/request'

// 查询安全制度管理列表
export function listSecurity(query) {
  return request({
    url: '/safework/security/list',
    method: 'get',
    params: query
  })
}

// 查询安全制度管理详细
export function getSecurity(id) {
  return request({
    url: '/safework/security/' + id,
    method: 'get'
  })
}

// 新增安全制度管理
export function addSecurity(data) {
  return request({
    url: '/safework/security',
    method: 'post',
    data: data
  })
}

// 修改安全制度管理
export function updateSecurity(data) {
  return request({
    url: '/safework/security',
    method: 'put',
    data: data
  })
}

// 删除安全制度管理
export function delSecurity(id) {
  return request({
    url: '/safework/security/' + id,
    method: 'delete'
  })
}
