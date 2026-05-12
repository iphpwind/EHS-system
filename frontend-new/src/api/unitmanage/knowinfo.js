import request from '@/utils/request'

// 查询运维知识台账列表
export function listKnowinfo(query) {
  return request({
    url: '/unitManage/knowinfo/list',
    method: 'get',
    params: query
  })
}

// 查询运维知识台账详细
export function getKnowinfo(knowId) {
  return request({
    url: '/unitManage/knowinfo/' + knowId,
    method: 'get'
  })
}

// 新增运维知识台账
export function addKnowinfo(data) {
  return request({
    url: '/unitManage/knowinfo',
    method: 'post',
    data: data
  })
}

// 修改运维知识台账
export function updateKnowinfo(data) {
  return request({
    url: '/unitManage/knowinfo',
    method: 'put',
    data: data
  })
}

// 删除运维知识台账
export function delKnowinfo(knowId) {
  return request({
    url: '/unitManage/knowinfo/' + knowId,
    method: 'delete'
  })
}
