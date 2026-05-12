import request from '@/utils/request'

// 查询网关盒子信息列表
export function listGateway(query) {
  return request({
    url: '/gatewayAdmin/gateway/list',
    method: 'get',
    params: query
  })
}

// 查询网关盒子信息详细
export function getGateway(id) {
  return request({
    url: '/gatewayAdmin/gateway/' + id,
    method: 'get'
  })
}

// 新增网关盒子信息
export function addGateway(data) {
  return request({
    url: '/gatewayAdmin/gateway',
    method: 'post',
    data: data
  })
}

// 修改网关盒子信息
export function updateGateway(data) {
  return request({
    url: '/gatewayAdmin/gateway',
    method: 'put',
    data: data
  })
}

// 删除网关盒子信息
export function delGateway(id) {
  return request({
    url: '/gatewayAdmin/gateway/' + id,
    method: 'delete'
  })
}
