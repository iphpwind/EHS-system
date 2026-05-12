import request from '@/utils/request'

// 查询真源报警信息列表
export function listAlarm(query) {
  return request({
    url: '/positioning/alarm/list',
    method: 'get',
    params: query
  })
}

// 查询真源报警信息详细
export function getAlarm(id) {
  return request({
    url: '/positioning/alarm/' + id,
    method: 'get'
  })
}

export function handler(data) {
  return request({
    url: '/positioning/alarm/handler',
    method: 'get',
    params: data
  })
}

// 新增真源报警信息
export function addAlarm(data) {
  return request({
    url: '/positioning/alarm',
    method: 'post',
    data: data
  })
}

// 修改真源报警信息
export function updateAlarm(data) {
  return request({
    url: '/positioning/alarm',
    method: 'put',
    data: data
  })
}

// 删除真源报警信息
export function delAlarm(id) {
  return request({
    url: '/positioning/alarm/' + id,
    method: 'delete'
  })
}
// 批量处理报警信息
export function handlers(data) {
  return request({
    url: '/positioning/alarm/handlers/',
    method: 'post',
    data: data
  })
}

export function currentAlarm() {
  return request({
    url: '/positioning/alarm/currentAlarm',
    method: 'get'
  })
}

export function alarmHistory30() {
  return request({
    url: '/positioning/alarm/alarmHistory30',
    method: 'get'
  })
}

export function alarmHistory7() {
  return request({
    url: '/positioning/alarm/alarmHistory7',
    method: 'get'
  })
}

export function alarmTrend30() {
  return request({
    url: '/positioning/alarm/alarmTrend30',
    method: 'get'
  })
}

export function alarmTrend7() {
  return request({
    url: '/positioning/alarm/alarmTrend7',
    method: 'get'
  })
}
