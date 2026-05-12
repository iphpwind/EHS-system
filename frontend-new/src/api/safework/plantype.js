import request from '@/utils/request'

// 查询应急管理-预案类别字典列表
export function listPlantype(query) {
  return request({
    url: '/safework/plantype/list',
    method: 'get',
    params: query
  })
}

// 查询应急管理-预案类别字典详细
export function getPlantype(id) {
  return request({
    url: '/safework/plantype/' + id,
    method: 'get'
  })
}

// 新增应急管理-预案类别字典
export function addPlantype(data) {
  return request({
    url: '/safework/plantype',
    method: 'post',
    data: data
  })
}

// 修改应急管理-预案类别字典
export function updatePlantype(data) {
  return request({
    url: '/safework/plantype',
    method: 'put',
    data: data
  })
}

// 删除应急管理-预案类别字典
export function delPlantype(id) {
  return request({
    url: '/safework/plantype/' + id,
    method: 'delete'
  })
}
