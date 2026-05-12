import request from '@/utils/request'

// 查询线上培训计划列表
export function listOnlinePlan(query) {
  return request({
    url: '/safework/onlinePlan/list',
    method: 'get',
    params: query
  })
}

// 查询线上培训计划详细
export function getOnlinePlan(id) {
  return request({
    url: '/safework/onlinePlan/' + id,
    method: 'get'
  })
}

// 新增线上培训计划
export function addOnlinePlan(data) {
  return request({
    url: '/safework/onlinePlan',
    method: 'post',
    data: data
  })
}

// 修改线上培训计划
export function updateOnlinePlan(data) {
  return request({
    url: '/safework/onlinePlan',
    method: 'put',
    data: data
  })
}

// 删除线上培训计划
export function delOnlinePlan(id) {
  return request({
    url: '/safework/onlinePlan/' + id,
    method: 'delete'
  })
}

// 培训总览 课程资料
export function getCourseCountByCategory(data) {
  return request({
    url: '/safework/onlinePlan/getCourseCountByCategory',
    method: 'get',
    data: data
  })
}
// 培训总览 题目分类
export function getQuestionCountByCategory(data) {
  return request({
    url: '/safework/onlinePlan/getQuestionCountByCategory',
    method: 'get',
    data: data
  })
}
// 培训总览 命题方式
export function getTestCountByMethod(data) {
  return request({
    url: '/safework/onlinePlan/getTestCountByMethod',
    method: 'get',
    data: data
  })
}

// 培训总览 适用对象
export function getCourseCountByTarget(data) {
  return request({
    url: '/safework/onlinePlan/getCourseCountByTarget',
    method: 'get',
    data: data
  })
}
// 培训总览 计划完成度
export function getPlanCountByState(data) {
  return request({
    url: '/safework/onlinePlan/getPlanCountByState',
    method: 'get',
    data: data
  })
}
// 培训总览 考试合格率
export function getPlanTestPassRate(data) {
  return request({
    url: '/safework/onlinePlan/getPlanTestPassRate',
    method: 'get',
    data: data
  })
}
// 培训总览 内部职员培训计划
export function getPlanTestPassList(query) {
  return request({
    url: '/safework/onlinePlan/getPlanTestPassList',
    method: 'get',
    params: query
  })
}
// 培训总览 内部职员自修课程
export function getSSCourseCount(query) {
  return request({
    url: '/safework/onlinePlan/getSSCourseCount',
    method: 'get',
    params: query
  })
}

// 学时统计
export function getClassHourList(query) {
  return request({
    url: '/safework/onlinePlan/getClassHourList',
    method: 'get',
    params: query
  })
}
// 考试统计
export function getTestResultList(query) {
  return request({
    url: '/safework/onlinePlan/getTestResultList',
    method: 'get',
    params: query
  })
}

// 考试记录
export function getTestResultListByCourseId(query) {
  return request({
    url: '/safework/onlinePlan/getTestResultListByCourseId',
    method: 'get',
    params: query
  })
}

