import request from '@/utils/request'

// 查询承包商人员列表
export function listPersonnel(query) {
  return request({
    url: '/safework/personnel/list',
    method: 'get',
    params: query
  })
}

export function bindTagContractorPersonnelList(query) {
  return request({
    url: '/safework/personnel/bindTagContractorPersonnelList',
    method: 'get',
    params: query
  })
}

// 查询承包商人员详细
export function getPersonnel(id) {
  return request({
    url: '/safework/personnel/' + id,
    method: 'get'
  })
}

// 新增承包商人员
export function addPersonnel(data) {
  return request({
    url: '/safework/personnel',
    method: 'post',
    data: data
  })
}

// 修改承包商人员
export function updatePersonnel(data) {
  return request({
    url: '/safework/personnel',
    method: 'put',
    data: data
  })
}

// 删除承包商人员
export function delPersonnel(id) {
  return request({
    url: '/safework/personnel/' + id,
    method: 'delete'
  })
}
