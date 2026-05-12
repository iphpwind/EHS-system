import request from '@/utils/request'

// 查询动土作业现场确认内容详情列表
export function listEarthSceneContent(query) {
  return request({
    url: '/safework/earthSceneContent/list',
    method: 'get',
    params: query
  })
}

// 查询动土作业现场确认内容详情详细
export function getEarthSceneContent(id) {
  return request({
    url: '/safework/earthSceneContent/' + id,
    method: 'get'
  })
}

// 新增动土作业现场确认内容详情
export function addEarthSceneContent(data) {
  return request({
    url: '/safework/earthSceneContent',
    method: 'post',
    data: data
  })
}

// 修改动土作业现场确认内容详情
export function updateEarthSceneContent(data) {
  return request({
    url: '/safework/earthSceneContent',
    method: 'put',
    data: data
  })
}

// 删除动土作业现场确认内容详情
export function delEarthSceneContent(id) {
  return request({
    url: '/safework/earthSceneContent/' + id,
    method: 'delete'
  })
}
