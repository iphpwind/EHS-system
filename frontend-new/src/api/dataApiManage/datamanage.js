import request from '@/utils/request'

// 查询api接口管理列表
export function listDatamanage(query) {
  return request({
    url: '/dataApiManage/datamanage/list',
    method: 'get',
    params: query
  })
}

// 查询api接口管理详细
export function getDatamanage(id) {
  return request({
    url: '/dataApiManage/datamanage/' + id,
    method: 'get'
  })
}

// 新增api接口管理
export function addDatamanage(data) {
  return request({
    url: '/dataApiManage/datamanage',
    method: 'post',
    data: data
  })
}

// 修改api接口管理
export function updateDatamanage(data) {
  return request({
    url: '/dataApiManage/datamanage',
    method: 'put',
    data: data
  })
}

// 删除api接口管理
export function delDatamanage(id) {
  return request({
    url: '/dataApiManage/datamanage/' + id,
    method: 'delete'
  })
}
