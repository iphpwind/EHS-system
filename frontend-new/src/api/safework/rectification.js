import request from '@/utils/request'

// 查询隐患整改中列表
export function listRectification(query) {
  return request({
    url: '/safework/rectification/list',
    method: 'get',
    params: query
  })
}

// 查询隐患整改中详细
export function getRectification(id) {
  return request({
    url: '/safework/rectification/' + id,
    method: 'get'
  })
}

// 新增隐患整改中
export function addRectification(data) {
  return request({
    url: '/safework/rectification',
    method: 'post',
    data: data
  })
}

// 修改隐患整改中
export function updateRectification(data) {
  return request({
    url: '/safework/rectification',
    method: 'put',
    data: data
  })
}

// 删除隐患整改中
export function delRectification(id) {
  return request({
    url: '/safework/rectification/' + id,
    method: 'delete'
  })
}
