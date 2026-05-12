import request from '@/utils/request'

// 查询动火作业票现场确认部门人员列表
export function listOperationFireworkSceneUser(query) {
  return request({
    url: '/safework/operationFireworkSceneUser/list',
    method: 'get',
    params: query
  })
}

// 查询动火作业票现场确认部门人员详细
export function getOperationFireworkSceneUser(id) {
  return request({
    url: '/safework/operationFireworkSceneUser/' + id,
    method: 'get'
  })
}

// 新增动火作业票现场确认部门人员
export function addOperationFireworkSceneUser(data) {
  return request({
    url: '/safework/operationFireworkSceneUser',
    method: 'post',
    data: data
  })
}

// 修改动火作业票现场确认部门人员
export function updateOperationFireworkSceneUser(data) {
  return request({
    url: '/safework/operationFireworkSceneUser',
    method: 'put',
    data: data
  })
}

// 删除动火作业票现场确认部门人员
export function delOperationFireworkSceneUser(id) {
  return request({
    url: '/safework/operationFireworkSceneUser/' + id,
    method: 'delete'
  })
}
