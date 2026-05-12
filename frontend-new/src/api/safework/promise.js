import request from '@/utils/request'

// 查询承诺卡列表
export function listPromise(query) {
  return request({
    url: '/safework/promise/list',
    method: 'get',
    params: query
  })
}

// 查询承诺卡详细
export function getPromise(id) {
  return request({
    url: '/safework/promise/' + id,
    method: 'get'
  })
}

// 新增承诺卡
export function addPromise(data) {
  return request({
    url: '/safework/promise',
    method: 'post',
    data: data
  })
}

// 修改承诺卡
export function updatePromise(data) {
  return request({
    url: '/safework/promise',
    method: 'put',
    data: data
  })
}
// 修改承诺卡发布状态
export function sign(data) {
  return request({
    url: '/safework/promise/sign',
    method: 'put',
    data: data
  })
}

// 删除承诺卡
export function delPromise(id) {
  return request({
    url: '/safework/promise/' + id,
    method: 'delete'
  })
}

