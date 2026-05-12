import request from '@/utils/request'

// 查询变更风险检查字典列表
export function listChangeRisk(query) {
  return request({
    url: '/safework/changeRisk/list',
    method: 'get',
    params: query
  })
}

// 查询变更风险检查字典详细
export function getChangeRisk(id) {
  return request({
    url: '/safework/changeRisk/' + id,
    method: 'get'
  })
}

// 新增变更风险检查字典
export function addChangeRisk(data) {
  return request({
    url: '/safework/changeRisk',
    method: 'post',
    data: data
  })
}

// 修改变更风险检查字典
export function updateChangeRisk(data) {
  return request({
    url: '/safework/changeRisk',
    method: 'put',
    data: data
  })
}

// 删除变更风险检查字典
export function delChangeRisk(id) {
  return request({
    url: '/safework/changeRisk/' + id,
    method: 'delete'
  })
}
