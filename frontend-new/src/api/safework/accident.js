import request from '@/utils/request'

// 查询双重预防-事故类别字典列表
export function listAccident(query) {
  return request({
    url: '/safework/accident/list',
    method: 'get',
    params: query
  })
}

// 查询双重预防-事故类别字典详细
export function getAccident(id) {
  return request({
    url: '/safework/accident/' + id,
    method: 'get'
  })
}

// 新增双重预防-事故类别字典
export function addAccident(data) {
  return request({
    url: '/safework/accident',
    method: 'post',
    data: data
  })
}

// 修改双重预防-事故类别字典
export function updateAccident(data) {
  return request({
    url: '/safework/accident',
    method: 'put',
    data: data
  })
}

// 删除双重预防-事故类别字典
export function delAccident(id) {
  return request({
    url: '/safework/accident/' + id,
    method: 'delete'
  })
}
