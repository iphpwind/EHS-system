import request from '@/utils/request'

// 查询单元组织管理列表
export function listSection(query) {
  return request({
    url: '/unitManage/section/list',
    method: 'get',
    params: query
  })
}

// 查询单元组织管理详细
export function getSection(sectionId) {
  return request({
    url: '/unitManage/section/' + sectionId,
    method: 'get'
  })
}

// 查询组织下拉树结构
export function treeselect(query) {
	return request({
		url: '/unitManage/section/treeselect',
		method: 'get',
		params: query
	})
}

// 新增单元组织管理
export function addSection(data) {
  return request({
    url: '/unitManage/section',
    method: 'post',
    data: data
  })
}

// 修改单元组织管理
export function updateSection(data) {
  return request({
    url: '/unitManage/section',
    method: 'put',
    data: data
  })
}

// 删除单元组织管理
export function delSection(sectionId) {
  return request({
    url: '/unitManage/section/' + sectionId,
    method: 'delete'
  })
}
