import request from '@/utils/request'

// 查询自建隐患库列表
export function listOnselfLibrary(query) {
  return request({
    url: '/safework/onselfLibrary/list',
    method: 'get',
    params: query
  })
}

// 查询自建隐患库详细
export function getOnselfLibrary(id) {
  return request({
    url: '/safework/onselfLibrary/' + id,
    method: 'get'
  })
}

// 新增自建隐患库
export function addOnselfLibrary(data) {
  return request({
    url: '/safework/onselfLibrary',
    method: 'post',
    data: data
  })
}

// 修改自建隐患库
export function updateOnselfLibrary(data) {
  return request({
    url: '/safework/onselfLibrary',
    method: 'put',
    data: data
  })
}

// 删除自建隐患库
export function delOnselfLibrary(id) {
  return request({
    url: '/safework/onselfLibrary/' + id,
    method: 'delete'
  })
}
