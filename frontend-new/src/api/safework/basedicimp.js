import request from '@/utils/request'

// 查询双重预防基础字典导入记录列表
export function listBasedicimp(query) {
  return request({
    url: '/safework/basedicimp/list',
    method: 'get',
    params: query
  })
}

// 查询双重预防基础字典导入记录详细
export function getBasedicimp(id) {
  return request({
    url: '/safework/basedicimp/' + id,
    method: 'get'
  })
}

// 新增双重预防基础字典导入记录
export function addBasedicimp(data) {
  return request({
    url: '/safework/basedicimp',
    method: 'post',
    data: data
  })
}

// 修改双重预防基础字典导入记录
export function updateBasedicimp(data) {
  return request({
    url: '/safework/basedicimp',
    method: 'put',
    data: data
  })
}

// 删除双重预防基础字典导入记录
export function delBasedicimp(id) {
  return request({
    url: '/safework/basedicimp/' + id,
    method: 'delete'
  })
}

// 批量导入双重预防字典表
export function importdic(data) {
  return request({
    url: '/safework/basedicimp/importdic',
    method: 'post',
    data: data
  })
}

// 批量导入特殊作业字典表
export function importdic1(data) {
  return request({
    url: '/safework/basedicimp/importdic1',
    method: 'post',
    data: data
  })
}
