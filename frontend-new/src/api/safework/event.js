import request from '@/utils/request'

// 查询风险事件列表
export function listEvent(query) {
  return request({
    url: '/safework/event/list',
    method: 'get',
    params: query
  })
}

// 查询风险事件详细
export function getEvent(id) {
  return request({
    url: '/safework/event/' + id,
    method: 'get'
  })
}

// 新增风险事件
export function addEvent(data) {
  return request({
    url: '/safework/event',
    method: 'post',
    data: data
  })
}

// 修改风险事件
export function updateEvent(data) {
  return request({
    url: '/safework/event',
    method: 'put',
    data: data
  })
}

// 删除风险事件
export function delEvent(id) {
  return request({
    url: '/safework/event/' + id,
    method: 'delete'
  })
}
