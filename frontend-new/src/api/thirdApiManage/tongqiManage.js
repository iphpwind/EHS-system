import request from '@/utils/request'

// 查询同企接口管理列表
export function listTongqiManage(query) {
  return request({
    url: '/thirdApiManage/tongqiManage/list',
    method: 'get',
    params: query
  })
}

// 查询同企接口管理详细
export function getTongqiManage(id) {
  return request({
    url: '/thirdApiManage/tongqiManage/' + id,
    method: 'get'
  })
}

// 新增同企接口管理
export function addTongqiManage(data) {
  return request({
    url: '/thirdApiManage/tongqiManage',
    method: 'post',
    data: data
  })
}

// 修改同企接口管理
export function updateTongqiManage(data) {
  return request({
    url: '/thirdApiManage/tongqiManage',
    method: 'put',
    data: data
  })
}

// 删除同企接口管理
export function delTongqiManage(id) {
  return request({
    url: '/thirdApiManage/tongqiManage/' + id,
    method: 'delete'
  })
}
