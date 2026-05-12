import request from '@/utils/request'

// 查询高处作业票作业验收列表
export function listOperationHighworkCheck(query) {
  return request({
    url: '/safework/operationHighworkCheck/list',
    method: 'get',
    params: query
  })
}

// 查询高处作业票作业验收详细
export function getOperationHighworkCheck(id) {
  return request({
    url: '/safework/operationHighworkCheck/' + id,
    method: 'get'
  })
}

// 新增高处作业票作业验收
export function addOperationHighworkCheck(data) {
  return request({
    url: '/safework/operationHighworkCheck',
    method: 'post',
    data: data
  })
}

// 修改高处作业票作业验收
export function updateOperationHighworkCheck(data) {
  return request({
    url: '/safework/operationHighworkCheck',
    method: 'put',
    data: data
  })
}

// 删除高处作业票作业验收
export function delOperationHighworkCheck(id) {
  return request({
    url: '/safework/operationHighworkCheck/' + id,
    method: 'delete'
  })
}
