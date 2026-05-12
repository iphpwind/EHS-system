import request from '@/utils/request'

// 查询应急通讯列表
export function listInner(query) {
  return request({
    url: '/safework/inner/list',
    method: 'get',
    params: query
  })
}

// 查询应急通讯详细
export function getInner(id) {
  return request({
    url: '/safework/inner/' + id,
    method: 'get'
  })
}

// 新增应急通讯
export function addInner(data) {
  return request({
    url: '/safework/inner',
    method: 'post',
    data: data
  })
}

// 修改应急通讯
export function updateInner(data) {
  return request({
    url: '/safework/inner',
    method: 'put',
    data: data
  })
}

// 删除应急通讯
export function delInner(id) {
  return request({
    url: '/safework/inner/' + id,
    method: 'delete'
  })
}
