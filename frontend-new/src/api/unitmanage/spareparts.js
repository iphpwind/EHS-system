import request from '@/utils/request'

// 查询保养使用备件字典列表
export function listSpareparts(query) {
  return request({
    url: '/unitManage/spareparts/list',
    method: 'get',
    params: query
  })
}

// 查询保养使用备件字典详细
export function getSpareparts(sparePartsId) {
  return request({
    url: '/unitManage/spareparts/' + sparePartsId,
    method: 'get'
  })
}

// 新增保养使用备件字典
export function addSpareparts(data) {
  return request({
    url: '/unitManage/spareparts',
    method: 'post',
    data: data
  })
}

// 修改保养使用备件字典
export function updateSpareparts(data) {
  return request({
    url: '/unitManage/spareparts',
    method: 'put',
    data: data
  })
}

// 删除保养使用备件字典
export function delSpareparts(sparePartsId) {
  return request({
    url: '/unitManage/spareparts/' + sparePartsId,
    method: 'delete'
  })
}
