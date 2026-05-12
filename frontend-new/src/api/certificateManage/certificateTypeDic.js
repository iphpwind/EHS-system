import request from '@/utils/request'

// 查询人员证书类型列表
export function listCertificateTypeDic(query) {
  return request({
    url: '/safework/certificateTypeDic/list',
    method: 'get',
    params: query
  })
}

// 查询人员证书类型详细
export function getCertificateTypeDic(id) {
  return request({
    url: '/safework/certificateTypeDic/' + id,
    method: 'get'
  })
}

// 新增人员证书类型
export function addCertificateTypeDic(data) {
  return request({
    url: '/safework/certificateTypeDic',
    method: 'post',
    data: data
  })
}

// 修改人员证书类型
export function updateCertificateTypeDic(data) {
  return request({
    url: '/safework/certificateTypeDic',
    method: 'put',
    data: data
  })
}

// 删除人员证书类型
export function delCertificateTypeDic(id) {
  return request({
    url: '/safework/certificateTypeDic/' + id,
    method: 'delete'
  })
}
