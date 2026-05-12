import request from '@/utils/request'

// 查询每日测温情况列表
export function listTempday(query) {
  return request({
    url: '/temperature/tempday/list',
    method: 'get',
    params: query
  })
}

// 查询每日测温情况详细
export function getTempday(id) {
  return request({
    url: '/temperature/tempday/' + id,
    method: 'get'
  })
}

// 新增每日测温情况
export function addTempday(data) {
  return request({
    url: '/temperature/tempday',
    method: 'post',
    data: data
  })
}

// 修改每日测温情况
export function updateTempday(data) {
  return request({
    url: '/temperature/tempday',
    method: 'put',
    data: data
  })
}

// 删除每日测温情况
export function delTempday(id) {
  return request({
    url: '/temperature/tempday/' + id,
    method: 'delete'
  })
}
