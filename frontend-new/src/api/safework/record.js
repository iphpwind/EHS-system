import request from '@/utils/request'

// 查询隐患排查记录列表
export function listRecord(query) {
  return request({
    url: '/safework/record/list',
    method: 'get',
    params: query
  })
}

// 查询隐患排查记录详细
export function getRecord(id) {
  return request({
    url: '/safework/record/' + id,
    method: 'get'
  })
}

// 新增隐患排查记录
export function addRecord(data) {
  return request({
    url: '/safework/record',
    method: 'post',
    data: data
  })
}

// 修改隐患排查记录
export function updateRecord(data) {
  return request({
    url: '/safework/record',
    method: 'put',
    data: data
  })
}

// 删除隐患排查记录
export function delRecord(id) {
  return request({
    url: '/safework/record/' + id,
    method: 'delete'
  })
}
