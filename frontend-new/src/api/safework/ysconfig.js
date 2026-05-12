import request from '@/utils/request'

// 查询萤石云配置列表
export function listYsconfig(query) {
  return request({
    url: '/safework/ysconfig/list',
    method: 'get',
    params: query
  })
}

// 查询萤石云配置详细
export function getYsconfig(id) {
  return request({
    url: '/safework/ysconfig/' + id,
    method: 'get'
  })
}

// 新增萤石云配置
export function addYsconfig(data) {
  return request({
    url: '/safework/ysconfig',
    method: 'post',
    data: data
  })
}

// 修改萤石云配置
export function updateYsconfig(data) {
  return request({
    url: '/safework/ysconfig',
    method: 'put',
    data: data
  })
}

// 删除萤石云配置
export function delYsconfig(id) {
  return request({
    url: '/safework/ysconfig/' + id,
    method: 'delete'
  })
}
