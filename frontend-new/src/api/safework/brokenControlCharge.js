import request from '@/utils/request'

// 查询断路作业监护人负责人信息列表
export function listBrokenControlCharge(query) {
  return request({
    url: '/safework/brokenControlCharge/list',
    method: 'get',
    params: query
  })
}

// 查询断路作业监护人负责人信息详细
export function getBrokenControlCharge(id) {
  return request({
    url: '/safework/brokenControlCharge/' + id,
    method: 'get'
  })
}

// 新增断路作业监护人负责人信息
export function addBrokenControlCharge(data) {
  return request({
    url: '/safework/brokenControlCharge',
    method: 'post',
    data: data
  })
}

// 修改断路作业监护人负责人信息
export function updateBrokenControlCharge(data) {
  return request({
    url: '/safework/brokenControlCharge',
    method: 'put',
    data: data
  })
}

// 删除断路作业监护人负责人信息
export function delBrokenControlCharge(id) {
  return request({
    url: '/safework/brokenControlCharge/' + id,
    method: 'delete'
  })
}
