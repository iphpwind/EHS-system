import request from '@/utils/request'

// 查询备件单位字典列表
export function listSpunitDic(query) {
  return request({
    url: '/equipment/spunitDic/list',
    method: 'get',
    params: query
  })
}

// 查询备件单位字典详细
export function getSpunitDic(spunitDictId) {
  return request({
    url: '/equipment/spunitDic/' + spunitDictId,
    method: 'get'
  })
}

// 新增备件单位字典
export function addSpunitDic(data) {
  return request({
    url: '/equipment/spunitDic',
    method: 'post',
    data: data
  })
}

// 修改备件单位字典
export function updateSpunitDic(data) {
  return request({
    url: '/equipment/spunitDic',
    method: 'put',
    data: data
  })
}

// 删除备件单位字典
export function delSpunitDic(spunitDictId) {
  return request({
    url: '/equipment/spunitDic/' + spunitDictId,
    method: 'delete'
  })
}
