import request from '@/utils/request'

// 查询作业验收字典列表
export function listCheckDic(query) {
  return request({
    url: '/safework/checkDic/list',
    method: 'get',
    params: query
  })
}

// 查询作业验收字典详细
export function getCheckDic(id) {
  return request({
    url: '/safework/checkDic/' + id,
    method: 'get'
  })
}

// 新增作业验收字典
export function addCheckDic(data) {
  return request({
    url: '/safework/checkDic',
    method: 'post',
    data: data
  })
}

// 修改作业验收字典
export function updateCheckDic(data) {
  return request({
    url: '/safework/checkDic',
    method: 'put',
    data: data
  })
}

// 删除作业验收字典
export function delCheckDic(id) {
  return request({
    url: '/safework/checkDic/' + id,
    method: 'delete'
  })
}
