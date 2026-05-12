import request from '@/utils/request'

// 查询设备附件列表
export function listFiles(query) {
  return request({
    url: '/equipment/files/list',
    method: 'get',
    params: query
  })
}

// 查询设备附件详细
export function getFiles(id) {
  return request({
    url: '/equipment/files/' + id,
    method: 'get'
  })
}

// 新增设备附件
export function addFiles(data) {
  return request({
    url: '/equipment/files',
    method: 'post',
    data: data
  })
}

// 修改设备附件
export function updateFiles(data) {
  return request({
    url: '/equipment/files',
    method: 'put',
    data: data
  })
}

// 删除设备附件
export function delFiles(id) {
  return request({
    url: '/equipment/files/' + id,
    method: 'delete'
  })
}
