import request from '@/utils/request'

// 查询设备点检任务列表
export function listSpotCheckTask(query) {
  return request({
    url: '/equipment/spotCheckTask/list',
    method: 'get',
    params: query
  })
}

// 查询设备点检任务详细
export function getSpotCheckTask(id) {
  return request({
    url: '/equipment/spotCheckTask/' + id,
    method: 'get'
  })
}

// 新增设备点检任务
export function addSpotCheckTask(data) {
  return request({
    url: '/equipment/spotCheckTask',
    method: 'post',
    data: data
  })
}

// 修改设备点检任务
export function updateSpotCheckTask(data) {
  return request({
    url: '/equipment/spotCheckTask',
    method: 'put',
    data: data
  })
}

// 删除设备点检任务
export function delSpotCheckTask(id) {
  return request({
    url: '/equipment/spotCheckTask/' + id,
    method: 'delete'
  })
}
