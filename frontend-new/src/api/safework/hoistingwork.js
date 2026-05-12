import request from '@/utils/request'

// 查询吊装作业列表
export function listHoistingwork(query) {
  return request({
    url: '/safework/hoistingwork/list',
    method: 'get',
    params: query
  })
}

// 查询吊装作业列表
export function listHoistingwork2(query) {
  return request({
    url: '/safework/hoistingwork/list2',
    method: 'get',
    params: query
  })
}

// 查询吊装作业详细
export function getHoistingwork(id) {
  return request({
    url: '/safework/hoistingwork/' + id,
    method: 'get'
  })
}

// 新增吊装作业
export function addHoistingwork(data) {
  return request({
    url: '/safework/hoistingwork',
    method: 'post',
    data: data
  })
}

// 修改吊装作业
export function updateHoistingwork(data) {
  return request({
    url: '/safework/hoistingwork',
    method: 'put',
    data: data
  })
}

// 作废吊装作业
export function updateStatus(data) {
  return request({
    url: '/safework/hoistingwork/updateStatus',
    method: 'put',
    data: data
  })
}

// 删除吊装作业
export function delHoistingwork(id) {
  return request({
    url: '/safework/hoistingwork/' + id,
    method: 'delete'
  })
}
