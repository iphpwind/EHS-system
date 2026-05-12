import request from '@/utils/request'

// 查询承包商类型字典列表
export function listContractorTypeDic(query) {
  return request({
    url: '/safework/contractorTypeDic/list',
    method: 'get',
    params: query
  })
}

// 查询承包商类型字典详细
export function getContractorTypeDic(id) {
  return request({
    url: '/safework/contractorTypeDic/' + id,
    method: 'get'
  })
}

// 新增承包商类型字典
export function addContractorTypeDic(data) {
  return request({
    url: '/safework/contractorTypeDic',
    method: 'post',
    data: data
  })
}

// 修改承包商类型字典
export function updateContractorTypeDic(data) {
  return request({
    url: '/safework/contractorTypeDic',
    method: 'put',
    data: data
  })
}

// 删除承包商类型字典
export function delContractorTypeDic(id) {
  return request({
    url: '/safework/contractorTypeDic/' + id,
    method: 'delete'
  })
}
