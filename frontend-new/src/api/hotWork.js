import request from '@/utils/request'

// 查询动火作业列表（闭环V2）
export function listHotWork(query) {
  return request({
    url: '/hot-work',
    method: 'get',
    params: query
  })
}

// 查询动火作业详情
export function getHotWork(id) {
  return request({
    url: '/hot-work/' + id,
    method: 'get'
  })
}

// 新增动火作业
export function addHotWork(data) {
  return request({
    url: '/hot-work',
    method: 'post',
    data
  })
}

// 修改动火作业
export function updateHotWork(id, data) {
  return request({
    url: '/hot-work/' + id,
    method: 'put',
    data
  })
}

// 提交审批
export function submitHotWork(id) {
  return request({
    url: '/hot-work/' + id + '/submit',
    method: 'post'
  })
}

// 审批操作 action: dept/safety/final/reject
export function approveHotWork(id, data) {
  return request({
    url: '/hot-work/' + id + '/approve',
    method: 'post',
    data
  })
}

// 开始作业
export function startHotWork(id) {
  return request({
    url: '/hot-work/' + id + '/start',
    method: 'post'
  })
}

// 完成作业
export function finishHotWork(id) {
  return request({
    url: '/hot-work/' + id + '/finish',
    method: 'post'
  })
}

// 验收关闭
export function closeHotWork(id) {
  return request({
    url: '/hot-work/' + id + '/close',
    method: 'post'
  })
}

// 删除动火作业
export function delFirework(id) {
  return request({
    url: '/hot-work/' + id,
    method: 'delete'
  })
}

// 查询气体检测记录
export function getGasChecks(id, query) {
  return request({
    url: '/hot-work/' + id + '/gas',
    method: 'get',
    params: query
  })
}

// 提交气体检测
export function addGasCheck(id, data) {
  return request({
    url: '/hot-work/' + id + '/gas',
    method: 'post',
    data
  })
}

// 导出PDF
export function exportHotWorkPDF(id) {
  return request({
    url: '/pdf/hot-work/' + id,
    method: 'get',
    responseType: 'blob'
  })
}
