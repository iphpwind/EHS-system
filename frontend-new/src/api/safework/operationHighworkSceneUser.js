import request from '@/utils/request'

// 查询高处作业票现场确认部门人员列表
export function listOperationHighworkSceneUser(query) {
  return request({
    url: '/safework/operationHighworkSceneUser/list',
    method: 'get',
    params: query
  })
}

// 查询高处作业票现场确认部门人员详细
export function getOperationHighworkSceneUser(id) {
  return request({
    url: '/safework/operationHighworkSceneUser/' + id,
    method: 'get'
  })
}

// 新增高处作业票现场确认部门人员
export function addOperationHighworkSceneUser(data) {
  return request({
    url: '/safework/operationHighworkSceneUser',
    method: 'post',
    data: data
  })
}

// 修改高处作业票现场确认部门人员
export function updateOperationHighworkSceneUser(data) {
  return request({
    url: '/safework/operationHighworkSceneUser',
    method: 'put',
    data: data
  })
}

// 删除高处作业票现场确认部门人员
export function delOperationHighworkSceneUser(id) {
  return request({
    url: '/safework/operationHighworkSceneUser/' + id,
    method: 'delete'
  })
}
