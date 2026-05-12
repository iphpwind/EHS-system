import request from '@/utils/request'

// 查询高处作业票作业审核节点列表
export function listHighworkApproval(query) {
  return request({
    url: '/safework/highworkApproval/list',
    method: 'get',
    params: query
  })
}

// 查询高处作业票作业审核节点详细
export function getHighworkApproval(id) {
  return request({
    url: '/safework/highworkApproval/' + id,
    method: 'get'
  })
}

// 新增高处作业票作业审核节点
export function addHighworkApproval(data) {
  return request({
    url: '/safework/highworkApproval',
    method: 'post',
    data: data
  })
}

// 修改高处作业票作业审核节点
export function updateHighworkApproval(data) {
  return request({
    url: '/safework/highworkApproval',
    method: 'put',
    data: data
  })
}

// 删除高处作业票作业审核节点
export function delHighworkApproval(id) {
  return request({
    url: '/safework/highworkApproval/' + id,
    method: 'delete'
  })
}

// 查询工作流审批任务
export function getFlowableTask(id) {
  return request({
    url: '/safework/highworkApproval/getFlowableTask/' + id,
    method: 'get'
  })
}

// 同意工作流审批任务
export function agreeFlowableTask(data) {
  return request({
    url: '/safework/highworkApproval/agreeFlowableTask',
    method: 'post',
    data: data
  })
}

// 拒绝工作流审批任务
export function refuseFlowableTask(data) {
  return request({
    url: '/safework/highworkApproval/refuseFlowableTask',
    method: 'post',
    data: data
  })
}
