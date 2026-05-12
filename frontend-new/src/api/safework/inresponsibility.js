import request from '@/utils/request'

// 查询包保责任制列表
export function listInresponsibility(query) {
  return request({
    url: '/safework/inresponsibility/list',
    method: 'get',
    params: query
  })
}

// 查询包保责任制详细
export function getInresponsibility(id) {
  return request({
    url: '/safework/inresponsibility/' + id,
    method: 'get'
  })
}

// 新增包保责任制
export function addInresponsibility(data) {
  return request({
    url: '/safework/inresponsibility',
    method: 'post',
    data: data
  })
}

// 修改包保责任制
export function updateInresponsibility(data) {
  return request({
    url: '/safework/inresponsibility',
    method: 'put',
    data: data
  })
}

// 删除包保责任制
export function delInresponsibility(id) {
  return request({
    url: '/safework/inresponsibility/' + id,
    method: 'delete'
  })
}
