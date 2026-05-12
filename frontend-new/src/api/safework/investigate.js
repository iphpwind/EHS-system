import request from '@/utils/request'

// 查询隐患排查类型字典列表
export function listInvestigate(query) {
  return request({
    url: '/safework/investigate/list',
    method: 'get',
    params: query
  })
}

// 查询隐患排查类型字典详细
export function getInvestigate(id) {
  return request({
    url: '/safework/investigate/' + id,
    method: 'get'
  })
}

// 新增隐患排查类型字典
export function addInvestigate(data) {
  return request({
    url: '/safework/investigate',
    method: 'post',
    data: data
  })
}

// 修改隐患排查类型字典
export function updateInvestigate(data) {
  return request({
    url: '/safework/investigate',
    method: 'put',
    data: data
  })
}

// 删除隐患排查类型字典
export function delInvestigate(id) {
  return request({
    url: '/safework/investigate/' + id,
    method: 'delete'
  })
}
