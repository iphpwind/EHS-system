import request from '@/utils/request'

// 查询带班日历列表
export function listShiftCalendar(query) {
  return request({
    url: '/safework/shiftCalendar/list',
    method: 'get',
    params: query
  })
}

// 查询带班日历详细
export function getShiftCalendar(id) {
  return request({
    url: '/safework/shiftCalendar/' + id,
    method: 'get'
  })
}

// 新增带班日历
export function addShiftCalendar(data) {
  return request({
    url: '/safework/shiftCalendar',
    method: 'post',
    data: data
  })
}

// 修改带班日历
export function updateShiftCalendar(data) {
  return request({
    url: '/safework/shiftCalendar',
    method: 'put',
    data: data
  })
}

// 删除带班日历
export function delShiftCalendar(id) {
  return request({
    url: '/safework/shiftCalendar/' + id,
    method: 'delete'
  })
}
