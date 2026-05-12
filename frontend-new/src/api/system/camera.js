import request from '@/utils/request'

// 查询摄像头配置列表
export function listCamera(query) {
  return request({
    url: '/positioning/camera/list',
    method: 'get',
    params: query
  })
}

// 查询摄像头配置详细
export function getCamera(id) {
  return request({
    url: '/positioning/camera/' + id,
    method: 'get'
  })
}

// 新增摄像头配置
export function addCamera(data) {
  return request({
    url: '/positioning/camera',
    method: 'post',
    data: data
  })
}

// 修改摄像头配置
export function updateCamera(data) {
  return request({
    url: '/positioning/camera',
    method: 'put',
    data: data
  })
}

// 删除摄像头配置
export function delCamera(id) {
  return request({
    url: '/positioning/camera/' + id,
    method: 'delete'
  })
}
