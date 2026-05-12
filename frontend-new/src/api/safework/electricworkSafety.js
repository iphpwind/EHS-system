import request from '@/utils/request'

// 查询临时用电票安全交底列表
export function listElectricworkSafety(query) {
  return request({
    url: '/safework/electricworkSafety/list',
    method: 'get',
    params: query
  })
}

// 查询临时用电票安全交底详细
export function getElectricworkSafety(id) {
  return request({
    url: '/safework/electricworkSafety/' + id,
    method: 'get'
  })
}

// 新增临时用电票安全交底
export function addElectricworkSafety(data) {
  return request({
    url: '/safework/electricworkSafety',
    method: 'post',
    data: data
  })
}

// 修改临时用电票安全交底
export function updateElectricworkSafety(data) {
  return request({
    url: '/safework/electricworkSafety',
    method: 'put',
    data: data
  })
}

// 删除临时用电票安全交底
export function delElectricworkSafety(id) {
  return request({
    url: '/safework/electricworkSafety/' + id,
    method: 'delete'
  })
}
