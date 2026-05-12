import request from '@/utils/request'

// 查询法律法规分类字典列表
export function listLawType(query) {
  return request({
    url: '/safework/lawType/list',
    method: 'get',
    params: query
  })
}

// 查询法律法规分类字典详细
export function getLawType(id) {
  return request({
    url: '/safework/lawType/' + id,
    method: 'get'
  })
}

// 新增法律法规分类字典
export function addLawType(data) {
  return request({
    url: '/safework/lawType',
    method: 'post',
    data: data
  })
}

// 修改法律法规分类字典
export function updateLawType(data) {
  return request({
    url: '/safework/lawType',
    method: 'put',
    data: data
  })
}

// 删除法律法规分类字典
export function delLawType(id) {
  return request({
    url: '/safework/lawType/' + id,
    method: 'delete'
  })
}
