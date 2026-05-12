import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/safework/personProfile/list',
    method: 'get',
    params: query
  })
}
export function getPlanCountDataByPerson(query) {
  return request({
    url: '/safework/personProfile/getPlanCountDataByPerson',
    method: 'get',
    params: query
  })
}
export function getCourseCountDataByPerson(query) {
  return request({
    url: '/safework/personProfile/getCourseCountDataByPerson',
    method: 'get',
    params: query
  })
}
export function getCourseStatsByCompany(query) {
  return request({
    url: '/safework/personProfile/getCourseStatsByCompany',
    method: 'get',
    params: query
  })
}
export function getCourseStatsByWorkshop(query) {
  return request({
    url: '/safework/personProfile/getCourseStatsByWorkshop',
    method: 'get',
    params: query
  })
}
export function getCourseStatsByTeam(query) {
  return request({
    url: '/safework/personProfile/getCourseStatsByTeam',
    method: 'get',
    params: query
  })
}