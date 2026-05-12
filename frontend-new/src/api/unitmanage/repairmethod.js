import request from '@/utils/request'

// 查询维修方法字典列表
export function listRepairmethod(query) {
  return request({
    url: '/unitManage/repairmethod/list',
    method: 'get',
    params: query
  })
}

// 查询维修方法字典详细
export function getRepairmethod(id) {
  return request({
    url: '/unitManage/repairmethod/' + id,
    method: 'get'
  })
}

// 新增维修方法字典
export function addRepairmethod(data) {
  return request({
    url: '/unitManage/repairmethod',
    method: 'post',
    data: data
  })
}

// 修改维修方法字典
export function updateRepairmethod(data) {
  return request({
    url: '/unitManage/repairmethod',
    method: 'put',
    data: data
  })
}

// 删除维修方法字典
export function delRepairmethod(id) {
  return request({
    url: '/unitManage/repairmethod/' + id,
    method: 'delete'
  })
}
