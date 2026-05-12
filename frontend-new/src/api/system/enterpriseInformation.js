import request from '@/utils/request'

// 查询企业信息列表
export function listEnterpriseInformation(query) {
  return request({
    url: '/system/enterpriseInformation/list',
    method: 'get',
    params: query
  })
}

// 查询企业信息详细
export function getEnterpriseInformation(id) {
  return request({
    url: '/system/enterpriseInformation/' + id,
    method: 'get'
  })
}

// 新增企业信息
export function addEnterpriseInformation(data) {
  return request({
    url: '/system/enterpriseInformation',
    method: 'post',
    data: data
  })
}

// 修改企业信息
export function updateEnterpriseInformation(data) {
  return request({
    url: '/system/enterpriseInformation',
    method: 'put',
    data: data
  })
}

// 删除企业信息
export function delEnterpriseInformation(id) {
  return request({
    url: '/system/enterpriseInformation/' + id,
    method: 'delete'
  })
}
