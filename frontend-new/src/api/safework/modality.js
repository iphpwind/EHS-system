import request from '@/utils/request'

// 查询应急演练-演练形式字典列表
export function listModality(query) {
  return request({
    url: '/safework/modality/list',
    method: 'get',
    params: query
  })
}

// 查询应急演练-演练形式字典详细
export function getModality(id) {
  return request({
    url: '/safework/modality/' + id,
    method: 'get'
  })
}

// 新增应急演练-演练形式字典
export function addModality(data) {
  return request({
    url: '/safework/modality',
    method: 'post',
    data: data
  })
}

// 修改应急演练-演练形式字典
export function updateModality(data) {
  return request({
    url: '/safework/modality',
    method: 'put',
    data: data
  })
}

// 删除应急演练-演练形式字典
export function delModality(id) {
  return request({
    url: '/safework/modality/' + id,
    method: 'delete'
  })
}
