import request from '@/utils/request'

// 查询线下安全活动列表
export function listActivity(query) {
  return request({
    url: '/safework/activity/list',
    method: 'get',
    params: query
  })
}

// 查询线下安全活动详细
export function getActivity(id) {
  return request({
    url: '/safework/activity/' + id,
    method: 'get'
  })
}

// 新增线下安全活动
export function addActivity(data) {
  return request({
    url: '/safework/activity',
    method: 'post',
    data: data
  })
}

// 修改线下安全活动
export function updateActivity(data) {
  return request({
    url: '/safework/activity',
    method: 'put',
    data: data
  })
}

// 删除线下安全活动
export function delActivity(id) {
  return request({
    url: '/safework/activity/' + id,
    method: 'delete'
  })
}
