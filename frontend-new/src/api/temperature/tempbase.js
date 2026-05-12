import request from '@/utils/request'

// 查询测温基础矫正列表
export function listTempbase(query) {
  return request({
    url: '/temperature/tempbase/list',
    method: 'get',
    params: query
  })
}

// 查询测温基础矫正详细
export function getTempbase(id) {
  return request({
    url: '/temperature/tempbase/' + id,
    method: 'get'
  })
}

// 新增测温基础矫正
export function addTempbase(data) {
  return request({
    url: '/temperature/tempbase',
    method: 'post',
    data: data
  })
}

// 修改测温基础矫正
export function updateTempbase(data) {
  return request({
    url: '/temperature/tempbase',
    method: 'put',
    data: data
  })
}

// 删除测温基础矫正
export function delTempbase(id) {
  return request({
    url: '/temperature/tempbase/' + id,
    method: 'delete'
  })
}
