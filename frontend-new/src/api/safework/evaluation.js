import request from '@/utils/request'

// 查询trainingEvaluation列表
export function listEvaluation(query) {
  return request({
    url: '/safework/evaluation/list',
    method: 'get',
    params: query
  })
}

// 查询trainingEvaluation详细
export function getEvaluation(id) {
  return request({
    url: '/safework/evaluation/' + id,
    method: 'get'
  })
}

// 新增trainingEvaluation
export function addEvaluation(data) {
  return request({
    url: '/safework/evaluation',
    method: 'post',
    data: data
  })
}

// 修改trainingEvaluation
export function updateEvaluation(data) {
  return request({
    url: '/safework/evaluation',
    method: 'put',
    data: data
  })
}

// 删除trainingEvaluation
export function delEvaluation(id) {
  return request({
    url: '/safework/evaluation/' + id,
    method: 'delete'
  })
}

// 查询trainingEvaluation详细
export function getTestEvaluationInfoByTestResultId(id) {
  return request({
    url: '/safework/evaluation/getTestEvaluationInfoByTestResultId/' + id,
    method: 'get'
  })
}
