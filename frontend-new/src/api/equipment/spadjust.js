import request from '@/utils/request'

// 查询备件调整记录列表
export function listSpadjust(query) {
  return request({
    url: '/equipment/spadjust/list',
    method: 'get',
    params: query
  })
}

// 查询备件调整记录详细
export function getSpadjust(equipmentSpadjustId) {
  return request({
    url: '/equipment/spadjust/' + equipmentSpadjustId,
    method: 'get'
  })
}

// 新增备件调整记录
export function addSpadjust(data) {
  return request({
    url: '/equipment/spadjust',
    method: 'post',
    data: data
  })
}

// 修改备件调整记录
export function updateSpadjust(data) {
  return request({
    url: '/equipment/spadjust',
    method: 'put',
    data: data
  })
}

// 删除备件调整记录
export function delSpadjust(equipmentSpadjustId) {
  return request({
    url: '/equipment/spadjust/' + equipmentSpadjustId,
    method: 'delete'
  })
}
