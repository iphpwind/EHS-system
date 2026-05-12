import request from '@/utils/request'

// 查询线上教育-试卷题目列表
export function listPaper_question_selection(query) {
  return request({
    url: '/safework/paper_question_selection/list',
    method: 'get',
    params: query
  })
}
export function getAllQuestionByPaperQuestionIds(query) {
  return request({
    url: '/safework/paper_question_selection/getAllQuestionByPaperQuestionIds',
    method: 'get',
    params: query
  })
}

// 查询线上教育-试卷题目详细
export function getPaper_question_selection(id) {
  return request({
    url: '/safework/paper_question_selection/' + id,
    method: 'get'
  })
}

// 新增线上教育-试卷题目
export function addPaper_question_selection(data) {
  return request({
    url: '/safework/paper_question_selection',
    method: 'post',
    data: data
  })
}

// 修改线上教育-试卷题目
export function updatePaper_question_selection(data) {
  return request({
    url: '/safework/paper_question_selection',
    method: 'put',
    data: data
  })
}

// 删除线上教育-试卷题目
export function delPaper_question_selection(id) {
  return request({
    url: '/safework/paper_question_selection/' + id,
    method: 'delete'
  })
}
