import request from '@/utils/request'

// 查询设备列表
export function listEquipment(query) {
    return request({
        url: '/equipment/equipment/list',
        method: 'get',
        params: query
    })
}

// 查询设备详细
export function getEquipment(eqId) {
    return request({
        url: '/equipment/equipment/' + eqId,
        method: 'get'
    })
}

// 查询设备编码二维码图片
export function getErweima(eqId) {
    return request({
        url: '/equipment/equipment/getErweima/' + eqId,
        method: 'get'
    })
}

// 查询设备下拉树结构
export function treeselect(query) {
	return request({
		url: '/equipment/equipment/treeselect',
		method: 'get',
		params: query
	})
}

// 新增设备
export function addEquipment(data) {
    return request({
        url: '/equipment/equipment',
        method: 'post',
        data: data
    })
}

// 修改设备
export function updateEquipment(data) {
    return request({
        url: '/equipment/equipment',
        method: 'put',
        data: data
    })
}

// 删除设备
export function delEquipment(eqId) {
    return request({
        url: '/equipment/equipment/' + eqId,
        method: 'delete'
    })
}

// 新增点检记录
export function addSpotCheck(data) {
    return request({
        url: '/equipment/equipment/addSpotCheck',
        method: 'post',
        data: data
    })
}

// 新增点检记录
export function getTodayDataNum() {
    return request({
        url: '/equipment/equipment/getTodayDataNum',
        method: 'get'
    })
}
export function getCarbonAndAreaCountData() {
    return request({
        url: '/equipment/equipment/getCarbonAndAreaCountData',
        method: 'get'
    })
}