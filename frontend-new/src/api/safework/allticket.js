import request from '@/utils/request'

export function selectInPro(query) {
  return request({
    url: '/safework/allticket/selectInPro',
    method: 'get',
    params: query
  })
}
export function selectNotInPro(query) {
  return request({
    url: '/safework/allticket/selectNotInPro',
    method: 'get',
    params: query
  })
}
export function selectTicketList(query) {
  return request({
    url: '/safework/allticket/selectTicketList',
    method: 'get',
    params: query
  })
}
export function selectTicketByDate(query) {
  return request({
    url: '/safework/allticket/selectTicketByDate',
    method: 'get',
    params: query
  })
}
export function selectTicketByObject(query) {
  return request({
    url: '/safework/allticket/selectTicketByObject',
    method: 'get',
    params: query
  })
}
