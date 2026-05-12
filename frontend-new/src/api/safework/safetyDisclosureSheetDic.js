import request from '@/utils/request'

// 查询安全交底单字典列表
export function listSafetyDisclosureSheetDic(query) {
  return request({
    url: '/safework/safetyDisclosureSheetDic/list',
    method: 'get',
    params: query
  })
}

// 查询安全交底单字典详细
export function getSafetyDisclosureSheetDic(id) {
  return request({
    url: '/safework/safetyDisclosureSheetDic/' + id,
    method: 'get'
  })
}

// 新增安全交底单字典
export function addSafetyDisclosureSheetDic(data) {
  return request({
    url: '/safework/safetyDisclosureSheetDic',
    method: 'post',
    data: data
  })
}

// 修改安全交底单字典
export function updateSafetyDisclosureSheetDic(data) {
  return request({
    url: '/safework/safetyDisclosureSheetDic',
    method: 'put',
    data: data
  })
}

// 删除安全交底单字典
export function delSafetyDisclosureSheetDic(id) {
  return request({
    url: '/safework/safetyDisclosureSheetDic/' + id,
    method: 'delete'
  })
}
