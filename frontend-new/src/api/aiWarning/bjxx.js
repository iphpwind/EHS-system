import request from '@/utils/request'

// 查询告警信息列表
export function listBjxx(query) {
  return request({
    url: '/aiWarning/bjxx/list',
    method: 'get',
    params: query
  })
}

export function selectLxList(query) {
  return request({
    url: '/aiWarning/bjxx/selectLxList',
    method: 'get',
    params: query
  })
}


export function selectDateBjxx(query) {
  return request({
    url: '/aiWarning/bjxx/selectDateBjxx',
    method: 'get',
    params: query
  })
}
export function selectDayBjxx(query) {
  return request({
    url: '/aiWarning/bjxx/selectDayBjxx',
    method: 'get',
    params: query
  })
}

export function selectLxBjxx(query) {
  return request({
    url: '/aiWarning/bjxx/selectLxBjxx',
    method: 'get',
    params: query
  })
}

export function selectTdBjxx(query) {
  return request({
    url: '/aiWarning/bjxx/selectTdBjxx',
    method: 'get',
    params: query
  })
}


// 查询告警信息详细
export function getBjxx(id) {
  return request({
    url: '/aiWarning/bjxx/' + id,
    method: 'get'
  })
}

// 新增告警信息
export function addBjxx(data) {
  return request({
    url: '/aiWarning/bjxx',
    method: 'post',
    data: data
  })
}

// 修改告警信息
export function updateBjxx(data) {
  return request({
    url: '/aiWarning/bjxx',
    method: 'put',
    data: data
  })
}
export function plupdateHkBjxx(data) {
  return request({
    url: '/aiWarning/bjxx/plupdate',
    method: 'post',
    data: data
  })
}


// 删除告警信息
export function delBjxx(id) {
  return request({
    url: '/aiWarning/bjxx/' + id,
    method: 'delete'
  })
}
