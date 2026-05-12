import request from '@/utils/request'

// 查询奖惩规则列表
export function listRpbase(query) {
  return request({
    url: '/safework/rpbase/list',
    method: 'get',
    params: query
  })
}

// 查询奖惩规则详细
export function getRpbase(id) {
  return request({
    url: '/safework/rpbase/' + id,
    method: 'get'
  })
}

// 新增奖惩规则
export function addRpbase(data) {
  return request({
    url: '/safework/rpbase',
    method: 'post',
    data: data
  })
}

// 修改奖惩规则
export function updateRpbase(data) {
  return request({
    url: '/safework/rpbase',
    method: 'put',
    data: data
  })
}

// 删除奖惩规则
export function delRpbase(id) {
  return request({
    url: '/safework/rpbase/' + id,
    method: 'delete'
  })
}
