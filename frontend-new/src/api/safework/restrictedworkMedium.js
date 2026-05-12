import request from '@/utils/request'

// 查询受限空间内原有介质列表
export function listRestrictedworkMedium(query) {
  return request({
    url: '/safework/restrictedworkMedium/list',
    method: 'get',
    params: query
  })
}

// 查询受限空间内原有介质详细
export function getRestrictedworkMedium(id) {
  return request({
    url: '/safework/restrictedworkMedium/' + id,
    method: 'get'
  })
}

// 新增受限空间内原有介质
export function addRestrictedworkMedium(data) {
  return request({
    url: '/safework/restrictedworkMedium',
    method: 'post',
    data: data
  })
}

// 修改受限空间内原有介质
export function updateRestrictedworkMedium(data) {
  return request({
    url: '/safework/restrictedworkMedium',
    method: 'put',
    data: data
  })
}

// 删除受限空间内原有介质
export function delRestrictedworkMedium(id) {
  return request({
    url: '/safework/restrictedworkMedium/' + id,
    method: 'delete'
  })
}
