import request from '@/utils/request'

// 查询隐患上报列表
export function listHazareport(query) {
  return request({
    url: '/safework/hazareport/list',
    method: 'get',
    params: query
  })
}

// 查询隐患上报详细
export function getHazareport(id) {
  return request({
    url: '/safework/hazareport/' + id,
    method: 'get'
  })
}

// 新增隐患上报
export function addHazareport(data) {
  return request({
    url: '/safework/hazareport',
    method: 'post',
    data: data
  })
}

// 修改隐患上报
export function updateHazareport(data) {
  return request({
    url: '/safework/hazareport',
    method: 'put',
    data: data
  })
}

// 删除隐患上报
export function delHazareport(id) {
  return request({
    url: '/safework/hazareport/' + id,
    method: 'delete'
  })
}
