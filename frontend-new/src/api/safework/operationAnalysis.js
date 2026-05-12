import request from '@/utils/request'

// 查询安全作业票分析化验项目列表
export function listOperationAnalysis(query) {
  return request({
    url: '/safework/operationAnalysis/list',
    method: 'get',
    params: query
  })
}

// 查询安全作业票分析化验项目详细
export function getOperationAnalysis(id) {
  return request({
    url: '/safework/operationAnalysis/' + id,
    method: 'get'
  })
}

// 新增安全作业票分析化验项目
export function addOperationAnalysis(data) {
  return request({
    url: '/safework/operationAnalysis',
    method: 'post',
    data: data
  })
}

// 修改安全作业票分析化验项目
export function updateOperationAnalysis(data) {
  return request({
    url: '/safework/operationAnalysis',
    method: 'put',
    data: data
  })
}

// 删除安全作业票分析化验项目
export function delOperationAnalysis(id) {
  return request({
    url: '/safework/operationAnalysis/' + id,
    method: 'delete'
  })
}
