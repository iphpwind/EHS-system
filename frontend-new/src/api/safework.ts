/**
 * 统一作业票API - 通用CRUD + 流程操作
 * 按GB 30871-2022危险化学品企业特殊作业安全规范设计
 */
import request from '@/utils/request'

// ============ 通用查询 ============

/** 查询作业票列表 */
export function listWorkTickets(ticketType: string, query: any) {
  return request({
    url: `/${ticketType}-work`,
    method: 'get',
    params: query
  })
}

/** 查询作业票详情 */
export function getWorkTicket(ticketType: string, id: number | string) {
  return request({
    url: `/${ticketType}-work/${id}`,
    method: 'get'
  })
}

/** 新增作业票 */
export function addWorkTicket(ticketType: string, data: any) {
  return request({
    url: `/${ticketType}-work`,
    method: 'post',
    data
  })
}

/** 编辑作业票 */
export function updateWorkTicket(ticketType: string, id: number | string, data: any) {
  return request({
    url: `/${ticketType}-work/${id}`,
    method: 'put',
    data
  })
}

/** 删除作业票 */
export function deleteWorkTicket(ticketType: string, id: number | string) {
  return request({
    url: `/${ticketType}-work/${id}`,
    method: 'delete'
  })
}

// ============ 流程操作 ============

/** 提交审批 */
export function submitWorkTicket(ticketType: string, id: number | string) {
  return request({
    url: `/${ticketType}-work/${id}/submit`,
    method: 'post'
  })
}

/** 审批操作 */
export function approveWorkTicket(ticketType: string, id: number | string, data: { action: string; comment?: string }) {
  return request({
    url: `/${ticketType}-work/${id}/approve`,
    method: 'post',
    data
  })
}

/** 开始作业 */
export function startWorkTicket(ticketType: string, id: number | string) {
  return request({
    url: `/${ticketType}-work/${id}/start`,
    method: 'post'
  })
}

/** 完成作业 */
export function finishWorkTicket(ticketType: string, id: number | string) {
  return request({
    url: `/${ticketType}-work/${id}/finish`,
    method: 'post'
  })
}

/** 验收关闭 */
export function closeWorkTicket(ticketType: string, id: number | string) {
  return request({
    url: `/${ticketType}-work/${id}/close`,
    method: 'post'
  })
}

/** 作废 */
export function cancelWorkTicket(ticketType: string, id: number | string, data?: any) {
  return request({
    url: `/${ticketType}-work/${id}/cancel`,
    method: 'post',
    data
  })
}

// ============ 气体检测 ============

/** 查询气体检测记录 */
export function getGasChecks(ticketType: string, id: number | string, query?: any) {
  return request({
    url: `/${ticketType}-work/${id}/gas`,
    method: 'get',
    params: query
  })
}

/** 提交气体检测 */
export function addGasCheck(ticketType: string, id: number | string, data: any) {
  return request({
    url: `/${ticketType}-work/${id}/gas`,
    method: 'post',
    data
  })
}

// ============ PDF导出 ============

/** 导出PDF */
export function exportWorkTicketPDF(ticketType: string, id: number | string) {
  return request({
    url: `/pdf/${ticketType}-work/${id}`,
    method: 'get',
    responseType: 'blob'
  })
}

// ============ 签字 ============

/** 查询签字记录 */
export function getSignatures(ticketType: string, id: number | string) {
  return request({
    url: '/signatures',
    method: 'get',
    params: { bizType: ticketType, bizId: id }
  })
}

/** 保存签字 */
export function saveWorkTicketSignature(data: {
  bizType: string
  bizId: number | string
  signType: string
  signImage: string
  signerName: string
}) {
  return request({
    url: '/signatures',
    method: 'post',
    data
  })
}

// ============ 风险辨识 ============

/** 保存风险辨识数据 */
export function saveRiskMeasures(ticketType: string, id: number | string, data: any[]) {
  return request({
    url: `/${ticketType}-work/${id}/risk-measures`,
    method: 'post',
    data
  })
}

/** 查询风险辨识数据 */
export function getRiskMeasures(ticketType: string, id: number | string) {
  return request({
    url: `/${ticketType}-work/${id}/risk-measures`,
    method: 'get'
  })
}

// ============ 审批记录 ============

/** 查询审批记录 */
export function getApprovalRecords(ticketType: string, id: number | string) {
  return request({
    url: `/${ticketType}-work/${id}/approvals`,
    method: 'get'
  })
}
