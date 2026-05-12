import request from '@/utils/request'

// 查询访问事由字典列表
export function listVisitDic(query) {
  return request({
    url: '/safework/visitDic/list',
    method: 'get',
    params: query
  })
}

// 查询访问事由字典详细
export function getVisitDic(id) {
  return request({
    url: '/safework/visitDic/' + id,
    method: 'get'
  })
}

// 新增访问事由字典
export function addVisitDic(data) {
  return request({
    url: '/safework/visitDic',
    method: 'post',
    data: data
  })
}

// 修改访问事由字典
export function updateVisitDic(data) {
  return request({
    url: '/safework/visitDic',
    method: 'put',
    data: data
  })
}

// 删除访问事由字典
export function delVisitDic(id) {
  return request({
    url: '/safework/visitDic/' + id,
    method: 'delete'
  })
}
