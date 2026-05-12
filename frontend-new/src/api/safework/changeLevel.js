import request from '@/utils/request'

// 查询变更级别字典列表
export function listChangeLevel(query) {
  return request({
    url: '/safework/changeLevel/list',
    method: 'get',
    params: query
  })
}

// 查询变更级别字典详细
export function getChangeLevel(id) {
  return request({
    url: '/safework/changeLevel/' + id,
    method: 'get'
  })
}

// 新增变更级别字典
export function addChangeLevel(data) {
  return request({
    url: '/safework/changeLevel',
    method: 'post',
    data: data
  })
}

// 修改变更级别字典
export function updateChangeLevel(data) {
  return request({
    url: '/safework/changeLevel',
    method: 'put',
    data: data
  })
}

// 删除变更级别字典
export function delChangeLevel(id) {
  return request({
    url: '/safework/changeLevel/' + id,
    method: 'delete'
  })
}
