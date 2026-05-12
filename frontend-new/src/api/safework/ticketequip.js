import request from '@/utils/request'

// 查询作业票和移动球机设备关联列表
export function listTicketequip(query) {
  return request({
    url: '/safework/ticketequip/list',
    method: 'get',
    params: query
  })
}

// 查询作业票和移动球机设备关联详细
export function getTicketequip(id) {
  return request({
    url: '/safework/ticketequip/' + id,
    method: 'get'
  })
}

// 新增作业票和移动球机设备关联
export function addTicketequip(data) {
  return request({
    url: '/safework/ticketequip',
    method: 'post',
    data: data
  })
}

// 修改作业票和移动球机设备关联
export function updateTicketequip(data) {
  return request({
    url: '/safework/ticketequip',
    method: 'put',
    data: data
  })
}

// 删除作业票和移动球机设备关联
export function delTicketequip(id) {
  return request({
    url: '/safework/ticketequip/' + id,
    method: 'delete'
  })
}
