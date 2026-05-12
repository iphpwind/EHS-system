import request from '@/utils/request'

// 查询生产原料管理列表
export function listChemicalProductionMaterial(query) {
  return request({
    url: '/safework/chemicalProductionMaterial/list',
    method: 'get',
    params: query
  })
}

// 查询生产原料管理详细
export function getChemicalProductionMaterial(id) {
  return request({
    url: '/safework/chemicalProductionMaterial/' + id,
    method: 'get'
  })
}

// 新增生产原料管理
export function addChemicalProductionMaterial(data) {
  return request({
    url: '/safework/chemicalProductionMaterial',
    method: 'post',
    data: data
  })
}

// 修改生产原料管理
export function updateChemicalProductionMaterial(data) {
  return request({
    url: '/safework/chemicalProductionMaterial',
    method: 'put',
    data: data
  })
}

// 删除生产原料管理
export function delChemicalProductionMaterial(id) {
  return request({
    url: '/safework/chemicalProductionMaterial/' + id,
    method: 'delete'
  })
}
