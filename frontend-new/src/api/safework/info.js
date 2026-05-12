import request from '@/utils/request'

// 查询消息推送记录列表
export function listInfo(query) {
  return request({
    url: '/safework/info/list',
    method: 'get',
    params: query
  })
}

// 查询消息推送记录详细
export function getInfo(id) {
  return request({
    url: '/safework/info/' + id,
    method: 'get'
  })
}

// 新增消息推送记录
export function addInfo(data) {
  return request({
    url: '/safework/info',
    method: 'post',
    data: data
  })
}

// 修改消息推送记录
export function updateInfo(data) {
  return request({
    url: '/safework/info',
    method: 'put',
    data: data
  })
}

// 删除消息推送记录
export function delInfo(id) {
  return request({
    url: '/safework/info/' + id,
    method: 'delete'
  })
}
