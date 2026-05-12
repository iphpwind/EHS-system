import request from '@/utils/request'

// 查询真源部门配置列表
export function listConfig(query) {
  return request({
    url: '/positioning/config/list',
    method: 'get',
    params: query
  })
}

// 查询真源部门配置详细
export function getConfig(id) {
  return request({
    url: '/positioning/config/' + id,
    method: 'get'
  })
}

// 新增真源部门配置
export function addConfig(data) {
  return request({
    url: '/positioning/config',
    method: 'post',
    data: data
  })
}

// 修改真源部门配置
export function updateConfig(data) {
  return request({
    url: '/positioning/config',
    method: 'put',
    data: data
  })
}

// 删除真源部门配置
export function delConfig(id) {
  return request({
    url: '/positioning/config/' + id,
    method: 'delete'
  })
}
