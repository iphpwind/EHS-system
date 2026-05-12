import request from '@/utils/request'

// 查询设备点检内容列表
export function listEqSpotCheckContent(query) {
  return request({
    url: '/equipment/eqSpotCheckContent/list',
    method: 'get',
    params: query
  })
}

// 查询设备点检内容详细
export function getEqSpotCheckContent(id) {
  return request({
    url: '/equipment/eqSpotCheckContent/' + id,
    method: 'get'
  })
}

// 新增设备点检内容
export function addEqSpotCheckContent(data) {
  return request({
    url: '/equipment/eqSpotCheckContent',
    method: 'post',
    data: data
  })
}

// 修改设备点检内容
export function updateEqSpotCheckContent(data) {
  return request({
    url: '/equipment/eqSpotCheckContent',
    method: 'put',
    data: data
  })
}

// 删除设备点检内容
export function delEqSpotCheckContent(id) {
  return request({
    url: '/equipment/eqSpotCheckContent/' + id,
    method: 'delete'
  })
}

export function changeOrderNum(data){
  return request({
    url: '/equipment/eqSpotCheckContent/changeOrderNum',
    method: 'post',
    data: data
  })
}
