import request from '@/utils/request'

// 查询应急预案修订记录列表
export function listUpplan(query) {
  return request({
    url: '/safework/upplan/list',
    method: 'get',
    params: query
  })
}

// 查询应急预案修订记录详细
export function getUpplan(id) {
  return request({
    url: '/safework/upplan/' + id,
    method: 'get'
  })
}

// 新增应急预案修订记录
export function addUpplan(data) {
  return request({
    url: '/safework/upplan',
    method: 'post',
    data: data
  })
}

// 修改应急预案修订记录
export function updateUpplan(data) {
  return request({
    url: '/safework/upplan',
    method: 'put',
    data: data
  })
}

// 删除应急预案修订记录
export function delUpplan(id) {
  return request({
    url: '/safework/upplan/' + id,
    method: 'delete'
  })
}
