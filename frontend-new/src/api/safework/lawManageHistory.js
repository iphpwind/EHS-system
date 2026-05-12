import request from '@/utils/request'

// 查询法律法规管理修改历史列表
export function listLawManageHistory(query) {
  return request({
    url: '/safework/lawManageHistory/list',
    method: 'get',
    params: query
  })
}

// 查询法律法规管理修改历史详细
export function getLawManageHistory(id) {
  return request({
    url: '/safework/lawManageHistory/' + id,
    method: 'get'
  })
}

// 新增法律法规管理修改历史
export function addLawManageHistory(data) {
  return request({
    url: '/safework/lawManageHistory',
    method: 'post',
    data: data
  })
}

// 修改法律法规管理修改历史
export function updateLawManageHistory(data) {
  return request({
    url: '/safework/lawManageHistory',
    method: 'put',
    data: data
  })
}

// 删除法律法规管理修改历史
export function delLawManageHistory(id) {
  return request({
    url: '/safework/lawManageHistory/' + id,
    method: 'delete'
  })
}
