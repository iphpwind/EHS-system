import request from '@/utils/request'

// 查询网关盒子SIM卡信息列表
export function listRenew(query) {
  return request({
    url: '/gatewayAdmin/renew/list',
    method: 'get',
    params: query
  })
}

// 查询网关盒子SIM卡信息详细
export function getRenew(id) {
  return request({
    url: '/gatewayAdmin/renew/' + id,
    method: 'get'
  })
}

// 新增网关盒子SIM卡信息
export function addRenew(data) {
  return request({
    url: '/gatewayAdmin/renew',
    method: 'post',
    data: data
  })
}

// 修改网关盒子SIM卡信息
export function updateRenew(data) {
  return request({
    url: '/gatewayAdmin/renew',
    method: 'put',
    data: data
  })
}

// 删除网关盒子SIM卡信息
export function delRenew(id) {
  return request({
    url: '/gatewayAdmin/renew/' + id,
    method: 'delete'
  })
}
