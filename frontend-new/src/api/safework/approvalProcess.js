import request from '@/utils/request'

// 查询作业审批流自定义列表
export function listApprovalProcess(query) {
  return request({
    url: '/safework/approvalProcess/list',
    method: 'get',
    params: query
  })
}

// 查询作业审批流自定义详细
export function getApprovalProcess(id) {
  return request({
    url: '/safework/approvalProcess/' + id,
    method: 'get'
  })
}

// 新增作业审批流自定义
export function addApprovalProcess(data) {
  return request({
    url: '/safework/approvalProcess',
    method: 'post',
    data: data
  })
}

// 修改作业审批流自定义
export function updateApprovalProcess(data) {
  return request({
    url: '/safework/approvalProcess',
    method: 'put',
    data: data
  })
}

// 删除作业审批流自定义
export function delApprovalProcess(id) {
  return request({
    url: '/safework/approvalProcess/' + id,
    method: 'delete'
  })
}

// 查询流程图
export function getFlowable(id) {
  return request({
    url: '/safework/approvalProcess/getFlowable/' + id,
    method: 'get'
  })
}
