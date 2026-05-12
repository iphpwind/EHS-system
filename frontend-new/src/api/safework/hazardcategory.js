import request from '@/utils/request'

// 查询双重预防-危害类别字典列表
export function listHazardcategory(query) {
  return request({
    url: '/safework/hazardcategory/list',
    method: 'get',
    params: query
  })
}

// 查询双重预防-危害类别字典详细
export function getHazardcategory(id) {
  return request({
    url: '/safework/hazardcategory/' + id,
    method: 'get'
  })
}

// 新增双重预防-危害类别字典
export function addHazardcategory(data) {
  return request({
    url: '/safework/hazardcategory',
    method: 'post',
    data: data
  })
}

// 修改双重预防-危害类别字典
export function updateHazardcategory(data) {
  return request({
    url: '/safework/hazardcategory',
    method: 'put',
    data: data
  })
}

// 删除双重预防-危害类别字典
export function delHazardcategory(id) {
  return request({
    url: '/safework/hazardcategory/' + id,
    method: 'delete'
  })
}
