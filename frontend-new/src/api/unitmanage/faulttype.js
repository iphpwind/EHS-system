import request from '@/utils/request'

// 查询设备分类
export function listEqClass(query) {
  return request({
    url: '/unitManage/faulttype/eqClassList',
    method: 'get',
    params: query
  })
}
// 查询故障类型字典列表
export function listFaulttype(query) {
  return request({
    url: '/unitManage/faulttype/list',
    method: 'get',
    params: query
  })
}

// 查询故障类型字典详细
export function getFaulttype(id) {
  return request({
    url: '/unitManage/faulttype/' + id,
    method: 'get'
  })
}

// 新增故障类型字典
export function addFaulttype(data) {
  return request({
    url: '/unitManage/faulttype',
    method: 'post',
    data: data
  })
}

// 修改故障类型字典
export function updateFaulttype(data) {
  return request({
    url: '/unitManage/faulttype',
    method: 'put',
    data: data
  })
}

// 删除故障类型字典
export function delFaulttype(id) {
  return request({
    url: '/unitManage/faulttype/' + id,
    method: 'delete'
  })
}
