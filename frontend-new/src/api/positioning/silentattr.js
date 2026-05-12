import request from '@/utils/request'

// 查询静默区域时间段列表
export function listSilentattr(query) {
  return request({
    url: '/positioning/silentattr/list',
    method: 'get',
    params: query
  })
}

// 查询静默区域时间段详细
export function getSilentattr(id) {
  return request({
    url: '/positioning/silentattr/' + id,
    method: 'get'
  })
}

// 新增静默区域时间段
export function addSilentattr(data) {
  return request({
    url: '/positioning/silentattr',
    method: 'post',
    data: data
  })
}

// 修改静默区域时间段
export function updateSilentattr(data) {
  return request({
    url: '/positioning/silentattr',
    method: 'put',
    data: data
  })
}

// 删除静默区域时间段
export function delSilentattr(id) {
  return request({
    url: '/positioning/silentattr/' + id,
    method: 'delete'
  })
}
