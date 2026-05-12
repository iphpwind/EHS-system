import request from '@/utils/request'

// 查询临时用电票现场确认部门人员列表
export function listOperationElectricworkSceneUser(query) {
  return request({
    url: '/safework/operationElectricworkSceneUser/list',
    method: 'get',
    params: query
  })
}

// 查询临时用电票现场确认部门人员详细
export function getOperationElectricworkSceneUser(id) {
  return request({
    url: '/safework/operationElectricworkSceneUser/' + id,
    method: 'get'
  })
}

// 新增临时用电票现场确认部门人员
export function addOperationElectricworkSceneUser(data) {
  return request({
    url: '/safework/operationElectricworkSceneUser',
    method: 'post',
    data: data
  })
}

// 修改临时用电票现场确认部门人员
export function updateOperationElectricworkSceneUser(data) {
  return request({
    url: '/safework/operationElectricworkSceneUser',
    method: 'put',
    data: data
  })
}

// 删除临时用电票现场确认部门人员
export function delOperationElectricworkSceneUser(id) {
  return request({
    url: '/safework/operationElectricworkSceneUser/' + id,
    method: 'delete'
  })
}
