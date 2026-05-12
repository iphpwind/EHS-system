import request from '@/utils/request'

// 查询故障诊断字典列表
export function listTroubleshooting(query) {
  return request({
    url: '/unitManage/troubleshooting/list',
    method: 'get',
    params: query
  })
}

// 查询故障诊断字典详细
export function getTroubleshooting(id) {
  return request({
    url: '/unitManage/troubleshooting/' + id,
    method: 'get'
  })
}

// 新增故障诊断字典
export function addTroubleshooting(data) {
  return request({
    url: '/unitManage/troubleshooting',
    method: 'post',
    data: data
  })
}

// 修改故障诊断字典
export function updateTroubleshooting(data) {
  return request({
    url: '/unitManage/troubleshooting',
    method: 'put',
    data: data
  })
}

// 删除故障诊断字典
export function delTroubleshooting(id) {
  return request({
    url: '/unitManage/troubleshooting/' + id,
    method: 'delete'
  })
}
