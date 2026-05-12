import request from '@/utils/request'

// 查询备件类型字典列表
export function listSptypeDic(query) {
  return request({
    url: '/equipment/sptypeDic/list',
    method: 'get',
    params: query
  })
}

// 查询备件类型字典详细
export function getSptypeDic(sptypeDictId) {
  return request({
    url: '/equipment/sptypeDic/' + sptypeDictId,
    method: 'get'
  })
}

// 新增备件类型字典
export function addSptypeDic(data) {
  return request({
    url: '/equipment/sptypeDic',
    method: 'post',
    data: data
  })
}

// 修改备件类型字典
export function updateSptypeDic(data) {
  return request({
    url: '/equipment/sptypeDic',
    method: 'put',
    data: data
  })
}

// 删除备件类型字典
export function delSptypeDic(sptypeDictId) {
  return request({
    url: '/equipment/sptypeDic/' + sptypeDictId,
    method: 'delete'
  })
}
