import request from '@/utils/request'

// 查询确认审核验收属性信息列表
export function listAttrinfo(query) {
  return request({
    url: '/safework/attrinfo/list',
    method: 'get',
    params: query
  })
}

// 查询确认审核验收属性信息详细
export function getAttrinfo(id) {
  return request({
    url: '/safework/attrinfo/' + id,
    method: 'get'
  })
}

// 新增确认审核验收属性信息
export function addAttrinfo(data) {
  return request({
    url: '/safework/attrinfo',
    method: 'post',
    data: data
  })
}

// 修改确认审核验收属性信息
export function updateAttrinfo(data) {
  return request({
    url: '/safework/attrinfo',
    method: 'put',
    data: data
  })
}

// 删除确认审核验收属性信息
export function delAttrinfo(id) {
  return request({
    url: '/safework/attrinfo/' + id,
    method: 'delete'
  })
}
