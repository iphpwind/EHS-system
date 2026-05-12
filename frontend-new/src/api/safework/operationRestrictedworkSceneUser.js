import request from '@/utils/request'

// 查询受限空间票现场确认部门人员列表
export function listOperationRestrictedworkSceneUser(query) {
  return request({
    url: '/safework/operationRestrictedworkSceneUser/list',
    method: 'get',
    params: query
  })
}

// 查询受限空间票现场确认部门人员详细
export function getOperationRestrictedworkSceneUser(id) {
  return request({
    url: '/safework/operationRestrictedworkSceneUser/' + id,
    method: 'get'
  })
}

// 新增受限空间票现场确认部门人员
export function addOperationRestrictedworkSceneUser(data) {
  return request({
    url: '/safework/operationRestrictedworkSceneUser',
    method: 'post',
    data: data
  })
}

// 修改受限空间票现场确认部门人员
export function updateOperationRestrictedworkSceneUser(data) {
  return request({
    url: '/safework/operationRestrictedworkSceneUser',
    method: 'put',
    data: data
  })
}

// 删除受限空间票现场确认部门人员
export function delOperationRestrictedworkSceneUser(id) {
  return request({
    url: '/safework/operationRestrictedworkSceneUser/' + id,
    method: 'delete'
  })
}
