import request from '@/utils/request'

// 查询AI告警主机列表
export function listZjxx(query) {
  return request({
    url: '/aiWarning/zjxx/list',
    method: 'get',
    params: query
  })
}

// 查询AI告警主机详细
export function getZjxx(id) {
  return request({
    url: '/aiWarning/zjxx/' + id,
    method: 'get'
  })
}

// 新增AI告警主机
export function addZjxx(data) {
  return request({
    url: '/aiWarning/zjxx',
    method: 'post',
    data: data
  })
}

// 修改AI告警主机
export function updateZjxx(data) {
  return request({
    url: '/aiWarning/zjxx',
    method: 'put',
    data: data
  })
}

// 删除AI告警主机
export function delZjxx(id) {
  return request({
    url: '/aiWarning/zjxx/' + id,
    method: 'delete'
  })
}
