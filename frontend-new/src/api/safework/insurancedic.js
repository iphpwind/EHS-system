import request from '@/utils/request'

// 查询包保责任制字典列表
export function listInsurancedic(query) {
  return request({
    url: '/safework/insurancedic/list',
    method: 'get',
    params: query
  })
}

// 查询包保责任制字典详细
export function getInsurancedic(id) {
  return request({
    url: '/safework/insurancedic/' + id,
    method: 'get'
  })
}

// 新增包保责任制字典
export function addInsurancedic(data) {
  return request({
    url: '/safework/insurancedic',
    method: 'post',
    data: data
  })
}

// 修改包保责任制字典
export function updateInsurancedic(data) {
  return request({
    url: '/safework/insurancedic',
    method: 'put',
    data: data
  })
}

// 删除包保责任制字典
export function delInsurancedic(id) {
  return request({
    url: '/safework/insurancedic/' + id,
    method: 'delete'
  })
}
