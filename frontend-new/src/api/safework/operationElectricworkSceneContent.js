import request from '@/utils/request'

// 查询临时用电票现场确认内容详情列表
export function listOperationElectricworkSceneContent(query) {
  return request({
    url: '/safework/operationElectricworkSceneContent/list',
    method: 'get',
    params: query
  })
}

// 查询临时用电票现场确认内容详情详细
export function getOperationElectricworkSceneContent(id) {
  return request({
    url: '/safework/operationElectricworkSceneContent/' + id,
    method: 'get'
  })
}

// 新增临时用电票现场确认内容详情
export function addOperationElectricworkSceneContent(data) {
  return request({
    url: '/safework/operationElectricworkSceneContent',
    method: 'post',
    data: data
  })
}

// 修改临时用电票现场确认内容详情
export function updateOperationElectricworkSceneContent(data) {
  return request({
    url: '/safework/operationElectricworkSceneContent',
    method: 'put',
    data: data
  })
}

// 删除临时用电票现场确认内容详情
export function delOperationElectricworkSceneContent(id) {
  return request({
    url: '/safework/operationElectricworkSceneContent/' + id,
    method: 'delete'
  })
}
