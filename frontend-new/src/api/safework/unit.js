import request from '@/utils/request'

// 查询风险分析单元列表
export function listUnit(query) {
  return request({
    url: '/safework/unit/list',
    method: 'get',
    params: query
  })
}
export function selectUnitHuizong(query) {
  return request({
    url: '/safework/unit/selectUnitHuizong',
    method: 'get',
    params: query
  })
}

// 查询风险分析单元详细
export function getUnit(id) {
  return request({
    url: '/safework/unit/' + id,
    method: 'get'
  })
}
// 获取上周风险分析完成率
export function getComplistPersent(data) {
  return request({
    url: '/safework/unit/getComplistPersent',
    method: 'get',
    data: data
  })
}

// 新增风险分析单元
export function addUnit(data) {
  return request({
    url: '/safework/unit',
    method: 'post',
    data: data
  })
}

// 修改风险分析单元
export function updateUnit(data) {
  return request({
    url: '/safework/unit',
    method: 'put',
    data: data
  })
}
// 修改风险分析单元
export function updateUnitWork(data) {
  return request({
    url: '/safework/unit/updateUnitWork',
    method: 'put',
    data: data
  })
}

// 删除风险分析单元
export function delUnit(id) {
  return request({
    url: '/safework/unit/' + id,
    method: 'delete'
  })
}

export function listByObjecIds(ids){
  return request({
    url: '/safework/unit/listByObjecIds/' + ids,
    method: 'get'
  })
}
