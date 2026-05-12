import request from '@/utils/request'

// 查询承包商列表
export function listContractor(query) {
  return request({
    url: '/safework/contractor/list',
    method: 'get',
    params: query
  })
}

// 查询承包商详细
export function getContractor(id) {
  return request({
    url: '/safework/contractor/' + id,
    method: 'get'
  })
}

// 新增承包商
export function addContractor(data) {
  return request({
    url: '/safework/contractor',
    method: 'post',
    data: data
  })
}

// 修改承包商
export function updateContractor(data) {
  return request({
    url: '/safework/contractor',
    method: 'put',
    data: data
  })
}

// 删除承包商
export function delContractor(id) {
  return request({
    url: '/safework/contractor/' + id,
    method: 'delete'
  })
}
