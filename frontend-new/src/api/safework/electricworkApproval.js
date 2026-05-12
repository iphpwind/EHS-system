import request from '@/utils/request'

// 查询临时用电票作业审核节点列表
export function listElectricworkApproval(query) {
  return request({
    url: '/safework/electricworkApproval/list',
    method: 'get',
    params: query
  })
}

// 查询临时用电票作业审核节点详细
export function getElectricworkApproval(id) {
  return request({
    url: '/safework/electricworkApproval/' + id,
    method: 'get'
  })
}

// 新增临时用电票作业审核节点
export function addElectricworkApproval(data) {
  return request({
    url: '/safework/electricworkApproval',
    method: 'post',
    data: data
  })
}

// 修改临时用电票作业审核节点
export function updateElectricworkApproval(data) {
  return request({
    url: '/safework/electricworkApproval',
    method: 'put',
    data: data
  })
}

// 删除临时用电票作业审核节点
export function delElectricworkApproval(id) {
  return request({
    url: '/safework/electricworkApproval/' + id,
    method: 'delete'
  })
}

// 查询工作流审批任务
export function getFlowableTask(id) {
  return request({
    url: '/safework/electricworkApproval/getFlowableTask/' + id,
    method: 'get'
  })
}

// 同意工作流审批任务
export function agreeFlowableTask(data) {
  return request({
    url: '/safework/electricworkApproval/agreeFlowableTask',
    method: 'post',
    data: data
  })
}

// 拒绝工作流审批任务
export function refuseFlowableTask(data) {
  return request({
    url: '/safework/electricworkApproval/refuseFlowableTask',
    method: 'post',
    data: data
  })
}
