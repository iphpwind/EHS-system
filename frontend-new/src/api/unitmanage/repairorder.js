import request from '@/utils/request'

// 查询工单维修列表
export function listRepairorder(query) {
  return request({
    url: '/unitManage/repairorder/list',
    method: 'get',
    params: query
  })
}

// 查询工单维修超期列表
export function exceedlist(query) {
  return request({
    url: '/unitManage/repairorder/exceedlist',
    method: 'get',
    params: query
  })
}

// 查询工单维修详细
export function getRepairorder(id) {
  return request({
    url: '/unitManage/repairorder/' + id,
    method: 'get'
  })
}

// 新增工单维修
export function addRepairorder(data) {
  return request({
    url: '/unitManage/repairorder',
    method: 'post',
    data: data
  })
}

// 修改工单维修
export function updateRepairorder(data) {
  return request({
    url: '/unitManage/repairorder',
    method: 'put',
    data: data
  })
}

// 删除工单维修
export function delRepairorder(id) {
  return request({
    url: '/unitManage/repairorder/' + id,
    method: 'delete'
  })
}
