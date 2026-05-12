import request from '@/utils/request'

// 查询吊装作业票安全交底列表
export function listHoistingworkSafety(query) {
  return request({
    url: '/safework/hoistingworkSafety/list',
    method: 'get',
    params: query
  })
}

// 查询吊装作业票安全交底详细
export function getHoistingworkSafety(id) {
  return request({
    url: '/safework/hoistingworkSafety/' + id,
    method: 'get'
  })
}

// 新增吊装作业票安全交底
export function addHoistingworkSafety(data) {
  return request({
    url: '/safework/hoistingworkSafety',
    method: 'post',
    data: data
  })
}

// 修改吊装作业票安全交底
export function updateHoistingworkSafety(data) {
  return request({
    url: '/safework/hoistingworkSafety',
    method: 'put',
    data: data
  })
}

// 删除吊装作业票安全交底
export function delHoistingworkSafety(id) {
  return request({
    url: '/safework/hoistingworkSafety/' + id,
    method: 'delete'
  })
}
