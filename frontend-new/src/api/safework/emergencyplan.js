import request from '@/utils/request'

// 查询应急预案列表
export function listEmergencyplan(query) {
  return request({
    url: '/safework/emergencyplan/list',
    method: 'get',
    params: query
  })
}

// 查询应急预案详细
export function getEmergencyplan(id) {
  return request({
    url: '/safework/emergencyplan/' + id,
    method: 'get'
  })
}

// 新增应急预案
export function addEmergencyplan(data) {
  return request({
    url: '/safework/emergencyplan',
    method: 'post',
    data: data
  })
}

// 修改应急预案
export function updateEmergencyplan(data) {
  return request({
    url: '/safework/emergencyplan',
    method: 'put',
    data: data
  })
}

// 删除应急预案
export function delEmergencyplan(id) {
  return request({
    url: '/safework/emergencyplan/' + id,
    method: 'delete'
  })
}
