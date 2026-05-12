import request from '@/utils/request'

// 查询线上教育-试卷列表
export function listPaper(query) {
  return request({
    url: '/safework/paper/list',
    method: 'get',
    params: query
  })
}

// 查询线上教育-试卷详细
export function getPaper(id) {
  return request({
    url: '/safework/paper/' + id,
    method: 'get'
  })
}

// 新增线上教育-试卷
export function addPaper(data) {
  return request({
    url: '/safework/paper',
    method: 'post',
    data: data
  })
}

// 修改线上教育-试卷
export function updatePaper(data) {
  return request({
    url: '/safework/paper',
    method: 'put',
    data: data
  })
}

// 删除线上教育-试卷
export function delPaper(id) {
  return request({
    url: '/safework/paper/' + id,
    method: 'delete'
  })
}
// 查询线上教育-试卷列表
export function getTestBaseInfoByResultId(query) {
  return request({
    url: '/safework/paper/getTestBaseInfoByResultId/',
    method: 'get',
    params: query
  })
}