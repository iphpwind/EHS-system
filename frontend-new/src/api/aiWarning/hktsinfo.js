import request from '@/utils/request'

// 查询消息推送记录列表
export function listHktsinfo(query) {
  return request({
    url: '/aiWarning/hktsinfo/list',
    method: 'get',
    params: query
  })
}

// 查询消息推送记录详细
export function getHktsinfo(id) {
  return request({
    url: '/aiWarning/hktsinfo/' + id,
    method: 'get'
  })
}

// 新增消息推送记录
export function addHktsinfo(data) {
  return request({
    url: '/aiWarning/hktsinfo',
    method: 'post',
    data: data
  })
}

// 修改消息推送记录
export function updateHktsinfo(data) {
  return request({
    url: '/aiWarning/hktsinfo',
    method: 'put',
    data: data
  })
}

// 删除消息推送记录
export function delHktsinfo(id) {
  return request({
    url: '/aiWarning/hktsinfo/' + id,
    method: 'delete'
  })
}
