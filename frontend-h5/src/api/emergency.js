import request from './request'

/** 获取应急物资列表 */
export function getSuppliesList(params) {
  return request.get('/emergency-v2/supplies', { params })
}

/** 新增应急物资 */
export function createSupply(data) {
  return request.post('/emergency-v2/supplies', data)
}

/** 获取应急通讯录 */
export function getContactsList(params) {
  return request.get('/emergency-v2/contacts', { params })
}

/** 获取法律法规列表 */
export function getLawList(params) {
  return request.get('/emergency-v2/laws', { params })
}

/** 获取法规类型 */
export function getLawTypes() {
  return request.get('/emergency-v2/law-types')
}

/** 获取隐患举报列表 */
export function getHazardReportList(params) {
  return request.get('/emergency-v2/hazard-reports', { params })
}

/** 新增隐患举报 */
export function createHazardReport(data) {
  return request.post('/emergency-v2/hazard-reports', data)
}
