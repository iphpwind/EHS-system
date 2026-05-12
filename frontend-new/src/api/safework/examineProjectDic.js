import request from '@/utils/request'

// 查询考核项目字典列表
export function listExamineProjectDic(query) {
  return request({
    url: '/safework/examineProjectDic/list',
    method: 'get',
    params: query
  })
}

// 查询考核项目字典详细
export function getExamineProjectDic(id) {
  return request({
    url: '/safework/examineProjectDic/' + id,
    method: 'get'
  })
}

// 新增考核项目字典
export function addExamineProjectDic(data) {
  return request({
    url: '/safework/examineProjectDic',
    method: 'post',
    data: data
  })
}

// 修改考核项目字典
export function updateExamineProjectDic(data) {
  return request({
    url: '/safework/examineProjectDic',
    method: 'put',
    data: data
  })
}

// 删除考核项目字典
export function delExamineProjectDic(id) {
  return request({
    url: '/safework/examineProjectDic/' + id,
    method: 'delete'
  })
}
