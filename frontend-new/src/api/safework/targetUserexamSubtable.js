import request from '@/utils/request'

// 查询安全考核管理子列表
export function listTargetUserexamSubtable(query) {
  return request({
    url: '/safework/targetUserexamSubtable/list',
    method: 'get',
    params: query
  })
}

// 查询安全考核管理子详细
export function getTargetUserexamSubtable(id) {
  return request({
    url: '/safework/targetUserexamSubtable/' + id,
    method: 'get'
  })
}

// 新增安全考核管理子
export function addTargetUserexamSubtable(data) {
  return request({
    url: '/safework/targetUserexamSubtable',
    method: 'post',
    data: data
  })
}

// 修改安全考核管理子
export function updateTargetUserexamSubtable(data) {
  return request({
    url: '/safework/targetUserexamSubtable',
    method: 'put',
    data: data
  })
}

// 删除安全考核管理子
export function delTargetUserexamSubtable(id) {
  return request({
    url: '/safework/targetUserexamSubtable/' + id,
    method: 'delete'
  })
}
