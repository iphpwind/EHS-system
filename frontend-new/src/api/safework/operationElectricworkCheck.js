import request from '@/utils/request'

// 查询临时用电票作业验收列表
export function listOperationElectricworkCheck(query) {
  return request({
    url: '/safework/operationElectricworkCheck/list',
    method: 'get',
    params: query
  })
}

// 查询临时用电票作业验收详细
export function getOperationElectricworkCheck(id) {
  return request({
    url: '/safework/operationElectricworkCheck/' + id,
    method: 'get'
  })
}

// 新增临时用电票作业验收
export function addOperationElectricworkCheck(data) {
  return request({
    url: '/safework/operationElectricworkCheck',
    method: 'post',
    data: data
  })
}

// 修改临时用电票作业验收
export function updateOperationElectricworkCheck(data) {
  return request({
    url: '/safework/operationElectricworkCheck',
    method: 'put',
    data: data
  })
}

// 删除临时用电票作业验收
export function delOperationElectricworkCheck(id) {
  return request({
    url: '/safework/operationElectricworkCheck/' + id,
    method: 'delete'
  })
}
