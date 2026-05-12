import request from '@/utils/request'

// 查询巡检周期模板列表
export function listCycleTemplate(query) {
  return request({
    url: '/unitManage/cycleTemplate/list',
    method: 'get',
    params: query
  })
}

// 查询巡检周期模板详细
export function getCycleTemplate(cycleId) {
  return request({
    url: '/unitManage/cycleTemplate/' + cycleId,
    method: 'get'
  })
}

// 新增巡检周期模板
export function addCycleTemplate(data) {
  return request({
    url: '/unitManage/cycleTemplate',
    method: 'post',
    data: data
  })
}

// 修改巡检周期模板
export function updateCycleTemplate(data) {
  return request({
    url: '/unitManage/cycleTemplate',
    method: 'put',
    data: data
  })
}

// 删除巡检周期模板
export function delCycleTemplate(cycleIds) {
  return request({
    url: '/unitManage/cycleTemplate/' + cycleIds,
    method: 'delete'
  })
}
