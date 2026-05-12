import request from '@/utils/request'

// 查询线上教育-题库列表
export function listPaper_question(query) {
  return request({
    url: '/safework/paper_question/list',
    method: 'get',
    params: query
  })
}

// 查询线上教育-题库详细
export function getPaper_question(id) {
  return request({
    url: '/safework/paper_question/' + id,
    method: 'get'
  })
}

// 新增线上教育-题库
export function addPaper_question(data) {
  return request({
    url: '/safework/paper_question',
    method: 'post',
    data: data
  })
}

// 修改线上教育-题库
export function updatePaper_question(data) {
  return request({
    url: '/safework/paper_question',
    method: 'put',
    data: data
  })
}

// 删除线上教育-题库
export function delPaper_question(id) {
  return request({
    url: '/safework/paper_question/' + id,
    method: 'delete'
  })
}
