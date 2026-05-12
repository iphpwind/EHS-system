import request from '@/utils/request'

// 查询受限空间票作业审核节点列表
export function listRestrictedworkApproval(query) {
  return request({
    url: '/safework/restrictedworkApproval/list',
    method: 'get',
    params: query
  })
}

// 查询受限空间票作业审核节点详细
export function getRestrictedworkApproval(id) {
  return request({
    url: '/safework/restrictedworkApproval/' + id,
    method: 'get'
  })
}

// 新增受限空间票作业审核节点
export function addRestrictedworkApproval(data) {
  return request({
    url: '/safework/restrictedworkApproval',
    method: 'post',
    data: data
  })
}

// 修改受限空间票作业审核节点
export function updateRestrictedworkApproval(data) {
  return request({
    url: '/safework/restrictedworkApproval',
    method: 'put',
    data: data
  })
}

// 删除受限空间票作业审核节点
export function delRestrictedworkApproval(id) {
  return request({
    url: '/safework/restrictedworkApproval/' + id,
    method: 'delete'
  })
}

// 查询工作流审批任务
export function getFlowableTask(id) {
  return request({
    url: '/safework/restrictedworkApproval/getFlowableTask/' + id,
    method: 'get'
  })
}

// 同意工作流审批任务
export function agreeFlowableTask(data) {
  return request({
    url: '/safework/restrictedworkApproval/agreeFlowableTask',
    method: 'post',
    data: data
  })
}

// 拒绝工作流审批任务
export function refuseFlowableTask(data) {
  return request({
    url: '/safework/restrictedworkApproval/refuseFlowableTask',
    method: 'post',
    data: data
  })
}
