import request from '@/utils/request'

// ============ 基础 CRUD ============
export function listEarth(query) {
  return request({
    url: '/safework/earth/list',
    method: 'get',
    params: query
  })
}

export function getEarth(id) {
  return request({
    url: '/safework/earth/' + id,
    method: 'get'
  })
}

export function addEarth(data) {
  return request({
    url: '/safework/earth',
    method: 'post',
    data: data
  })
}

export function updateEarth(data) {
  return request({
    url: '/safework/earth',
    method: 'put',
    data: data
  })
}

export function updateStatus(data) {
  return request({
    url: '/safework/earth/updateStatus',
    method: 'put',
    data: data
  })
}

export function delEarth(id) {
  return request({
    url: '/safework/earth/' + id,
    method: 'delete'
  })
}

// ============ V2 流程操作 (GB 30871-2022) ============
export function submitEarth(id) {
  return request({
    url: '/safework/earth/' + id + '/submit',
    method: 'post'
  })
}

export function approveEarth(id, data) {
  return request({
    url: '/safework/earth/' + id + '/approve',
    method: 'post',
    data
  })
}

export function startEarth(id) {
  return request({
    url: '/safework/earth/' + id + '/start',
    method: 'post'
  })
}

export function finishEarth(id) {
  return request({
    url: '/safework/earth/' + id + '/finish',
    method: 'post'
  })
}

export function closeEarth(id) {
  return request({
    url: '/safework/earth/' + id + '/close',
    method: 'post'
  })
}

export function cancelEarth(id, data) {
  return request({
    url: '/safework/earth/' + id + '/cancel',
    method: 'post',
    data
  })
}

// ============ PDF导出 ============
export function exportEarthPDF(id) {
  return request({
    url: '/pdf/earth/' + id,
    method: 'get',
    responseType: 'blob'
  })
}
