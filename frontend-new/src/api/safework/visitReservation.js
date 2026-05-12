import request from '@/utils/request'

// 查询访客预约列表
export function listVisitReservation(query) {
  return request({
    url: '/safework/visitReservation/list',
    method: 'get',
    params: query
  })
}

export function getToken(query) {
  return request({
    url: '/safework/visitReservation/getToken',
    method: 'get',
    params: query
  })
}

export function getQrcode(query) {
  return request({
    url: '/safework/visitReservation/getQrcode',
    method: 'get',
    params: query
  })
}

// 查询访客预约详细
export function getVisitReservation(id) {
  return request({
    url: '/safework/visitReservation/' + id,
    method: 'get'
  })
}

// 新增访客预约
export function addVisitReservation(data) {
  return request({
    url: '/safework/visitReservation',
    method: 'post',
    data: data
  })
}

// 修改访客预约
export function updateVisitReservation(data) {
  return request({
    url: '/safework/visitReservation',
    method: 'put',
    data: data
  })
}

// 删除访客预约
export function delVisitReservation(id) {
  return request({
    url: '/safework/visitReservation/' + id,
    method: 'delete'
  })
}
