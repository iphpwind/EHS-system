import request from '@/utils/request'

// ============ 基础 CRUD ============
export function listHoistingwork(query) {
  return request({
    url: '/safework/hoistingwork/list',
    method: 'get',
    params: query
  })
}

export function listHoistingwork2(query) {
  return request({
    url: '/safework/hoistingwork/list2',
    method: 'get',
    params: query
  })
}

export function getHoistingwork(id) {
  return request({
    url: '/safework/hoistingwork/' + id,
    method: 'get'
  })
}

export function addHoistingwork(data) {
  return request({
    url: '/safework/hoistingwork',
    method: 'post',
    data: data
  })
}

export function updateHoistingwork(data) {
  return request({
    url: '/safework/hoistingwork',
    method: 'put',
    data: data
  })
}

export function updateStatus(data) {
  return request({
    url: '/safework/hoistingwork/updateStatus',
    method: 'put',
    data: data
  })
}

export function delHoistingwork(id) {
  return request({
    url: '/safework/hoistingwork/' + id,
    method: 'delete'
  })
}

// ============ V2 流程操作 (GB 30871-2022) ============
export function submitHoistingwork(id) {
  return request({
    url: '/safework/hoistingwork/' + id + '/submit',
    method: 'post'
  })
}

export function approveHoistingwork(id, data) {
  return request({
    url: '/safework/hoistingwork/' + id + '/approve',
    method: 'post',
    data
  })
}

export function startHoistingwork(id) {
  return request({
    url: '/safework/hoistingwork/' + id + '/start',
    method: 'post'
  })
}

export function finishHoistingwork(id) {
  return request({
    url: '/safework/hoistingwork/' + id + '/finish',
    method: 'post'
  })
}

export function closeHoistingwork(id) {
  return request({
    url: '/safework/hoistingwork/' + id + '/close',
    method: 'post'
  })
}

export function cancelHoistingwork(id, data) {
  return request({
    url: '/safework/hoistingwork/' + id + '/cancel',
    method: 'post',
    data
  })
}

// ============ PDF导出 ============
export function exportHoistingworkPDF(id) {
  return request({
    url: '/pdf/hoistingwork/' + id,
    method: 'get',
    responseType: 'blob'
  })
}
