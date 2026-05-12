import request from '@/utils/request'

// 查询双重预防--直判准则字典列表
export function listJudge(query) {
  return request({
    url: '/safework/judge/list',
    method: 'get',
    params: query
  })
}

// 查询双重预防--直判准则字典详细
export function getJudge(id) {
  return request({
    url: '/safework/judge/' + id,
    method: 'get'
  })
}

// 新增双重预防--直判准则字典
export function addJudge(data) {
  return request({
    url: '/safework/judge',
    method: 'post',
    data: data
  })
}

// 修改双重预防--直判准则字典
export function updateJudge(data) {
  return request({
    url: '/safework/judge',
    method: 'put',
    data: data
  })
}

// 删除双重预防--直判准则字典
export function delJudge(id) {
  return request({
    url: '/safework/judge/' + id,
    method: 'delete'
  })
}
