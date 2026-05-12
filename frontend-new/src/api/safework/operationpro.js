import request from '@/utils/request'

// 查询作业方案列表
export function listOperationpro(query) {
  return request({
    url: '/safework/operationpro/list',
    method: 'get',
    params: query
  })
}

// 查询作业方案详细
export function getOperationpro(id) {
  return request({
    url: '/safework/operationpro/' + id,
    method: 'get'
  })
}

// 新增作业方案
export function addOperationpro(data) {
  return request({
    url: '/safework/operationpro',
    method: 'post',
    data: data
  })
}

// 修改作业方案
export function updateOperationpro(data) {
  return request({
    url: '/safework/operationpro',
    method: 'put',
    data: data
  })
}

// 删除作业方案
export function delOperationpro(id) {
  return request({
    url: '/safework/operationpro/' + id,
    method: 'delete'
  })
}
