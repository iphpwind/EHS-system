import request from '@/utils/request'

// 查询线上教育-所属分类字典列表
export function listClassification(query) {
  return request({
    url: '/safework/classification/list',
    method: 'get',
    params: query
  })
}

// 查询线上教育-所属分类字典详细
export function getClassification(id) {
  return request({
    url: '/safework/classification/' + id,
    method: 'get'
  })
}

// 新增线上教育-所属分类字典
export function addClassification(data) {
  return request({
    url: '/safework/classification',
    method: 'post',
    data: data
  })
}

// 修改线上教育-所属分类字典
export function updateClassification(data) {
  return request({
    url: '/safework/classification',
    method: 'put',
    data: data
  })
}

// 删除线上教育-所属分类字典
export function delClassification(id) {
  return request({
    url: '/safework/classification/' + id,
    method: 'delete'
  })
}
