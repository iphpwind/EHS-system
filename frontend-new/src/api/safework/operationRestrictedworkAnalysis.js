import request from '@/utils/request'

// 查询受限空间票分析化验列表
export function listOperationRestrictedworkAnalysis(query) {
  return request({
    url: '/safework/operationRestrictedworkAnalysis/list',
    method: 'get',
    params: query
  })
}

// 查询受限空间票分析化验详细
export function getOperationRestrictedworkAnalysis(id) {
  return request({
    url: '/safework/operationRestrictedworkAnalysis/' + id,
    method: 'get'
  })
}

// 新增受限空间票分析化验
export function addOperationRestrictedworkAnalysis(data) {
  return request({
    url: '/safework/operationRestrictedworkAnalysis',
    method: 'post',
    data: data
  })
}

// 修改受限空间票分析化验
export function updateOperationRestrictedworkAnalysis(data) {
  return request({
    url: '/safework/operationRestrictedworkAnalysis',
    method: 'put',
    data: data
  })
}

// 删除受限空间票分析化验
export function delOperationRestrictedworkAnalysis(id) {
  return request({
    url: '/safework/operationRestrictedworkAnalysis/' + id,
    method: 'delete'
  })
}
