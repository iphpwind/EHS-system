import request from '@/utils/request'

// ============ 基础 CRUD ============
export function listHighwork(query) {
  return request({
    url: '/safework/highwork/list',
    method: 'get',
    params: query
  })
}

export function listHighwork2(query) {
  return request({
    url: '/safework/highwork/list2',
    method: 'get',
    params: query
  })
}

export function getHighwork(id) {
  return request({
    url: '/safework/highwork/' + id,
    method: 'get'
  })
}

export function addHighwork(data) {
  return request({
    url: '/safework/highwork',
    method: 'post',
    data: data
  })
}

export function updateHighwork(data) {
  return request({
    url: '/safework/highwork',
    method: 'put',
    data: data
  })
}

export function updateStatus(data) {
  return request({
    url: '/safework/highwork/updateStatus',
    method: 'put',
    data: data
  })
}

export function delHighwork(id) {
  return request({
    url: '/safework/highwork/' + id,
    method: 'delete'
  })
}

// ============ V2 流程操作 (GB 30871-2022) ============
export function submitHighwork(id) {
  return request({
    url: '/safework/highwork/' + id + '/submit',
    method: 'post'
  })
}

export function approveHighwork(id, data) {
  return request({
    url: '/safework/highwork/' + id + '/approve',
    method: 'post',
    data
  })
}

export function startHighwork(id) {
  return request({
    url: '/safework/highwork/' + id + '/start',
    method: 'post'
  })
}

export function finishHighwork(id) {
  return request({
    url: '/safework/highwork/' + id + '/finish',
    method: 'post'
  })
}

export function closeHighwork(id) {
  return request({
    url: '/safework/highwork/' + id + '/close',
    method: 'post'
  })
}

export function cancelHighwork(id, data) {
  return request({
    url: '/safework/highwork/' + id + '/cancel',
    method: 'post',
    data
  })
}

// ============ 气体检测 ============
export function getGasChecks(id, query) {
  return request({
    url: '/safework/highwork/' + id + '/gas',
    method: 'get',
    params: query
  })
}

export function addGasCheck(id, data) {
  return request({
    url: '/safework/highwork/' + id + '/gas',
    method: 'post',
    data
  })
}

// ============ PDF导出 ============
export function exportHighworkPDF(id) {
  return request({
    url: '/pdf/highwork/' + id,
    method: 'get',
    responseType: 'blob'
  })
}
