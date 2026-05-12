import request from '@/utils/request'

// 查询作业票编码规则列表
export function listCodeRules(query) {
  return request({
    url: '/safework/codeRules/list',
    method: 'get',
    params: query
  })
}

// 查询作业票编码规则详细
export function getCodeRules(id) {
  return request({
    url: '/safework/codeRules/' + id,
    method: 'get'
  })
}

// 新增作业票编码规则
export function addCodeRules(data) {
  return request({
    url: '/safework/codeRules',
    method: 'post',
    data: data
  })
}

// 修改作业票编码规则
export function updateCodeRules(data) {
  return request({
    url: '/safework/codeRules',
    method: 'put',
    data: data
  })
}

// 删除作业票编码规则
export function delCodeRules(id) {
  return request({
    url: '/safework/codeRules/' + id,
    method: 'delete'
  })
}
