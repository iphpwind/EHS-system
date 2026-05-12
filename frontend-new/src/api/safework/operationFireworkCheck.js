import request from '@/utils/request'

// 查询动火作业票作业验收列表
export function listOperationFireworkCheck(query) {
  return request({
    url: '/safework/operationFireworkCheck/list',
    method: 'get',
    params: query
  })
}

// 查询动火作业票作业验收详细
export function getOperationFireworkCheck(id) {
  return request({
    url: '/safework/operationFireworkCheck/' + id,
    method: 'get'
  })
}

// 新增动火作业票作业验收
export function addOperationFireworkCheck(data) {
  return request({
    url: '/safework/operationFireworkCheck',
    method: 'post',
    data: data
  })
}

// 修改动火作业票作业验收
export function updateOperationFireworkCheck(data) {
  return request({
    url: '/safework/operationFireworkCheck',
    method: 'put',
    data: data
  })
}

// 删除动火作业票作业验收
export function delOperationFireworkCheck(id) {
  return request({
    url: '/safework/operationFireworkCheck/' + id,
    method: 'delete'
  })
}
