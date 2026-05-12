import request from '@/utils/request'

// 查询作业证模板列表
export function listOperationTemplate(query) {
  return request({
    url: '/safework/operationTemplate/list',
    method: 'get',
    params: query
  })
}

// 查询作业证模板详细
export function getOperationTemplate(id) {
  return request({
    url: '/safework/operationTemplate/' + id,
    method: 'get'
  })
}

// 新增作业证模板
export function addOperationTemplate(data) {
  return request({
    url: '/safework/operationTemplate',
    method: 'post',
    data: data
  })
}

// 修改作业证模板
export function updateOperationTemplate(data) {
  return request({
    url: '/safework/operationTemplate',
    method: 'put',
    data: data
  })
}

// 删除作业证模板
export function delOperationTemplate(id) {
  return request({
    url: '/safework/operationTemplate/' + id,
    method: 'delete'
  })
}

// 配置作业证模板
export function configureOperationTemplate(data) {
  return request({
    url: '/safework/operationTemplate/configure',
    method: 'post',
    data: data
  })
}
