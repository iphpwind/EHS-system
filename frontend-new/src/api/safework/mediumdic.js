import request from '@/utils/request'

// 查询介质列表
export function listMediumdic(query) {
  return request({
    url: '/safework/mediumdic/list',
    method: 'get',
    params: query
  })
}

// 查询介质详细
export function getMediumdic(id) {
  return request({
    url: '/safework/mediumdic/' + id,
    method: 'get'
  })
}

// 新增介质
export function addMediumdic(data) {
  return request({
    url: '/safework/mediumdic',
    method: 'post',
    data: data
  })
}

// 修改介质
export function updateMediumdic(data) {
  return request({
    url: '/safework/mediumdic',
    method: 'put',
    data: data
  })
}

// 删除介质
export function delMediumdic(id) {
  return request({
    url: '/safework/mediumdic/' + id,
    method: 'delete'
  })
}
