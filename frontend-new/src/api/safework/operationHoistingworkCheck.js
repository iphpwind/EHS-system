import request from '@/utils/request'

// 查询吊装作业票作业验收列表
export function listOperationHoistingworkCheck(query) {
  return request({
    url: '/safework/operationHoistingworkCheck/list',
    method: 'get',
    params: query
  })
}

// 查询吊装作业票作业验收详细
export function getOperationHoistingworkCheck(id) {
  return request({
    url: '/safework/operationHoistingworkCheck/' + id,
    method: 'get'
  })
}

// 新增吊装作业票作业验收
export function addOperationHoistingworkCheck(data) {
  return request({
    url: '/safework/operationHoistingworkCheck',
    method: 'post',
    data: data
  })
}

// 修改吊装作业票作业验收
export function updateOperationHoistingworkCheck(data) {
  return request({
    url: '/safework/operationHoistingworkCheck',
    method: 'put',
    data: data
  })
}

// 删除吊装作业票作业验收
export function delOperationHoistingworkCheck(id) {
  return request({
    url: '/safework/operationHoistingworkCheck/' + id,
    method: 'delete'
  })
}
