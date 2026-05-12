import request from '@/utils/request'

// 查询断路作业列表
export function listBrokenInfo(query) {
  return request({
    url: '/safework/brokenInfo/list',
    method: 'get',
    params: query
  })
}

// 查询断路作业详细
export function getBrokenInfo(id) {
  return request({
    url: '/safework/brokenInfo/' + id,
    method: 'get'
  })
}

// 新增断路作业
export function addBrokenInfo(data) {
  return request({
    url: '/safework/brokenInfo',
    method: 'post',
    data: data
  })
}

// 修改断路作业
export function updateBrokenInfo(data) {
  return request({
    url: '/safework/brokenInfo',
    method: 'put',
    data: data
  })
}

// 作废断路作业
export function updateStatus(data) {
  return request({
    url: '/safework/brokenInfo/updateStatus',
    method: 'put',
    data: data
  })
}

// 删除断路作业
export function delBrokenInfo(id) {
  return request({
    url: '/safework/brokenInfo/' + id,
    method: 'delete'
  })
}
