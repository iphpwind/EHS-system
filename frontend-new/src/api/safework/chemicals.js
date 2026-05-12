import request from '@/utils/request'

// 查询危险化学品管理档案列表
export function listChemicals(query) {
  return request({
    url: '/safework/chemicals/list',
    method: 'get',
    params: query
  })
}

// 查询危险化学品管理档案详细
export function getChemicals(id) {
  return request({
    url: '/safework/chemicals/' + id,
    method: 'get'
  })
}

// 新增危险化学品管理档案
export function addChemicals(data) {
  return request({
    url: '/safework/chemicals',
    method: 'post',
    data: data
  })
}

// 修改危险化学品管理档案
export function updateChemicals(data) {
  return request({
    url: '/safework/chemicals',
    method: 'put',
    data: data
  })
}

// 删除危险化学品管理档案
export function delChemicals(id) {
  return request({
    url: '/safework/chemicals/' + id,
    method: 'delete'
  })
}
