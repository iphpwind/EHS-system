import request from '@/utils/request'

// 查询作业票有效期配置列表
export function listPeriodconfig(query) {
  return request({
    url: '/safework/periodconfig/list',
    method: 'get',
    params: query
  })
}

// 查询作业票有效期配置详细
export function getPeriodconfig(id) {
  return request({
    url: '/safework/periodconfig/' + id,
    method: 'get'
  })
}

// 新增作业票有效期配置
export function addPeriodconfig(data) {
  return request({
    url: '/safework/periodconfig',
    method: 'post',
    data: data
  })
}

// 修改作业票有效期配置
export function updatePeriodconfig(data) {
  return request({
    url: '/safework/periodconfig',
    method: 'put',
    data: data
  })
}

// 删除作业票有效期配置
export function delPeriodconfig(id) {
  return request({
    url: '/safework/periodconfig/' + id,
    method: 'delete'
  })
}
