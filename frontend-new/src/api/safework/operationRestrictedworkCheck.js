import request from '@/utils/request'

// 查询受限空间票作业验收列表
export function listOperationRestrictedworkCheck(query) {
  return request({
    url: '/safework/operationRestrictedworkCheck/list',
    method: 'get',
    params: query
  })
}

// 查询受限空间票作业验收详细
export function getOperationRestrictedworkCheck(id) {
  return request({
    url: '/safework/operationRestrictedworkCheck/' + id,
    method: 'get'
  })
}

// 新增受限空间票作业验收
export function addOperationRestrictedworkCheck(data) {
  return request({
    url: '/safework/operationRestrictedworkCheck',
    method: 'post',
    data: data
  })
}

// 修改受限空间票作业验收
export function updateOperationRestrictedworkCheck(data) {
  return request({
    url: '/safework/operationRestrictedworkCheck',
    method: 'put',
    data: data
  })
}

// 删除受限空间票作业验收
export function delOperationRestrictedworkCheck(id) {
  return request({
    url: '/safework/operationRestrictedworkCheck/' + id,
    method: 'delete'
  })
}
