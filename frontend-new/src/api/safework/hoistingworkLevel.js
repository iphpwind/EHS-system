import request from '@/utils/request'

// 查询吊装作业级别列表
export function listHoistingworkLevel(query) {
  return request({
    url: '/safework/hoistingworkLevel/list',
    method: 'get',
    params: query
  })
}

// 查询吊装作业级别详细
export function getHoistingworkLevel(id) {
  return request({
    url: '/safework/hoistingworkLevel/' + id,
    method: 'get'
  })
}

// 新增吊装作业级别
export function addHoistingworkLevel(data) {
  return request({
    url: '/safework/hoistingworkLevel',
    method: 'post',
    data: data
  })
}

// 修改吊装作业级别
export function updateHoistingworkLevel(data) {
  return request({
    url: '/safework/hoistingworkLevel',
    method: 'put',
    data: data
  })
}

// 删除吊装作业级别
export function delHoistingworkLevel(id) {
  return request({
    url: '/safework/hoistingworkLevel/' + id,
    method: 'delete'
  })
}
