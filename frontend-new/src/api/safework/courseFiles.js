import request from '@/utils/request'

// 查询培训课程素材列表
export function listCourseFiles(query) {
  return request({
    url: '/safework/courseFiles/list',
    method: 'get',
    params: query
  })
}

// 查询培训课程素材详细
export function getCourseFiles(id) {
  return request({
    url: '/safework/courseFiles/' + id,
    method: 'get'
  })
}

// 新增培训课程素材
export function addCourseFiles(data) {
  return request({
    url: '/safework/courseFiles',
    method: 'post',
    data: data
  })
}

// 修改培训课程素材
export function updateCourseFiles(data) {
  return request({
    url: '/safework/courseFiles',
    method: 'put',
    data: data
  })
}

// 删除培训课程素材
export function delCourseFiles(id) {
  return request({
    url: '/safework/courseFiles/' + id,
    method: 'delete'
  })
}
// 上传文件
export function uploadFile(data) {
  return request({
    url: '/safework/courseFiles/upload',
    method: 'post',
    data: data
  })
}
// 获取七牛云upToken
export function getQiNiuUpToken() {
  return request({
    url: '/safework/courseFiles/getQiNiuUpToken',
    method: 'get'
  })
}

// 获取七牛云素材url
export function getQinNiuUrl(query) {
  return request({
    url: '/safework/courseFiles/getQinNiuUrl',
    method: 'get',
    params: query
  })
}


