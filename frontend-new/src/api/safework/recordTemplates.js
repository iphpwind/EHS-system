import request from '@/utils/request'

// 查询记录模板列表
export function listRecordTemplates(query) {
  return request({
    url: '/safework/recordTemplates/list',
    method: 'get',
    params: query
  })
}

// 查询记录模板详细
export function getRecordTemplates(templateId) {
  return request({
    url: '/safework/recordTemplates/' + templateId,
    method: 'get'
  })
}

// 新增记录模板
export function addRecordTemplates(data) {
  return request({
    url: '/safework/recordTemplates',
    method: 'post',
    data: data
  })
}

// 修改记录模板
export function updateRecordTemplates(data) {
  return request({
    url: '/safework/recordTemplates',
    method: 'put',
    data: data
  })
}

// 删除记录模板
export function delRecordTemplates(templateId) {
  return request({
    url: '/safework/recordTemplates/' + templateId,
    method: 'delete'
  })
}
