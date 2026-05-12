import request from '@/utils/request'

// 查询安全生产附件列表
export function listAttachment(query) {
  return request({
    url: '/safework/attachment/list',
    method: 'get',
    params: query
  })
}

// 查询安全生产附件详细
export function getAttachment(id) {
  return request({
    url: '/safework/attachment/' + id,
    method: 'get'
  })
}

// 新增安全生产附件
export function addAttachment(data) {
  return request({
    url: '/safework/attachment',
    method: 'post',
    data: data
  })
}

// 修改安全生产附件
export function updateAttachment(data) {
  return request({
    url: '/safework/attachment',
    method: 'put',
    data: data
  })
}

// 删除安全生产附件
export function delAttachment(id) {
  return request({
    url: '/safework/attachment/' + id,
    method: 'delete'
  })
}
