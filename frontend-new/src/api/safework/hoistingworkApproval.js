import request from '@/utils/request'

// 查询吊装作业票作业审核节点列表
export function listHoistingworkApproval(query) {
  return request({
    url: '/safework/hoistingworkApproval/list',
    method: 'get',
    params: query
  })
}

// 查询吊装作业票作业审核节点详细
export function getHoistingworkApproval(id) {
  return request({
    url: '/safework/hoistingworkApproval/' + id,
    method: 'get'
  })
}

// 新增吊装作业票作业审核节点
export function addHoistingworkApproval(data) {
  return request({
    url: '/safework/hoistingworkApproval',
    method: 'post',
    data: data
  })
}

// 修改吊装作业票作业审核节点
export function updateHoistingworkApproval(data) {
  return request({
    url: '/safework/hoistingworkApproval',
    method: 'put',
    data: data
  })
}

// 删除吊装作业票作业审核节点
export function delHoistingworkApproval(id) {
  return request({
    url: '/safework/hoistingworkApproval/' + id,
    method: 'delete'
  })
}

// 查询工作流审批任务
export function getFlowableTask(id) {
  return request({
    url: '/safework/hoistingworkApproval/getFlowableTask/' + id,
    method: 'get'
  })
}

// 同意工作流审批任务
export function agreeFlowableTask(data) {
  return request({
    url: '/safework/hoistingworkApproval/agreeFlowableTask',
    method: 'post',
    data: data
  })
}

// 拒绝工作流审批任务
export function refuseFlowableTask(data) {
  return request({
    url: '/safework/hoistingworkApproval/refuseFlowableTask',
    method: 'post',
    data: data
  })
}
