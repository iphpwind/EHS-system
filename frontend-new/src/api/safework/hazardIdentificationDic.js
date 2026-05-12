import request from '@/utils/request'

// 查询危害辨识字典列表
export function listHazardIdentificationDic(query) {
  return request({
    url: '/safework/hazardIdentificationDic/list',
    method: 'get',
    params: query
  })
}

// 查询危害辨识字典详细
export function getHazardIdentificationDic(id) {
  return request({
    url: '/safework/hazardIdentificationDic/' + id,
    method: 'get'
  })
}

// 新增危害辨识字典
export function addHazardIdentificationDic(data) {
  return request({
    url: '/safework/hazardIdentificationDic',
    method: 'post',
    data: data
  })
}

// 修改危害辨识字典
export function updateHazardIdentificationDic(data) {
  return request({
    url: '/safework/hazardIdentificationDic',
    method: 'put',
    data: data
  })
}

// 删除危害辨识字典
export function delHazardIdentificationDic(id) {
  return request({
    url: '/safework/hazardIdentificationDic/' + id,
    method: 'delete'
  })
}
