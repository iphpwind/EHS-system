import request from '@/utils/request'

// 查询最终产品管理列表
export function listChemicalFinalProduction(query) {
  return request({
    url: '/safework/chemicalFinalProduction/list',
    method: 'get',
    params: query
  })
}

// 查询最终产品管理详细
export function getChemicalFinalProduction(id) {
  return request({
    url: '/safework/chemicalFinalProduction/' + id,
    method: 'get'
  })
}

// 新增最终产品管理
export function addChemicalFinalProduction(data) {
  return request({
    url: '/safework/chemicalFinalProduction',
    method: 'post',
    data: data
  })
}

// 修改最终产品管理
export function updateChemicalFinalProduction(data) {
  return request({
    url: '/safework/chemicalFinalProduction',
    method: 'put',
    data: data
  })
}

// 删除最终产品管理
export function delChemicalFinalProduction(id) {
  return request({
    url: '/safework/chemicalFinalProduction/' + id,
    method: 'delete'
  })
}
