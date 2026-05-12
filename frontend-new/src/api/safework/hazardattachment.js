import request from '@/utils/request'

// 查询隐患上报附件列表
export function listHazardattachment(query) {
  return request({
    url: '/safework/hazardattachment/list',
    method: 'get',
    params: query
  })
}

// 查询隐患上报附件详细
export function getHazardattachment(id) {
  return request({
    url: '/safework/hazardattachment/' + id,
    method: 'get'
  })
}

// 新增隐患上报附件
export function addHazardattachment(data) {
  return request({
    url: '/safework/hazardattachment',
    method: 'post',
    data: data
  })
}

// 修改隐患上报附件
export function updateHazardattachment(data) {
  return request({
    url: '/safework/hazardattachment',
    method: 'put',
    data: data
  })
}

// 删除隐患上报附件
export function delHazardattachment(id) {
  return request({
    url: '/safework/hazardattachment/' + id,
    method: 'delete'
  })
}
