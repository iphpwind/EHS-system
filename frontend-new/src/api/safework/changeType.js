import request from '@/utils/request'

// 查询变更类型字典列表
export function listChangeType(query) {
  return request({
    url: '/safework/changeType/list',
    method: 'get',
    params: query
  })
}

// 查询变更类型字典详细
export function getChangeType(id) {
  return request({
    url: '/safework/changeType/' + id,
    method: 'get'
  })
}

// 新增变更类型字典
export function addChangeType(data) {
  return request({
    url: '/safework/changeType',
    method: 'post',
    data: data
  })
}

// 修改变更类型字典
export function updateChangeType(data) {
  return request({
    url: '/safework/changeType',
    method: 'put',
    data: data
  })
}

// 删除变更类型字典
export function delChangeType(id) {
  return request({
    url: '/safework/changeType/' + id,
    method: 'delete'
  })
}
