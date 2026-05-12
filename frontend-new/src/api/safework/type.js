import request from '@/utils/request'

// 查询风险分析对象类型字典列表
export function listType(query) {
  return request({
    url: '/safework/type/list',
    method: 'get',
    params: query
  })
}

// 查询风险分析对象类型字典详细
export function getType(id) {
  return request({
    url: '/safework/type/' + id,
    method: 'get'
  })
}

// 新增风险分析对象类型字典
export function addType(data) {
  return request({
    url: '/safework/type',
    method: 'post',
    data: data
  })
}

// 修改风险分析对象类型字典
export function updateType(data) {
  return request({
    url: '/safework/type',
    method: 'put',
    data: data
  })
}

// 删除风险分析对象类型字典
export function delType(id) {
  return request({
    url: '/safework/type/' + id,
    method: 'delete'
  })
}
