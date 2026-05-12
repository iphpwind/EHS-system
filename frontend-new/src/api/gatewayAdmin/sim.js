import request from '@/utils/request'

// 查询网关盒子SIM卡信息列表
export function listSim(query) {
  return request({
    url: '/gatewayAdmin/sim/list',
    method: 'get',
    params: query
  })
}

// 查询网关盒子SIM卡信息详细
export function getSim(id) {
  return request({
    url: '/gatewayAdmin/sim/' + id,
    method: 'get'
  })
}

// 新增网关盒子SIM卡信息
export function addSim(data) {
  return request({
    url: '/gatewayAdmin/sim',
    method: 'post',
    data: data
  })
}

// 修改网关盒子SIM卡信息
export function updateSim(data) {
  return request({
    url: '/gatewayAdmin/sim',
    method: 'put',
    data: data
  })
}

// 删除网关盒子SIM卡信息
export function delSim(id) {
  return request({
    url: '/gatewayAdmin/sim/' + id,
    method: 'delete'
  })
}
