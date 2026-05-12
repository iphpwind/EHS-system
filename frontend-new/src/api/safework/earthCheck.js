import request from '@/utils/request'

// 查询动土作业验收列表
export function listEarthCheck(query) {
  return request({
    url: '/safework/earthCheck/list',
    method: 'get',
    params: query
  })
}

// 查询动土作业验收详细
export function getEarthCheck(id) {
  return request({
    url: '/safework/earthCheck/' + id,
    method: 'get'
  })
}

// 新增动土作业验收
export function addEarthCheck(data) {
  return request({
    url: '/safework/earthCheck',
    method: 'post',
    data: data
  })
}

// 修改动土作业验收
export function updateEarthCheck(data) {
  return request({
    url: '/safework/earthCheck',
    method: 'put',
    data: data
  })
}

// 删除动土作业验收
export function delEarthCheck(id) {
  return request({
    url: '/safework/earthCheck/' + id,
    method: 'delete'
  })
}
