import request from '@/utils/request'

// 查询临时用电列表
export function listElectricwork(query) {
  return request({
    url: '/safework/electricwork/list',
    method: 'get',
    params: query
  })
}

// 查询临时用电列表
export function listElectricwork2(query) {
  return request({
    url: '/safework/electricwork/list2',
    method: 'get',
    params: query
  })
}

// 查询临时用电详细
export function getElectricwork(id) {
  return request({
    url: '/safework/electricwork/' + id,
    method: 'get'
  })
}

// 新增临时用电
export function addElectricwork(data) {
  return request({
    url: '/safework/electricwork',
    method: 'post',
    data: data
  })
}

// 修改临时用电
export function updateElectricwork(data) {
  return request({
    url: '/safework/electricwork',
    method: 'put',
    data: data
  })
}
// 作废临时用电
export function updateStatus(data) {
  return request({
    url: '/safework/electricwork/updateStatus',
    method: 'put',
    data: data
  })
}

// 删除临时用电
export function delElectricwork(id) {
  return request({
    url: '/safework/electricwork/' + id,
    method: 'delete'
  })
}
