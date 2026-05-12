import request from '@/utils/request'

// 查询吊装作业吊具列表
export function listHoistingworkType(query) {
  return request({
    url: '/safework/hoistingworkType/list',
    method: 'get',
    params: query
  })
}

// 查询吊装作业吊具详细
export function getHoistingworkType(id) {
  return request({
    url: '/safework/hoistingworkType/' + id,
    method: 'get'
  })
}

// 新增吊装作业吊具
export function addHoistingworkType(data) {
  return request({
    url: '/safework/hoistingworkType',
    method: 'post',
    data: data
  })
}

// 修改吊装作业吊具
export function updateHoistingworkType(data) {
  return request({
    url: '/safework/hoistingworkType',
    method: 'put',
    data: data
  })
}

// 删除吊装作业吊具
export function delHoistingworkType(id) {
  return request({
    url: '/safework/hoistingworkType/' + id,
    method: 'delete'
  })
}
