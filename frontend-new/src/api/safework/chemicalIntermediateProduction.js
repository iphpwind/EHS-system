import request from '@/utils/request'

// 查询中间产品管理列表
export function listChemicalIntermediateProduction(query) {
  return request({
    url: '/safework/chemicalIntermediateProduction/list',
    method: 'get',
    params: query
  })
}

// 查询中间产品管理详细
export function getChemicalIntermediateProduction(id) {
  return request({
    url: '/safework/chemicalIntermediateProduction/' + id,
    method: 'get'
  })
}

// 新增中间产品管理
export function addChemicalIntermediateProduction(data) {
  return request({
    url: '/safework/chemicalIntermediateProduction',
    method: 'post',
    data: data
  })
}

// 修改中间产品管理
export function updateChemicalIntermediateProduction(data) {
  return request({
    url: '/safework/chemicalIntermediateProduction',
    method: 'put',
    data: data
  })
}

// 删除中间产品管理
export function delChemicalIntermediateProduction(id) {
  return request({
    url: '/safework/chemicalIntermediateProduction/' + id,
    method: 'delete'
  })
}
