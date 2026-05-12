import request from '@/utils/request'

// 查询特殊作业现场确认字典列表
export function listSceneConfirmationDeptDic(query) {
  return request({
    url: '/safework/sceneConfirmationDeptDic/list',
    method: 'get',
    params: query
  })
}

// 查询特殊作业现场确认字典详细
export function getSceneConfirmationDeptDic(id) {
  return request({
    url: '/safework/sceneConfirmationDeptDic/' + id,
    method: 'get'
  })
}

// 新增特殊作业现场确认字典
export function addSceneConfirmationDeptDic(data) {
  return request({
    url: '/safework/sceneConfirmationDeptDic',
    method: 'post',
    data: data
  })
}

// 修改特殊作业现场确认字典
export function updateSceneConfirmationDeptDic(data) {
  return request({
    url: '/safework/sceneConfirmationDeptDic',
    method: 'put',
    data: data
  })
}

// 删除特殊作业现场确认字典
export function delSceneConfirmationDeptDic(id) {
  return request({
    url: '/safework/sceneConfirmationDeptDic/' + id,
    method: 'delete'
  })
}
