import request from '@/utils/request'

// 查询电力尖峰平谷时间段列表
export function listTime(query) {
  return request({
    url: '/energy/time/list',
    method: 'get',
    params: query
  })
}

export function tableTime(query) {
  return request({
    url: '/energy/time/table',
    method: 'get',
    params: query
  })
}

// 查询电力尖峰平谷时间段详细
export function getTime(id) {
  return request({
    url: '/energy/time/' + id,
    method: 'get'
  })
}

// 新增电力尖峰平谷时间段
export function addTime(data) {
  return request({
    url: '/energy/time',
    method: 'post',
    data: data
  })
}

// 批量新增电力尖峰平谷时间段
export function batchinsert(data) {
  return request({
    url: '/energy/time/batchinsert',
    method: 'post',
    data: data
  })
}
export function batchinsertList(data) {
  return request({
    url: '/energy/time/batchinsertList',
    method: 'post',
    data: data
  })
}

// 修改电力尖峰平谷时间段
export function updateTime(data) {
  return request({
    url: '/energy/time',
    method: 'put',
    data: data
  })
}

// 删除电力尖峰平谷时间段
export function delTime(id) {
  return request({
    url: '/energy/time/' + id,
    method: 'delete'
  })
}
