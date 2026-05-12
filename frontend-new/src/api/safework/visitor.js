import request from '@/utils/request'

// 查询访客信息列表
export function listVisitor(query) {
  return request({
    url: '/safework/visitor/list',
    method: 'get',
    params: query
  })
}
export function getVisitorList(query) {
  return request({
    url: '/safework/visitor/visitorlist',
    method: 'get',
    params: query
  })
}

// 查询访客信息详细
export function getVisitor(id) {
  return request({
    url: '/safework/visitor/' + id,
    method: 'get'
  })
}

// 新增访客信息
export function addVisitor(data) {
  return request({
    url: '/safework/visitor',
    method: 'post',
    data: data
  })
}

// 修改访客信息
export function updateVisitor(data) {
  return request({
    url: '/safework/visitor',
    method: 'put',
    data: data
  })
}

// 删除访客信息
export function delVisitor(id) {
  return request({
    url: '/safework/visitor/' + id,
    method: 'delete'
  })
}
