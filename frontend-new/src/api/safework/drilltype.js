import request from '@/utils/request'

// 查询应急演练-演练类型字典列表
export function listType(query) {
  return request({
    url: '/safework/drillType/list',
    method: 'get',
    params: query
  })
}

// 查询应急演练-演练类型字典详细
export function getType(id) {
  return request({
    url: '/safework/drillType/' + id,
    method: 'get'
  })
}

// 新增应急演练-演练类型字典
export function addType(data) {
  return request({
    url: '/safework/drillType',
    method: 'post',
    data: data
  })
}

// 修改应急演练-演练类型字典
export function updateType(data) {
  return request({
    url: '/safework/drillType',
    method: 'put',
    data: data
  })
}

// 删除应急演练-演练类型字典
export function delType(id) {
  return request({
    url: '/safework/drillType/' + id,
    method: 'delete'
  })
}
