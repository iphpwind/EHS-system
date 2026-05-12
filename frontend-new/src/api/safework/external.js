import request from '@/utils/request'

// 查询应急通讯-外部通讯录列表
export function listExternal(query) {
  return request({
    url: '/safework/external/list',
    method: 'get',
    params: query
  })
}

// 查询应急通讯-外部通讯录详细
export function getExternal(id) {
  return request({
    url: '/safework/external/' + id,
    method: 'get'
  })
}

// 新增应急通讯-外部通讯录
export function addExternal(data) {
  return request({
    url: '/safework/external',
    method: 'post',
    data: data
  })
}

// 修改应急通讯-外部通讯录
export function updateExternal(data) {
  return request({
    url: '/safework/external',
    method: 'put',
    data: data
  })
}

// 删除应急通讯-外部通讯录
export function delExternal(id) {
  return request({
    url: '/safework/external/' + id,
    method: 'delete'
  })
}
