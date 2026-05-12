import request from '@/utils/request'

// 查询电力区域列表
export function allindex(line) {
  return request({
    url: '/jinhui-product/jinhui/index?lineNumber='+line,
    method: 'get',
  })
}

// 查询电力区域下拉树结构
export function detail(line) {
	return request({
		url: '/jinhui-product/jinhui/detail?lineNumber='+line,
		method: 'get',
	})
}

// 大屏数据展示
export function screen() {
	return request({
		url: '/jinhui-product/jinhui/screen',
		method: 'get',
	})
}

// 测点实时数据
export function getYcDataByName(name) {
	return request({
		url: '/jinhui-product/jinhui/getYcDataByName?name=' + name,
		method: 'get',
	})
}
