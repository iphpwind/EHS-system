import request from '@/utils/request'

// 查询自建排查分类字典列表
export function listOneselfInves(query) {
  return request({
    url: '/safework/oneselfInves/list',
    method: 'get',
    params: query
  })
}

// 查询自建排查分类字典详细
export function getOneselfInves(id) {
  return request({
    url: '/safework/oneselfInves/' + id,
    method: 'get'
  })
}

// 新增自建排查分类字典
export function addOneselfInves(data) {
  return request({
    url: '/safework/oneselfInves',
    method: 'post',
    data: data
  })
}

// 修改自建排查分类字典
export function updateOneselfInves(data) {
  return request({
    url: '/safework/oneselfInves',
    method: 'put',
    data: data
  })
}

// 删除自建排查分类字典
export function delOneselfInves(id) {
  return request({
    url: '/safework/oneselfInves/' + id,
    method: 'delete'
  })
}
