import request from '@/utils/request'

// 查询聚通测温云  用户列列表
export function listTempuser(query) {
  return request({
    url: '/temperature/tempuser/list',
    method: 'get',
    params: query
  })
}export function tempList(query) {
  return request({
    url: '/temperature/tempuser/tempList',
    method: 'post',
    params: query
  })
}export function tempDesc(query) {
  return request({
    url: '/temperature/tempuser/tempDesc',
    method: 'post',
    params: query
  })
}export function lastdays(query) {
  return request({
    url: '/temperature/tempuser/lastdays',
    method: 'post',
    params: query
  })
}export function getBySbid(query) {
  return request({
    url: '/temperature/tempuser/getBySbid',
    method: 'post',
    params: query
  })
}
export function getByTuId(query) {
  return request({
    url: '/temperature/tempuser/getByTuId',
    method: 'post',
    params: query
  })
}

// 查询聚通测温云  用户列详细
export function getTempuser(tuId) {
  return request({
    url: '/temperature/tempuser/' + tuId,
    method: 'get'
  })
}

// 新增聚通测温云  用户列
export function addTempuser(data) {
  return request({
    url: '/temperature/tempuser',
    method: 'post',
    data: data
  })
}

// 修改聚通测温云  用户列
export function updateTempuser(data) {
  return request({
    url: '/temperature/tempuser',
    method: 'put',
    data: data
  })
}

// 删除聚通测温云  用户列
export function delTempuser(tuId) {
  return request({
    url: '/temperature/tempuser/' + tuId,
    method: 'delete'
  })
}
