import request from '@/utils/request'

// 查询安全考核管理列表
export function listTargetUserExamine(query) {
  return request({
    url: '/safework/targetUserExamine/list',
    method: 'get',
    params: query
  })
}

// 查询安全考核管理详细
export function getTargetUserExamine(id) {
  return request({
    url: '/safework/targetUserExamine/' + id,
    method: 'get'
  })
}

// 新增安全考核管理
export function addTargetUserExamine(data) {
  return request({
    url: '/safework/targetUserExamine',
    method: 'post',
    data: data
  })
}

// 修改安全考核管理
export function updateTargetUserExamine(data) {
  return request({
    url: '/safework/targetUserExamine',
    method: 'put',
    data: data
  })
}

// 删除安全考核管理
export function delTargetUserExamine(id) {
  return request({
    url: '/safework/targetUserExamine/' + id,
    method: 'delete'
  })
}
