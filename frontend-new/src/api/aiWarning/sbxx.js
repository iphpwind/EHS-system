import request from '@/utils/request'

// 查询AI告警设备列表
export function listSbxx(query) {
  return request({
    url: '/aiWarning/sbxx/list',
    method: 'get',
    params: query
  })
}

// 查询AI告警设备详细
export function getSbxx(id) {
  return request({
    url: '/aiWarning/sbxx/' + id,
    method: 'get'
  })
}

// 新增AI告警设备
export function addSbxx(data) {
  return request({
    url: '/aiWarning/sbxx',
    method: 'post',
    data: data
  })
}

// 修改AI告警设备
export function updateSbxx(data) {
  return request({
    url: '/aiWarning/sbxx',
    method: 'put',
    data: data
  })
}

// 删除AI告警设备
export function delSbxx(id) {
  return request({
    url: '/aiWarning/sbxx/' + id,
    method: 'delete'
  })
}
