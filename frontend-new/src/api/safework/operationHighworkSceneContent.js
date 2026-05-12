import request from '@/utils/request'

// 查询高处作业票现场确认内容详情列表
export function listOperationHighworkSceneContent(query) {
  return request({
    url: '/safework/operationHighworkSceneContent/list',
    method: 'get',
    params: query
  })
}

// 查询高处作业票现场确认内容详情详细
export function getOperationHighworkSceneContent(id) {
  return request({
    url: '/safework/operationHighworkSceneContent/' + id,
    method: 'get'
  })
}

// 新增高处作业票现场确认内容详情
export function addOperationHighworkSceneContent(data) {
  return request({
    url: '/safework/operationHighworkSceneContent',
    method: 'post',
    data: data
  })
}

// 修改高处作业票现场确认内容详情
export function updateOperationHighworkSceneContent(data) {
  return request({
    url: '/safework/operationHighworkSceneContent',
    method: 'put',
    data: data
  })
}

// 删除高处作业票现场确认内容详情
export function delOperationHighworkSceneContent(id) {
  return request({
    url: '/safework/operationHighworkSceneContent/' + id,
    method: 'delete'
  })
}
