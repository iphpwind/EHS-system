import request from '@/utils/request'

// 查询单元巡检任务列表
export function listTask(query) {
  return request({
    url: '/unitManage/task/list',
    method: 'get',
    params: query
  })
}

// 查询单元巡检任务详细
export function getTask(taskId) {
  return request({
    url: '/unitManage/task/' + taskId,
    method: 'get'
  })
}

// 新增单元巡检任务
export function addTask(data) {
  return request({
    url: '/unitManage/task',
    method: 'post',
    data: data
  })
}

// 修改单元巡检任务
export function updateTask(data) {
  return request({
    url: '/unitManage/task',
    method: 'put',
    data: data
  })
}

// 删除单元巡检任务
export function delTask(taskId) {
  return request({
    url: '/unitManage/task/' + taskId,
    method: 'delete'
  })
}
