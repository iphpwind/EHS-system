import request from '@/utils/request'

// 消警
export function unAlarm(id) {
  return request({
    url: '/aiWarning/report/unAlarmClick',
    method: 'get',
    params: id
  })
}
