import request from '@/utils/request'

// 查询运维知识附件列表
export function listKnowAttachment(query) {
  return request({
    url: '/unitManage/knowAttachment/list',
    method: 'get',
    params: query
  })
}

// 查询运维知识附件详细
export function getKnowAttachment(knowAttId) {
  return request({
    url: '/unitManage/knowAttachment/' + knowAttId,
    method: 'get'
  })
}

// 新增运维知识附件
export function addKnowAttachment(data) {
  return request({
    url: '/unitManage/knowAttachment',
    method: 'post',
    data: data
  })
}

// 修改运维知识附件
export function updateKnowAttachment(data) {
  return request({
    url: '/unitManage/knowAttachment',
    method: 'put',
    data: data
  })
}

// 删除运维知识附件
export function delKnowAttachment(knowAttId) {
  return request({
    url: '/unitManage/knowAttachment/' + knowAttId,
    method: 'delete'
  })
}
