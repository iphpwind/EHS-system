import request from '@/utils/request'

// 查询应急卡列表
export function listEmergency(query) {
  return request({
    url: '/safework/emergency/list',
    method: 'get',
    params: query
  })
}

// 查询应急卡详细
export function getEmergency(id) {
  return request({
    url: '/safework/emergency/' + id,
    method: 'get'
  })
}

// 新增应急卡
export function addEmergency(data) {
  return request({
    url: '/safework/emergency',
    method: 'post',
    data: data
  })
}

// 修改应急卡
export function updateEmergency(data) {
  return request({
    url: '/safework/emergency',
    method: 'put',
    data: data
  })
}

// 删除应急卡
export function delEmergency(id) {
  return request({
    url: '/safework/emergency/' + id,
    method: 'delete'
  })
}
