import request from '@/utils/request'

// 查询双重预防-管控措施分类字典列表
export function listControlmethod(query) {
  return request({
    url: '/safework/controlmethod/list',
    method: 'get',
    params: query
  })
}

// 查询双重预防-管控措施分类字典详细
export function getControlmethod(id) {
  return request({
    url: '/safework/controlmethod/' + id,
    method: 'get'
  })
}

// 新增双重预防-管控措施分类字典
export function addControlmethod(data) {
  return request({
    url: '/safework/controlmethod',
    method: 'post',
    data: data
  })
}

// 修改双重预防-管控措施分类字典
export function updateControlmethod(data) {
  return request({
    url: '/safework/controlmethod',
    method: 'put',
    data: data
  })
}

// 删除双重预防-管控措施分类字典
export function delControlmethod(id) {
  return request({
    url: '/safework/controlmethod/' + id,
    method: 'delete'
  })
}
