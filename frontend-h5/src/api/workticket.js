import request from './request'

// 各类作业票 API 前缀映射
const prefixMap = {
  hot: 'hot-work',
  confined: 'confined-space',
  high: 'high-work',
  hoisting: 'hoisting-work',
  earth: 'earth-work',
  road: 'broken-work',
  blind: 'blind-work'
}

/** 获取作业票列表 */
export function getTicketList(type, params) {
  return request.get('/' + (prefixMap[type] || 'hot-work'), { params })
}

/** 获取作业票详情 */
export function getTicketDetail(type, id) {
  return request.get('/' + (prefixMap[type] || 'hot-work') + '/' + id)
}

/** 创建作业票 */
export function createTicket(type, data) {
  return request.post('/' + (prefixMap[type] || 'hot-work'), data)
}

/** 更新作业票 */
export function updateTicket(type, id, data) {
  return request.put('/' + (prefixMap[type] || 'hot-work') + '/' + id, data)
}

/** 提交审批 */
export function submitTicket(type, id, data) {
  return request.post('/' + (prefixMap[type] || 'hot-work') + '/' + id + '/submit', data || {})
}

/** 审批操作 */
export function approveTicket(type, id, data) {
  return request.post('/' + (prefixMap[type] || 'hot-work') + '/' + id + '/approve', data)
}

/** 开始作业 */
export function startWork(type, id) {
  return request.post('/' + (prefixMap[type] || 'hot-work') + '/' + id + '/start')
}

/** 完成作业 */
export function finishWork(type, id) {
  return request.post('/' + (prefixMap[type] || 'hot-work') + '/' + id + '/finish')
}

/** 关闭作业票 */
export function closeWork(type, id) {
  return request.post('/' + (prefixMap[type] || 'hot-work') + '/' + id + '/close')
}

// 作业票名称映射
export const ticketTypeNames = {
  hot: '动火作业',
  confined: '受限空间',
  high: '高处作业',
  hoisting: '吊装作业',
  earth: '动土作业',
  road: '断路作业',
  blind: '盲板抽堵'
}

export const ticketTypeIcons = {
  hot: 'fire-o',
  confined: 'enlarge-o',
  high: 'upgrade-o',
  hoisting: 'gem-o',
  earth: 'flag-o',
  road: 'warning-o',
  blind: 'shield-o'
}
