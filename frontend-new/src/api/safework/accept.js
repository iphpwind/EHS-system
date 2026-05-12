import request from '@/utils/request'

// 查询隐患验收列表
export function listAccept(query) {
  return request({
    url: '/safework/accept/list',
    method: 'get',
    params: query
  })
}

// 查询隐患验收详细
export function getAccept(id) {
  return request({
    url: '/safework/accept/' + id,
    method: 'get'
  })
}

// 新增隐患验收
export function addAccept(data) {
  return request({
    url: '/safework/accept',
    method: 'post',
    data: data
  })
}

// 修改隐患验收
export function updateAccept(data) {
  return request({
    url: '/safework/accept',
    method: 'put',
    data: data
  })
}

// 删除隐患验收
export function delAccept(id) {
  return request({
    url: '/safework/accept/' + id,
    method: 'delete'
  })
}
