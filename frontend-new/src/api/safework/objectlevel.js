import request from '@/utils/request'

// 查询风险对象等级与作业票关联列表
export function listObjectlevel(query) {
  return request({
    url: '/safework/objectlevel/list',
    method: 'get',
    params: query
  })
}

// 查询风险对象等级与作业票关联详细
export function getObjectlevel(id) {
  return request({
    url: '/safework/objectlevel/' + id,
    method: 'get'
  })
}

// 新增风险对象等级与作业票关联
export function addObjectlevel(data) {
  return request({
    url: '/safework/objectlevel',
    method: 'post',
    data: data
  })
}

// 修改风险对象等级与作业票关联
export function updateObjectlevel(data) {
  return request({
    url: '/safework/objectlevel',
    method: 'put',
    data: data
  })
}

// 删除风险对象等级与作业票关联
export function delObjectlevel(id) {
  return request({
    url: '/safework/objectlevel/' + id,
    method: 'delete'
  })
}
