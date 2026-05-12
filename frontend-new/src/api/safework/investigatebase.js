import request from '@/utils/request'

// 查询隐患排查基础列表
export function listInvestigatebase(query) {
  return request({
    url: '/safework/investigatebase/list',
    method: 'get',
    params: query
  })
}

// 查询隐患排查基础详细
export function getInvestigatebase(id) {
  return request({
    url: '/safework/investigatebase/' + id,
    method: 'get'
  })
}

// 新增隐患排查基础
export function addInvestigatebase(data) {
  return request({
    url: '/safework/investigatebase',
    method: 'post',
    data: data
  })
}

// 修改隐患排查基础
export function updateInvestigatebase(data) {
  return request({
    url: '/safework/investigatebase',
    method: 'put',
    data: data
  })
}

// 删除隐患排查基础
export function delInvestigatebase(id) {
  return request({
    url: '/safework/investigatebase/' + id,
    method: 'delete'
  })
}
