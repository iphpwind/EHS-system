import request from '@/utils/request'

// 查询带班记录列表
export function listRecordBase(query) {
  return request({
    url: '/safework/recordBase/list',
    method: 'get',
    params: query
  })
}

// 查询带班记录详细
export function getRecordBase(id) {
  return request({
    url: '/safework/recordBase/' + id,
    method: 'get'
  })
}

// 新增带班记录
export function addRecordBase(data) {
  return request({
    url: '/safework/recordBase',
    method: 'post',
    data: data
  })
}

// 修改带班记录
export function updateRecordBase(data) {
  return request({
    url: '/safework/recordBase',
    method: 'put',
    data: data
  })
}

// 删除带班记录
export function delRecordBase(id) {
  return request({
    url: '/safework/recordBase/' + id,
    method: 'delete'
  })
}
