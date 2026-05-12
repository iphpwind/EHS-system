import request from '@/utils/request'

// 查询班次管理列表
export function listShifts(query) {
  return request({
    url: '/safework/shifts/list',
    method: 'get',
    params: query
  })
}

// 查询班次管理详细
export function getShifts(shiftId) {
  return request({
    url: '/safework/shifts/' + shiftId,
    method: 'get'
  })
}

// 新增班次管理
export function addShifts(data) {
  return request({
    url: '/safework/shifts',
    method: 'post',
    data: data
  })
}

// 修改班次管理
export function updateShifts(data) {
  return request({
    url: '/safework/shifts',
    method: 'put',
    data: data
  })
}

// 删除班次管理
export function delShifts(shiftId) {
  return request({
    url: '/safework/shifts/' + shiftId,
    method: 'delete'
  })
}
