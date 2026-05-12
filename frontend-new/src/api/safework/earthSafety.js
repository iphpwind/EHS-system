import request from '@/utils/request'

// 查询动土作业票安全交底列表
export function listEarthSafety(query) {
  return request({
    url: '/safework/earthSafety/list',
    method: 'get',
    params: query
  })
}

// 查询动土作业票安全交底详细
export function getEarthSafety(id) {
  return request({
    url: '/safework/earthSafety/' + id,
    method: 'get'
  })
}

// 新增动土作业票安全交底
export function addEarthSafety(data) {
  return request({
    url: '/safework/earthSafety',
    method: 'post',
    data: data
  })
}

// 修改动土作业票安全交底
export function updateEarthSafety(data) {
  return request({
    url: '/safework/earthSafety',
    method: 'put',
    data: data
  })
}

// 删除动土作业票安全交底
export function delEarthSafety(id) {
  return request({
    url: '/safework/earthSafety/' + id,
    method: 'delete'
  })
}
