import request from '@/utils/request'

// 查询双重预防-风险等级字典列表
export function listRisklevel(query) {
  return request({
    url: '/safework/risklevel/list',
    method: 'get',
    params: query
  })
}

// 查询双重预防-风险等级字典详细
export function getRisklevel(id) {
  return request({
    url: '/safework/risklevel/' + id,
    method: 'get'
  })
}

// 新增双重预防-风险等级字典
export function addRisklevel(data) {
  return request({
    url: '/safework/risklevel',
    method: 'post',
    data: data
  })
}

// 修改双重预防-风险等级字典
export function updateRisklevel(data) {
  return request({
    url: '/safework/risklevel',
    method: 'put',
    data: data
  })
}

// 删除双重预防-风险等级字典
export function delRisklevel(id) {
  return request({
    url: '/safework/risklevel/' + id,
    method: 'delete'
  })
}
