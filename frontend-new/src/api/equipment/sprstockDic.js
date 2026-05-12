import request from '@/utils/request'

// 查询备件库存调整入库类型字典列表
export function listSprstockDic(query) {
  return request({
    url: '/equipment/sprstockDic/list',
    method: 'get',
    params: query
  })
}

// 查询备件库存调整入库类型字典详细
export function getSprstockDic(sprstockDictId) {
  return request({
    url: '/equipment/sprstockDic/' + sprstockDictId,
    method: 'get'
  })
}

// 新增备件库存调整入库类型字典
export function addSprstockDic(data) {
  return request({
    url: '/equipment/sprstockDic',
    method: 'post',
    data: data
  })
}

// 修改备件库存调整入库类型字典
export function updateSprstockDic(data) {
  return request({
    url: '/equipment/sprstockDic',
    method: 'put',
    data: data
  })
}

// 删除备件库存调整入库类型字典
export function delSprstockDic(sprstockDictId) {
  return request({
    url: '/equipment/sprstockDic/' + sprstockDictId,
    method: 'delete'
  })
}
