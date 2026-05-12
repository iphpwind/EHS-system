import request from '@/utils/request'

// 查询动土作业审核节点列表
export function listEarchApproval(query) {
  return request({
    url: '/safework/earchApproval/list',
    method: 'get',
    params: query
  })
}

// 查询动土作业审核节点详细
export function getEarchApproval(id) {
  return request({
    url: '/safework/earchApproval/' + id,
    method: 'get'
  })
}

// 新增动土作业审核节点
export function addEarchApproval(data) {
  return request({
    url: '/safework/earchApproval',
    method: 'post',
    data: data
  })
}

// 修改动土作业审核节点
export function updateEarchApproval(data) {
  return request({
    url: '/safework/earchApproval',
    method: 'put',
    data: data
  })
}

// 删除动土作业审核节点
export function delEarchApproval(id) {
  return request({
    url: '/safework/earchApproval/' + id,
    method: 'delete'
  })
}
