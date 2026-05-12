import request from '@/utils/request'

// 查询试卷作答列表
export function listAnswer(query) {
  return request({
    url: '/safework/answer/list',
    method: 'get',
    params: query
  })
}

// 查询试卷作答详细
export function getAnswer(id) {
  return request({
    url: '/safework/answer/' + id,
    method: 'get'
  })
}

// 新增试卷作答
export function addAnswer(data) {
  return request({
    url: '/safework/answer',
    method: 'post',
    data: data
  })
}

// 修改试卷作答
export function updateAnswer(data) {
  return request({
    url: '/safework/answer',
    method: 'put',
    data: data
  })
}

// 删除试卷作答
export function delAnswer(id) {
  return request({
    url: '/safework/answer/' + id,
    method: 'delete'
  })
}
// 获取考试结果
export function getTestResultsByPaperId(query) {
  return request({
    url: '/safework/answer/getTestResultsByPaperId',
    method: 'get',
    params: query
  })
}