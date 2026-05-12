import request from '@/utils/request'

// 查询传感器yk模板列表
export function listModalYk(query) {
  return request({
    url: '/sensor/modalYk/list',
    method: 'get',
    params: query
  })
}

// 查询传感器yk模板详细
export function getModalYk(ykNo) {
  return request({
    url: '/sensor/modalYk/' + ykNo,
    method: 'get'
  })
}

// 新增传感器yk模板
export function addModalYk(data) {
  return request({
    url: '/sensor/modalYk',
    method: 'post',
    data: data
  })
}

// 修改传感器yk模板
export function updateModalYk(data) {
  return request({
    url: '/sensor/modalYk',
    method: 'put',
    data: data
  })
}

// 删除传感器yk模板
export function delModalYk(ykNo) {
  return request({
    url: '/sensor/modalYk/' + ykNo,
    method: 'delete'
  })
}
