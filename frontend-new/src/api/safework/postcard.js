import request from '@/utils/request'

// 查询岗位告知卡列表
export function listPostcard(query) {
  return request({
    url: '/safework/postcard/list',
    method: 'get',
    params: query
  })
}

// 查询岗位告知卡详细
export function getPostcard(id) {
  return request({
    url: '/safework/postcard/' + id,
    method: 'get'
  })
}

// 新增岗位告知卡
export function addPostcard(data) {
  return request({
    url: '/safework/postcard',
    method: 'post',
    data: data
  })
}
export function publish(data) {
  return request({
    url: '/safework/postcard/publish',
    method: 'post',
    data: data
  })
}

// 修改岗位告知卡
export function updatePostcard(data) {
  return request({
    url: '/safework/postcard',
    method: 'put',
    data: data
  })
}

// 删除岗位告知卡
export function delPostcard(id) {
  return request({
    url: '/safework/postcard/' + id,
    method: 'delete'
  })
}
