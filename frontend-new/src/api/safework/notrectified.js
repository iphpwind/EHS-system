import request from '@/utils/request'

// 查询隐患待整改列表
export function listNotrectified(query) {
  return request({
    url: '/safework/notrectified/list',
    method: 'get',
    params: query
  })
}

// 查询隐患待整改详细
export function getNotrectified(id) {
  return request({
    url: '/safework/notrectified/' + id,
    method: 'get'
  })
}

// 新增隐患待整改
export function addNotrectified(data) {
  return request({
    url: '/safework/notrectified',
    method: 'post',
    data: data
  })
}

// 修改隐患待整改
export function updateNotrectified(data) {
  return request({
    url: '/safework/notrectified',
    method: 'put',
    data: data
  })
}

// 删除隐患待整改
export function delNotrectified(id) {
  return request({
    url: '/safework/notrectified/' + id,
    method: 'delete'
  })
}
