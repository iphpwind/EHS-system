import request from '@/utils/request'

// 查询法律法规管理列表
export function listLawManage(query) {
  return request({
    url: '/safework/lawManage/list',
    method: 'get',
    params: query
  })
}

// 查询法律法规管理详细
export function getLawManage(id) {
  return request({
    url: '/safework/lawManage/' + id,
    method: 'get'
  })
}

// 新增法律法规管理
export function addLawManage(data) {
  return request({
    url: '/safework/lawManage',
    method: 'post',
    data: data
  })
}

// 修改法律法规管理
export function updateLawManage(data) {
  return request({
    url: '/safework/lawManage',
    method: 'put',
    data: data
  })
}

// 删除法律法规管理
export function delLawManage(id) {
  return request({
    url: '/safework/lawManage/' + id,
    method: 'delete'
  })
}
