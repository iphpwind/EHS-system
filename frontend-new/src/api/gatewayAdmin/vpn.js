import request from '@/utils/request'

// 查询网关盒子vpn配置列表
export function listVpn(query) {
  return request({
    url: '/gatewayAdmin/vpn/list',
    method: 'get',
    params: query
  })
}

// 查询网关盒子vpn配置详细
export function getVpn(id) {
  return request({
    url: '/gatewayAdmin/vpn/' + id,
    method: 'get'
  })
}

// 新增网关盒子vpn配置
export function addVpn(data) {
  return request({
    url: '/gatewayAdmin/vpn',
    method: 'post',
    data: data
  })
}

// 修改网关盒子vpn配置
export function updateVpn(data) {
  return request({
    url: '/gatewayAdmin/vpn',
    method: 'put',
    data: data
  })
}

// 删除网关盒子vpn配置
export function delVpn(id) {
  return request({
    url: '/gatewayAdmin/vpn/' + id,
    method: 'delete'
  })
}
