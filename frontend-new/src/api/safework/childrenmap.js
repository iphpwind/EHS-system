import request from '@/utils/request'

// 查询分层模型列表
export function listChildrenMap(query) {
  return request({
    url: '/positioning/ChildrenMap/list',
    method: 'get',
    params: query
  })
}

// 查询分层模型详细
export function getChildrenMap(id) {
  return request({
    url: '/positioning/ChildrenMap/' + id,
    method: 'get'
  })
}

// 新增分层模型
export function addChildrenMap(data) {
  return request({
    url: '/positioning/ChildrenMap',
    method: 'post',
    data: data
  })
}

// 修改分层模型
export function updateChildrenMap(data) {
  return request({
    url: '/positioning/ChildrenMap',
    method: 'put',
    data: data
  })
}

// 删除分层模型
export function delChildrenMap(id) {
  return request({
    url: '/positioning/ChildrenMap/' + id,
    method: 'delete'
  })
}
