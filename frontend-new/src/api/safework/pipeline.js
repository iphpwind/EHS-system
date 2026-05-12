import request from '@/utils/request'

// 查询设备管道列表
export function listPipeline(query) {
  return request({
    url: '/safework/pipeline/list',
    method: 'get',
    params: query
  })
}

// 查询设备管道详细
export function getPipeline(id) {
  return request({
    url: '/safework/pipeline/' + id,
    method: 'get'
  })
}

// 新增设备管道
export function addPipeline(data) {
  return request({
    url: '/safework/pipeline',
    method: 'post',
    data: data
  })
}

// 修改设备管道
export function updatePipeline(data) {
  return request({
    url: '/safework/pipeline',
    method: 'put',
    data: data
  })
}

// 删除设备管道
export function delPipeline(id) {
  return request({
    url: '/safework/pipeline/' + id,
    method: 'delete'
  })
}
