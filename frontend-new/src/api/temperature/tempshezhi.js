import request from '@/utils/request'

// 查询测温基础设置列表
export function listTempshezhi(query) {
  return request({
    url: '/temperature/tempshezhi/list',
    method: 'get',
    params: query
  })
}

// 查询测温基础设置详细
export function getTempshezhi(id) {
  return request({
    url: '/temperature/tempshezhi/' + id,
    method: 'get'
  })
}

// 新增测温基础设置
export function addTempshezhi(data) {
  return request({
    url: '/temperature/tempshezhi',
    method: 'post',
    data: data
  })
}

// 修改测温基础设置
export function updateTempshezhi(data) {
  return request({
    url: '/temperature/tempshezhi',
    method: 'put',
    data: data
  })
}

// 删除测温基础设置
export function delTempshezhi(id) {
  return request({
    url: '/temperature/tempshezhi/' + id,
    method: 'delete'
  })
}
