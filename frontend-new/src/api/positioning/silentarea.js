import request from '@/utils/request'

// 查询静默区域设置列表
export function listSilentarea(query) {
  return request({
    url: '/positioning/silentarea/list',
    method: 'get',
    params: query
  })
}

// 查询静默区域设置详细
export function getSilentarea(id) {
  return request({
    url: '/positioning/silentarea/' + id,
    method: 'get'
  })
}

// 新增静默区域设置
export function addSilentarea(data) {
  return request({
    url: '/positioning/silentarea',
    method: 'post',
    data: data
  })
}

// 修改静默区域设置
export function updateSilentarea(data) {
  return request({
    url: '/positioning/silentarea',
    method: 'put',
    data: data
  })
}

// 删除静默区域设置
export function delSilentarea(id) {
  return request({
    url: '/positioning/silentarea/' + id,
    method: 'delete'
  })
}
