import request from '@/utils/request'

// 查询电力区域列表
export function listArea(query) {
  return request({
    url: '/energy/area/list',
    method: 'get',
    params: query
  })
}

// 查询电力区域下拉树结构
export function areatreeselect(query) {
	return request({
		url: '/energy/area/treeselect',
		method: 'get',
		params: query
	})
}

// 查询电力区域详细
export function getArea(id) {
  return request({
    url: '/energy/area/' + id,
    method: 'get'
  })
}

// 新增电力区域
export function addArea(data) {
  return request({
    url: '/energy/area',
    method: 'post',
    data: data
  })
}

// 修改电力区域
export function updateArea(data) {
  return request({
    url: '/energy/area',
    method: 'put',
    data: data
  })
}

// 删除电力区域
export function delArea(id) {
  return request({
    url: '/energy/area/' + id,
    method: 'delete'
  })
}

// 根据数据查询数据
export function getFlag(query) {
  return request({
    url: '/energy/area/getFlag',
    method: 'get',
    params: query
  })
}
