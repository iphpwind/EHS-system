import request from '@/utils/request'

// ============ 基础 CRUD ============
export function listRestrictedwork(query) {
  return request({
    url: '/safework/restrictedwork/list',
    method: 'get',
    params: query
  })
}

export function listRestrictedwork2(query) {
  return request({
    url: '/safework/restrictedwork/list2',
    method: 'get',
    params: query
  })
}

export function getRestrictedwork(id) {
  return request({
    url: '/safework/restrictedwork/' + id,
    method: 'get'
  })
}

export function addRestrictedwork(data) {
  return request({
    url: '/safework/restrictedwork',
    method: 'post',
    data: data
  })
}

export function updateRestrictedwork(data) {
  return request({
    url: '/safework/restrictedwork',
    method: 'put',
    data: data
  })
}

export function delRestrictedwork(id) {
  return request({
    url: '/safework/restrictedwork/' + id,
    method: 'delete'
  })
}

export function updateStatus(data) {
  return request({
    url: '/safework/restrictedwork/updateStatus',
    method: 'put',
    data: data
  })
}

// ============ V2 流程操作 (GB 30871-2022) ============
export function submitRestrictedwork(id) {
  return request({
    url: '/safework/restrictedwork/' + id + '/submit',
    method: 'post'
  })
}

export function approveRestrictedwork(id, data) {
  return request({
    url: '/safework/restrictedwork/' + id + '/approve',
    method: 'post',
    data
  })
}

export function startRestrictedwork(id) {
  return request({
    url: '/safework/restrictedwork/' + id + '/start',
    method: 'post'
  })
}

export function finishRestrictedwork(id) {
  return request({
    url: '/safework/restrictedwork/' + id + '/finish',
    method: 'post'
  })
}

export function closeRestrictedwork(id) {
  return request({
    url: '/safework/restrictedwork/' + id + '/close',
    method: 'post'
  })
}

export function cancelRestrictedwork(id, data) {
  return request({
    url: '/safework/restrictedwork/' + id + '/cancel',
    method: 'post',
    data
  })
}

// ============ 气体检测 ============
export function getGasChecks(id, query) {
  return request({
    url: '/safework/restrictedwork/' + id + '/gas',
    method: 'get',
    params: query
  })
}

export function addGasCheck(id, data) {
  return request({
    url: '/safework/restrictedwork/' + id + '/gas',
    method: 'post',
    data
  })
}

// ============ 风险辨识 ============
export function getRiskMeasures(id) {
  return request({
    url: '/safework/restrictedwork/' + id + '/risk-measures',
    method: 'get'
  })
}

export function saveRiskMeasures(id, data) {
  return request({
    url: '/safework/restrictedwork/' + id + '/risk-measures',
    method: 'post',
    data
  })
}

// ============ PDF导出 ============
export function exportRestrictedworkPDF(id) {
  return request({
    url: '/pdf/restrictedwork/' + id,
    method: 'get',
    responseType: 'blob'
  })
}
