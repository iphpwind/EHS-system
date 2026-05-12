import request from '@/utils/request'

// 查询工单验收列表
export function listAcceptanceorder(query) {
  return request({
    url: '/unitManage/acceptanceorder/list',
    method: 'get',
    params: query
  })
}

// 查询工单验收详细
export function getAcceptanceorder(id) {
  return request({
    url: '/unitManage/acceptanceorder/' + id,
    method: 'get'
  })
}

// 新增工单验收
export function addAcceptanceorder(data) {
  return request({
    url: '/unitManage/acceptanceorder',
    method: 'post',
    data: data
  })
}

// 修改工单验收
export function updateAcceptanceorder(data) {
  return request({
    url: '/unitManage/acceptanceorder',
    method: 'put',
    data: data
  })
}

// 删除工单验收
export function delAcceptanceorder(id) {
  return request({
    url: '/unitManage/acceptanceorder/' + id,
    method: 'delete'
  })
}
