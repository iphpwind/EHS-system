import request from '@/utils/request'

// 查询承诺卡承诺人签字列表
export function listPromisesign(query) {
  return request({
    url: '/safework/promisesign/list',
    method: 'get',
    params: query
  })
}

// 查询承诺卡承诺人签字详细
export function getPromisesign(id) {
  return request({
    url: '/safework/promisesign/' + id,
    method: 'get'
  })
}

// 新增承诺卡承诺人签字
export function addPromisesign(data) {
  return request({
    url: '/safework/promisesign',
    method: 'post',
    data: data
  })
}
// 新增承诺卡承诺人签字
export function batchAdd(data) {
  return request({
    url: '/safework/promisesign/batchAdd',
    method: 'post',
    data: data
  })
}

// 修改承诺卡承诺人签字
export function updatePromisesign(data) {
  return request({
    url: '/safework/promisesign',
    method: 'put',
    data: data
  })
}

// 删除承诺卡承诺人签字
export function delPromisesign(id) {
  return request({
    url: '/safework/promisesign/' + id,
    method: 'delete'
  })
}
