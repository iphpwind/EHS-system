import request from '@/utils/request'

// 查询监控设备管理列表
export function listMonitoreq(query) {
  return request({
    url: '/safework/monitoreq/list',
    method: 'get',
    params: query
  })
}

// 查询监控设备管理详细
export function getMonitoreq(id) {
  return request({
    url: '/safework/monitoreq/' + id,
    method: 'get'
  })
}

// 新增监控设备管理
export function addMonitoreq(data) {
  return request({
    url: '/safework/monitoreq',
    method: 'post',
    data: data
  })
}

// 修改监控设备管理
export function updateMonitoreq(data) {
  return request({
    url: '/safework/monitoreq',
    method: 'put',
    data: data
  })
}

// 删除监控设备管理
export function delMonitoreq(id) {
  return request({
    url: '/safework/monitoreq/' + id,
    method: 'delete'
  })
}
