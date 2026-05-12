import request from '@/utils/request'

// 查询应急管理-预案适用领域字典列表
export function listPlanapplications(query) {
  return request({
    url: '/safework/planapplications/list',
    method: 'get',
    params: query
  })
}

// 查询应急管理-预案适用领域字典详细
export function getPlanapplications(id) {
  return request({
    url: '/safework/planapplications/' + id,
    method: 'get'
  })
}

// 新增应急管理-预案适用领域字典
export function addPlanapplications(data) {
  return request({
    url: '/safework/planapplications',
    method: 'post',
    data: data
  })
}

// 修改应急管理-预案适用领域字典
export function updatePlanapplications(data) {
  return request({
    url: '/safework/planapplications',
    method: 'put',
    data: data
  })
}

// 删除应急管理-预案适用领域字典
export function delPlanapplications(id) {
  return request({
    url: '/safework/planapplications/' + id,
    method: 'delete'
  })
}
