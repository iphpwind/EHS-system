import request from '@/utils/request'

// 查询风险管控措施列表
export function listMeasure(query) {
  return request({
    url: '/safework/measure/list',
    method: 'get',
    params: query
  })
}

// 查询风险管控措施列表
export function measureList(query) {
  return request({
    url: '/safework/measure/measureList',
    method: 'get',
    params: query
  })
}

// 查询风险管控措施详细
export function getMeasure(id) {
  return request({
    url: '/safework/measure/' + id,
    method: 'get'
  })
}
// 查询风险管控措施详细
export function getCountInfo(data) {
  return request({
    url: '/safework/measure/getCountInfo',
    method: 'get',
    data: data
  })
}

// 新增风险管控措施
export function addMeasure(data) {
  return request({
    url: '/safework/measure',
    method: 'post',
    data: data
  })
}

// 修改风险管控措施
export function updateMeasure(data) {
  return request({
    url: '/safework/measure',
    method: 'put',
    data: data
  })
}

// 删除风险管控措施
export function delMeasure(id) {
  return request({
    url: '/safework/measure/' + id,
    method: 'delete'
  })
}
