import request from '@/utils/request'

// 查询传感器遥测模板列表
export function listModalYc(query) {
  return request({
    url: '/sensor/modalYc/list',
    method: 'get',
    params: query
  })
}

// 查询传感器遥测模板详细
export function getModalYc(ycNo) {
  return request({
    url: '/sensor/modalYc/' + ycNo,
    method: 'get'
  })
}

// 新增传感器遥测模板
export function addModalYc(data) {
  return request({
    url: '/sensor/modalYc',
    method: 'post',
    data: data
  })
}

// 修改传感器遥测模板
export function updateModalYc(data) {
  return request({
    url: '/sensor/modalYc',
    method: 'put',
    data: data
  })
}

// 删除传感器遥测模板
export function delModalYc(ycNo) {
  return request({
    url: '/sensor/modalYc/' + ycNo,
    method: 'delete'
  })
}
