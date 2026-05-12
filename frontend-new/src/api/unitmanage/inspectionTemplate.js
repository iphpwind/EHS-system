import request from '@/utils/request'

// 查询巡检内容模板列表
export function listInspectionTemplate(query) {
  return request({
    url: '/unitManage/inspectionTemplate/list',
    method: 'get',
    params: query
  })
}

// 查询巡检内容模板详细
export function getInspectionTemplate(templateId) {
  return request({
    url: '/unitManage/inspectionTemplate/' + templateId,
    method: 'get'
  })
}

// 新增巡检内容模板
export function addInspectionTemplate(data) {
  return request({
    url: '/unitManage/inspectionTemplate',
    method: 'post',
    data: data
  })
}
// 克隆巡检内容模板
export function copyInspectionTemplate(data) {
  return request({
    url: '/unitManage/inspectionTemplate/copy',
    method: 'post',
    data: data
  })
}

// 修改巡检内容模板
export function updateInspectionTemplate(data) {
  return request({
    url: '/unitManage/inspectionTemplate',
    method: 'put',
    data: data
  })
}

// 删除巡检内容模板
export function delInspectionTemplate(templateId) {
  return request({
    url: '/unitManage/inspectionTemplate/' + templateId,
    method: 'delete'
  })
}
