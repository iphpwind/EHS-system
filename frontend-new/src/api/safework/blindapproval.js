import request from '@/utils/request'

// 查询盲板抽堵作业票作业审核节点列表
export function listBlindapproval(query) {
  return request({
    url: '/safework/blindapproval/list',
    method: 'get',
    params: query
  })
}

// 查询盲板抽堵作业票作业审核节点详细
export function getBlindapproval(id) {
  return request({
    url: '/safework/blindapproval/' + id,
    method: 'get'
  })
}

// 新增盲板抽堵作业票作业审核节点
export function addBlindapproval(data) {
  return request({
    url: '/safework/blindapproval',
    method: 'post',
    data: data
  })
}

// 修改盲板抽堵作业票作业审核节点
export function updateBlindapproval(data) {
  return request({
    url: '/safework/blindapproval',
    method: 'put',
    data: data
  })
}

// 删除盲板抽堵作业票作业审核节点
export function delBlindapproval(id) {
  return request({
    url: '/safework/blindapproval/' + id,
    method: 'delete'
  })
}

// 查询作业票作业审核节点详细
export function getFlowableTask(id) {
  return request({
    url: '/safework/blindapproval/getFlowableTask/' + id,
    method: 'get'
  })
}

// 查询作业票作业审核节点详细
export function agreeFlowableTask(data) {
  return request({
    url: '/safework/blindapproval/agreeFlowableTask',
    method: 'put',
    data: data
  })
}
