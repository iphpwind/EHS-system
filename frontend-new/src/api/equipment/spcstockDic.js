import request from '@/utils/request'

// 查询备件库存调整出库类型字典列表
export function listSpcstockDic(query) {
  return request({
    url: '/equipment/spcstockDic/list',
    method: 'get',
    params: query
  })
}

// 查询备件库存调整出库类型字典详细
export function getSpcstockDic(spcstockDictId) {
  return request({
    url: '/equipment/spcstockDic/' + spcstockDictId,
    method: 'get'
  })
}

// 新增备件库存调整出库类型字典
export function addSpcstockDic(data) {
  return request({
    url: '/equipment/spcstockDic',
    method: 'post',
    data: data
  })
}

// 修改备件库存调整出库类型字典
export function updateSpcstockDic(data) {
  return request({
    url: '/equipment/spcstockDic',
    method: 'put',
    data: data
  })
}

// 删除备件库存调整出库类型字典
export function delSpcstockDic(spcstockDictId) {
  return request({
    url: '/equipment/spcstockDic/' + spcstockDictId,
    method: 'delete'
  })
}
