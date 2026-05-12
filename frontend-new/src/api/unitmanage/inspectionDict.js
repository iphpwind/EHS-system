import request from '@/utils/request'

// 查询单元巡检内容字典列表
export function listInspectionDict(query) {
  return request({
    url: '/unitManage/inspectionDict/list',
    method: 'get',
    params: query
  })
}

// 查询单元巡检内容字典详细
export function getInspectionDict(inspectionDictId) {
  return request({
    url: '/unitManage/inspectionDict/' + inspectionDictId,
    method: 'get'
  })
}

// 新增单元巡检内容字典
export function addInspectionDict(data) {
  return request({
    url: '/unitManage/inspectionDict',
    method: 'post',
    data: data
  })
}

// 修改单元巡检内容字典
export function updateInspectionDict(data) {
  return request({
    url: '/unitManage/inspectionDict',
    method: 'put',
    data: data
  })
}

// 删除单元巡检内容字典
export function delInspectionDict(inspectionDictId) {
  return request({
    url: '/unitManage/inspectionDict/' + inspectionDictId,
    method: 'delete'
  })
}
