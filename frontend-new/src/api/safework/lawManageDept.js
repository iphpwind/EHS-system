import request from '@/utils/request'

// 查询法律法规管理适用部门列表
export function listLawManageDept(query) {
  return request({
    url: '/safework/lawManageDept/list',
    method: 'get',
    params: query
  })
}

// 查询法律法规管理适用部门详细
export function getLawManageDept(id) {
  return request({
    url: '/safework/lawManageDept/' + id,
    method: 'get'
  })
}

// 新增法律法规管理适用部门
export function addLawManageDept(data) {
  return request({
    url: '/safework/lawManageDept',
    method: 'post',
    data: data
  })
}

// 修改法律法规管理适用部门
export function updateLawManageDept(data) {
  return request({
    url: '/safework/lawManageDept',
    method: 'put',
    data: data
  })
}

// 删除法律法规管理适用部门
export function delLawManageDept(id) {
  return request({
    url: '/safework/lawManageDept/' + id,
    method: 'delete'
  })
}
