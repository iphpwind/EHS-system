import request from '@/utils/request'

// 查询目标责任级别字典列表
export function listTargetLevelDic(query) {
  return request({
    url: '/safework/targetLevelDic/list',
    method: 'get',
    params: query
  })
}

// 查询目标责任级别字典详细
export function getTargetLevelDic(id) {
  return request({
    url: '/safework/targetLevelDic/' + id,
    method: 'get'
  })
}

// 新增目标责任级别字典
export function addTargetLevelDic(data) {
  return request({
    url: '/safework/targetLevelDic',
    method: 'post',
    data: data
  })
}

// 修改目标责任级别字典
export function updateTargetLevelDic(data) {
  return request({
    url: '/safework/targetLevelDic',
    method: 'put',
    data: data
  })
}

// 删除目标责任级别字典
export function delTargetLevelDic(id) {
  return request({
    url: '/safework/targetLevelDic/' + id,
    method: 'delete'
  })
}
