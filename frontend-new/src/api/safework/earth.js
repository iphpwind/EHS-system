import request from '@/utils/request'

// 查询动土作业列表
export function listEarth(query) {
  return request({
    url: '/safework/earth/list',
    method: 'get',
    params: query
  })
}

// 查询动土作业详细
export function getEarth(id) {
  return request({
    url: '/safework/earth/' + id,
    method: 'get'
  })
}

// 新增动土作业
export function addEarth(data) {
  return request({
    url: '/safework/earth',
    method: 'post',
    data: data
  })
}

// 修改动土作业
export function updateEarth(data) {
  return request({
    url: '/safework/earth',
    method: 'put',
    data: data
  })
}

// 作废动土作业
export function updateStatus(data) {
  return request({
    url: '/safework/earth/updateStatus',
    method: 'put',
    data: data
  })
}

// 删除动土作业
export function delEarth(id) {
  return request({
    url: '/safework/earth/' + id,
    method: 'delete'
  })
}
