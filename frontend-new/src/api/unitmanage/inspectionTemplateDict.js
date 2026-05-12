import request from '@/utils/request'

// 查询巡检内容模板和字典关联列表
export function listInspectionTemplateDict(query) {
  return request({
    url: '/unitManage/inspectionTemplateDict/list',
    method: 'get',
    params: query
  })
}

// 查询巡检内容模板和字典关联详细
export function getInspectionTemplateDict(id) {
  return request({
    url: '/unitManage/inspectionTemplateDict/' + id,
    method: 'get'
  })
}

// 新增巡检内容模板和字典关联
export function addInspectionTemplateDict(data) {
  return request({
    url: '/unitManage/inspectionTemplateDict',
    method: 'post',
    data: data
  })
}

// 修改巡检内容模板和字典关联
export function updateInspectionTemplateDict(data) {
  return request({
    url: '/unitManage/inspectionTemplateDict',
    method: 'put',
    data: data
  })
}

// 删除巡检内容模板和字典关联
export function delInspectionTemplateDict(id) {
  return request({
    url: '/unitManage/inspectionTemplateDict/' + id,
    method: 'delete'
  })
}

// 新增多条巡检内容模板和字典关联
export function addTemplateDicts(data) {
  return request({
    url: '/unitManage/inspectionTemplateDict/addTemplateDicts',
    method: 'post',
    data: data
  })
}
