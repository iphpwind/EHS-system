import request from '@/utils/request'

// 查询断路作业作业票作业审核节点列表
export function listBrokenApproval(query) {
  return request({
    url: '/safework/brokenApproval/list',
    method: 'get',
    params: query
  })
}

// 查询断路作业作业票作业审核节点详细
export function getBrokenApproval(id) {
  return request({
    url: '/safework/brokenApproval/' + id,
    method: 'get'
  })
}

// 新增断路作业作业票作业审核节点
export function addBrokenApproval(data) {
  return request({
    url: '/safework/brokenApproval',
    method: 'post',
    data: data
  })
}

// 修改断路作业作业票作业审核节点
export function updateBrokenApproval(data) {
  return request({
    url: '/safework/brokenApproval',
    method: 'put',
    data: data
  })
}

// 删除断路作业作业票作业审核节点
export function delBrokenApproval(id) {
  return request({
    url: '/safework/brokenApproval/' + id,
    method: 'delete'
  })
}
