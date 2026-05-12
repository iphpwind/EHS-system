import request from '@/utils/request'

// 查询网关管理列表
export function listTerminal(query) {
  return request({
    url: '/sensor/terminal/list',
    method: 'get',
    params: query
  })
}

// 查询网关管理详细
export function getTerminal(termCode) {
  return request({
    url: '/sensor/terminal/' + termCode,
    method: 'get'
  })
}
// 根据公司部门查询网关管理详细
export function getTerminalByDept(deptId) {
  return request({
    url: '/sensor/terminal/dept/' + deptId,
    method: 'get'
  })
}
// 新增网关管理
export function addTerminal(data) {
  return request({
    url: '/sensor/terminal',
    method: 'post',
    data: data
  })
}

// 修改网关管理
export function updateTerminal(data) {
  return request({
    url: '/sensor/terminal',
    method: 'put',
    data: data
  })
}

// 删除网关管理
export function delTerminal(termCode) {
  return request({
    url: '/sensor/terminal/' + termCode,
    method: 'delete'
  })
}
// 获取忱工网关地址
export function getCurrTermSerial() {
  return request({
    url: '/sensor/terminal/getCurrTermSerial',
    method: 'get'
  })
}
// 数据同步redis
export function updateDataForRedis(data) {
  return request({
    url: '/sensor/terminal/updateDataForRedis',
    method: 'post',
    data: data
  })
}
//
export function updateTerminalSatus(data) {
  return request({
    url: '/sensor/terminal/updateTerminalSatus',
    method: 'post',
    data: data
  })
}
// 获取设备类别
export function getEqCategoryList() {
  return request({
    url: '/sensor/terminal/getEqCategoryList',
    method: 'get'
  })
}
