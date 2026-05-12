import request from '@/utils/request'

// 查询临时用电工作票用电详情列表
export function listElectricworkDetails(query) {
  return request({
    url: '/safework/electricworkDetails/list',
    method: 'get',
    params: query
  })
}

// 查询临时用电工作票用电详情详细
export function getElectricworkDetails(id) {
  return request({
    url: '/safework/electricworkDetails/' + id,
    method: 'get'
  })
}

// 新增临时用电工作票用电详情
export function addElectricworkDetails(data) {
  return request({
    url: '/safework/electricworkDetails',
    method: 'post',
    data: data
  })
}

// 修改临时用电工作票用电详情
export function updateElectricworkDetails(data) {
  return request({
    url: '/safework/electricworkDetails',
    method: 'put',
    data: data
  })
}

// 删除临时用电工作票用电详情
export function delElectricworkDetails(id) {
  return request({
    url: '/safework/electricworkDetails/' + id,
    method: 'delete'
  })
}
