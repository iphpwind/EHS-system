import request from '@/utils/request'

// 查询产量信息列表
export function listProduction(query) {
  return request({
    url: '/industry/production/list',
    method: 'get',
    params: query
  })
}

// 查询产量信息详细
export function getProduction(id) {
  return request({
    url: '/industry/production/' + id,
    method: 'get'
  })
}

// 新增产量信息
export function addProduction(data) {
  return request({
    url: '/industry/production',
    method: 'post',
    data: data
  })
}

// 修改产量信息
export function updateProduction(data) {
  return request({
    url: '/industry/production',
    method: 'put',
    data: data
  })
}

// 删除产量信息
export function delProduction(id) {
  return request({
    url: '/industry/production/' + id,
    method: 'delete'
  })
}
