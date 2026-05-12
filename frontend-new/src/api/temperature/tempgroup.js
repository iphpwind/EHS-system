import request from '@/utils/request'

// 查询测温分组列表
export function listTempgroup(query) {
  return request({
    url: '/temperature/tempgroup/list',
    method: 'get',
    params: query
  })
}

// 查询测温分组详细
export function getTempgroup(id) {
  return request({
    url: '/temperature/tempgroup/' + id,
    method: 'get'
  })
}

// 新增测温分组
export function addTempgroup(data) {
  return request({
    url: '/temperature/tempgroup',
    method: 'post',
    data: data
  })
}

// 修改测温分组
export function updateTempgroup(data) {
  return request({
    url: '/temperature/tempgroup',
    method: 'put',
    data: data
  })
}

// 删除测温分组
export function delTempgroup(id) {
  return request({
    url: '/temperature/tempgroup/' + id,
    method: 'delete'
  })
}
