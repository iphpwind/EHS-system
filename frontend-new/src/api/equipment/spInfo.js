import request from '@/utils/request'

// 查询备件台账信息列表
export function listSpInfo(query) {
  return request({
    url: '/equipment/spInfo/list',
    method: 'get',
    params: query
  })
}

// 查询备件台账信息详细
export function getSpInfo(spId) {
  return request({
    url: '/equipment/spInfo/' + spId,
    method: 'get'
  })
}

// 新增备件台账信息
export function addSpInfo(data) {
  return request({
    url: '/equipment/spInfo',
    method: 'post',
    data: data
  })
}

// 修改备件台账信息
export function updateSpInfo(data) {
  return request({
    url: '/equipment/spInfo',
    method: 'put',
    data: data
  })
}

// 删除备件台账信息
export function delSpInfo(spId) {
  return request({
    url: '/equipment/spInfo/' + spId,
    method: 'delete'
  })
}
