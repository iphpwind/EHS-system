import request from '@/utils/request'

// 查询吊装作业票现场确认部门人员列表
export function listOperationHoistingworkSceneUser(query) {
  return request({
    url: '/safework/operationHoistingworkSceneUser/list',
    method: 'get',
    params: query
  })
}

// 查询吊装作业票现场确认部门人员详细
export function getOperationHoistingworkSceneUser(id) {
  return request({
    url: '/safework/operationHoistingworkSceneUser/' + id,
    method: 'get'
  })
}

// 新增吊装作业票现场确认部门人员
export function addOperationHoistingworkSceneUser(data) {
  return request({
    url: '/safework/operationHoistingworkSceneUser',
    method: 'post',
    data: data
  })
}

// 修改吊装作业票现场确认部门人员
export function updateOperationHoistingworkSceneUser(data) {
  return request({
    url: '/safework/operationHoistingworkSceneUser',
    method: 'put',
    data: data
  })
}

// 删除吊装作业票现场确认部门人员
export function delOperationHoistingworkSceneUser(id) {
  return request({
    url: '/safework/operationHoistingworkSceneUser/' + id,
    method: 'delete'
  })
}
