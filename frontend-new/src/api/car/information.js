import request from '@/utils/request'

// 查询车辆信息列表
export function listInformation(query) {
  return request({
    url: '/car/information/list',
    method: 'get',
    params: query
  })
}

// 查询车辆信息详细
export function getInformation(id) {
  return request({
    url: '/car/information/' + id,
    method: 'get'
  })
}

// 新增车辆信息
export function addInformation(data) {
  return request({
    url: '/car/information',
    method: 'post',
    data: data
  })
}

// 修改车辆信息
export function updateInformation(data) {
  return request({
    url: '/car/information',
    method: 'put',
    data: data
  })
}

// 删除车辆信息
export function delInformation(id) {
  return request({
    url: '/car/information/' + id,
    method: 'delete'
  })
}
