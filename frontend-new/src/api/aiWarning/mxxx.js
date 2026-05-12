import request from '@/utils/request'

// 查询模型信息列表
export function listMxxx(query) {
  return request({
    url: '/aiWarning/mxxx/list',
    method: 'get',
    params: query
  })
}

// 查询模型信息详细
export function getMxxx(mxId) {
  return request({
    url: '/aiWarning/mxxx/' + mxId,
    method: 'get'
  })
}

// 新增模型信息
export function addMxxx(data) {
  return request({
    url: '/aiWarning/mxxx',
    method: 'post',
    data: data
  })
}

// 修改模型信息
export function updateMxxx(data) {
  return request({
    url: '/aiWarning/mxxx',
    method: 'put',
    data: data
  })
}

// 删除模型信息
export function delMxxx(mxId) {
  return request({
    url: '/aiWarning/mxxx/' + mxId,
    method: 'delete'
  })
}
