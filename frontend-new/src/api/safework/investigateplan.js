import request from '@/utils/request'

// 查询隐患排查计划列表
export function listInvestigateplan(query) {
  return request({
    url: '/safework/investigateplan/list',
    method: 'get',
    params: query
  })
}

// 查询隐患排查计划详细
export function getInvestigateplan(id) {
  return request({
    url: '/safework/investigateplan/' + id,
    method: 'get'
  })
}

// 新增隐患排查计划
export function addInvestigateplan(data) {
  return request({
    url: '/safework/investigateplan',
    method: 'post',
    data: data
  })
}

// 修改隐患排查计划
export function updateInvestigateplan(data) {
  return request({
    url: '/safework/investigateplan',
    method: 'put',
    data: data
  })
}

// 修改隐患排查计划状态
export function updateSta(data) {
  return request({
    url: '/safework/investigateplan/updateSta',
    method: 'put',
    data: data
  })
}

// 删除隐患排查计划
export function delInvestigateplan(id) {
  return request({
    url: '/safework/investigateplan/' + id,
    method: 'delete'
  })
}

// 根据计划ID生成任务
export function createTaskByPlan(planId) {
  return request({
    url: '/safework/investigateplan/createTaskByPlan/'+planId,
    method: 'get',
  })
}
