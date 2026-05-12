import request from '@/utils/request'

// 查询动土作业票现场确认部门人员列表
export function listEarthSceneUser(query) {
  return request({
    url: '/safework/earthSceneUser/list',
    method: 'get',
    params: query
  })
}

// 查询动土作业票现场确认部门人员详细
export function getEarthSceneUser(id) {
  return request({
    url: '/safework/earthSceneUser/' + id,
    method: 'get'
  })
}

// 新增动土作业票现场确认部门人员
export function addEarthSceneUser(data) {
  return request({
    url: '/safework/earthSceneUser',
    method: 'post',
    data: data
  })
}

// 修改动土作业票现场确认部门人员
export function updateEarthSceneUser(data) {
  return request({
    url: '/safework/earthSceneUser',
    method: 'put',
    data: data
  })
}

// 删除动土作业票现场确认部门人员
export function delEarthSceneUser(id) {
  return request({
    url: '/safework/earthSceneUser/' + id,
    method: 'delete'
  })
}
