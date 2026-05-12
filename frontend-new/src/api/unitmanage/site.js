import request from '@/utils/request'

// 查询单元巡检点管理列表
export function listSite(query) {
  return request({
    url: '/unitManage/site/list',
    method: 'get',
    params: query
  })
}

// 查询单元巡检点管理详细
export function getSite(siteId) {
  return request({
    url: '/unitManage/site/' + siteId,
    method: 'get'
  })
}

// 新增单元巡检点管理
export function addSite(data) {
  return request({
    url: '/unitManage/site',
    method: 'post',
    data: data
  })
}

// 修改单元巡检点管理
export function updateSite(data) {
  return request({
    url: '/unitManage/site',
    method: 'put',
    data: data
  })
}

// 删除单元巡检点管理
export function delSite(siteId) {
  return request({
    url: '/unitManage/site/' + siteId,
    method: 'delete'
  })
}

// 下载二维码
export function qrCode(data) {
  return request({
    url: '/unitManage/site/qrCode',
    method: 'post',
    data: data
  })
}
