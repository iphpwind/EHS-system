import request from '@/utils/request'

// 查询访客权限人员列表
export function listVisitorUser(query) {
  return request({
    url: '/safework/visitorUser/list',
    method: 'get',
    params: query
  })
}

// 查询访客权限人员详细
export function getVisitorUser(id) {
  return request({
    url: '/safework/visitorUser/' + id,
    method: 'get'
  })
}

// 新增访客权限人员
export function addVisitorUser(data) {
  return request({
    url: '/safework/visitorUser',
    method: 'post',
    data: data
  })
}

// 修改访客权限人员
export function updateVisitorUser(data) {
  return request({
    url: '/safework/visitorUser',
    method: 'put',
    data: data
  })
}

// 删除访客权限人员
export function delVisitorUser(id) {
  return request({
    url: '/safework/visitorUser/' + id,
    method: 'delete'
  })
}
