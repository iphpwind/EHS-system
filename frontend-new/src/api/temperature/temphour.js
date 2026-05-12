import request from '@/utils/request'

// 查询每小时测温情况列表
export function listTemphour(query) {
  return request({
    url: '/temperature/temphour/list',
    method: 'get',
    params: query
  })
}

export function hourlist(query) {
  return request({
    url: '/temperature/temphour/hourlist',
    method: 'post',
    params: query
  })
}
export function exportexcel(query) {
  return request({
    url: '/temperature/temphour/exportexcel',
    method: 'post',
    params: query
  })
}

// 查询每小时测温情况详细
export function getTemphour(id) {
  return request({
    url: '/temperature/temphour/' + id,
    method: 'get'
  })
}

// 新增每小时测温情况
export function addTemphour(data) {
  return request({
    url: '/temperature/temphour',
    method: 'post',
    data: data
  })
}

// 修改每小时测温情况
export function updateTemphour(data) {
  return request({
    url: '/temperature/temphour',
    method: 'put',
    data: data
  })
}

// 删除每小时测温情况
export function delTemphour(id) {
  return request({
    url: '/temperature/temphour/' + id,
    method: 'delete'
  })
}
