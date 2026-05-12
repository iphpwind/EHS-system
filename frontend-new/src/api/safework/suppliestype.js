import request from '@/utils/request'

// 查询应急物资-物资分类字典列表
export function listType(query) {
  return request({
    url: '/safework/suppliesType/list',
    method: 'get',
    params: query
  })
}

// 查询应急物资-物资分类字典详细
export function getType(id) {

  return request({
    url: '/safework/suppliesType/' + id,
    method: 'get'
  })
}

// 新增应急物资-物资分类字典
export function addType(data) {
  return request({
    url: '/safework/suppliesType',
    method: 'post',
    data: data
  })
}
// 修改应急物资-物资分类字典
export function updateType(data) {
  return request({
    url: '/safework/suppliesType',
    method: 'put',
    data: data
  })
}

// 删除应急物资-物资分类字典
export function delType(id) {
  return request({
    url: '/safework/suppliesType/' + id,
    method: 'delete'
  })
}