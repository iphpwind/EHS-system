import request from '@/utils/request'

// 查询AI告警推送人员列表
export function listHktsuser(query) {
  return request({
    url: '/aiWarning/hktsuser/list',
    method: 'get',
    params: query
  })
}

// 查询AI告警推送人员详细
export function getHktsuser(id) {
  return request({
    url: '/aiWarning/hktsuser/' + id,
    method: 'get'
  })
}

// 新增AI告警推送人员
export function addHktsuser(data) {
  return request({
    url: '/aiWarning/hktsuser',
    method: 'post',
    data: data
  })
}

// 修改AI告警推送人员
export function updateHktsuser(data) {
  return request({
    url: '/aiWarning/hktsuser',
    method: 'put',
    data: data
  })
}

// 删除AI告警推送人员
export function delHktsuser(id) {
  return request({
    url: '/aiWarning/hktsuser/' + id,
    method: 'delete'
  })
}
