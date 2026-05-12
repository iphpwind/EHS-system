import request from '@/utils/request'

// 查询NFC交互log列表
export function listTemplog(query) {
  return request({
    url: '/temperature/templog/list',
    method: 'get',
    params: query
  })
}

// 查询NFC交互log详细
export function getTemplog(id) {
  return request({
    url: '/temperature/templog/' + id,
    method: 'get'
  })
}

// 新增NFC交互log
export function addTemplog(data) {
  return request({
    url: '/temperature/templog',
    method: 'post',
    data: data
  })
}

// 修改NFC交互log
export function updateTemplog(data) {
  return request({
    url: '/temperature/templog',
    method: 'put',
    data: data
  })
}

// 删除NFC交互log
export function delTemplog(id) {
  return request({
    url: '/temperature/templog/' + id,
    method: 'delete'
  })
}
