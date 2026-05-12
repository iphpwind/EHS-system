import request from '@/utils/request'

// 查询盲板抽堵列表
export function listBlindinfo(query) {
  return request({
    url: '/safework/blindinfo/list',
    method: 'get',
    params: query
  })
}

// 查询盲板抽堵详细
export function getBlindinfo(id) {
  return request({
    url: '/safework/blindinfo/' + id,
    method: 'get'
  })
}

// 新增盲板抽堵
export function addBlindinfo(data) {
  return request({
    url: '/safework/blindinfo',
    method: 'post',
    data: data
  })
}

// 修改盲板抽堵
export function updateBlindinfo(data) {
  return request({
    url: '/safework/blindinfo',
    method: 'put',
    data: data
  })
}

// 作废盲板抽堵
export function updateStatus(data) {
  return request({
    url: '/safework/blindinfo/updateStatus',
    method: 'put',
    data: data
  })
}


// 删除盲板抽堵
export function delBlindinfo(id) {
  return request({
    url: '/safework/blindinfo/' + id,
    method: 'delete'
  })
}
