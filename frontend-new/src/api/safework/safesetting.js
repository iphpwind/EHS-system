import request from '@/utils/request'

// 查询作业票动态风险配置列表
export function listSafesetting(query) {
  return request({
    url: '/safework/safesetting/list',
    method: 'get',
    params: query
  })
}

// 查询作业票动态风险配置详细
export function getSafesetting(id) {
  return request({
    url: '/safework/safesetting/' + id,
    method: 'get'
  })
}

// 新增作业票动态风险配置
export function addSafesetting(data) {
  return request({
    url: '/safework/safesetting',
    method: 'post',
    data: data
  })
}

// 修改作业票动态风险配置
export function updateSafesetting(data) {
  return request({
    url: '/safework/safesetting',
    method: 'put',
    data: data
  })
}

// 删除作业票动态风险配置
export function delSafesetting(id) {
  return request({
    url: '/safework/safesetting/' + id,
    method: 'delete'
  })
}
