import request from '@/utils/request'

// 查询维修工单附件列表
export function listrepairattachment(query) {
  return request({
    url: '/unitManage/repairattachment/list',
    method: 'get',
    params: query
  })
}

// 查询维修工单附件详细
export function getrepairattachment(id) {
  return request({
    url: '/unitManage/repairattachment/' + id,
    method: 'get'
  })
}

// 新增维修工单附件
export function addrepairattachment(data) {
  return request({
    url: '/unitManage/repairattachment',
    method: 'post',
    data: data
  })
}

// 修改维修工单附件
export function updaterepairattachment(data) {
  return request({
    url: '/unitManage/repairattachment',
    method: 'put',
    data: data
  })
}

// 删除维修工单附件
export function delrepairattachment(id) {
  return request({
    url: '/unitManage/repairattachment/' + id,
    method: 'delete'
  })
}
