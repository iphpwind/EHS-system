import request from '@/utils/request'

// 查询人员证书管理列表
export function listCertificate(query) {
  return request({
    url: '/safework/certificate/list',
    method: 'get',
    params: query
  })
}

export function aboutContractor(query) {
  return request({
    url: '/safework/certificate/aboutContractor',
    method: 'get',
    params: query
  })
}

// 查询人员证书管理详细
export function getCertificate(id) {
  return request({
    url: '/safework/certificate/' + id,
    method: 'get'
  })
}

// 新增人员证书管理
export function addCertificate(data) {
  return request({
    url: '/safework/certificate',
    method: 'post',
    data: data
  })
}

// 修改人员证书管理
export function updateCertificate(data) {
  return request({
    url: '/safework/certificate',
    method: 'put',
    data: data
  })
}

// 删除人员证书管理
export function delCertificate(id) {
  return request({
    url: '/safework/certificate/' + id,
    method: 'delete'
  })
}
