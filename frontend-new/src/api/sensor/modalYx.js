import request from '@/utils/request'

// 查询传感器yx模板列表
export function listModalYx(query) {
  return request({
    url: '/sensor/modalYx/list',
    method: 'get',
    params: query
  })
}

// 查询传感器yx模板详细
export function getModalYx(yxNo) {
  return request({
    url: '/sensor/modalYx/' + yxNo,
    method: 'get'
  })
}

// 新增传感器yx模板
export function addModalYx(data) {
  return request({
    url: '/sensor/modalYx',
    method: 'post',
    data: data
  })
}

// 修改传感器yx模板
export function updateModalYx(data) {
  return request({
    url: '/sensor/modalYx',
    method: 'put',
    data: data
  })
}

// 删除传感器yx模板
export function delModalYx(yxNo) {
  return request({
    url: '/sensor/modalYx/' + yxNo,
    method: 'delete'
  })
}
