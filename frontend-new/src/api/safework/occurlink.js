import request from '@/utils/request'

// 查询发生环节字典列表
export function listOccurlink(query) {
  return request({
    url: '/safework/occurlink/list',
    method: 'get',
    params: query
  })
}

// 查询发生环节字典详细
export function getOccurlink(id) {
  return request({
    url: '/safework/occurlink/' + id,
    method: 'get'
  })
}

// 新增发生环节字典
export function addOccurlink(data) {
  return request({
    url: '/safework/occurlink',
    method: 'post',
    data: data
  })
}

// 修改发生环节字典
export function updateOccurlink(data) {
  return request({
    url: '/safework/occurlink',
    method: 'put',
    data: data
  })
}

// 删除发生环节字典
export function delOccurlink(id) {
  return request({
    url: '/safework/occurlink/' + id,
    method: 'delete'
  })
}
