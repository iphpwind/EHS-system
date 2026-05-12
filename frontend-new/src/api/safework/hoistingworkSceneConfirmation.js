import request from '@/utils/request'

// 查询吊装作业现场确认内容列表
export function listHoistingworkSceneConfirmation(query) {
  return request({
    url: '/safework/hoistingworkSceneConfirmation/list',
    method: 'get',
    params: query
  })
}

// 查询吊装作业现场确认内容详细
export function getHoistingworkSceneConfirmation(id) {
  return request({
    url: '/safework/hoistingworkSceneConfirmation/' + id,
    method: 'get'
  })
}

// 新增吊装作业现场确认内容
export function addHoistingworkSceneConfirmation(data) {
  return request({
    url: '/safework/hoistingworkSceneConfirmation',
    method: 'post',
    data: data
  })
}

// 修改吊装作业现场确认内容
export function updateHoistingworkSceneConfirmation(data) {
  return request({
    url: '/safework/hoistingworkSceneConfirmation',
    method: 'put',
    data: data
  })
}

// 删除吊装作业现场确认内容
export function delHoistingworkSceneConfirmation(id) {
  return request({
    url: '/safework/hoistingworkSceneConfirmation/' + id,
    method: 'delete'
  })
}
