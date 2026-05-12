import request from '@/utils/request'

// 查询单元巡检计划列表
export function listInspectionPlan(query) {
  return request({
    url: '/unitManage/inspectionPlan/list',
    method: 'get',
    params: query
  })
}

// 查询单元巡检计划详细
export function getInspectionPlan(planId) {
  return request({
    url: '/unitManage/inspectionPlan/' + planId,
    method: 'get'
  })
}

// 新增单元巡检计划
export function addInspectionPlan(data) {
  return request({
    url: '/unitManage/inspectionPlan',
    method: 'post',
    data: data
  })
}

// 修改单元巡检计划
export function updateInspectionPlan(data) {
  return request({
    url: '/unitManage/inspectionPlan',
    method: 'put',
    data: data
  })
}

// 删除单元巡检计划
export function delInspectionPlan(planId) {
  return request({
    url: '/unitManage/inspectionPlan/' + planId,
    method: 'delete'
  })
}

// 根据单元巡检计划生成当月巡检任务
export function createInspectionTaskByPlan(data) {
  return request({
    url: '/unitManage/inspectionPlan/createInspectionTaskByPlan',
    method: 'post',
    data: data
  })
}

// 根据多条单元巡检计划生成当月巡检任务
export function createInspectionTaskByPlans(planId) {
  return request({
    url: '/unitManage/inspectionPlan/createInspectionTaskByPlans/'+planId,
    method: 'get',
  })
}