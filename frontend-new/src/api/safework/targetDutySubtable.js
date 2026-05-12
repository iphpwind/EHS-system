import request from '@/utils/request'

// 查询目标责任制定信息子（考核项目）列表
export function listTargetDutySubtable(query) {
  return request({
    url: '/safework/targetDutySubtable/list',
    method: 'get',
    params: query
  })
}

// 查询目标责任制定信息子（考核项目）详细
export function getTargetDutySubtable(id) {
  return request({
    url: '/safework/targetDutySubtable/' + id,
    method: 'get'
  })
}

// 新增目标责任制定信息子（考核项目）
export function addTargetDutySubtable(data) {
  return request({
    url: '/safework/targetDutySubtable',
    method: 'post',
    data: data
  })
}

// 修改目标责任制定信息子（考核项目）
export function updateTargetDutySubtable(data) {
  return request({
    url: '/safework/targetDutySubtable',
    method: 'put',
    data: data
  })
}

// 删除目标责任制定信息子（考核项目）
export function delTargetDutySubtable(id) {
  return request({
    url: '/safework/targetDutySubtable/' + id,
    method: 'delete'
  })
}
