import request from '@/utils/request'

// 查询测温列表
export function listTemperature(query) {
  return request({
    url: '/temperature/temperature/list',
    method: 'get',
    params: query
  })
}
// 查询测温列表
export function getWendudata(query) {
  return request({
    url: '/temperature/temperature/wendudata',
    method: 'post',
    params: query
  })
}

// 查询测温详细
export function getTemperature(tId) {
  return request({
    url: '/temperature/temperature/' + tId,
    method: 'get'
  })
}

// 新增测温
export function addTemperature(data) {
  return request({
    url: '/temperature/temperature',
    method: 'post',
    data: data
  })
}

// 修改测温
export function updateTemperature(data) {
  return request({
    url: '/temperature/temperature',
    method: 'put',
    data: data
  })
}

// 删除测温
export function delTemperature(tId) {
  return request({
    url: '/temperature/temperature/' + tId,
    method: 'delete'
  })
}
