import request from '@/utils/request'

// 查询作业证模板和字典操作员关联列表
export function listTemplateDicUsers(query) {
  return request({
    url: '/safework/templateDicUsers/list',
    method: 'get',
    params: query
  })
}

// 查询作业证模板和字典操作员关联详细
export function getTemplateDicUsers(id) {
  return request({
    url: '/safework/templateDicUsers/' + id,
    method: 'get'
  })
}

// 新增作业证模板和字典操作员关联
export function addTemplateDicUsers(data) {
  return request({
    url: '/safework/templateDicUsers',
    method: 'post',
    data: data
  })
}

// 修改作业证模板和字典操作员关联
export function updateTemplateDicUsers(data) {
  return request({
    url: '/safework/templateDicUsers',
    method: 'put',
    data: data
  })
}

// 删除作业证模板和字典操作员关联
export function delTemplateDicUsers(id) {
  return request({
    url: '/safework/templateDicUsers/' + id,
    method: 'delete'
  })
}
