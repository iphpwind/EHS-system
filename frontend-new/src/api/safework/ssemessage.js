import request from '@/utils/request'

// 查询安工院推送记录列表
export function listSsemessage(query) {
  return request({
    url: '/safework/ssemessage/list',
    method: 'get',
    params: query
  })
}

// 查询安工院推送记录详细
export function getSsemessage(id) {
  return request({
    url: '/safework/ssemessage/' + id,
    method: 'get'
  })
}

// 新增安工院推送记录
export function addSsemessage(data) {
  return request({
    url: '/safework/ssemessage',
    method: 'post',
    data: data
  })
}

// 修改安工院推送记录
export function updateSsemessage(data) {
  return request({
    url: '/safework/ssemessage',
    method: 'put',
    data: data
  })
}

// 删除安工院推送记录
export function delSsemessage(id) {
  return request({
    url: '/safework/ssemessage/' + id,
    method: 'delete'
  })
}
