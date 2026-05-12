import request from '@/utils/request'

// 查询隐患类型字典列表
export function listTroubletype(query) {
  return request({
    url: '/safework/troubletype/list',
    method: 'get',
    params: query
  })
}

// 查询隐患类型字典详细
export function getTroubletype(id) {
  return request({
    url: '/safework/troubletype/' + id,
    method: 'get'
  })
}

// 新增隐患类型字典
export function addTroubletype(data) {
  return request({
    url: '/safework/troubletype',
    method: 'post',
    data: data
  })
}

// 修改隐患类型字典
export function updateTroubletype(data) {
  return request({
    url: '/safework/troubletype',
    method: 'put',
    data: data
  })
}

// 删除隐患类型字典
export function delTroubletype(id) {
  return request({
    url: '/safework/troubletype/' + id,
    method: 'delete'
  })
}
