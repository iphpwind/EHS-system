import request from '@/utils/request'

// 查询受限空间票现场确认内容详情列表
export function listOperationRestrictedworkSceneContent(query) {
  return request({
    url: '/safework/operationRestrictedworkSceneContent/list',
    method: 'get',
    params: query
  })
}

// 查询受限空间票现场确认内容详情详细
export function getOperationRestrictedworkSceneContent(id) {
  return request({
    url: '/safework/operationRestrictedworkSceneContent/' + id,
    method: 'get'
  })
}

// 新增受限空间票现场确认内容详情
export function addOperationRestrictedworkSceneContent(data) {
  return request({
    url: '/safework/operationRestrictedworkSceneContent',
    method: 'post',
    data: data
  })
}

// 修改受限空间票现场确认内容详情
export function updateOperationRestrictedworkSceneContent(data) {
  return request({
    url: '/safework/operationRestrictedworkSceneContent',
    method: 'put',
    data: data
  })
}

// 删除受限空间票现场确认内容详情
export function delOperationRestrictedworkSceneContent(id) {
  return request({
    url: '/safework/operationRestrictedworkSceneContent/' + id,
    method: 'delete'
  })
}
