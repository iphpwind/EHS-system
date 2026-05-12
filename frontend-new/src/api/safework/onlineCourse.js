import request from '@/utils/request'

// 查询培训课程列表
export function listOnlineCourse(query) {
  return request({
    url: '/safework/onlineCourse/list',
    method: 'get',
    params: query
  })
}

// 查询培训课程详细
export function getOnlineCourse(id) {
  return request({
    url: '/safework/onlineCourse/' + id,
    method: 'get'
  })
}

// 新增培训课程
export function addOnlineCourse(data) {
  return request({
    url: '/safework/onlineCourse',
    method: 'post',
    data: data
  })
}

// 修改培训课程
export function updateOnlineCourse(data) {
  return request({
    url: '/safework/onlineCourse',
    method: 'put',
    data: data
  })
}

// 删除培训课程
export function delOnlineCourse(id) {
  return request({
    url: '/safework/onlineCourse/' + id,
    method: 'delete'
  })
}
// 考试记录
export function getCourseByIds(id) {
  return request({
    url: '/safework/onlineCourse/getCourseByIds/'+ id,
    method: 'get',
  })
}