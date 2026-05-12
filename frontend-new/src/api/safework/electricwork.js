import request from '@/utils/request'

// ============ 基础 CRUD ============
export function listElectricwork(query) {
  return request({
    url: '/safework/electricwork/list',
    method: 'get',
    params: query
  })
}

export function listElectricwork2(query) {
  return request({
    url: '/safework/electricwork/list2',
    method: 'get',
    params: query
  })
}

export function getElectricwork(id) {
  return request({
    url: '/safework/electricwork/' + id,
    method: 'get'
  })
}

export function addElectricwork(data) {
  return request({
    url: '/safework/electricwork',
    method: 'post',
    data: data
  })
}

export function updateElectricwork(data) {
  return request({
    url: '/safework/electricwork',
    method: 'put',
    data: data
  })
}

export function updateStatus(data) {
  return request({
    url: '/safework/electricwork/updateStatus',
    method: 'put',
    data: data
  })
}

export function delElectricwork(id) {
  return request({
    url: '/safework/electricwork/' + id,
    method: 'delete'
  })
}

// ============ V2 流程操作 (GB 30871-2022) ============
export function submitElectricwork(id) {
  return request({
    url: '/safework/electricwork/' + id + '/submit',
    method: 'post'
  })
}

export function approveElectricwork(id, data) {
  return request({
    url: '/safework/electricwork/' + id + '/approve',
    method: 'post',
    data
  })
}

export function startElectricwork(id) {
  return request({
    url: '/safework/electricwork/' + id + '/start',
    method: 'post'
  })
}

export function finishElectricwork(id) {
  return request({
    url: '/safework/electricwork/' + id + '/finish',
    method: 'post'
  })
}

export function closeElectricwork(id) {
  return request({
    url: '/safework/electricwork/' + id + '/close',
    method: 'post'
  })
}

export function cancelElectricwork(id, data) {
  return request({
    url: '/safework/electricwork/' + id + '/cancel',
    method: 'post',
    data
  })
}

// ============ PDF导出 ============
export function exportElectricworkPDF(id) {
  return request({
    url: '/pdf/electricwork/' + id,
    method: 'get',
    responseType: 'blob'
  })
}
