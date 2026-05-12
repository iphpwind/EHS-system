import request from '@/utils/request'

// 查询危化品告知卡列表
export function listHazardouschemicals(query) {
  return request({
    url: '/safework/hazardouschemicals/list',
    method: 'get',
    params: query
  })
}

// 查询危化品告知卡详细
export function getHazardouschemicals(id) {
  return request({
    url: '/safework/hazardouschemicals/' + id,
    method: 'get'
  })
}

// 新增危化品告知卡
export function addHazardouschemicals(data) {
  return request({
    url: '/safework/hazardouschemicals',
    method: 'post',
    data: data
  })
}

// 修改危化品告知卡
export function updateHazardouschemicals(data) {
  return request({
    url: '/safework/hazardouschemicals',
    method: 'put',
    data: data
  })
}

// 删除危化品告知卡
export function delHazardouschemicals(id) {
  return request({
    url: '/safework/hazardouschemicals/' + id,
    method: 'delete'
  })
}
