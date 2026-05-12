import request from '@/utils/request'

// 查询风险分析单元管控层级字典列表
export function listLevel(query) {
  return request({
    url: '/safework/level/list',
    method: 'get',
    params: query
  })
}

// 查询风险分析单元管控层级字典详细
export function getLevel(id) {
  return request({
    url: '/safework/level/' + id,
    method: 'get'
  })
}

// 新增风险分析单元管控层级字典
export function addLevel(data) {
  return request({
    url: '/safework/level',
    method: 'post',
    data: data
  })
}

// 修改风险分析单元管控层级字典
export function updateLevel(data) {
  return request({
    url: '/safework/level',
    method: 'put',
    data: data
  })
}

// 删除风险分析单元管控层级字典
export function delLevel(id) {
  return request({
    url: '/safework/level/' + id,
    method: 'delete'
  })
}
