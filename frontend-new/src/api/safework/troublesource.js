import request from '@/utils/request'

// 查询隐患来源字典列表
export function listTroublesource(query) {
  return request({
    url: '/safework/troublesource/list',
    method: 'get',
    params: query
  })
}

// 查询隐患来源字典详细
export function getTroublesource(id) {
  return request({
    url: '/safework/troublesource/' + id,
    method: 'get'
  })
}

// 新增隐患来源字典
export function addTroublesource(data) {
  return request({
    url: '/safework/troublesource',
    method: 'post',
    data: data
  })
}

// 修改隐患来源字典
export function updateTroublesource(data) {
  return request({
    url: '/safework/troublesource',
    method: 'put',
    data: data
  })
}

// 删除隐患来源字典
export function delTroublesource(id) {
  return request({
    url: '/safework/troublesource/' + id,
    method: 'delete'
  })
}
