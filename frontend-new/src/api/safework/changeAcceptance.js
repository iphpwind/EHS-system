import request from '@/utils/request'

// 查询变更验收列表
export function listChangeAcceptance(query) {
  return request({
    url: '/safework/changeAcceptance/list',
    method: 'get',
    params: query
  })
}

// 查询变更验收详细
export function getChangeAcceptance(id) {
  return request({
    url: '/safework/changeAcceptance/' + id,
    method: 'get'
  })
}

// 新增变更验收
export function addChangeAcceptance(data) {
  return request({
    url: '/safework/changeAcceptance',
    method: 'post',
    data: data
  })
}

// 修改变更验收
export function updateChangeAcceptance(data) {
  return request({
    url: '/safework/changeAcceptance',
    method: 'put',
    data: data
  })
}

// 删除变更验收
export function delChangeAcceptance(id) {
  return request({
    url: '/safework/changeAcceptance/' + id,
    method: 'delete'
  })
}
