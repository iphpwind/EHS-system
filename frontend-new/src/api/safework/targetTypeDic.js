import request from '@/utils/request'

// 查询目标责任类型字典列表
export function listTargetTypeDic(query) {
  return request({
    url: '/safework/targetTypeDic/list',
    method: 'get',
    params: query
  })
}

// 查询目标责任类型字典详细
export function getTargetTypeDic(id) {
  return request({
    url: '/safework/targetTypeDic/' + id,
    method: 'get'
  })
}

// 新增目标责任类型字典
export function addTargetTypeDic(data) {
  return request({
    url: '/safework/targetTypeDic',
    method: 'post',
    data: data
  })
}

// 修改目标责任类型字典
export function updateTargetTypeDic(data) {
  return request({
    url: '/safework/targetTypeDic',
    method: 'put',
    data: data
  })
}

// 删除目标责任类型字典
export function delTargetTypeDic(id) {
  return request({
    url: '/safework/targetTypeDic/' + id,
    method: 'delete'
  })
}
