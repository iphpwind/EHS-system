import request from '@/utils/request'

// 查询变更管理列表
export function listChangeManagement(query) {
  return request({
    url: '/safework/changeManagement/list',
    method: 'get',
    params: query
  })
}

// 查询变更管理详细
export function getChangeManagement(id) {
  return request({
    url: '/safework/changeManagement/' + id,
    method: 'get'
  })
}

// 新增变更管理
export function addChangeManagement(data) {
  return request({
    url: '/safework/changeManagement',
    method: 'post',
    data: data
  })
}

// 修改变更管理
export function updateChangeManagement(data) {
  return request({
    url: '/safework/changeManagement',
    method: 'put',
    data: data
  })
}

// 删除变更管理
export function delChangeManagement(id) {
  return request({
    url: '/safework/changeManagement/' + id,
    method: 'delete'
  })
}
