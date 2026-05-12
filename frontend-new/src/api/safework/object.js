import request from '@/utils/request'

// 查询风险分析对象列表
export function listObject(query) {
  return request({
    url: '/safework/object/list',
    method: 'get',
    params: query
  })
}
export function selectHuizong(query) {
  return request({
    url: '/safework/object/huizongList',
    method: 'get',
    params: query
  })
}

// 查询风险分析对象列表(不包含已经被包保责任制选择过得)
export function listObjectByInfo(query) {
  return request({
    url: '/safework/object/listObjectByInfo',
    method: 'get',
    params: query
  })
}

// 查询风险分析对象详细
export function getObject(id) {
  return request({
    url: '/safework/object/' + id,
    method: 'get'
  })
}

// 新增风险分析对象
export function addObject(data) {
  return request({
    url: '/safework/object',
    method: 'post',
    data: data
  })
}

// 修改风险分析对象
export function updateObject(data) {
  return request({
    url: '/safework/object',
    method: 'put',
    data: data
  })
}

// 删除风险分析对象
export function delObject(id) {
  return request({
    url: '/safework/object/' + id,
    method: 'delete'
  })
}
