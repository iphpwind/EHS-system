import request from '@/utils/request'

// 查询风险分级记录列表
export function listRanking(query) {
  return request({
    url: '/safework/ranking/list',
    method: 'get',
    params: query
  })
}

// 查询风险分级记录详细
export function getRanking(id) {
  return request({
    url: '/safework/ranking/' + id,
    method: 'get'
  })
}

// 查询风险分级记录详细
export function getLastInfo(unitId) {
  return request({
    url: '/safework/ranking/getLastInfo/' + unitId,
    method: 'get'
  })
}

// 新增风险分级记录
export function addRanking(data) {
  return request({
    url: '/safework/ranking',
    method: 'post',
    data: data
  })
}

// 修改风险分级记录
export function updateRanking(data) {
  return request({
    url: '/safework/ranking',
    method: 'put',
    data: data
  })
}

// 删除风险分级记录
export function delRanking(id) {
  return request({
    url: '/safework/ranking/' + id,
    method: 'delete'
  })
}
