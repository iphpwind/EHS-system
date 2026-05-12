import request from '@/utils/request'

// 查询吊装作业票现场确认内容详情列表
export function listOperationHoistingworkSceneContent(query) {
  return request({
    url: '/safework/operationHoistingworkSceneContent/list',
    method: 'get',
    params: query
  })
}

// 查询吊装作业票现场确认内容详情详细
export function getOperationHoistingworkSceneContent(id) {
  return request({
    url: '/safework/operationHoistingworkSceneContent/' + id,
    method: 'get'
  })
}

// 新增吊装作业票现场确认内容详情
export function addOperationHoistingworkSceneContent(data) {
  return request({
    url: '/safework/operationHoistingworkSceneContent',
    method: 'post',
    data: data
  })
}

// 修改吊装作业票现场确认内容详情
export function updateOperationHoistingworkSceneContent(data) {
  return request({
    url: '/safework/operationHoistingworkSceneContent',
    method: 'put',
    data: data
  })
}

// 删除吊装作业票现场确认内容详情
export function delOperationHoistingworkSceneContent(id) {
  return request({
    url: '/safework/operationHoistingworkSceneContent/' + id,
    method: 'delete'
  })
}
