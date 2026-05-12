import request from '@/utils/request'

// 查询特殊作业驳回/废弃记录列表
export function listRefuse(query) {
  return request({
    url: '/safework/refuse/list',
    method: 'get',
    params: query
  })
}

// 查询特殊作业驳回/废弃记录详细
export function getRefuse(id) {
  return request({
    url: '/safework/refuse/' + id,
    method: 'get'
  })
}

// 新增特殊作业驳回/废弃记录
export function addRefuse(data) {
  return request({
    url: '/safework/refuse',
    method: 'post',
    data: data
  })
}

// 修改特殊作业驳回/废弃记录
export function updateRefuse(data) {
  return request({
    url: '/safework/refuse',
    method: 'put',
    data: data
  })
}

// 删除特殊作业驳回/废弃记录
export function delRefuse(id) {
  return request({
    url: '/safework/refuse/' + id,
    method: 'delete'
  })
}
