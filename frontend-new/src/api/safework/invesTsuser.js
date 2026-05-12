import request from '@/utils/request'

// 查询预警推送人员列表
export function listInvesTsuser(query) {
  return request({
    url: '/safework/invesTsuser/list',
    method: 'get',
    params: query
  })
}

// 查询预警推送人员详细
export function getInvesTsuser(id) {
  return request({
    url: '/safework/invesTsuser/' + id,
    method: 'get'
  })
}

// 新增预警推送人员
export function addInvesTsuser(data) {
  return request({
    url: '/safework/invesTsuser',
    method: 'post',
    data: data
  })
}

// 修改预警推送人员
export function updateInvesTsuser(data) {
  return request({
    url: '/safework/invesTsuser',
    method: 'put',
    data: data
  })
}

// 删除预警推送人员
export function delInvesTsuser(id) {
  return request({
    url: '/safework/invesTsuser/' + id,
    method: 'delete'
  })
}
