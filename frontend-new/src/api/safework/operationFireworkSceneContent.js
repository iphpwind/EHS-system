import request from '@/utils/request'

// 查询动火作业票现场确认内容详情列表
export function listOperationFireworkSceneContent(query) {
  return request({
    url: '/safework/operationFireworkSceneContent/list',
    method: 'get',
    params: query
  })
}

// 查询动火作业票现场确认内容详情详细
export function getOperationFireworkSceneContent(id) {
  return request({
    url: '/safework/operationFireworkSceneContent/' + id,
    method: 'get'
  })
}

// 新增动火作业票现场确认内容详情
export function addOperationFireworkSceneContent(data) {
  return request({
    url: '/safework/operationFireworkSceneContent',
    method: 'post',
    data: data
  })
}

// 修改动火作业票现场确认内容详情
export function updateOperationFireworkSceneContent(data) {
  return request({
    url: '/safework/operationFireworkSceneContent',
    method: 'put',
    data: data
  })
}

// 删除动火作业票现场确认内容详情
export function delOperationFireworkSceneContent(id) {
  return request({
    url: '/safework/operationFireworkSceneContent/' + id,
    method: 'delete'
  })
}
