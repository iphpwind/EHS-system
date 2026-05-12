import request from '@/utils/request'

// 查询风险管控措施属性列表
export function listMeasureArr(query) {
  return request({
    url: '/safework/measureArr/list',
    method: 'get',
    params: query
  })
}

// 查询风险管控措施属性详细
export function getMeasureArr(id) {
  return request({
    url: '/safework/measureArr/' + id,
    method: 'get'
  })
}

// 新增风险管控措施属性
export function addMeasureArr(data) {
  return request({
    url: '/safework/measureArr',
    method: 'post',
    data: data
  })
}

// 修改风险管控措施属性
export function updateMeasureArr(data) {
  return request({
    url: '/safework/measureArr',
    method: 'put',
    data: data
  })
}

// 删除风险管控措施属性
export function delMeasureArr(id) {
  return request({
    url: '/safework/measureArr/' + id,
    method: 'delete'
  })
}
