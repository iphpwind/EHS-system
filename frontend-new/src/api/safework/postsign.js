import request from '@/utils/request'

// 查询岗位告知卡接收人签名列表
export function listPostsign(query) {
  return request({
    url: '/safework/postsign/list',
    method: 'get',
    params: query
  })
}

// 查询岗位告知卡接收人签名详细
export function getPostsign(id) {
  return request({
    url: '/safework/postsign/' + id,
    method: 'get'
  })
}

// 新增岗位告知卡接收人签名
export function addPostsign(data) {
  return request({
    url: '/safework/postsign',
    method: 'post',
    data: data
  })
}

// 新增岗位告知卡承诺人签字
export function batchAdd(data) {
  return request({
    url: '/safework/postsign/batchAdd',
    method: 'post',
    data: data
  })
}

// 修改岗位告知卡接收人签名
export function updatePostsign(data) {
  return request({
    url: '/safework/postsign',
    method: 'put',
    data: data
  })
}

// 删除岗位告知卡接收人签名
export function delPostsign(id) {
  return request({
    url: '/safework/postsign/' + id,
    method: 'delete'
  })
}
