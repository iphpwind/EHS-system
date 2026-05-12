import request from '@/utils/request'

// 查询隐患排查内容列表
export function listContent(query) {
  return request({
    url: '/safework/content/list',
    method: 'get',
    params: query
  })
}

// 查询隐患排查内容列表
export function listByObjectAndPlan(query) {
  return request({
    url: '/safework/content/listByObjectAndPlan',
    method: 'get',
    params: query
  })
}

// 查询隐患排查内容详细
export function getContent(id) {
  return request({
    url: '/safework/content/' + id,
    method: 'get'
  })
}

// 新增隐患排查内容
export function addContent(data) {
  return request({
    url: '/safework/content',
    method: 'post',
    data: data
  })
}

// 修改隐患排查内容
export function updateContent(data) {
  return request({
    url: '/safework/content',
    method: 'put',
    data: data
  })
}

// 删除隐患排查内容
export function delContent(id) {
  return request({
    url: '/safework/content/' + id,
    method: 'delete'
  })
}
