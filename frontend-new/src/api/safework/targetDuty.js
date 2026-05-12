import request from '@/utils/request'

// 查询目标责任制定信息列表
export function listTargetDuty(query) {
  return request({
    url: '/safework/targetDuty/list',
    method: 'get',
    params: query
  })
}

// 查询目标责任制定信息详细
export function getTargetDuty(id) {
  return request({
    url: '/safework/targetDuty/' + id,
    method: 'get'
  })
}

// 新增目标责任制定信息
export function addTargetDuty(data) {
  return request({
    url: '/safework/targetDuty',
    method: 'post',
    data: data
  })
}

// 修改目标责任制定信息
export function updateTargetDuty(data) {
  return request({
    url: '/safework/targetDuty',
    method: 'put',
    data: data
  })
}

// 删除目标责任制定信息
export function delTargetDuty(id) {
  return request({
    url: '/safework/targetDuty/' + id,
    method: 'delete'
  })
}
