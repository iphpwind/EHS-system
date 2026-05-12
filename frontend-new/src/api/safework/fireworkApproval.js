import request from '@/utils/request'

// 查询动火作业票作业审核节点列表
export function listFireworkApproval(query) {
  return request({
    url: '/safework/fireworkApproval/list',
    method: 'get',
    params: query
  })
}

// 查询动火作业票作业审核节点详细
export function getFireworkApproval(id) {
  return request({
    url: '/safework/fireworkApproval/' + id,
    method: 'get'
  })
}

// 新增动火作业票作业审核节点
export function addFireworkApproval(data) {
  return request({
    url: '/safework/fireworkApproval',
    method: 'post',
    data: data
  })
}

// 修改动火作业票作业审核节点
export function updateFireworkApproval(data) {
  return request({
    url: '/safework/fireworkApproval',
    method: 'put',
    data: data
  })
}

// 删除动火作业票作业审核节点
export function delFireworkApproval(id) {
  return request({
    url: '/safework/fireworkApproval/' + id,
    method: 'delete'
  })
}

// 查询工作流审批任务
export function getFlowableTask(id) {
  return request({
    url: '/safework/fireworkApproval/getFlowableTask/' + id,
    method: 'get'
  })
}

// 同意工作流审批任务
export function agreeFlowableTask(data) {
  return request({
    url: '/safework/fireworkApproval/agreeFlowableTask',
    method: 'post',
    data: data
  })
}

// 拒绝工作流审批任务
export function refuseFlowableTask(data) {
  return request({
    url: '/safework/fireworkApproval/refuseFlowableTask',
    method: 'post',
    data: data
  })
}
