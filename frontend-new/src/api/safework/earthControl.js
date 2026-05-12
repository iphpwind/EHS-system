import request from '@/utils/request'

// 查询动土作业监护人列表
export function listEarthControl(query) {
  return request({
    url: '/safework/earthControl/list',
    method: 'get',
    params: query
  })
}

// 查询动土作业监护人详细
export function getEarthControl(id) {
  return request({
    url: '/safework/earthControl/' + id,
    method: 'get'
  })
}

// 新增动土作业监护人
export function addEarthControl(data) {
  return request({
    url: '/safework/earthControl',
    method: 'post',
    data: data
  })
}

// 修改动土作业监护人
export function updateEarthControl(data) {
  return request({
    url: '/safework/earthControl',
    method: 'put',
    data: data
  })
}

// 删除动土作业监护人
export function delEarthControl(id) {
  return request({
    url: '/safework/earthControl/' + id,
    method: 'delete'
  })
}
