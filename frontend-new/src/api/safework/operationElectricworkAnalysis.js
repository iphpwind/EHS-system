import request from '@/utils/request'

// 查询临时用电票分析化验列表
export function listOperationElectricworkAnalysis(query) {
  return request({
    url: '/safework/operationElectricworkAnalysis/list',
    method: 'get',
    params: query
  })
}

// 查询临时用电票分析化验详细
export function getOperationElectricworkAnalysis(id) {
  return request({
    url: '/safework/operationElectricworkAnalysis/' + id,
    method: 'get'
  })
}

// 新增临时用电票分析化验
export function addOperationElectricworkAnalysis(data) {
  return request({
    url: '/safework/operationElectricworkAnalysis',
    method: 'post',
    data: data
  })
}

// 修改临时用电票分析化验
export function updateOperationElectricworkAnalysis(data) {
  return request({
    url: '/safework/operationElectricworkAnalysis',
    method: 'put',
    data: data
  })
}

// 删除临时用电票分析化验
export function delOperationElectricworkAnalysis(id) {
  return request({
    url: '/safework/operationElectricworkAnalysis/' + id,
    method: 'delete'
  })
}
