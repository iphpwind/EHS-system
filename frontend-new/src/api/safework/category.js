import request from '@/utils/request'

// 查询教育培训所属分类字典列表
export function listCategory(query) {
  return request({
    url: '/safework/category/list',
    method: 'get',
    params: query
  })
}

// 查询教育培训所属分类字典详细
export function getCategory(id) {
  return request({
    url: '/safework/category/' + id,
    method: 'get'
  })
}

// 新增教育培训所属分类字典
export function addCategory(data) {
  return request({
    url: '/safework/category',
    method: 'post',
    data: data
  })
}

// 修改教育培训所属分类字典
export function updateCategory(data) {
  return request({
    url: '/safework/category',
    method: 'put',
    data: data
  })
}

// 删除教育培训所属分类字典
export function delCategory(id) {
  return request({
    url: '/safework/category/' + id,
    method: 'delete'
  })
}
