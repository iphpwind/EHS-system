import request from '@/utils/request'

// 查询隐患评估列表
export function listAssessment(query) {
  return request({
    url: '/safework/assessment/list',
    method: 'get',
    params: query
  })
}

// 查询隐患评估详细
export function getAssessment(id) {
  return request({
    url: '/safework/assessment/' + id,
    method: 'get'
  })
}

// 新增隐患评估
export function addAssessment(data) {
  return request({
    url: '/safework/assessment',
    method: 'post',
    data: data
  })
}

// 修改隐患评估
export function updateAssessment(data) {
  return request({
    url: '/safework/assessment',
    method: 'put',
    data: data
  })
}

// 删除隐患评估
export function delAssessment(id) {
  return request({
    url: '/safework/assessment/' + id,
    method: 'delete'
  })
}
