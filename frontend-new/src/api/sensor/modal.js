import request from '@/utils/request'

// 查询传感器模板列表
export function listModal(query) {
  return request({
    url: '/sensor/modal/list',
    method: 'get',
    params: query
  })
}

// 查询传感器模板详细
export function getModal(modalCode) {
  return request({
    url: '/sensor/modal/' + modalCode,
    method: 'get'
  })
}

// 新增传感器模板
export function addModal(data) {
  return request({
    url: '/sensor/modal',
    method: 'post',
    data: data
  })
}

// 修改传感器模板
export function updateModal(data) {
  return request({
    url: '/sensor/modal',
    method: 'put',
    data: data
  })
}

// 删除传感器模板
export function delModal(modalCode) {
  return request({
    url: '/sensor/modal/' + modalCode,
    method: 'delete'
  })
}
