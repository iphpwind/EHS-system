import request from '@/utils/request'

// 查询告警推送信息列表
export function listBjtsxx(query) {
  return request({
    url: '/aiWarning/bjtsxx/list',
    method: 'get',
    params: query
  })
}

// 查询告警推送信息详细
export function getBjtsxx(id) {
  return request({
    url: '/aiWarning/bjtsxx/' + id,
    method: 'get'
  })
}

// 新增告警推送信息
export function addBjtsxx(data) {
  return request({
    url: '/aiWarning/bjtsxx',
    method: 'post',
    data: data
  })
}

// 修改告警推送信息
export function updateBjtsxx(data) {
  return request({
    url: '/aiWarning/bjtsxx',
    method: 'put',
    data: data
  })
}

// 删除告警推送信息
export function delBjtsxx(id) {
  return request({
    url: '/aiWarning/bjtsxx/' + id,
    method: 'delete'
  })
}
export function unAlarmClick(id) {
  return request({
    url: '/aiWarning/report/unAlarmClick/' + id,
    method: 'get'
  })
}
