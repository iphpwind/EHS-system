import request from '@/utils/request'

// 查询应急管理-预案级别字典列表
export function listPlanlevel(query) {
  return request({
    url: '/safework/planlevel/list',
    method: 'get',
    params: query
  })
}

// 查询应急管理-预案级别字典详细
export function getPlanlevel(id) {
  return request({
    url: '/safework/planlevel/' + id,
    method: 'get'
  })
}

// 新增应急管理-预案级别字典
export function addPlanlevel(data) {
  return request({
    url: '/safework/planlevel',
    method: 'post',
    data: data
  })
}

// 修改应急管理-预案级别字典
export function updatePlanlevel(data) {
  return request({
    url: '/safework/planlevel',
    method: 'put',
    data: data
  })
}

// 删除应急管理-预案级别字典
export function delPlanlevel(id) {
  return request({
    url: '/safework/planlevel/' + id,
    method: 'delete'
  })
}
