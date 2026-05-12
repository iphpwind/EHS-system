import request from '@/utils/request'

// 查询工业区域列表
export function listArea(query) {
  return request({
    url: '/industry/industryArea/list',
    method: 'get',
    params: query
  })
}

// 查询区域下拉树结构
export function treeselect(query) {
	return request({
		url: '/industry/industryArea/treeselect',
		method: 'get',
		params: query
	})
}

// 查询工业区域详细
export function getArea(id) {
  return request({
    url: '/industry/industryArea/' + id,
    method: 'get'
  })
}

// 新增工业区域
export function addArea(data) {
  return request({
    url: '/industry/industryArea',
    method: 'post',
    data: data
  })
}

// 修改工业区域
export function updateArea(data) {
  return request({
    url: '/industry/industryArea',
    method: 'put',
    data: data
  })
}

// 删除工业区域
export function delArea(id) {
  return request({
    url: '/industry/industryArea/' + id,
    method: 'delete'
  })
}

// 根据数据查询数据
export function getFlag(query) {
  return request({
    url: '/industry/industryArea/getFlag',
    method: 'get',
    params: query
  })
}
