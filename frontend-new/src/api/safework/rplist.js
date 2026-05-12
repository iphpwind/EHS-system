import request from '@/utils/request'

// 查询奖惩列列表
export function listRplist(query) {
  return request({
    url: '/safework/rplist/list',
    method: 'get',
    params: query
  })
}
export function sumRplist(query) {
  return request({
    url: '/safework/rplist/sumlist',
    method: 'get',
    params: query
  })
}

// 查询奖惩列详细
export function getRplist(id) {
  return request({
    url: '/safework/rplist/' + id,
    method: 'get'
  })
}

// 新增奖惩列
export function addRplist(data) {
  return request({
    url: '/safework/rplist',
    method: 'post',
    data: data
  })
}

// 修改奖惩列
export function updateRplist(data) {
  return request({
    url: '/safework/rplist',
    method: 'put',
    data: data
  })
}

// 删除奖惩列
export function delRplist(id) {
  return request({
    url: '/safework/rplist/' + id,
    method: 'delete'
  })
}
